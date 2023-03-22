<template>
  <BaseModal title="Добавить код" id="reg-bag-code">
    <template #content>
      <div class="block-content fs-sm">
        <form @submit.prevent="saveBagCode" class="items-push row">
          <div class="fw-normal">
            <label for="code-product" class="form-label">Код</label>
            <input ref="inputCode" v-model="bagCodeValue" type="text" id="code-product" class="form-control"
                   placeholder="Введите Код товара или сканируйте">
          </div>
        </form>
      </div>
    </template>
    <template #footer>
      <button
          type="button"
          class="btn btn-sm btn-success me-1"
          data-bs-dismiss="modal"
          @click="saveBagCode"
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
import {defineComponent, onMounted, ref} from "vue";
import BaseModal from "@/components/BaseModal.vue";
import {useOrderCourierStore} from "@/stores/dashboard/order/courier";
import router from "@/router";
const storeCourier = useOrderCourierStore()
const modal = ref(null);
const inputCode = ref(null);
const bagCodeValue = ref('');

const saveBagCode = async () => {
  await storeCourier.setBagCode({id: router.currentRoute.value.params.id, code: bagCodeValue.value})
  await storeCourier.getOrder(router.currentRoute.value.params.id)
  modal.value.hide()
}


onMounted(() => {
  modal.value = new window.bootstrap.Modal('#reg-bag-code')
  const modalInfo = document.getElementById('reg-bag-code')
  modalInfo.addEventListener('shown.bs.modal', async () => {
    inputCode.value.select()
  })
})
defineComponent({name: 'ModalRegisterBagCode'})
</script>