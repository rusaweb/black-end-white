import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { useTemplateStore } from "@/stores/template";
import { confirm } from "@/utils/confirm";

export const useStockAdministratorStore = defineStore('stock-administrator', () => {
    const loading = ref(false)
    const stock = ref(null)
    const stocks = ref(null)
    const store = useTemplateStore()

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_item_type_api.md#administrator-create-order-item-type
    // Administrator Create Stock Item

    const createStock = async (data) => {
        try {
            await axios.post('/api/v1/stock/administrator', data)
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/stock_api.md#administrator-update-stock-item
    // Administrator Update Stock Item

    const updateStock = async (data) => {
        try {
            await axios.put('/api/v1/stock/administrator/' + data.id, data)
            await store.openToast('success')
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/stock_api.md#administrator-delete-stock-item
    // Administrator Delete Stock Item

    const deleteStock = async (id, callback) => {
        try {
            confirm(async () => {
                await axios.delete('/api/v1/stock/administrator/' + id)
                await store.openToast('success')
                callback()
            })
        } catch (err) {
            store.openToast('error')
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/stock_api.md#administrator-get-stock-item
    // Administrator Get Stock Item

    const getStock = async (id) => {
        try {
            stock.value = (await axios.get('/api/v1/stock/administrator/' + id)).data
        } catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/stock_api.md#administrator-get-stock-items-page
    // Administrator Get Stock Items Page

    const getStocks = async (args) => {
        loading.value = true
        try {
            stocks.value = (await axios.get('/api/v1/stock/administrator?' + new URLSearchParams(args).toString())).data
        } catch (err) {
            throw new Error(err)
        } finally {
            loading.value = false
        }
    }

    return {
        createStock,
        updateStock,
        deleteStock,
        getStock,
        getStocks,
        loading,
        stock,
        stocks,
    }
})
