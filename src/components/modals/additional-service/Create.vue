<template>
  <BaseModal title="Добавить услугу" id="create-additional-service">
    <template #content>
      <div class="block-content block-content-full">
        <div v-if="!load" class="row items-push">
          <div class="col-12">
            <label class="form-label">Выберите услугу</label>
            <VueSelect
              v-if="services?.content"
              v-model="state.additional_service"
              :options="services?.content"
              label="name"
              class="form-control p-0 text-secondary mb-3"
              :placeholder="`Выбирете услугу`"
          >
            <template #no-options>
              <div style="opacity: 0.8">Такой услуги нет</div>
            </template>
          </VueSelect>
          </div>
        </div>
        <div v-else class="w-100 d-flex justify-content-center py-5">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
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
import { useAdditionalService } from "@/stores/dashboard/additional-services/public";
import {useAdditionalServiceOperatorStore} from '@/stores/dashboard/additional-services/operator.js'
import router from "@/router";
import VueSelect from "vue-select";
const storeOperator = useAdditionalServiceOperatorStore()
const modal = ref(null)
const store = useAdditionalService()
const services = computed(() => store.services)

const load = ref(false);
let state = reactive({
  additional_service: null,
  additional_service_id: "",
})
const rules = computed(() => {
  return {
    additional_service: {required},
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
    state.additional_service_id = state.additional_service.id
    state.order_id = router.currentRoute.value.params.id
    await storeOperator.createAdditionalService(state)
    await storeOperator.getAdditionalServices({orderId: router.currentRoute.value.params.id})
    state.additional_service = null
    v$.value.$reset()
    await modal.value.hide()
  } catch (e) {
    console.log(e)
  }
}
onMounted(() => {
  modal.value = new window.bootstrap.Modal('#create-additional-service')
  store.getAdditionalServices({})
})
defineComponent({name: 'ModalCreateAdditionalServiceOrder'})
</script>