import {defineStore} from "pinia";
import {ref} from "vue";
import axios from "axios";
import {useTemplateStore} from "@/stores/template";
import {confirm} from "@/utils/confirm";

export const useHangerStore = defineStore('order-hanger-administrator', () => {
    const loading = ref(false)
    const hanger = ref(null)
    const hanger_list = ref(null)
    const hanger_code = ref(null)
    const store = useTemplateStore()
    const url = '/api/v1/hanger/administrator/'

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/hanger_api.md#administrator-create-hanger
    // Administrator Create Hanger

    const createHanger = async (data) => {
        try {
            await axios.post(url, data)
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/hanger_api.md#administrator-update-hanger
    // Administrator Update Hanger

    const updateHanger = async (data) => {
        try {
            await axios.put(url + data.id, data)
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/hanger_api.md#administrator-get-hanger-by-id
    // Administrator Get Hanger by ID

    const getHanger = async (id) => {
        try {
            hanger.value = (await axios.get(url + id)).data
        } catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/hanger_api.md#administrator-get-hanger-by-id
    // Administrator Get Hanger by ID

    const getHangerCode = async (code) => {
        try {
            hanger_code.value = (await axios.get(url + 'code/' + code)).data
        } catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/hanger_api.md#administrator-get-hangers-page
    // Administrator Get Hangers Page

    const getHangerList = async (args) => {
        loading.value = true
        try {
            hanger_list.value = (await axios.get(url + '?' + new URLSearchParams(args).toString())).data
        } catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/hanger_api.md#administrator-delete-hanger
    // Administrator Delete Hanger

    const deleteHanger = async (id, callback) => {
        loading.value = true
        try {
            confirm(async () => {
                await axios.delete(url + id)
                callback()
            })
        } catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    return {
        createHanger,
        updateHanger,
        getHanger,
        getHangerCode,
        getHangerList,
        deleteHanger,
        loading,
        hanger,
        hanger_list,
        hanger_code,
    }
})
