<template>
  <BasePageHeading title="Информация о заказе" subtitle="На этой странице отображаются информация о заказе" />
  <div class="content">
    <OrderDetailUserInfo v-if="data" :data="data"/>
    <OrderDetailUserOrderIssueList />
    <OrderDetailUserOrderItems v-if="data?.status" :status="data?.status.type" />
    <OrderDetailUserPriceInfo />
    <OrderDetailUserDocumentList />
    <OrderDetailUserOrderActions v-if="data?.status" :status="data?.status.type" />
  </div>
  <ModalYMap />
  <ModalUpdateDeliverToAddress />
  <ModalUpdateReceiveFromAddress />
  <ModalConfirmClientToAddressUser />
  <ModalCreatePayme />
  <AddDocumentUser />
</template>

<script setup>
import ModalUpdateReceiveFromAddress from "@/components/modals/order/user/UpdateReceiveFromAddress.vue";
import ModalConfirmClientToAddressUser from "@/components/modals/order/user/ConfirmClientToAddress.vue";
import ModalUpdateDeliverToAddress from "@/components/modals/order/user/UpdateDeliverToAddress.vue";
import OrderDetailUserOrderActions from "@/components/blocks/order/user/OrderActions.vue";
import OrderDetailUserOrderItems from "@/components/blocks/order/user/OrderItemsList.vue";
// import ModalMap from "@/components/modals/Map.vue";
import ModalYMap from "@/components/modals/yMap.vue";
import {useOrderUserStore} from "@/stores/dashboard/order/user";
import router from "@/router";
import {computed} from "vue";
import {getCookie, setCookie} from "@/utils/cookie";
import OrderDetailUserInfo from "@/components/blocks/order/user/OrderInfo.vue";
import ModalCreatePayme from "@/components/modals/confirm/CreatePayment.vue";
import OrderDetailUserOrderIssueList from "@/components/blocks/order/user/OrderIssueList.vue";
import {useOrderIssuesUserStore} from "@/stores/dashboard/order-issue/user";
import OrderDetailUserPriceInfo from "@/components/blocks/order/user/OrderPriceInfo.vue";
import OrderDetailUserDocumentList from "@/components/blocks/order/user/OrderDocList.vue";
import AddDocumentUser from "@/components/modals/order/user/AddDoc.vue";

const storeUser = useOrderUserStore()
const orderIssuesStore = useOrderIssuesUserStore()
orderIssuesStore.getOrderIssues(router.currentRoute.value.params.id)

const token = encodeURIComponent(router.currentRoute.value.query.t)

if (!getCookie('access_token')){
  setCookie('refresh_token', token, 99999)
}

storeUser.getOrder(router.currentRoute.value.params.id)

const data = computed(() => storeUser.order)
</script>
