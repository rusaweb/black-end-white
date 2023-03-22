<template>
    <BasePageHeading title="Список вешалок" subtitle="На этой странице отображаются информация про категории вещей" />
    <div class="content">
        <BaseBlock title="Список вешалок" ref="tableBlock">
            <template #options>
                <div class="space-x-1">
                    <button class="btn btn-block-option" data-bs-target="#create-hanger" data-bs-toggle="modal">
                        <i class="fa fa-plus me-1"></i>
                        Добавить
                    </button>
                </div>
            </template>
            <template #content>
                <div class="block-content block-content-full">
                    <div class="table-responsive">
                        <table class="table table-bordered table-striped table-vcenter"
                            v-if="hanger_list?.content.length">
                            <thead>
                                <tr>
                                    <th>Название</th>
                                    <th>Высота (см)</th>
                                    <th>Дата создания</th>
                                    <th style="width: 120px;"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in hanger_list?.content" :key="item.id">
                                    <td class="fw-semibold fs-sm">{{ item.code }}</td>
                                    <td class="fw-semibold fs-sm" v-if="item.category && item.category.name">{{ item.category.name }}  ({{item.category.width_sm}}см / {{item.category.height_sm}}см)</td>
                                    <td class="fw-semibold fs-sm" v-else>---</td>
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
                                      <button
                                          data-bs-toggle="modal"
                                          data-bs-target="#update-hanger"
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
                            Список категории пуст
                        </div>
                    </div>
                </div>
                <div class="block-content block-content-full bg-body-light">
                    <BasePagination :data="hanger_list" />
                </div>
            </template>
        </BaseBlock>
    </div>
    <ModalHangerList />
    <ModalUpdateHanger />
</template>
  
<script setup>
import BasePagination from "@/components/BasePagination.vue";
import ModalHangerList from "@/components/modals/settings/hanger/List.vue";
import ModalUpdateHanger from "@/components/modals/settings/hanger/UpdateListItem.vue";
import { useHangerStore } from "@/stores/dashboard/hanger/administrator";
import { computed, ref } from "vue";
import router from "@/router";
import { onBeforeRouteUpdate } from "vue-router";

const tableBlock = ref(null);
const hangerStore = useHangerStore();

hangerStore.getHangerList(router.currentRoute.value.query);

const deleteItem = (id) => {
  hangerStore.deleteHanger(id, ()=>{
    hangerStore.getHangerList(router.currentRoute.value.query);
  })
}

onBeforeRouteUpdate((to, from, next) => {
    hangerStore.getHangerList(to.query);
    next();
});

const hanger_list = computed(() => {
    hangerStore.loading
        ? tableBlock.value?.statusLoading()
        : tableBlock.value?.statusNormal();
    return hangerStore.hanger_list;
});
</script>
  