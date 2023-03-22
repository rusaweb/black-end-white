<template>
  <BaseModal ref="modal" title="Создать лида" id="modal-create-leads">
    <template #content>
      <div class="block-content fs-sm">
        <form class="form-block items-push row">
          <div class="col-lg-6 fw-normal">
            <label for="name-create" class="form-label">Имя</label>
            <input
                type="text"
                v-model="state.name"
                id="name-create"
                class="form-control"
                placeholder="Введите имя"
                :class="{ 'is-invalid': v$.name.$errors.length}"
                @blur="v$.name.$touch"
            >
            <div
                v-if="v$.name.$errors.length"
                class="invalid-feedback animated fadeIn"
            >
              Пожалуйста, введите имя
            </div>
          </div>
          <div class="col-lg-6 fw-normal">
            <label for="region-create" class="form-label">Регион</label>
            <input
                type="text"
                v-model="state.region"
                id="region-create"
                class="form-control"
                placeholder="Введите Регион"
                :class="{ 'is-invalid': v$.region.$errors.length}"
                @blur="v$.region.$touch"
            >
            <div
                v-if="v$.region.$errors.length"
                class="invalid-feedback animated fadeIn"
            >
              Пожалуйста, введите регион
            </div>
          </div>
          <div class="col-lg-6 fw-normal">
            <label for="phone-create" class="form-label">Номер телефона</label>
            <input
                type="text"
                v-model="state.phone_number"
                id="phone-create"
                class="form-control"
                placeholder="Введите номер телефона"
                :class="{ 'is-invalid': v$.phone_number.$errors.length}"
                @blur="v$.phone_number.$touch"
            >
            <div
                v-if="v$.phone_number.$errors.length"
                class="invalid-feedback animated fadeIn"
            >
              Пожалуйста, введите номер телефона
            </div>
          </div>
          <div class="col-lg-6 fw-normal">
            <label for="status-create" class="form-label">Статус</label>
            <select class="form-select" v-model="state.status" id="status-create">
              <option :value="list.value" v-for="(list, key) in filterList" :key="key">{{ list.label }}</option>
            </select>
          </div>
          <div class="col-lg-6 fw-normal">
            <label for="date-create" class="form-label">Время звонка</label>
            <input
                type="datetime-local"
                v-model="state.next_call_time"
                id="date-create"
                class="form-control"
                placeholder="Введите время звонка"
                :class="{ 'is-invalid': v$.next_call_time.$errors.length}"
                @blur="v$.next_call_time.$touch"
            >
            <div
                v-if="v$.next_call_time.$errors.length"
                class="invalid-feedback animated fadeIn"
            >
              Пожалуйста, введите время звонка
            </div>
          </div>
          <div class="col-lg-6 fw-normal">
            <label for="comment-create" class="form-label">Комментарии </label>
            <textarea
                type="datetime-local"
                v-model="state.comment"
                id="comment-create"
                class="form-control"
                placeholder="Введите ваше имя"
                :class="{ 'is-invalid': v$.comment.$errors.length}"
                @blur="v$.comment.$touch"
            ></textarea>
            <div
                v-if="v$.comment.$errors.length"
                class="invalid-feedback animated fadeIn"
            >
              Пожалуйста, введите время звонка
            </div>
          </div>
        </form>
        <hr class="border-bottom border-bottom-secondary border-1">
      </div>
    </template>
    <template #footer>
      <button
          type="button"
          class="btn btn-sm btn-success me-1"
          @click="submit"
      >
        Сохранить
      </button>
<!--      <button-->
<!--          type="button"-->
<!--          class="btn btn-sm btn-alt-secondary"-->
<!--          data-bs-dismiss="modal"-->
<!--      >-->
<!--        Закрыть-->
<!--      </button>-->
    </template>
  </BaseModal>
</template>

<script setup>
import BaseModal from "@/components/BaseModal.vue"
import {computed, defineComponent, onMounted, reactive, ref} from "vue";
import useVuelidate from "@vuelidate/core";
import {required, minLength} from "@vuelidate/validators";
import {useLeadsStore} from "@/stores/dashboard/leads/leads";

defineComponent({name: "ModalCreateLead"})
const leadStore = useLeadsStore()
const modal = ref(null)
const filterList = ref([
  {
    label: 'В обработке',
    value: 'IN_PROGRESS'
  },
  {
    label: 'Отказано',
    value: 'REJECTED'
  }
])
const state = reactive({
  name: "",
  region: "",
  phone_number: "",
  comment: "",
  next_call_time: '',
  status: "IN_PROGRESS"
})
const rules = computed(() => {
  return {
    name: {required, minLength: minLength(3)},
    region: {required},
    phone_number: {required},
    comment: {required},
    next_call_time: {required},
  };
});
const v$ = useVuelidate(rules, state);

onMounted(() => {
  modal.value = new window.bootstrap.Modal('#modal-create-leads')
})

const submit = async () => {
  const result = await v$.value.$validate();

  if (!result) {
    return;
  }
  let data = JSON.parse(JSON.stringify(state))
  data.next_call_time = Math.floor(new Date(state.next_call_time).getTime() / 1000)
  try {
    await leadStore.createLead(data)
    modal.value.hide()
  }catch (e) { console.log(e)}
}
</script>
