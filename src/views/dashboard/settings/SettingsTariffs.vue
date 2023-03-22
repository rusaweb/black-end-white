<template>
  <BasePageHeading title="Список Тарифов" subtitle="На этой странице отображаются информация про тарифы"/>
  <div class="content">
    <BaseBlock title="Список Тарифов" ref="tableBlock">
      <template #options>
        <div class="space-x-1">
          <button class="btn btn-block-option" data-bs-target="#create-tariffs" data-bs-toggle="modal">
            <i class="fa fa-plus me-1"></i>
            Добавить
          </button>
        </div>
      </template>
      <template #content>


        <ul class="nav nav-tabs nav-tabs-block" role="tablist">
          <li class="nav-item">
            <button
                class="nav-link"
                :class="{active: !disabled}"
                @click="disabled = false"
            >
              Not disabled
            </button>
          </li>
          <li class="nav-item">
            <button
                class="nav-link"
                :class="{active: disabled}"
                @click="disabled = true"
            >
              Disabled
            </button>
          </li>
        </ul>

        <div class="block-content block-content-full">
          <div class="table-responsive">
            <table class="table table-bordered table-striped table-vcenter"
                   v-if="tariffs?.content.length">
              <thead>
              <tr>
                <th style="width: 100px">Иконка</th>
                <th>Название</th>
                <th style="width: 200px">Описание</th>
                <th>Процент</th>
                <th>Дата создания</th>
                <th style="width: 60px"></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in tariffs?.content?.filter(e => e.disabled === disabled)" :key="item.id">
                <td class="fw-semibold fs-sm" v-if="item.icon">
                  <div class="bg-body rounded p-3">
                    <img class="w-100" v-lazy="item.icon.url" alt="">
                  </div>
                </td>
                <td class="fw-semibold fs-sm" v-else><img class="w-100" v-lazy="'error'" alt=""></td>
                <td class="fw-semibold fs-sm">{{ item.name }}</td>
                <td class="fw-semibold fs-sm">{{ item.description }}</td>
                <td class="fw-semibold fs-sm">{{ item.per_item_percent_multiplier }}</td>
                <td>
                  {{ new Date(item.created).toLocaleDateString("Ru-ru") }}
                  {{
                    new Date(item.created).toLocaleTimeString("Ru-ru", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  }}
                </td>
                <td class="text-end">
                  <div class="d-flex">
                    <button
                        data-bs-toggle="modal"
                        data-bs-target="#update-tariffs"
                        :data-bs-id="item.id"
                        class="btn btn-secondary"
                    >
                      <i class="fa fa-pen"></i>
                    </button>
<!--                    <button class="btn btn-danger ms-2"-->
<!--                            v-if="user?.roles?.includes('ADMINISTRATOR')"-->
<!--                            @click="deleteTariff(item.id)">-->
<!--                      <i class="fa fa-trash"></i>-->
<!--                    </button>-->
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
            <div class="form-control text-center p-5" v-else>
              Список тарифов пуст
            </div>
          </div>
        </div>
        <div class="block-content block-content-full bg-body-light">
          <BasePagination :data="tariffs"/>
        </div>
      </template>
    </BaseBlock>
  </div>
  <ModalCreateTariff/>
  <ModalUpdateTariff/>
</template>

<script setup>
import BasePagination from "@/components/BasePagination.vue";
import ModalCreateTariff from "@/components/modals/tariffs/CreateTariff.vue";
import ModalUpdateTariff from "@/components/modals/tariffs/UpdateTariff.vue";
import { computed, ref } from "vue";
import router from "@/router";
import { onBeforeRouteUpdate } from "vue-router";
import { useTariffsPublicStore } from "@/stores/dashboard/tariffs/public";

// === store user ===
// import { useUserStore } from "@/stores/dashboard/user/user";
// const storeUser = useUserStore()
// const { user } = storeToRefs(storeUser)

const tableBlock = ref(null);
const tariffsStore = useTariffsPublicStore();
import { storeToRefs } from "pinia";
const { disabled } = storeToRefs(tariffsStore)

tariffsStore.getTariffs(router.currentRoute.value.query);


onBeforeRouteUpdate((to, from, next) => {
  tariffsStore.getTariffs(to.query);
  next();
});

const tariffs = computed(() => {
  tariffsStore.loading
      ? tableBlock.value?.statusLoading()
      : tableBlock.value?.statusNormal();
  return tariffsStore.tariffs;
});
</script>
