<template>
  <BasePageHeading title="Заказы" subtitle="На этой странице отображаются список заказов">
    <template #extra>
      <button
          type="button"
          class="btn btn-alt-primary"
          v-click-ripple
          data-bs-target="#create-order"
          data-bs-toggle="modal"
      >
        <i class="fa fa-plus opacity-50 me-1"></i>
        Добавить
      </button>
    </template>
  </BasePageHeading>
  <div class="content">
    <BaseBlock title="Список заказов" ref="tableBlock">
      <template #options>
        <div class="space-x-1">
          <button
              type="button"
              class="btn btn-sm btn-alt-secondary"
              data-bs-target="#scan-id"
              data-bs-toggle="modal"
          >
            Найти по ID
          </button>
          <button
              type="button"
              class="btn btn-sm btn-alt-secondary"
              data-bs-target="#scan-code-bag"
              data-bs-toggle="modal"
          >
            Сканировать
          </button>
          <BaseFilterDropdown :list="filterList" />
        </div>
      </template>
      <template #content>
        <div class="block-content block-content-full" v-if="orders && orders.content.length" >
          <table class="table table-bordered table-vcenter">
            <thead>
              <tr>
                <th>ID</th>
<!--                <th>Получить по адресу</th>-->
                <th>Статус</th>
                <th>Дата создания</th>
              </tr>
            </thead>
            <tbody>
            <tr v-for="order in orders?.content" :key="order.id" @click="$router.push({name: 'order-operator-detail', params: {id: order.id}})">
              <td class="fw-semibold fs-sm">
                <span>{{ order.id }}</span>
              </td>
<!--              <td>-->
<!--                <span v-if="order.receive_from_address.type === 'department'">Отделение</span>-->
<!--                <span v-else>{{order.receive_from_address.address_line}}</span>-->
<!--              </td>-->
              <td class="position-relative">
                <span v-if="order.status.type === 'pending'" class="position-absolute start-0 top-0 bg-primary" style="width: 5px;height: 100%;"></span>
                <span v-if="order.status.type === 'canceled'" class="position-absolute start-0 top-0 bg-danger" style="width: 5px;height: 100%;"></span>
                {{status[order.status.type]}} </td>
              <td>
                {{new Date(order.created).toLocaleDateString("Ru-ru")}}
                {{new Date(order.created).toLocaleTimeString('Ru-ru', {hour: '2-digit', minute: '2-digit'})}}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="block-content block-content-full" v-else>
          <div class="form-control d-flex flex-column justify-content-center align-items-center p-5">
            <i class="fa fa-folder-open fs-1 mb-4"></i>
            <h3>Список пуст</h3>
            <button
                type="button"
                class="btn btn-alt-primary"
                v-click-ripple
                data-bs-toggle="modal"
                data-bs-target="#create-order"
            >
              <i class="fa fa-plus opacity-50 me-1"></i>
              Добавить
            </button>
          </div>
        </div>
        <div class="block-content block-content-full bg-body-light">
          <BasePagination :data="orders"/>
        </div>
      </template>
    </BaseBlock>
  </div>
  <ModalYMap />
  <ModalCreateSignatureOperator />
  <ModalCreateOrderOperator/>
  <ModalScanBagOperator/>
  <ModalScanIdOperator/>
  <ModalCreateClientOperator/>

</template>
<script setup>
import BaseFilterDropdown from "@/components/BaseFilterDropdown.vue";
import BasePagination from "@/components/BasePagination.vue";
import ModalCreateOrderOperator from "@/components/modals/order/operator/CreateOrder.vue";
import {useOrderOperatorStore} from "@/stores/dashboard/order/operator";
import {computed, ref} from "vue";
import {onBeforeRouteUpdate} from "vue-router";
import router from "@/router";
import status from "@/data/status";
// import ModalMap from "@/components/modals/Map.vue";
import ModalYMap from "@/components/modals/yMap.vue";
import ModalCreateSignatureOperator from "@/components/modals/order/operator/CreateSignature.vue";
import ModalScanIdOperator from "@/components/modals/order/operator/ScanId.vue";
import ModalScanBagOperator from "@/components/modals/order/operator/ScanBag.vue";
import ModalCreateClientOperator from "@/components/modals/client/operarator/CreateClientOperator.vue";

const tableBlock = ref(null)
const filterList = ref([
  {label: 'Доставляется в отдел', value: 'DELIVER_TO_DEPARTMENT'},
  {label: 'В ожидания подтверждения', value: 'WAITING_FOR_START_CONFIRMATION'},
  {label: 'Заполняются вещи', value: 'FILLING_DETAILS'},
  {label: 'В чистке', value: 'IN_TECHNOLOGIST_WORK'},
  {label: 'Доставляется до клиента', value: 'DELIVER_TO_CUSTOMER'},
  {label: 'Готово', value: 'DONE'},
  {label: 'Отменено', value: 'CANCELED'}
]);

const storeOrderOperator = useOrderOperatorStore()
storeOrderOperator.getOrderList(router.currentRoute.value.query)
const orders = computed(() => {
  storeOrderOperator.loading ? tableBlock.value?.statusLoading() : tableBlock.value?.statusNormal()
  return storeOrderOperator.orders
})
onBeforeRouteUpdate((to, from, next)=> {
  storeOrderOperator.getOrderList(to.query)
  next()
})
</script>
<style scoped>
</style>
