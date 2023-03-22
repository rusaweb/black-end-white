<template>
  <BasePageHeading title="Расходы" subtitle="На этой странице отображаются список расходов">
    <template #extra>
      <button
          type="button"
          class="btn btn-alt-primary me-2"
          v-click-ripple
          data-bs-toggle="modal"
          data-bs-target="#modal-create"
      >
        <i class="fa fa-plus opacity-50 me-1"></i>
        Добавить
      </button>
      <button
          type="button"
          class="btn btn-alt-primary"
          v-click-ripple
      >
        <label for="file-import"><i class="fa fa-file-import opacity-50 me-1"></i></label>
        <input type="file" accept=".xlsx, .xls, .csv" id="file-import" class="d-none" @change="onChange">
        <XlsxRead :file="file">
          <XlsxJson :sheet="selectedSheet" @parsed="submit" />
        </XlsxRead>
      </button>
    </template>
  </BasePageHeading>
  <div class="content">
    <BaseBlock title="История расходов" ref="tableBlock">
      <template #options>
        <div class="space-x-1">
          <button
              type="button"
              class="btn btn-sm btn-alt-secondary"
              @click="orderSearch = !orderSearch"
          >
            <i class="fa fa-search"></i>
          </button>
          <BaseFilterDropdown :list="filterList"/>
        </div>
      </template>
      <template #content>
        <BaseSearch v-if="orderSearch"/>
        <div class="block-content block-content-full" v-if="consumptions && consumptions.content.length">
          <div class="table-responsive">
            <table class="table table-bordered table-striped table-vcenter">
              <thead>
              <tr>
                <th>Сумма</th>
                <th>Категория</th>
                <th>Описание</th>
                <th>Дата</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              <tr
                  v-for="item in consumptions.content"
                  :key="item.id"
              >
                <td>{{ (item.amount).toLocaleString() }} {{item.currency}}</td>
                <td>{{ item.category }}</td>
                <td>{{ item.description }}</td>
                <td>
                  {{new Date(item.time).toLocaleDateString("Ru-ru")}}
                  {{new Date(item.time).toLocaleTimeString('Ru-ru', {hour: '2-digit', minute: '2-digit'})}}
                </td>
                <td class="text-end">
                  <button
                      @click="deleteItem(item.id)"
                      class="btn btn-secondary"
                  >
                    <i class="fa fa-trash"></i>
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
            <button
                type="button"
                class="btn btn-alt-primary me-2"
                v-click-ripple
                data-bs-toggle="modal"
                data-bs-target="#modal-create"
            >
              <i class="fa fa-plus opacity-50 me-1"></i>
              Добавить
            </button>
          </div>
        </div>
        <div class="block-content block-content-full bg-body-light" v-if="consumptions">
          <BasePagination :data="consumptions"/>
        </div>
      </template>
    </BaseBlock>
  </div>
  <div
      class="modal"
      id="modal-create"
      tabindex="-1"
      role="dialog"
      aria-labelledby="modal-create"
      aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <BaseBlock title="Обследование" transparent class="mb-0">
          <template #options>
            <button
                type="button"
                class="btn-block-option"
                data-bs-dismiss="modal"
                aria-label="Close"
            >
              <i class="fa fa-fw fa-times"></i>
            </button>
          </template>

          <template #content>
            <div class="block-content fs-sm">
              <form action="" class="items-push row">
                <div class="fw-normal">
                  <label for="code-product-stock" class="form-label">Сумма</label>
                  <div class="input-group">
                    <input type="text" id="code-product-stock" class="form-control" v-model="state.amount"
                           placeholder="Введите Сумму">
                    <div class="input-group-text">{{ state.currency }}</div>
                  </div>
                </div>
                <div class="fw-normal">
                  <label for="name-product-stock" class="form-label">Категория</label>
                  <input type="text" id="code-product-stock" class="form-control" v-model="state.category"
                         placeholder="Введите категория">
                </div>
                <div class="fw-normal">
                  <label for="code-product-stock" class="form-label">Комментарии</label>
                  <textarea type="text" id="code-product-stock" class="form-control" v-model="state.description"
                         placeholder="Введите Комментарий"></textarea>
                </div>
              </form>
            </div>
            <div class="block-content block-content-full text-end bg-body">
              <button
                  type="button"
                  class="btn btn-sm btn-success me-1"
                  data-bs-dismiss="modal"
                  @click="submit([state])"
              >
                Сохранить
              </button>
              <button
                  type="button"
                  class="btn btn-sm btn-alt-secondary"
                  data-bs-dismiss="modal"
              >
                Закрыть
              </button>
            </div>
          </template>
        </BaseBlock>
      </div>
    </div>
  </div>
</template>
<script setup>
import {computed, ref} from "vue";
import BaseFilterDropdown from "@/components/BaseFilterDropdown.vue";
import BaseSearch from "@/components/BaseSearch.vue";
import BasePagination from "@/components/BasePagination.vue";
import {XlsxRead, XlsxJson} from "vue3-xlsx/dist/vue3-xlsx.cjs.prod";
import {useConsumptionStore} from "@/stores/dashboard/consumption/administrator";
import router from "@/router";
import {onBeforeRouteUpdate} from "vue-router";
const orderSearch = ref(false)
const tableBlock = ref()
const filterList = [
  {
    label: 'Дата',
    value: 'date'
  },
  {
    label: 'Категория',
    value: 'cat'
  },
  {
    label: 'Все',
    value: null
  }
]
const file = ref()
const selectedSheet = ref()
const storeConsumption = useConsumptionStore()
const consumptions = computed(() => {
  storeConsumption.loading ? tableBlock.value?.statusLoading() : tableBlock.value?.statusNormal()
  return storeConsumption.consumptions
})
const state = ref(
    {
      "amount": null,
      "currency": "UZS",
      "description": "",
      "category": ""
    }
)
storeConsumption.getConsumptions(router.currentRoute.value.query)
onBeforeRouteUpdate((to, from, next) => {
  storeConsumption.getConsumptions(to.query)
  next()
})
const onChange = (event) => {
  file.value = event.target.files ? event.target.files[0] : null;
}
const submit = async (response) => {
  try {
    await storeConsumption.create({data: response})
    await storeConsumption.getConsumptions(router.currentRoute.value.query)
  }catch (e) {
    console.log(e)
  }
}
const deleteItem = async (id) => {
  try {
    await storeConsumption.deleteConsumption(id)
  }catch (e) {
    console.log(e)
  }
}
</script>
