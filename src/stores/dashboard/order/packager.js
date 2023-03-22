import {defineStore} from "pinia";
import {ref} from "vue";
import axios from "axios";

export const useOrderPackagerStore = defineStore( 'order-packager', () => {
    const loading = ref(false)
    const order = ref(null)
    const orders = ref(null)

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#packager-get-orders
    // Packager Get Orders

    const getOrders = async () => {
        loading.value = true
        try {
            orders.value = (await axios.get('/api/v1/order/packager')).data
        }catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_api.md#packager-get-order-item-by-code
    // Packager Get Order by ID

    const getOrder = async (id) => {
        try {
            order.value = (await axios.get('/api/v1/order/packager/' + id)).data
        }catch (err) {
            throw err.response
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_api.md#packager-get-order-by-bag-code
    // Packager Get Order by Bag Code

    const getOrderByCode = async (code) => {
        try {
            order.value = (await axios.get('/api/v1/order/packager/bag-code/' + code)).data
        }catch (err) {
            throw new Error(err)
        }
    }


    return {
        getOrders,
        getOrder,
        getOrderByCode,
        loading,
        order,
        orders,
    }
});
