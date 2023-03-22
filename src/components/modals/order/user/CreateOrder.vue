<template>
  <BaseModal title="Добавить заказ" id="create-order">
    <template #content>
      <div class="block-content block-content-full">
        <ul class="list-group mb-2">
          <li
              class="
              list-group-item
              d-flex
              justify-content-between
              align-items-center
              border-0
              px-0
            "
          >
            <div class="form-check-label fw-semibold">Тариф</div>
            <div class="col-6">
              <select
                  class="form-select"
                  v-model="state.tariff_id"
                  :class="{
                    'is-invalid':
                    v$.tariff_id.$errors.length,
                  }"
                  @blur="v$.tariff_id.$touch"
              >
                <option :value="null">Выберите тариф</option>
                <option v-for="item in tariffs?.content" :key="item.id" :value="item.id">{{ item.name }}</option>
              </select>
              <div
                  v-if="v$.tariff_id.$errors.length"
                  class="invalid-feedback animated fadeIn fs-xs"
              >
                Пожалуйста, выберите тариф
              </div>
            </div>
          </li>
          <li
              class="
              list-group-item
              d-flex
              justify-content-between
              align-items-center
              border-0
              px-0
            "
          >
            <div class="form-check-label fw-semibold">Срочно</div>
            <div class="form-check form-check form-switch">
              <input
                  type="checkbox"
                  class="form-check-input"
                  v-model="state.immediate"
              />
            </div>
          </li>
        </ul>
        <h4>Способ отдачи</h4>
        <ul class="list-group">
          <li
            class="
              list-group-item
              d-flex
              justify-content-between
              align-items-center
            "
          >
            <div class="form-check-label fw-semibold">Тип</div>
            <div class="form-check form-check form-switch">
              <label
                for="delivery_receive_from_address"
                class="form-check-label user-select-none"
                >Доставка</label
              >
              <input
                type="checkbox"
                class="form-check-input"
                id="delivery_receive_from_address"
                v-model="receiveDelivery"
                @change="tt.init()"
              />
            </div>
          </li>
          <li
            class="
              list-group-item
              d-flex
              justify-content-between
              align-items-center
            "
            v-if="receiveDelivery"
          >
            <div class="btn-group w-100">
              <button
                class="btn btn-sm w-100"
                :class="!receiveIsAddress ? 'btn-primary' : 'btn-secondary'"
                @click.prevent="receiveIsAddress = false"
              >
                Новый адрес
              </button>
              <button
                class="btn btn-sm w-100"
                :class="receiveIsAddress ? 'btn-primary' : 'btn-secondary'"
                @click.prevent="receiveIsAddress = true"
              >
                Мои адреса
              </button>
            </div>
          </li>
          <li
            class="
              list-group-item
              d-flex
              justify-content-between
              align-items-center
            "
            v-if="receiveDelivery && receiveIsAddress && user"
          >
            <div class="w-100" v-if="user.addresses.length">
              <div
                class="form-check mb-2"
                style="cursor: pointer"
                v-for="item in user.addresses"
                :key="item.id"
              >
                <input
                  class="form-check-input"
                  type="radio"
                  :id="'radios-' + item.id"
                  name="example-radios-default"
                  :value="item"
                  v-model="state.receive_from_address"
                />
                <label
                  class="form-check-label flex-grow-1"
                  style="cursor: pointer"
                  :for="'radios-' + item.id"
                >
                  <span class="fw-semibold d-block">{{
                    item.address_line
                  }}</span>
                  <span class="fs-sm">{{ item.reference_point }}</span>
                </label>
              </div>
            </div>
            <div class="form-control p-5 text-center" v-else>
              У вас нет сохраненных адресов, их можно добавить на странице
              <router-link :to="{ name: 'profile-user' }"
                ><span data-bs-dismiss="modal">Профиля</span></router-link>
            </div>
          </li>
          <li
            class="
              list-group-item
              d-flex
              justify-content-between
              align-items-center
            "
            v-if="receiveDelivery && !receiveIsAddress"
          >
            <div class="form-check-label fw-semibold">Адрес</div>
            <div class="col-6">
              <input
                type="text"
                class="form-control"
                v-model="state.receive_from_address.address_line"
                :class="{
                  'is-invalid':
                    v$.receive_from_address.address_line.$errors.length,
                }"
                @blur="v$.receive_from_address.address_line.$touch"
                placeholder="Введите адрес"
              />
              <div
                v-if="v$.receive_from_address.address_line.$errors.length"
                class="invalid-feedback animated fadeIn fs-xs"
              >
                Пожалуйста, введите адрес
              </div>
            </div>
          </li>
          <li
            class="
              list-group-item
              d-flex
              justify-content-between
              align-items-center
            "
            v-if="receiveDelivery && !receiveIsAddress"
          >
            <div class="form-check-label fw-semibold">Ориентир</div>
            <div class="col-6">
              <input
                type="text"
                class="form-control"
                v-model="state.receive_from_address.reference_point"
                :class="{
                  'is-invalid':
                    v$.receive_from_address.reference_point.$errors.length,
                }"
                @blur="v$.receive_from_address.reference_point.$touch"
                placeholder="Введите ориентир"
              />
              <div
                v-if="v$.receive_from_address.reference_point.$errors.length"
                class="invalid-feedback animated fadeIn fs-xs"
              >
                Пожалуйста, введите ориентир
              </div>
            </div>
          </li>
          <li
            class="
              list-group-item
              d-flex
              justify-content-between
              align-items-center
            "
            v-if="receiveDelivery && !receiveIsAddress"
          >
            <div class="form-check-label fw-semibold">Локация</div>
            <div class="col-6">
              <template v-if="!state.receive_from_address.location">
                <button
                  class="btn btn-alt-primary"
                  data-bs-target="#map"
                  data-bs-toggle="modal"
                  data-bs-back="#create-order"
                  :data-bs-index="1"
                  @click.prevent
                  :class="{
                    'is-invalid':
                      v$.receive_from_address.location.$errors.length,
                  }"
                >
                  Выбрать на карте
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
                  data-bs-back="#create-order"
                  :data-bs-index="1"
                  @click.prevent
                >
                  <i class="fa fa-pen"></i>
                </button>
              </div>
            </div>
          </li>
          <li
            class="
              list-group-item
              d-flex
              justify-content-between
              align-items-center
            "
            v-if="receiveDelivery
            "
          >
            <div class="form-check-label fw-semibold">
              Время <small>(необезательно)</small>
              <i data-bs-toggle="tooltip" title="Выберите удобное для вас время чтобы заехал курьер" class="fa fa-info-circle ms-2"></i>
            </div>
            <div class="col-6">
              <input
                type="datetime-local"
                class="form-control"
                v-model="state.desired_receive_delivery_time"
              />
            </div>
          </li>
        </ul>
        <hr class="border-white" />
        <h4>Способ получения</h4>
        <ul class="list-group">
          <li class="list-group-item d-flex justify-content-between">
            <div class="form-check-label fw-semibold">Тип</div>
            <div class="form-check form-check form-switch">
              <label
                for="delivery_deliver"
                class="form-check-label user-select-none"
                >Доставка</label
              >
              <input
                type="checkbox"
                class="form-check-input"
                id="delivery_deliver"
                v-model="deliverDelivery"
              />
            </div>
          </li>
          <li
            class="
              list-group-item
              d-flex
              justify-content-between
              align-items-center
            "
            v-if="deliverDelivery"
          >
            <div class="btn-group w-100">
              <button
                class="btn btn-sm w-100"
                :class="!deliverIsAddress ? 'btn-primary' : 'btn-secondary'"
                @click.prevent="deliverIsAddress = false"
              >
                Новый адрес
              </button>
              <button
                class="btn btn-sm w-100"
                :class="deliverIsAddress ? 'btn-primary' : 'btn-secondary'"
                @click.prevent="deliverIsAddress = true"
              >
                Мои адреса
              </button>
            </div>
          </li>
          <li
            class="
              list-group-item
              d-flex
              justify-content-between
              align-items-center
            "
            v-if="deliverDelivery && deliverIsAddress && user"
          >
            <div class="w-100" v-if="user.addresses.length">
              <div
                class="form-check mb-2"
                style="cursor: pointer"
                v-for="item in user.addresses"
                :key="item.id"
              >
                <input
                  class="form-check-input"
                  type="radio"
                  :id="'radios-2-' + item.id"
                  :value="item"
                  v-model="state.deliver_to_address"
                />
                <label
                  class="form-check-label flex-grow-1"
                  style="cursor: pointer"
                  :for="'radios-2-' + item.id"
                >
                  <span class="fw-semibold d-block">{{
                    item.address_line
                  }}</span>
                  <span class="fs-sm">{{ item.reference_point }}</span>
                </label>
              </div>
            </div>
            <div class="form-control p-5 text-center" v-else>
              У вас нет сохраненных адресов, их можно добавить на странице
              <router-link :to="{ name: 'profile-user' }"
                ><span data-bs-dismiss="modal">Профиля</span></router-link
              >
            </div>
          </li>
          <li
            class="
              list-group-item
              d-flex
              justify-content-between
              align-items-center
            "
            v-if="deliverDelivery && !deliverIsAddress"
          >
            <div class="form-check-label fw-semibold">Адрес</div>
            <div class="col-6">
              <input
                type="text"
                class="form-control"
                v-model="state.deliver_to_address.address_line"
                :class="{
                  'is-invalid':
                    v$.deliver_to_address.address_line.$errors.length,
                }"
                @blur="v$.deliver_to_address.address_line.$touch"
                placeholder="Введите адрес"
              />
              <div
                v-if="v$.deliver_to_address.address_line.$errors.length"
                class="invalid-feedback animated fadeIn fs-xs"
              >
                Пожалуйста, введите адрес
              </div>
            </div>
          </li>
          <li
            class="
              list-group-item
              d-flex
              justify-content-between
              align-items-center
            "
            v-if="deliverDelivery && !deliverIsAddress"
          >
            <div class="form-check-label fw-semibold">Ориентир</div>
            <div class="col-6">
              <input
                type="text"
                class="form-control"
                v-model="state.deliver_to_address.reference_point"
                :class="{
                  'is-invalid':
                    v$.deliver_to_address.reference_point.$errors.length,
                }"
                @blur="v$.deliver_to_address.reference_point.$touch"
                placeholder="Введите ориентир"
              />
              <div
                v-if="v$.deliver_to_address.reference_point.$errors.length"
                class="invalid-feedback animated fadeIn fs-xs"
              >
                Пожалуйста, введите ориентир
              </div>
            </div>
          </li>
          <li
            class="
              list-group-item
              d-flex
              justify-content-between
              align-items-center
            "
            v-if="deliverDelivery && !deliverIsAddress"
          >
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
                  :class="{
                    'is-invalid': v$.deliver_to_address.location.$errors.length,
                  }"
                >
                  Выбрать на карте
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
import BaseModal from "@/components/BaseModal.vue";
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch,
  onUnmounted,
} from "vue";
import {required, requiredIf} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { useOrderUserStore } from "@/stores/dashboard/order/user";

// import {useMapStore} from "@/stores/dashboard/map";
import { useYMapStore } from "@/stores/dashboard/yMap";

import { useUserStore } from "@/stores/dashboard/user/user";

import tooltip from "@/utils/tooltip";
import {useTariffsPublicStore} from "@/stores/dashboard/tariffs/public";
const tt = tooltip();
const storeUserOrder = useOrderUserStore();
const storeMap = useYMapStore();
const profile = useUserStore();
const tariffStore = useTariffsPublicStore();

const user = computed(() => profile.user);
const tariffs = computed(() => tariffStore.tariffs);

const receiveDelivery = ref(false);
const receiveIsAddress = ref(false);
const deliverDelivery = ref(false);
const deliverIsAddress = ref(false);
const modal = ref(null);
const map = computed(() => storeMap.yMap);

watch(map, (value) => {
  if (value && value.index) {
    if (value.index === "1") {
      state.receive_from_address.location = value;
    }
    if (value.index === "2") {
      state.deliver_to_address.location = value;
    }
    storeMap.setYMap(null);
  }
});

watch(receiveIsAddress, (value) => {
  if (!value) {
    state.receive_from_address = {
      type: "address_line",
      address_line: "",
      reference_point: "",
      location: null,
    };
  }
});

watch(deliverIsAddress, (value) => {
  if (!value) {
    state.deliver_to_address = {
      type: "address_line",
      address_line: "",
      reference_point: "",
      location: null,
    };
  }
});

// Validate
let state = reactive({
  tariff_id: null,
  immediate: false,
  receive_from_address: {
    type: "department",
    address_line: "",
    reference_point: "",
    location: null,
  },
  deliver_to_address: {
    type: "department",
    address_line: "",
    reference_point: "",
    location: null,
  },
  desired_receive_delivery_time: null
});
const rules = computed(() => {
  return {
    tariff_id: {required},
    receive_from_address: {
      address_line: {
        required: requiredIf(() => {
          return receiveDelivery.value;
        }),
      },
      reference_point: {
        required: requiredIf(() => {
          return receiveDelivery.value;
        }),
      },
      location: {
        required: requiredIf(() => {
          return receiveDelivery.value;
        }),
      },
    },
    deliver_to_address: {
      address_line: {
        required: requiredIf(() => {
          return deliverDelivery.value;
        }),
      },
      reference_point: {
        required: requiredIf(() => {
          return deliverDelivery.value;
        }),
      },
      location: {
        required: requiredIf(() => {
          return deliverDelivery.value;
        }),
      },
    },
  };
});
const v$ = useVuelidate(rules, state, { $scope: false });

//submit
const submit = async () => {
  const result = await v$.value.$validate();
  if (!result) {
    return;
  }
  if (receiveDelivery.value) {
    state.receive_from_address.type = "address_line";
  } else state.receive_from_address.type = "department";
  if (deliverDelivery.value) {
    state.deliver_to_address.type = "address_line";
  } else state.deliver_to_address.type = "department";
  if (state.desired_receive_delivery_time) {
    state.desired_receive_delivery_time = Math.floor(new Date(state.desired_receive_delivery_time).getTime() / 1000)
  }
  try {
    await storeUserOrder.createOrder(state);
    await resetState();
    v$.value.$reset();
    await modal.value.hide();
  } catch (e) {
    console.log(e);
  }
};
const resetState = async () => {
  state.receive_from_address = {
    type: "department",
    address_line: "",
    reference_point: "",
    location: null,
  };
  state.deliver_to_address = {
    type: "department",
    address_line: "",
    reference_point: "",
    location: null,
  };
  receiveDelivery.value = false;
  receiveIsAddress.value = false;
  deliverDelivery.value = false;
  deliverIsAddress.value = false;
};
onMounted(() => {
  modal.value = new window.bootstrap.Modal("#create-order");
  let modalBlock = document.getElementById('create-order')
  modalBlock.addEventListener('show.bs.modal', async () => {
    tariffStore.getTariffs()
  })
});

onUnmounted(() => {
  tt.dispose();
});
defineComponent({ name: "ModalCreateOrderUser" });
</script>
