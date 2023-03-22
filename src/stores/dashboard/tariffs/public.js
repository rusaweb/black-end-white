import {defineStore} from "pinia";
import {ref} from "vue";
import axios from "axios";

export const useTariffsPublicStore = defineStore('tariffs-public', () => {
    const loading = ref(false)
    const tariff = ref(null)
    const tariffs = ref(null)
    const disabled = ref(false)
    const url = '/api/v1/order-tariff/'


    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_tariff_api.md#get-order-tariff
    // Get Order Tariff


    const getTariff = async (id) => {
        try {
            tariff.value = (await axios.get(url + id)).data
        } catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_tariff_api.md#get-order-tariff-list
    // Get Order Tariff List

    const getTariffs = async (args) => {
        loading.value = true
        try {
            tariffs.value = (await axios.get(url + '?' + new URLSearchParams(args).toString())).data
        } catch (err) {
            throw new Error(err)
        } finally {
            loading.value = false
        }
    }

    return {
        getTariff,
        getTariffs,
        loading,
        tariff,
        tariffs,
        disabled
    }
})
