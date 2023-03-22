<template>
  <BaseModal title="Добавить товар" id="modal-create-stock">
    <template #content>
      <div class="block-content fs-sm">
        <form @submit.prevent="submit" class="items-push row">
          <div class="fw-normal">
            <label for="name-product-stock" class="form-label">Товар</label>
            <input
              type="text"
              id="name-product-stock"
              class="form-control"
              placeholder="Введите название"
              v-model="state.name"
              :class="{ 'is-invalid': v$.name.$errors.length }"
              @blur="v$.name.$touch"
            />
            <div
              v-if="v$.name.$errors.length"
              class="invalid-feedback animated fadeIn fs-xs"
            >
              Пожалуйста, введите название
            </div>
          </div>
          <div class="fw-normal">
            <label for="name-product-stock" class="form-label">Тип измерения</label>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                id="measure_type-1"
                name="measure_type"
                v-model="state.measure_type"
                value="KILOGRAM"
              />
              <label class="form-check-label" for="measure_type-1">Килограмм</label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                id="measure_type-2"
                name="measure_type"
                v-model="state.measure_type"
                value="PIECES"
              />
              <label class="form-check-label" for="measure_type-2">Штук</label>
            </div>
            <div
              v-if="v$.measure_type.$errors.length"
              class="invalid-feedback animated fadeIn fs-xs"
            >
              Пожалуйста, введите тип измерения
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
import { useStockAdministratorStore } from "@/stores/dashboard/stock/administrator";
import router from "@/router";
const modal = ref(null);
const stockStore = useStockAdministratorStore();
let state = reactive({
  name: "",
  measure_type: "KILOGRAM",
});
const rules = computed(() => {
  return {
    name: { required },
    measure_type: { required },
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
    await stockStore.createStock(state);
    await stockStore.getStocks(router.currentRoute.value.query);
    state.name = "";
    v$.value.$reset();
    await modal.value.hide();
  } catch (e) {
    console.log(e);
  }
};
onMounted(() => {
  modal.value = new window.bootstrap.Modal("#modal-create-stock");
});
defineComponent({ name: "ModalCreateStock" });
</script>
