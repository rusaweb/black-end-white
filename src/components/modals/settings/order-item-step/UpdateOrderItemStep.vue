<template>
  <BaseModal title="Добавить этап" id="update-order-item-step">
    <template #content>
      <div class="block-content block-content-full">
        <div class="row items-push">
          <div class="col-12">
            <label for="name" class="form-label">Название</label>
            <input
                type="text"
                class="form-control"
                placeholder="Введите название"
                v-model="state.name"
                :class="{ 'is-invalid': v$.name.$errors.length}"
                @blur="v$.name.$touch"
            >
            <div
                v-if="v$.name.$errors.length"
                class="invalid-feedback animated fadeIn fs-xs"
            >
              Пожалуйста, введите название
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
</template>

<script setup>
import BaseModal from "@/components/BaseModal.vue"
import {computed, defineComponent, onMounted, reactive, ref} from "vue";
import {required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import {useOrderItemStepAdministratorStore} from "@/stores/dashboard/order-item-step/administrator";
import router from "@/router";
const modal = ref(null)
const storeOperatorOrderItem = useOrderItemStepAdministratorStore()
const orderItem = computed(() => storeOperatorOrderItem.orderItemStep);
let state = reactive({
  name: "",
})
const rules = computed(() => {
  return {
    name: {required}
  };
});
const v$ = useVuelidate(rules, state, {$scope: false});
//submit
const submit = async () => {
  const result = await v$.value.$validate();
  if (!result) {
    return;
  }
  try {
    await storeOperatorOrderItem.updateOrderItemStep(state)
    await storeOperatorOrderItem.getOrderItemSteps(router.currentRoute.value.query)
    state.name = ''
    v$.value.$reset()
    await modal.value.hide()
  } catch (e) {
    console.log(e)
  }
}
onMounted(() => {
  modal.value = new window.bootstrap.Modal('#update-order-item-step')
  document.getElementById('update-order-item-step').addEventListener('show.bs.modal', async (event) => {
    state.id = event.relatedTarget.dataset.bsId
    await storeOperatorOrderItem.getOrderItemStep(state.id)
    state.name = orderItem.value.name
  })
})
defineComponent({name: 'ModalUpdateOrderItemStep'})
</script>
