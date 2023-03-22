import {defineStore} from "pinia";
import {ref} from "vue";
import axios from "axios";

export const useAccessoryStore = defineStore('accessory', () => {
    const loading = ref(false)
    const accessory = ref(null)
    const accessories = ref(null)
    const url = '/api/v1/accessory/'

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/accessory_api.md#get-accessory-by-id
    // Get Accessory by ID

    const getAccessory = async (id) => {
        loading.value = true
        try {
            accessory.value = (await axios.get(url + id)).data
        } catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/accessory_api.md#get-accessories-page
    // Get Accessories Page

    const getAccessories = async (args) => {
        loading.value = true
        try {
            accessories.value = (await axios.get(url + '?' + new URLSearchParams(args).toString())).data
        } catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    return {
        getAccessories,
        getAccessory,
        accessories,
        accessory,
        loading,
    }
})
