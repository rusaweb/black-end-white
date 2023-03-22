<template>
  <BaseBlock :title="'Список документов заказа #' + order?.id" v-if="user && user.type.type === 'legal_entity'">
    <template #options>
      <button
          data-bs-target="#add-document"
          data-bs-toggle="modal"
          class="btn-block-option"
      >
        <i class="fa fa-plus"></i> <span class="fw-semibold">Добавить</span>
      </button>
    </template>
    <template #content>
      <div class="block-content block-content-full" v-if="order?.documents.length">
        <div class="table-responsive">
          <table class="table table-bordered table-striped table-vcenter">
          <thead>
            <tr>
              <th>Название</th>
              <th style="width: 120px;"></th>
            </tr>
          </thead>
          <tbody>
            <tr style="cursor:pointer;" v-for="item in order?.documents" :key="item.id">
              <td class="fw-semibold fs-sm">
                <span>{{ item.file_name }}</span>
              </td>
              <td>
                <div class="btn-group">
                  <button class="btn btn-info text-white" @click.prevent="viewsFile(item.url)"><i class="fa fa-eye"></i></button>
                  <button class="btn btn-primary text-white" @click.prevent="deleteFile(item.id)"><i class="fa fa-trash"></i></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      </div>
      <div class="block-content block-content-full" v-else>
        <div class="form-control p-5 text-center">Список документов этого заказа пуст</div>
      </div>
    </template>
  </BaseBlock>
</template>

<script setup>
import {computed, defineComponent} from "vue";
import {useOrderOperatorStore} from "@/stores/dashboard/order/operator";
import router from "@/router";
import {useUserOperatorStore} from "@/stores/dashboard/user/operator";

const orderStore = useOrderOperatorStore()
const userStore = useUserOperatorStore()

const order = computed(() => orderStore.order)
const user = computed(() => userStore.user)
const viewsFile = (url) => {
  window.open(url, '_blank')
}
const deleteFile = async (id) => {
  await orderStore.deleteDocument({id, order_id: router.currentRoute.value.params.id}, async () => {
    await orderStore.getOrder(router.currentRoute.value.params.id)
  })
}

defineComponent({name: 'OrderDetailOperatorDocumentList'})
</script>
