import {defineStore} from "pinia";
import {ref} from "vue";
import axios from "axios";

export const useConfigStore = defineStore('config-public', () => {
    const percent = ref(null)
    const delivery = ref(null)
    const url = '/api/v1/config/'


    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_tariff_api.md#get-order-tariff
    // Get Order Tariff


    const getPercent = async () => {
        try {
            percent.value = (await axios.get(url + 'immediate-order-multiply-percent')).data
        } catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_tariff_api.md#get-order-tariff-list
    // Get Order Tariff List

    const getDelivery = async () => {
        try {
            delivery.value = (await axios.get(url + 'delivery-pricing')).data
        } catch (err) {
            throw new Error(err)
        }
    }

    return {
        getPercent,
        getDelivery,
        percent,
        delivery,
    }
})
