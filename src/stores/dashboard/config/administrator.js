import {defineStore} from "pinia";
import axios from "axios";
import {useTemplateStore} from "@/stores/template";

export const useAdminConfigStore = defineStore('config-administrator', () => {
    const store = useTemplateStore()
    const url = '/api/v1/config/administrator/'

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/config_api.md#administrator-update-immediate-order-multiply-percent-config
    // Administrator Update Immediate Order Multiply Percent Config
    const updatePercent = async (data) => {
        try {
            await axios.put(url + 'immediate-order-multiply-percent', data)
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/config_api.md#administrator-update-delivery-pricing-config
    // Administrator Update Delivery Pricing Config

    const updateDelivery = async (data) => {
        try {
            await axios.put(url + 'delivery-pricing', data)
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    return {
        updatePercent,
        updateDelivery,
    }
})
