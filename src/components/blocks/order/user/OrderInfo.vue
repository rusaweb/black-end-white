<template>
  <BaseBlock :title="'Общая ифнормация о заказе #' + props.data?.id">
    <template #content>
      <div class="block-content block-content-full">
        <ul class="list-group">
          <li class="list-group-item d-md-flex d-block align-items-center justify-content-between">
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
          <li class="list-group-item d-md-flex d-block align-items-center justify-content-between"
              v-if="props.data?.status.type !== 'done' && props.data?.status.order_delivered_back !== true">
            Промо-код:
            <div class="col-md-6 col-12 mt-2">
              <div class="input-group" v-if="!props.data?.discount?.promo_code_discount_percent">
                <input
                    type="text"
                    class="form-control"
                    v-model="promo_code"
                    placeholder="..."
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
          <li class="list-group-item d-md-flex d-block align-items-center justify-content-between"
              v-if="props.data?.status.type !== 'done' && props.data?.status.order_delivered_back !== true">
            Тариф:
            <div class="col-md-6 col-12 mt-2">
              <div class="input-group">
                <div class="form-control">{{ tariff?.name }}</div>
              </div>
            </div>
          </li>
          <li class="list-group-item d-md-flex d-block align-items-start justify-content-between">
            Статус:
            <div class="col-md-6 col-12 mt-2">

              <div class="input-group mb-0">
                <div class="form-control">
                  {{ status[props.data.status.type] }}
                </div>
                <button
                    class="btn btn-sm btn-primary"
                    v-if="props.data.status.type === 'waiting_for_start_confirmation'"
                    @click="confirmOrder"
                >
                  Подтвердить <i class="fa fa-check"></i>
                </button>
              </div>
              <p class="mt-2 mb-0">Я подтверждаю, что мною полностью прочитаны, поняты и приняты
                <span class="text-normal fw-medium text-decoration-underline text-amethyst user-select-none"
                      style="cursor: pointer"
                      data-bs-target="#accept-order-terms"
                      data-bs-toggle="modal"
                      @click.prevent
                >
                  условия
                </span>
              </p>
            </div>
          </li>
          <li class="list-group-item d-md-flex d-block align-items-center justify-content-between">
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
          <li class="list-group-item d-md-flex d-block align-items-center justify-content-between">
            Оплатить:
            <div class="col-md-6 col-12 mt-2">
              <div class="input-group">
                <button
                    class="btn btn-success"
                    data-bs-target="#create-payment"
                    data-bs-toggle="modal"
                >Payme</button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    <UserOrderTerms />
    </template>
  </BaseBlock>
</template>

<script setup>
import { computed, defineComponent, ref } from "vue";
import status from "@/data/status";
import router from "@/router";
import {useTariffsPublicStore} from "@/stores/dashboard/tariffs/public";
import {useConfigStore} from "@/stores/dashboard/config/public";
import { useOrderUserStore } from "@/stores/dashboard/order/user";
import UserOrderTerms from "@/components/modals/order/user/userTerms.vue";

const storeOrder = useOrderUserStore()
const storeTariff = useTariffsPublicStore()
const storeDelivery = useConfigStore()
const tariff = computed(() => storeTariff.tariff)
const props = defineProps({
  data: Object
})
storeTariff.getTariff(props.data.tariff.id)
storeDelivery.getDelivery()
const promo_code = ref()
const savePromoCode = async () => {
  try {
    await storeOrder.savePromoCode({promo_code: promo_code.value, id: router.currentRoute.value.params.id})
    await storeOrder.getOrder(router.currentRoute.value.params.id)
  } catch (e) {
    console.log(e)
  }
}

const confirmOrder = async () => {
  try {
    await storeOrder.markOrderConfirmed(router.currentRoute.value.params.id)
    await storeOrder.getOrder(router.currentRoute.value.params.id)
  } catch (e) {
    console.log(e)
  }
}

defineComponent({name: 'OrderDetailUserInfo'})
</script>
