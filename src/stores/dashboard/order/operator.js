import {defineStore} from "pinia";
import {ref} from "vue";
import axios from "axios";
import router from "../../../router";
import {useTemplateStore} from "@/stores/template";
import {confirm} from "@/utils/confirm";

export const useOrderOperatorStore = defineStore( 'order-operator', () => {
    const loading = ref(false)
    const store = useTemplateStore()
    const orders = ref(null)
    const order = ref(null)
    const orderByBagCode = ref(null)

    //https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#operator-create-order
    //Operator Create Order

    const createOrder = async (data) => {
        try {
            await axios.post('/api/v1/order/operator', data)
            await getOrderList()
            await store.openToast('success')
        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#operator-get-orders-list
    // Operator Get Orders List

    const getOrderList = async (args) => {
        try {
            loading.value = true
            orders.value = (await axios.get('/api/v1/order/operator?sort=created,desc&' + new URLSearchParams(args).toString())).data
        }catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#operator-get-order-by-id
    // Operator Get Order by ID

    const getOrder = async (id) => {
        try {
            order.value = (await axios.get('/api/v1/order/operator/' + id)).data
        }catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#operator-get-order-by-bag-code
    // Operator Get Order by Bag Code

    const getOrderByBagCode = async (id) => {
        try {
            orderByBagCode.value = (await axios.get('/api/v1/order/operator/bag-code/' + id)).data
        }catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#operator-upload-order-document
    // Operator Upload Order Document

    const createDocument = async (data) => {
        try {
            await axios.post('/api/v1/order/operator/' + data.get('id') +'/document', data)
            await store.openToast('success')
        }catch (err) {
            await store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_issue_api.md#operator-create-to-customer-extra-issue
    // Operator Create To Customer Extra Issue

    const deleteDocument = async (data, callback) => {
        try {
            confirm(async () => {
                await axios.delete('/api/v1/order/operator/' + data.order_id +'/document/' + data.id)
                await store.openToast('success')
                callback()
            })
        }catch (err) {
            await store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#operator-receive-order-in-department
    // Operator Receive Order in Department

    const receiveOrderInDepartment = async (data) => {
        try {
            await axios.put('/api/v1/order/operator/' + data.id + '/receive-in-department', data)
            await store.openToast('success')
        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#operator-update-order-desired-receive-delivery-time
    // Update Order Desired Receive Delivery Time
    const saveDeliveryTime = async (data) => {
        try {
            await axios.put('/api/v1/order/operator/' + data.id + '/desired-receive-delivery-time', data)
            await store.openToast('success')
        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#operator-update-order-desired-send-back-delivery-time
    // Update Order Desired Send Back Delivery Time

    const saveDeliveryTimeBack = async (data) => {
        try {
            await axios.put('/api/v1/order/operator/' + data.id + '/desired-send-back-delivery-time', data)
            await store.openToast('success')
        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#operator-mark-order-details-as-filled
    // Operator Mark Order Details as Filled

    const markOrderFilled = async (id) => {
        try {
            await axios.post('/api/v1/order/operator/' + id + '/mark-details-as-filled')
            await store.openToast('success')
        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // Operator Mark Order as Confirmed
    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#operator-mark-order-as-confirmed

    const markOrderConfirmed = async (id) => {
        try {
            await axios.post('/api/v1/order/operator/' + id + '/mark-as-confirmed')
        }catch (err) {
            throw new Error(err)
        }
    }

    // Operator Mark Order as Confirmed
    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#operator-mark-order-as-confirmed

    const startOrder = async (id) => {
        try {
            await axios.post('/api/v1/order/operator/' + id + '/begin-delivery')
            await store.openToast('success')
        }catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#cancel-order-1
    // Cancel Order

    const cancelOrder = async (id) => {
        try {
            await axios.post('/api/v1/order/operator/' + id + '/cancel')
            await router.push({name: 'order-operator'})
        }catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#operator-issue-order-back-to-user-in-department
    // Operator Issue Order back to User in Department

    const issueOrderBackToUser = async (data) => {
        try {
            await axios.post('/api/v1/order/operator/' + data.id + '/issue-back-to-client', data)
        }catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#apply-promo-code-to-order
    // Apply Promo Code to Order

    const savePromoCode = async (data) => {
        try {
            await axios.post('/api/v1/order/operator/' + data.id + '/apply-promocode?promoCode='+ data.promo_code)
            await store.openToast('success')
        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_issue_api.md#operator-update-order-issue-desired-delivery-time
    // desired-delivery-time update

    const updateDesiredDeliveryTime = async (data) => {
        try {
            await axios.put('/api/v1/order-issue/operator/' + data.id + '/desired-delivery-time', data.body)
            await store.openToast('success')
        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#apply-promo-code-to-order
    // Apply Promo Code to Order

    const saveDiscount = async (data) => {
        try {
            await axios.put('/api/v1/order/operator/' + data.id + '/discount', data)
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
            await axios.put('/api/v1/order/operator/' + data.id + '/deliver-to-address', data)
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
        getOrderByBagCode,
        saveDeliveryTime,
        saveDeliveryTimeBack,
        receiveOrderInDepartment,
        createDocument,
        deleteDocument,
        markOrderFilled,
        startOrder,
        markOrderConfirmed,
        cancelOrder,
        issueOrderBackToUser,
        savePromoCode,
        saveDiscount,
        updateDeliverToAddress,
        updateDesiredDeliveryTime,
        orderByBagCode,
        orders,
        order,
        loading,
    }
});
