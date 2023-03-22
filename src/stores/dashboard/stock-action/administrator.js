import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useStockActionAdministratorStore = defineStore('stock-action-administrator', () => {
    const loading = ref(false)
    const stocks = ref(null)

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/stock_action_api.md#administrator-get-stock-item-actions-page
    // Administrator Get Stock Item Actions Page

    const getStocks = async (args) => {
        loading.value = true
        try {
            stocks.value = (await axios.get('/api/v1/stock-action/administrator?' + new URLSearchParams(args).toString())).data
        } catch (err) {
            throw new Error(err)
        } finally {
            loading.value = false
        }
    }

    return {
        getStocks,
        loading,
        stocks,
    }
})
