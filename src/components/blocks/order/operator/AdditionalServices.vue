<template>
  <BaseBlock title="Дополнительные услуги">
    <template #options>
      <button
          data-bs-target="#create-additional-service"
          data-bs-toggle="modal"
          class="btn-block-option"
      >
        <i class="fa fa-plus"></i> <span class="fw-semibold">Добавить</span>
      </button>
    </template>
    <template #content>
      <div class="block-content block-content-full" v-if="services?.content.length">
        <div class="table-responsive">
          <table class="table table-bordered table-striped table-vcenter">
            <thead>
            <tr>
              <th>Название</th>
              <th>Цена</th>
              <th style="width: 120px;"></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in services?.content" :key="item.id">
              <td class="fw-semibold fs-sm">
                <span>{{ item.additional_service.name }}</span>
              </td>
              <td class="fw-semibold fs-sm">
                <span>{{ item.price.amount.toLocaleString('ru-RU') }} сум</span>
              </td>
              <td>
                <div class="btn-group">
                  <button class="btn btn-primary text-white" @click.prevent="() => deleteAdditionalService(item.id)"><i class="fa fa-trash"></i></button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="block-content block-content-full" v-else>
        <div class="form-control p-5 text-center">Список дополнительных услуг этого заказа пуст</div>
      </div>
    </template>
  </BaseBlock>
</template>

<script setup>
import { computed, defineComponent } from "vue";
import router from "@/router";
import {useAdditionalServiceOperatorStore} from '@/stores/dashboard/additional-services/operator.js'
const store = useAdditionalServiceOperatorStore()

const services = computed(() => store.services)
store.getAdditionalServices({orderId: router.currentRoute.value.params.id})
const deleteAdditionalService = async (id) => {
  await store.deleteAdditionalService(id, async () => {
    await store.getAdditionalServices({orderId: router.currentRoute.value.params.id})
  })
}

defineComponent({name: 'OrderDetailOperatorAdditionalServices'})
</script>
