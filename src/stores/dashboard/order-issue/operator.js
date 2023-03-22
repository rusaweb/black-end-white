import {defineStore} from "pinia";
import {ref} from "vue";
import axios from "axios";
import {useTemplateStore} from "@/stores/template";
import {confirm} from "@/utils/confirm";

export const useOrderIssuesOperatorStore = defineStore( 'order-issue-operator', () => {
    const loading = ref(false)
    const orderIssuesById = ref(null)
    const orderIssuesByBagCode = ref(null)
    const orderIssues = ref(null)
    const store = useTemplateStore()
    const url = '/api/v1/order-issue/operator/'
    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_issue_api.md#operator-get-order-issues-page
    // Operator Get Order Issues Page

    const getOrderIssues = async (id) => {
        loading.value = true
        try {
            orderIssues.value = (await axios.get(url + '?size=50&orderId='+id)).data
        }catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_issue_api.md#operator-get-order-issue-by-id
    // Operator Get Order Issue by ID

    const getOrderIssuesById = async (id) => {
        loading.value = true
        try {
            orderIssuesById.value = (await axios.get(url + id)).data
        }catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_issue_api.md#operator-get-order-issue-by-bag-code
    // Operator Get Order Issue by Bag Code

    const getOrderIssuesByBagCode = async (code) => {
        loading.value = true
        try {
            orderIssuesByBagCode.value = (await axios.get(url + 'bag-code/' + code)).data
        }catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_issue_api.md#operator-create-to-customer-extra-issue
    // Operator Create To Customer Extra Issue

    const createExtraIssue = async (data) => {
        try {
            await axios.post(url + 'extra-to-customer-issue', data)
            await store.openToast('success')
        }catch (err) {
            await store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_issue_api.md#operator-cancel-to-customer-extra-issue
    // Operator Cancel To Customer Extra Issue

    const cancelExtraIssue = async (id) => {
        try {
            confirm(async () => {
                await axios.delete(url + 'extra-to-customer-issue/'+ id)
                await store.openToast('success')
            }, {
                text: "При отмены заказа статус заказа не получится изменить",
                confirmButtonText: "Да отменить",
                cancelButtonText: "Закрыть"
            })
        }catch (err) {
            await store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_issue_api.md#operator-update-order-issue-address
    // Operator Update Order Issue Address

    const updateOrderIssueAddress = async (data) => {
        try {
            await axios.put(url + data.id + '/address', data)
            await store.openToast('success')
        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_issue_api.md#operator-update-order-issue-desired-delivery-time
    // Operator Update Order Issue Desired Delivery Time

    const updateOrderIssueDesiredDeliveryTime = async (data) => {
        try {
            await axios.put(url + data.id + '/desired-delivery-time', data)
            await store.openToast('success')
        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_issue_api.md#operator-begin-order-issue
    // Operator Begin Order Issue

    const beginOrderIssue = async (id) => {
        try {
            await axios.post(url + id + '/begin')
            await store.openToast('success')
        }catch (err) {
            await store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_issue_api.md#operator-add-order-issue-subscription
    // Operator Add Order Issue Subscription

    const addOrderIssueSubscription = async (data) => {
        try {
            await axios.put(url + data.id + '/subscription',  data.code, {
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

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_issue_api.md#operator-update-order-issue-bag-code
    // Operator Update Order Issue Bag Code

    const updateOrderIssueBagCode = async (data) => {
        try {
            await axios.put(url + data.id + '/bag-code', data)
            await store.openToast('success')
        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_issue_api.md#operator-mark-order-issue-as-issued
    // Operator Mark Order Issue as Issued

    const markOrderIssueAsIssued = async (id) => {
        try {
            await axios.post(url + id + '/issued')
            await store.openToast('success')
        }catch (err) {
            store.openToast('error')
            throw err
        }
    }


    return {
        getOrderIssues,
        getOrderIssuesById,
        getOrderIssuesByBagCode,
        createExtraIssue,
        cancelExtraIssue,
        updateOrderIssueAddress,
        updateOrderIssueDesiredDeliveryTime,
        beginOrderIssue,
        addOrderIssueSubscription,
        updateOrderIssueBagCode,
        markOrderIssueAsIssued,
        loading,
        orderIssuesById,
        orderIssuesByBagCode,
        orderIssues,
    }
});
