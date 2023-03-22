<template>
  <BaseModal title="Создать тариф" id="create-tariffs">
    <template #content>
      <div class="block-content block-content-full">
        <div class="row items-push">
          <div class="col-12">
            <label for="name" class="form-label">Иконка</label>
            <input
                type="file"
                class="form-control"
                accept=".jpg, .jpeg, .png, .svg"
                @change="e => state.image = e.target.files[0]"
            >
          </div>
          <div class="col-12">
            <label for="name" class="form-label">Оценка (звезд)</label>
            <input
                type="number"
                class="form-control"
                placeholder="Введите название"
                v-model="state.stars_count"
                :class="{ 'is-invalid': v$.stars_count.$errors.length}"
                @blur="v$.stars_count.$touch"
            >
            <div
                v-if="v$.stars_count.$errors.length"
                class="invalid-feedback animated fadeIn fs-xs"
            >
              Пожалуйста, введите оценку
            </div>
          </div>
          <div class="col-12">
            <label for="name" class="form-label">Название</label>
            <input
                type="text"
                class="form-control"
                placeholder="Введите название"
                v-model="state.name"
                :class="{ 'is-invalid': v$.name.$errors.length}"
                @blur="v$.name.$touch"
            >
            <div
                v-if="v$.name.$errors.length"
                class="invalid-feedback animated fadeIn fs-xs"
            >
              Пожалуйста, введите название
            </div>
          </div>
          <div class="col-12">
            <label for="name" class="form-label">Описание</label>
            <textarea
                class="form-control"
                placeholder="Введите описание"
                v-model="state.description"
            ></textarea>
          </div>
          <div class="col-12">
            <label for="name" class="form-label">Процент</label>
            <input
                type="number"
                class="form-control"
                placeholder="Введите процент"
                v-model="state.per_item_percent_multiplier"
                :class="{ 'is-invalid': v$.per_item_percent_multiplier.$errors.length}"
                @blur="v$.per_item_percent_multiplier.$touch"
            >
            <div
                v-if="v$.per_item_percent_multiplier.$errors.length"
                class="invalid-feedback animated fadeIn fs-xs"
            >
              Пожалуйста, введите процент
            </div>
          </div>
          <div class="col-12">
            <h3 class="h3 d-lg-flex justify-content-sm-between">
              Привелегии
              <button
                  type="button"
                  class="btn btn-sm btn-primary me-1 "
                  @click.prevent="addDesc"
              >
                <i class="fa fa-plus me-2"></i> Добавить
              </button>
            </h3>
            <form v-if="state.descriptions.length">
              <div class="items-push" v-for="(item, key) in state.descriptions" :key="key">
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" v-model="item.type" checked>
                  <label class="form-check-label" for="flexSwitchCheckChecked">Преимущество</label>
                </div>
                <div class="col-12 fw-normal">
                  <label :for="`reference_point-${key}`" class="form-label">Описание</label>
                  <textarea :id="`reference_point-${key}`" class="form-control" v-model="item.description"
                            placeholder="Введите описание"></textarea>
                </div>
              </div>
            </form>
          </div>
        </div>
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
import router from "@/router";
import {useTariffsStore} from "@/stores/dashboard/tariffs/administrator";
import {useTariffsPublicStore} from "@/stores/dashboard/tariffs/public";
const modal = ref(null)
const storeTariffs = useTariffsStore()
const storeTariffsPublic = useTariffsPublicStore()

let state = reactive({
  id: null,
  name: "",
  description: '',
  per_item_percent_multiplier: null,
  stars_count: null,
  image: null,
  descriptions: [
    { type: false, description: "" },
  ]
})
//disadvantage
const rules = computed(() => {
  return {
    name: {required},
    stars_count: {required},
    per_item_percent_multiplier: {required},
  };
});
const v$ = useVuelidate(rules, state, {$scope: false});
//submit
const submit = async () => {
  const result = await v$.value.$validate();
  if (!result) {
    return;
  }
  const formData = new FormData()

  try {
    state.descriptions.map(e => e.type ? e.type = "advantage" : e.type = 'disadvantage')
    await storeTariffs.createTariff(state)
    formData.append('id', storeTariffs.tariff.id)
    formData.append('file', state.image)
    if (state.image) {
      await storeTariffs.uploadTariffIcon(formData)
    }
    await storeTariffsPublic.getTariffs(router.currentRoute.value.query)
    state.name = ''
    state.description = null
    state.per_item_percent_multiplier = null
    state.image = null
    v$.value.$reset()
    await modal.value.hide()
  } catch (e) {
    console.log(e)
  }
}
const addDesc = async () => {
  state.descriptions.push({ type: "advantage", description: "" })
}
onMounted(() => {
  modal.value = new window.bootstrap.Modal('#create-tariffs')
})
defineComponent({name: 'ModalCreateTariff'})
</script>
