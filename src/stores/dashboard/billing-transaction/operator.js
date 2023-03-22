import {ref} from "vue";
import axios from "axios";
import {defineStore} from "pinia";
import {useTemplateStore} from "@/stores/template";

export const useBillingTransactionOperatorStore = defineStore('billing-transaction', () => {
    const loading = ref(false)
    const billing = ref([])
    const store = useTemplateStore()

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/billing_transaction_api.md#operator-get-billing-transactions
    // Operator Get Billing Transactions

    const getBilling = async (id) => {
        loading.value = true
        try {
            billing.value = (await axios.get('/api/v1/billing-transaction/operator?orderId=' + id)).data
        } catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/billing_transaction_api.md#operator-create-billing-transaction
    // Operator Create Billing Transaction

    const createBilling = async (data) => {
        loading.value = true
        try {
            await axios.post('/api/v1/billing-transaction/operator/order/' + data.id, data)
            await store.openToast('success')
        } catch (err) {
            await store.openToast('error')
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }



    return {
        getBilling,
        createBilling,
        billing,
        loading,
    }
});
