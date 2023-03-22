<template>
  <BaseBlock title="Информация по цене" v-if="billing && billing.items && billing.items.length && delivery">
    <template #content>
      <div class="block-content mb-3 block-content-full">
        <div class="table-responsive">
          <table class="table table-bordered table-striped table-vcenter">
            <thead>
              <tr>
                <th>Название</th>
<!--                <th>Цена</th>-->
<!--                <th>Процент за тариф</th>-->
                <th class="text-end">Общая цена</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in billing.items" :key="item.id">
                <td class="bg-body">{{ item.name }}</td>
<!--                <td class="bg-body">{{ item.price.amount.toLocaleString('ru-RU') }} сум</td>-->
<!--                <td class="bg-body">+{{ item.price_percent_multiplier }}%</td>-->
                <td class="bg-body text-end">{{ item.total_amount.toLocaleString('ru-RU') }} сум</td>
              </tr>
            </tbody>
          </table>
          <table class="table table-bordered table-striped table-vcenter">
            <tbody>
<!--              <tr>-->
<!--                <td class="bg-body"><p class="mb-0">Общая стоимость вещей</p></td>-->
<!--                <td class="text-end bg-body">{{billing.items.map(e => e.total_amount).reduce((accumulator, currentValue) => accumulator + currentValue, 0)}} сум</td>-->
<!--              </tr>-->
              <tr v-if="user && user.status.order_total_amount_discount_percent">
                <td class="bg-body"><p class="mb-0">Скидка за статус клиента</p></td>
                <td class="text-end bg-body">‹‹{{user.status.name}}›› -{{user.status.order_total_amount_discount_percent}}%</td>
              </tr>
              <tr v-if="order && order.discount.promo_code_discount_percent">
                <td class="bg-body"><p class="mb-0">Скидка по промокоду</p></td>
                <td class="text-end bg-body"> -{{order.discount.promo_code_discount_percent}} %</td>
              </tr>
              <tr v-if="billing.immediate_order_additional_percent">
                <td class="bg-body"><p class="mb-0">Срочно</p></td>
                <td class="text-end bg-body">+{{ billing.immediate_order_additional_percent }}%</td>
              </tr>
              <tr v-if="billing.issues.reduce((accumulator, currentValue) => accumulator.amount || 0 + currentValue.amount || 0, 0) > 0">
                <td class="bg-body"><p class="mb-0">Доставка</p></td>
                <td class="text-end bg-body">{{ billing.issues.reduce((accumulator, currentValue) => accumulator.amount || 0 + currentValue.amount || 0, 0).toLocaleString('Ru-ru') }} сум</td>
              </tr>
              <tr v-for="item in billing.issues.filter(e => e.type === 'FROM_DEPARTMENT_TO_CUSTOMER_EXTRA')" :key="item">
                <td class="bg-body"><p class="mb-0">Доставка к клиенту дополнительно</p></td>
                <td class="text-end bg-body">{{ item.amount.toLocaleString('Ru-ru') }} сум</td>
              </tr>
<!--              <tr>-->
<!--                <td class="bg-body"><p class="mb-0">Сумма без скидки</p></td>-->
<!--                <td class="text-end bg-body">{{ billing.total_amount_without_discount.toLocaleString('Ru-ru') }} сум</td>-->
<!--              </tr>-->
              <tr v-if="billing.discount_amount > 0">
                <td class="bg-body"><p class="mb-0">Сумма скидки</p></td>
                <td class="text-end bg-body">{{ billing.discount_amount.toLocaleString('Ru-ru') }} сум</td>
              </tr>
              <tr>
                <td class="bg-body"><p class="mb-0">Оплачено</p></td>
                <td class="text-end bg-body">= {{ billing.paid_amount.toLocaleString('Ru-ru') }} сум</td>
              </tr>
              <tr>
                <td class="bg-body"><p class="mb-0">Общая сумма</p></td>
                <td class="text-end bg-body">= {{ billing.total_amount.toLocaleString('Ru-ru') }} сум</td>
              </tr>
              <tr>
                <td class="bg-body"><h4 class="mb-0">Итого к оплате</h4></td>
                <td class="text-end bg-body">= {{ billing.remaining_amount.toLocaleString('Ru-ru') }} сум</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
<!--      <div class="block-content block-content-full text-end block-content-sm bg-body-light fs-sm">-->
<!--      <button @click.prevent="printCheck" v-if="orderItems?.content.length && props.status !== 'filling_details'" class="btn btn-sm btn-alt-primary me-2">Распечатать чек</button>-->
<!--      </div>-->
    </template>
  </BaseBlock>
</template>

<script setup>
import {computed, defineComponent, onMounted, ref} from "vue";
import router from "@/router";
import {useConfigStore} from "@/stores/dashboard/config/public";
// import {useOrderItemUserStore} from "@/stores/dashboard/order-item/user";
import {useBillingUserStore} from "@/stores/dashboard/order-billing/user";
import {useOrderUserStore} from "@/stores/dashboard/order/user";
import {useUserStore} from "@/stores/dashboard/user/user";

defineProps({
  status: String
})
const tableBlock = ref(null)
// const storeOperatorOrderItem = useOrderItemUserStore()
const storeBillingOperator = useBillingUserStore()
const storeOperator = useOrderUserStore()
const storeUser = useUserStore()
const storeConfig = useConfigStore()

// const orderItems = computed(() => storeOperatorOrderItem.orderItems)
const billing = computed(() => storeBillingOperator.billing[0])
const order = computed(() => storeOperator.order)
const user = computed(() => storeUser.user)
const delivery = computed(() => storeConfig.delivery)
onMounted(async () => {
  await tableBlock.value?.baseBlock?.statusLoading()
  await storeBillingOperator.getBilling(router.currentRoute.value.params.id)
  await tableBlock.value?.baseBlock?.statusNormal()
})

// const printCheck = async () => {
//   await storeBillingOperator.getBilling(router.currentRoute.value.params.id, true)
// }
// const printReceipt = async () => {
//   await storeBillingOperator.getBillingReceipt(router.currentRoute.value.params.id, true)
// }
defineComponent({name: 'OrderDetailUserPriceInfo'})
</script>
