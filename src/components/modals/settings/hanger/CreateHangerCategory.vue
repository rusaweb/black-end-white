<template>
  <BaseModal title="Добавить категорию" id="create-hanger-category">
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
            <label for="name" class="form-label">Ширина (см)</label>
            <input
                type="text"
                class="form-control"
                placeholder="Введите ширину"
                v-model="state.width_sm"
            >
          </div>
          <div class="col-12">
            <label for="name" class="form-label">Высота (см)</label>
            <input
                type="text"
                class="form-control"
                placeholder="Введите высоту"
                v-model="state.height_sm"
            >
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
import {useHangerCategoryStore} from "@/stores/dashboard/hanger_category/administrator";
const modal = ref(null)
const storeHangerCategory = useHangerCategoryStore()
let state = reactive({
  name: "",
  width_sm: null,
  height_sm: null
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
    await storeHangerCategory.createHangerCategory(state)
    await storeHangerCategory.getHangerCategories(router.currentRoute.value.query)
    state.name = ''
    state.width_sm = null
    state.height_sm = null
    v$.value.$reset()
    await modal.value.hide()
  } catch (e) {
    console.log(e)
  }
}
onMounted(() => {
  modal.value = new window.bootstrap.Modal('#create-hanger-category')
})
defineComponent({name: 'ModalCreateHangerCategory'})
</script>
