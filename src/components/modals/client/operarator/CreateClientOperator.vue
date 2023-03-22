<template>
  <BaseModal title="Создать клиента" id="modal-create-clients">
    <template #content>
      <div class="block-content fs-sm">
        <form action="" class="form-block items-push row">
          <div class="col-lg-6 fw-normal">
            <label for="name-client" class="form-label">Имя</label>
            <input
                type="text"
                v-model="state.display_name"
                id="name-client"
                class="form-control"
                placeholder="Введите имя"
                :class="{ 'is-invalid': v$.display_name.$errors.length}"
                @blur="v$.display_name.$touch"
            >
            <div
                v-if="v$.display_name.$errors.length"
                class="invalid-feedback animated fadeIn fs-xs"
            >
              Пожалуйста, введите имя
            </div>
          </div>
          <div class="col-lg-6 fw-normal">
            <label for="phone-client" class="form-label">Номер телефона</label>
            <input
                type="text"
                v-model="state.phone_number"
                id="phone-client"
                class="form-control"
                placeholder="Введите номер телефона"
                :class="{ 'is-invalid': v$.phone_number.$errors.length}"
                @blur="v$.phone_number.$touch"
            >
            <div
                v-if="v$.phone_number.$errors.length"
                class="invalid-feedback animated fadeIn fs-xs"
            >
              Пожалуйста, введите номер телефона
            </div>
          </div>
          <div class="col-lg-6 fw-normal">
            <label for="phone-client" class="form-label">Дата рождения</label>
            <input
                type="date"
                v-model="state.birthday"
                id="phone-client"
                class="form-control"
            >
          </div>

          <div class="col-lg-6 fw-normal">
            <label for="password-create" class="form-label">Тип</label>
            <select class="form-select" v-model="state.type" id="status-client">
              <option :value="list" v-for="(list, key) in types" :key="key">{{ list.type === 'legal_entity' ? 'Юр. лицо' : 'Физ. лицо' }}</option>
            </select>
          </div>
          <div class="col-lg-6 fw-normal" v-if="state.type.type === 'legal_entity'">
            <label for="company-create" class="form-label">Название компании</label>
            <input
                type="text" v-model="state.type.company_name"
                id="company-create"
                class="form-control"
                placeholder="Введите название"
            >
          </div>
        </form>
        <hr class="border-bottom border-bottom-secondary border-1">
        <h3 class="h3 d-lg-flex justify-content-sm-between">
          Адреса
          <button
              type="button"
              class="btn btn-sm btn-primary me-1 "
              @click.prevent="addressAdd"
          >
            <i class="fa fa-plus me-2"></i> Добавить
          </button>
        </h3>
        <form v-if="state.addresses.length" class="form-block">
          <div class="row items-push" v-for="(item, key) in state.addresses" :key="key">
            <div class="col-12 fw-normal">
              <label :for="`reference_point-${key}`" class="form-label">Адрес {{ key + 1 }}</label>
              <textarea :id="`reference_point-${key}`" class="form-control" v-model="item.address_line"
                        placeholder="Введите Адрес"></textarea>
            </div>
            <div class="col-lg-6 fw-normal">
              <label :for="`reference_point-${key}`" class="form-label">Ориентир {{ key + 1 }}</label>
              <input type="text" :id="`reference_point-${key}`" class="form-control" v-model="item.reference_point"
                     placeholder="Введите Ориентир">
            </div>
            <div class="col-lg-6 fw-normal" v-if="!item.location">
              <div class="form-label">Локация {{ key + 1 }}</div>
              <button
                  class="btn btn-alt-primary"
                  data-bs-target="#map"
                  data-bs-toggle="modal"
                  data-bs-back="#modal-create-clients"
                  :data-bs-index="key"
                  @click.prevent
              >Выбрать на карте</button>
            </div>
            <div class="col-lg-6 fw-normal" v-else>
              <div class="form-label">Локация {{ key + 1 }}</div>
              <div class="input-group">
                <div class="form-control">Точка установлена</div>
                <button
                    class="btn btn-alt-primary"
                    data-bs-target="#map"
                    data-bs-toggle="modal"
                    data-bs-back="#modal-create-clients"
                    :data-bs-index="key"
                    @click.prevent
                >
                  <i class="fa fa-pen"></i>
                </button>
              </div>
            </div>
          </div>
        </form>
        <div class="form-control mb-4" v-else><i class="fa-solid fa-info-circle me-3"></i> Чтобы добавить адрес нажмите
          на кнопку добавить
        </div>
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
import {computed, defineComponent, onMounted, onUnmounted, reactive, ref, watch} from "vue";
import {required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import {useUserOperatorStore} from "@/stores/dashboard/user/operator";
import tooltip from "@/utils/tooltip";
import { useYMapStore } from "@/stores/dashboard/yMap";

const modal = ref(null)
//store
const userOperatorStore = useUserOperatorStore()
const storeMap = useYMapStore()
const map = computed(() => storeMap.yMap)

watch(map, value => {
  if (value && value.index) {
    state.addresses[value.index].location = value
    storeMap.setYMap(null)
  }
})
const types = ref([
  {
    type: "individual",
  },
  {
    type: "legal_entity",
    company_name: ""
  }
])
const state = reactive({
  display_name: "",
  phone_number: "",
  birthday: "",
  type: {
    type: "individual",
  },
  addresses: [
    {
      type: 'address_line',
      reference_point: '',
      location: null,
      address_line: '',
    }
  ]
})

const rules = computed(() => {
  return {
    display_name: {required},
    phone_number: {required},
  };
});
const v$ = useVuelidate(rules, state);

const addressAdd = () => {
  state.addresses.push({
    type: 'address_line',
    reference_point: '',
    location: null,
    address_line: '',
  })
}


const submit = async () => {
  const result = await v$.value.$validate();

  if (!result) {
    return;
  }

  if (!state.addresses[0].address_line) {
    state.addresses[0].address_line = null
  }

  if (!state.addresses[0].reference_point) {
    state.addresses[0].reference_point = null
  }

  if (!state.birthday) {
    state.birthday = null
  }


  let data = JSON.parse(JSON.stringify(state))
  try {
    await userOperatorStore.createUser(data, async () => {
      await modal.value.hide()
    })
  } catch (e) {
    console.log(e)
  }
}
const tt = tooltip()


onUnmounted(() => {
  tt.dispose()
})
onMounted(async () => {
  tt.init()
  modal.value = new window.bootstrap.Modal('#modal-create-clients')
})

defineComponent({name: "ModalCreateClientOperator"})
</script>
