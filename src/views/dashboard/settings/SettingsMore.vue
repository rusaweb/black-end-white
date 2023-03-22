<template>
  <BasePageHeading
      title="Настройки"
      subtitle="На этой странице отображаются прочие настройки"
  ></BasePageHeading>
  <div class="content">
    <BaseBlock title="Настройки" ref="tableBlock">
      <template #content>
        <div class="block-content block-content-full">
          <ul class="list-group">
            <li class="list-group-item d-md-flex d-block justify-content-between align-items-center">
              Доставка (От клиента):
              <div class="col-md-6 col-12 mt-2">
                <div class="input-group">
                  <span class="input-group-text">UZS</span>
                  <input type="number" v-model="delivery.from_client_delivery_price.amount" class="form-control"
                         placeholder="Стоимость">
                  <button class="btn bg-success text-white" @click.prevent="submitDelivery"><i class="fa fa-check"></i>
                  </button>
                </div>
              </div>
            </li>
            <li class="list-group-item d-md-flex d-block justify-content-between align-items-center">
              Доставка (К клинту):
              <div class="col-md-6 col-12 mt-2">
                <div class="input-group">
                  <span class="input-group-text">UZS</span>
                  <input type="number" v-model="delivery.to_client_delivery_price.amount" class="form-control"
                         placeholder="Стоимость">
                  <button class="btn bg-success text-white" @click.prevent="submitDelivery"><i class="fa fa-check"></i>
                  </button>
                </div>
              </div>
            </li>
            <li class="list-group-item d-md-flex d-block justify-content-between align-items-center">
              Срочно:
              <div class="col-md-6 col-12 mt-2">
                <div class="input-group">
                  <span class="input-group-text">%</span>
                  <input type="number" v-model="fast.percent" class="form-control" placeholder="Процент">
                  <button class="btn bg-success text-white" @click.prevent="submitFast"><i class="fa fa-check"></i>
                  </button>
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
import {onMounted, ref} from "vue";
import {useConfigStore} from "@/stores/dashboard/config/public";
import {useAdminConfigStore} from "@/stores/dashboard/config/administrator";

const configStore = useConfigStore()
const configAdminStore = useAdminConfigStore()

const delivery = ref({
  from_client_delivery_price: {
    amount: null,
    currency: "UZS"
  },
  to_client_delivery_price: {
    "amount": null,
    "currency": "UZS"
  }
})
const submitDelivery = async () => {
  try {
    await configAdminStore.updateDelivery(delivery.value)
  } catch (e) {
    console.log(e)
  }
}

const fast = ref({
  percent: null
})
const submitFast = async () => {
  try {
    await configAdminStore.updatePercent(fast.value)
  } catch (e) {
    console.log(e)
  }
}
onMounted(async () => {
  await configStore.getPercent()
  await configStore.getDelivery()
  fast.value = configStore.percent
  delivery.value = configStore.delivery
})
</script>