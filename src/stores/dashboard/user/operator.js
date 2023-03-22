import {ref} from "vue";
import axios from "axios";
import {confirm} from "@/utils/confirm";
import {defineStore} from "pinia";
import {useTemplateStore} from "@/stores/template";
import router from "@/router";

export const useUserOperatorStore = defineStore('user-operator', () => {
    const loading = ref(false)
    const error = ref(false)
    const user = ref(null)
    const users = ref(null)
    const store = useTemplateStore()

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/user_api.md#operator-get-user-by-id
    // Operator Get User by id

    const getUserById = async (id) => {
        loading.value = true
        try {
            user.value = (await axios.get('/api/v1/user/operator/' + id)).data
        } catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/user_api.md#administrator-get-user-by-id
    // Administrator Get User By Id

    const getUserDiscountCard = async (id) => {
        loading.value = true
        try {
            user.value = (await axios.get('/api/v1/user/operator/discount-card/' + id)).data
        } catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/user_api.md#operator-get-users-list
    // Operator Get Users List

    const getUsersList = async (args) => {
        loading.value = true
        try {
            users.value = (await axios.get('/api/v1/user/operator?onlyWithoutRoles=true&' + new URLSearchParams(args).toString())).data
        } catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/user_api.md#operator-create-user
    // Operator Create User

    const createUser = async (data, callback) => {
        try {
            await axios.post('/api/v1/user/operator', data)
            await getUsersList(router.currentRoute.value.query)
            await callback()
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/user_api.md#operator-update-user
    // Operator Update User

    const updateUser = async (data) => {
        try {
            await axios.put('/api/v1/user/operator/' + data.id, data)
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/user_api.md#operator-update-user-password
    // Operator Update User Password

    const updateUserPassword = async (data) => {
        try {
            await axios.put('/api/v1/user/operator/' + data.id + '/password', data)
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/user_api.md#operator-create-user-address
    // Operator Update User Password

    const createUserAddress = async (data) => {
        try {
            await axios.post('/api/v1/user/operator/' + data.id + '/address', data)
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/user_api.md#operator-upload-user-document
    // Operator Upload User Document

    const uploadDocument = async (data) => {
        try {
            await axios.post('/api/v1/user/operator/' + user.value.id + '/documents?file_name=' + data.get('file_name'), data)
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/user_api.md#operator-delete-user-address
    // Operator Delete User Address

    const deleteUserAddress = async ({id, addressId}) => {
        try {
            confirm(async () => {
                await axios.delete('/api/v1/user/operator/' + id + '/address/' + addressId)
                await getUserById(id)
                await store.openToast('success')
            })
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }



    return {
        getUserById,
        getUsersList,
        createUser,
        updateUser,
        updateUserPassword,
        createUserAddress,
        uploadDocument,
        deleteUserAddress,
        getUserDiscountCard,
        user,
        users,
        loading,
        error
    }
});
