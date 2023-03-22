<template>
  <BasePageHeading
      :title="'Вещь: ' + (orderItem?.name || '') + (category?.name ? ` | Нужно: ${category?.name}` : '')"
      subtitle="На этой странице отображается информация о вещи"
  >
    <template #extra>
      <button
          type="button"
          class="btn btn-alt-primary"
          v-click-ripple
          @click.prevent="accept"
      >
        <i class="fa fa-check opacity-50 me-1"></i>
        Принять
      </button>
    </template>
  </BasePageHeading>
  <div class="content">
    <BaseBlock>
      <template #content>
        <div class="block-content block-content-full" v-if="orderItem">
          <h3>Информация о веще</h3>
          <ul class="list-group">
            <li class="list-group-item d-md-flex d-block justify-content-between">
              Фотограция:
              <div class="col-md-6 col-12 mt-2">
                <div class="input-group">
                  <span class="form-control">
                    <img class="w-100" v-lazy="orderItem.images[0]?.url" alt="">
                  </span>
                </div>
              </div>
            </li>
            <li class="list-group-item d-md-flex d-block justify-content-between align-items-center">
              Название:
              <div class="col-md-6 col-12 mt-2">
                <div class="input-group">
                  <span class="form-control">
                    {{ orderItem.name }}
                  </span>
                </div>
              </div>
            </li>
            <li class="list-group-item d-md-flex d-block justify-content-between align-items-center">
              Описание:
              <div class="col-md-6 col-12 mt-2">
                <div class="input-group">
                  <span class="form-control">
                    {{ orderItem.description }}
                  </span>
                </div>
              </div>
            </li>
            <li class="list-group-item d-md-flex d-block justify-content-between align-items-center">
              Код:
              <div class="col-md-6 col-12 mt-2">
                <div class="input-group">
                  <span class="form-control">
                    {{ orderItem.code }}
                  </span>
                </div>
              </div>
            </li>
            <li class="list-group-item d-md-flex d-block justify-content-between align-items-center">
              Статус:
              <div class="col-md-6 col-12 mt-2">
                <div class="input-group">
                  <span class="form-control">
                    {{ statusOrderItem[orderItem.status.type] }}
                  </span>
                </div>
              </div>
            </li>
            <li class="list-group-item d-md-flex d-block justify-content-between align-items-center">
              Номер вещалки:
              <div class="col-md-6 col-12 mt-2">
                <div class="input-group">
                  <span class="form-control">
                    {{ orderItem.hanger_id || 'Не установлено' }}
                  </span>
                </div>
              </div>
            </li>
            <li class="list-group-item d-md-flex d-block justify-content-between align-items-center">
              Дата создания:
              <div class="col-md-6 col-12 mt-2">
                <div class="input-group">
                  <span class="form-control">
                    {{ new Date(orderItem.created).toLocaleDateString("Ru-ru") }}
                    {{ new Date(orderItem.created).toLocaleTimeString('Ru-ru', {hour: '2-digit', minute: '2-digit'}) }}
                  </span>
                </div>
              </div>
            </li>
          </ul>
          <h3 class="mt-3" v-if="orderItem && orderItem.steps_history.length">История чистки</h3>
          <ul class="list-group" v-if="orderItem && orderItem.steps_history.length">
            <li class="list-group-item d-md-flex d-block justify-content-between align-items-center" v-for="(item, key) in orderItem.steps_history" :key="key">
              {{ item.step.name }}:
              <div class="col-md-6 col-12 mt-2">
                <span class="form-control">
                  {{ new Date(item.started_at).toLocaleDateString("Ru-ru") }}
                  {{ new Date(item.started_at).toLocaleTimeString('Ru-ru', {hour: '2-digit', minute: '2-digit'}) }}
                </span>
              </div>
            </li>
          </ul>
          <h3 class="mt-3">Информация по заказу</h3>
          <ul class="list-group" v-if="order">
            <li class="list-group-item d-md-flex d-block justify-content-between">
              Статус:
              <div class="col-md-6 col-12 mt-2">
                <div class="input-group">
                    <span class="form-control">
                      {{ status[order.status.type] }}
                    </span>
                </div>
              </div>
            </li>
            <li class="list-group-item d-md-flex d-block justify-content-between" v-if="tariff">
              Тариф:
              <div class="col-md-6 col-12 mt-2">
                <div class="input-group">
                    <span class="form-control">
                      {{ tariff.name }}
                    </span>
                  <span class="btn btn-alt-secondary">{{ tariff.per_item_percent_multiplier }}%</span>
                </div>
              </div>
            </li>
            <li class="list-group-item d-md-flex d-block justify-content-between">
              Срочно:
              <div class="col-md-6 col-12 mt-2">
                <div class="input-group">
                    <span class="form-control">
                      {{ order.immediate.type === 'immediate' ? 'Да': 'Нет' }}
                    </span>
                </div>
              </div>
            </li>
<!--            <li class="list-group-item d-md-flex d-block justify-content-between">-->
<!--              Код мешка:-->
<!--              <div class="col-md-6 col-12 mt-2">-->
<!--                <div class="input-group">-->
<!--                    <span class="form-control">-->
<!--                      {{ order.received_bag_code }}-->
<!--                    </span>-->
<!--                </div>-->
<!--              </div>-->
<!--            </li>-->
<!--            <li class="list-group-item d-md-flex d-block justify-content-between">-->
<!--              Код обратного мешка:-->
<!--              <div class="col-md-6 col-12 mt-2">-->
<!--                <div class="input-group">-->
<!--                    <span class="form-control">-->
<!--                      {{ order.send_back_bag_code || 'Не установленно' }}-->
<!--                    </span>-->
<!--                </div>-->
<!--              </div>-->
<!--            </li>-->
            <li class="list-group-item d-md-flex d-block justify-content-between">
              Дата создания:
              <div class="col-md-6 col-12 mt-2">
                <div class="input-group">
                  <span class="form-control">
                    {{ new Date(order.created).toLocaleDateString("Ru-ru") }}
                    {{ new Date(order.created).toLocaleTimeString('Ru-ru', {hour: '2-digit', minute: '2-digit'}) }}
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </template>
    </BaseBlock>
  </div>
</template>
<script setup>
import {computed, defineComponent, onMounted} from "vue";
import {useOrderItemTechnologistStore} from "@/stores/dashboard/order-item/technologist";
import router from "@/router";
import {useOrderTechnologistStore} from "@/stores/dashboard/order/technologist";
import statusOrderItem from "@/data/status-order-item";
import status from "@/data/status"
import {useTariffsPublicStore} from "@/stores/dashboard/tariffs/public";
import {useCategoryStore} from "@/stores/dashboard/category/administrator";
import {storeToRefs} from "pinia";
const storeOrderItem = useOrderItemTechnologistStore()
const storeOrder = useOrderTechnologistStore()
const storeTariff = useTariffsPublicStore()
const storeCategory = useCategoryStore()
const orderItem = computed(() => storeOrderItem.orderItem)
const order = computed(() => storeOrder.order)
const tariff = computed(() => storeTariff.tariff)
const { category } = storeToRefs(storeCategory)

onMounted(async () => {
  try {
    await storeOrderItem.getOrderItemById(router.currentRoute.value.params.id)
    await storeCategory.getCategory(orderItem.value?.type?.category_id)
    await storeOrder.getOrder(orderItem.value.order_id)
    await storeTariff.getTariff(order.value.tariff.id)
  }catch (e) {
    console.log(e)
  }
})
const accept = async () => {
  try {
    await storeOrderItem.addSelfStep(router.currentRoute.value.params.id)
    await router.push({name: 'specialists'})
  }catch (e) {
    console.log(e)
  }
}

defineComponent({name: 'SpecialistsOrderPage'})
</script>