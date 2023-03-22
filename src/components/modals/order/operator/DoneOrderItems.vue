<template>
  <BaseModal title="Отдать вещи" class="modal-lg" id="done-order-item">
    <template #content>
      <div class="block-content block-content-full">
        <div class="row items-push">
          <div class="block-content">
            <h4>Адресс</h4>
            <ul class="list-group">
              <li class="list-group-item d-flex justify-content-between">
                <div class="form-check-label fw-semibold">Тип</div>
                <div class="form-check form-check form-switch">
                  <label for="delivery_deliver" class="form-check-label user-select-none">Доставка</label>
                  <input
                      type="checkbox"
                      class="form-check-input"
                      id="delivery_deliver"
                      v-model="deliverDelivery"
                  >
                </div>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center" v-if="deliverDelivery">
                <div class="btn-group w-100">
                  <button class="btn btn-sm w-100" :class="!deliverIsAddress ? 'btn-primary' : 'btn-secondary'"
                          @click.prevent="deliverIsAddress = false">Новый адрес
                  </button>
                  <button class="btn btn-sm w-100" :class="deliverIsAddress ? 'btn-primary' : 'btn-secondary'"
                          @click.prevent="deliverIsAddress = true">Адреса клиента
                  </button>
                </div>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center"
                  v-if="deliverDelivery && deliverIsAddress">
                <div class="w-100" v-if="user.addresses.length">
                  <div class="form-check mb-2" style="cursor:pointer;" v-for="item in user.addresses"
                       :key="item.id">
                    <input
                        class="form-check-input"
                        type="radio"
                        :id="'radios-2-' + item.id"
                        :value="item"
                        v-model="state.address"
                    >
                    <label class="form-check-label flex-grow-1" style="cursor:pointer;" :for="'radios-2-' + item.id">
                      <span class="fw-semibold d-block">{{ item.address_line }}</span>
                      <span class="fs-sm">{{ item.reference_point }}</span>
                    </label>
                  </div>
                </div>
                <div class="form-control p-5 text-center" v-else>
                  У этого клиента нет сохраненных адресов, их можно добавить на странице
                  <router-link :to="{name: 'clients-operator-edit', params: {id: user.id}}"><span
                      data-bs-dismiss="modal">Клиента</span></router-link>
                </div>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center"
                  v-if="deliverDelivery && !deliverIsAddress">
                <div class="form-check-label fw-semibold">Адрес</div>
                <div class="col-6">
                  <input
                      type="text"
                      class="form-control"
                      v-model="state.address.address_line"
                      :class="{ 'is-invalid': v$.address.address_line.$errors.length}"
                      @blur="v$.address.address_line.$touch"
                      placeholder="Введите адрес"
                  >
                  <div
                      v-if="v$.address.address_line.$errors.length"
                      class="invalid-feedback animated fadeIn fs-xs"
                  >
                    Пожалуйста, введите адрес
                  </div>
                </div>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center"
                  v-if="deliverDelivery && !deliverIsAddress">
                <div class="form-check-label fw-semibold">Ориентир</div>
                <div class="col-6">
                  <input
                      type="text"
                      class="form-control"
                      v-model="state.address.reference_point"
                      :class="{ 'is-invalid': v$.address.reference_point.$errors.length}"
                      @blur="v$.address.reference_point.$touch"
                      placeholder="Введите ориентир"
                  >
                  <div
                      v-if="v$.address.reference_point.$errors.length"
                      class="invalid-feedback animated fadeIn fs-xs"
                  >
                    Пожалуйста, введите ориентир
                  </div>
                </div>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center"
                  v-if="deliverDelivery && !deliverIsAddress">
                <div class="form-check-label fw-semibold">Локация</div>
                <div class="col-6">
                  <template v-if="!state.address.location">
                    <button
                        class="btn btn-alt-primary"
                        data-bs-target="#map"
                        data-bs-toggle="modal"
                        data-bs-back="#create-order"
                        :data-bs-index="2"
                        @click.prevent
                        :class="{ 'is-invalid': v$.address.location.$errors.length}"
                    >Выбрать на карте
                    </button>
                    <div
                        v-if="v$.address.reference_point.$errors.length"
                        class="invalid-feedback animated fadeIn fs-xs"
                    >
                      Пожалуйста, введите ориентир
                    </div>
                  </template>
                  <div class="input-group" v-else>
                    <div class="form-control">Точка установлена</div>
                    <button
                        class="btn btn-alt-primary"
                        data-bs-target="#map"
                        data-bs-toggle="modal"
                        data-bs-back="#create-order"
                        :data-bs-index="2"
                        @click.prevent
                    >
                      <i class="fa fa-pen"></i>
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="block-content mb-3" :class="{'block-content-full': !orderItems?.content.length}">
            <div v-if="orderItems?.content.length" class="table-responsive">
                <table class="table table-bordered table-striped table-vcenter">
                  <thead>
                  <tr>
                    <th><span class="d-flex justify-content-center"><i class="fa fa-check"></i></span></th>
                    <th><span class="d-flex justify-content-center"><i class="fa fa-image"></i></span></th>
                    <th>Название</th>
                    <th>Статус</th>
                    <th>Код</th>
                    <th>Забрали</th>
                    <th>Цена</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr
                      v-for="(item, key) in orderItems?.content"
                      :key="item.id"
                      @click="checkedPush(item.id)"
                      :style="(item.status.type === 'ready' && item.issued === false) ? '' : 'user-select: none; pointer-events: none; filter: grayscale(100%); opacity: 0.3' "
                  >
                    <td>
                      <div class="form-check">
                        <input type="checkbox" v-model="state.order_items_ids" :value="item.id" class="form-check-input">
                      </div>
                    </td>
                    <td @click.prevent="showPhoto(0, item.images.map(e=>e.url))" style="width: 50px; min-width: 50px">
                    <span class="d-flex justify-content-center">
                      <img style="object-fit: cover" width="45" height="45"
                           v-lazy="item.images[0]?.url || '/src/assets/error.jpg'" alt="">
                    </span>
                    </td>
                    <td class="fw-semibold fs-sm" >
                      {{ item.name }}
                    </td>
                    <td class="fw-semibold fs-sm" style="white-space: nowrap;">
                      {{ statusOrderItem[item.status.type] }}
                    </td>
                    <td class="fw-semibold fs-sm">
                      {{ item.code }}
                    </td>
                    <td class="fw-semibold fs-sm">
                      {{ item.issued ? 'Да' : 'Нет' }}
                    </td>
                    <td class="fw-semibold fs-sm" v-if="billing" style="white-space: nowrap;">
                      {{ billing?.items[key]?.total_amount }} {{ item.type.price.currency }}
                    </td>
                  </tr>
                  <tr v-if="billing">
                    <td colspan="4" class="bg-body"><h4 class="mb-0">Итого</h4></td>
                    <td colspan="4" class="text-end bg-body">= {{ billing.total_amount.toLocaleString('Ru-ru') }}
                      {{ billing.currency }}
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            <div class="form-control d-flex flex-column align-items-center justify-content-center p-5" v-else>Список
              вещей
              заказа пуст
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <button
          type="button"
          class="btn btn-sm btn-success me-1"
          @click.prevent="submit"
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
    </template>
  </BaseModal>
  <VueEasyLightbox
      :visible="gallery.visible"
      :index="gallery.index"
      :imgs="gallery.photos"
      @hide="handleHide"
  />
</template>

<script setup>
import BaseModal from "@/components/BaseModal.vue"
import {computed, defineComponent, onMounted, reactive, ref, watch} from "vue";
import {requiredIf} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import {useOrderItemOperatorStore} from "@/stores/dashboard/order-item/operator";
import VueEasyLightbox from "vue-easy-lightbox";
import statusOrderItem from "@/data/status-order-item";
import {useBillingOperatorStore} from "@/stores/dashboard/order-billing/operator";
import router from "@/router";

// import {useMapStore} from "@/stores/dashboard/map";
import { useYMapStore } from "@/stores/dashboard/yMap";

import {useOrderIssuesOperatorStore} from "@/stores/dashboard/order-issue/operator";
import {useUserOperatorStore} from "@/stores/dashboard/user/operator";
import {useOrderOperatorStore} from "@/stores/dashboard/order/operator";
const storeMap = useYMapStore()
const map = computed(() => storeMap.yMap)

const storeOperatorOrderItem = useOrderItemOperatorStore()
const storeOperatorOrder = useOrderOperatorStore()
const storeOrderIssues = useOrderIssuesOperatorStore()
const storeBillingOperator = useBillingOperatorStore()
const storeOperatorUser = useUserOperatorStore()
const orderItems = computed(() => storeOperatorOrderItem.orderItems)
const order = computed(() => storeOperatorOrder.order)
const billing = computed(() => storeBillingOperator.billing[0])
const user = computed(() => storeOperatorUser.user);

const modal = ref(null)
const props = defineProps(['data'])


const deliverDelivery = ref(false)
const deliverIsAddress = ref(false)
watch(map, value => {
  if (value && value.index) {
    if (value.index === '2') {
      state.address.location = value
    }
    storeMap.setYMap(null)
  }
})
watch(deliverIsAddress, value => {
  if (!value) {
    state.address = {
      type: "address_line",
      address_line: "",
      reference_point: "",
      location: null
    }
  }
})
let state = reactive({
  order_id: null,
  order_items_ids: [],
  address: {},
  desired_delivery_time: null
})

const rules = computed(() => {
  return {
    address: {
      address_line: {
        required: requiredIf(() => {
          return deliverDelivery.value
        })
      },
      reference_point: {
        required: requiredIf(() => {
          return deliverDelivery.value
        })
      },
      location: {
        required: requiredIf(() => {
          return deliverDelivery.value
        })
      },
    },
  };
});
const v$ = useVuelidate(rules, state, {$scope: false});
const submit = async () => {
  const result = await v$.value.$validate();
  if (!result) {
    return;
  }
  if (deliverDelivery.value) {
    state.address.type = "address_line"
  }else {
    state.address.type = "department"
  }
  if (state.desired_delivery_time) {
    state.desired_delivery_time = Math.floor(new Date(state.desired_delivery_time).getTime() / 1000)
  }

  try {
    await storeOrderIssues.createExtraIssue(state)
    await storeOrderIssues.getOrderIssues(router.currentRoute.value.params.id)
    v$.value.$reset()
    await modal.value.hide()
  } catch (e) {
    console.log(e)
  }
}

onMounted(async () => {
  modal.value = new window.bootstrap.Modal('#done-order-item')
  document.getElementById('done-order-item').addEventListener('show.bs.modal', async () => {
    await storeOperatorOrderItem.getOrderItemsById(router.currentRoute.value.params.id, 'ready')
    await storeOperatorUser.getUserById(order.value.user_id)
    deliverDelivery.value = props.data.FROM_DEPARTMENT_TO_CUSTOMER.address.type === 'address_line'
    state.order_id = router.currentRoute.value.params.id
    state.order_items_ids = orderItems.value.content.map(e => {
      if (e.status.type === 'ready' && !e.issued){
        return e.id
      }
    })
    state.address = props.data.FROM_DEPARTMENT_TO_CUSTOMER.address
    state.desired_delivery_time = props.data.desired_delivery_time
  })
})
const checkedPush = id => {
  if (state.order_items_ids.includes(id)){
    state.order_items_ids.map((el, key) => {
      if (el === id) {
        state.order_items_ids.splice(key, 1)
      }
    })
    return
  }
  state.order_items_ids.push(id)
}
const gallery = reactive({
  visible: false,
  index: 0,
  photos: null,
});
function showPhoto(index, url) {
  if (url.length){
    gallery.index = index;
    gallery.visible = true;
    gallery.photos = url
  }
}
function handleHide() {
  gallery.visible = false;
  gallery.photos = []
}
defineComponent({name: 'ModalDoneOrderItem'})
</script>
