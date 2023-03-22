<template>
  <BasePageHeading title="Заказы" subtitle="На этой странице отображаются ">
    <template #extra>
      <button type="button" class="btn btn-alt-primary" v-click-ripple>
        <i class="fa fa-plus opacity-50 me-1"></i>
        Добавить
      </button>
    </template>
  </BasePageHeading>
  <div class="content">
    <div class="row">
<!--      <div class="col-4">-->
<!--        <BaseBlock>-->
<!--          <template #content>-->
<!--            <div-->
<!--                class="block-content block-content-full"-->
<!--                data-bs-target="#scan-code-bag"-->
<!--                data-bs-toggle="modal"-->
<!--            >-->
<!--              <h4>Найти по мешку</h4>-->
<!--              <button class="btn btn-secondary">-->
<!--                Сканировать-->
<!--              </button>-->
<!--            </div>-->
<!--          </template>-->
<!--        </BaseBlock>-->
<!--      </div>-->
<!--      <div class="col-4">-->
<!--        <BaseBlock>-->
<!--          <template #content>-->
<!--            <div-->
<!--                class="block-content block-content-full"-->
<!--                data-bs-target="#scan-code-thing"-->
<!--                data-bs-toggle="modal"-->
<!--            >-->
<!--              <h4>Сканировать вещь</h4>-->
<!--              <button class="btn btn-secondary">-->
<!--                Сканировать-->
<!--              </button>-->
<!--            </div>-->
<!--          </template>-->
<!--        </BaseBlock>-->
<!--      </div>-->
<!--      <div class="col-4">-->
<!--        <BaseBlock>-->
<!--          <template #content>-->
<!--            <div-->
<!--                class="block-content block-content-full"-->
<!--                data-bs-target="#scan-code-hanger"-->
<!--                data-bs-toggle="modal"-->
<!--            >-->
<!--              <h4>Найти по вешалке</h4>-->
<!--              <button class="btn btn-secondary">-->
<!--                Найти-->
<!--              </button>-->
<!--            </div>-->
<!--          </template>-->
<!--        </BaseBlock>-->
<!--      </div>-->
    </div>
    <BaseBlock title="Список заказов" ref="tableBlock">
      <template #options>
        <button
            class="btn-block-option"
            data-bs-target="#scan-code-thing"
            data-bs-toggle="modal"
        ><i class="fa fa-barcode"></i></button>
      </template>
      <template #content>
        <div class="block-content block-content-full" v-if="orders && orders.content.length">
          <table class="table table-bordered table-vcenter">
            <thead>
            <tr>
              <th>Статус</th>
              <th>Код мешка</th>
              <th>Код мешка возврата</th>
              <th>Дата создания</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="order in orders?.content" :key="order.id" @click="$router.push({name: 'order-technologist-detail', params: {id: order.id}})">

              <td>{{status[order.status.type]}}</td>
              <td>{{order.received_bag_code}}</td>
              <td>{{order.send_back_bag_code || 'Не установленно'}}</td>
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
  <ModalScanBag/>
  <ModalScanHanger/>
  <ModalScanThing/>
  <ModalScanThingInfo/>
</template>

<script setup>
import {useOrderTechnologistStore} from "@/stores/dashboard/order/technologist.js";
import BaseFilterDropdown from "@/components/BaseFilterDropdown.vue";
import BasePagination from "@/components/BasePagination.vue";
import ModalScanThing from "@/components/modals/order/technologist/ScanThing.vue";
import ModalScanThingInfo from "@/components/modals/order/technologist/ScanThingInfo.vue";
import ModalScanHanger from "@/components/modals/order/technologist/ScanHanger.vue";
import ModalScanBag from "@/components/modals/order/technologist/ScanBag.vue";
import {computed, ref} from "vue";
import router from "@/router";
import {onBeforeRouteUpdate} from "vue-router";
import status from "@/data/status";

const storeOrderTechnologist = useOrderTechnologistStore()

const tableBlock = ref(null)
const filterList = ref([
  {label: 'Доставляется в отдел', value: 'deliver_to_department'},
  {label: 'В ожидания подтверждения', value: 'waiting_for_start_confirmation'},
  {label: 'Заполняются вещи', value: 'filling_details'},
  {label: 'В чистке', value: 'in_technologist_work'},
  {label: 'Упаковывается', value: 'packaging_order_items'},
  {label: 'Доставляется до клиента', value: 'deliver_to_customer'},
  {label: 'Готово', value: 'done'},
  {label: 'Отменено', value: 'canceled'}
]);

storeOrderTechnologist.getOrderList(router.currentRoute.value.query)
const orders = computed(() => {
  storeOrderTechnologist.loading ? tableBlock.value?.statusLoading() : tableBlock.value?.statusNormal()
  return storeOrderTechnologist.orders
})
onBeforeRouteUpdate((to, from, next)=> {
  storeOrderTechnologist.getOrderList(to.query)
  next()
})
</script>
