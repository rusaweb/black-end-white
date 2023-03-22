import {defineStore} from "pinia";
import {ref} from "vue";
import axios from "axios";
import {useTemplateStore} from "@/stores/template";
import {confirm} from "@/utils/confirm";

export const useAdditionalServiceAdministratorStore = defineStore('additional-service-administrator', () => {
    const loading = ref(false)
    const service = ref(null)
    const services = ref(null)
    const store = useTemplateStore()

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/additional_service_api.md#administrator-get-additional-service-by-id
    // Administrator Get Additional Service by ID

    const getAdditionalService = async (id) => {
        try {
            service.value = (await axios.get('/api/v1/additional-service/administrator/' + id)).data
        } catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/additional_service_api.md#administrator-get-additional-services-page
    // Administrator Get Additional Services Page

    const getAdditionalServiceList = async (args) => {
        loading.value = true
        try {
            services.value = (await axios.get('/api/v1/additional-service/administrator?' + new URLSearchParams(args).toString())).data
        } catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/additional_service_api.md#administrator-create-additional-service
    // Administrator Create Additional Service

    const createAdditionalService = async (data) => {
        try {
            await axios.post('/api/v1/additional-service/administrator', data)
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/additional_service_api.md#administrator-update-additional-service
    // Administrator Update Additional Service

    const updateAdditionalService = async (data) => {
        try {
            await axios.put('/api/v1/additional-service/administrator/' + data.id, data)
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/additional_service_api.md#administrator-stop-selling-additional-service
    // Administrator Stop Selling Additional Service

    const deleteAdditionalService = async (id, callback) => {
        try {
            confirm(async () => {
                await axios.delete('/api/v1/additional-service/administrator/' + id + '/selling')
                callback()
                await store.openToast('success')
            })
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/additional_service_api.md#administrator-start-selling-additional-service
    // Administrator Start Selling Additional Service

    const startAdditionalService = async (id) => {
        try {
            await axios.post('/api/v1/additional-service/administrator/' + id + '/selling')
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    return {
        getAdditionalService,
        getAdditionalServiceList,
        createAdditionalService,
        updateAdditionalService,
        deleteAdditionalService,
        startAdditionalService,
        service,
        services,
        loading
    }
})
