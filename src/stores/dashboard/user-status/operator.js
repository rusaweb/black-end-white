import {defineStore} from "pinia";
import axios from "axios";
import {useTemplateStore} from "@/stores/template";
import {ref} from "vue";

export const useStatusStore = defineStore('status-operator', () => {
    const loading = ref(false)
    const status = ref(null)
    const status_default = ref(null)
    const statuses = ref(null)
    const url = '/api/v1/user-status/operator/'

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/user_status.md#administrator-get-users-statuses-list
    // Administrator Get Users Statuses List

    const getStatuses = async (args) => {
        loading.value = true
        try {
            statuses.value = (await axios.get(url + '?' + new URLSearchParams(args).toString())).data
        } catch (err) {
            throw new Error(err)
        } finally {
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/user_status.md#administrator-get-default-user-status
    // Administrator Get Default User Status

    const getStatusDefault = async () => {
        try {
            status_default.value = (await axios.get(url + 'default')).data
        } catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/user_status.md#administrator-get-user-status-by-id
    // Administrator Get User Status by ID

    const getStatus = async (id) => {
        try {
            status.value = (await axios.get(url + id)).data
        } catch (err) {
            throw new Error(err)
        }
    }



    return {
        getStatuses,
        getStatusDefault,
        getStatus,
        loading,
        status,
        status_default,
        statuses
    }
})
