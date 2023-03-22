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
    <div
        class="alert alert-info d-flex justify-content-between align-items-center"
        v-if="
         order?.status.type === 'deliver_to_department' &&
         issue?.status.type === 'in_progress' &&
         issue?.type === 'FROM_CUSTOMER_TO_DEPARTMENT' &&
         issue?.address.type === 'address_line'
      ">
      <i class="fa fa-info-circle h5 mb-0 me-3"></i>
      <h5 class="mb-0 me-auto">Курьер привез заказ в отделении?</h5>
      <button
          type="button"
          class="btn btn-sm btn-success me-3"
          v-click-ripple
          @click.prevent="confirmCustomer"
      >
        Принять
      </button>
    </div>
    <div class="alert alert-info d-flex justify-content-between align-items-center"
         v-if="issue?.status.type === 'in_progress' && (issue?.type === 'FROM_DEPARTMENT_TO_CUSTOMER' || issue?.type === 'FROM_DEPARTMENT_TO_CUSTOMER_EXTRA' ) && issue?.address.type === 'department'">
      <i class="fa fa-info-circle h5 mb-0 me-3"></i>
      <h5 class="mb-0 me-auto">Клиент прибыл забрать заказ?</h5>
      <button
          type="button"
          class="btn btn-sm btn-success me-3"
          v-click-ripple
          @click.prevent="confirmCustomer"
      >
        Принять
      </button>
    </div>
    <div class="alert alert-info d-flex justify-content-between align-items-center"
         v-if="issue?.status.type === 'in_progress' && (issue?.type === 'FROM_DEPARTMENT_TO_CUSTOMER' || issue?.type === 'FROM_DEPARTMENT_TO_CUSTOMER_EXTRA' ) && issue?.address.type === 'address_line'">
      <i class="fa fa-info-circle h5 mb-0 me-3"></i>
      <h5 class="mb-0 me-auto">Курьер прибыл забрать заказ?</h5>
      <button
          type="button"
          class="btn btn-sm btn-success me-3"
          v-click-ripple
          @click.prevent="confirmCustomer"
      >
        Принять
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
              Код багажа:
              <div class="col-md-6 col-12 mt-2">
                <div class="input-group" v-if="
                      (issue?.status.type === 'in_progress' || issue?.status.type === 'pending') &&
                      (issue?.type === 'FROM_DEPARTMENT_TO_CUSTOMER' || issue?.type === 'FROM_DEPARTMENT_TO_CUSTOMER_EXTRA') &&
                      issue?.address.type === 'address_line' && !issue?.bag_code">
                  <input placeholder="------" type="text" v-model="bagCode" class="form-control">
                  <button
                      @click="bagCodeRegister"
                      class="btn btn-success"

                  >Установить</button>
                </div>
                <div class="input-group" v-else-if="issue?.bag_code">
                  <span class="form-control">
                    {{ issue?.bag_code }}
                  </span>
                  <button
                      @click="issue.bag_code = ''"
                      class="btn btn-success"
                      v-if="
                      (issue?.status.type === 'in_progress' || issue?.status.type === 'pending') &&
                      (issue?.type === 'FROM_DEPARTMENT_TO_CUSTOMER' || issue?.type === 'FROM_DEPARTMENT_TO_CUSTOMER_EXTRA') &&
                      issue?.address.type === 'address_line'"
                  >Обновить</button>
                </div>

                <div class="input-group" v-else>
                  <span class="form-control" >Не зарегистрирована</span>
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
                  <button @click="begin" class="btn btn-success"
                          v-if="issue?.status.type === 'pending' && issue?.address.type === 'address_line'">
                    Начать
                  </button>
                </div>
              </div>
            </li>
            <li class="list-group-item d-flex justify-content-between" v-if="order?.status.type === 'deliver_to_department'">
              Время:
              <span class="col-6">
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
              </span>
            </li>
            <li class="list-group-item d-flex justify-content-between" v-else>
              Время:
              <span class="col-6">
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
              </span>
            </li>
            <li class="list-group-item d-md-flex d-block justify-content-between align-items-center" :class="{'text-danger':subscription_error}">
              Подпись:
              <div class="col-md-6 col-12 mt-2">
                <button v-if="issue?.subscription" class="btn btn-sm btn-alt-secondary me-2" @click="openImage(issue?.subscription.base64)">
                  Посмотреть
                </button>
                <button
                    type="button"
                    class="btn btn-sm btn-alt-secondary"
                    :class="{'btn-alt-danger':subscription_error}"
                    data-bs-target="#create-signature"
                    data-bs-toggle="modal"
                    data-bs-type="submit"
                    v-else-if="issue?.status.type === 'in_progress' && !issue?.subscription && issue?.address.type === 'department'"
                >
                  Установить
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
    <BaseBlock :title="'Список вещей в заказе #' + $route.params.order_id" v-if="orderItems?.length">
      <template #content>
        <div class="block-content block-content-full">
          <ul class="list-group" >
            <li
                class="list-group-item d-md-flex d-block justify-content-between align-items-center"
                v-for="item in orderItems"
                :key="item.id"
            >
              <div class="col-md-6 col-12 d-flex fw-semibold">
                <span class="d-flex justify-content-center me-2">
                  <img style="object-fit: cover" width="45" height="45" v-lazy="item.images[0]?.url || '/src/assets/error.jpg'" alt="">
                </span>
                {{ item.name }}:
              </div>
              <div class="col-md-6 col-12 mt-2">
                <div class="input-group" v-if="item.reviewed">
                  <span class="form-control">
                    Проверено
                  </span>
                </div>
                <div class="input-group" v-else>
                  <input type="text" placeholder="-----" class="form-control" v-model="item.order_id">
                  <button class="btn btn-success" @click.prevent="reviewedSubmit(item)"><i class="fa fa-check"></i></button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </template>
    </BaseBlock>
  </div>
  <ModalYMap />
  <ModalCreateSignatureCourier />
</template>

<script setup>
// import ModalMap from "@/components/modals/Map.vue";
import ModalYMap from "@/components/modals/yMap.vue";
import router from "@/router";
import {useOrderIssuesOperatorStore} from "@/stores/dashboard/order-issue/operator";
import {computed, ref} from "vue";

import { useYMapStore } from "@/stores/dashboard/yMap";
// import {useMapStore} from "@/stores/dashboard/map";

import {useOrderOperatorStore} from "@/stores/dashboard/order/operator";
import {openImage} from "@/utils/openImage";
import statusIssue from "../../../../data/status-issue";
import ModalCreateSignatureCourier from "@/components/modals/order/courier/CreateSignature.vue";
import event from "@/utils/eventBus";
import {useOrderItemOperatorStore} from "@/stores/dashboard/order-item/operator";
import {useTemplateStore} from "@/stores/template";

const error = ref()
const store = useTemplateStore()
const storeMap = useYMapStore()
const issueStore = useOrderIssuesOperatorStore()
const orderStore = useOrderOperatorStore()
const orderItemStore = useOrderItemOperatorStore()
const issue = computed(() => issueStore.orderIssuesById)
const order = computed(() => orderStore.order)
const orderItems = computed(() => {
  orderItemStore.orderItems?.content.map(item => item.order_id = '')
  return orderItemStore.orderItems?.content.filter(item => issue.value?.order_items_ids.includes(item.id))
})
orderStore.getOrder(router.currentRoute.value.params.order_id)
orderItemStore.getOrderItemsById(router.currentRoute.value.params.order_id)
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
const confirmCustomer = async () => {
  if (!issue.value.subscription){
    subscription_error.value = true
    setTimeout(() => subscription_error.value = false, 2000)
    return
  }
  try {
    await issueStore.markOrderIssueAsIssued( router.currentRoute.value.params.id )
    await issueStore.getOrderIssuesById(router.currentRoute.value.params.id)
    await orderStore.getOrder(router.currentRoute.value.params.order_id)
  } catch (e) {
    if (e.response.data.type === "order_billing.not_fully_paid"){
      error.value = 'Этот заказ не оплачен полностью'
    }
  }
}
const begin = async () => {
  try {
    await issueStore.beginOrderIssue( router.currentRoute.value.params.id )
    await issueStore.getOrderIssuesById(router.currentRoute.value.params.id)
    await orderStore.getOrder(router.currentRoute.value.params.order_id)
  } catch (e) {
    console.log(e)
  }
}
const bagCode = ref('')
const bagCodeRegister = async () => {
  try {
    await issueStore.updateOrderIssueBagCode({id: router.currentRoute.value.params.id, bag_code: bagCode.value} )
    await issueStore.getOrderIssuesById(router.currentRoute.value.params.id)
    await orderStore.getOrder(router.currentRoute.value.params.order_id)
  } catch (e) {
    console.log(e)
  }
}
const reviewedSubmit = async (item) => {
  if (item.code !== item.order_id){
    store.openToast('error')
    return
  }
  try {
    await orderItemStore.markOrderItemReviewed(item.id )
    await orderItemStore.getOrderItemsById(router.currentRoute.value.params.order_id)
  } catch (e) {
    console.log(e)
  }
}

event.$on('signature-submit', async ({str, type}) => {
  if (type === 'submit') {
    await issueStore.addOrderIssueSubscription({id: router.currentRoute.value.params.id, code: str})
    await issueStore.getOrderIssuesById(router.currentRoute.value.params.id)
  }
})

</script>
