import {defineStore} from "pinia";
import {ref} from "vue";
import axios from "axios";
import {useTemplateStore} from "@/stores/template";

export const useOrderItemPackagerStore = defineStore( 'order-item-packager', () => {
    const loading = ref(false)
    const orderItems = ref(null)
    const orderItemsHangerCode = ref(null)
    const orderItem = ref(null)
    const store = useTemplateStore()



    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_api.md#packager-get-order-item-by-id
    // Packager Get Order Item by ID

    const getOrderItemById = async (id) => {
        try {
            orderItem.value = (await axios.get('/api/v1/order-item/packager/' + id)).data
        }catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_api.md#packager-get-order-item-by-code
    // Packager Get Order Item by Code

    const getOrderItemByCode = async (code) => {
        try {
            orderItem.value = (await axios.get('/api/v1/order-item/packager/code/' + code)).data
        }catch (err) {
            throw err.response
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_api.md#packager-get-order-items-by-order-identifier
    // Packager Get Order Items by Order Identifier

    const getOrderItemsById = async (id) => {
        loading.value = true
        try {
            orderItems.value = (await axios.get('/api/v1/order-item/packager?order_id=' + id)).data
        }catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_api.md#packager-get-order-items-by-hanger
    // Packager Get Order Items by Hanger

    const getOrderItemsByHangerCode = async (id) => {
        loading.value = true
        try {
            orderItemsHangerCode.value = (await axios.get('/api/v1/order-item/packager?order_id=' + id)).data
        }catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_api.md#packager-update-order-item-code
    // Packager Update Order Item Code

    const updateOrderItemCode = async (data) => {
        try {
            await axios.put('/api/v1/order-item/packager/' + data.id + '/code', data)
            store.openToast('success')
        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_api.md#packager-move-order-item-to-packaging
    // Packager Move Order Item to Packaging

    const moveOrderItemPackaging = async (id) => {
        try {
            await axios.post('/api/v1/order-item/packager/' + id + '/move-to-packaging')
            store.openToast('success')
        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }



    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_api.md#packager-mark-order-item-as-ready
    // Packager Mark Order Item as Ready

    const ready = async (id) => {
        try {
            await axios.post('/api/v1/order-item/packager/' + id + '/ready')
            store.openToast('success')
        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_api.md#packager-update-order-item-hanger
    // Packager Update Order Item Hanger

    const updateHanger = async (data) => {
        try {
            await axios.put('/api/v1/order-item/packager/' + data.id + '/hanger', data)
            store.openToast('success')
        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }


    return {
        getOrderItemById,
        getOrderItemByCode,
        getOrderItemsById,
        getOrderItemsByHangerCode,
        updateOrderItemCode,
        moveOrderItemPackaging,
        ready,
        updateHanger,
        orderItems,
        orderItemsHangerCode,
        orderItem,
        loading,
    }
});
