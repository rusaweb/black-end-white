<template>
  <BaseModal title="Оплата заказа" id="create-payment">
    <template #content>
      <div class="block-content block-content-full">
        <div class="block-content fs-sm">
          <form @submit.prevent="submit" class="items-push row">
            <div class="fw-normal">
              <label class="form-label d-block">Подпись</label>
              <select v-model="state.type" class="form-select">
                <option value="CASH">Наличными</option>
                <option value="CARD">Картой</option>
              </select>
            </div>
            <div class="fw-normal">
              <label class="form-label d-block">Сумма</label>
              <div class="input-group">
                <input type="text" class="form-control" v-model="state.amount">
                <span class="input-group-text">{{state.currency}}</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </template>
    <template #footer>
      <button
          type="button"
          class="btn btn-sm btn-success me-1"
          id="save"
          @click.prevent="submit"
      >
        Сохранить
      </button>
      <button
          type="button"
          class="btn btn-sm btn-alt-secondary"
          data-bs-dismiss="modal"
          id="clear"
      >
        Закрыть
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import BaseModal from "@/components/BaseModal.vue"
import {useBillingTransactionOperatorStore} from "@/stores/dashboard/billing-transaction/operator";
import {useOrderItemOperatorStore} from "@/stores/dashboard/order-item/operator";
import {useBillingOperatorStore} from "@/stores/dashboard/order-billing/operator";
import {computed, defineComponent, onMounted, reactive, ref} from "vue";
import {required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import router from "@/router";
const storeBillingTransaction = useBillingTransactionOperatorStore()
const storeOperatorOrderItem = useOrderItemOperatorStore()
const storeBillingOperator = useBillingOperatorStore()
const modal = ref(null)
let state = reactive({
  type: "CASH",
  amount: null,
  currency: "UZS"
})

const rules = computed(() => {
  return {
    type: {required},
    amount: {required},
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
    await storeBillingTransaction.createBilling({...state, id: router.currentRoute.value.params.id})
    await storeBillingTransaction.getBilling(router.currentRoute.value.params.id)
    await storeOperatorOrderItem.getOrderItemsById(router.currentRoute.value.params.id)
    await storeBillingOperator.getBilling(router.currentRoute.value.params.id)
    state.type = "CASH"
    state.amount = null
    await modal.value.hide()
  }catch (e) {
    console.log(e)
  }
}
onMounted(() => {
  modal.value = new window.bootstrap.Modal('#create-payment')
  document.getElementById('create-payment').addEventListener('shown.bs.modal', async (event) => {
    // backModal.value = event.relatedTarget.dataset.bsBack
    // type.value = event.relatedTarget.dataset.bsType
  })
})
defineComponent({name: 'ModalCreatePayment'})
</script>
