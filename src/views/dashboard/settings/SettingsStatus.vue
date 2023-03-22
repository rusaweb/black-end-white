<template>
  <BasePageHeading title="Список статусов" subtitle="На этой странице отображаются информация про статусы"/>
  <div class="content">
    <BaseBlock title="Список статусов" ref="tableBlock">
      <template #options>
        <div class="space-x-1">
          <button class="btn btn-block-option" data-bs-target="#create-status" data-bs-toggle="modal">
            <i class="fa fa-plus me-1"></i>
            Добавить
          </button>
        </div>
      </template>
      <template #content>
        <div class="block-content block-content-full">
          <div class="table-responsive">
            <table class="table table-bordered table-striped table-vcenter"
                   v-if="statuses?.content.length">
              <thead>
              <tr>
                <th>Название</th>
                <th>Процент</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in statuses?.content" :key="item.id">
                <td class="fw-semibold fs-sm">{{ item.name }}</td>
                <td class="fw-semibold fs-sm">{{ item.order_total_amount_discount_percent }}</td>
                <td class="text-end">
                  <button
                      data-bs-toggle="modal"
                      data-bs-target="#update-status"
                      :data-bs-id="item.id"
                      class="btn btn-secondary"
                  >
                    <i class="fa fa-pen"></i>
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
            <div class="form-control text-center p-5" v-else>
              Список статусов пуст
            </div>
          </div>
        </div>
        <div class="block-content block-content-full bg-body-light">
          <BasePagination :data="statuses"/>
        </div>
      </template>
    </BaseBlock>
  </div>
  <ModalCreateStatus/>
  <ModalUpdateStatus/>
</template>

<script setup>
import BasePagination from "@/components/BasePagination.vue";
import ModalCreateStatus from "@/components/modals/status/CreateStatus.vue";
import ModalUpdateStatus from "@/components/modals/status/UpdateStatus.vue";
import {computed, ref} from "vue";
import router from "@/router";
import {onBeforeRouteUpdate} from "vue-router";
import {useStatusStore} from "@/stores/dashboard/user-status/administrator";

const tableBlock = ref(null);
const statusStore = useStatusStore();

statusStore.getStatuses(router.currentRoute.value.query);


onBeforeRouteUpdate((to, from, next) => {
  statusStore.getStatuses(to.query);
  next();
});

const statuses = computed(() => {
  statusStore.loading
      ? tableBlock.value?.statusLoading()
      : tableBlock.value?.statusNormal();
  return statusStore.statuses;
});
</script>
