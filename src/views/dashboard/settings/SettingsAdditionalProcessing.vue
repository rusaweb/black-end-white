<template>
  <BasePageHeading
      title="Дополнительные обработки"
      subtitle="На этой странице отображаются дополнительные обработки"
  ></BasePageHeading>
  <div class="content">
    <BaseBlock title="Список дополнительных обработок" ref="tableBlock">
      <template #options>
        <div class="space-x-1">
          <button
              class="btn btn-block-option"
              data-bs-target="#create-additional-processing"
              data-bs-toggle="modal"
          >
            <i class="fa fa-plus me-1"></i>
            Добавить
          </button>
        </div>
      </template>
      <template #content>
        <div class="block-content block-content-full">
          <div class="table-responsive">
            <table
                class="table table-bordered table-striped table-vcenter"
                v-if="processing_list?.content.length"
            >
              <thead>
              <tr>
                <th>Название</th>
                <th>Тип</th>
                <th>Цена / Процент</th>
                <th>Дата создания</th>
                <th style="width: 125px;"></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="type in processing_list?.content" :key="type.id">
                <td class="fw-semibold fs-sm">{{ type.name }}</td>
                <td class="fw-semibold fs-sm">{{ type.price.type === 'fixed_price' ? 'Цена' : 'Процент' }}</td>
                <td v-if="type.price.type === 'fixed_price'">{{ type.price.amount.toLocaleString('ru-Ru') }} сум</td>
                <td v-else>{{ type.price.percent.toLocaleString('ru-Ru') }} %</td>
                <td>
                  {{ new Date(type.created).toLocaleDateString("Ru-ru") }}
                  {{
                    new Date(type.created).toLocaleTimeString("Ru-ru", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  }}
                </td>

                <td>
                  <button
                      data-bs-toggle="modal"
                      data-bs-target="#update-additional-processing"
                      :data-bs-id="type.id"
                      class="btn btn-secondary me-2"
                  >
                    <i class="fa fa-pen"></i>
                  </button>
                  <button
                      class="btn btn-danger me-2"
                      @click.prevent="deleteServices(type.id)"
                  >
                    <i class="fa fa-trash"></i>
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
            <div class="form-control text-center p-5" v-else>
              Список услуг пуст
            </div>
          </div>
        </div>
        <div class="block-content block-content-full bg-body-light">
          <BasePagination :data="processing_list" />
        </div>
      </template>
    </BaseBlock>
  </div>
  <ModalCreateAdditionalProcessing />
  <ModalUpdateAdditionalProcessing />
</template>

<script setup>
import ModalCreateAdditionalProcessing from "@/components/modals/settings/additional-processing/Create.vue";
import ModalUpdateAdditionalProcessing from "@/components/modals/settings/additional-processing/Update.vue";
import BasePagination from "@/components/BasePagination.vue";
import {useAdditionalProcessingAdministratorStore} from "@/stores/dashboard/additional-processing/administrator";
import { computed, ref } from "vue";
import { onBeforeRouteUpdate } from "vue-router";
import router from "@/router";

const tableBlock = ref(null);
const storeAdditionalProcessing = useAdditionalProcessingAdministratorStore()

storeAdditionalProcessing.getAdditionalProcessingList(router.currentRoute.value.query);
const processing_list = computed(() => {
  storeAdditionalProcessing.loading
      ? tableBlock.value?.statusLoading()
      : tableBlock.value?.statusNormal();
  return storeAdditionalProcessing.processing_list;
});
onBeforeRouteUpdate((to, from, next) => {
  storeAdditionalProcessing.getAdditionalProcessingList(to.query);
  next();
});
const deleteServices = async (id) => {
  await storeAdditionalProcessing.deleteAdditionalProcessing(id, async () => {
    await storeAdditionalProcessing.getAdditionalProcessingList(router.currentRoute.value.query);
  })
}
</script>