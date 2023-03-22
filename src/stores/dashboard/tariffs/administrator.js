import {defineStore} from "pinia";
import axios from "axios";
import {useTemplateStore} from "@/stores/template";
import {ref} from "vue";
import {confirm} from "@/utils/confirm";

export const useTariffsStore = defineStore('tariffs-administrator', () => {
    const store = useTemplateStore()
    const url = '/api/v1/order-tariff/administrator/'
    const tariff = ref(null)
    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_tariff_api.md#administrator-create-order-tariff
    // Administrator Create Order Tariff

    const createTariff = async (data) => {
        try {
            tariff.value = (await axios.post(url, data)).data
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_tariff_api.md#administrator-update-order-tariff
    // Administrator Update Order Tariff

    const updateTariff = async (data) => {
        try {
            await axios.put(url + data.id, data)
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_tariff_api.md#administrator-upload-order-tariff-icon
    // Administrator Upload Order Tariff Icon

    const uploadTariffIcon = async (data, callback) => {
        try {
            await axios.post(url + data.get('id') + '/icon' , data)
            await store.openToast('success')
            if (callback) {
                callback()
            }
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_tariff_api.md#administrator-upload-order-tariff-icon
    // Administrator Delete Order Tariff Icon

    const deleteIcon = async (id, callback) => {
        try {
            confirm(async () => {
                await axios.delete(url + id + '/icon')
                await store.openToast('success')
                callback()
            })
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    return {
        createTariff,
        updateTariff,
        uploadTariffIcon,
        deleteIcon,
        tariff,
    }
})
