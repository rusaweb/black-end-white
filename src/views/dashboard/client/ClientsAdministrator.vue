<template>
  <BasePageHeading title="Клиенты" subtitle="На этой странице отображаются список клиентов">
    <template #extra>
      <button
          type="button"
          class="btn btn-alt-primary"
          v-click-ripple
          data-bs-toggle="modal"
          data-bs-target="#modal-create-clients"
      >
        <i class="fa fa-plus opacity-50 me-1"></i>
        Добавить
      </button>
    </template>
  </BasePageHeading>
  <div class="content">
    <BaseBlock title="Список клиентов" ref="tableBlock">
      <template #options>
        <div class="space-x-1">
          <button
              type="button"
              class="btn btn-sm btn-alt-secondary"
              @click="orderSearch = !orderSearch"
          >
            <i class="fa fa-search"></i>
          </button>
          <button
              type="button"
              class="btn btn-sm btn-alt-secondary"
              data-bs-target="#scan-discount-card"
              data-bs-toggle="modal"
          >
            Найти по ваучеру
          </button>
          <BaseFilterDropdown :list="filterList"/>
        </div>
      </template>
      <template #content>
        <BaseSearch :list="searchList" v-if="orderSearch"/>
        <div class="block-content block-content-full" v-if="clients && clients.content.length">
          <div class="table-responsive">
            <table class="table table-bordered table-striped table-vcenter">
              <thead>
              <tr>
                <th>Имя</th>
                <th>Номер телефона</th>
                <th>Тип</th>
                <th>Статус</th>
                <th>Дата создания</th>
              </tr>
              </thead>
              <tbody>
              <tr
                  data-bs-toggle="modal"
                  data-bs-target="#info-client"
                  v-for="item in clients.content"
                  :key="item.id"
                  :data-bs-id="item.id"
              >
                <td>{{ item.display_name }}</td>
                <td>{{ item.phone_number }}</td>
                <td>{{ item.type.type === 'legal_entity' ? 'Юр. лицо' : 'Физ. лицо' }}</td>
                <td>{{ item.status.name }}</td>
                <td>{{ new Date(item.created).toLocaleDateString('Ru-ru') }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="block-content block-content-full" v-else>
          <div class="form-control d-flex flex-column justify-content-center align-items-center p-5">
            <i class="fa fa-folder-open fs-1 mb-4"></i>
            <h3>Список пуст</h3>
            <button
                type="button"
                class="btn btn-alt-primary"
                v-click-ripple
                data-bs-toggle="modal"
                data-bs-target="#modal-create-clients"
            >
              <i class="fa fa-plus opacity-50 me-1"></i>
              Добавить
            </button>
          </div>
        </div>
        <div class="block-content block-content-full bg-body-light">
          <BasePagination :data="clients"/>
        </div>
      </template>
    </BaseBlock>
  </div>
  <ModalInfoClientAdministrator/>
  <ModalCreateClientAdministrator/>
  <ModalScanDiscountCardAdmin/>
  <ModalYMap/>
</template>
<script setup>
import {computed, ref} from "vue";
import BaseFilterDropdown from "@/components/BaseFilterDropdown.vue";
import BaseSearch from "@/components/BaseSearch.vue";
import BasePagination from "@/components/BasePagination.vue";
import ModalInfoClientAdministrator from "@/components/modals/client/administrator/InfoClientAdministrator.vue";
import ModalCreateClientAdministrator from "@/components/modals/client/administrator/CreateClientAdministrator.vue";
import {useUserAdministratorStore} from "@/stores/dashboard/user/administrator";
import router from "@/router";
import {onBeforeRouteUpdate} from "vue-router";
// import ModalMap from "@/components/modals/Map.vue";
import ModalYMap from "@/components/modals/yMap.vue";
import ModalScanDiscountCardAdmin from "@/components/modals/client/administrator/ScanDiscountCard.vue";

const orderSearch = ref(false)
const tableBlock = ref(null)
const filterList = [
  {
    label: 'Обычный',
    value: 'DEFAULT'
  },
  {
    label: 'Постоянный',
    value: 'MEDIUM'
  },
  {
    label: 'VIP',
    value: 'VIP'
  },
  {
    label: 'Все',
    value: null
  }
]
const userClientsAdministratorStore = useUserAdministratorStore()
userClientsAdministratorStore.getUsersList(router.currentRoute.value.query)
onBeforeRouteUpdate((to, from, next) => {
  userClientsAdministratorStore.getUsersList(to.query)
  next()
})
const searchList = ref([
  {label: 'Имя', value: 'displayName'},
  {label: 'Номер телефона', value: 'phoneNumber'},
])
const clients = computed(() => {
  userClientsAdministratorStore.loading ? tableBlock.value?.statusLoading() : tableBlock.value?.statusNormal()
  return userClientsAdministratorStore.users
})
</script>
