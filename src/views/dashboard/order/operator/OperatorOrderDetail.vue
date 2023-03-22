<template>
  <BasePageHeading title="Информация о заказе" subtitle="На этой странице отображаются информация о заказе">
    <template #extra>
      <button
          type="button"
          class="btn btn-primary me-3"
          v-click-ripple
          @click.prevent="startOrder"
          v-if="data?.status.type === 'pending'"
      >
        <i class="fa fa-play opacity-50 me-1"></i>
        Начать
      </button>
    </template>
  </BasePageHeading>
  <div class="content" v-if="!load">
    <div class="row items-push">
      <div class="col-sm-4 col-xxl col-6" @click.prevent="type = 'Заказ'">
        <!-- Pending Orders -->
        <BaseBlock style="cursor: pointer" class="d-flex flex-column h-100 mb-0" :class="{'bg-primary': type === 'Заказ'}">
          <template #content>
            <div
                class="block-content block-content-full flex-grow-1 d-flex align-items-center"
            >
              <dl class="mb-0">
                <dt class="fs-6" :class="{'text-white': type === 'Заказ'}">Заказ</dt>
              </dl>
            </div>
          </template>
        </BaseBlock>
        <!-- END Pending Orders -->
      </div>
      <div class="col-sm-4 col-xxl col-6" @click.prevent="type = 'Документы'">
        <!-- New Customers -->
        <BaseBlock style="cursor: pointer" class="d-flex flex-column h-100 mb-0" :class="{'bg-primary': type === 'Документы'}">
          <template #content>
            <div
                class="block-content block-content-full flex-grow-1 d-flex align-items-center"
            >
              <dl class="mb-0">
                <dt class="fs-6" :class="{'text-white': type === 'Документы'}">Документы</dt>
              </dl>
            </div>
          </template>
        </BaseBlock>
        <!-- END New Customers -->
      </div>
      <div class="col-sm-4 col-xxl col-6" @click.prevent="type = 'Аксссуары'">
        <!-- Messages -->
        <BaseBlock style="cursor: pointer" class="d-flex flex-column h-100 mb-0" :class="{'bg-primary': type === 'Аксссуары'}">
          <template #content>
            <div
                class="block-content block-content-full flex-grow-1 d-flex align-items-center"
            >
              <dl class="mb-0">
                <dt class="fs-6" :class="{'text-white': type === 'Аксссуары'}">
                  Аксссуары
                </dt>
              </dl>
            </div>
          </template>
        </BaseBlock>
        <!-- END Messages -->
      </div>
      <div class="col-sm-4 col-xxl col-6" @click.prevent="type = 'Услуги'">
        <!-- Messages -->
        <BaseBlock style="cursor: pointer" class="d-flex flex-column h-100 mb-0" :class="{'bg-primary': type === 'Услуги'}">
          <template #content>
            <div
                class="block-content block-content-full flex-grow-1 d-flex align-items-center"
            >
              <dl class="mb-0">
                <dt class="fs-6" :class="{'text-white': type === 'Услуги'}">
                  Услуги
                </dt>
              </dl>
            </div>
          </template>
        </BaseBlock>
        <!-- END Messages -->
      </div>
      <div class="col-sm-4 col-xxl col-6" @click.prevent="type = 'Выдачи'">
        <!-- Messages -->
        <BaseBlock style="cursor: pointer" class="d-flex flex-column h-100 mb-0" :class="{'bg-primary': type === 'Выдачи'}">
          <template #content>
            <div
                class="block-content block-content-full flex-grow-1 d-flex align-items-center"
            >
              <dl class="mb-0">
                <dt class="fs-6" :class="{'text-white': type === 'Выдачи'}">
                  Выдачи
                </dt>
              </dl>
            </div>
          </template>
        </BaseBlock>
        <!-- END Messages -->
      </div>
      <div class="col-sm-4 col-xxl col-6" @click.prevent="type = 'Оплаты'">
        <!-- Messages -->
        <BaseBlock style="cursor: pointer" class="d-flex flex-column h-100 mb-0" :class="{'bg-primary': type === 'Оплаты'}">
          <template #content>
            <div
                class="block-content block-content-full flex-grow-1 d-flex align-items-center"
            >
              <dl class="mb-0">
                <dt class="fs-6" :class="{'text-white': type === 'Оплаты'}">
                  Оплаты
                </dt>
              </dl>
            </div>
          </template>
        </BaseBlock>
        <!-- END Messages -->
      </div>
      <div class="col-sm-4 col-xxl col-6" @click.prevent="type = 'Вещи'">
        <!-- Messages -->
        <BaseBlock style="cursor: pointer" class="d-flex flex-column h-100 mb-0" :class="{'bg-primary': type === 'Вещи'}">
          <template #content>
            <div
                class="block-content block-content-full flex-grow-1 d-flex align-items-center"
            >
              <dl class="mb-0">
                <dt class="fs-6" :class="{'text-white': type === 'Вещи'}">
                  Вещи
                </dt>
              </dl>
            </div>
          </template>
        </BaseBlock>
        <!-- END Messages -->
      </div>
      <div class="col-sm-4 col-xxl col-6" @click.prevent="type = 'Цена'">
        <!-- Messages -->
        <BaseBlock style="cursor: pointer" class="d-flex flex-column h-100 mb-0" :class="{'bg-primary': type === 'Цена'}">
          <template #content>
            <div
                class="block-content block-content-full flex-grow-1 d-flex align-items-center"
            >
              <dl class="mb-0">
                <dt class="fs-6" :class="{'text-white': type === 'Цена'}">
                  Цена
                </dt>
              </dl>
            </div>
          </template>
        </BaseBlock>
        <!-- END Messages -->
      </div>
      <div class="col-sm-4 col-xxl col-6" @click.prevent="type = 'Клиент'">
        <!-- Messages -->
        <BaseBlock style="cursor: pointer" class="d-flex flex-column h-100 mb-0" :class="{'bg-primary': type === 'Клиент'}">
          <template #content>
            <div
                class="block-content block-content-full flex-grow-1 d-flex align-items-center"
            >
              <dl class="mb-0">
                <dt class="fs-6" :class="{'text-white': type === 'Клиент'}">
                  Клиент
                </dt>
              </dl>
            </div>
          </template>
        </BaseBlock>
        <!-- END Messages -->
      </div>
    </div>
    <OrderDetailOperatorOrderInfo v-if="type === 'Заказ' && data && dataIssues" :data="{...data, ...dataIssues}" />
    <OrderDetailOperatorDocumentList v-if="type === 'Документы'"/>
    <OrderDetailOperatorAccessoriesList v-if="type === 'Аксссуары'"/>
    <OrderDetailOperatorAdditionalServices v-if="type === 'Услуги'"/>
    <OrderDetailOperatorOrderIssueList v-if="type === 'Выдачи'"/>
    <OrderDetailOperatorOrderPayment v-if="type === 'Оплаты'"/>
    <OrderDetailOperatorOrderItems v-if="type === 'Вещи' && data && data.status.type !== 'deliver_to_department' && data.status.type !== 'canceled'"
                                   :status="data.status.type"/>
    <OrderDetailOperatorPriceInfo v-if="type === 'Цена'"/>
    <OrderDetailOperatorUserInfo v-if="type === 'Клиент'"/>
  </div>
  <div v-else class="w-100 d-flex justify-content-center py-10">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <ModalYMap />
  <ModalDoneOrderItem v-if="dataIssues" :data="dataIssues" />
  <ModalCreateSignatureOperator />
  <ModalCreateOrderItem />
  <ModalUpdateOrderItem />
  <ModalConfirmToDepartment />
  <ModalCreatePayment />
  <AddDocument />
  <AddAccessory @done="initPage" />
  <ModalCreateAdditionalServiceOrder />
<!--  <ModalConfirmClientToAddress />-->
</template>

<script setup>
import ModalUpdateOrderItem from "@/components/modals/order/operator/UpdateOrderItem.vue";
import ModalCreateOrderItem from "@/components/modals/order/operator/CreateOrderItem.vue";
import OrderDetailOperatorUserInfo from "@/components/blocks/order/operator/UserInfo.vue";
import OrderDetailOperatorOrderItems from "@/components/blocks/order/operator/OrderItemsList.vue";
import OrderDetailOperatorOrderInfo from "@/components/blocks/order/operator/OrderInfo.vue";
import ModalConfirmToDepartment from "@/components/modals/order/operator/ConfirmToDepartment.vue";
import ModalCreateSignatureOperator from "@/components/modals/order/operator/CreateSignature.vue";
// import ModalMap from "@/components/modals/Map.vue";
import ModalYMap from "@/components/modals/yMap.vue";
import {useOrderOperatorStore} from "@/stores/dashboard/order/operator";
import {computed, onMounted, ref} from "vue";
import router from "@/router";
import ModalDoneOrderItem from "@/components/modals/order/operator/DoneOrderItems.vue";
import {useOrderIssuesOperatorStore} from "@/stores/dashboard/order-issue/operator";
import OrderDetailOperatorOrderIssueList from "@/components/blocks/order/operator/IssueList.vue";
import ModalCreatePayment from "@/components/modals/order/operator/CreatePayment.vue";
import OrderDetailOperatorOrderPayment from "@/components/blocks/order/operator/OrderPaymentList.vue";
import OrderDetailOperatorDocumentList from "@/components/blocks/order/operator/OrderDocList.vue";
import AddDocument from "@/components/modals/order/operator/AddDocument.vue";
import {useUserOperatorStore} from "@/stores/dashboard/user/operator";
import OrderDetailOperatorPriceInfo from "@/components/blocks/order/operator/OrderPriceInfo.vue";
import OrderDetailOperatorAccessoriesList from "@/components/blocks/order/operator/AccessoriesList.vue";
import AddAccessory from "@/components/modals/order/operator/AddAccessory.vue";
import OrderDetailOperatorAdditionalServices from "@/components/blocks/order/operator/AdditionalServices.vue";
import ModalCreateAdditionalServiceOrder from "@/components/modals/additional-service/Create.vue";
const storeOperator = useOrderOperatorStore()
const orderIssuesStore = useOrderIssuesOperatorStore()
const storeOperatorUser = useUserOperatorStore()
const load = ref(false)
const type = ref('Заказ')
const data = computed(() => storeOperator.order)
const dataIssues = computed(() => {
  const response = ref({})
  if (orderIssuesStore.orderIssues) {
    orderIssuesStore.orderIssues.content.map(e => response.value[e.type] = e)
  }
  return response.value
})
onMounted(async () => {
  await initPage()
})

const initPage = async () => {
  load.value = true
  await storeOperator.getOrder(router.currentRoute.value.params.id)
  await orderIssuesStore.getOrderIssues(router.currentRoute.value.params.id)
  await storeOperatorUser.getUserById(data.value.user_id)
  load.value = false
}

const startOrder = async () => {
  await storeOperator.startOrder(router.currentRoute.value.params.id)
  if (dataIssues?.value?.FROM_CUSTOMER_TO_DEPARTMENT?.address?.type === 'department') {
    await orderIssuesStore.beginOrderIssue( dataIssues?.value?.FROM_CUSTOMER_TO_DEPARTMENT?.id )
    await orderIssuesStore.markOrderIssueAsIssued( dataIssues?.value?.FROM_CUSTOMER_TO_DEPARTMENT?.id )
    await orderIssuesStore.getOrderIssues(router.currentRoute.value.params.id)
    await storeOperator.getOrder(router.currentRoute.value.params.id)
  } else {
    await orderIssuesStore.getOrderIssues(router.currentRoute.value.params.id)
    await storeOperator.getOrder(router.currentRoute.value.params.id)
  }
}


</script>
