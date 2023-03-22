<template>
  <BasePageHeading
      :title="'Вещь: ' + (orderItem?.name || '') "
      subtitle="На этой странице отображается информация о вещи"
  >
    <template #extra>
      <button
          type="button"
          class="btn btn-alt-primary"
          v-click-ripple
          v-if="orderItem?.status.type !== 'packaging' && orderItem?.status.type !== 'ready'"
          @click.prevent="accept"
      >
        <i class="fa fa-check opacity-50 me-1"></i>
        Принять
      </button>
      <button
          type="button"
          class="btn btn-alt-primary"
          v-click-ripple
          v-if="orderItem?.hanger_id && orderItem?.code && orderItem?.status.type !== 'ready'"
          @click.prevent="finish"
      >
        <i class="fa fa-check opacity-50 me-1"></i>
        Завершить
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
                <div class="input-group" v-if="!updateCode">
                  <span class="form-control">
                    {{ orderItem.code }}
                  </span>
                  <button class="btn btn-primary" @click.prevent="updateCodeHandler">Обновить</button>
                </div>
                <div class="input-group" v-if="updateCode">
                  <input type="text" ref="updateInput" v-model="updateCodeValue" class="form-control">
                  <button class="btn btn-primary" @click.prevent="updateCodeSubmit">
                    <i class="fa fa-check"></i>
                  </button>
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
                    <span v-if="orderItem.hanger_id">{{hanger?.code}}-{{hanger?.category.name}} ({{hanger?.category.width_sm}}см/{{hanger?.category.height_sm}}см)</span>
                    <span v-else>Не установлено</span>
                  </span>
                  <button class="btn btn-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#select-hanger"
                          @click.prevent="updateHangerHandler">
                    {{ orderItem.hanger_id ? 'Обновить' : 'Установить' }}
                  </button>
                </div>
                <!--     ==== modal hanger update or added === -->
                <BaseModal title="Выбарите категорию" id="select-hanger">
                  <template #content>
                    <div class="block-content block-content-full">
                      <div class="row" v-if="updateHanger">
                        <template  v-for="item in categories?.content" :key="item.id">
                          <div class="col-md-6 mb-2 text-center"
                               style="cursor: pointer"
                               @click="changeHangerCategory(item)"
                          >
                            <div class="border-1 border rounded-2 p-2">
                              {{item.name}} ({{item.width_sm}}см/{{item.height_sm}}см)
                            </div>
                          </div>
                        </template>
                      </div>
                      <div class="row" v-else-if="!updateHanger">
                        <template  v-for="item in hangers?.content" :key="item.id">
                          <div class="col-md-4 mb-2"
                               style="cursor: pointer"
                               @click="updateHangerValue = item"
                          >
                            <div
                                class="border-1 border rounded-2 py-2 px-3 ribbon"
                                style="min-height: 2rem"
                                :class="hangers?.total_elements < 0 ? 'ribbon-success' : 'ribbon-danger'"
                            >
                              {{ item.code }}
                              <div class="ribbon-box top-0 fs-xs" style="height: 22px; line-height: 20px">
                                {{ hangers?.total_elements < 0 ? 'свободна' : 'занято'}}
                              </div>
                            </div>
                          </div>
                        </template>
                      </div>
                    </div>
                  </template>
                  <template #footer>
                    <button
                        type="button"
                        class="btn btn-sm btn-success me-1"
                        :disabled="!updateHangerCategoryValue && !hangers && !hangers?.content.length || !updateHangerValue"
                        @click.prevent="updateHangerSubmit"
                    >
                      Подтвердить
                    </button>
                    <button
                        type="button"
                        class="btn btn-sm btn-alt-secondary"
                        data-bs-dismiss="modal"
                    >
                      Закрыть
                    </button>
                  </template>
                </BaseModal>
<!--                <div class="input-group" v-if="updateHanger">-->
<!--                  <select class="form-select" v-model="updateHangerCategoryValue" @change="changeHangerCategory">-->
<!--                    <option :value="null">Выбарите категорию</option>-->
<!--                    <option :value="item" v-for="item in categories?.content" :key="item.id">{{item.name}} ({{item.width_sm}}см/{{item.height_sm}}см)</option>-->
<!--                  </select>-->
<!--                  <select class="form-select" :disabled="!updateHangerCategoryValue && !hangers && !hangers?.content.length" v-model="updateHangerValue">-->
<!--                    <option :value="null">Выбарите вешалку</option>-->
<!--                    <option :value="item" v-for="item in hangers?.content" :key="item.id">{{item.code}}</option>-->
<!--                  </select>-->
<!--                  <button class="btn btn-primary" @click.prevent="updateHangerSubmit">-->
<!--                    <i class="fa fa-check"></i>-->
<!--                  </button>-->
<!--                </div>-->
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
          <h3 class="mt-3">История чистки</h3>
          <ul class="list-group" v-if="orderItem">
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
          <h3 class="mt-3">Информация о клиенте</h3>
          <ul class="list-group" v-if="user">
            <li class="list-group-item d-md-flex d-block justify-content-between">
              Имя:
              <div class="col-md-6 col-12 mt-2">
                    <span class="form-control">
                      {{ user.display_name }}
                    </span>
              </div>
            </li>
            <li class="list-group-item d-md-flex d-block justify-content-between" v-if="tariff">
              Стратус:
              <div class="col-md-6 col-12 mt-2">
                    <span class="form-control">
                      {{ user.status.name }}
                    </span>
              </div>
            </li>
          </ul>
        </div>
      </template>
    </BaseBlock>
  </div>
</template>
<script setup>
import BaseModal from "@/components/BaseModal.vue";
import {computed, defineComponent, nextTick, onMounted, ref} from "vue";
import {useTariffsPublicStore} from "@/stores/dashboard/tariffs/public";
import {useOrderItemPackagerStore} from "@/stores/dashboard/order-item/packager";
import {useOrderPackagerStore} from "@/stores/dashboard/order/packager";
import statusOrderItem from "@/data/status-order-item";
import status from "@/data/status"
import router from "@/router";
import {useUserPackagerStore} from "@/stores/dashboard/user/packager";
import {useHangerPackagerStore} from "@/stores/dashboard/hanger/packager";
import {useHangerCategoryPackagerStore} from "@/stores/dashboard/hanger_category/packager";

const storePackager = useOrderItemPackagerStore()
const storeOrder = useOrderPackagerStore()
const storeTariff = useTariffsPublicStore()
const storeUser = useUserPackagerStore()
const storeHanger = useHangerPackagerStore()
const storeHangerCategory = useHangerCategoryPackagerStore()

const orderItem = computed(() => storePackager.orderItem)
const order = computed(() => storeOrder.order)
const tariff = computed(() => storeTariff.tariff)
const user = computed(() => storeUser.user)

const updateCode = ref(false)
const updateInput = ref(null)
const updateCodeValue = ref(null)
const modal = ref(null);


const updateCodeHandler = () => {
  updateCode.value = true
  nextTick(() => {
    updateInput.value.focus()
  })
}
const updateCodeSubmit = async () => {
  try {
    await storePackager.updateOrderItemCode({...router.currentRoute.value.params, code: updateCodeValue.value})
    await storePackager.getOrderItemById(router.currentRoute.value.params.id)
    updateCode.value = false
  }catch (e) {
    console.log(e)
  }
}

// Hanger Handler

const updateHanger = ref(false)
const updateHangerValue = ref(null)
const updateHangerCategoryValue = ref(null)
const categories = computed(()=>storeHangerCategory.hanger_categories)
const hangers = computed(()=>storeHanger.hangers)
const hanger = computed(()=>storeHanger.hanger)
const updateHangerHandler = async () => {
  updateHanger.value = true
  await storeHangerCategory.getHangerCategories()
}
const changeHangerCategory = async (item) => {
  updateHangerCategoryValue.value = item
  updateHanger.value = false
  await storeHanger.getHangers({categoryId: updateHangerCategoryValue.value.id})
}
const updateHangerSubmit = async () => {
  try {
    await storePackager.updateHanger({...router.currentRoute.value.params, hanger_id: updateHangerValue.value.id})
    await storePackager.getOrderItemById(router.currentRoute.value.params.id)
    await storeHanger.getHanger(orderItem.value.hanger_id)
    await modal.value.hide();
    updateHanger.value = true
  }catch (e) {
    console.log(e)
  }
}


onMounted(async () => {
  try {
    await storePackager.getOrderItemById(router.currentRoute.value.params.id)
    if (orderItem.value.hanger_id){
      await storeHanger.getHanger(orderItem.value.hanger_id)
    }
    await storeOrder.getOrder(orderItem.value.order_id)
    await storeUser.getUser(orderItem.value.order_id)
    await storeTariff.getTariff(order.value.tariff.id)
    modal.value = new window.bootstrap.Modal("#select-hanger");
  }catch (e) {
    console.log(e)
  }
})
const accept = async () => {
  try {
    await storePackager.moveOrderItemPackaging(router.currentRoute.value.params.id)
    await storePackager.getOrderItemById(router.currentRoute.value.params.id)
    // await router.push({name: 'specialists'})
  }catch (e) {
    console.log(e)
  }
}
const finish = async () => {
  try {
    await storePackager.ready(router.currentRoute.value.params.id)
    await router.push({name: 'packager'})
  }catch (e) {
    console.log(e)
  }
}
defineComponent({name: 'SpecialistsOrderPage'})
</script>