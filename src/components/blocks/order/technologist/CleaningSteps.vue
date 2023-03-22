<template>
  <BaseBlock title="Этапы чистки">
    <template #content>
      <div class="block-content block-content-full">
        <table class="table table-bordered table-vcenter">
          <thead>
          <tr>
            <th>Название</th>
            <th>Статус</th>
            <th>На этапе</th>
            <th>Этапы</th>
            <th>Код</th>
            <th>Номер вешалки</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in props.data?.content" :key="item.id" @click.prevent="openInfo(item.id)">
            <td class="fw-semibold fs-sm"> {{ item.name }} </td>
            <td class="fw-semibold fs-sm"> {{ statusOrderItem[item.status.type]}}</td>
            <td class="fw-semibold fs-sm" v-if="item.status.current_step"> {{ item.status.current_step.name}}</td>
            <td class="fw-semibold fs-sm" v-if="item.status.type === 'waiting'"> Процесс еще не начался</td>
            <td class="fw-semibold fs-sm" v-if="item.status.type === 'packaging' || item.status.type === 'ready'"> Все этапы пройдены</td>
            <td class="fw-semibold fs-sm">-</td>
            <td class="fw-semibold fs-sm">{{item.code}}</td>
            <td class="fw-semibold fs-sm">{{item.hanger_code || "Не установленно"}}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="block-content block-content-full bg-body-light">
        <BasePagination :data="props.data"/>
      </div>
    </template>
  </BaseBlock>
</template>

<script setup>
import {defineComponent, ref} from "vue";
import statusOrderItem from "@/data/status-order-item";
import BasePagination from "@/components/BasePagination.vue";
import {useOrderItemTechnologistStore} from "@/stores/dashboard/order-item/technologist";

const modalInfo = ref(null)
const storeTechnologistOrderItem = useOrderItemTechnologistStore()
const props = defineProps({
  data: Object
})
const openInfo = async (id) => {
  modalInfo.value = new window.bootstrap.Modal('#scan-code-thing-info')
  await storeTechnologistOrderItem.getOrderItemById(id)
  modalInfo.value.show()
}
defineComponent({name: 'CleaningStepsBlock'})
</script>