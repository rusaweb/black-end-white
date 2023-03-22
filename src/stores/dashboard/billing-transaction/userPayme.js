import axios from "axios";
import { defineStore } from "pinia";

export const usePaymeUserStore = defineStore(  {
    id: 'user-payme',
    state: () => ({
        loading: false,
        payme: []
    }),
    actions: {
        // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_billing_api.md#operator-get-order-billing-details
        // Operator Get Order Billing Details
        async getPayme()  {
            this.loading = true
            try {
                this.payme = (await axios.get('/api/v1/config/user/payme')).data
            } catch (err) {
                throw new Error(err)
            } finally {
                this.loading = false
            }
        },
    },
});
