<template>
  <BasePageHeading
    title="Список вещей"
    subtitle="На этой странице отображаются информация про список вещей"
  ></BasePageHeading>
  <div class="content">
    <BaseBlock title="Список вещей" ref="tableBlock">
      <template #options>
        <div class="space-x-1">
          <button
            class="btn btn-block-option"
            data-bs-target="#create-order-item-type"
            data-bs-toggle="modal"
          >
            <i class="fa fa-plus me-1"></i> Добавить
          </button>
        </div>
      </template>
      <template #content>
        <ul class="nav nav-tabs nav-tabs-block" role="tablist">
          <li class="nav-item">
            <button
                class="nav-link"
                :class="{active: !disabled}"
                @click="disabled = false"
            >
              Not disabled
            </button>
          </li>
          <li class="nav-item">
            <button
                class="nav-link"
                :class="{active: disabled}"
                @click="disabled = true"
            >
              Disabled
            </button>
          </li>
        </ul>
        <div class="block-content block-content-full">
          <div class="table-responsive">
            <table
              class="table table-bordered table-striped table-vcenter"
              v-if="types?.content.length"
            >
              <thead>
                <tr>
                  <th>Название</th>
                  <th>Категория</th>
                  <th>Цена</th>
                  <th>Дата создания</th>
                  <th style="width: 60px;"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="type in types?.content?.filter(e => e.disabled === disabled)" :key="type.id">
                  <td class="fw-semibold fs-sm">{{ type.name }}</td>
                  <td class="fw-semibold fs-sm">{{ type.category?.name || '--------' }}</td>
                  <td>{{ type.price.amount }} {{ type.price.currency }}</td>
                  <td>
                    {{ new Date(type.created).toLocaleDateString("Ru-ru") }}
                    {{
                      new Date(type.created).toLocaleTimeString("Ru-ru", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    }}
                  </td>

                  <td class="text-end">
                    <button
                        data-bs-toggle="modal"
                        data-bs-target="#update-order-item-type"
                        :data-bs-id="type.id"
                        class="btn btn-secondary me-2"
                    >
                      <i class="fa fa-pen"></i>
                    </button>
<!--                    <div class="d-flex">-->
<!--                      <button class="btn btn-danger ms-2"-->
<!--                              v-if="user?.roles?.includes('ADMINISTRATOR')"-->
<!--                              @click="deleteOrderItem(type.id)">-->
<!--                        <i class="fa fa-trash"></i>-->
<!--                      </button>-->
<!--                    </div>-->
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="form-control text-center p-5" v-else>
              Список вещей пуст
            </div>
          </div>
        </div>
        <div class="block-content block-content-full bg-body-light">
          <BasePagination :data="types" />
        </div>
      </template>
    </BaseBlock>
  </div>
  <ModalCreateOrderItemType />
  <ModalUpdateOrderItemType />
</template>

<script setup>
import BasePagination from "@/components/BasePagination.vue";
import { useOrderItemTypeAdministratorStore } from "@/stores/dashboard/order-item-type/administrator";
import ModalCreateOrderItemType from "@/components/modals/settings/oreder-item-type/CreateOrderItemType.vue";
import { computed, ref } from "vue";
import { onBeforeRouteUpdate } from "vue-router";
import router from "@/router";
import ModalUpdateOrderItemType from "@/components/modals/settings/oreder-item-type/UpdateOrderItemType.vue";
import {storeToRefs} from "pinia";

const tableBlock = ref(null);
const orderItemTypeStore = useOrderItemTypeAdministratorStore();
const { disabled } = storeToRefs(orderItemTypeStore)



orderItemTypeStore.getOrderItemTypes(router.currentRoute.value.query);
const types = computed(() => {
  orderItemTypeStore.loading
    ? tableBlock.value?.statusLoading()
    : tableBlock.value?.statusNormal();
  return orderItemTypeStore.orderItemTypes;
});
onBeforeRouteUpdate((to, from, next) => {
  orderItemTypeStore.getOrderItemTypes(to.query);
  next();
});
</script>
