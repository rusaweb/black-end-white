<template>
  <BasePageHeading title="Сотрудники" subtitle="На этой странице отображаются список сотрудников">
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
    <BaseBlock title="Список сотрудников" ref="tableBlock">
      <template #options>
        <div class="space-x-1">
          <button
              type="button"
              class="btn btn-sm btn-alt-secondary"
              @click="orderSearch = !orderSearch"
          >
            <i class="fa fa-search"></i>
          </button>
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
                <th>Роль</th>
                <th>Отдел</th>
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
                <td>{{ item.roles.map(e => statusRoles[e]).toString().replaceAll(',', ', ') }}</td>
                <td style="white-space: nowrap;">{{ item.mapped_order_item_step?.name || '---' }}</td>
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
</template>
<script setup>
import {computed, ref} from "vue";
import BaseSearch from "@/components/BaseSearch.vue";
import BasePagination from "@/components/BasePagination.vue";
import ModalInfoClientAdministrator from "@/components/modals/user/administrator/InfoClientAdministrator.vue";
import ModalCreateClientAdministrator from "@/components/modals/user/administrator/CreateClientAdministrator.vue";
import {useEmployeesAdministratorStore} from "@/stores/dashboard/employees/administrator";
import statusRoles from '@/data/status-roles'
import router from "@/router";
import {onBeforeRouteUpdate} from "vue-router";

const orderSearch = ref(false)
const tableBlock = ref(null)
const userClientsAdministratorStore = useEmployeesAdministratorStore()
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
