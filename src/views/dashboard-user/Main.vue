<script setup>
import {useOrderUserStore} from "@/stores/dashboard/order/user";
import BasePagination from "@/components/BasePagination.vue";
import router from "@/router";
import {computed, ref} from "vue";
import {onBeforeRouteUpdate} from "vue-router";
import status from "@/data/status-user";
import ModalCreateOrderUser from "@/components/modals/order/user/CreateOrder.vue";

const storeOrder = useOrderUserStore()
const tableBlock = ref()

storeOrder.getOrderList(router.currentRoute.value.query)
const orders = computed(() => {
  storeOrder.loading ? tableBlock.value?.statusLoading() : tableBlock.value?.statusNormal()
  return storeOrder.orders
})
onBeforeRouteUpdate((to, from, next) => {
  storeOrder.getOrderList(to.query)
  next()
})


</script>

<template>
  <!-- Page Content -->
  <div class="content">
    <BaseBlock title="Заказы" ref="tableBlock">
      <template #options>
        <div class="space-x-1">

        </div>
        <div class="space-x-1">
          <button
              type="button"
              class="btn btn-sm btn-alt-primary"
              v-click-ripple
              data-bs-toggle="modal"
              data-bs-target="#create-order"
          >
            <i class="fa fa-plus opacity-50 me-1"></i>
            Заказать
          </button>
        </div>
      </template>
      <template #content>
        <div class="block-content block-content-full" v-if="orders && orders.content.length">
          <table
              class="table table-striped table-hover table-borderless table-vcenter fs-sm mb-0"
          >
            <thead>
            <tr class="text-uppercase">
              <th class="fw-bold">ID</th>
              <th class="d-none d-sm-table-cell fw-bold">Дата</th>
              <th class="fw-bold">Статус</th>
              <th class="fw-bold text-center" style="width: 60px"></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="order in orders?.content" :key="order.id">
              <td>
                <span class="fw-semibold">#{{ order.id }}</span>
              </td>
              <td class="d-none d-sm-table-cell">
                <span class="fs-sm text-muted">{{ new Date(order.created).toLocaleDateString("Ru-ru") }}
                {{ new Date(order.created).toLocaleTimeString('Ru-ru', {hour: '2-digit', minute: '2-digit'}) }}</span>
              </td>
              <td>
                <span class="fw-semibold">{{ status[order.status.type] }}</span>
              </td>
              <td class="text-center">
                <a @click.prevent="$router.push({name: 'order-user-detail', params: {id: order.id}})" class="btn btn-sm btn-secondary d-flex justify-content-center align-items-center" href="javascript:void(0)">
                  <i class="fa fa-fw fa-info"></i>
                </a>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="block-content block-content-full" v-else>
          <div class="form-control d-flex flex-column justify-content-center align-items-center p-5">
            <i class="fa fa-folder-open fs-1 mb-4"></i>
            <h3>Вы еще не делали ни одного заказа</h3>
            <button
                type="button"
                class="btn btn-alt-primary"
                v-click-ripple
                data-bs-toggle="modal"
                data-bs-target="#create-order"
            >
              <i class="fa fa-plus opacity-50 me-1"></i>
              Заказать
            </button>
          </div>
        </div>
        <div class="block-content block-content-full bg-body-light">
          <BasePagination :data="orders"/>
        </div>
      </template>
    </BaseBlock>
  </div>
  <ModalCreateOrderUser />
  <!-- END Page Content -->
</template>
