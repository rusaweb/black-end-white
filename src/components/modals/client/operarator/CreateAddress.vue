<template>
  <BaseModal title="Добавить адрес" id="create-address">
    <template #content>
      <div class="block-content fs-sm">
        <form action="" class="form-block items-push row">
          <div class="col-12 fw-normal">
            <label for="address" class="form-label">Адрес</label>
            <div class="input-group">
              <input
                  type="text"
                  v-model="state.address_line"
                  id="address"
                  class="form-control"
                  placeholder="Введите адрес"
                  :class="{ 'is-invalid': v$.address_line.$errors.length}"
                  @blur="v$.address_line.$touch"
              >
              <div
                  v-if="v$.address_line.$errors.length"
                  class="invalid-feedback animated fadeIn fs-xs"
              >
                Пожалуйста, введите адрес
              </div>
            </div>
          </div>
          <div class="col-12 fw-normal">
            <label for="address" class="form-label">Ориентир</label>
            <div class="input-group">
              <input
                  type="text"
                  v-model="state.reference_point"
                  id="address"
                  class="form-control"
                  placeholder="Введите адрес"
                  :class="{ 'is-invalid': v$.reference_point.$errors.length}"
                  @blur="v$.reference_point.$touch"
              >
              <div
                  v-if="v$.reference_point.$errors.length"
                  class="invalid-feedback animated fadeIn fs-xs"
              >
                Пожалуйста, введите адрес
              </div>
            </div>
          </div>
          <div class="col-lg-6 fw-normal" v-if="!state.location">
            <div class="form-label">Локация</div>
            <button
                class="btn btn-alt-primary"
                data-bs-target="#map"
                data-bs-toggle="modal"
                data-bs-back="#create-address"
                :data-bs-index="0"
                @click.prevent
            >Выбрать на карте</button>
            <div
                v-if="v$.location.$errors.length"
                class="invalid-feedback animated fadeIn fs-xs"
            >
              Пожалуйста, введите адрес
            </div>
          </div>
          <div class="col-lg-6 fw-normal" v-else>
            <div class="form-label">Локация</div>
            <div class="input-group">
              <div class="form-control">Точка установлена</div>
              <button
                  class="btn btn-alt-primary"
                  data-bs-target="#map"
                  data-bs-toggle="modal"
                  data-bs-back="#create-address"
                  :data-bs-index="0"
                  @click.prevent
              >
                <i class="fa fa-pen"></i>
              </button>
            </div>
          </div>
        </form>
      </div>
    </template>
    <template #footer>
      <button
          type="button"
          class="btn btn-sm btn-success me-1"
          @click="submit"
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
import {computed, defineComponent, onMounted, reactive, ref, watch} from "vue";
import {required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import {useUserOperatorStore} from "@/stores/dashboard/user/operator";

// import {useMapStore} from "@/stores/dashboard/map";
import { useYMapStore } from "@/stores/dashboard/yMap";

import router from "@/router";

const modal = ref(null)
const id = ref(null)
//store
const userClientsOperatorStore = useUserOperatorStore()
const storeMap = useYMapStore()
const map = computed(() => storeMap.yMap)
// validation

watch(map, value => {
  if (value && value.index) {
    state.location = value
    storeMap.setYMap(null)
  }
})
// validation
const state = reactive({
  type: "address_line",
  address_line: "",
  reference_point: "",
  location: null,
})
const rules = computed(() => {
  return {
    address_line: {required},
    reference_point: {required},
    location: {required},
  };
});
const v$ = useVuelidate(rules, state, { $scope: false });

const submit = async () => {
  const result = await v$.value.$validate();

  if (!result) {
    return;
  }
  try {
    state.id = router.currentRoute.value.params.id
    await userClientsOperatorStore.createUserAddress(state)
    await userClientsOperatorStore.getUserById(state.id)
    state.address_line = ''
    state.reference_point = ''
    state.location = null
    v$.value.$reset()
    await modal.value.hide()
  } catch (e) {
    console.log(e)
  }
}

onMounted(() => {
  modal.value = new window.bootstrap.Modal('#create-address')
  let modalBlock = document.getElementById('create-address')
  modalBlock.addEventListener('show.bs.modal', async event => {
    id.value = event.relatedTarget.dataset.bsId
  })
})

defineComponent({name: "ModalCreateAddress"})
</script>
