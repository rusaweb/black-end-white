import {defineStore} from "pinia";
import {ref} from "vue";
import axios from "axios";

export const useOrderItemUserStore = defineStore( 'order-item-user', () => {
    const loading = ref(false)
    const orderItems = ref(null)
    const orderItem = ref(null)

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_api.md#get-order-items-by-order-identifier
    // Get Order Items by Order Identifier

    const getOrderItems = async (id) => {
        loading.value = true
        try {
            orderItems.value = (await axios.get('/api/v1/order-item/user?order_id=' + id)).data
        }catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_api.md#get-order-item
    // Get Order Item

    const getOrderItem = async (id) => {
        try {
            orderItem.value = (await axios.get('/api/v1/order-item/user/' + id)).data
        }catch (err) {
            throw new Error(err)
        }
    }

    return {
        getOrderItems,
        getOrderItem,
        orderItems,
        orderItem,
        loading,
    }
});
