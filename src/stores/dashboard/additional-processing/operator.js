import {defineStore} from "pinia";
import {ref} from "vue";
import axios from "axios";

export const useAdditionalProcessingStore = defineStore('order-item-additional-processing', () => {
    const loading = ref(false)
    const processing = ref(null)
    const processing_list = ref(null)

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_additional_service_api.md#get-order-item-additional-service-by-id
    // Get Order Item Additional Service by ID

    const getAdditionalProcessing = async (id) => {
        try {
            processing.value = (await axios.get('/api/v1/order-item-additional-service/' + id)).data
        } catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_additional_service_api.md#get-order-item-additional-services-page
    // Get Order Item Additional Services Page

    const getAdditionalProcessingList = async (args) => {
        loading.value = true
        try {
            processing_list.value = (await axios.get('/api/v1/order-item-additional-service?' + new URLSearchParams(args).toString())).data
        } catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }


    return {
        getAdditionalProcessing,
        getAdditionalProcessingList,
        processing,
        processing_list,
        loading
    }
})
