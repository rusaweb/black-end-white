<template>
  <BasePageHeading
      title="Категории"
      subtitle="На этой странице отображаются информация про категории вещей"
  ></BasePageHeading>
  <div class="content">
    <BaseBlock title="Список категории" ref="tableBlock">
      <template #options>
        <div class="space-x-1">
          <button
              class="btn btn-block-option"
              data-bs-target="#create-hanger-category"
              data-bs-toggle="modal"
          >
            <i class="fa fa-plus me-1"></i>
            Добавить
          </button>
        </div>
      </template>
      <template #content>
        <div class="block-content block-content-full">
          <div class="table-responsive">
            <table
                class="table table-bordered table-striped table-vcenter"
                v-if="hanger_categories?.content.length"
            >
              <thead>
              <tr>
                <th>Название</th>
                <th>Ширина (см)</th>
                <th>Высота (см)</th>
                <th>Дата создания</th>
                <th style="width: 120px;"></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="cat in hanger_categories?.content" :key="cat.id">
                <td class="fw-semibold fs-sm">{{ cat.name }}</td>
                <td class="fw-semibold fs-sm">{{ cat.width_sm }}</td>
                <td class="fw-semibold fs-sm">{{ cat.height_sm }}</td>
                <td>
                  {{ new Date(cat.created).toLocaleDateString("Ru-ru") }}
                  {{
                    new Date(cat.created).toLocaleTimeString("Ru-ru", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  }}
                </td>
                <td class="text-end">
                  <button
                      data-bs-toggle="modal"
                      data-bs-target="#update-hanger-category"
                      :data-bs-id="cat.id"
                      class="btn btn-secondary me-2"
                  >
                    <i class="fa fa-pen"></i>
                  </button>
                  <button class="btn btn-danger" @click.prevent="deleteItem(cat.id)">
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
          <BasePagination :data="hanger_categories" />
        </div>
      </template>
    </BaseBlock>
  </div>
  <ModalCreateHangerCategory />
  <ModalUpdateHangerCategory />
</template>

<script setup>
import BasePagination from "@/components/BasePagination.vue";
import ModalCreateHangerCategory from "@/components/modals/settings/hanger/CreateHangerCategory.vue";
import ModalUpdateHangerCategory from "@/components/modals/settings/hanger/UpdateCategory.vue";
import { useHangerCategoryStore } from "@/stores/dashboard/hanger_category/administrator";
import { computed, ref } from "vue";
import router from "@/router";
import { onBeforeRouteUpdate } from "vue-router";

const tableBlock = ref(null);
const hangerCategoryStore = useHangerCategoryStore();

hangerCategoryStore.getHangerCategories(router.currentRoute.value.query);

const deleteItem = (id) => {
  hangerCategoryStore.deleteHangerCategories(id, ()=>{
    hangerCategoryStore.getHangerCategories(router.currentRoute.value.query);
  })
}

onBeforeRouteUpdate((to, from, next) => {
  hangerCategoryStore.getHangerCategories(to.query);
  next();
});

const hanger_categories = computed(() => {
  hangerCategoryStore.loading
      ? tableBlock.value?.statusLoading()
      : tableBlock.value?.statusNormal();
  return hangerCategoryStore.hanger_categories;
});
</script>
