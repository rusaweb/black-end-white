<template>
  <BaseModal title="Редактироваль промо-код" id="update-promo-code">
    <template #content>
      <div class="block-content block-content-full">
        <div class="row items-push">
          <div class="col-12">
            <label for="name" class="form-label">ID</label>
            <input
                type="text"
                class="form-control"
                placeholder="Введите ID"
                v-model="state.id"
                :class="{ 'is-invalid': v$.id.$errors.length}"
                @blur="v$.id.$touch"
            >
            <div
                v-if="v$.id.$errors.length"
                class="invalid-feedback animated fadeIn fs-xs"
            >
              Пожалуйста, введите ID
            </div>
          </div>
          <div class="col-12">
            <label for="name" class="form-label">Процент</label>
            <div class="input-group">
              <input
                  type="number"
                  class="form-control"
                  placeholder="Введите Процент"
                  v-model="state.discount_percent"
                  :class="{ 'is-invalid': v$.discount_percent.$errors.length}"
                  @blur="v$.discount_percent.$touch"
              >
              <div class="input-group-text bg-secondary border-0 text-white"><i class="fa-solid fa-percent"></i></div>
            </div>
            <div
                v-if="v$.discount_percent.$errors.length"
                class="invalid-feedback animated fadeIn fs-xs"
            >
              Пожалуйста, введите Процент
            </div>
          </div>
          <div class="col-12">
            <label class="form-label d-flex align-items-center">
              Одноразовый
            </label>
            <div class="fw-normal form-check form-switch">
              <input v-model="state.one_time_mode" type="checkbox" class="form-check-input">
            </div>
          </div>
          <div class="col-12">
            <label class="form-label d-flex align-items-center">
              До какого времени
            </label>
            <input v-model="state.expires_at" type="datetime-local" :min="min" class="form-control">
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
import {usePromoCodeStore} from "@/stores/dashboard/promocode/operator";

const modal = ref(null)
const storePromoCode = usePromoCodeStore()
const date = (new Date(new Date(Date.now() - (new Date().getTimezoneOffset() * 60000)))).toISOString().split(':')
date.pop()
const min = date.join(':');
let state = reactive({
  id: "",
  discount_percent: null,
  one_time_mode: false,
  expires_at: min,
})
const rules = computed(() => {
  return {
    id: {required},
    discount_percent: {required},
  };
});
const promo_code = computed(() =>  storePromoCode.promo_code);
const v$ = useVuelidate(rules, state, {$scope: false});
//submit
const submit = async () => {
  const result = await v$.value.$validate();
  if (!result) {
    return;
  }
  try {
    state.expires_at = Math.floor(new Date(state.expires_at).getTime() / 1000)
    await storePromoCode.updatePromoCode(state)
    await storePromoCode.getPromoCodeList(router.currentRoute.value.query)
    state.id = ''
    state.discount_percent = null
    state.one_time_mode = false
    state.expires_at = min
    v$.value.$reset()
    await modal.value.hide()
  } catch (e) {
    console.log(e)
  }
}
onMounted(() => {
  modal.value = new window.bootstrap.Modal('#update-promo-code')
  document.getElementById('update-promo-code').addEventListener('show.bs.modal', async (event) => {
    state.id = event.relatedTarget.dataset.bsId
    await storePromoCode.getPromoCode(state.id)
    state.discount_percent = promo_code.value.discount_percent
    state.one_time_mode = promo_code.value.usage_type.type === "one_time"
    const date = (new Date(promo_code.value.expires_at - new Date().getTimezoneOffset() * 60000)).toISOString().split(':')
    date.pop()
    state.expires_at = date.join(':')
  })
})
defineComponent({name: 'ModalUpdatePromoCode'})
</script>
