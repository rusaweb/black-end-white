import {defineStore} from "pinia";
import {ref} from "vue";
import axios from "axios";

export const useAdditionalService = defineStore('additional-service', () => {
    const loading = ref(false)
    const service = ref(null)
    const services = ref(null)
    const url = '/api/v1/additional-service'

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/additional_service_api.md#get-additional-service-by-id
    // Get Additional Service by ID

    const getAdditionalService = async (id) => {
        loading.value = true
        try {
            service.value = (await axios.get(url + id)).data
        } catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/additional_service_api.md#get-additional-services-page
    // Get Additional Services Page

    const getAdditionalServices = async (args) => {
        loading.value = true
        try {
            services.value = (await axios.get(url + '?' + new URLSearchParams(args).toString())).data
        } catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    return {
        getAdditionalService,
        getAdditionalServices,
        service,
        services,
        loading,
    }
})
