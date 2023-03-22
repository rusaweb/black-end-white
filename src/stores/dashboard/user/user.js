import {ref} from "vue";
import axios from "axios";
import {confirm} from "@/utils/confirm";
import {defineStore} from "pinia";
import {useTemplateStore} from "@/stores/template";

export const useUserStore = defineStore('user', () => {
    const loading = ref(false)
    const error = ref(false)
    const user = ref(null)
    const store = useTemplateStore()

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/user_api.md#create-profile
    // Create Profile

    const createUser = async (data, callback) => {
        try {
            await axios.post('/api/v1/user/profile', data)
            await callback()
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/user_api.md#get-profile
    // Get Profile

    const getUser = async () => {
        try {
            loading.value = true
            user.value = (await axios.get('/api/v1/user/profile')).data
        } catch (err) {
            throw new Error(err)
        } finally {
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/user_api.md#update-profile-username
    // Update Profile Username

    const updateProfileUsername = async (data) => {
        try {
            await axios.post('/api/v1/user/profile/username', data)
            await getUser()
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/user_api.md#update-profile-password
    // Update Profile Password

    const updateProfilePassword = async (data) => {
        try {
            await axios.post('/api/v1/user/profile/password', data)
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/user_api.md#update-profile-data
    // Update Profile Data

    const updateProfileData = async (data) => {
        try {
            await axios.put('/api/v1/user/profile', data)
            await getUser()
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/user_api.md#delete-profile
    // Delete Profile

    const deleteProfile = async (id) => {
        try {
            confirm(async () => {
                await axios.delete('/api/v1/user/profile/' + id)
                await store.openToast('success')
            })
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/user_api.md#create-address
    // Create Address

    const createAddress = async (data) => {
        try {
            await axios.post('/api/v1/user/profile/address', data)
            await getUser()
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }


    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/user_api.md#delete-address
    // Delete Address

    const deleteAddress = async (id) => {
        try {
            confirm(async () => {
                await axios.delete('/api/v1/user/profile/address/' + id)
                await getUser()
                await store.openToast('success')
            })
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }


    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/user_api.md#delete-address
    // Delete Address

    const clearProfileInfo = async () => {
        user.value = null
    }

    return {
        createUser,
        getUser,
        updateProfileUsername,
        updateProfilePassword,
        updateProfileData,
        deleteProfile,
        createAddress,
        deleteAddress,
        clearProfileInfo,
        user,
        loading,
        error
    }
});
