import {defineStore} from "pinia";
import {ref} from "vue";
import axios from "axios";
import {useTemplateStore} from "@/stores/template";

export const useOrderItemTechnologistStore = defineStore( 'order-item-technologist', () => {
    const loading = ref(false)
    const orderItems = ref(null)
    const orderItemsHangerCode = ref(null)
    const orderItem = ref(null)
    const history = ref(null)
    const store = useTemplateStore()

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_api.md#technologist-update-order-item
    // Technologist Update Order Item

    const updateOrderItem = async (id) => {
        try {
            await axios.put('/api/v1/order-item/technologist/' + id)
            store.openToast('success')
        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_api.md#technologist-move-order-item-to-next-step
    // Technologist Move Order Item to next Step

    const nextStep = async (id) => {
        try {
            await axios.post('/api/v1/order-item/technologist/' + id + '/move-to-next-step')
            store.openToast('success')
        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_api.md#technologist-update-order-item-hanger-code
    // Technologist Update Order Item Hanger Code

    const updateHangerCode = async (data) => {
        try {
            await axios.put('/api/v1/order-item/technologist/' + data.id + '/hanger-code', data)
            store.openToast('success')
        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_api.md#technologist-add-self-step-to-history-of-order-item
    // Technologist Add Self Step to History of Order Item

    const addSelfStep = async (id) => {
        try {
            await axios.post('/api/v1/order-item/technologist/' + id + '/add-self-step')
            store.openToast('success')
        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_api.md#technologist-mark-order-item-as-ready
    // Technologist Mark Order Item as Ready

    const ready = async (id) => {
        try {
            await axios.post('/api/v1/order-item/technologist/' + id + '/ready')
            store.openToast('success')
        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_api.md#technologist-get-order-item-by-id
    // Technologist Get Order Item by Id

    const getOrderItemById = async (id) => {
        try {
            orderItem.value = (await axios.get('/api/v1/order-item/technologist/' + id)).data
        }catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_api.md#technologist-get-order-item-by-code
    // Technologist Get Order Item by Code

    const getOrderItemByCode = async (code) => {
        try {
            orderItem.value = (await axios.get('/api/v1/order-item/technologist/code/' + code)).data
        }catch (err) {
            throw err.response
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_api.md#technologist-get-order-items-by-order-identifier
    // Technologist Get Order Items by Order Identifier

    const getOrderItemsById = async (id) => {
        loading.value = true
        try {
            orderItems.value = (await axios.get('/api/v1/order-item/technologist?order_id=' + id)).data
        }catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_api.md#technologist-get-order-items-by-hanger-code
    // Technologist Get Order Items by Hanger Code

    const getOrderItemsByHangerCode = async (id) => {
        loading.value = true
        try {
            orderItemsHangerCode.value = (await axios.get('/api/v1/order-item/technologist?order_id=' + id)).data
        }catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }



    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_api.md#technologist-get-global-order-items-steps-history
    // Operator Get Global Order Items Steps History

    const getGlobalStepsHistory = async (args) => {
        loading.value = true
        try {
            history.value = (await axios.get('/api/v1/order-item/technologist/global-step-history?' + new URLSearchParams(args).toString())).data
        } catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }


    return {
        updateOrderItem,
        nextStep,
        updateHangerCode,
        ready,
        getOrderItemById,
        getOrderItemByCode,
        getOrderItemsById,
        getOrderItemsByHangerCode,
        addSelfStep,
        getGlobalStepsHistory,
        orderItems,
        orderItemsHangerCode,
        orderItem,
        history,
        loading,
    }
});
