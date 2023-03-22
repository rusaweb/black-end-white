<template>
  <BaseBlock title="Информация по цене" v-if="billing && billing.items && billing.items.length && delivery">
    <template #content>
      <div class="block-content mb-3 block-content-full">
        <div class="table-responsive">
          <table class="table table-bordered table-striped table-vcenter">
            <thead>
              <tr>
                <th>Название</th>
                <th>Цена</th>
                <th>Процент за тариф</th>
                <th>Доп. услуги</th>
                <th>Общая цена</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in billing.items" :key="item.id">
                <td class="bg-body">{{ item.name }}</td>
                <td class="bg-body">{{ item.price.amount.toLocaleString('ru-RU') }} сум</td>
                <td class="bg-body">+{{ item.price_percent_multiplier }}%</td>
                <td class="bg-body">
                  <p style="margin-bottom: 3px;" v-for="services in item.additional_services" :key="services.id">{{services.name}}: {{services.total_amount.toLocaleString('ru-Ru')}} сум</p>
                </td>
                <td class="bg-body">{{ item.total_amount.toLocaleString('ru-RU') }} сум</td>
              </tr>
            </tbody>
          </table>
          <table v-if="accessories?.content.length" class="table table-bordered table-striped table-vcenter">
            <thead>
            <tr>
              <th><span class="d-flex justify-content-center"><i class="fa fa-image"></i></span></th>
              <th>Название</th>
              <th>Описание</th>
              <th>Цена</th>
              <th>Количество</th>
            </tr>
            </thead>
            <tbody>
            <tr style="cursor:pointer;" v-for="item in accessories?.content" :key="item.id">
              <td @click.prevent="showPhoto(0, item.accessory.images.map(e=> e.url))" style="width: 50px; min-width: 50px">
                <span class="d-flex justify-content-center">
                  <img style="object-fit: cover" width="45" height="45" v-lazy="item.accessory.images[0]?.url || '/src/assets/error.jpg'" alt="">
                </span>
              </td>
              <td class="fw-semibold fs-sm">
                <span>{{ item.accessory.name }}</span>
              </td>
              <td class="fw-semibold fs-sm">
                <span>{{ item.accessory.description }}</span>
              </td>
              <td class="fw-semibold fs-sm">
                <span>{{ item.accessory.price.amount.toLocaleString('ru-RU') }} сум</span>
              </td>
              <td class="fw-semibold fs-sm">
                <span>{{ item.count }}</span>
              </td>
            </tr>
            </tbody>
          </table>
          <table v-if="services?.content.length" class="table table-bordered table-striped table-vcenter">
            <thead>
            <tr>
              <th>Название</th>
              <th>Цена</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in services?.content" :key="item.id">
              <td class="fw-semibold fs-sm">
                <span>{{ item.additional_service.name }}</span>
              </td>
              <td class="fw-semibold fs-sm">
                <span>{{ item.price.amount.toLocaleString('ru-RU') }} сум</span>
              </td>
            </tr>
            </tbody>
          </table>
          <table class="table table-bordered table-striped table-vcenter">
            <tbody>
              <tr>
                <td class="bg-body"><p class="mb-0">Общая стоимость вещей</p></td>
                <td class="text-end bg-body">{{billing.items.map(e => e.total_amount).reduce((accumulator, currentValue) => accumulator + currentValue, 0).toLocaleString('ru-RU')}} сум</td>
              </tr>
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
              <tr v-for="item in billing.issues" :key="item">
                <td v-if="item.type === 'FROM_CUSTOMER_TO_DEPARTMENT'" class="bg-body"><p class="mb-0">Доставка в отдел</p></td>
                <td v-if="item.type === 'FROM_CUSTOMER_TO_DEPARTMENT'" class="text-end bg-body">{{ item.amount.toLocaleString('Ru-ru') }} сум</td>
                <td v-if="item.type === 'FROM_DEPARTMENT_TO_CUSTOMER'" class="bg-body"><p class="mb-0">Доставка в отдел</p></td>
                <td v-if="item.type === 'FROM_DEPARTMENT_TO_CUSTOMER'" class="text-end bg-body">{{ item.amount.toLocaleString('Ru-ru') }} сум</td>
              </tr>
              <tr v-for="item in billing.issues.filter(e => e.type === 'FROM_DEPARTMENT_TO_CUSTOMER_EXTRA')" :key="item">
                <td class="bg-body"><p class="mb-0">Доставка к клиенту дополнительно</p></td>
                <td class="text-end bg-body">{{ item.amount.toLocaleString('Ru-ru') }} сум</td>
              </tr>
              <tr>
                <td class="bg-body"><p class="mb-0">Сумма без скидки</p></td>
                <td class="text-end bg-body">{{ billing.total_amount_without_discount.toLocaleString('Ru-ru') }} сум</td>
              </tr>
              <tr>
                <td class="bg-body"><p class="mb-0">Сумма скидки</p></td>
                <td class="text-end bg-body">{{ billing.discount_amount.toLocaleString('Ru-ru') }} сум</td>
              </tr>
              <tr>
                <td class="bg-body"><p class="mb-0">Общая сумма</p></td>
                <td class="text-end bg-body">= {{ billing.total_amount.toLocaleString('Ru-ru') }} сум</td>
              </tr>
              <tr>
                <td class="bg-body"><p class="mb-0">Оплачено</p></td>
                <td class="text-end bg-body">= {{ billing.paid_amount.toLocaleString('Ru-ru') }} сум</td>
              </tr>
              <tr>
                <td class="bg-body"><h4 class="mb-0">Итого к оплате</h4></td>
                <td class="text-end bg-body">= {{ billing.remaining_amount.toLocaleString('Ru-ru') }} сум</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="block-content block-content-full text-end block-content-sm bg-body-light fs-sm">
      <button @click.prevent="printCheck" v-if="orderItems?.content.length && props.status !== 'filling_details'" class="btn btn-sm btn-alt-primary me-2">Распечатать чек</button>
      <button @click.prevent="printReceipt" v-if="orderItems?.content.length" class="btn btn-sm btn-alt-primary">Распечатать Квитанцию</button>
      </div>
    </template>
  </BaseBlock>
</template>

<script setup>
import {computed, defineComponent, onMounted, ref} from "vue";
import {useOrderItemOperatorStore} from "@/stores/dashboard/order-item/operator";
import router from "@/router";
import {useOrderOperatorStore} from "@/stores/dashboard/order/operator";
import {useBillingOperatorStore} from "@/stores/dashboard/order-billing/operator";
import {useUserOperatorStore} from "@/stores/dashboard/user/operator";
import {useConfigStore} from "@/stores/dashboard/config/public";
import {useAccessoryOperatorStore} from "@/stores/dashboard/accessory/operator";
import {useAdditionalServiceOperatorStore} from "@/stores/dashboard/additional-services/operator";

const props = defineProps({
  status: String
})
const tableBlock = ref(null)
const storeOperatorOrderItem = useOrderItemOperatorStore()
const storeBillingOperator = useBillingOperatorStore()
const storeOperator = useOrderOperatorStore()
const storeUser = useUserOperatorStore()
const storeConfig = useConfigStore()
const storeAccessory = useAccessoryOperatorStore()
const storeAdditionalService = useAdditionalServiceOperatorStore()

const orderItems = computed(() => storeOperatorOrderItem.orderItems)
const billing = computed(() => storeBillingOperator.billing[0])
const order = computed(() => storeOperator.order)
const user = computed(() => storeUser.user)
const delivery = computed(() => storeConfig.delivery)
const accessories = computed(() => storeAccessory.accessories)
const services = computed(() => storeAdditionalService.services)

onMounted(async () => {
  await tableBlock.value?.baseBlock?.statusLoading()
  await storeOperatorOrderItem.getOrderItemsById(router.currentRoute.value.params.id, '')
  await storeBillingOperator.getBilling(router.currentRoute.value.params.id)
  storeAccessory.getAccessories({orderId: router.currentRoute.value.params.id})
  storeAdditionalService.getAdditionalServices({orderId: router.currentRoute.value.params.id})
  await tableBlock.value?.baseBlock?.statusNormal()
})

const printCheck = async () => {
  await storeBillingOperator.getBilling(router.currentRoute.value.params.id, true)
}
const printReceipt = async () => {
  await storeBillingOperator.getBillingReceipt(router.currentRoute.value.params.id, true)
}
defineComponent({name: 'OrderDetailOperatorPriceInfo'})
</script>
