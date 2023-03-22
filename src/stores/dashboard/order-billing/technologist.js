import {ref} from "vue";
import axios from "axios";
import {defineStore} from "pinia";
import {print} from "@/utils/print";

export const useBillingTechnologistStore = defineStore('technologist-billing', () => {
    const loading = ref(false)
    const billing = ref([])

    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_billing_api.md#operator-get-order-billing-details
    // Operator Get Order Billing Details

    const getBilling = async (id, printing) => {
        loading.value = true
        try {
            billing.value = (await axios.get('/api/v1/order-billing/technologist/' + id)).data
            if (printing){
                print(billing.value)
            }
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
