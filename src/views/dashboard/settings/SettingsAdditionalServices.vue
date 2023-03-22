<template>
  <BasePageHeading
      title="Дополнительные услуги"
      subtitle="На этой странице отображаются дополнительные услуги"
  ></BasePageHeading>
  <div class="content">
    <BaseBlock title="Список дополнительных услуг" ref="tableBlock">
      <template #options>
        <div class="space-x-1">
          <button
              class="btn btn-block-option"
              data-bs-target="#create-additional-service"
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
                v-if="services?.content.length"
            >
              <thead>
              <tr>
                <th>Название</th>
                <th>Цена</th>
                <th>Дата создания</th>
                <th style="width: 125px;"></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="type in services?.content" :key="type.id">
                <td class="fw-semibold fs-sm">{{ type.name }}</td>
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
                      data-bs-target="#update-additional-service"
                      :data-bs-id="type.id"
                      class="btn btn-secondary me-2"
                  >
                    <i class="fa fa-pen"></i>
                  </button>
                  <button
                      class="btn btn-danger me-2"
                      v-if="type.selling"
                      @click.prevent="deleteServices(type.id)"
                  >
                    <i class="fa fa-pause-circle"></i>
                  </button>
                  <button
                      class="btn btn-success me-2"
                      v-else
                      @click.prevent="startServices(type.id)"
                  >
                    <i class="fa fa-play-circle"></i>
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
          <BasePagination :data="services" />
        </div>
      </template>
    </BaseBlock>
  </div>
  <ModalCreateAdditionalService />
  <ModalUpdateAdditionalService />
</template>

<script setup>
import ModalCreateAdditionalService from "@/components/modals/settings/additional-service/Create.vue";
import ModalUpdateAdditionalService from "@/components/modals/settings/additional-service/Update.vue";
import BasePagination from "@/components/BasePagination.vue";
import { useAdditionalServiceAdministratorStore} from "@/stores/dashboard/additional-services/administrator";
import { computed, ref } from "vue";
import { onBeforeRouteUpdate } from "vue-router";
import router from "@/router";

const tableBlock = ref(null);
const storeAdditionalService = useAdditionalServiceAdministratorStore()

storeAdditionalService.getAdditionalServiceList(router.currentRoute.value.query);
const services = computed(() => {
  storeAdditionalService.loading
      ? tableBlock.value?.statusLoading()
      : tableBlock.value?.statusNormal();
  return storeAdditionalService.services;
});
onBeforeRouteUpdate((to, from, next) => {
  storeAdditionalService.getAdditionalServiceList(to.query);
  next();
});
const deleteServices = async (id) => {
  await storeAdditionalService.deleteAdditionalService(id, async () => {
    await storeAdditionalService.getAdditionalServiceList(router.currentRoute.value.query);
  })
}
const startServices = async (id) => {
  await storeAdditionalService.startAdditionalService(id)
  await storeAdditionalService.getAdditionalServiceList(router.currentRoute.value.query);
}
</script>