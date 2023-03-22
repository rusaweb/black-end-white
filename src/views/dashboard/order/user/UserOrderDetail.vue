<template>
  <BasePageHeading title="Информация о заказе" subtitle="На этой странице отображаются информация о заказе" />
  <div class="content">
    <OrderDetailUserOrderInfo v-if="data" :data="data"/>
    <OrderDetailUserOrderItems v-if="data?.status" :status="data?.status.type" />
    <OrderDetailUserOrderActions v-if="data?.status" :status="data?.status.type" />
  </div>
  <ModalYMap />
  <ModalUpdateDeliverToAddress />
  <ModalUpdateReceiveFromAddress />
  <ModalConfirmClientToAddressUser />
</template>

<script setup>
import ModalUpdateReceiveFromAddress from "@/components/modals/order/user/UpdateReceiveFromAddress.vue";
import ModalConfirmClientToAddressUser from "@/components/modals/order/user/ConfirmClientToAddress.vue";
import ModalUpdateDeliverToAddress from "@/components/modals/order/user/UpdateDeliverToAddress.vue";
import OrderDetailUserOrderActions from "@/components/blocks/order/user/OrderActions.vue";
import OrderDetailUserOrderItems from "@/components/blocks/order/user/OrderItemsList.vue";
import OrderDetailUserOrderInfo from "@/components/blocks/order/user/OrderInfo.vue";

// import ModalMap from "@/components/modals/Map.vue";
import ModalYMap from "@/components/modals/yMap.vue";

import { useOrderUserStore } from "@/stores/dashboard/order/user";
import router from "@/router";
import { computed } from "vue";

const storeUser = useOrderUserStore()

storeUser.getOrder(router.currentRoute.value.params.id)

const data = computed(() => storeUser.order)

</script>
