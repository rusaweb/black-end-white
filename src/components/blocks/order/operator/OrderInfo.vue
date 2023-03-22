<template>
  <BaseBlock :title="'Общая ифнормация о заказе #' + props.data?.id">
    <template #content>
      <div class="block-content block-content-full">
        <ul class="list-group">
          <li class="list-group-item d-md-flex d-block justify-content-between">
            Дата создания:
            <div class="col-md-6 col-12 mt-2">
              <div class="form-control">
                        <span>
                          {{ new Date(props.data.created).toLocaleDateString("Ru-ru") }}
                          {{ new Date(props.data.created).toLocaleTimeString('Ru-ru', {hour: '2-digit', minute: '2-digit'}) }}
                        </span>
              </div>
            </div>
          </li>
          <li class="list-group-item d-md-flex d-block justify-content-between">
            Дата выдачи:
            <div class="col-md-6 col-12 mt-2">
              <div class="input-group" v-if="!props?.data?.FROM_DEPARTMENT_TO_CUSTOMER?.desired_delivery_time">
                <input
                    type="date"
                    class="form-control"
                    id="desired_delivery_time"
                    v-model="desired_delivery_time"
                />
                <button class="btn btn-alt-secondary"
                        :disabled="!desired_delivery_time"
                        @click.prevent="save_desired_delivery_time(props?.data?.FROM_DEPARTMENT_TO_CUSTOMER?.id)">
                  <i class="fa fa-check"></i>
                </button>
              </div>
              <div class="form-control" v-else>
                  <span>
                    {{ new Date(props?.data?.FROM_DEPARTMENT_TO_CUSTOMER?.desired_delivery_time).toLocaleDateString("Ru-ru") }}
                  </span>
              </div>
            </div>
          </li>
          <li class="list-group-item d-md-flex d-block justify-content-between"
              v-if="props.data?.status.type !== 'done' && props.data?.status.order_delivered_back !== true">
            Промо-код:
            <div class="col-md-6 col-12 mt-2">
              <div class="input-group" v-if="!props.data?.discount?.promo_code_discount_percent">
                <input
                    type="text"
                    class="form-control"
                    v-model="promo_code"
                />
                <button class="btn btn-alt-secondary" @click.prevent="savePromoCode"><i class="fa fa-check"></i>
                </button>
              </div>
              <div class="input-group" v-else>
                <div class="form-control text-danger"><b class="text-dark">Установлен:</b> Скидка
                  -{{ props.data?.discount?.promo_code_discount_percent }}%
                </div>
              </div>
            </div>
          </li>
<!--          <li class="list-group-item d-flex justify-content-between"-->
<!--              v-if="props.data?.status.type !== 'done' && props.data?.status.order_delivered_back !== true">-->
<!--            Скидка:-->
<!--            <div class="col-6">-->
<!--              <div class="input-group" v-if="!props.data?.discount?.additional_discount_percent">-->
<!--                <input-->
<!--                    type="number"-->
<!--                    class="form-control"-->
<!--                    v-model="additional_discount_percent"-->
<!--                />-->
<!--                <button class="btn btn-alt-secondary" @click.prevent="saveDiscount"><i class="fa fa-check"></i></button>-->
<!--              </div>-->
<!--              <div class="input-group" v-else>-->
<!--                <div class="form-control text-danger"><b class="text-dark">Установлен:</b> Скидка-->
<!--                  -{{ props.data?.discount?.additional_discount_percent }}%-->
<!--                </div>-->
<!--                <button class="btn btn-alt-secondary"-->
<!--                        @click.prevent="props.data.discount.promo_code_discount_percent = null"><i-->
<!--                    class="fa fa-pen"></i></button>-->
<!--              </div>-->
<!--            </div>-->
<!--          </li>-->
          <li class="list-group-item d-md-flex d-block justify-content-between"
              v-if="props.data?.status.type !== 'done' && props.data?.status.order_delivered_back !== true">
            Тариф:
            <div class="col-md-6 col-12 mt-2">
              <div class="input-group">
                <div class="form-control">{{ tariff?.name }} (+{{ tariff?.per_item_percent_multiplier }}%)</div>
              </div>
            </div>
          </li>
          <li class="list-group-item d-md-flex d-block justify-content-between">
            Статус:
            <div class="col-md-6 col-12 mt-2">
              <div class="input-group mb-0">
                <div class="form-control">
                  {{ status[props.data.status.type] }}
                </div>
                <button
                    class="btn btn-sm btn-alt-primary"
                    v-if="props.data.status.type === 'waiting_for_start_confirmation'"
                    @click="confirmOrder"
                >
                  <i class="fa fa-check"></i>
                </button>
              </div>
            </div>
          </li>
          <li class="list-group-item d-md-flex d-block justify-content-between">
          Срочно:
          <div class="col-md-6 col-12 mt-2">
            <div class="input-group">
                        <span class="form-control" v-if="props.data.immediate.type === 'immediate'">
                        Да (+{{ props.data.immediate.total_amount_multiply_percent }}%)
                        </span>
              <span class="form-control" v-else>Нет</span>
            </div>
          </div>
        </li>
        </ul>
      </div>
  </template>
</BaseBlock>
</template>

<script setup>
import {computed, defineComponent, ref} from "vue";
import status from "@/data/status";
import {useOrderOperatorStore} from "@/stores/dashboard/order/operator";
import router from "@/router";
import {useTariffsPublicStore} from "@/stores/dashboard/tariffs/public";
import {useConfigStore} from "@/stores/dashboard/config/public";
import {useOrderIssuesOperatorStore} from "@/stores/dashboard/order-issue/operator";

const storeOrderOperator = useOrderOperatorStore()
const storeTariff = useTariffsPublicStore()
const storeDelivery = useConfigStore()
const orderIssuesStore = useOrderIssuesOperatorStore()
const tariff = computed(() => storeTariff.tariff)
const props = defineProps({
  data: Object
})
storeTariff.getTariff(props.data.tariff.id)
storeDelivery.getDelivery()
const promo_code = ref()
const savePromoCode = async () => {
  try {
    await storeOrderOperator.savePromoCode({promo_code: promo_code.value, id: router.currentRoute.value.params.id})
    await storeOrderOperator.getOrder(router.currentRoute.value.params.id)
  } catch (e) {
    console.log(e)
  }
}

const desired_delivery_time = ref(null)
const save_desired_delivery_time = async (id) => {
  const date = new Date(desired_delivery_time.value);
  const epochTime = Math.floor(date.getTime() / 1000);

  try {
    await storeOrderOperator.updateDesiredDeliveryTime({
      body: {
        desired_delivery_time: epochTime
      },
      id: id
    })
    await orderIssuesStore.getOrderIssues(router.currentRoute.value.params.id)
  } catch (e) {
    console.log(e)
  }
}
// const additional_discount_percent = ref()
//
// const saveDiscount = async () => {
//   try {
//     await storeOrderOperator.saveDiscount({
//       additional_discount_percent: additional_discount_percent.value,
//       id: router.currentRoute.value.params.id
//     })
//     await storeOrderOperator.getOrder(router.currentRoute.value.params.id)
//   } catch (e) {
//     console.log(e)
//   }
// }

const confirmOrder = async () => {
  try {
    await storeOrderOperator.markOrderConfirmed(router.currentRoute.value.params.id)
    await storeOrderOperator.getOrder(router.currentRoute.value.params.id)
  } catch (e) {
    console.log(e)
  }
}

defineComponent({name: 'OrderDetailOperatorOrderInfo'})
</script>
