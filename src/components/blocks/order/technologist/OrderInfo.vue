<template>
  <BaseBlock title="Информация о заказе">
    <template #content>
      <div class="block-content block-content-full">
        <ul class="list-group">
          <li class="list-group-item d-flex justify-content-between">
            Дата создания:
            <span class="col-6">
                <span class="form-control">
                  {{ new Date(props.data?.created).toLocaleDateString("Ru-ru") }} {{
                    new Date(props.data?.created).toLocaleTimeString('Ru-ru', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  }}
                </span>
              </span>
          </li>
<!--          <li class="list-group-item d-flex justify-content-between">-->
<!--            Код мешка:-->
<!--            <span class="col-6">-->
<!--                <span class="form-control">-->
<!--                  {{ props.data?.received_bag_code }}-->
<!--                </span>-->
<!--              </span>-->
<!--          </li>-->
<!--          <li class="list-group-item d-flex justify-content-between">-->
<!--            Код мешка возврата:-->
<!--            <div class="col-6">-->
<!--              <div class="input-group" v-if="props.data?.send_back_bag_code && !install">-->
<!--                <div class="form-control">-->
<!--                  {{ props.data?.send_back_bag_code}}-->
<!--                </div>-->
<!--                <button class="btn btn-alt-primary" @click="install = true">-->
<!--                  <i class="fa fa-pen"></i>-->
<!--                </button>-->
<!--              </div>-->
<!--              <div class="input-group" v-else-if="props.data?.status.type === 'packaging_order_items'">-->
<!--                <div class="input-group" v-if="install">-->
<!--                  <input type="text" class="form-control" v-model="send_back_bag_code">-->
<!--                  <button class="btn btn-alt-primary" @click="submitBackCode">-->
<!--                    <i class="fa fa-check"></i>-->
<!--                  </button>-->
<!--                </div>-->
<!--                <button class="btn btn-alt-primary" v-else @click="install = true">-->
<!--                  Установить-->
<!--                </button>-->
<!--              </div>-->
<!--              <div class="form-control" v-else>Не установленно</div>-->
<!--            </div>-->
<!--          </li>-->
          <li class="list-group-item d-flex justify-content-between">
            Статус:
            <div class="col-6">
              <div class="input-group">
                <div class="form-control">
                  {{ status[props.data?.status.type] }}
                </div>
                <button class="btn btn-alt-primary" v-if="props.data?.status.type === 'packaging_order_items' && props.data?.send_back_bag_code" @click="packagingOrderDone">
                  <i class="fa fa-check"></i>
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </template>
  </BaseBlock>
</template>

<script setup>
import {defineComponent, ref} from "vue";
import status from "@/data/status";
import {useOrderTechnologistStore} from "@/stores/dashboard/order/technologist";
import router from "@/router";
const install = ref(false)
const send_back_bag_code = ref('')
const storeOrderTechnologist = useOrderTechnologistStore()
const props = defineProps({
  data: Object
})
const submitBackCode = async () => {
  try {
    await storeOrderTechnologist.sendBackBagCode({id: router.currentRoute.value.params.id, send_back_bag_code: send_back_bag_code.value})
    await storeOrderTechnologist.getOrder(router.currentRoute.value.params.id)
    install.value = false
    send_back_bag_code.value = ''
  }catch (e) {
    console.log(e)
  }
}
const packagingOrderDone = async () => {
  try {
    await storeOrderTechnologist.markOrderAsPackaged(router.currentRoute.value.params.id)
    await router.push({name: 'order-technologist'})
  }catch (e) {
    console.log(e)
  }
}
defineComponent({name: 'OrderInfoBlockTechnologist'})
</script>