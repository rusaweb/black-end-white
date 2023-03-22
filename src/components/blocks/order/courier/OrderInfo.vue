<template>
  <div class="alert alert-info d-flex justify-content-between align-items-center" v-if="data?.status.type === 'canceled' && !data?.status.order_delivered_back">
    <i class="fa fa-info-circle h5 mb-0 me-3"></i>
    <h5 class="mb-0 me-auto">Вы доставили заказ обратно?</h5>
    <button
        type="button"
        class="btn btn-alt-primary"
        v-click-ripple
        @click.prevent="delivered"
    >
      <i class="fa fa-check opacity-50 me-1"></i>
      Доставил
    </button>
  </div>
  <div class="alert alert-info d-flex justify-content-between align-items-center"
       v-if="data?.send_back_bag_code && data?.status.type === 'deliver_to_customer'">
    <i class="fa fa-info-circle h5 mb-0 me-3"></i>
    <h5 class="mb-0 me-auto">Вы доставили заказ клиенту?</h5>
    <button
        type="button"
        class="btn btn-alt-primary"
        data-bs-target="#create-signature"
        data-bs-toggle="modal"
        data-bs-type="submit"
        v-click-ripple
    >
      <i class="fa fa-check opacity-50 me-1"></i>
      Доставил
    </button>
  </div>
  <BaseBlock title="Информация о заказе">
    <template #content>
      <div class="block-content block-content-full">
        <ul class="list-group">
          <li class="list-group-item d-flex justify-content-between"
              v-if="data?.status.type === 'deliver_to_customer'">
            Адрес:
            <div class="col-6">
              <div class="flex-grow-1 form-control">
                <div class="fw-semibold">Адрес: {{ data?.deliver_to_address.address_line }}</div>
                <div class="fw-normal text-muted mb-2">Орентир: {{ data?.deliver_to_address.reference_point }}
                </div>
                <button
                    class="btn btn-sm btn-alt-secondary me-2"
                    data-bs-target="#map"
                    data-bs-toggle="modal"
                    data-bs-marker="1"
                    @click.prevent="storeMap.setYMap(data?.deliver_to_address.location)"
                >
                  Посмотреть на карте
                </button>
              </div>
            </div>
          </li>
          <li class="list-group-item d-flex justify-content-between" v-else>
            Адрес:
            <div class="col-6">
              <div class="flex-grow-1 form-control">
                <div class="fw-semibold">Адрес: {{ data?.receive_from_address.address_line }}</div>
                <div class="fw-normal text-muted mb-2">Орентир: {{ data?.receive_from_address.reference_point }}
                </div>
                <button
                    class="btn btn-sm btn-alt-secondary me-2"
                    data-bs-target="#map"
                    data-bs-toggle="modal"
                    data-bs-marker="1"
                    @click.prevent="storeMap.setYMap(data?.receive_from_address.location)"
                >
                  Посмотреть на карте
                </button>
              </div>
            </div>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            Дата создания:
            <span class="col-6">
              <span class="form-control">
                {{ new Date(data?.created).toLocaleDateString("Ru-ru") }}
                {{ new Date(data?.created).toLocaleTimeString('Ru-ru', {hour: '2-digit', minute: '2-digit'}) }}
              </span>
            </span>
          </li>
          <li class="list-group-item d-flex justify-content-between" v-if="data?.desired_send_back_delivery_time && data?.status.type === 'deliver_to_customer'">
            Время:
            <span class="col-6">
              <span class="form-control">
                {{ new Date(data?.desired_send_back_delivery_time).toLocaleDateString("Ru-ru") }}
                {{ new Date(data?.desired_send_back_delivery_time).toLocaleTimeString('Ru-ru', {hour: '2-digit', minute: '2-digit'}) }}
              </span>
            </span>
          </li>
          <li class="list-group-item d-flex justify-content-between" v-if="data?.desired_receive_delivery_time && data?.status.type !== 'deliver_to_customer'">
            Время:
            <span class="col-6">
              <span class="form-control">
                {{ new Date(data?.desired_receive_delivery_time / 1000).toLocaleDateString("Ru-ru") }}
                {{ new Date(data?.desired_receive_delivery_time / 1000).toLocaleTimeString('Ru-ru', {hour: '2-digit', minute: '2-digit'}) }}
              </span>
            </span>
          </li>
          <li class="list-group-item d-flex justify-content-between" v-if="data?.status.type === 'deliver_to_customer'">
            Код багажа:
            <span class="col-6" v-if="data?.send_back_bag_code">
              <span class="form-control">
                {{ data?.send_back_bag_code }}
              </span>
            </span>
          </li>
          <li class="list-group-item d-flex justify-content-between" v-else>
            Код багажа:
            <span class="col-6" v-if="data?.received_bag_code">
              <span class="input-group">
                <span class="form-control">
                  {{ data?.received_bag_code }}
                <button
                    type="button"
                    class="btn btn-sm btn-alt-secondary ms-4"
                    @click="data.received_bag_code = null"
                >
                  Очистить
                </button>
                </span>
              </span>
            </span>
            <span class="col-6" v-else>
              <button
                  type="button"
                  class="btn btn-sm btn-alt-secondary"
                  data-bs-toggle="modal"
                  data-bs-target="#reg-bag-code"
              >
                Установить
              </button>
            </span>
          </li>
          <li class="list-group-item d-flex justify-content-between" v-if="data?.status.type !== 'deliver_to_customer'">
            Подпись:
            <span class="col-6">
              <button
                  type="button"
                  class="btn btn-sm btn-alt-secondary"
                  data-bs-target="#create-signature"
                  data-bs-toggle="modal"
                  data-bs-type="submit"
              >
                {{ data?.on_receive_subscription_base64 ? 'Установленно' : 'Установить' }}
              </button>
            </span>
          </li>
        </ul>
      </div>
    </template>
  </BaseBlock>
</template>

<script setup>
import {computed, defineComponent} from "vue";

// import {useMapStore} from "@/stores/dashboard/map";
import { useYMapStore } from "@/stores/dashboard/yMap";

import router from "@/router";
import {useOrderCourierStore} from "@/stores/dashboard/order/courier";
import event from "@/utils/eventBus";

const storeMap = useYMapStore()
const storeCourier = useOrderCourierStore()

storeCourier.getOrder(router.currentRoute.value.params.id)
const data = computed(() => storeCourier.order)

const delivered = async () => {
  await storeCourier.deliveredOrder(router.currentRoute.value.params.id)
}

event.$on('signature-submit', async ({str, type}) => {
  if (type === 'submit') {
    if (data.value.status.type === 'deliver_to_customer'){
      await storeCourier.setSignatureBack({id: router.currentRoute.value.params.id, code: str})
      await storeCourier.deliveredOrder(router.currentRoute.value.params.id)
    }else{
      await storeCourier.setSignature({id: router.currentRoute.value.params.id, code: str})
      await storeCourier.getOrder(router.currentRoute.value.params.id)
    }
  }
})


// const confirmOrder = async () => {
//   try {
//     await storeOrderOperator.markOrderConfirmed(router.currentRoute.value.params.id)
//     await storeOrderOperator.getOrder(router.currentRoute.value.params.id)
//   } catch (e) {
//     console.log(e)
//   }
// }

defineComponent({name: 'OrderDetailCourierOrderInfo'})
</script>
