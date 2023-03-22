import {defineStore} from "pinia";
import {ref} from "vue";
import axios from "axios";

export const useOrderItemTypeOperatorStore = defineStore('order-item-type-operator', () => {
    const loading = ref(false)
    const orderItemType = ref(null)
    const orderItemTypes = ref(null)

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_type_api.md#operator-get-order-item-type
    // Operator Get Order Item Type

    const getOrderItemType = async (data) => {
        try {
            orderItemType.value = (await axios.get('/api/v1/order-item-type/operator/' + data.id)).data
        } catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_type_api.md#operator-get-order-item-types-list
    // Operator Get Order Item Types List

    const getOrderItemTypes = async (args) => {
        loading.value = true
        try {
            orderItemTypes.value = (await axios.get('/api/v1/order-item-type/operator?' + new URLSearchParams(args).toString())).data
        } catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    return {
        getOrderItemType,
        getOrderItemTypes,
        loading,
        orderItemType,
        orderItemTypes,
    }
})
