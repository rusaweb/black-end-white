import {defineStore} from "pinia";
import {ref} from "vue";
import axios from "axios";
import {useTemplateStore} from "@/stores/template";
import {confirm} from "@/utils/confirm";

export const useAdditionalProcessingAdministratorStore = defineStore('order-item-additional-processing-administrator', () => {
    const loading = ref(false)
    const processing = ref(null)
    const processing_list = ref(null)
    const store = useTemplateStore()

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_type_api.md#administrator-get-order-item-type
    // Administrator Get Order Item Type

    const getAdditionalProcessing = async (id) => {
        try {
            processing.value = (await axios.get('/api/v1/order-item-additional-service/administrator/' + id)).data
        } catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_type_api.md#administrator-get-order-item-types-list
    // Administrator Get Order Item Types List

    const getAdditionalProcessingList = async (args) => {
        loading.value = true
        try {
            processing_list.value = (await axios.get('/api/v1/order-item-additional-service/administrator?' + new URLSearchParams(args).toString())).data
        } catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_additional_service_api.md#administrator-create-order-item-additional-service
    // Administrator Create Order Item Additional Service

    const createAdditionalProcessing = async (data) => {
        try {
            await axios.post('/api/v1/order-item-additional-service/administrator', data)
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_additional_service_api.md#administrator-update-order-item-additional-service
    // Administrator Update Order Item Additional Service

    const updateAdditionalProcessing = async (data) => {
        try {
            await axios.put('/api/v1/order-item-additional-service/administrator/' + data.id, data)
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_additional_service_api.md#administrator-delete-order-item-additional-service
    // Administrator Delete Order Item Additional Service

    const deleteAdditionalProcessing = async (id, callback) => {
        try {
            confirm(async () => {
                await axios.delete('/api/v1/order-item-additional-service/administrator/' + id)
                callback()
                await store.openToast('success')
            })
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }
    // getAdditionalService,
    // getAdditionalServices,
    // createAdditionalService,
    // updateAdditionalService,
    // deleteAdditionalService,
    // service,
    // services,

    return {
        getAdditionalProcessing,
        getAdditionalProcessingList,
        createAdditionalProcessing,
        updateAdditionalProcessing,
        deleteAdditionalProcessing,
        processing,
        processing_list,
        loading
    }
})
