import {ref} from "vue";
import axios from "axios";
import {defineStore} from "pinia";
import {print} from "@/utils/print";
import {useOrderOperatorStore} from "@/stores/dashboard/order/operator";
import {useTariffsPublicStore} from "@/stores/dashboard/tariffs/public";
import {useUserOperatorStore} from "@/stores/dashboard/user/operator";
import {printReceipt} from "@/utils/printReceipt";
import {useOrderItemOperatorStore} from "@/stores/dashboard/order-item/operator";
import {useUserStore} from "@/stores/dashboard/user/user";
import {useOrderIssuesOperatorStore} from "@/stores/dashboard/order-issue/operator";
import {useConfigStore} from "@/stores/dashboard/config/public";

export const useBillingOperatorStore = defineStore('operator-billing', () => {
    const loading = ref(false)
    const billing = ref([])
    const orderItemsStore = useOrderItemOperatorStore()
    const orderIssuesStore = useOrderIssuesOperatorStore()
    const orderStore = useOrderOperatorStore()
    const tariffStore = useTariffsPublicStore()
    const userStore = useUserOperatorStore()
    const profileStore = useUserStore()
    const config = useConfigStore()
    // https://gitlab.com/bozziuz/black-n-white/black-n-white-backend/-/blob/main/api/order_billing_api.md#operator-get-order-billing-details
    // Operator Get Order Billing Details

    const getBilling = async (id, printing) => {
        loading.value = true
        try {
            billing.value = (await axios.get('/api/v1/order-billing/operator/' + id)).data
            if (printing){
                print({...billing.value[0], ...orderStore.order, current_tariff: tariffStore.tariff, user: userStore.user})
            }
        } catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }
    const getBillingReceipt = async (id, printing) => {
        loading.value = true
        try {
            billing.value = (await axios.get('/api/v1/order-billing/operator/' + id)).data
            if (printing) {
                printReceipt({
                    ...billing.value[0],
                    order_items: orderItemsStore.orderItems.content,
                    ...orderStore.order,
                    current_tariff: tariffStore.tariff,
                    user: userStore.user,
                    profile: profileStore.user,
                    delivery: {
                        issues: orderIssuesStore.orderIssues.content,
                        ...config.delivery
                    }
                })
            }
        } catch (err) {
            throw new Error(err)
        }finally {
            loading.value = false
        }
    }



    return {
        getBilling,
        getBillingReceipt,
        billing,
        loading,
    }
});
