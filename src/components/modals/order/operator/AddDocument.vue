<template>
  <BaseModal title="Добавить документ" id="add-document">
    <template #content>
      <div class="block-content block-content-full">
        <form @submit.prevent="submit">
          <label class="form-label" for="scan-code">Документ</label>
          <input
              class="form-control"
              type="file"
              id="file-document"
              @change="(e) => state.file = e.target.files[0]"
              :class="{ 'is-invalid': v$.file.$errors.length}"
              @blur="v$.file.$touch"
          >
          <div
              v-if="v$.file.$errors.length"
              class="invalid-feedback animated fadeIn fs-xs"
          >
            Пожалуйста, выберите файл
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
import router from "@/router";
import {useOrderOperatorStore} from "@/stores/dashboard/order/operator";

const state = reactive({
  file: ''
})
const rules = computed(() => {
  return {
    file: {required},
  };
});
const v$ = useVuelidate(rules, state, {$scope: false});

const storeOrder = useOrderOperatorStore()
const modal = ref(null)
const submit = async () => {
  const result = await v$.value.$validate();

  if (!result) {
    return;
  }
  try {
    const formData = new FormData()
    formData.append('id', router.currentRoute.value.params.id)
    formData.append('document', state.file)
    await storeOrder.createDocument(formData)
    await storeOrder.getOrder(router.currentRoute.value.params.id)
    modal.value.hide()
  } catch (e) {
    console.log(e)
  }
}

onMounted(() => {
  modal.value = new window.bootstrap.Modal('#add-document')
})
defineComponent({name: 'AddDocument'})
</script>

