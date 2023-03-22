import {defineStore} from "pinia";
import {ref} from "vue";
import axios from "axios";
import {useTemplateStore} from "@/stores/template";
import {confirm} from "@/utils/confirm";

export const useAccessoryUserStore = defineStore('accessory-user', () => {
    const loading = ref(false)
    const accessory = ref(null)
    const accessories = ref(null)
    const store = useTemplateStore()
    const url = '/api/v1/order-accessory/user/'

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_accessory_api.md#operator-api
    // Operator Create Order Accessory

    const createAccessory = async (data) => {
        try {
            await axios.post(url, data)
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_accessory_api.md#operator-delete-order-accessory
    // Operator Delete Order Accessory

    const deleteAccessory = async (id, callback) => {
        try {
            confirm(async () => {
                await axios.delete(url + id)
                callback()
            })
        } catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_accessory_api.md#operator-get-order-accessory
    // Operator Get Order Accessory

    const getAccessory = async (id) => {
        loading.value = true
        try {
            accessory.value = await axios.get(url + id)
        } catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_accessory_api.md#operator-get-order-accessories-page
    // Operator Get Order Accessories Page

    const getAccessories = async (args) => {
        loading.value = true
        try {
            accessories.value = await axios.get(url + '?' + new URLSearchParams(args).toString())
        } catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    return {
        createAccessory,
        deleteAccessory,
        getAccessories,
        getAccessory,
        accessories,
        accessory,
        loading,
    }
})
