<template>
  <BaseModal title="Сканировать" id="scan-code-hanger">
    <template #content>
      <div class="block-content block-content-full">
        <form>
          <label class="form-label" for="scan-code">Код</label>
          <input ref="input" class="form-control" type="text" id="scan-code">
        </form>
      </div>
    </template>
    <template #footer>
      <button
          type="button"
          class="btn btn-sm btn-success me-1"
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
import {defineComponent, onMounted, ref} from "vue";

const input = ref(null)

onMounted(() => {
  document.getElementById('scan-code-hanger').addEventListener('shown.bs.modal', () => {
    input.value.focus()
  })
})
defineComponent({name: 'ModalScanHanger'})
</script>
