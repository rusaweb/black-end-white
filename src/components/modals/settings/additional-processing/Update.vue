<template>
  <BaseModal title="Редактировать обработку" id="update-additional-processing">
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
            <label class="form-label">Тип</label>
            <select class="form-select" v-model="state.price.type" id="status-client">
              <option value="fixed_price">Цена</option>
              <option value="order_item_percent">Процент</option>
            </select>
          </div>
          <div class="col-12" v-if="state.price.type === 'fixed_price'">
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
          <div class="col-12" v-else>
            <label class="form-label d-block">Процент</label>
            <div class="input-group">
              <input
                  type="text"
                  class="form-control"
                  v-model="state.price.percent"
                  placeholder="Введите процент"
              >
              <div class="input-group-text">%</div>
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
import {useAdditionalProcessingAdministratorStore} from "@/stores/dashboard/additional-processing/administrator";
import router from "@/router";
const modal = ref(null)
const storeAdditionalProcessing = useAdditionalProcessingAdministratorStore()
const processing = computed(() => storeAdditionalProcessing.processing)
const load = ref(false);
let state = reactive({
  id: null,
  name: "",
  price: {
    type: "fixed_price",
    amount: null,
    percent: null
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
    await storeAdditionalProcessing.updateAdditionalProcessing(state)
    await storeAdditionalProcessing.getAdditionalProcessingList(router.currentRoute.value.query)
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
  modal.value = new window.bootstrap.Modal('#update-additional-processing')
  document.getElementById('update-additional-processing').addEventListener('show.bs.modal', async (event) => {
    load.value = true
    state.id = event.relatedTarget.dataset.bsId
    await storeAdditionalProcessing.getAdditionalProcessing(state.id)
    state.name = processing.value.name
    state.price = processing.value.price
    load.value = false
  })
})
defineComponent({name: 'ModalUpdateAdditionalProcessing'})
</script>