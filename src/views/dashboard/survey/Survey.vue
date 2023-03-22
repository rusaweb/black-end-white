<template>
  <BasePageHeading title="Обследование" subtitle="На этой странице отображаются обследования"/>
  <div class="content">
    <BaseBlock title="История обследования" ref="tableBlock">
      <template #options>
        <div class="space-x-1">
          <button
              type="button"
              class="btn btn-sm btn-alt-secondary"
              @click="orderSearch = !orderSearch"
          >
            <i class="fa fa-search"></i>
          </button>
        </div>
      </template>
      <template #content>
        <BaseSearch :list="searchList" v-if="orderSearch"/>
        <div class="block-content block-content-full" v-if="histories && histories?.content?.length">
          <div class="table-responsive">
            <table class="table table-bordered table-striped table-vcenter">
              <thead>
              <tr>
                <th>Этап</th>
                <th>Заказа ID</th>
                <th>Код вещи</th>
                <th>Вещь</th>
                <th>Дата</th>
              </tr>
              </thead>
              <tbody>
              <tr
                  data-bs-toggle="modal"
                  data-bs-target="#info-client"
                  v-for="item in histories.content"
                  :key="item.id"
                  :data-bs-id="item.id"
              >
                <td>{{ item.step_name }}</td>
                <td><router-link :to="{name: 'order-operator-detail', params: {id: item.order_item.order_id}}">{{item.order_item.order_id}}</router-link></td>
                <td>{{ item.order_item.code }}</td>
                <td>{{ item.order_item.name }}</td>
                <td>{{ new Date(item.time).toLocaleDateString('Ru-ru') }}</td>
              </tr>
              </tbody>
            </table>
          </div>
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
                data-bs-target="#modal-create-clients"
            >
              <i class="fa fa-plus opacity-50 me-1"></i>
              Добавить
            </button>
          </div>
        </div>
        <div class="block-content block-content-full bg-body-light">
          <BasePagination :data="histories"/>
        </div>
      </template>
    </BaseBlock>
  </div>
</template>
<script setup>
import {computed, ref} from "vue";
import BaseSearch from "@/components/BaseSearch.vue";
import BasePagination from "@/components/BasePagination.vue";
import router from "@/router";
import {onBeforeRouteUpdate} from "vue-router";
import {useOrderItemOperatorStore} from "@/stores/dashboard/order-item/operator";

const orderItemsStore = useOrderItemOperatorStore()

const orderSearch = ref(false)
const tableBlock = ref(null)
const searchList = ref([
  {label: 'Коду', value: 'orderItemCode'},
])
const histories = computed(() => {
  orderItemsStore.loading ? tableBlock.value?.statusLoading() : tableBlock.value?.statusNormal()
  return orderItemsStore.history
})

orderItemsStore.getGlobalStepsHistory(router.currentRoute.value.query)
onBeforeRouteUpdate((to, from, next) => {
  orderItemsStore.getGlobalStepsHistory(to.query)
  next()
})


</script>
