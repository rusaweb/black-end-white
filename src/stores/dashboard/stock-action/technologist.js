import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import router from "@/router";

export const useStockActionTechnologistStore = defineStore('stock-action-technologist', () => {
    const loading = ref(false)
    const stocks = ref(null)
    const stock_amount = ref(null)

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/stock_action_api.md#technologist-create-stock-item-action
    // Technologist Create Stock Item Action

    const createStock = async (data) => {
        try {
            await axios.post('/api/v1/stock-action/technologist', data)
        } catch (err) {
            throw new Error(err)
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/stock_action_api.md#technologist-get-stock-item-actions-page
    // Technologist Get Stock Item Actions Page

    const getStocks = async (args) => {
        loading.value = true
        try {
            stocks.value = (await axios.get('/api/v1/stock-action/technologist?' + new URLSearchParams(args).toString())).data
        } catch (err) {
            throw new Error(err)
        } finally {
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/stock_api.md#technologist-get-stock-item
    // Technologist Get Stock Item Remaining Amount

    const getStockAmount = async (id) => {
        try {
            stock_amount.value = (await axios.get('/api/v1/stock-action/technologist/remaining-amount?stock_item_id=' + id)).data
        } catch (err) {
            throw new Error(err)
        }
    }

    return {
        createStock,
        getStocks,
        getStockAmount,
        loading,
        stocks,
        stock_amount,
    }
})
