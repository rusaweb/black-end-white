<template>
  <BaseModal title="Редактирование адреса" id="update-receive-from-address">
    <template #content>
      <div class="block-content block-content-full">
        <h4>Способ отдачи</h4>
        <ul class="list-group">
          <li class="list-group-item d-flex justify-content-between">
            <div class="form-check-label fw-semibold">Тип</div>
            <div class="form-check form-check form-switch">
              <label for="receivey_receive" class="form-check-label user-select-none">Доставка</label>
              <input
                  type="checkbox"
                  class="form-check-input"
                  id="receivey_receive"
                  v-model="receiveDelivery"
              >
            </div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-center" v-if="receiveDelivery">
            <div class="btn-group w-100">
              <button class="btn btn-sm w-100" :class="!receiveIsAddress ? 'btn-primary' : 'btn-secondary'"
                      @click.prevent="receiveIsAddress = false">Новый адрес
              </button>
              <button class="btn btn-sm w-100" :class="receiveIsAddress ? 'btn-primary' : 'btn-secondary'"
                      @click.prevent="receiveIsAddress = true">Мои адреса
              </button>
            </div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-center"
              v-if="receiveDelivery && receiveIsAddress && user">
            <div class="w-100" v-if="user.addresses.length">
              <div class="form-check mb-2" style="cursor:pointer;" v-for="item in user.addresses" :key="item.id">
                <input
                    class="form-check-input"
                    type="radio"
                    :id="'radios-' + item.id"
                    :value="item"
                    v-model="state.receive_from_address"
                >
                <label class="form-check-label flex-grow-1" style="cursor:pointer;" :for="'radios-' + item.id">
                  <span class="fw-semibold d-block">{{ item.address_line }}</span>
                  <span class="fs-sm">{{ item.reference_point }}</span>
                </label>
              </div>
            </div>
            <div class="form-control p-5 text-center" v-else>
              У вас нет сохраненных адресов, их можно добавить на странице <router-link :to="{name: 'profile'}"><span data-bs-dismiss="modal">Профиля</span></router-link>
            </div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-center" v-if="receiveDelivery && !receiveIsAddress">
            <div class="form-check-label fw-semibold">Адрес</div>
            <div class="col-6">
              <input
                  type="text"
                  class="form-control"
                  v-model="state.receive_from_address.address_line"
                  :class="{ 'is-invalid': v$.receive_from_address.address_line.$errors.length}"
                  @blur="v$.receive_from_address.address_line.$touch"
                  placeholder="Введите адрес"
              >
              <div
                  v-if="v$.receive_from_address.address_line.$errors.length"
                  class="invalid-feedback animated fadeIn fs-xs"
              >
                Пожалуйста, введите адрес
              </div>
            </div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-center" v-if="receiveDelivery && !receiveIsAddress">
            <div class="form-check-label fw-semibold">Ориентир</div>
            <div class="col-6">
              <input
                  type="text"
                  class="form-control"
                  v-model="state.receive_from_address.reference_point"
                  :class="{ 'is-invalid': v$.receive_from_address.reference_point.$errors.length}"
                  @blur="v$.receive_from_address.reference_point.$touch"
                  placeholder="Введите ориентир"
              >
              <div
                  v-if="v$.receive_from_address.reference_point.$errors.length"
                  class="invalid-feedback animated fadeIn fs-xs"
              >
                Пожалуйста, введите ориентир
              </div>
            </div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-center" v-if="receiveDelivery && !receiveIsAddress">
            <div class="form-check-label fw-semibold">Локация</div>
            <div class="col-6">
              <template v-if="!state.receive_from_address.location">
                <button
                    class="btn btn-alt-primary"
                    data-bs-target="#map"
                    data-bs-toggle="modal"
                    data-bs-back="#update-receive-from-address"
                    :data-bs-index="1"
                    @click.prevent
                    :class="{ 'is-invalid': v$.receive_from_address.location.$errors.length}"
                >Выбрать на карте
                </button>
                <div
                    v-if="v$.receive_from_address.reference_point.$errors.length"
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
                    data-bs-back="#update-receive-from-address"
                    :data-bs-index="1"
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
</template>
<script setup>
import BaseModal from '@/components/BaseModal.vue'
import {computed, defineComponent, onMounted, reactive, ref, watch} from "vue";
import {requiredIf} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import {useOrderUserStore} from "@/stores/dashboard/order/user";
import router from "@/router";

// import {useMapStore} from "@/stores/dashboard/map";
import { useYMapStore } from "@/stores/dashboard/yMap";

import {useUserStore} from "@/stores/dashboard/user/user";

const modal = ref(null)
const receiveDelivery = ref(false);
const receiveIsAddress = ref(false);

const storeMap = useYMapStore()
const map = computed(() => storeMap.yMap)

watch(map, value => {
  if (value && value.index) {
    if (value.index === '1') {
      state.receive_from_address.location = value
    }
    storeMap.setYMap(null)
  }
})

let state = reactive({
  receive_from_address: {
    type: "address_line",
    address_line: "",
    reference_point: "",
    location: null
  }
})
watch(receiveIsAddress, value => {
  if (!value) {
    state.receive_from_address = {
      type: "address_line",
      address_line: "",
      reference_point: "",
      location: null
    }
  }
})
const rules = computed(() => {
  return {
    receive_from_address: {
      address_line: {
        required: requiredIf(() => {
          return receiveDelivery.value
        })
      },
      reference_point: {
        required: requiredIf(() => {
          return receiveDelivery.value
        })
      },
      location: {
        required: requiredIf(() => {
          return receiveDelivery.value
        })
      },
    },
  };
});
const v$ = useVuelidate(rules, state, {$scope: false});

const storeUser = useOrderUserStore()
const profile = useUserStore()

const user = computed(() => profile.user)

const submit = async () => {
  const result = await v$.value.$validate();
  if (!result) {
    return;
  }
  if (receiveDelivery.value) {
    state.receive_from_address.type = "address_line"
  }
  try {
    await storeUser.updateOrderReceiveFromAddress({...state, id: router.currentRoute.value.params.id})
    await resetState()
    v$.value.$reset()
    await modal.value.hide()
  } catch (e) {
    console.log(e)
  }
}
const resetState = async () => {
  state.receive_from_address = {
    type: "department",
    address_line: "",
    reference_point: "",
    location: null
  }
  receiveDelivery.value = false
  receiveIsAddress.value = false
}
onMounted(() => {
  modal.value = new window.bootstrap.Modal('#update-receive-from-address')
  let modalInfo = document.getElementById('update-receive-from-address')
  modalInfo.addEventListener('show.bs.modal', ()=> {
    if (storeUser.order.receive_from_address.type === 'department'){
      receiveDelivery.value = false
    }else {
      receiveDelivery.value = true
      state.receive_from_address = storeUser.order.receive_from_address
    }
  })
})
defineComponent({name: 'ModalUpdateReceiveFromAddress'})
</script>
