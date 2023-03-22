<template>
  <BasePageHeading>
    <div class="d-flex align-items-start">
      <button class="btn btn-sm btn-alt-secondary" @click="() => $router.back()">
        <i class="fa fa-arrow-left"></i>
      </button>
      <div class="ms-4">
        <h1 class="h3 fw-bold mb-2">Информация о выдачи заказе </h1>
        <h2 class="fs-base lh-base fw-medium text-muted mb-0">На этой странице отображаются информация о выдачи заказа</h2>
      </div>
    </div>

  </BasePageHeading>
  <div class="content">
    <div
        class="alert alert-info d-flex justify-content-between align-items-center"
        v-if="
           order?.status.type === 'deliver_to_department' &&
           issue?.status.type === 'in_progress' &&
           issue?.type === 'FROM_CUSTOMER_TO_DEPARTMENT' &&
           issue?.address.type === 'department'
      ">
      <i class="fa fa-info-circle h5 mb-0 me-3"></i>
      <h5 class="mb-0 me-auto">Клиент привез заказ в отделении?</h5>
      <button
          type="button"
          class="btn btn-sm btn-success me-3"
          v-click-ripple
          @click.prevent="confirmCustomer"
      >
        Принять
      </button>
    </div>
    <div
        class="alert alert-danger d-flex justify-content-between align-items-center"
        v-if="error">
      <i class="fa fa-window-close h5 mb-0 me-3"></i>
      <h5 class="mb-0 me-auto">{{ error }}</h5>
      <button
          type="button"
          class="btn btn-sm btn-alt-danger me-3"
          v-click-ripple
          @click.prevent="error = null"
      >
        <i class="fa fa-close"></i>
      </button>
    </div>
    <BaseBlock :title="'Информация о заказе #' + $route.params.order_id">
      <template #content>
        <div class="block-content block-content-full">
          <ul class="list-group">
            <li class="list-group-item d-md-flex d-block justify-content-between align-items-center">
              Тип:
              <div class="col-md-6 col-12 mt-2">
                <div class="input-group">
                  <span class="form-control">
                    {{ statusIssue[issue?.type] || '...' }}
                  </span>
                </div>
              </div>
            </li>
            <li class="list-group-item d-md-flex d-block justify-content-between align-items-center">
              Адрес:
              <div class="col-md-6 col-12 mt-2">
                <div class="flex-grow-1 form-control" v-if="issue?.address.type === 'address_line'">
                  <div class="fw-semibold">Адрес: {{ issue?.address.address_line }}</div>
                  <div class="fw-normal text-muted mb-2">Орентир: {{ issue?.address.reference_point }}
                  </div>
                  <button
                      class="btn btn-sm btn-alt-secondary me-2"
                      data-bs-target="#map"
                      data-bs-toggle="modal"
                      @click.prevent="storeMap.setYMap(issue?.address.location)"
                  >
                    Посмотреть на карте
                  </button>
                </div>
                <div class="flex-grow-1 form-control" v-else>
                  <div class="fw-semibold mb-2">
                    C отделение
                  </div>
                </div>
              </div>
            </li>
            <li class="list-group-item d-md-flex d-block justify-content-between align-items-center">
              Статус:
              <div class="col-md-6 col-12 mt-2">
                <div class="input-group">
                  <span class="form-control">
                    {{ statusIssue[issue?.status.type] || '...' }}
                  </span>
                </div>
              </div>
            </li>
            <li class="list-group-item d-flex justify-content-between" v-if="order?.status.type === 'deliver_to_department'">
              Время:
              <div class="col-6">
                <div class="input-group" v-if="issue?.desired_delivery_time">
                  <div class="form-control">
                    {{ new Date(issue?.desired_delivery_time).toLocaleDateString("Ru-ru") }}
                    {{
                      new Date(issue?.desired_delivery_time).toLocaleTimeString('Ru-ru', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    }}
                  </div>
                  <button class="btn btn-alt-secondary" @click.prevent="issue.desired_delivery_time = null">
                    <i class="fa fa-pen"></i>
                  </button>
                </div>
                <div class="input-group" v-else>
                  <input
                      type="datetime-local"
                      class="form-control"
                      v-model="desired_receive_delivery_time"
                  />
                  <button class="btn btn-alt-secondary" @click.prevent="saveDeliveryTime(issue.id, desired_receive_delivery_time)">
                    <i class="fa fa-check"></i>
                  </button>
                </div>
              </div>
            </li>
            <li class="list-group-item d-flex justify-content-between" v-else>
              Время:
              <div class="col-6">
                <div class="input-group" v-if="issue?.desired_delivery_time">
                  <span class="form-control">
                    {{ new Date(issue?.desired_delivery_time).toLocaleDateString("Ru-ru") }}
                    {{
                      new Date(issue?.desired_delivery_time).toLocaleTimeString('Ru-ru', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    }}
                  </span>
                </div>
                <div class="input-group" v-else>
                  <span class="form-control">
                    Не установленно
                  </span>
                </div>
              </div>
            </li>
            <li class="list-group-item d-md-flex d-block justify-content-between align-items-center" :class="{'text-danger':subscription_error}">
              Подпись:
              <div class="col-md-6 col-12 mt-2">
                <button v-if="issue?.subscription" class="btn btn-sm btn-alt-secondary me-2" @click="openImage(issue?.subscription.base64)">
                  Посмотреть
                </button>
                <span class="form-control" v-else>
                  Не установленно
                </span>
              </div>
            </li>
            <li class="list-group-item d-md-flex d-block justify-content-between align-items-center">
              Цена доставки:
              <div class="col-md-6 col-12 mt-2">
                <div class="input-group">
                  <span class="form-control">
                    {{ issue?.price.amount || '0' }} {{ issue?.price.currency || '...' }}
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </template>
    </BaseBlock>
  </div>
  <ModalYMap />
</template>

<script setup>
// import ModalMap from "@/components/modals/Map.vue";
import ModalYMap from "@/components/modals/yMap.vue";
import router from "@/router";
import {computed, ref} from "vue";

// import {useMapStore} from "@/stores/dashboard/map";
import { useYMapStore } from "@/stores/dashboard/yMap";

import {openImage} from "@/utils/openImage";
import statusIssue from "@/data/status-issue";
import {useOrderIssuesUserStore} from "@/stores/dashboard/order-issue/user";
import {useOrderUserStore} from "@/stores/dashboard/order/user";

const error = ref()
const storeMap = useYMapStore()
const issueStore = useOrderIssuesUserStore()
const orderStore = useOrderUserStore()
const issue = computed(() => issueStore.orderIssuesById)
const order = computed(() => orderStore.order)
orderStore.getOrder(router.currentRoute.value.params.order_id)
issueStore.getOrderIssuesById(router.currentRoute.value.params.id)

const desired_receive_delivery_time = ref()
const subscription_error = ref(false)
const saveDeliveryTime = async (id, time) => {
  try {
    await issueStore.updateOrderIssueDesiredDeliveryTime({
      desired_delivery_time: Math.floor(new Date(time).getTime() / 1000),
      id
    })
    await issueStore.getOrderIssuesById(router.currentRoute.value.params.id)
  } catch (e) {
    console.log(e)
  }
}
</script>
