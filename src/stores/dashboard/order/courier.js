import {defineStore} from "pinia";
import {ref} from "vue";
import axios from "axios";
import router from "../../../router";
import {useTemplateStore} from "@/stores/template";

export const useOrderCourierStore = defineStore( 'order-courier', () => {
    const loading = ref(false)
    const orders = ref(null)
    const order = ref(null)
    const user = ref(null)
    const store = useTemplateStore()
    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#courier-get-waiting-for-receive-orders
    // Courier Get Waiting For Receive Orders

    const getOrderListWaiting = async (args) => {
        try {
            loading.value = true
            orders.value = (await axios.get('/api/v1/order/courier/waiting-for-courier/?' + new URLSearchParams(args).toString())).data
        }catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#courier-get-waiting-for-send-back-orders
    // Courier Get Waiting For Send Back Orders

    const getOrderListWaitingBack = async (args) => {
        try {
            loading.value = true
            orders.value = (await axios.get('/api/v1/order/courier/waiting-for-send-back/?' + new URLSearchParams(args).toString())).data
        }catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#courier-get-order-by-id
    // Courier Get Order by ID

    const getOrder = async (id) => {
        try {
            order.value = (await axios.get('/api/v1/order/courier/' + id)).data
        }catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#courier-get-order-by-bag-code
    // Courier Get Order by Bag Code

    const getOrderByBagCode = async (code) => {
        try {
            order.value = (await axios.get('/api/v1/order/courier/bag-code' + code)).data
        }catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#courier-handle-order-delivery-to-receive-from-customer
    // Courier Handle Order Delivery to Receive from Customer

    const handleOrderDelivery = async (id) => {
        try {
            await axios.post('/api/v1/order/courier/' + id + '/handle-for-receive')
            await store.openToast('success')
        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#courier-mishandle-order-delivery-from-receive-from-customer
    // Courier Mishandle Order Delivery from Receive from Customer

    const mishandleOrderDelivery = async (id) => {
        try {
            await axios.post('/api/v1/order/courier/' + id + '/mishandle-for-receive')
            await store.openToast('success')
        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#courier-handle-order-delivery-to-send-back-to-customer
    // Courier Handle Order Delivery to Send Back to Customer

    const handleBackOrderDelivery = async (id) => {
        try {
            await axios.post('/api/v1/order/courier/' + id + '/handle-for-send-back')
            await store.openToast('success')
        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#courier-handle-order-delivery-to-send-back-to-customer
    // Courier Handle Order Delivery to Send Back to Customer

    const mishandleBackOrderDelivery = async (id) => {
        try {
            await axios.post('/api/v1/order/courier/' + id + '/mishandle-for-send-back')
            await store.openToast('success')
        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#courier-add-order-received-bag-code
    // Courier Add Order Received Bag Code

    const setBagCode = async ({id, code}) => {
        try {
            await axios.put('/api/v1/order/courier/' + id + '/received-bag-code', {received_bag_code: code})
            await store.openToast('success')
        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#courier-add-order-on-receive-subscription
    // Courier Add Order on receive Subscription

    const setSignature = async ({id, code}) => {
        try {
            await axios.put('/api/v1/order/courier/' + id + '/on-receive-subscription',  code, {
                headers: {
                    "Content-Type": "text/plain"
                }
            })
            await store.openToast('success')
        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#courier-add-order-on-receive-back-subscription
    // Courier Add Order on receive Subscription

    const setSignatureBack = async ({id, code}) => {
        try {
            await axios.put('/api/v1/order/courier/' + id + '/on-receive-back-subscription',  code, {
                headers: {
                    "Content-Type": "text/plain"
                }
            })
            await store.openToast('success')
        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#courier-mark-order-as-delivered
    // Courier Mark Order as Delivered

    const deliveredOrder = async (id) => {
        try {
            await axios.post('/api/v1/order/courier/' + id + '/mark-as-delivered')
            await router.push({name: 'get-order-courier'})
            await store.openToast('success')
        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#courier-mark-order-as-delivered
    // Courier Get User by Order ID

    const getUserByOrderId = async (id) => {
        try {
            user.value = (await axios.get('/api/v1/user/courier/by-order/' + id )).data
        }catch (err) {
            throw new Error(err)
        }
    }

    return {
        getOrderListWaiting,
        getOrderListWaitingBack,
        getOrder,
        getOrderByBagCode,
        handleOrderDelivery,
        mishandleOrderDelivery,
        handleBackOrderDelivery,
        mishandleBackOrderDelivery,
        setBagCode,
        setSignature,
        setSignatureBack,
        deliveredOrder,
        getUserByOrderId,
        orders,
        user,
        order,
        loading
    }
});
