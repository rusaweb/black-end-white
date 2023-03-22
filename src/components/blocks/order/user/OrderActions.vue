<template>
  <BaseBlock title="Действия заказа">
    <template #content>
      <div class="block-content block-content-full">
        <ul class="list-group">
          <li class="list-group-item d-flex justify-content-between align-items-center">
            Отменить заказ:
            <div
                class="col-6"
                v-if="props.status === 'deliver_to_department' || props.status === 'filling_details' || props.status === 'waiting_for_start_confirmation'"
            >
              <button class="btn btn-alt-secondary" @click.prevent="cancelOrder">Отменить</button>
            </div>
            <div class="col-6" v-else-if="props.status === 'canceled'">
              <div class="form-control">
                Этот заказ уже отменен
              </div>
            </div>
            <div class="col-6" v-else>
              <div class="form-control">
                Этот заказ уже не возможно отменить
              </div>
            </div>
          </li>
        </ul>
      </div>
    </template>
  </BaseBlock>
</template>

<script setup>
import {defineComponent} from "vue";
import {useOrderUserStore} from "@/stores/dashboard/order/user";
import router from "@/router";
const store = useOrderUserStore()

const props = defineProps({
  status: String
})

const cancelOrder = async () => {
  await store.cancelOrder(router.currentRoute.value.params.id)
}




defineComponent({name: 'OrderDetailUserOrderActions'})
</script>