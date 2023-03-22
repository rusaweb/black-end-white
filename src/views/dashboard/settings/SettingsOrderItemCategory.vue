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
              data-bs-target="#create-category"
              data-bs-toggle="modal"
          >
            <i class="fa fa-plus me-1"></i>
            Добавить
          </button>
        </div>
      </template>
      <template #content>
        <div class="block-content block-content-full">
          <div class="row">
            <div class="col">
              <ul class="list-group">
                <li
                    v-for="cat in categoriesParent?.content"
                    :key="cat.id"
                    class="list-group-item d-md-flex d-block justify-content-between align-items-center"
                    :class="{active: currentParent === cat.id}"
                    @click="() => changeChild(cat.id)"
                    style="cursor:pointer;"
                >
                  {{ cat.name }}
                  <button
                      class="btn btn-sm btn-primary ms-auto me-2"
                      data-bs-target="#update-category"
                      data-bs-toggle="modal"
                      :data-bs-id="cat.id"
                  >
                    <i class="fa fa-pen"></i>
                  </button>
                  <button class="btn btn-sm btn-danger">
                    <i class="fa fa-trash" @click="deleteCategory(cat.id)"></i>
                  </button>
                  <i v-if="cat" class="fa fa-chevron-right"></i>
                </li>
                <li
                    class="list-group-item d-md-flex d-block justify-content-between align-items-center"
                    style="cursor:pointer;"
                    data-bs-target="#create-category"
                    data-bs-toggle="modal"
                >
                  Добавить <i class="fa fa-plus"></i>
                </li>
              </ul>
            </div>
            <div class="col">
              <ul class="list-group">
                <li v-for="cat in categoriesChild?.content" :key="cat.id"
                    class="list-group-item d-md-flex d-block justify-content-between align-items-center">
                  {{ cat.name }}
                  <button
                      class="btn btn-sm btn-primary ms-auto me-2"
                      data-bs-target="#update-category"
                      data-bs-toggle="modal"
                      :data-bs-id="cat.id"
                  >
                    <i class="fa fa-pen"></i>
                  </button>
                  <button class="btn btn-sm btn-danger">
                    <i class="fa fa-trash" @click="deleteCategory(cat.id)"></i>
                  </button>
                </li>
                <li
                    class="list-group-item d-md-flex d-block justify-content-between align-items-center"
                    style="cursor:pointer;"
                    data-bs-target="#create-category"
                    data-bs-toggle="modal"
                    :data-bs-parent="currentParent"
                >
                  Добавить <i class="fa fa-plus"></i>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="block-content block-content-full bg-body-light">
          <BasePagination :data="categoriesParent"/>
        </div>
      </template>
    </BaseBlock>
  </div>
  <ModalCreateCategory @created="() => initCategory()"/>
  <ModalUpdateCategory @created="() => initCategory()"/>
</template>

<script setup>
import BasePagination from "@/components/BasePagination.vue";
import ModalCreateCategory from "@/components/modals/settings/category/CreateCategory.vue";
import ModalUpdateCategory from "@/components/modals/settings/category/UpdateCategory.vue";
import {useCategoryStore} from "@/stores/dashboard/category/administrator";
import {computed, onMounted, ref} from "vue";
import router from "@/router";
import {onBeforeRouteUpdate} from "vue-router";

const tableBlock = ref(null);
const categoryStore = useCategoryStore();
const currentParent = ref(null)

// categoryStore.getCategories(router.currentRoute.value.query);

onBeforeRouteUpdate(async (to, from, next) => {
  await initCategory(to.query)
  next();
});

const categoriesParent = computed(() => {
  categoryStore.loading
      ? tableBlock.value?.statusLoading()
      : tableBlock.value?.statusNormal();
  return categoryStore.category_parent;
});

const categoriesChild = computed(() => {
  categoryStore.loading
      ? tableBlock.value?.statusLoading()
      : tableBlock.value?.statusNormal();
  return categoryStore.category_child;
});
onMounted(async () => {
  await initCategory(router.currentRoute.value.query)
})
const initCategory = async (query) => {
  await categoryStore.getCategoryParent(query);
  await changeChild(categoriesParent.value.content.at(0)?.id)
}
const deleteCategory = async (id) => {
  await categoryStore.deleteCategory(id, async () => {
    await initCategory()
  });
}
const changeChild = async (id) => {
  currentParent.value = id
  await categoryStore.getCategoryChild({id, args: {size: 100}});
}
</script>
