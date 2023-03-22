<template>
  <BaseModal title="Добавить информацию о звонке" id="modal-create-leads-comment">
    <template #content>
      <div class="block-content fs-sm">
        <form action="" class="items-push row">
          <div class="fw-normal">
            <label for="date-create-add" class="form-label">Время звонка</label>
            <input
                type="datetime-local"
                id="date-create-add"
                class="form-control"
                v-model="state.time"
                :class="{ 'is-invalid': v$.time.$errors.length}"
                @blur="v$.time.$touch"
            >
            <div
                v-if="v$.time.$errors.length"
                class="invalid-feedback animated fadeIn"
            >
              Пожалуйста, введите время звонка
            </div>
          </div>
          <div class="fw-normal">
            <label for="comment-create-add" class="form-label">Комментарии </label>
            <textarea
                type="datetime-local"
                id="comment-create-add"
                class="form-control"
                placeholder="Введите Комментарии "
                v-model="state.comment"
                :class="{ 'is-invalid': v$.comment.$errors.length}"
                @blur="v$.comment.$touch"
            >
            </textarea>
            <div
                v-if="v$.comment.$errors.length"
                class="invalid-feedback animated fadeIn"
            >
              Пожалуйста, введите Комментарии
            </div>
          </div>
          <div class="fw-normal">
            <label for="next-date-create" class="form-label d-flex align-items-center">
              След звонок
              <div class="fw-normal form-check form-switch ms-2">
                <input v-model="state.set_next_call_time" type="checkbox" id="set_next_call_time" class="form-check-input">
              </div>
            </label>
            <input
                :disabled="!state.set_next_call_time"
                v-model="state.next_call_time"
                type="datetime-local"
                id="next-date-create"
                class="form-control"
                :class="{ 'is-invalid': v$.next_call_time.$errors.length}"
                @blur="v$.next_call_time.$touch"
            >
            <div
                v-if="v$.next_call_time.$errors.length"
                class="invalid-feedback animated fadeIn"
            >
              Пожалуйста, введите время следуюшего звонка
            </div>
          </div>
        </form>
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
import BaseModal from "@/components/BaseModal.vue"
import {computed, defineComponent, onMounted, reactive, ref} from "vue";
import {required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import {useLeadsStore} from "@/stores/dashboard/leads/leads";

const modal = ref(null)
const id = ref(null)

const leadStore = useLeadsStore()

const state = reactive({
  time: '',
  comment: '',
  set_next_call_time: true,
  next_call_time: ''
})
const rules = computed(() => {
  return {
    time: {required},
    comment: {required},
    next_call_time: {required: state.set_next_call_time},
  };
});
const v$ = useVuelidate(rules, state);

const submit = async () => {
  const result = await v$.value.$validate();
  if (!result) {
    return;
  }

  let data = JSON.parse(JSON.stringify(state))
  data.id = id.value
  data.time = Math.floor(new Date(state.time).getTime() / 1000)
  data.next_call_time = Math.floor(new Date(state.next_call_time).getTime() / 1000)

  try {
    await leadStore.createLeadCall(data)
    modal.value.hide()
  }catch (e) { console.log(e)}
}

const getCurrentDate = () => {
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let hours = date.getHours('numeric');
  let minutes = date.getMinutes();
  if (day < 10) day = '0' + day;
  if (month < 10) month = '0' + month;
  if (hours < 10) hours = '0' + hours;
  if (minutes < 10) minutes = '0' + minutes;
  let result = `${year}-${month}-${day} ${hours}:${minutes}`;

  state.time = result
  state.next_call_time = result
}
onMounted(() => {
  getCurrentDate()
  modal.value = new window.bootstrap.Modal('#modal-create-leads-comment')
  const modalInfo = document.getElementById('modal-create-leads-comment')
  modalInfo.addEventListener('show.bs.modal', async event => {
    id.value = event.relatedTarget.dataset.bsId
  })
})
defineComponent({name: "ModalCommentLead"})
</script>
