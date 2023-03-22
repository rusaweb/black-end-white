import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useStockTechnologistStore = defineStore('stock-technologist', () => {
    const loading = ref(false)
    const stock = ref(null)
    const stocks = ref(null)

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/stock_api.md#technologist-get-stock-item
    // Technologist Get Stock Item

    const getStock = async (id) => {
        try {
            stock.value = (await axios.get('/api/v1/stock/technologist/' + id)).data
        } catch (err) {
            throw new Error(err)
        }
    }


    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/stock_api.md#technologist-get-stock-items-page
    // Technologist Get Stock Items Page

    const getStocks = async (args) => {
        loading.value = true
        try {
            stocks.value = (await axios.get('/api/v1/stock/technologist?' + new URLSearchParams(args).toString())).data
        } catch (err) {
            throw new Error(err)
        } finally {
            loading.value = false
        }
    }

    return {
        getStock,
        getStocks,
        loading,
        stock,
        stocks,
    }
})
