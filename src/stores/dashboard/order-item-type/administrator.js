import {defineStore} from "pinia";
import {ref} from "vue";
import axios from "axios";
import {useTemplateStore} from "@/stores/template";

export const useOrderItemTypeAdministratorStore = defineStore('order-item-type-administrator', () => {
    const loading = ref(false)
    const orderItemType = ref(null)
    const orderItemTypes = ref(null)
    const disabled = ref(false)
    const store = useTemplateStore()

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_type_api.md#administrator-create-order-item-type
    // Administrator Create Order Item Type

    const createOrderItemType = async (data) => {
        try {
            await axios.post('/api/v1/order-item-type/administrator', data)
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_type_api.md#administrator-update-order-item-type
    // Administrator Update Order Item Type

    const updateOrderItemType = async (data) => {
        try {
            await axios.put('/api/v1/order-item-type/administrator/' + data.id, data)
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_type_api.md#administrator-get-order-item-type
    // Administrator Get Order Item Type

    const getOrderItemType = async (id) => {
        try {
            orderItemType.value = (await axios.get('/api/v1/order-item-type/administrator/' + id)).data
        } catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_type_api.md#administrator-get-order-item-types-list
    // Administrator Get Order Item Types List

    const getOrderItemTypes = async (args) => {
        loading.value = true
        try {
            orderItemTypes.value = (await axios.get('/api/v1/order-item-type/administrator?' + new URLSearchParams(args).toString())).data
        } catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    return {
        createOrderItemType,
        updateOrderItemType,
        getOrderItemType,
        getOrderItemTypes,
        loading,
        orderItemType,
        orderItemTypes,
        disabled
    }
})
