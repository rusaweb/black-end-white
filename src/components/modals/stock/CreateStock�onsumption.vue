<template>
  <BaseModal title="Добавить расход" id="modal-create-consumption">
    <template #content>
      <div class="block-content fs-sm">
        <form @submit.prevent="submit" class="items-push row">
          <div class="col-12 fw-normal">
            <label for="department-create" class="form-label"
              >Вес / Количество</label
            >
            <input
              type="number"
              id="department-create"
              class="form-control"
              placeholder="Введите Вес"
              v-model="state.amount"
              :class="{ 'is-invalid': v$.amount.$errors.length }"
              @blur="v$.amount.$touch"
            />
            <div
              v-if="v$.amount.$errors.length"
              class="invalid-feedback animated fadeIn fs-xs"
            >
              Пожалуйста, введите вес / количество
            </div>
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
import BaseModal from "@/components/BaseModal.vue";
import { computed, defineComponent, onMounted, reactive, ref } from "vue";
import { required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { useStockActionTechnologistStore } from "@/stores/dashboard/stock-action/technologist";
import router from "@/router";
const modal = ref(null);
const stockStore = useStockActionTechnologistStore();
let state = reactive({
  type: "consumption",
  amount: "",
});
const rules = computed(() => {
  return {
    amount: { required },
  };
});
const v$ = useVuelidate(rules, state, { $scope: false });
//submit
const submit = async () => {
  const result = await v$.value.$validate();
  if (!result) {
    return;
  }
  try {
    state.stock_item_id = router.currentRoute.value.params.id
    await stockStore.createStock(state);
    await stockStore.getStocks({...router.currentRoute.value.query, stock_item_id: state.stock_item_id});
    await stockStore.getStockAmount( router.currentRoute.value.params.id );
    state.amount = "";
    state.price = "";
    v$.value.$reset();
    await modal.value.hide();
  } catch (e) {
    console.log(e);
  }
};
onMounted(() => {
  modal.value = new window.bootstrap.Modal("#modal-create-consumption");
});
defineComponent({ name: "ModalCreateStockСonsumption" });
</script>
