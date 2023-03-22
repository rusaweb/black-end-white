<template>
  <BaseModal title="Информация о клиенте" id="info-client">
    <template #content>
      <div class="block-content fs-sm" v-if="user">
        <form class="form-block items-push row">
          <div class="col-lg-6 fw-normal">
            <span class="form-label d-block">Имя</span>
            <div class="form-control">{{ user.display_name }}</div>
          </div>
          <div class="col-lg-6 fw-normal">
            <span class="form-label d-block">Номер телефона</span>
            <div class="form-control">{{ user.phone_number }}</div>
          </div>
          <div class="col-lg-6 fw-normal">
            <span class="form-label d-block">Статус</span>
            <div class="form-control">{{ user.status.name }}</div>
          </div>
          <div class="col-lg-6 fw-normal">
            <span class="form-label d-block">Ваучер</span>
            <div class="form-control">{{ user.discount_card || 'Не используется' }}</div>
          </div>
          <div class="col-lg-6 fw-normal">
            <span class="form-label d-block">Тип</span>
            <div class="form-control">{{ user.type.type === 'legal_entity' ? 'Юр. лицо' : 'Физ. лицо' }}</div>
          </div>
          <div class="col-lg-6 fw-normal" v-if="user.type.type === 'legal_entity'">
            <span class="form-label d-block">Название компании</span>
            <div class="form-control">{{ user.type.company_name }}</div>
          </div>
          <div class="col-lg-6 fw-normal">
            <span class="form-label d-block">Дата создания</span>
            <div class="form-control">{{ new Date(user.created).toLocaleDateString('Ru-ru') }}</div>
          </div>
        </form>
        <hr class="border-bottom border-bottom-secondary border-1">
        <h3 class="h3">Докуметы</h3>
        <ul class="list-group" v-if="user?.type?.documents?.length">
          <li class="list-group-item d-flex justify-content-between align-items-center" v-for="item in user.type.documents" :key="item.id">
            <label for="created">{{item.name}}.{{item.extension}}</label>
            <div class="col-6 text-end">
              <div class="btn-group">
                <button class="btn btn-info text-white" @click.prevent="viewsFile(item.url)"><i class="fa fa-eye"></i></button>
                <button class="btn btn-primary text-white" @click.prevent="downloadFile(item.url)"><i class="fa fa-download"></i></button>
              </div>
            </div>
          </li>
        </ul>
        <div class="form-control" v-else><i class="fa fa-folder-open me-3"></i>У это клиента нет документов</div>
        <hr class="border-white">
        <h3 class="h3">Адреса</h3>
        <form class="form-block items-push row" v-if="user.addresses.length">
          <div class="col-12" v-for="item in user.addresses" :key="item.id">
            <div class="form-label">Адрес</div>
            <div class="form-control mb-3">{{ item.address_line }}</div>
            <div class="form-label">Ориентир</div>
            <div class="form-control mb-3">{{ item.reference_point }}</div>
            <div class="form-label">Локация</div>
            <button
                class="btn btn-alt-primary"
                data-bs-target="#map"
                data-bs-toggle="modal"
                data-bs-marker="1"
                @click.prevent="storeMap.setYMap(item.location)"
            >
              Посмотреть на карте
            </button>
            <hr class="border-white">
          </div>
        </form>
        <div class="form-control" v-else><i class="fa fa-folder-open me-3"></i>У это клиента нет добавленных адресов
        </div>
        <hr class="border-bottom border-bottom-secondary border-1">
        <h3 class="h3">История заказов</h3>
        <template v-if="orders?.content.length">
          <table class="table table-bordered table-vcenter table-hover">
            <thead>
            <tr >
              <th>ID</th>
              <th>Статус</th>
              <th>Дата</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="order in orders?.content" :key="order.id" data-bs-dismiss="modal" @click="$router.push({name: 'order-operator-detail', params: {id:order.id}})">
              <td>{{order.id}}</td>
              <td>{{statusOrder[order.status.type]}}</td>
              <td>{{new Date(order.created).toLocaleDateString("Ru-ru")}}</td>
            </tr>
            </tbody>
          </table>
          <BasePagination :data="orders"/>
        </template>
        <div class="form-control" v-else><i class="fa fa-folder-open me-3"></i>Этот клиент не делал заказы</div>
        <hr class="border-bottom border-bottom-secondary border-1">
        <!--        <h3 class="h3">Аксессуары</h3>-->
        <!--        <table class="table table-bordered table-vcenter table-hover">-->
        <!--          <thead>-->
        <!--          <tr>-->
        <!--            <th>Название</th>-->
        <!--            <th>Дата</th>-->
        <!--            <th>Количество</th>-->
        <!--          </tr>-->
        <!--          </thead>-->
        <!--          <tbody>-->
        <!--          <tr>-->
        <!--            <td>Вешалка</td>-->
        <!--            <td>22.10.2022</td>-->
        <!--            <td>3 шт</td>-->
        <!--          </tr>-->
        <!--          <tr>-->
        <!--            <td>Корзина</td>-->
        <!--            <td>22.10.2022</td>-->
        <!--            <td>1 шт</td>-->
        <!--          </tr>-->
        <!--          <tr>-->
        <!--            <td>Чехол для костюма</td>-->
        <!--            <td>22.10.2022</td>-->
        <!--            <td>1 шт</td>-->
        <!--          </tr>-->
        <!--          </tbody>-->
        <!--        </table>-->
      </div>
    </template>
    <template #footer>
      <button
          type="button"
          class="btn btn-sm btn-alt-secondary me-1"
          data-bs-dismiss="modal"
          @click.prevent="$router.push({name: 'clients-administrator-edit', params: {id}})"
      >
        Редактировать
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
import BasePagination from "@/components/BasePagination.vue"
import {useUserAdministratorStore} from "@/stores/dashboard/user/administrator";
import {useOrderOperatorStore} from "@/stores/dashboard/order/operator";
import {computed, defineComponent, onMounted, ref} from "vue";
import statusOrder from "@/data/status";

// import {useMapStore} from "@/stores/dashboard/map";
import { useYMapStore } from "@/stores/dashboard/yMap";

import {onBeforeRouteUpdate} from "vue-router";
import router from "@/router";

const storeMap = useYMapStore()
const storeOrder = useOrderOperatorStore()
const id = ref(null)
//store
const userOperatorStore = useUserAdministratorStore()
const orders = computed(() => storeOrder.orders)
const user = computed(() => userOperatorStore.user)
onMounted(() => {
  let modalInfo = document.getElementById('info-client')
  modalInfo.addEventListener('show.bs.modal', async event => {
    id.value = event.relatedTarget.dataset.bsId
    await userOperatorStore.getUserById(id.value)
    await storeOrder.getOrderList({...router.currentRoute.value.query, userId: id.value})
  })
})

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

onBeforeRouteUpdate((to, from, next)=> {
  storeOrder.getOrderList({...to.query, userId: id.value})
  next()
})
defineComponent({name: "ModalInfoClientOperator"})
</script>
