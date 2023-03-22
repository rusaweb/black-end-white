<template>
  <BaseModal title="Добавить аксессуар" id="add-accessory">
    <template #content>
      <div class="block-content block-content-full">
        <form @submit.prevent="submit">
          <label class="form-label" for="scan-code">Aксессуар</label>
          <VueSelect
              v-if="accessories?.content"
              v-model="state.name"
              :options="accessories?.content"
              label="name"
              class="form-control p-0 text-secondary mb-3"
              :placeholder="`Выбирете aксессуар`"
          >
            <template #no-options>
              <div style="opacity: 0.8">Такого цвета нет</div>
            </template>
            <template #option="{ images, name, selling, description }">
              <div class="d-flex">
                <img style="width: 50px; height: 50px; margin-right: 8px;" :src="images?.at(0)?.url" alt="">
                <p>
                  <strong>Название</strong>: {{ name }} <br>
                  <strong>Доступно</strong>: {{ selling ? 'Да': 'Нет' }}<br>
                  <strong>Описание</strong>: {{ description }}
                </p>
              </div>
            </template>
          </VueSelect>
          <div
              v-if="v$.name.$errors.length"
              class="invalid-feedback animated fadeIn fs-xs"
          >
            Пожалуйста, выберите аксессуар
          </div>
          <label class="form-label" for="scan-code">Количество</label>
          <input type="number" v-model="state.count" class="form-control" placeholder="...">
          <div
              v-if="v$.count.$errors.length"
              class="invalid-feedback animated fadeIn fs-xs"
          >
            Пожалуйста, напишите количество
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
import {useAccessoryStore} from "@/stores/dashboard/accessory/public";
import VueSelect from 'vue-select'
import {useAccessoryOperatorStore} from "@/stores/dashboard/accessory/operator";
import router from "@/router";
const storeAccessoriesOperator = useAccessoryOperatorStore()
const storeAccessories = useAccessoryStore()
const accessories = computed(() => storeAccessories.accessories)
storeAccessories.getAccessories({})
const emit = defineEmits(['done'])
const state = reactive({
  name: null,
  count: 1,
})
const rules = computed(() => {
  return {
    name: {required},
    count: {required},
  };
});
const v$ = useVuelidate(rules, state, {$scope: false});

const modal = ref(null)
const submit = async () => {
  const result = await v$.value.$validate();

  if (!result) {
    return;
  }
  try {
    state.order_id = router.currentRoute.value.params.id
    state.accessory_id = state.name.id
    await storeAccessoriesOperator.createAccessory(state)
    modal.value.hide()
    emit('done')
  } catch (e) {
    console.log(e)
  }
}

onMounted(() => {
  modal.value = new window.bootstrap.Modal('#add-accessory')
})
defineComponent({name: 'AddDocument'})
</script>

