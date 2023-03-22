import {defineStore} from "pinia";
import {ref} from "vue";
import axios from "axios";
import {useTemplateStore} from "@/stores/template";

export const useOrderIssuesCourierStore = defineStore( 'order-issue-courier', () => {
    const loading = ref(false)
    const orderIssuesById = ref(null)
    const orderIssuesByBagCode = ref(null)
    const orderIssues = ref(null)
    const store = useTemplateStore()
    const url = '/api/v1/order-issue/courier/'

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_issue_api.md#courier-get-order-issues-page
    // Courier Get Order Issues Page

    const getOrderIssues = async (id) => {
        loading.value = true
        try {
            orderIssues.value = (await axios.get(url + '?orderId='+id)).data
        }catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_issue_api.md#courier-get-order-issue-by-id
    // Courier Get Order Issue by ID

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

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_issue_api.md#courier-get-order-issue-by-bag-code
    // Courier Get Order Issue by Bag Code

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

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_issue_api.md#courier-handle-order-issue
    // Courier Handle Order Issue

    const handleOrderIssue = async (id) => {
        try {
            await axios.post(url + id + '/handle')
            await store.openToast('success')
        }catch (err) {
            await store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_issue_api.md#courier-un-handle-order-issue
    // Courier Un-Handle Order Issue

    const unHandleOrderIssue = async (id) => {
        try {
            await axios.delete(url + id + '/handle')
            await store.openToast('success')
        }catch (err) {
            await store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_issue_api.md#courier-begin-order-issue
    // Courier Begin Order Issue

    const beginOrderIssue = async (id) => {
        try {
            await axios.post(url + id + '/begin')
            await store.openToast('success')
        }catch (err) {
            await store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_issue_api.md#courier-add-order-issue-subscription
    // Courier Add Order Issue Subscription

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

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_issue_api.md#courier-update-order-issue-bag-code
    // Courier Update Order Issue Bag Code

    const updateOrderIssueBagCode = async (data) => {
        try {
            await axios.put(url + data.id + '/bag-code', data)
            await store.openToast('success')
        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_issue_api.md#courier-mark-order-issue-as-issued
    // Courier Mark Order Issue as Issued

    const markOrderIssueAsIssued = async (id) => {
        try {
            await axios.post(url + id + '/issued')
            await store.openToast('success')
        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }



    return {
        getOrderIssues,
        getOrderIssuesById,
        getOrderIssuesByBagCode,
        handleOrderIssue,
        unHandleOrderIssue,
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
