import {defineStore} from "pinia";
import {ref} from "vue";
import axios from "axios";
import {useTemplateStore} from "@/stores/template";
import {confirm} from "@/utils/confirm";

export const useOrderIssuesUserStore = defineStore( 'order-issue-user', () => {
    const loading = ref(false)
    const orderIssuesById = ref(null)
    const orderIssues = ref(null)
    const store = useTemplateStore()
    const url = '/api/v1/order-issue/user/'
    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_issue_api.md#get-order-issues-page
    // Get Order Issues Page

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

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_issue_api.md#get-order-issue-by-id
    // Get Order Issue by ID

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

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_issue_api.md#create-to-customer-extra-issue
    // Create To Customer Extra Issue

    const createExtraIssue = async (data) => {
        try {
            await axios.post(url + 'extra-to-customer-issue', data)
            await store.openToast('success')
        }catch (err) {
            await store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_issue_api.md#cancel-to-customer-extra-issue
    // Cancel To Customer Extra Issue

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

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_issue_api.md#update-order-issue-address
    // Update Order Issue Address

    const updateOrderIssueAddress = async (data) => {
        try {
            await axios.put(url + data.id + '/address', data)
            await store.openToast('success')
        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_issue_api.md#update-order-issue-desired-delivery-time
    // Update Order Issue Desired Delivery Time

    const updateOrderIssueDesiredDeliveryTime = async (data) => {
        try {
            await axios.put(url + data.id + '/desired-delivery-time', data)
            await store.openToast('success')
        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }


    return {
        getOrderIssues,
        getOrderIssuesById,
        createExtraIssue,
        cancelExtraIssue,
        updateOrderIssueAddress,
        updateOrderIssueDesiredDeliveryTime,
        loading,
        orderIssuesById,
        orderIssues,
    }
});
