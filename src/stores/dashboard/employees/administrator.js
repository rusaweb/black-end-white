import {ref} from "vue";
import axios from "axios";
import {confirm} from "@/utils/confirm";
import {defineStore} from "pinia";
import {useTemplateStore} from "@/stores/template";
import router from "@/router";

export const useEmployeesAdministratorStore = defineStore('employees-administrator', () => {
    const loading = ref(false)
    const error = ref(false)
    const user = ref(null)
    const users = ref(null)
    const store = useTemplateStore()

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/user_api.md#administrator-get-user-by-id
    // Administrator Get User By Id

    const getUserById = async (id) => {
        loading.value = true
        try {
            user.value = (await axios.get('/api/v1/user/administrator/' + id)).data
        } catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/user_api.md#administrator-get-users-list
    // Administrator Get Users List

    const getUsersList = async (args) => {
        loading.value = true
        try {
            users.value = (await axios.get('/api/v1/user/administrator?onlyWithRoles=true&' + new URLSearchParams(args).toString())).data
        } catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/user_api.md#administrator-create-user
    // Administrator Create User

    const createUser = async (data, callback) => {
        try {
            await axios.post('/api/v1/user/administrator', data)
            await getUsersList(router.currentRoute.value.query)
            await callback()
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/user_api.md#administrator-update-user
    // Administrator Update User

    const updateUser = async (data) => {
        try {
            await axios.put('/api/v1/user/administrator/' + data.id, data)
            await getUsersList(router.currentRoute.value.query)
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/user_api.md#administrator-update-user-password
    // Administrator Update User Password

    const updateUserPassword = async (data) => {
        try {
            await axios.put('/api/v1/user/administrator/' + data.id + '/password', data)
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/user_api.md#administrator-delete-user
    // Administrator Delete User

    const deleteUser = async (id, callback) => {
        try {
            confirm(async () => {
                await axios.delete('/api/v1/user/administrator/' + id)
                await store.openToast('success')
                callback()
            })
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/user_api.md#administrator-create-user-address
    // Administrator Create User Address

    const createUserAddress = async (data) => {
        try {
            await axios.post('/api/v1/user/administrator/' + data.id + '/address', data)
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/user_api.md#administrator-delete-user-address
    // Administrator Delete User Address

    const deleteUserAddress = async ({id, addressId}) => {
        try {
            confirm(async () => {
                await axios.delete('/api/v1/user/administrator/' + id + '/address/' + addressId)
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
        deleteUser,
        createUserAddress,
        deleteUserAddress,
        user,
        users,
        loading,
        error
    }
});
