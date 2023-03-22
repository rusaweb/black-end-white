<template>
  <BaseModal title="Принять в отделении" id="confirm-to-department">
    <template #content>
      <div class="block-content block-content-full">
        <ul class="list-group">
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <div class="form-check-label fw-semibold">Мешок клиента</div>
            <div class="col-6">
              <input
                  type="text"
                  placeholder="Введите код"
                  class="form-control"
                  v-model="state.received_bag_code"
                  :class="{ 'is-invalid': v$.received_bag_code.$errors.length}"
                  @blur="v$.received_bag_code.$touch"
              >
              <div
                  v-if="v$.received_bag_code.$errors.length"
                  class="invalid-feedback animated fadeIn fs-xs"
              >
                Пожалуйста, введите код
              </div>
            </div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <div class="form-check-label fw-semibold">Подпись клиента</div>
            <div class="col-6">
              <button
                  class="btn btn-sm btn-primary w-100"
                  data-bs-target="#create-signature"
                  data-bs-toggle="modal"
                  data-bs-back="#confirm-to-department"
                  data-bs-type="register"
                  v-if="!state.on_receive_subscription_base64"
                  :class="{ 'is-invalid': v$.on_receive_subscription_base64.$errors.length}"
              >
                Установить подпись клиента
              </button>
              <button
                  class="btn btn-sm btn-primary w-100"
                  data-bs-target="#create-signature"
                  data-bs-toggle="modal"
                  data-bs-back="#confirm-to-department"
                  data-bs-type="register"
                  v-else
              >
                Установленно
              </button>
              <div
                  v-if="v$.on_receive_subscription_base64.$errors.length"
                  class="invalid-feedback animated fadeIn fs-xs"
              >
                Пожалуйста, установите подпись клиента
              </div>
            </div>
          </li>
        </ul>
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
import event from "@/utils/eventBus";
import {useOrderOperatorStore} from "@/stores/dashboard/order/operator";
import router from "@/router";
const modal = ref(null)
const storeOperatorOrder = useOrderOperatorStore()


let state = reactive({
  received_bag_code: "",
  on_receive_subscription_base64: "",
})
const rules = computed(() => {
  return {
    received_bag_code: {required},
    on_receive_subscription_base64: {required},
  };
});
const v$ = useVuelidate(rules, state, {$scope: false});

event.$on('signature-submit', ({str, type}) => {
  if (type === 'register'){
    state.on_receive_subscription_base64 = str
  }
})

//submit
const submit = async () => {
  const result = await v$.value.$validate();
  if (!result) {
    return;
  }

  try {
    await storeOperatorOrder.receiveOrderInDepartment({...state, id: router.currentRoute.value.params.id})
    await storeOperatorOrder.getOrder(router.currentRoute.value.params.id)
    await modal.value.hide()
  } catch (e) {
    console.log(e)
  }
}
onMounted(() => {
  modal.value = new window.bootstrap.Modal('#confirm-to-department')
  document.getElementById('confirm-to-department').addEventListener('show.bs.modal', async () => {
    if (storeOperatorOrder.order){
      if (storeOperatorOrder.order.received_bag_code && storeOperatorOrder.order.on_receive_subscription_base64){
        state.received_bag_code = storeOperatorOrder.order.received_bag_code
        state.on_receive_subscription_base64 = storeOperatorOrder.order.on_receive_subscription_base64
        await submit()
      }
    }
  })

})
defineComponent({name: 'ModalConfirmToDepartment'})
</script>
