<template>
  <BaseModal title="Создать документ" id="create-add-document">
    <template #content>
      <div class="block-content fs-sm">
        <form action="" class="form-block items-push row">
          <div class="col-12 fw-normal">
            <label for="username_new" class="form-label">Название</label>
            <div class="input-group">
              <input type="text" class="form-control" v-model="state.name">
            </div>
          </div>
          <div class="col-12 fw-normal">
            <label for="username_new" class="form-label">Документ</label>
            <div class="input-group">
              <input type="file" class="form-control" @change="e => uploadImage(e.target.files[0])">
            </div>
          </div>
        </form>
      </div>
    </template>
    <template #footer>
      <button
          type="button"
          class="btn btn-sm btn-success me-1"
          @click="submit"
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
import {defineComponent, onMounted, reactive, ref} from "vue";
import {useUserOperatorStore} from "@/stores/dashboard/user/operator";
const emit = defineEmits(['done', 'delete'])
const modal = ref(null)
const state = reactive({
  name: ''
})
const userOperatorStore = useUserOperatorStore()
const formData = new FormData()

const uploadImage = async (file) => {
  formData.append('document', file);
  formData.append('file_name', state.name || 'Файил без название');
}

const submit = async () => {
  try {
    await userOperatorStore.uploadDocument(formData)
    await userOperatorStore.getUserById(userOperatorStore.user.id)
    formData.delete('document')
    await modal.value.hide()
    emit('done', true)
  } catch (e) {
    console.log(e)
  }
}

onMounted(() => {
  modal.value = new window.bootstrap.Modal('#create-add-document')
})

defineComponent({name: "ModalCreateDocument"})
</script>
