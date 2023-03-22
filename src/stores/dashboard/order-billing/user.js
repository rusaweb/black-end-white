import {ref} from "vue";
import axios from "axios";
import {defineStore} from "pinia";
import {print} from "@/utils/print";
import {useOrderOperatorStore} from "@/stores/dashboard/order/operator";
import {useTariffsPublicStore} from "@/stores/dashboard/tariffs/public";
import {useUserOperatorStore} from "@/stores/dashboard/user/operator";
import {useOrderUserStore} from "@/stores/dashboard/order/user";
import {useUserStore} from "@/stores/dashboard/user/user";

export const useBillingUserStore = defineStore('user-billing', () => {
    const loading = ref(false)
    const billing = ref([])
    const orderStore = useOrderUserStore()
    const tariffStore = useTariffsPublicStore()
    const userStore = useUserStore()
    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_billing_api.md#operator-get-order-billing-details
    // Operator Get Order Billing Details

    const getBilling = async (id, printing) => {
        loading.value = true
        try {
            billing.value = (await axios.get('/api/v1/order-billing/user/' + id)).data
            await userStore.getUser()
            if (printing){
                print({...billing.value[0], ...orderStore.order, current_tariff: tariffStore.tariff, user: userStore.user})
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
