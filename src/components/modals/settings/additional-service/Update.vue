<template>
  <BaseModal title="Редактировать услугу" id="update-additional-service">
    <template #content>
      <div class="block-content block-content-full">
        <div v-if="!load" class="row items-push">
          <div class="col-12">
            <label class="form-label">Название</label>
            <input
                type="text"
                class="form-control"
                v-model="state.name"
                placeholder="Введите название"
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
            <label class="form-label d-block">Цена</label>
            <div class="input-group">
              <input
                  type="text"
                  class="form-control"
                  v-model="state.price.amount"
                  placeholder="Введите цену"
              >
              <div class="input-group-text">Сум</div>
            </div>
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
import {useAdditionalServiceAdministratorStore} from "@/stores/dashboard/additional-services/administrator";
import router from "@/router";
const modal = ref(null)
const storeAdditionalService = useAdditionalServiceAdministratorStore()
const service = computed(() => storeAdditionalService.service)
const load = ref(false);
let state = reactive({
  id: null,
  name: "",
  price: {
    type: "fixed_price",
    amount: null,
    currency: "UZS"
  }
})
const rules = computed(() => {
  return {
    name: {required},
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
    state.category_id = state.category_children?.id || null
    await storeAdditionalService.updateAdditionalService(state)
    await storeAdditionalService.getAdditionalServiceList(router.currentRoute.value.query)
    await modal.value.hide()
    state.name = ''
    state.category_parent = null
    state.category_children = null
    state.price = {
      amount: '',
      currency: "UZS"
    }
    v$.value.$reset()
  } catch (e) {
    console.log(e)
  }
}
onMounted(() => {
  modal.value = new window.bootstrap.Modal('#update-additional-service')
  document.getElementById('update-additional-service').addEventListener('show.bs.modal', async (event) => {
    load.value = true
    state.id = event.relatedTarget.dataset.bsId
    await storeAdditionalService.getAdditionalService(state.id)
    state.name = service.value.name
    state.price = service.value.price
    load.value = false
  })
})
defineComponent({name: 'ModalUpdateAdditionalService'})
</script>