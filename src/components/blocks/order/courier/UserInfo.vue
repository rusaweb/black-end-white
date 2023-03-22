<template>
  <BaseBlock title="Информация о клиенте">
    <template #content>
      <div class="block-content block-content-full" v-if="user">
        <ul class="list-group">
          <li class="list-group-item d-flex justify-content-between">
            Имя:
            <span class="col-6">{{ user.display_name }}</span>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            Номер телефона:
            <span class="col-6">{{ user.phone_number }}</span>
          </li>
        </ul>
      </div>
    </template>
  </BaseBlock>
</template>

<script setup>
import {computed, defineComponent} from "vue";
import {useOrderCourierStore} from "@/stores/dashboard/order/courier";
import router from "@/router";
const storeCourier = useOrderCourierStore()
storeCourier.getUserByOrderId(router.currentRoute.value.params.id)
const user = computed(() => storeCourier.user)
defineComponent({name: 'OrderDetailCourierUserInfo'})
</script>