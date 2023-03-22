<template>
  <BaseModal title="Сделать клиентом" id="modal-create-clients">
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
                :class="{ 'is-invalid': v$.birthday.$errors.length}"
                @blur="v$.birthday.$touch"
            >
            <div
                v-if="v$.birthday.$errors.length"
                class="invalid-feedback animated fadeIn fs-xs"
            >
              Пожалуйста, введите дату рождения
            </div>
          </div>
<!--          <div class="col-lg-6 fw-normal">-->
<!--            <label for="status-client" class="form-label">Статус</label>-->
<!--            <select class="form-select" v-model="state.status_id" id="status-client">-->
<!--              <option :value="list.id" v-for="(list, key) in statuses?.content" :key="key">{{ list.name }}</option>-->
<!--            </select>-->
<!--          </div>-->
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
                  :data-bs-back-id="id"
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
                    :data-bs-back-id="id"
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
import {minLength, required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import {useLeadsStore} from "@/stores/dashboard/leads/leads";
import {useUserOperatorStore} from "@/stores/dashboard/user/operator";
import tooltip from "@/utils/tooltip";

// import {useMapStore} from "@/stores/dashboard/map";
import { useYMapStore } from "@/stores/dashboard/yMap";

import {useStatusStore} from "@/stores/dashboard/user-status/operator";

const modal = ref(null)
const id = ref(null)
const storeMap = useYMapStore()
const map = computed(() => storeMap.yMap)
const statusStore = useStatusStore()

const statuses = computed(() => statusStore.statuses)
const types = ref([
  {
    type: "individual",
  },
  {
    type: "legal_entity",
    company_name: ""
  }
])
watch(map, value => {
  if (value && value.index) {
    state.addresses[value.index].location = value
    storeMap.setYMap(null)
  }
})
//store
const leadStore = useLeadsStore()
const userOperatorStore = useUserOperatorStore()
// validation
const state = reactive({
  display_name: "",
  phone_number: "",
  birthday: "",
  // status_id: "",
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
    birthday: {required},
  };
});
const v$ = useVuelidate(rules, state);

const lead = computed(() => leadStore.lead)
const tt = tooltip()


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
  let data = JSON.parse(JSON.stringify(state))
  try {
    await userOperatorStore.createUser(data, async () => {
      await leadStore.deleteLead(id.value, () => {
      }, false)
      await modal.value.hide()
    })
  } catch (e) {
    console.log(e)
  }
}

onMounted(async () => {
  tt.init()
  await statusStore.getStatuses()
  state.status_id = statuses.value.content.at(0).id
  modal.value = new window.bootstrap.Modal('#modal-create-clients')
  let modalInfo = document.getElementById('modal-create-clients')
  modalInfo.addEventListener('show.bs.modal', async event => {
    id.value = event.relatedTarget.dataset.bsId
    await leadStore.getLead(id.value)
    state.display_name = lead.value.name
    state.phone_number = lead.value.phone_number
  })
})

onUnmounted(() => {
  tt.dispose()
})
defineComponent({name: "ModalCreateClientLead"})
</script>
