<template>
  <BaseModal title="Добавить тег" id="update-tag">
    <template #content>
      <div class="block-content block-content-full">
        <div class="row items-push">
          <div class="col-12">
            <label for="name" class="form-label">Название</label>
            <input
                type="text"
                class="form-control"
                placeholder="Введите название"
                v-model="state.suggestion"
                :class="{ 'is-invalid': v$.suggestion.$errors.length}"
                @blur="v$.suggestion.$touch"
            >
            <div
                v-if="v$.suggestion.$errors.length"
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
import {useTagsStore} from "@/stores/dashboard/tags/operator";
const modal = ref(null)
const storeTags = useTagsStore()
const emit = defineEmits(['updated'])
const tag = computed(() => storeTags.tag)
let state = reactive({
  id: "",
  suggestion: "",
  code: "",
})
const rules = computed(() => {
  return {
    suggestion: {required}
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
    await storeTags.updateTag(state)
    await emit('updated')
    state.suggestion = ''
    v$.value.$reset()
    await modal.value.hide()
  } catch (e) {
    console.log(e)
  }
}
onMounted(() => {
  modal.value = new window.bootstrap.Modal('#update-tag')
  document.getElementById('update-tag').addEventListener('shown.bs.modal', async (event) => {
    state.id = event.relatedTarget.dataset.bsId
    await storeTags.getTag(state.id)
    state.suggestion = tag.value.suggestion
    state.code = tag.value.code
  })
})
defineComponent({name: 'ModalUpdateTag'})
</script>
