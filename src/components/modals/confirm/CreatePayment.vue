<template>
  <BaseModal title="Оплата заказа" id="create-payment">
    <template #content>
      <div class="block-content block-content-full">
        <div class="block-content fs-sm">
          <form @submit.prevent="submit" class="items-push row">
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
import {computed, defineComponent, onMounted, reactive, ref} from "vue";
import { required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import router from "@/router";
// import axios from "axios";
import { usePaymeUserStore } from "@/stores/dashboard/billing-transaction/userPayme";
const storePayme = usePaymeUserStore()
import { storeToRefs } from "pinia";
const { payme } = storeToRefs(storePayme)
const modal = ref(null)

let state = reactive({
  amount: null,
  currency: "UZS"
})

const rules = computed(() => {
  return {
    amount: { required },
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
    await storePayme.getPayme()
    window.open(`https://checkout.paycom.uz/${btoa(`m=${payme.value.cash_id};ac.order_id=${router.currentRoute.value.params.id};a=${state.amount}00;l=ru;ac.payment_id=1`)}`, '_blank')
  } catch (e) {
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
defineComponent({name: 'ModalCreatePayme'})
</script>
