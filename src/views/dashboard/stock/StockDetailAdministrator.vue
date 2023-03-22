<template>
  <BasePageHeading
    :title="stock?.name"
    :subtitle="'На этой странице отображаются список расходов и приходов продукта ' + stock?.name"
  />
  <div class="content">
    <BaseBlock title="Список расходов и приходов">
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
                  <th>Тип</th>
                  <th>Вес / Количество</th>
                  <th>Цена</th>
                  <th>Дата создания</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in stocks?.content"
                  :key="item.id"
                >
                  <td>{{ statusType[item.type] }}</td>
                  <td>{{item.amount}} {{ statusMeasure[stock?.measure_type] }}</td>
                  <td v-if="item.price">{{item.price.toLocaleString('Ru-ru') + ' UZS'}}</td>
                  <td v-else>---</td>
                  <td>
                    {{ new Date(item.created).toLocaleDateString("Ru-ru") }}
                  </td>
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
</template>

<script setup>
import { defineComponent, ref, computed } from "vue";
import BaseSearch from "@/components/BaseSearch.vue";
import BasePagination from "@/components/BasePagination.vue";
import { useStockActionAdministratorStore } from "@/stores/dashboard/stock-action/administrator";
import { useStockAdministratorStore } from "@/stores/dashboard/stock/administrator";
import router from "@/router";
import { onBeforeRouteUpdate } from "vue-router";
import statusMeasure from "@/data/status-measure";
import statusType from "@/data/status-stock-action-type";

const orderSearch = ref(false);
const searchList = ref([{ label: "Название", value: "name" }]);
const tableBlock = ref(null);
const stockStoreAction = useStockActionAdministratorStore();
const stockStore = useStockAdministratorStore();

stockStoreAction.getStocks({
  ...router.currentRoute.value.query,
  stock_item_id: router.currentRoute.value.params.id,
});
onBeforeRouteUpdate((to, from, next) => {
  stockStoreAction.getStocks({
    ...to.query,
    stock_item_id: router.currentRoute.value.params.id,
  });
  next();
});

const stocks = computed(() => {
  stockStoreAction.loading
    ? tableBlock.value?.statusLoading()
    : tableBlock.value?.statusNormal();
  return stockStoreAction.stocks;
});

stockStore.getStock(router.currentRoute.value.params.id)

const stock = computed(() => stockStore.stock);
defineComponent({ name: "PageStocksActionAdministratorList" });
</script>