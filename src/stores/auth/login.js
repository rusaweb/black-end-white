import {defineStore} from "pinia";
import router from "../../router";
import {ref} from "vue";
import axios from "axios";
import {removeCookie, setCookie} from "@/utils/cookie";
import {useUserStore} from "@/stores/dashboard/user/user";

export const useLoginStore = defineStore( 'login', () => {
    const loading = ref(false)
    const error = ref(false)
    const sms_token = ref(null)
    const auth = ref(null)
    const confirm = ref(null)
    const registration = ref(null)
    const registration_id = ref(null)
    const user = useUserStore()
    const sendPhoneNumber = async (data) => {
        try {
            sms_token.value = (await axios.post('/api/v1/oauth/send-verification-code', data, {
                headers: {
                    Authorization: null
                }
            })).data
        }catch (err) {
            throw new Error(err)
        }
    }
    const sendSmsCode = async (data) => {
        try {
            auth.value = (await axios.post('/api/v1/oauth/token?grant_type=password', {}, {
                headers: {Authorization: `Basic ${btoa(sms_token.value.code + ':' + data.code)}`}
            })).data
            setCookie('access_token', auth.value.access_token, auth.value.expires_in_seconds)
            setCookie('refresh_token', auth.value.refresh_token, auth.value.refresh_token_expires_in_seconds)
            axios.defaults.headers.common['Authorization'] = `Bearer ${auth.value.access_token}`
            await router.push({name: 'admin'})
            await user.getUser()
            sms_token.value = null
            auth.value = null
            registration.value = null
            registration_id.value = null
        }catch (err) {
            if (err.response.data.type === 'authentication.registration_required') {
                registration_id.value = err.response.data.registration_id
                sms_token.value = null
            }
            throw err
        }
    }
    const sendLimitedToken = async (token) => {
        try {
            confirm.value = (await axios.post('/api/v1/oauth/token?grant_type=limited_token&token=' + token, {}, {
                headers: {Authorization: null}
            })).data
            setCookie('access_token_limited', confirm.value.access_token, confirm.value.expires_in_seconds)
            setCookie('access_token', null, 0)
            setCookie('refresh_token', null, 0)
            axios.defaults.headers.common['Authorization'] = null
            axios.defaults.headers.common['Authorization-Limited'] = `Bearer ${confirm.value.access_token}`
            sms_token.value = null
            auth.value = null
            registration.value = null
            registration_id.value = null
        }catch (err) {
            console.log(err)
            throw err
        }
    }
    const sendRegistration = async (data) => {
        try {
            registration.value = (await axios.post('/api/v1/oauth/token?grant_type=registration', {...data, registration_id: registration_id.value})).data
            setCookie('access_token', registration.value.access_token, registration.value.expires_in_seconds)
            setCookie('refresh_token', registration.value.refresh_token, registration.value.refresh_token_expires_in_seconds)
            axios.defaults.headers.common['Authorization'] = `Bearer ${registration.value.access_token}`
            await router.push({name: 'admin'})
            await user.getUser()
            sms_token.value = null
            auth.value = null
            registration.value = null
            registration_id.value = null
        }catch (err) {
            if (err.response.data.type === 'authentication.registration_required') {
                registration_id.value = err.response.data.registration_id
                sms_token.value = null
            }
            throw err
        }
    }
    const logout = async () => {
        removeCookie('access_token')
        removeCookie('refresh_token')
        await user.clearProfileInfo()
        await router.push({name: 'login'})
    }

    return { sendPhoneNumber, sendSmsCode, sendRegistration, sendLimitedToken, sms_token, auth, registration_id, loading, error, logout, confirm }
});
