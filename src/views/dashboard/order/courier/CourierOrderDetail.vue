<template>
  <BasePageHeading title="Информация о заказе" subtitle="На этой странице отображаются информация о заказе" />
  <div class="content">
    <OrderDetailCourierOrderInfo/>
    <OrderDetailCourierUserInfo />
  </div>
  <ModalRegisterBagCode />
  <ModalCreateSignatureCourier />
</template>

<script setup>
import OrderDetailCourierOrderInfo from "@/components/blocks/order/courier/OrderInfo.vue";
import OrderDetailCourierUserInfo from "@/components/blocks/order/courier/UserInfo.vue";
import ModalRegisterBagCode from "@/components/modals/order/courier/SetBagCode.vue";
import ModalCreateSignatureCourier from "@/components/modals/order/courier/CreateSignature.vue";

</script>
