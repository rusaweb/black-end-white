<template>
  <BaseModal title="Подтвердите отправку заказа" id="confirm-client-to-address">
    <template #content>
      <div class="block-content block-content-full" v-if="!yes">
        <h3>Изменить адрес получения заказа?</h3>
      </div>
      <div class="block-content block-content-full" v-else>
        <h4>Способ получения</h4>
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
            <div class="w-100" v-if="state.user_id?.addresses?.length">
              <div class="form-check mb-2" style="cursor:pointer;" v-for="item in state.user_id.addresses"
                   :key="item.id">
                <input
                    class="form-check-input"
                    type="radio"
                    :id="'radios-2-' + item.id"
                    :value="item"
                    v-model="state.deliver_to_address"
                >
                <label class="form-check-label flex-grow-1" style="cursor:pointer;" :for="'radios-2-' + item.id">
                  <span class="fw-semibold d-block">{{ item.address_line }}</span>
                  <span class="fs-sm">{{ item.reference_point }}</span>
                </label>
              </div>
            </div>
            <div class="form-control p-5 text-center" v-else>
              У вас нет сохраненных адресов, их можно добавить на странице
              <router-link :to="{ name: 'profile' }">
                <span data-bs-dismiss="modal">Профиля</span>
              </router-link>
            </div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-center"
              v-if="deliverDelivery && !deliverIsAddress">
            <div class="form-check-label fw-semibold">Адрес</div>
            <div class="col-6">
              <input
                  type="text"
                  class="form-control"
                  v-model="state.deliver_to_address.address_line"
                  :class="{ 'is-invalid': v$.deliver_to_address.address_line.$errors.length}"
                  @blur="v$.deliver_to_address.address_line.$touch"
                  placeholder="Введите адрес"
              >
              <div
                  v-if="v$.deliver_to_address.address_line.$errors.length"
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
                  v-model="state.deliver_to_address.reference_point"
                  :class="{ 'is-invalid': v$.deliver_to_address.reference_point.$errors.length}"
                  @blur="v$.deliver_to_address.reference_point.$touch"
                  placeholder="Введите ориентир"
              >
              <div
                  v-if="v$.deliver_to_address.reference_point.$errors.length"
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
              <template v-if="!state.deliver_to_address.location">
                <button
                    class="btn btn-alt-primary"
                    data-bs-target="#map"
                    data-bs-toggle="modal"
                    data-bs-back="#create-order"
                    :data-bs-index="2"
                    @click.prevent
                    :class="{ 'is-invalid': v$.deliver_to_address.location.$errors.length}"
                >Выбрать на карте
                </button>
                <div
                    v-if="v$.deliver_to_address.reference_point.$errors.length"
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
    </template>
    <template #footer>
      <button
          type="button"
          class="btn btn-sm btn-alt-secondary me-1"
          @click="yes = true"
          v-if="!yes"
      >
        Да
      </button>
      <button
          type="button"
          class="btn btn-sm btn-success me-1"
          @click="submit"
          v-else
      >
        Подтвердить
      </button>

      <button
          type="button"
          class="btn btn-sm btn-success"
          @click="cancelOrder"
          v-if="!yes"
      >
        Нет
      </button>
      <button
          type="button"
          class="btn btn-sm btn-alt-secondary"
          @click="yes = false"
          v-else
      >
        Отмена
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import BaseModal from "@/components/BaseModal.vue"
import {computed, defineComponent, onMounted, reactive, ref, watch} from "vue";
import router from "@/router";
import {requiredIf} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

// import {useMapStore} from "@/stores/dashboard/map";
import { useYMapStore } from "@/stores/dashboard/yMap";

import {useOrderUserStore} from "@/stores/dashboard/order/user";
import {useUserStore} from "@/stores/dashboard/user/user";
const modal = ref(null)
const yes = ref(false)
const storeUser = useOrderUserStore()
const storeProfile = useUserStore()

const deliverDelivery = ref(false)
const deliverIsAddress = ref(false)

let state = reactive({
  user_id: null,
  deliver_to_address: {
    type: "department",
    address_line: "",
    reference_point: "",
    location: null,
  },
})

const rules = computed(() => {
  return {
    deliver_to_address: {
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
    state.deliver_to_address.type = "address_line"
  }
  try {
    await storeUser.updateDeliverToAddress({...state, ...router.currentRoute.value.params})
    await cancelOrder()
    await resetState()
    v$.value.$reset()
    await modal.value.hide()
  } catch (e) {
    console.log(e)
  }
}


const resetState = async () => {
  state.deliver_to_address = {
    type: "department",
    address_line: "",
    reference_point: "",
    location: null
  }
  deliverDelivery.value = false
  deliverIsAddress.value = false
}

const storeMap = useYMapStore()
const map = computed(() => storeMap.yMap)

watch(map, value => {
  if (value && value.index) {
    if (value.index === '2') {
      state.deliver_to_address.location = value
    }
    storeMap.setYMap(null)
  }
})

watch(deliverIsAddress, value => {
  if (!value) {
    state.deliver_to_address = {
      type: "address_line",
      address_line: "",
      reference_point: "",
      location: null
    }
  }
})

const cancelOrder = async () => {
  try {
    await storeUser.cancelOrder(router.currentRoute.value.params.id)
    await modal.value.hide()
  }catch (e) {
    console.log(e)
  }
}
onMounted(() => {
  modal.value = new window.bootstrap.Modal('#confirm-client-to-address')
  document.getElementById('confirm-client-to-address').addEventListener('show.bs.modal', async () => {
    state.user_id = storeProfile.user
  })
})
defineComponent({name: 'ModalConfirmClientToAddressUser'})
</script>
