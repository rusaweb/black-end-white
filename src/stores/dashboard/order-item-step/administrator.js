import {defineStore} from "pinia";
import {ref} from "vue";
import axios from "axios";
import {useTemplateStore} from "@/stores/template";
import {confirm} from "@/utils/confirm";

export const useOrderItemStepAdministratorStore = defineStore('order-item-step-administrator', () => {
    const loading = ref(false)
    const orderItemStep = ref(null)
    const orderItemSteps = ref(null)
    const store = useTemplateStore()

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_step_api.md#administrator-create-order-item-step
    // Administrator Create Order Item Step

    const createOrderItemStep = async (data) => {
        try {
            await axios.post('/api/v1/order-item-step/administrator', data)
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_step_api.md#administrator-update-order-item-step
    // Administrator Update Order Item Step

    const updateOrderItemStep = async (data) => {
        try {
            await axios.put('/api/v1/order-item-step/administrator/' + data.id, data)
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_step_api.md#administrator-get-order-item-step
    // Administrator Get Order Item Step

    const getOrderItemStep = async (id) => {
        try {
            orderItemStep.value = (await axios.get('/api/v1/order-item-step/administrator/' + id)).data
        } catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_step_api.md#administrator-get-order-item-steps-list
    // Administrator Get Order Item Steps List

    const getOrderItemSteps = async (args) => {
        loading.value = true
        try {
            orderItemSteps.value = (await axios.get('/api/v1/order-item-step/administrator?' + new URLSearchParams(args).toString())).data
        } catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_step_api.md#administrator-delete-order-item-step
    // Administrator Delete Order Item Step

    const deleteOrderItemStep = async (id, callback) => {
        loading.value = true
        try {
            confirm(async () => {
                await axios.delete('/api/v1/order-item-step/administrator/' + id)
                callback()
            })
        } catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    return {
        createOrderItemStep,
        updateOrderItemStep,
        getOrderItemStep,
        getOrderItemSteps,
        deleteOrderItemStep,
        loading,
        orderItemStep,
        orderItemSteps,
    }
})
