<template>
  <BasePageHeading title="Информация о заказе" subtitle="На этой странице отображаются информация о заказе"></BasePageHeading>
  <div class="content">
    <OrderInfoBlockTechnologist :data="data"/>
    <CleaningStepsBlock :data="dataOrderItems"/>
  </div>
  <ModalScanThingInfo />
</template>

<script setup>
import OrderInfoBlockTechnologist from "@/components/blocks/order/technologist/OrderInfo.vue";
import CleaningStepsBlock from "@/components/blocks/order/technologist/CleaningSteps.vue";
import {useOrderTechnologistStore} from "@/stores/dashboard/order/technologist";
import router from "@/router";
import {computed, onMounted} from "vue";
import {useOrderItemTechnologistStore} from "@/stores/dashboard/order-item/technologist";
import ModalScanThingInfo from "@/components/modals/order/technologist/ScanThingInfo.vue";
import {useTemplateStore} from "@/stores/template";
const store = useTemplateStore()
const storeTechnologist = useOrderTechnologistStore()
const storeTechnologistOrderItem = useOrderItemTechnologistStore()
onMounted(async () => {
  await store.pageLoader({ mode: "on" })
  await storeTechnologist.getOrder(router.currentRoute.value.params.id)
  await storeTechnologistOrderItem.getOrderItemsById(router.currentRoute.value.params.id)
  await store.pageLoader({ mode: "off" })
})

const data = computed(() => storeTechnologist.order)
const dataOrderItems = computed(() => storeTechnologistOrderItem.orderItems)
</script>
