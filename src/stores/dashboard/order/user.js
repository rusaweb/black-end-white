import {defineStore} from "pinia";
import {ref} from "vue";
import axios from "axios";
import {useTemplateStore} from "@/stores/template";
import {confirm, confirmRobot} from "@/utils/confirm";

export const useOrderUserStore = defineStore( 'order-user', () => {
    const loading = ref(false)
    const error = ref(false)
    const orders = ref(null)
    const order = ref(null)
    const store = useTemplateStore()
    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#create-order
    // Create Order

    const createOrder = async (data) => {
        try {
            await axios.post('/api/v1/order/user', data)
            await getOrderList()
            await store.openToast('success')
        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }
    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#create-order
    // Create Order

    const createDocument = async (data) => {
        try {
            await axios.post('/api/v1/order/user/' + data.get('id') +'/document', data)
            await store.openToast('success')
        }catch (err) {
            await store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#get-orders-list
    // Get Orders List

    const getOrderList = async (args) => {
        loading.value = true
        try {
            orders.value = (await axios.get('/api/v1/order/user?sort=created,desc&' + new URLSearchParams(args).toString())).data
        }catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#get-order
    // Get Order

    const getOrder = async (id) => {
        try {
            loading.value = true
            order.value = (await axios.get('/api/v1/order/user/' + id)).data
        }catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#mark-order-as-confirmed
    // Mark Order as Confirmed

    const markOrderConfirmed = async (id) => {
        try {
            confirmRobot(async () => {
                await axios.post('/api/v1/order/user/' + id + '/confirm')
                await store.openToast('success')
                await getOrder(id)
            }, {
                text: "При подтверждении заказа начнется процесс чистки ваших вещей",
                confirmButtonText: "Да подтвердить",
                cancelButtonText: "Закрыть"
            })

        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#cancel-order
    // Cancel Order

    const cancelOrder = async (id) => {
        try {
            confirm(async () => {
                await axios.post('/api/v1/order/user/' + id + '/cancel')
                await getOrder(id)
                await store.openToast('success')
            }, {
                text: "При отмены заказа статус заказа не получится изменить",
                confirmButtonText: "Да отменить",
                cancelButtonText: "Закрыть"
            })
        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#update-order-receive-from-address
    // Update Order Receive From Address

    const updateOrderReceiveFromAddress = async (data) => {
        try {
            await axios.put('/api/v1/order/user/' + data.id + '/receive-from-address', data)
            await getOrder(data.id)
            await store.openToast('success')
        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#update-order-deliver-to-address
    // Update Order Deliver To Address

    const updateOrderDeliverToAddress = async (data) => {
        try {
            await axios.put('/api/v1/order/user/' + data.id + '/deliver-to-address', data)
            await getOrder(data.id)
            await store.openToast('success')
        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#update-order-desired-receive-delivery-time
    // Update Order Desired Receive Delivery Time

    const saveDeliveryTime = async (data) => {
        try {
            await axios.put('/api/v1/order/user/' + data.id + '/desired-receive-delivery-time', data)
            await store.openToast('success')
        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#update-order-desired-send-back-delivery-time
    // Update Order Desired Send Back Delivery Time

    const saveDeliveryTimeBack = async (data) => {
        try {
            await axios.put('/api/v1/order/user/' + data.id + '/desired-send-back-delivery-time', data)
            await store.openToast('success')
        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#apply-promo-code-to-order
    // Apply Promo Code to Order

    const savePromoCode = async (data) => {
        try {
            await axios.post('/api/v1/order/user/' + data.id + '/apply-promocode?promoCode='+ data.promo_code)
            await store.openToast('success')
        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#update-order-deliver-to-address
    // Update Order Deliver To Address

    const updateDeliverToAddress = async (data) => {
        try {
            await axios.put('/api/v1/order/user/' + data.id + '/deliver-to-address', data)
            await store.openToast('success')
        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    return {
        createOrder,
        getOrderList,
        getOrder,
        markOrderConfirmed,
        cancelOrder,
        updateOrderReceiveFromAddress,
        updateOrderDeliverToAddress,
        saveDeliveryTime,
        saveDeliveryTimeBack,
        savePromoCode,
        updateDeliverToAddress,
        createDocument,
        orders,
        order,
        loading,
        error
    }
});
