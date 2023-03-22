import axios from "axios";
import {defineStore} from "pinia";
import { print } from "@/utils/print";

export const useBillingUserStore = defineStore(  {
    id: 'user-billing',
    state: () => ({
        loading: false,
        payment: [],
        billing: null
    }),
   actions: {
       // // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_billing_api.md#operator-get-order-billing-details
       // // Operator Get Order Billing Details
       // async getPayment()  {
       //     this.loading = true
       //     try {
       //         this.payment = (await axios.get('/api/v1/config/user/payme')).data
       //     } catch (err) {
       //         throw new Error(err)
       //     } finally {
       //         this.loading = false
       //     }
       // },
       // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_billing_api.md#operator-get-order-billing-details
       // Operator Get Order Billing Details

       async getBilling(id, printing) {
           this.loading = true
           try {
               this.billing = (await axios.get('/api/v1/order-billing/user/' + id)).data
               if (printing){
                   print(this.billing)
               }
           } catch (err) {
               throw new Error(err)
           } finally {
               this.loading = false
           }
       },
   },
});
