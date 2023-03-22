<template>
  <BaseModal title="Редактировать вешалку" id="update-hanger">
    <template #content>
      <div class="block-content block-content-full">
        <div class="row items-push">
          <div class="col-12">
            <label for="name" class="form-label">Название</label>
            <input type="text" class="form-control" placeholder="Введите название" v-model="state.code"
                   :class="{ 'is-invalid': v$.code.$errors.length }" @blur="v$.code.$touch">
            <div v-if="v$.code.$errors.length" class="invalid-feedback animated fadeIn fs-xs">
              Пожалуйста, введите название
            </div>
          </div>
          <div class="col-12">
            <label for="name" class="form-label">Категория</label>
            <select id="status" class="form-select" v-model="state.category_id">
              <option :value="null">Выберите категорию</option>
              <option v-for="item in categories?.content" :key="item.id" :value="item.id">{{ item.name }} ({{item.width_sm}}см / {{item.height_sm}}см)</option>
            </select>
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
import {useHangerStore} from "@/stores/dashboard/hanger/administrator";
import {useHangerCategoryStore} from "@/stores/dashboard/hanger_category/administrator";
const modal = ref(null)
const storeHanger = useHangerStore()
const storeHangerCategory = useHangerCategoryStore()

const hanger = computed(() => storeHanger.hanger);
const categories = computed(() => {
  return storeHangerCategory.hanger_categories;
});
let state = reactive({
  id: null,
  code: "",
  category_id: "",
})
const rules = computed(() => {
  return {
    code: {required}
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
    await storeHanger.updateHanger(state)
    await storeHanger.getHangerList(router.currentRoute.value.query)
    state.code = ''
    state.category_id = null
    v$.value.$reset()
    await modal.value.hide()
  } catch (e) {
    console.log(e)
  }
}
onMounted(() => {
  modal.value = new window.bootstrap.Modal('#update-hanger')
  storeHangerCategory.getHangerCategories(router.currentRoute.value.query)
  document.getElementById('update-hanger').addEventListener('show.bs.modal', async (event) => {
    state.id = event.relatedTarget.dataset.bsId
    await storeHanger.getHanger(state.id)
    state.code = hanger.value.code
    state.category_id = hanger.value.category.id
  })
})
defineComponent({name: 'ModalUpdateHanger'})
</script>
