<template>
  <BasePageHeading title="Лиды" subtitle="На этой странице отображаются список лидов">
    <template #extra>
      <button
          type="button"
          class="btn btn-alt-primary"
          v-click-ripple
          data-bs-toggle="modal"
          data-bs-target="#modal-create-leads"
      >
        <i class="fa fa-plus opacity-50 me-1"></i>
        Добавить
      </button>
    </template>
  </BasePageHeading>
  <div class="content">
    <BaseBlock ref="tableBlock" title="Список лидов">
      <template #options>
        <div class="space-x-1">
          <button
              type="button"
              class="btn btn-sm btn-alt-secondary"
              @click="orderSearch = !orderSearch"
          >
            <i class="fa fa-search"></i>
          </button>
          <BaseFilterDropdown :list="filterList"/>
        </div>
      </template>
      <template #content>
        <BaseSearch :list="searchList" v-if="orderSearch"/>
        <div class="block-content block-content-full" v-if="leads && leads.content.length">
          <div class="table-responsive">
            <table class="table table-bordered table-striped table-vcenter">
              <thead>
              <tr>
                <th>Имя</th>
                <th>Регион</th>
                <th>Номер</th>
                <th>Комментарии</th>
                <th>Статус</th>
                <th>Время</th>
              </tr>
              </thead>
              <tbody>
              <tr
                  data-bs-toggle="modal"
                  data-bs-target="#modal-info-leads"
                  :data-bs-id="item.id"
                  v-for="item in leads.content"
                  :key="item.id"
              >
                <td>{{ item.name }}</td>
                <td>{{ item.region }}</td>
                <td>{{ item.phone_number }}</td>
                <td style="width: 250px; min-width: 250px">{{ item.comment }}</td>
                <td style="width: 200px; min-width: 200px">{{ status[item.status] }}</td>
                <td style="width: 200px; min-width: 200px">{{ dateFilter(item.next_call_time, 'datetime') }}</td>
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
                data-bs-target="#modal-create-leads"
            >
              <i class="fa fa-plus opacity-50 me-1"></i>
              Добавить
            </button>
          </div>
        </div>
        <div class="block-content block-content-full bg-body-light" v-if="leads">
          <BasePagination :data="leads"/>
        </div>
      </template>
    </BaseBlock>
  </div>

<!--  MODAL-INFO-LEADS-->
  <ModalInfoLead />
<!--  MODAL-CREATE-LEADS-->
  <ModalCreateLead />
<!--  MODAL-CREATE-LEADS-COMMENT-->
  <ModalCommentLead />
<!--  MODAL-CREATE-CLIENTS-->
  <ModalCreateClientLead />
  <ModalYMap/>
</template>

<script setup>
import {computed, defineComponent, ref} from "vue";
import BaseFilterDropdown from "@/components/BaseFilterDropdown.vue";
// import ModalMap from "@/components/modals/Map.vue";
import ModalYMap from "@/components/modals/yMap.vue";
import BaseSearch from "@/components/BaseSearch.vue";
import BasePagination from "@/components/BasePagination.vue";
import { useLeadsStore } from "@/stores/dashboard/leads/leads";
import ModalCreateLead from "@/components/modals/leads/Create.vue";
import ModalInfoLead from "@/components/modals/leads/Info.vue";
import ModalCommentLead from "@/components/modals/leads/Comment.vue";
import ModalCreateClientLead from "@/components/modals/leads/Client.vue";
import status from "@/data/status-lead";
import dateFilter from "@/data/filerDate";
import router from "@/router";
import {onBeforeRouteUpdate} from "vue-router";

const orderSearch = ref(false)
const tableBlock = ref(null)
const filterList = [
  {
    label: 'В обработке',
    value: 'IN_PROGRESS'
  },
  {
    label: 'Отказано',
    value: 'REJECTED'
  },
  {
    label: 'Просроченные',
    value: 'true',
    prop: 'expiredNextCalls'
  },
  {
    label: 'Непросроченные',
    value: 'true',
    prop: 'comingNextCalls'
  },
  {
    label: 'Все',
    value: null
  }
]
const leadStore = useLeadsStore()
const searchList = ref([
  {label: 'Имя', value: 'name'},
  {label: 'Номер телефона', value: 'phoneNumber'},
])
leadStore.getLeads(router.currentRoute.value.query)
onBeforeRouteUpdate((to, from, next)=> {
  leadStore.getLeads(to.query)
  next()
})
const leads = computed(() => {
  leadStore.loading ? tableBlock.value?.statusLoading() : tableBlock.value?.statusNormal()
  return leadStore.leads
})

defineComponent({name: 'PageLeads'})
</script>

