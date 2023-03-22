import {defineStore} from "pinia";
import {ref} from "vue";
import axios from "axios";
import {useTemplateStore} from "@/stores/template";
import {confirm} from "@/utils/confirm";

export const useAdditionalServiceOperatorStore = defineStore('order-additional-service-operator', () => {
    const loading = ref(false)
    const service = ref(null)
    const services = ref(null)
    const store = useTemplateStore()
    const url = '/api/v1/order-additional-service/operator/'

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_additional_service_api.md#operator-create-order-additional-service
    // Operator Create Order Additional Service

    const createAdditionalService = async (data) => {
        try {
            await axios.post(url, data)
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_additional_service_api.md#operator-delete-order-additional-service
    // Operator Delete Order Additional Service

    const deleteAdditionalService = async (id, callback) => {
        try {
            confirm(async () => {
                await axios.delete(url + id)
                callback()
            })
        } catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_additional_service_api.md#operator-get-order-additional-service
    // Operator Get Order Additional Service

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

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_additional_service_api.md#operator-get-order-additional-services-page
    // Operator Get Order Additional Services Page

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
        createAdditionalService,
        deleteAdditionalService,
        getAdditionalService,
        getAdditionalServices,
        service,
        services,
        loading,
    }
})
