<template>
  <BaseModal title="Информанция" id="scan-code-thing-info">
    <template #content>
      <div class="block-content block-content-full">
        <ul class="list-group">
          <li class="list-group-item d-flex justify-content-between">
            <span class="form-label">Название</span>
            <div class="col-6">
              <span class="form-control">{{ data?.name }}</span>
            </div>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span class="form-label">Описание</span>
            <div class="col-6">
              <span class="form-control">{{ data?.description }}</span>
            </div>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span class="form-label">Тип</span>
            <div class="col-6">
              <span class="form-control">{{ data?.type.name }}</span>
            </div>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span class="form-label">Этапы</span>
            <div class="col-6">
              <span class="form-control">
                -
              </span>
            </div>
          </li>
          <li class="list-group-item d-flex justify-content-between" v-if="data?.status.current_step">
            <span class="form-label">Текуший этап</span>
            <div class="col-6">
              <span class="form-control">{{ data?.status.current_step.name }}</span>
            </div>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span class="form-label">Статус</span>
            <div class="col-6">
              <span class="form-control">{{ statusOrderItem[data?.status.type] }}</span>
            </div>
          </li>
          <li class="list-group-item d-flex justify-content-between" v-if="data?.status.type === 'packaging' || data?.status.type === 'ready'">
            <span class="form-label">Номер вешалки</span>
            <div class="col-6">
              <div class="input-group" v-if="data?.hanger_code">
                <span class="form-control">
                  {{ data?.hanger_code }}
                </span>
                <button class="btn btn-secondary" v-if="data?.status.type === 'packaging'" @click.prevent="data.hanger_code = ''; hangerCodeOpen = true">
                  <i class="fa fa-pen"></i>
                </button>
              </div>
              <button class="btn btn-secondary" v-else-if="!data?.hanger_code && !hangerCodeOpen" @click.prevent="hangerCodeOpen = true">
                Установить
              </button>
              <div class="input-group" v-else>
                <input type="text" class="form-control" v-model="hangerCode">
                <button class="btn btn-alt-primary" @click.prevent="setHangerCode">
                  <i class="fa fa-check"></i>
                </button>
              </div>

            </div>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span class="form-label">Дата создания</span>
            <div class="col-6">
              <span class="form-control">
                {{ new Date(data?.created).toLocaleDateString("Ru-ru") }}
                  {{ new Date(data?.created).toLocaleTimeString('Ru-ru', {hour: '2-digit', minute: '2-digit'}) }}
              </span>
            </div>
          </li>
        </ul>
      </div>
    </template>
    <template #footer>
      <button
          type="button"
          class="btn btn-sm btn-success me-1"
          @click.prevent="next"
          v-if="data?.status.type !== 'packaging' && data?.status.type !== 'ready'"
      >
        Следующий этап
      </button>
      <button
          type="button"
          class="btn btn-sm btn-success me-1"
          v-if="data?.status.type === 'packaging'"
          @click.prevent="packaging"
      >
        Упакованно
      </button>
      <button
          type="button"
          class="btn btn-sm btn-alt-secondary"
          data-bs-dismiss="modal"
          aria-label="Close"
      >
        Закрыть
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import BaseModal from "@/components/BaseModal.vue";
import {computed, defineComponent, onMounted, ref, watch} from "vue";
import {useOrderItemTechnologistStore} from "@/stores/dashboard/order-item/technologist";
import statusOrderItem from "@/data/status-order-item";
import router from "@/router";
import {useOrderTechnologistStore} from "@/stores/dashboard/order/technologist";

const modal = ref(null)
const hangerCode = ref('')
const hangerCodeOpen = ref(false)
const storeTechnologistOrderItem = useOrderItemTechnologistStore()
const storeTechnologist = useOrderTechnologistStore()
const data = computed(() => storeTechnologistOrderItem.orderItem)
const orders = computed(() => storeTechnologistOrderItem.orderItems)

watch(data, async value => {
  if (value && value.status.type === 'packaging'){
    await storeTechnologistOrderItem.getOrderItemsById(value.order_id)
    await getHangerCode()
  }
})
const next = async () => {
  try {
    await storeTechnologistOrderItem.nextStep(data.value.id)
    await storeTechnologistOrderItem.getOrderItemByCode(data.value.code)
    modal.value.hide()
  } catch (e) {
    console.log(e)
  }
}
const packaging = async () => {
  try {
    await storeTechnologistOrderItem.ready(data.value.id)
    await storeTechnologistOrderItem.getOrderItemByCode(data.value.code)
    if (router.currentRoute.value.params.id){
      await storeTechnologist.getOrder(router.currentRoute.value.params.id)
    }
    modal.value.hide()
  } catch (e) {
    console.log(e)
  }
}
const setHangerCode = async () => {
  try {
    await storeTechnologistOrderItem.updateHangerCode({id: data.value.id, hanger_code: hangerCode.value})
    await storeTechnologistOrderItem.getOrderItemByCode(data.value.code)
  } catch (e) {
    console.log(e)
  }
}
const getHangerCode = () => {
  if (orders.value.content.length) {
    orders.value.content.map(e => {
      if (e.hanger_code) hangerCode.value = e.hanger_code
    })
  }
}
onMounted(() => {
  modal.value = new window.bootstrap.Modal('#scan-code-thing-info')
  document.getElementById('scan-code-thing-info').addEventListener('shown.bs.modal', () => {
    modal.value._isShown = true
    modal.value._backdrop._isAppended = true
    modal.value._backdrop._element = document.querySelector('.modal-backdrop')
  })
})
defineComponent({name: 'ModalScanThingInfo'})
</script>
