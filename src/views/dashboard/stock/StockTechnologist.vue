<template>
  <BasePageHeading
    title="Склад"
    subtitle="На этой странице отображаются список товаров на складе"
  />

  <div class="content">
    <BaseBlock title="Список товаров на складе">
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
        <BaseSearch :list="searchList" v-if="orderSearch" />
        <div class="block-content block-content-full">
          <div class="table-responsive">
            <table
              class="table table-bordered table-striped table-vcenter"
              v-if="stocks?.content.length"
            >
              <thead>
                <tr>
                  <th>Название</th>
                  <th>Тип</th>
                  <th>Дата создания</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in stocks?.content"
                  :key="item.id"
                  @click="$router.push({name: 'stocks-technologist-detail', params: {id: item.id}})"
                >
                  <td>{{ item.name }}</td>
                  <td>{{ statusMeasure[item.measure_type] }}</td>
                  <td>{{ new Date(item.created).toLocaleDateString('Ru-ru') }}</td>
                </tr>
              </tbody>
            </table>
            <div class="form-control text-center p-5" v-else>
              Ваш склад пуст
            </div>
          </div>
        </div>
        <div class="block-content block-content-full bg-body-light">
          <BasePagination :data="stocks" />
        </div>
      </template>
    </BaseBlock>
  </div>
  <ModalCreateStock />
</template>
<script setup>
import { onMounted, onUnmounted, ref, computed, defineComponent } from "vue";
import ModalCreateStock from "@/components/modals/stock/CreateStock.vue";
import BaseSearch from "@/components/BaseSearch.vue";
import BasePagination from "@/components/BasePagination.vue";
import { useStockTechnologistStore } from "@/stores/dashboard/stock/technologist";
import router from "@/router";
import statusMeasure from "@/data/status-measure";
import { onBeforeRouteUpdate } from "vue-router";

const orderSearch = ref(false);
const tableBlock = ref(null);
const stockStore = useStockTechnologistStore();
stockStore.getStocks(router.currentRoute.value.query);

onBeforeRouteUpdate((to, from, next) => {
  stockStore.getStocks(to.query);
  next();
});

const stocks = computed(() => {
  stockStore.loading
    ? tableBlock.value?.statusLoading()
    : tableBlock.value?.statusNormal();
  return stockStore.stocks;
});

const searchList = ref([
  {label: 'Название', value: 'name'},
])
defineComponent({name: 'PageStocksTechnologisList'})
</script>
