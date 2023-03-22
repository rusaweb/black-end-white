<template>
  <BaseBlock title="Информация о клиенте" ref="tableBlock" v-if="user">
    <template #content>
      <div class="block-content mb-3" v-if="user">
        <ul class="list-group">
          <li class="list-group-item d-md-flex d-block justify-content-between">
            Имя:
            <div class="col-md-6 col-12">{{ user.display_name }}</div>
          </li>
          <li class="list-group-item d-md-flex d-block justify-content-between">
            Номер телефона:
            <div class="col-md-6 col-12">{{user.phone_number}}</div>
          </li>
          <li class="list-group-item d-md-flex d-block justify-content-between">
            Дата рождения:
            <div class="col-md-6 col-12">{{user.birthday}}</div>
          </li>
          <li class="list-group-item d-md-flex d-block justify-content-between">
            Статус:
            <div class="col-md-6 col-12">{{user.status.name}} <br>Скидка: ({{user.status.order_total_amount_discount_percent}}%)</div>
          </li>
          <li class="list-group-item d-md-flex d-block justify-content-between">
            Тип:
            <div class="col-md-6 col-12">{{ user.type.type === 'legal_entity' ? 'Юр. лицо' : 'Физ. лицо' }}</div>
          </li>
          <li class="list-group-item d-md-flex d-block justify-content-between" v-if="user.type.type === 'legal_entity'">
            Название компании:
            <div class="col-md-6 col-12">{{ user.type.company_name }}</div>
          </li>
        </ul>
      </div>
      <div class="block-content block-content-full text-end block-content-sm bg-body-light fs-sm">
        <button @click.prevent="$router.push({name: 'clients-operator-edit', params: {id: user.id}})" class="btn btn-sm btn-alt-primary">Посмотреть полную информацию</button>
      </div>
    </template>
  </BaseBlock>
</template>

<script setup>
import {computed, defineComponent, ref} from "vue";
import {useUserOperatorStore} from "@/stores/dashboard/user/operator";

const tableBlock = ref(null)
const storeOperatorUser = useUserOperatorStore()
const user = computed(() => storeOperatorUser.user)


defineComponent({name: 'OrderDetailOperatorUserInfo'})
</script>

<style scoped>

</style>
