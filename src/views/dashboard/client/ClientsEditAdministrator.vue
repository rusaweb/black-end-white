<template>
  <BasePageHeading title="Редактирование клиента" subtitle="На этой странице можно редактировать данные клиента" />
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
                >
              </div>
            </li>
            <li class="list-group-item d-flex justify-content-between">
              <label for="birthday">Ваучер:</label>
              <div class="col-6">
                <input
                    type="text"
                    class="form-control"
                    id="birthday"
                    v-model="state.discount_card"
                >
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
            <li class="list-group-item d-flex justify-content-between">
              <label for="status">Статус:</label>
              <div class="col-6">
                <select id="status" class="form-select" v-model="state.status">
                  <option v-for="(item, key) in statuses?.content" :key="key" :value="item">{{ item.name }}</option>
                </select>
              </div>
            </li>
            <li class="list-group-item d-flex justify-content-between">
              <label for="created">Дата создания:</label>
              <div class="col-6">
                <div class="form-control">{{new Date(client.created).toLocaleDateString('Ru-ru')}}</div>
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
    <BaseBlock title="Адреса клиента" ref="tableBlock">
      <template #options>
        <button class="btn-block-option" data-bs-target="#create-address" data-bs-toggle="modal" :data-bs-id="$route.params.id">
          <i class="fa fa-plus me-1"></i>
          Добавить
        </button>
      </template>
      <template #content>
        <div class="block-content block-content-full" v-if="client">
          <ul class="list-group" v-if="client.addresses.length">
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
          </ul>
          <div class="d-flex flex-column align-items-center" v-else>
            <h4>У клиента нет адресов</h4>
            <p>Чтобы добавить адрес нажмите на кнопку добавить</p>
          </div>
        </div>
      </template>
    </BaseBlock>
    <BaseBlock title="Аккаунт клиента" ref="tableBlock">
      <template #content>
        <div class="block-content block-content-full" v-if="client">
          <ul class="list-group">
            <li class="list-group-item d-flex justify-content-between">
              <label for="birthday">Удалить аккаунт:</label>
              <div class="col-6">
                <button
                    class="btn btn-danger"
                    @click.prevent="deleteAccount"
                >Удалить</button>
              </div>
            </li>
          </ul>
        </div>
      </template>
    </BaseBlock>
  </div>
  <ModalYMap/>
  <ModalCreateAddress />
</template>
<script setup>
import {computed, onMounted, reactive, ref} from "vue";
import {useUserAdministratorStore} from "@/stores/dashboard/user/administrator";
import router from "@/router";
import ModalCreateAddress from "@/components/modals/client/administrator/CreateAddress.vue";
import {minLength, required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
// import ModalMap from "@/components/modals/Map.vue";
import ModalYMap from "@/components/modals/yMap.vue";

// import {useMapStore} from "@/stores/dashboard/map";
import { useYMapStore } from "@/stores/dashboard/yMap";

import {useStatusStore} from "@/stores/dashboard/user-status/administrator";
const storeMap = useYMapStore()
const tableBlock = ref(null)
const statusStore = useStatusStore()
const statuses = computed(() => statusStore.statuses)

const userClientsAdministratorStore = useUserAdministratorStore()
const client = computed(() => userClientsAdministratorStore.user)
onMounted(async () => {
  await userClientsAdministratorStore.getUserById(router.currentRoute.value.params.id)
  await statusStore.getStatuses()
  state.display_name = client.value.display_name
  state.birthday = client.value.birthday
  state.phone_number = client.value.phone_number
  state.status = client.value.status
  state.discount_card = client.value.discount_card
})

const state = reactive({
  display_name: "",
  birthday: "",
  phone_number: "",
  status: "",
  roles: [],
  department_id: null,
  discount_card: null,
})
const rules = computed(() => {
  return {
    display_name: {required, minLength: minLength(3)},
    phone_number: {required},
  };
});
const v$ = useVuelidate(rules, state, {$scope: false});

const submit = async () => {
  const result = await v$.value.$validate();

  if (!result) {
    return;
  }
  if (state.status) {
    state.status_id = state.status.id
  }
  state.id = client.value.id
  await userClientsAdministratorStore.updateUser(state)
  await userClientsAdministratorStore.getUserById(state.id)
}
const deleteAddress = async (id) => {
  await userClientsAdministratorStore.deleteUserAddress({id: client.value.id, addressId: id})
}
const deleteAccount = async () => {
  await userClientsAdministratorStore.deleteUser(client.value.id, () => {
    router.push({name: 'clients-administrator'})
  })
}
</script>
