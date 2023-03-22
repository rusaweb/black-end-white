<template>
  <BasePageHeading title="Редактирование клиента" subtitle="На этой странице можно редактировать данные клиента"/>
  <div class="content">
    <BaseBlock title="Персональные данные клиента" ref="tableBlock" v-if="client">
      <template #content>
        <div class="block-content">
          <ul class="list-group">
            <li class="list-group-item d-flex justify-content-between">
              <label for="name">Имя:</label>
              <div class="col-6">
                <input
                    type="text"
                    class="form-control"
                    id="name"
                    placeholder="Введите имя"
                    v-model="state.display_name"
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
            </li>
            <li class="list-group-item d-flex justify-content-between">
              <label for="birthday">Дата рождения:</label>
              <div class="col-6">
                <input
                    type="date"
                    class="form-control"
                    id="birthday"
                    v-model="state.birthday"
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
            </li>
            <li class="list-group-item d-flex justify-content-between">
              <label for="phone_number">Номер телефона:</label>
              <div class="col-6">
                <input
                    type="text"
                    class="form-control "
                    id="phone_number"
                    placeholder="Введите номер телефона"
                    v-model="state.phone_number"
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
            </li>
            <li class="list-group-item d-flex justify-content-between" v-if="state.status">
              <label for="status">Статус:</label>
              <div class="col-6">
                <div class="form-control">{{ state.status.name }}</div>
              </div>
            </li>
            <li class="list-group-item d-flex justify-content-between" v-if="client">
              <label for="status">Ваучер:</label>
              <div class="col-6">
                <div class="form-control">{{ client.discount_card }}</div>
              </div>
            </li>
            <li class="list-group-item d-flex justify-content-between" v-if="state.type?.type">
              <label for="status">Тип:</label>
              <div class="col-6">
                <select class="form-select" v-model="state.type.type" id="status-client">
                  <option :value="list.type" v-for="(list, key) in types" :key="key">{{ list.type === 'legal_entity' ? 'Юр. лицо' : 'Физ. лицо' }}</option>
                </select>
              </div>
            </li>
            <li class="list-group-item d-flex justify-content-between" v-if="state.type?.type === 'legal_entity'">
              <label for="status">Название компании: </label>
              <div class="col-6">
                <input
                    type="text" v-model="state.type.company_name"
                    id="company-create"
                    class="form-control"
                    placeholder="Введите название"
                >
              </div>
            </li>
            <li class="list-group-item d-flex justify-content-between">
              <label for="created">Дата создания:</label>
              <div class="col-6">
                <div class="form-control">{{ new Date(client.created).toLocaleDateString('Ru-ru') }}</div>
              </div>
            </li>
          </ul>
        </div>
        <div class="block-content block-content-full text-end">
          <button
              type="button"
              class="btn btn-alt-primary"
              v-click-ripple
              @click.prevent="submit"
          >
            <i class="fa fa-save opacity-50 me-1"></i>
            Сохранить
          </button>
        </div>
      </template>
    </BaseBlock>
    <BaseBlock title="Документы клиента" ref="tableBlock" v-if="state.type?.type === 'legal_entity'">
      <template #options>
        <button class="btn-block-option" data-bs-target="#create-add-document" data-bs-toggle="modal">
          <i class="fa fa-plus me-1"></i>
          Добавить
        </button>
      </template>
      <template #content>
        <div class="block-content block-content-full">
          <ul class="list-group" v-if="state.type?.documents?.length">
            <li class="list-group-item d-flex justify-content-between align-items-center" v-for="item in state.type.documents" :key="item.id">
              <label for="created">{{item.name}}.{{item.extension}}</label>
              <div class="col-6 text-end">
                <div class="btn-group">
                  <button class="btn btn-info text-white" @click.prevent="viewsFile(item.url)"><i class="fa fa-eye"></i></button>
                  <button class="btn btn-primary text-white" @click.prevent="downloadFile(item.url)"><i class="fa fa-download"></i></button>
                </div>
              </div>
            </li>
          </ul>
          <div class="form-control py-5 text-center" v-else><i class="fa fa-folder-open me-3"></i>У это клиента нет документов</div>
        </div>
      </template>
    </BaseBlock>
    <BaseBlock title="Адреса клиента" ref="tableBlock">
      <template #options>
        <button class="btn-block-option" data-bs-target="#create-address" data-bs-toggle="modal">
          <i class="fa fa-plus me-1"></i>
          Добавить
        </button>
      </template>
      <template #content>
        <div class="block-content block-content-full" v-if="client">
          <div class="list-group" v-if="client.addresses.length">
            <div class="row list-group-flush items-push" v-for="(item, key) in client.addresses" :key="key">
              <div class="col-lg-6 fw-normal">
                <div class="form-label">Адрес {{ key + 1 }}</div>
                <div class="form-control">{{item.address_line}}</div>
              </div>
              <div class="col-lg-6 fw-normal">
                <div class="form-label">Ориентир {{ key + 1 }}</div>
                <div class="form-control">{{item.reference_point}}</div>
              </div>
              <div class="col-lg-6 fw-normal">
                <div class="form-label">Локация {{ key + 1 }}</div>
                <button
                    class="btn btn-alt-primary"
                    data-bs-target="#map"
                    data-bs-toggle="modal"
                    data-bs-marker="1"
                    @click.prevent="storeMap.setYMap(item.location)"
                >
                  Посмотреть на карте
                </button>
              </div>
              <div class="col-lg-6">
                <div class="form-label">Удалить</div>
                <button class="btn btn-danger" @click.prevent="deleteAddress(item.id)">Удалить адрес</button>
              </div>
            </div>
          </div>
          <div class="d-flex flex-column align-items-center" v-else>
            <h4>У клиента нет адресов</h4>
            <p>Чтобы добавить адрес нажмите на кнопку добавить</p>
          </div>
        </div>
      </template>
    </BaseBlock>
  </div>
  <ModalYMap/>
  <ModalCreateAddress/>
  <ModalCreateDocument @done="doneFile"/>
</template>
<script setup>
import {computed, onMounted, reactive, ref} from "vue";
import {useUserOperatorStore} from "@/stores/dashboard/user/operator";
import router from "@/router";
import ModalCreateAddress from "@/components/modals/client/operarator/CreateAddress.vue";
import ModalCreateDocument from "@/components/modals/client/operarator/CreateDocument.vue";

// import ModalMap from "@/components/modals/Map.vue";
import ModalYMap from "@/components/modals/yMap.vue";

import {minLength, required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
// import {useMapStore} from "@/stores/dashboard/map";
import { useYMapStore } from "@/stores/dashboard/yMap";

import {useStatusStore} from "@/stores/dashboard/user-status/operator";

const storeMap = useYMapStore()
const tableBlock = ref(null)
const viewsFile = (url) => {
  window.open(url, '_blank')
}
const downloadFile = (url) => {
  const a = document.createElement('a')
      a.href = url
      a.download = url.split('/').pop()
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
}
const userClientsOperatorStore = useUserOperatorStore()
const client = computed(() => userClientsOperatorStore.user)
onMounted(async () => {
  await userClientsOperatorStore.getUserById(router.currentRoute.value.params.id)
  state.status = client.value.status
  state.display_name = client.value.display_name
  state.birthday = client.value.birthday
  state.phone_number = client.value.phone_number
  state.type = client.value.type
})
const doneFile = () => {
  state.type = client.value.type
}

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
  birthday: "",
  phone_number: "",
  status_id: "",
  type: null
})
const rules = computed(() => {
  return {
    display_name: {required, minLength: minLength(3)},
    birthday: {required},
    phone_number: {required},
  };
});
const v$ = useVuelidate(rules, state, {$scope: false});

const submit = async () => {
  const result = await v$.value.$validate();

  if (!result) {
    return;
  }
  state.status_id = state.status.id
  state.id = client.value.id
  await userClientsOperatorStore.updateUser(state)
  await userClientsOperatorStore.getUserById(state.id)
  state.status = client.value.status
  state.display_name = client.value.display_name
  state.birthday = client.value.birthday
  state.phone_number = client.value.phone_number
  state.type = client.value.type
}
const deleteAddress = async (id) => {
  await userClientsOperatorStore.deleteUserAddress({id: client.value.id, addressId: id})
}

</script>
