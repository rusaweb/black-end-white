<template>
  <BasePageHeading
    :title="stock?.name"
    :subtitle="'На этой странице отображаются список расходов и приходов продукта ' + stock?.name"
  >
    <template #extra>
      <button
        type="button"
        class="btn btn-alt-primary me-2"
        v-click-ripple
        data-bs-toggle="modal"
        data-bs-target="#modal-create-consumption"
      >
        <i class="fa fa-minus opacity-50 me-1"></i>
        Расход
      </button>
      <button
        type="button"
        class="btn btn-alt-primary"
        v-click-ripple
        data-bs-toggle="modal"
        data-bs-target="#modal-create-coming"
      >
        <i class="fa fa-plus opacity-50 me-1"></i>
        Приход
      </button>
    </template>
  </BasePageHeading>
  <div class="content" v-if="stock_amount">
    <BaseBlock>
      <template #content>
        <div class="block-content block-content-full">
          <div class="form-control d-flex align-items-center justify-content-center p-5"><h2 class="mb-0">Остаток: {{stock_amount?.toLocaleString('ru-Ru')}} {{statusMeasure[stock?.measure_type]}}</h2> </div>
        </div>
      </template>
    </BaseBlock>
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
  <ModalCreateStockComing />
  <ModalCreateStockСonsumption />
</template>

<script setup>
import { defineComponent, ref, computed } from "vue";
import ModalCreateStockComing from "@/components/modals/stock/CreateStockIncome.vue";
import ModalCreateStockСonsumption from "@/components/modals/stock/CreateStockСonsumption.vue";
import BaseSearch from "@/components/BaseSearch.vue";
import BasePagination from "@/components/BasePagination.vue";
import { useStockActionTechnologistStore } from "@/stores/dashboard/stock-action/technologist";
import { useStockTechnologistStore } from "@/stores/dashboard/stock/technologist";
import router from "@/router";
import { onBeforeRouteUpdate } from "vue-router";
import statusMeasure from "@/data/status-measure";
import statusType from "@/data/status-stock-action-type";

const orderSearch = ref(false);
const searchList = ref([{ label: "Название", value: "name" }]);
const tableBlock = ref(null);
const stockStoreAction = useStockActionTechnologistStore();
const stockStore = useStockTechnologistStore();

stockStoreAction.getStocks({
  ...router.currentRoute.value.query,
  stock_item_id: router.currentRoute.value.params.id,
});

stockStoreAction.getStockAmount( router.currentRoute.value.params.id );
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
const stock_amount = computed(() => stockStoreAction.stock_amount);

stockStore.getStock(router.currentRoute.value.params.id)

const stock = computed(() => stockStore.stock);
defineComponent({ name: "PageStocksActionTechnologisList" });
</script>