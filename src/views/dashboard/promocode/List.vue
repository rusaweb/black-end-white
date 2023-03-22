<template>
  <BasePageHeading title="Список промо-кодов" subtitle="На этой странице отображаются информация промо-кодов"/>
  <div class="content">
    <BaseBlock title="Список промо-кодов" ref="tableBlock">
      <template #options>
        <div class="space-x-1">
          <button class="btn btn-block-option" data-bs-target="#create-promo-code" data-bs-toggle="modal">
            <i class="fa fa-plus me-1"></i>
            Добавить
          </button>
        </div>
      </template>
      <template #content>
        <div class="block-content block-content-full">
          <div class="table-responsive">
            <table class="table table-bordered table-striped table-vcenter"
                   v-if="promo_code_list?.content.length">
              <thead>
              <tr>
                <th>ID</th>
                <th>Процент</th>
                <th>Одноразовый</th>
                <th>Использован</th>
                <th>Срок</th>
                <th style="width: 120px;"></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in promo_code_list?.content" :key="item.id">
                <td class="fw-semibold fs-sm">{{ item.id }}</td>
                <td class="fw-semibold fs-sm">{{ item.discount_percent }}</td>
                <td class="fw-semibold fs-sm">{{ item.usage_type.type === 'one_time' ? 'Да' : 'Нет' }}</td>
                <td class="fw-semibold fs-sm">{{ item.usage_type.type === 'one_time' ? item.usage_type.used ? 'Да' : 'Нет' : '---' }}</td>
                <td>
                  {{ new Date(item.expires_at).toLocaleDateString("Ru-ru") }}
                  {{
                    new Date(item.expires_at).toLocaleTimeString("Ru-ru", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  }}
                </td>
                <td class="text-end">
                  <button
                      data-bs-toggle="modal"
                      data-bs-target="#update-promo-code"
                      :data-bs-id="item.id"
                      class="btn btn-secondary me-2"
                  >
                    <i class="fa fa-pen"></i>
                  </button>
                  <button class="btn btn-danger" @click.prevent="deleteItem(item.id)">
                    <i class="fa fa-trash"></i>
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
            <div class="form-control text-center p-5" v-else>
              Список промо-кодов пуст
            </div>
          </div>
        </div>
        <div class="block-content block-content-full bg-body-light">
          <BasePagination :data="promo_code_list"/>
        </div>
      </template>
    </BaseBlock>
  </div>
  <ModalCreatePromoCode/>
  <ModalUpdatePromoCode/>
</template>

<script setup>
import BasePagination from "@/components/BasePagination.vue";
import ModalCreatePromoCode from "@/components/modals/promo-code/Create.vue";
import ModalUpdatePromoCode from "@/components/modals/promo-code/Update.vue";
import {computed, ref} from "vue";
import router from "@/router";
import {onBeforeRouteUpdate} from "vue-router";
import {usePromoCodeStore} from "@/stores/dashboard/promocode/operator";

const tableBlock = ref(null);
const promoCodeStore = usePromoCodeStore();

promoCodeStore.getPromoCodeList(router.currentRoute.value.query);

const deleteItem = (id) => {
  promoCodeStore.deletePromoCode(id, ()=>{
    promoCodeStore.getPromoCodeList(router.currentRoute.value.query);
  })
}

onBeforeRouteUpdate((to, from, next) => {
  promoCodeStore.getPromoCodeList(to.query);
  next();
});

const promo_code_list = computed(() => {
  promoCodeStore.loading
      ? tableBlock.value?.statusLoading()
      : tableBlock.value?.statusNormal();
  return promoCodeStore.promo_code_list;
});
</script>
