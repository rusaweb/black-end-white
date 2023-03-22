<template>
  <BasePageHeading
      title="Статистика"
      subtitle="На этой странице отображаются Статистика"
  ></BasePageHeading>
  <div class="content">
    <div
        class="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center py-2 text-center text-md-start"
    >
      <div class="flex-grow-1 mb-1 mb-md-0">
      </div>
      <div class="mt-3 mt-md-0 ms-md-3 space-x-1">
        <div class="dropdown d-inline-block">
          <FlatPickr
              id="example-flatpickr-range"
              class="form-control"
              placeholder="Фильтр"
              v-model="flatPickrState.dateRange"
              :config="flatPickrState.configRange"
              @onChange="changeDate"
          />
        </div>
      </div>
    </div>
    <!-- Overview -->
    <div class="row items-push" v-if="analytics">
      <div class="col-sm-6 col-xxl-4" @click.prevent="type = 'Доход'">
        <!-- Pending Orders -->
        <BaseBlock class="d-flex flex-column h-100 mb-0">
          <template #content>
            <div
                class="block-content block-content-full flex-grow-1 d-flex justify-content-between align-items-center"
            >
              <dl class="mb-0">
                <dt class="fs-3 fw-bold">{{ analytics.income_total.toLocaleString('ru-Ru') }} сум</dt>
                <dd class="fs-sm fw-medium fs-sm fw-medium text-muted mb-0">
                  Доход
                </dd>
              </dl>
              <div class="item item-rounded-lg bg-body-light">
                <i class="fa-solid fa-arrow-trend-up fs-3 text-primary"></i>
              </div>
            </div>
            <div class="bg-body-light rounded-bottom">
              <a
                  class="block-content block-content-full block-content-sm fs-sm fw-medium d-flex align-items-center justify-content-between"
                  href="javascript:void(0)"
              >
                <span>Посмотреть список</span>
                <i
                    class="fa fa-arrow-alt-circle-right ms-1 opacity-25 fs-base"
                ></i>
              </a>
            </div>
          </template>
        </BaseBlock>
        <!-- END Pending Orders -->
      </div>
      <div class="col-sm-6 col-xxl-4" @click.prevent="type = 'Расход'">
        <!-- New Customers -->
        <BaseBlock class="d-flex flex-column h-100 mb-0">
          <template #content>
            <div
                class="block-content block-content-full flex-grow-1 d-flex justify-content-between align-items-center"
            >
              <dl class="mb-0">
                <dt class="fs-3 fw-bold">{{
                    (analytics.stock_actions_consumption_total + analytics.other_consumptions_total).toLocaleString('ru-Ru')
                  }} сум
                </dt>
                <dd class="fs-sm fw-medium fs-sm fw-medium text-muted mb-0">
                  Расход
                </dd>
              </dl>
              <div class="item item-rounded-lg bg-body-light">
                <i class="fa-solid fa-arrow-trend-down fs-3 text-primary"></i>
              </div>
            </div>
            <div class="bg-body-light rounded-bottom">
              <a
                  class="block-content block-content-full block-content-sm fs-sm fw-medium d-flex align-items-center justify-content-between"
                  href="javascript:void(0)"
              >
                <span>Посмотреть список</span>
                <i
                    class="fa fa-arrow-alt-circle-right ms-1 opacity-25 fs-base"
                ></i>
              </a>
            </div>
          </template>
        </BaseBlock>
        <!-- END New Customers -->
      </div>
      <div class="col-sm-6 col-xxl-4">
        <!-- Messages -->
        <BaseBlock class="d-flex flex-column h-100 mb-0">
          <template #content>
            <div
                class="block-content block-content-full flex-grow-1 d-flex justify-content-between align-items-center"
            >
              <dl class="mb-0">
                <dt class="fs-3 fw-bold">
                  {{ (analytics.income_total - (analytics.stock_actions_consumption_total + analytics.other_consumptions_total)).toLocaleString('ru-Ru') }}
                </dt>
                <dd class="fs-sm fw-medium fs-sm fw-medium text-muted mb-0">
                  Прибыль
                </dd>
              </dl>
              <div class="item item-rounded-lg bg-body-light">
                <i class="fa fa-money-bill fs-3 text-primary"></i>
              </div>
            </div>
            <div class="bg-body-light rounded-bottom" @click.prevent="reload">
              <a
                  class="block-content block-content-full block-content-sm fs-sm fw-medium d-flex align-items-center justify-content-between"
                  href="javascript:void(0)"
              >
                <span>Обновить список</span>
                <i
                    v-if="!loader"
                    class="fa fa-circle-dot ms-1 opacity-25 fs-base"
                ></i>
                <div v-else class="spinner-border spinner-border-sm btn-alt-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </a>
            </div>
          </template>
        </BaseBlock>
        <!-- END Messages -->
      </div>
    </div>
    <BaseBlock title="Список оплат" v-if="type === 'Доход'">
      <template #content>
        <div
            class="block-content mb-3"
            :class="{'block-content-full': !billing?.content?.length}"
        >
          <template v-if="billing?.content?.length">
            <div class="table-responsive">
              <table class="table table-bordered table-striped table-vcenter">
                <thead>
                <tr>
                  <th>ID заказа</th>
                  <th>Цена</th>
                  <th>Тип</th>
                  <th>Дата</th>
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="item in billing?.content"
                    :key="item.id"
                >
                  <td class="fw-semibold fs-sm text-primary" style="cursor:pointer;"
                      @click.prevent="$router.push({name: 'order-operator-detail', params: {id: item.order_id }})">
                    #{{ item.order_id }}
                  </td>
                  <td class="fw-semibold fs-sm">
                    {{ item.amount.toLocaleString('ru-Ru') }} сум
                  </td>
                  <td class="fw-semibold fs-sm">
                    {{ statusPayment[item.type.type] }}
                  </td>
                  <td class="fw-semibold fs-sm">
                  <span>
                    {{ new Date(item.created).toLocaleDateString("Ru-ru") }}
                    {{ new Date(item.created).toLocaleTimeString('Ru-ru', {hour: '2-digit', minute: '2-digit'}) }}
                  </span>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>

          </template>
          <div class="form-control d-flex flex-column align-items-center justify-content-center p-5" v-else>Список
            пуст
          </div>
        </div>
        <div class="block-content block-content-full bg-body-light">
          <BasePagination :data="billing"/>
        </div>
      </template>
    </BaseBlock>
    <BaseBlock title="Прочее расходы" v-if="type === 'Расход'">
      <template #options>
        <div class="text-primary">{{ analytics.other_consumptions_total.toLocaleString('ru-Ru') }} сум</div>
      </template>
      <template #content>
        <div
            class="block-content mb-3"
            :class="{'block-content-full': !consumptions?.content?.length}"
        >
          <template v-if="consumptions?.content?.length">
            <div class="table-responsive">
              <table class="table table-bordered table-striped table-vcenter">
                <thead>
                <tr>
                  <th>Категория</th>
                  <th>Описание</th>
                  <th>Сумма</th>
                  <th>Дата</th>
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="item in consumptions.content"
                    :key="item.id"
                >
                  <td>{{ item.category }}</td>
                  <td>{{ item.description }}</td>
                  <td>-{{ (item.amount).toLocaleString() }} {{ item.currency }}</td>
                  <td>
                    {{ new Date(item.time).toLocaleDateString("Ru-ru") }}
                    {{ new Date(item.time).toLocaleTimeString('Ru-ru', {hour: '2-digit', minute: '2-digit'}) }}
                  </td>
                </tr>
                </tbody>
              </table>
            </div>

          </template>
          <div class="form-control d-flex flex-column align-items-center justify-content-center p-5" v-else>Список
            пуст
          </div>
        </div>
        <div class="block-content block-content-full bg-body-light">
          <BasePagination :data="consumptions"/>
        </div>
      </template>
    </BaseBlock>
    <BaseBlock title="Расходы со склада" v-if="type === 'Расход'">
      <template #options>
        <div class="text-primary">{{ analytics.stock_actions_consumption_total.toLocaleString('ru-Ru') }} сум</div>
      </template>
      <template #content>
        <div
            class="block-content mb-3"
            :class="{'block-content-full': !stocks?.content?.length}"
        >
          <template v-if="stocks?.content?.length">
            <div class="table-responsive">
              <table class="table table-bordered table-striped table-vcenter">
                <thead>
                <tr>
                  <th>Товар</th>
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
                  <td>{{ item.stock_item.name }}</td>
                  <td>{{ item.amount }} {{ statusMeasure[item.stock_item?.measure_type] }}</td>
                  <td v-if="item.price">{{ item.price.toLocaleString('Ru-ru') + ' UZS' }}</td>
                  <td v-else>---</td>
                  <td>
                    {{ new Date(item.created).toLocaleDateString("Ru-ru") }}
                  </td>
                </tr>
                </tbody>
              </table>
            </div>

          </template>
          <div class="form-control d-flex flex-column align-items-center justify-content-center p-5" v-else>Список
            пуст
          </div>
        </div>
        <div class="block-content block-content-full bg-body-light">
          <BasePagination :data="stocks"/>
        </div>
      </template>
    </BaseBlock>
  </div>
</template>

<script setup>
import {computed, onMounted, reactive, ref} from "vue";
import {useAdminAnalytics} from "@/stores/dashboard/money-analytics/administrator";
import {useBillingTransactionAdministratorStore} from "@/stores/dashboard/billing-transaction/administrator";
import statusPayment from "@/data/status-payment";
import BasePagination from "@/components/BasePagination.vue";
import {useStockActionAdministratorStore} from "@/stores/dashboard/stock-action/administrator";
import statusMeasure from "@/data/status-measure";
import {useConsumptionStore} from "@/stores/dashboard/consumption/administrator";
import router from "@/router";
import {onBeforeRouteUpdate} from "vue-router";
import FlatPickr from "vue-flatpickr-component";
import {Russian} from 'flatpickr/dist/l10n/ru';

// Flatpickr variables
const flatPickrState = reactive({
  // Initial values
  dateRange: null,
  configRange: {mode: "range", locale: Russian},
});
const analyticsStore = useAdminAnalytics()
const billingStore = useBillingTransactionAdministratorStore()
const stockStore = useStockActionAdministratorStore()
const analytics = computed(() => analyticsStore.analytics)
const billing = computed(() => billingStore.billing)
const stocks = computed(() => stockStore.stocks)
const type = ref('Доход')
const storeConsumption = useConsumptionStore()
const consumptions = computed(() => storeConsumption.consumptions)
const loader = ref(false)
storeConsumption.getConsumptions(router.currentRoute.value.query)
// Доход
// Расход
// Прибыль
onMounted(async () => {
  await load(router.currentRoute.value)
})

onBeforeRouteUpdate(async (to, from, next) => {
  if (to.query.from && to.query.to) {
    await analyticsStore.getAnalytics({from: to.query.from, to: to.query?.to})
  } else {
    await analyticsStore.getAnalytics({})
  }
  await billingStore.getBilling(to.query)
  await stockStore.getStocks({type: 'consumption', ...to.query})
  await storeConsumption.getConsumptions(to.query)
  next();
});
const load = async (to) => {
  loader.value = true
  if (to.query.from && to.query.to) {
    await analyticsStore.getAnalytics({from: to.query.from, to: to.query?.to})
  } else {
    await analyticsStore.getAnalytics({})
  }
  await billingStore.getBilling(to.query)
  await stockStore.getStocks({type: 'consumption'})
  await storeConsumption.getConsumptions(router.currentRoute.value.query)
  loader.value = false
}
const reload = async () => {
  loader.value = true
  await router.push({query: {}})
  loader.value = false
}
const changeDate = () => {
  if (flatPickrState.dateRange) {
    const query = {...router.currentRoute.value.query}
    query['createdAfter'] = new Date(flatPickrState.dateRange.split(' — ').at(0)).getTime()
    query['createdBefore'] = new Date(flatPickrState.dateRange.split(' — ').at(1)).getTime()
    query['created_after'] = new Date(flatPickrState.dateRange.split(' — ').at(0)).getTime()
    query['created_before'] = new Date(flatPickrState.dateRange.split(' — ').at(1)).getTime()
    query['timeAfter'] = new Date(flatPickrState.dateRange.split(' — ').at(0)).getTime()
    query['timeBefore'] = new Date(flatPickrState.dateRange.split(' — ').at(1)).getTime()
    query['from'] = new Date(flatPickrState.dateRange.split(' — ').at(0)).getTime()
    query['to'] = new Date(flatPickrState.dateRange.split(' — ').at(1)).getTime()
    router.push({query})
  }
}

</script>
<style lang="scss">
@import "flatpickr/dist/flatpickr.css";
@import "@/assets/scss/vendor/flatpickr";
</style>