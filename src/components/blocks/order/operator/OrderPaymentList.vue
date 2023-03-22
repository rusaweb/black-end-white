<template>
  <BaseBlock title="Список оплат">
    <template #content>
      <div
          class="block-content mb-3"
          :class="{'block-content-full': !billing?.content?.length}"
      >
        <template v-if="billing?.content?.length">
          <div class="table-responsive">
            <table class="table table-bordered table-striped table-vcenter">
            <thead>
            <tr>
              <th>Цена</th>
              <th>Тип</th>
              <th>Дата</th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="item in billing?.content"
                :key="item.id"
            >
              <td class="fw-semibold fs-sm">
                {{ item.amount }}
              </td>
              <td class="fw-semibold fs-sm">
                {{ statusPayment[item.type.type] }}
              </td>
              <td class="fw-semibold fs-sm">
                <span>
                  {{ new Date(item.created).toLocaleDateString("Ru-ru") }}
                  {{ new Date(item.created).toLocaleTimeString('Ru-ru', {hour: '2-digit', minute: '2-digit'}) }}
                </span>
              </td>
            </tr>
            <tr v-if="billing">
<!--              <td colspan="4" class="bg-body"><h4 class="mb-0">Итого</h4></td>-->
<!--              <td colspan="4" class="text-end bg-body">= {{ billing.total_amount.toLocaleString('Ru-ru') }} {{ billing.currency }}</td>-->
            </tr>
            </tbody>
          </table>
          </div>
        </template>
        <div class="form-control d-flex flex-column align-items-center justify-content-center p-5" v-else>Список оплат
          заказа пуст
        </div>
      </div>
      <div class="block-content block-content-full text-end block-content-sm bg-body-light fs-sm">
        <button
            class="btn btn-sm btn-alt-primary me-2"
            data-bs-target="#create-payment"
            data-bs-toggle="modal"
        >Принять оплату</button>
      </div>
    </template>
  </BaseBlock>
</template>

<script setup>
import {computed, defineComponent, onMounted, ref} from "vue";
import router from "@/router";
import {useBillingTransactionOperatorStore} from "@/stores/dashboard/billing-transaction/operator";
import statusPayment from "@/data/status-payment";

const tableBlock = ref(null)
const storeBillingTransaction = useBillingTransactionOperatorStore()
const billing = computed(() => storeBillingTransaction.billing)
onMounted(async () => {
  await tableBlock.value?.baseBlock?.statusLoading()
  await storeBillingTransaction.getBilling(router.currentRoute.value.params.id)
  await tableBlock.value?.baseBlock?.statusNormal()
})
defineComponent({name: 'OrderDetailOperatorOrderPayment'})
</script>
