<template>
  <BasePageHeading
    title="Этапы чистки"
    subtitle="На этой странице отображаются информация про этапы чистки"
  ></BasePageHeading>
  <div class="content">
    <BaseBlock title="Список этапов" ref="tableBlock">
      <template #options>
        <div class="space-x-1">
          <button
            class="btn btn-block-option"
            data-bs-target="#create-order-item-step"
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
              v-if="steps?.content.length"
            >
              <thead>
                <tr>
                  <th>Название</th>
                  <th>Дата создания</th>
                  <th style="width: 120px;"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="step in steps?.content" :key="step.id">
                  <td class="fw-semibold fs-sm">{{ step.name }}</td>
                  <td>
                    {{ new Date(step.created).toLocaleDateString("Ru-ru") }}
                    {{
                      new Date(step.created).toLocaleTimeString("Ru-ru", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    }}
                  </td>
                  <td>
                    <button
                        data-bs-toggle="modal"
                        data-bs-target="#update-order-item-step"
                        :data-bs-id="step.id"
                        class="btn btn-secondary me-2"
                    >
                      <i class="fa fa-pen"></i>
                    </button>
                    <button class="btn btn-danger" @click.prevent="deleteItem(step.id)">
                      <i class="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="form-control text-center p-5" v-else>
              Список этапов пуст
            </div>
          </div>
        </div>
        <div class="block-content block-content-full bg-body-light">
          <BasePagination :data="steps" />
        </div>
      </template>
    </BaseBlock>
  </div>
  <ModalCreateOrderItemStep />
  <ModalUpdateOrderItemStep />
</template>

<script setup>
import BasePagination from "@/components/BasePagination.vue";
import ModalCreateOrderItemStep from "@/components/modals/settings/order-item-step/CreateOrderItemStep.vue";
import ModalUpdateOrderItemStep from "@/components/modals/settings/order-item-step/UpdateOrderItemStep.vue";
import { useOrderItemStepAdministratorStore } from "@/stores/dashboard/order-item-step/administrator";
import { computed, ref } from "vue";
import router from "@/router";
import { onBeforeRouteUpdate } from "vue-router";
const tableBlock = ref(null);
const orderItemStepsStore = useOrderItemStepAdministratorStore();
orderItemStepsStore.getOrderItemSteps(router.currentRoute.value.query);
onBeforeRouteUpdate((to, from, next) => {
  orderItemStepsStore.getOrderItemSteps(to.query);
  next();
});
const deleteItem = (id) => {
  orderItemStepsStore.deleteOrderItemStep(id, ()=>{
    orderItemStepsStore.getOrderItemSteps(router.currentRoute.value.query);
  })
}
const steps = computed(() => {
  orderItemStepsStore.loading
    ? tableBlock.value?.statusLoading()
    : tableBlock.value?.statusNormal();
  return orderItemStepsStore.orderItemSteps;
});
</script>
