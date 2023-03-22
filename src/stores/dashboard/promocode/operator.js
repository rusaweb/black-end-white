import {defineStore} from "pinia";
import {ref} from "vue";
import axios from "axios";
import {useTemplateStore} from "@/stores/template";
import {confirm} from "@/utils/confirm";

export const usePromoCodeStore = defineStore('order-promo_code-operator', () => {
    const loading = ref(false)
    const promo_code = ref(null)
    const promo_code_list = ref(null)
    const promo_code_code = ref(null)
    const store = useTemplateStore()
    const url = '/api/v1/promocode/operator/'

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/promocode_api.md#operator-create-promo-code
    // Operator Create Promo Code

    const createPromoCode = async (data) => {
        try {
            await axios.post(url, data)
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/promocode_api.md#operator-update-promo-code
    // Operator Update Promo Code

    const updatePromoCode = async (data) => {
        try {
            await axios.put(url + data.id, data)
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/promocode_api.md#operator-get-promo-code
    // Operator Get Promo Code

    const getPromoCode = async (id) => {
        try {
            promo_code.value = (await axios.get(url + id)).data
        } catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/promocode_api.md#operator-get-promo-codes-list
    // Operator Get Promo Codes List

    const getPromoCodeList = async (args) => {
        loading.value = true
        try {
            promo_code_list.value = (await axios.get(url + '?' + new URLSearchParams(args).toString())).data
        } catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/promocode_api.md#operator-delete-promo-code
    // Operator Delete Promo Code

    const deletePromoCode = async (id, callback) => {
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
        createPromoCode,
        updatePromoCode,
        getPromoCode,
        getPromoCodeList,
        deletePromoCode,
        loading,
        promo_code,
        promo_code_list,
        promo_code_code,
    }
})
