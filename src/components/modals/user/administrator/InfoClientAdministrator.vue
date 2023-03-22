<template>
  <BaseModal title="Информация о клиенте" id="info-client">
    <template #content>
      <div class="block-content fs-sm" v-if="user">
        <form class="items-push row">
          <div class="col-lg-6 fw-normal">
            <label for="name-client" class="form-label">Имя</label>
            <input
              type="text"
              v-model="state.display_name"
              id="name-client"
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
            <label for="phone-client" class="form-label">Номер телефона</label>
            <input
              type="text"
              v-model="state.phone_number"
              id="phone-client"
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
            <label for="phone-client" class="form-label">Дата рождения</label>
            <input
              type="date"
              v-model="state.birthday"
              id="phone-client"
              class="form-control"
            />
          </div>
          <div class="col-lg-6 fw-normal">
            <label for="department-client" class="form-label">Отдел</label>
            <VueSelect
              v-if="steps?.content"
              v-model="state.mapped_order_item_step_value"
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
                  id="role-1"
                  value="ADMINISTRATOR"
                  v-model="state.roles"
                />
                <label class="form-check-label" for="role-1">Админ</label>
              </div>
              <div class="form-check col-md-6">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="role-2"
                  value="COURIER"
                  v-model="state.roles"
                />
                <label class="form-check-label" for="role-2">Курьер</label>
              </div>
              <div class="form-check col-md-6">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="role-3"
                  value="OPERATOR"
                  v-model="state.roles"
                />
                <label class="form-check-label" for="role-3">Оператор</label>
              </div>
              <div class="form-check col-md-6">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="role-4"
                  value="TECHNOLOGIST"
                  v-model="state.roles"
                />
                <label class="form-check-label" for="role-4">Технолог</label>
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
      <button
        type="button"
        class="btn btn-sm btn-alt-primary me-1"
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
import { useEmployeesAdministratorStore } from "@/stores/dashboard/employees/administrator";
import { computed, defineComponent, onMounted, reactive, ref } from "vue";
import { minLength, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import VueSelect from "vue-select";
import {useOrderItemStepAdministratorStore} from "@/stores/dashboard/order-item-step/administrator";
const stepStore = useOrderItemStepAdministratorStore();
const steps = computed(() => stepStore.orderItemSteps);
stepStore.getOrderItemSteps();
const id = ref(null);
const modal = ref(null);


const onSearch = async (query) => {
  if (query) {
    await stepStore.getOrderItemSteps({name: query});
  } else {
    await stepStore.getOrderItemSteps();
  }
};
//store
const userAdministratorStore = useEmployeesAdministratorStore();
const user = computed(() => userAdministratorStore.user);
const state = reactive({
  display_name: "",
  phone_number: "",
  birthday: "",
  roles: [],
  status: "",
  mapped_order_item_step_id: null,
  mapped_order_item_step_value: null,
});
const rules = computed(() => {
  return {
    display_name: { required },
    phone_number: { required },
  };
});
const v$ = useVuelidate(rules, state);

const submit = async () => {
  const result = await v$.value.$validate();
  if (!result) {
    return;
  }
  state.mapped_order_item_step_id = state.mapped_order_item_step_value?.id || null;
  let data = JSON.parse(JSON.stringify(state));
  try {
    await userAdministratorStore.updateUser(data);
    state.display_name = ""
    state.phone_number = ""
    state.birthday = ""
    state.roles = []
    state.mapped_order_item_step_id = null
    v$.value.$reset()
    await modal.value.hide();
  } catch (e) {
    console.log(e);
  }
};
onMounted(() => {
  modal.value = new window.bootstrap.Modal("#info-client");
  let modalInfo = document.getElementById("info-client");
  modalInfo.addEventListener("show.bs.modal", async (event) => {
    id.value = event.relatedTarget.dataset.bsId;
    await userAdministratorStore.getUserById(id.value);
    state.id = user.value.id;
    state.display_name = user.value.display_name;
    state.phone_number = user.value.phone_number;
    state.birthday = user.value.birthday;
    state.roles = user.value.roles;
    state.mapped_order_item_step_id = steps.value.content.filter(el => el.id === user.value.mapped_order_item_step?.id).at(0)?.id || null;
    state.mapped_order_item_step_value = steps.value.content.filter(el => el.id === user.value.mapped_order_item_step?.id).at(0);
  });
});

defineComponent({ name: "ModalInfoClientAdministrator" });
</script>
