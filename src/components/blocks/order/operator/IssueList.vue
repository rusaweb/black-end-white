<template>
  <BaseBlock :title="'Список выдач заказа #' + order?.id">
    <template #options>
      <button
          data-bs-target="#done-order-item"
          data-bs-toggle="modal"
          class="btn-block-option"
          v-if="order?.status.type === 'in_technologist_work'"
      >
        <i class="fa fa-plus"></i> <span class="fw-semibold">Добавить</span>
      </button>
    </template>
    <template #content>
      <div class="block-content block-content-full" v-if="issues?.content.length">
        <div class="table-responsive">
          <table class="table table-bordered table-striped table-vcenter">
          <thead>
            <tr>
              <th style="min-width: 170px;">Тип</th>
              <th>Статус</th>
              <th style="min-width: 140px;">Код</th>
              <th>Адрес</th>
              <th style="min-width: 180px;">Дата создания</th>
            </tr>
          </thead>
          <tbody>
            <tr style="cursor:pointer;" v-for="item in issues?.content" :key="item.id" @click="$router.push({name: 'order-issue-operator-detail', params: {order_id: order?.id, id: item.id}})">
              <td class="fw-semibold fs-sm">
                <span>{{ statusIssue[item.type] }}</span>
              </td>
              <td class="fw-semibold fs-sm">
                <span>{{ statusIssue[item.status.type] }}</span>
              </td>
              <td class="fw-semibold fs-sm">
                <span>{{ item.bag_code || 'Не установленно' }}</span>
              </td>
              <td class="fw-semibold fs-sm">
                <span v-if="item.address.type === 'department'">Отделение</span>
                <span v-else>{{ item.address.address_line }}</span>
              </td>
              <td>
                {{ new Date(item.created).toLocaleDateString("Ru-ru") }}
                {{ new Date(item.created).toLocaleTimeString('Ru-ru', {hour: '2-digit', minute: '2-digit'}) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      </div>
      <div class="block-content block-content-full" v-else>
        <div class="form-control p-5 text-center">Список выдач этого заказа пуст</div>
      </div>
    </template>
  </BaseBlock>
</template>

<script setup>
import {computed, defineComponent} from "vue";
import {useOrderIssuesOperatorStore} from "@/stores/dashboard/order-issue/operator";
import {useOrderOperatorStore} from "@/stores/dashboard/order/operator";
import statusIssue from "@/data/status-issue";

const orderIssueStore = useOrderIssuesOperatorStore()
const orderStore = useOrderOperatorStore()

const issues = computed(() => orderIssueStore.orderIssues)
const order = computed(() => orderStore.order)


defineComponent({name: 'OrderDetailOperatorOrderIssueList'})
</script>
