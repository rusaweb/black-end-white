<template>
  <BaseModal title="Создать сотрудника" id="modal-create-clients">
    <template #content>
      <div class="block-content fs-sm">
        <form action="" class="items-push row">
          <div class="col-lg-6 fw-normal">
            <label for="name-client-create" class="form-label">Имя</label>
            <input
              type="text"
              v-model="state.display_name"
              id="name-client-create"
              class="form-control"
              placeholder="Введите имя"
              :class="{ 'is-invalid': v$.display_name.$errors.length }"
              @blur="v$.display_name.$touch"
            />
            <div
              v-if="v$.display_name.$errors.length"
              class="invalid-feedback animated fadeIn fs-xs"
            >
              Пожалуйста, введите имя
            </div>
          </div>
          <div class="col-lg-6 fw-normal">
            <label for="phone-client-create" class="form-label">Номер телефона</label>
            <input
              type="text"
              v-model="state.phone_number"
              id="phone-client-create"
              class="form-control"
              placeholder="Введите номер телефона"
              :class="{ 'is-invalid': v$.phone_number.$errors.length }"
              @blur="v$.phone_number.$touch"
            />
            <div
              v-if="v$.phone_number.$errors.length"
              class="invalid-feedback animated fadeIn fs-xs"
            >
              Пожалуйста, введите номер телефона
            </div>
          </div>
          <div class="col-lg-6 fw-normal">
            <label for="phone-client-create" class="form-label">Дата рождения</label>
            <input
              type="date"
              v-model="state.birthday"
              id="phone-client-create"
              class="form-control"
            />
          </div>
          <div class="col-lg-6 fw-normal">
            <label for="department-client-create" class="form-label">Отдел</label>
            <VueSelect
              v-if="steps?.content"
              v-model="state.mapped_order_item_step"
              :options="steps.content"
              label="name"
              class="form-control p-0 text-secondary border-0"
              placeholder="Укажите отдел"
              @search="onSearch"
              :filterable="false"
            >
              <template #no-options>
                <div style="opacity: 0.8">Такого отдела нет</div>
              </template>
            </VueSelect>
          </div>
          <div class="col-12 fw-normal">
            <div class="form-label">Роль</div>
            <div class="row m-0">
              <div class="form-check col-md-6">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="role-create-1"
                  value="ADMINISTRATOR"
                  v-model="state.roles"
                />
                <label class="form-check-label" for="role-create-1">Админ</label>
              </div>
              <div class="form-check col-md-6">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="role-create-2"
                  value="COURIER"
                  v-model="state.roles"
                />
                <label class="form-check-label" for="role-create-2">Курьер</label>
              </div>
              <div class="form-check col-md-6">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="role-create-3"
                  value="OPERATOR"
                  v-model="state.roles"
                />
                <label class="form-check-label" for="role-create-3">Оператор</label>
              </div>
              <div class="form-check col-md-6">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="role-create-4"
                  value="TECHNOLOGIST"
                  v-model="state.roles"
                />
                <label class="form-check-label" for="role-create-4">Технолог</label>
              </div>
              <div class="form-check col-md-6">
                <input
                    class="form-check-input"
                    type="checkbox"
                    id="role-5"
                    value="PACKAGER"
                    v-model="state.roles"
                />
                <label class="form-check-label" for="role-5">Упаковщик</label>
              </div>
            </div>
          </div>
        </form>
      </div>
    </template>
    <template #footer>
      <button type="button" class="btn btn-sm btn-success me-1" @click="submit">
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
  onUnmounted,
  reactive,
  ref,
  watch,
} from "vue";
import { required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { useEmployeesAdministratorStore } from "@/stores/dashboard/employees/administrator";
import tooltip from "@/utils/tooltip";

// import {useMapStore} from "@/stores/dashboard/map";
import { useYMapStore } from "@/stores/dashboard/yMap";

import VueSelect from "vue-select";
import {useOrderItemStepAdministratorStore} from "@/stores/dashboard/order-item-step/administrator";

const modal = ref(null);
//store
const storeMap = useYMapStore();
const stepStore = useOrderItemStepAdministratorStore();
const map = computed(() => storeMap.yMap);
const steps = computed(() => stepStore.orderItemSteps);
watch(map, (value) => {
  if (value && value.index) {
    state.addresses[value.index].location = value;
    storeMap.setYMap(null);
  }
});
const userAdministratorStore = useEmployeesAdministratorStore();
stepStore.getOrderItemSteps();
// validation
const state = reactive({
  display_name: "",
  phone_number: "",
  birthday: "",
  roles: [],
  type: {
    type: 'individual'
  },
  mapped_order_item_step: null,
});

const rules = computed(() => {
  return {
    display_name: { required },
    phone_number: { required },
    roles: { required },
  };
});
const v$ = useVuelidate(rules, state);

const submit = async () => {
  const result = await v$.value.$validate();

  if (!result) {
    return;
  }
  let data = JSON.parse(JSON.stringify(state));
  data.mapped_order_item_step_id = data.mapped_order_item_step?.id || null
  try {
    await userAdministratorStore.createUser(data, async () => {
      await modal.value.hide();
    });
  } catch (e) {
    console.log(e);
  }
};
const tt = tooltip();

onUnmounted(() => {
  tt.dispose();
});
onMounted(() => {
  tt.init();
  modal.value = new window.bootstrap.Modal("#modal-create-clients");
});

const onSearch = async (query) => {
  if (query) {
    await stepStore.getOrderItemSteps({name: query});
  } else {
    await stepStore.getOrderItemSteps();
  }
};

defineComponent({ name: "ModalCreateClientAdministrator" });
</script>

<style lang="scss">
@import "vue-select/dist/vue-select.css";
@import "@/assets/scss/vendor/vue-select";
</style>