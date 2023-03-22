import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useAdminAnalytics = defineStore('analytics-administrator', () => {
    const loading = ref(false)
    const analytics = ref(null)

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/money_analytics_api.md#administrator-get-money-analytics
    // Administrator Get Money Analytics

    const getAnalytics = async (args) => {
        loading.value = true
        try {
            analytics.value = (await axios.get('/api/v1/money-analytics/administrator?currency=UZS&' + new URLSearchParams(args).toString())).data
        } catch (err) {
            throw new Error(err)
        } finally {
            loading.value = false
        }
    }

    return {
        getAnalytics,
        loading,
        analytics,
    }
})
