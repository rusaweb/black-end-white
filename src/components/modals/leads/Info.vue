<template>
  <BaseModal ref="tableBlock" title="Информация о лиде" id="modal-info-leads">
    <template #content>
      <div class="block-content fs-sm">
        <form action="" class="form-block items-push row" v-if="lead">
          <div class="col-lg-6 fw-normal">
            <span class="form-label d-block">Имя</span>
            <div class="form-control">{{ lead.name }}</div>
          </div>
          <div class="col-lg-6 fw-normal">
            <span class="form-label d-block">Регион</span>
            <div class="form-control">{{ lead.region }}</div>
          </div>
          <div class="col-lg-6 fw-normal">
            <span class="form-label d-block">Номер телефона</span>
            <div class="form-control">{{ lead.phone_number }}</div>
          </div>
          <div class="col-lg-6 fw-normal">
            <span class="form-label d-block">Статус</span>
            <div class="form-control">{{ status[lead.status] || '...' }}</div>
          </div>
          <div class="col-lg-6 fw-normal">
            <span class="form-label d-block">Время след. звонка</span>
            <div class="form-control">{{ dateFilter(lead.next_call_time, 'datetime') }}</div>
          </div>
        </form>
        <hr class="border-bottom border-bottom-secondary border-1">
        <h3 class="h3 d-flex justify-content-between">История звонков
          <button
              type="button"
              class="btn btn-sm btn-primary me-1 "
              data-bs-toggle="modal"
              data-bs-target="#modal-create-leads-comment"
              :data-bs-id="id"
          >
            <i class="fa fa-plus me-2"></i> Добавить
          </button>
        </h3>
        <table class="table table-bordered table-vcenter table-hover" v-if="lead && lead.calls.length">
          <thead>
          <tr>
            <th>Комментарии </th>
            <th>Время звонка</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in lead.calls" :key="item.id">
            <td>{{ item.comment }}</td>
            <td>{{ dateFilter(item.time, 'datetime') }}</td>
          </tr>
          </tbody>
        </table>
        <div class="form-control mb-4" v-else><i class="fa-solid fa-folder-open me-3"></i> Не единного звонка не совершалось</div>
      </div>
    </template>
    <template #footer>
      <button
          type="button"
          class="btn btn-sm btn-danger me-1"
          @click.prevent="deleteLead"
      >
        Удалить
      </button>
      <button
          type="button"
          class="btn btn-sm btn-success me-1"
          data-bs-toggle="modal"
          data-bs-target="#modal-create-clients"
          :data-bs-id="id"
      >
        Сделать клиетом
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
import {computed, defineComponent, onMounted, ref} from "vue";
import {useLeadsStore} from "@/stores/dashboard/leads/leads";
import status from "@/data/status-lead";
import dateFilter from "@/data/filerDate";

defineComponent({name: "ModalInfoLead"})
const modal = ref(null)
const id = ref(null)
const tableBlock = ref(null)
const leadStore = useLeadsStore()
const deleteLead = async () => {
  try {
    await leadStore.deleteLead(id.value, () => {
      modal.value.hide()
    }, true)
  }catch (e) {
    console.log(e)
  }
}
onMounted(() => {
  modal.value = new window.bootstrap.Modal('#modal-info-leads')
  let modalInfo = document.getElementById('modal-info-leads')
  modalInfo.addEventListener('show.bs.modal', async event => {
    id.value = event.relatedTarget.dataset.bsId
    tableBlock.value?.baseBlock?.statusLoading()
    await leadStore.getLead(id.value)
    tableBlock.value?.baseBlock?.statusNormal()
  })
})
const lead = computed(() => leadStore.lead)
</script>
