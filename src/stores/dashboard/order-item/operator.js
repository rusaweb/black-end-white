import {defineStore} from "pinia";
import {ref} from "vue";
import axios from "axios";
import {useTemplateStore} from "@/stores/template";
import {confirm} from "@/utils/confirm";

export const useOrderItemOperatorStore = defineStore('order-item-operator', () => {
    const loading = ref(false)
    const orderItems = ref(null)
    const orderItemsHangerCode = ref(null)
    const orderItem = ref(null)
    const orderItemCode = ref(null)
    const history = ref(null)
    const store = useTemplateStore()
    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_api.md#operator-create-order-item
    // Operator Create Order Item

    const createOrderItem = async (data, images) => {
        try {
            const {id} = (await axios.post('/api/v1/order-item/operator', data)).data
            if (images.length){
                images.map(async image => {
                    const formData = new FormData()
                    formData.append('image', image.file)
                    await axios.post('/api/v1/order-item/operator/' + id + "/image", formData, {
                        headers: {
                            "Content-Type":" multipart/form-data"
                        }
                    })
                })
            }
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }
    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_api.md#operator-mark-order-item-as-reviewed
    // Operator Mark Order Item as Reviewed

    const markOrderItemReviewed = async (id) => {
        try {
            await axios.post('/api/v1/order-item/operator/'+ id +'/reviewed')
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_api.md#operator-update-order-item
    // Operator Update Order Item

    const updateOrderItem = async (data) => {
        try {
            await axios.put('/api/v1/order-item/operator/' + data.id, data)
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_api.md#operator-update-order-item
    // Operator Update Order Item

    const updateOrderItemType = async (data) => {
        try {
            await axios.put('/api/v1/order-item/operator/' + data.id + '/type?type_id='+ data.type_id)
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_api.md#operator-get-order-item-by-id
    // Operator Get Order Item by Id

    const getOrderItemById = async (id) => {
        try {
            orderItem.value = (await axios.get('/api/v1/order-item/operator/' + id)).data
        } catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_api.md#operator-get-order-item-by-code
    // Operator Get Order Item by Code

    const getOrderItemByCode = async (code) => {
        try {
            orderItemCode.value = (await axios.get('/api/v1/order-item/operator/code/' + code)).data
        } catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_api.md#operator-get-order-items-by-order-identifier
    // Operator Get Order Items by Order Identifier

    const getOrderItemsById = async (id, status) => {
        try {
            orderItems.value = (await axios.get('/api/v1/order-item/operator?order_id=' + id + (status ? ('&status=' + status) : ''))).data
        } catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_api.md#operator-get-order-items-by-hanger-code
    // Operator Get Order Items by Hanger Code

    const getOrderItemsByHangerCode = async (hangerCode) => {
        try {
            orderItemsHangerCode.value = (await axios.get('/api/v1/order-item/operator/hanger-code/' + hangerCode)).data
        } catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_api.md#operator-delete-order-item
    // Operator Delete Order Item

    const deleteItemImage = async ({id, imgId}, callback) => {
        try {
            confirm(async () => {
                await axios.delete('/api/v1/order-item/operator/' + id + '/image/' + imgId)
                callback()
            })
        } catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_api.md#operator-delete-order-item
    // Operator Delete Order Item

    const deleteOrderItems = async (id, callback) => {
        try {
            confirm(async () => {
                await axios.delete('/api/v1/order-item/operator/' + id)
                callback()
            })
        } catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_api.md#operator-get-global-order-items-steps-history
    // Operator Get Global Order Items Steps History

    const getGlobalStepsHistory = async (args) => {
        loading.value = true
        try {
            history.value = (await axios.get('/api/v1/order-item/operator/global-step-history?' + new URLSearchParams(args).toString())).data
        } catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }


    return {
        createOrderItem,
        markOrderItemReviewed,
        updateOrderItem,
        updateOrderItemType,
        getOrderItemById,
        getOrderItemByCode,
        getOrderItemsById,
        getOrderItemsByHangerCode,
        deleteItemImage,
        deleteOrderItems,
        getGlobalStepsHistory,
        loading,
        orderItems,
        orderItemsHangerCode,
        orderItem,
        history,
        orderItemCode
    }
})
