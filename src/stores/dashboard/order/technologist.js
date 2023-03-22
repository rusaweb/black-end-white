import {defineStore} from "pinia";
import {ref} from "vue";
import axios from "axios";
import {useTemplateStore} from "@/stores/template";

export const useOrderTechnologistStore = defineStore( 'order-technologist', () => {
    const loading = ref(false)
    const orders = ref(null)
    const order = ref(null)
    const orderBagCode = ref(null)
    const store = useTemplateStore()

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#technologist-get-orders
    // Technologist Get Orders

    const getOrderList = async () => {
        try {
            loading.value = true
            orders.value = (await axios.get('/api/v1/order/technologist')).data
        }catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#technologist-get-order-by-id
    // Technologist Get Order by Id

    const getOrder = async (id) => {
        try {
            loading.value = true
            order.value = (await axios.get('/api/v1/order/technologist/' + id)).data
        }catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#technologist-get-order-by-bag-code
    // Technologist Get Order by Bag Code

    const getOrderByBagCode = async (bagCode) => {
        try {
            loading.value = true
            orderBagCode.value = (await axios.get('/api/v1/order/technologist/bag-code/' + bagCode)).data
        }catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#technologist-specify-order-send-back-bag-code
    // Technologist Specify Order Send Back Bag Code

    const sendBackBagCode = async (data) => {
        try {
            await axios.put('/api/v1/order/technologist/' + data.id + '/specify-send-back-bag-code', data)
            store.openToast('success')
        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#technologist-specify-order-send-back-bag-code
    // Technologist Mark Order as Packaged

    const markOrderAsPackaged = async (id) => {
        try {
            await axios.post('/api/v1/order/technologist/' + id + '/mark-as-packaged')
            store.openToast('success')
        }catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }


    return {
        getOrderList,
        getOrder,
        getOrderByBagCode,
        sendBackBagCode,
        markOrderAsPackaged,
        orders,
        order,
        orderBagCode,
        loading,
    }
});
