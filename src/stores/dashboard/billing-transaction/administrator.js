import {ref} from "vue";
import axios from "axios";
import {defineStore} from "pinia";

export const useBillingTransactionAdministratorStore = defineStore('billing-transaction-admin', () => {
    const loading = ref(false)
    const billing = ref([])

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/billing_transaction_api.md#operator-get-billing-transactions
    // Operator Get Billing Transactions

    const getBilling = async (args) => {
        loading.value = true
        try {
            billing.value = (await axios.get('/api/v1/billing-transaction/administrator?' + new URLSearchParams(args).toString())).data
        } catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }



    return {
        getBilling,
        billing,
        loading,
    }
});
