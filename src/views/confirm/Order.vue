<script setup>
import {computed, onMounted} from "vue";
import router from "@/router";
import {useLoginStore} from "@/stores/auth/login";
import {getCookie} from "@/utils/cookie";
import OrderDetailConfirmOrderInfo from "@/components/blocks/confirm/OrderInfo.vue";
import OrderDetailConfirmOrderItems from "@/components/blocks/confirm/OrderItemsList.vue";

// import ModalMap from "@/components/modals/Map.vue";
import ModalYMap from "@/components/modals/yMap.vue";

import {useOrderUserStore} from "@/stores/dashboard/order/user";
import ModalCreatePayme from "@/components/modals/confirm/CreatePayment.vue";
const storeUser = useOrderUserStore()
const data = computed(() => storeUser.order)
const authStore = useLoginStore()
onMounted(async () => {
  const token = encodeURIComponent(router.currentRoute.value.query.t)
  if (!getCookie('access_token')){
     await authStore.sendLimitedToken(token)
  }
  await storeUser.getOrder(router.currentRoute.value.params.id)
})
const cancelOrder = async () => {
  try {
    await storeUser.cancelOrder(router.currentRoute.value.params.id)
    await storeUser.getOrder(router.currentRoute.value.params.id)
  }catch (e) {
    console.log(e)
  }
}
</script>
<template>
  <BasePageHeading title="Информация о заказе" subtitle="На этой странице отображаются информация о заказе" >
    <template #extra>
      <button
          type="button"
          class="btn btn-alt-danger me-3"
          v-click-ripple
          @click="cancelOrder"
          v-if="data?.status.type === 'deliver_to_department' || data?.status.type === 'filling_details' || data?.status.type === 'waiting_for_start_confirmation'"
      >
        <i class="fa fa-times opacity-50 me-1"></i>
        Отменить заказ
      </button>
    </template>
  </BasePageHeading>
  <div class="content">
    <OrderDetailConfirmOrderInfo v-if="data" :data="data"/>
    <OrderDetailConfirmOrderItems v-if="data?.status" :status="data?.status.type" />
<!--    <OrderDetailUserOrderActions v-if="data?.status" :status="data?.status.type" />-->
  </div>
  <ModalYMap />
  <ModalCreatePayme />
</template>