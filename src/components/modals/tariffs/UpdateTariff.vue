<template>
  <BaseModal title="Редактировать тариф" id="update-tariffs">
    <template #content>
      <div class="block-content block-content-full">
        <div class="row items-push">
          <div class="col-12">
            <label for="name" class="form-label">Иконка</label>
            <input
                v-if="!state.icon"
                type="file"
                class="form-control"
                accept=".jpg, .jpeg, .png, .svg"
                @change="e => uploadIcon(e.target.files[0])"
            >
            <div v-else style="width: 200px;" class="position-relative bg-body rounded p-4">
              <img v-lazy="state.icon.url" class="w-100" alt="">
              <button class="btn btn-sm btn-alt-danger position-absolute bottom-0 end-0" @click.prevent="deleteIcon"><i class="fa fa-trash"></i></button>
            </div>
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
                type="text"
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
            <form v-if="state.descriptions?.length">
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
              <div class="form-check form-switch"
                   v-if="user?.roles?.includes('ADMINISTRATOR')">
                <input class="form-check-input"
                       type="checkbox"
                       role="switch"
                       v-model="state.disabled"
                       id="flexSwitchCheckDisable">
                <label class="form-check-label" for="flexSwitchCheckDisable">Tariff status</label>
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
const storeTariffsPublic = useTariffsPublicStore()
const storeTariffs = useTariffsStore()


// === store user ===
import { useUserStore } from "@/stores/dashboard/user/user";
import { storeToRefs } from "pinia";
const storeUser = useUserStore()
const { user } = storeToRefs(storeUser)

let state = reactive({
  id: null,
  name: "",
  description: '',
  per_item_percent_multiplier: null,
  descriptions: [],
  stars_count: null,
  icon: null,
  disabled: false
})
const rules = computed(() => {
  return {
    name: {required},
    stars_count: {required},
    per_item_percent_multiplier: {required},
  };
});
const v$ = useVuelidate(rules, state, {$scope: false});
//submit
const tariff = computed(() =>  storeTariffsPublic.tariff);
const submit = async () => {
  const result = await v$.value.$validate();
  if (!result) {
    return;
  }
  try {
    state.descriptions.map(e => e.type ? e.type = "advantage" : e.type = 'disadvantage')
    await storeTariffs.updateTariff(state)
    await storeTariffsPublic.getTariffs(router.currentRoute.value.query)
    state.name = ''
    state.description = ''
    state.per_item_percent_multiplier = null
    v$.value.$reset()
    await modal.value.hide()
  } catch (e) {
    console.log(e)
  }
}
onMounted(() => {
  modal.value = new window.bootstrap.Modal('#update-tariffs')
  document.getElementById('update-tariffs').addEventListener('show.bs.modal', async (event) => {
    state.id = event.relatedTarget.dataset.bsId
    await storeTariffsPublic.getTariff(state.id)
    await filledState()
  })
})
const filledState = async () => {
  state.name = tariff.value.name
  state.description = tariff.value.description
  state.descriptions = tariff.value.descriptions
  state.descriptions.map(e => e.type = e.type === "advantage")
  state.stars_count = tariff.value.stars_count
  state.icon = tariff.value.icon
  state.per_item_percent_multiplier = tariff.value.per_item_percent_multiplier
  state.disabled = tariff.value.disabled
}
const addDesc = async () => {
  state.descriptions.push({ type: "advantage", description: "" })
}
const uploadIcon = async (file) => {
  const formData = new FormData()
  formData.append('id', state.id)
  formData.append('file', file)
  await storeTariffs.uploadTariffIcon(formData, async () => {
    await storeTariffsPublic.getTariff(state.id)
    await storeTariffsPublic.getTariffs(router.currentRoute.value.query)
    await filledState()
  })
}
const deleteIcon = async () => {
  await storeTariffs.deleteIcon(state.id, async () => {
    await storeTariffsPublic.getTariff(state.id)
    await storeTariffsPublic.getTariffs(router.currentRoute.value.query)
    await filledState()
  })
}
defineComponent({name: 'ModalUpdateTariff'})
</script>
