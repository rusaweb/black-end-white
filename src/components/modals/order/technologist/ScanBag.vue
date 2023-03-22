<template>
  <BaseModal title="Сканировать" id="scan-code-bag">
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
import {required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import {useOrderTechnologistStore} from "@/stores/dashboard/order/technologist";
import router from "@/router";

const state = reactive({
  code: ''
})
const rules = computed(() => {
  return {
    code: {required},
  };
});
const v$ = useVuelidate(rules, state, {$scope: false});

const storeTechnologistOrder = useOrderTechnologistStore()
const input = ref(null)
const modal = ref(null)
const order = computed(() => storeTechnologistOrder.orderBagCode)
const submit = async () => {
  const result = await v$.value.$validate();

  if (!result) {
    return;
  }
  try {
    await storeTechnologistOrder.getOrderByBagCode(state.code)
    await router.push({name: 'order-technologist-detail', params: {id: order.value.id}})
    modal.value.hide()
  } catch (e) {
    console.log(e)
  }
}

onMounted(() => {
  modal.value = new window.bootstrap.Modal('#scan-code-bag')
  document.getElementById('scan-code-bag').addEventListener('shown.bs.modal', () => {
    input.value.focus()
  })
})
defineComponent({name: 'ModalScanBag'})
</script>

