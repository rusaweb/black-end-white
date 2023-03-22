<template>
  <BaseModal title="Сканировать" id="scan-code-thing">
    <template #content>
      <div class="block-content block-content-full">
        <form @submit.prevent="submit">
          <label class="form-label" for="scan-code">Код</label>
          <input
              ref="input"
              v-model="state.code"
              class="form-control"
              type="text"
              id="scan-code"
              :class="{ 'is-invalid': v$.code.$errors.length}"
              @blur="v$.code.$touch"
          >
          <div
              v-if="v$.code.$errors.length"
              class="invalid-feedback animated fadeIn fs-xs"
          >
            Пожалуйста, введите код
          </div>
        </form>
      </div>
    </template>
    <template #footer>
      <button
          type="button"
          class="btn btn-sm btn-success me-1"
          @click.prevent="submit"
      >
        Подтвердить
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
import {computed, defineComponent, onMounted, reactive, ref} from "vue";
import {useOrderItemTechnologistStore} from "@/stores/dashboard/order-item/technologist";
import {required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
const state = reactive({
  code: ''
})
const rules = computed(() => {
  return {
    code: {required},
  };
});
const v$ = useVuelidate(rules, state, {$scope: false});

const storeTechnologistOrderItem = useOrderItemTechnologistStore()
const input = ref(null)
const modalInfo = ref(null)
const modal = ref(null)
const submit = async () => {
  modalInfo.value = new window.bootstrap.Modal('#scan-code-thing-info')
  const result = await v$.value.$validate();
  if (!result) {
    return;
  }
  try {
    await storeTechnologistOrderItem.getOrderItemByCode(state.code)
    modal.value.hide()
    modalInfo.value.show()
  }catch (e) {
    console.log(e)
  }
}

onMounted(() => {
  modal.value = new window.bootstrap.Modal('#scan-code-thing')
  document.getElementById('scan-code-thing').addEventListener('shown.bs.modal', () => {
    console.log(modal.value)
    input.value.focus()
  })
})
defineComponent({name: 'ModalScanThing'})
</script>
