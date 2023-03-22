<template>
  <BaseModal title="Редактировать статус" id="update-status">
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
          <div class="col-12">
            <label for="name" class="form-label">Процент</label>
            <input
                type="text"
                class="form-control"
                placeholder="Введите процент"
                v-model="state.order_total_amount_discount_percent"
                :class="{ 'is-invalid': v$.order_total_amount_discount_percent.$errors.length}"
                @blur="v$.order_total_amount_discount_percent.$touch"
            >
            <div
                v-if="v$.order_total_amount_discount_percent.$errors.length"
                class="invalid-feedback animated fadeIn fs-xs"
            >
              Пожалуйста, введите процент
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
import router from "@/router";
import {useStatusStore} from "@/stores/dashboard/user-status/administrator";
const modal = ref(null)
const storeStatus = useStatusStore()
let state = reactive({
  id: null,
  name: "",
  order_total_amount_discount_percent: null,
})
const rules = computed(() => {
  return {
    name: {required},
    order_total_amount_discount_percent: {required},
  };
});
const v$ = useVuelidate(rules, state, {$scope: false});
//submit
const status = computed(() =>  storeStatus.status);
const submit = async () => {
  const result = await v$.value.$validate();
  if (!result) {
    return;
  }
  try {
    await storeStatus.updateStatus(state)
    await storeStatus.getStatuses(router.currentRoute.value.query)
    state.id = null
    state.name = ''
    state.order_total_amount_discount_percent = null
    v$.value.$reset()
    await modal.value.hide()
  } catch (e) {
    console.log(e)
  }
}
onMounted(() => {
  modal.value = new window.bootstrap.Modal('#update-status')
  document.getElementById('update-status').addEventListener('show.bs.modal', async (event) => {
    state.id = event.relatedTarget.dataset.bsId
    await storeStatus.getStatus(state.id)
    state.name = status.value.name
    state.order_total_amount_discount_percent = status.value.order_total_amount_discount_percent
  })
})
defineComponent({name: 'ModalUpdateStatus'})
</script>
