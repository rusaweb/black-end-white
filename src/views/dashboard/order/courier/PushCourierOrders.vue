<template>
  <BasePageHeading title="Заказы" subtitle="На этой странице отображаются ">
    <template #extra>
      <button type="button" class="btn btn-alt-primary" v-click-ripple>
        <i class="fa fa-plus opacity-50 me-1"></i>
        Сканировать
      </button>
    </template>
  </BasePageHeading>
  <div class="content">
    <div class="btn-group w-100 mb-3">
      <button class="btn" @click="filter = 'unmappedOnly'"
              :class="filter === 'unmappedOnly' ? 'btn-alt-primary': 'btn-alt-secondary'">Свободные заказы
      </button>
      <button class="btn" @click="filter = 'mappedToSelfOnly'"
              :class="filter === 'mappedToSelfOnly' ? 'btn-alt-primary': 'btn-alt-secondary'">Мои заказы
      </button>
    </div>
    <BaseBlock title="Список заказов">
      <template #content>
        <div class="block-content block-content-full" v-if="orders && orders.content.length">
          <div class="table-responsive">
            <table class="table table-bordered table-striped table-vcenter">
              <thead>
              <tr>
                <th>Адрес</th>
                <th>Дата создания</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="order in orders?.content" :key="order.id">
                <td @click="$router.push({name: 'order-courier-detail', params: {id: order.id}})">
                  <span v-if="order.deliver_to_address.type === 'department'">Отделение</span>
                  <span v-else>{{ order.deliver_to_address.address_line }}</span>
                </td>
                <td @click="$router.push({name: 'order-courier-detail', params: {id: order.id}})">
                  {{ new Date(order.created).toLocaleDateString("Ru-ru") }}
                  {{ new Date(order.created).toLocaleTimeString('Ru-ru', {hour: '2-digit', minute: '2-digit'}) }}
                </td>
                <td class="text-end">
                  <button class="btn btn-alt-primary" @click.prevent="accept(order.id)"
                          v-if="filter === 'unmappedOnly'">Принять
                  </button>
                  <button class="btn btn-alt-primary" @click.prevent="refuse(order.id)"
                          v-if="filter === 'mappedToSelfOnly'">Отказаться
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="block-content block-content-full" v-else>
          <div class="form-control d-flex flex-column justify-content-center align-items-center p-5">
            <i class="fa fa-folder-open fs-1 mb-4"></i>
            <h3>Список пуст</h3>
          </div>
        </div>
        <div class="block-content block-content-full bg-body-light">
          <BasePagination :data="orders"/>
        </div>
      </template>
    </BaseBlock>
  </div>
</template>

<script setup>
import BasePagination from "@/components/BasePagination.vue";
import {useOrderCourierStore} from "@/stores/dashboard/order/courier";
import {computed, onMounted, ref, watch} from "vue";
import {onBeforeRouteUpdate} from "vue-router";
import router from "@/router";


const storeOrderCourier = useOrderCourierStore()
const orders = computed(() => storeOrderCourier.orders)
const filter = ref('unmappedOnly')

watch(filter, (value, oldValue) => {
  if (oldValue) {
    delete router.currentRoute.value.query[oldValue]
  }
  if (value) {
    router.currentRoute.value.query[value] = 'true'
  }
  storeOrderCourier.getOrderListWaitingBack(router.currentRoute.value.query)
})

onMounted(async () => {
  if (filter.value) {
    router.currentRoute.value.query[filter.value] = 'true'
  }
  storeOrderCourier.getOrderListWaitingBack(router.currentRoute.value.query)
})
onBeforeRouteUpdate((to, from, next) => {
  storeOrderCourier.getOrderListWaitingBack(to.query)
  next()
})

const accept = async (id) => {
  await storeOrderCourier.handleBackOrderDelivery(id)
  await storeOrderCourier.getOrderListWaitingBack(router.currentRoute.value.query)
}
const refuse = async (id) => {
  await storeOrderCourier.mishandleBackOrderDelivery(id)
  await storeOrderCourier.getOrderListWaitingBack(router.currentRoute.value.query)
}
</script>
<style scoped>
</style>
