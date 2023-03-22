<template>
  <BaseBlock title="Список вещей">
    <template #options>
      <button
          class="btn btn-block-option"
          data-bs-target="#create-order-item"
          data-bs-toggle="modal"
          v-if="props.status === 'filling_details'"
      >
        <i class="fa fa-plus"></i>
        Добавить
      </button>
    </template>
    <template #content>
      <div
          class="block-content mb-3"
          :class="{'block-content-full': !orderItems?.content.length}"
      >
        <template v-if="orderItems?.content.length">
          <div class="table-responsive">
            <table class="table table-bordered table-striped table-vcenter">
            <thead>
            <tr>
              <th><span class="d-flex justify-content-center"><i class="fa fa-image"></i></span></th>
              <th>Название</th>
              <th>Статус</th>
              <th>Тип</th>
              <th>Цена</th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="(item, key) in orderItems?.content"
                :key="item.id"
            >
              <td @click.prevent="showPhoto(0, item.images.map(e=>e.url))" style="width: 50px; min-width: 50px">
                <span class="d-flex justify-content-center">
                  <img style="object-fit: cover" width="45" height="45" v-lazy="item.images[0]?.url || '/src/assets/error.jpg'" alt="">
                </span>
              </td>
              <td class="fw-semibold fs-sm">
                {{ item.name }}
              </td>
              <td class="fw-semibold fs-sm" style="white-space: nowrap;">
                {{ statusOrderItem[item.status.type] }}
              </td>
              <td class="fw-semibold fs-sm">
                {{ item.type.name }}
              </td>
              <td class="fw-semibold fs-sm" style="white-space: nowrap;">
                {{ item.type.price.amount.toLocaleString('Ru-ru') }} + {{billing?.items[key].price_percent_multiplier}}% <small>(за тариф)</small> = {{billing?.items[key].total_amount}} {{ item.type.price.currency }}
              </td>
            </tr>
            <tr v-if="billing && user && user.status.order_total_amount_discount_percent">
              <td colspan="2" class="bg-body"><p class="mb-0">Скидка</p></td>
              <td colspan="6" class="text-end bg-body">Статус: {{user.status.name}} {{user.status.order_total_amount_discount_percent}}%</td>
            </tr>
            <tr v-if="billing && order && order.discount.promo_code_discount_percent">
              <td colspan="2" class="bg-body"><p class="mb-0">Скидка по промокоду</p></td>
              <td colspan="6" class="text-end bg-body"> -{{order.discount.promo_code_discount_percent}} %</td>
            </tr>
<!--            <tr v-if="billing && order && order.discount.additional_discount_percent">-->
<!--              <td colspan="2" class="bg-body"><p class="mb-0">Скидка дополнительная</p></td>-->
<!--              <td colspan="6" class="text-end bg-body" v-if="order.discount.additional_discount_percent">-{{order.discount.additional_discount_percent}} %</td>-->
<!--            </tr>-->
            <tr v-if="billing">
              <td colspan="2" class="bg-body"><p class="mb-0">Срочно</p></td>
              <td colspan="6" class="text-end bg-body">+{{ billing.immediate_order_additional_percent }}%</td>
            </tr>
            <tr v-if="billing">
              <td colspan="2" class="bg-body"><p class="mb-0">Общая сумма</p></td>
              <td colspan="6" class="text-end bg-body">= {{ billing.total_amount.toLocaleString('Ru-ru') }} {{ billing.currency }}</td>
            </tr>
            <tr v-if="billing">
              <td colspan="2" class="bg-body"><p class="mb-0">Оплачено</p></td>
              <td colspan="6" class="text-end bg-body">= {{ billing.paid_amount }} {{ billing.currency }}</td>
            </tr>
            <tr v-if="billing">
              <td colspan="2" class="bg-body"><h4 class="mb-0">Итого к оплате</h4></td>
              <td colspan="6" class="text-end bg-body">= {{ billing.remaining_amount.toLocaleString('Ru-ru') }} {{ billing.currency }}</td>
            </tr>
            </tbody>
          </table>
          </div>
        </template>
        <div class="form-control d-flex flex-column align-items-center justify-content-center p-5" v-else>Список вещей
          заказа пуст
        </div>
      </div>
      <div class="block-content block-content-full text-end block-content-sm bg-body-light fs-sm">
        <button @click.prevent="printCheck" v-if="orderItems?.content.length && props.status !== 'filling_details'" class="btn btn-sm btn-alt-primary">Распечатать чек</button>
      </div>
    </template>
  </BaseBlock>
  <VueEasyLightbox
      :visible="gallery.visible"
      :index="gallery.index"
      :imgs="gallery.photos"
      @hide="handleHide"
  />
</template>

<script setup>
import {computed, defineComponent, onMounted, reactive, ref} from "vue";
import statusOrderItem from "@/data/status-order-item";
import router from "@/router";
import VueEasyLightbox from "vue-easy-lightbox";
import {useOrderItemUserStore} from "@/stores/dashboard/order-item/user";
import {useBillingUserStore} from "@/stores/dashboard/order-billing/user";
import {useUserStore} from "@/stores/dashboard/user/user";
import {useOrderUserStore} from "@/stores/dashboard/order/user";

const props = defineProps({
  status: String
})
const gallery = reactive({
  visible: false,
  index: 0,
  photos: null,
});
const tableBlock = ref(null)
const storeOrderItem = useOrderItemUserStore()
const storeOrder = useOrderUserStore()
const storeBilling = useBillingUserStore()
const storeUser = useUserStore()
storeUser.getUser()
const orderItems = computed(() => storeOrderItem.orderItems)
const order = computed(() => storeOrder.order)
const user = computed(() => storeUser.user)
const billing = computed(() => storeBilling?.billing?.at(0))

onMounted(async () => {
  await tableBlock.value?.baseBlock?.statusLoading()
  await storeOrderItem.getOrderItems(router.currentRoute.value.params.id)
  await storeBilling.getBilling(router.currentRoute.value.params.id)
  await tableBlock.value?.baseBlock?.statusNormal()
})

const printCheck = async () => {
  await storeBilling.getBilling(router.currentRoute.value.params.id, true)
}

function showPhoto(index, url) {
  if (url.length){
    gallery.index = index;
    gallery.visible = true;
    gallery.photos = url
  }
}
function handleHide() {
  gallery.visible = false;
  gallery.photos = []
}
defineComponent({name: 'OrderDetailConfirmOrderItems'})
</script>
