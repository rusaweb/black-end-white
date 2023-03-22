<template>
  <BasePageHeading title="Список пола" subtitle="На этой странице отображаются теги пола"/>
  <div class="content">
    <BaseBlock title="Список пола" ref="tableBlock">
      <template #options>
        <div class="space-x-1">
          <button class="btn btn-block-option" data-bs-target="#create-tag" data-bs-toggle="modal" data-bs-code="sex">
            <i class="fa fa-plus me-1"></i>
            Добавить
          </button>
        </div>
      </template>
      <template #content>
        <div class="block-content block-content-full">
          <div class="table-responsive">
            <table class="table table-bordered table-striped table-vcenter"
                   v-if="tags?.length">
              <thead>
              <tr>
                <th>Название</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in tags" :key="item.id">
                <td class="fw-semibold fs-sm">{{ item.suggestion }}</td>
                <td class="text-end">
                  <button
                      data-bs-toggle="modal"
                      data-bs-target="#update-tag"
                      data-bs-code="sex"
                      :data-bs-id="item.id"
                      class="btn btn-secondary"
                  >
                    <i class="fa fa-pen"></i>
                  </button>
                  <button
                      @click.prevent="deleteTag(item.id)"
                      class="btn btn-danger"
                  >
                    <i class="fa fa-trash"></i>
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
            <div class="form-control text-center p-5" v-else>
              Список пола пуст
            </div>
          </div>
        </div>
      </template>
    </BaseBlock>
  </div>
  <ModalCreateTag @created="initTag"/>
  <ModalUpdateTag @updated="initTag"/>
</template>

<script setup>
import {computed, ref} from "vue";
import router from "@/router";
import {onBeforeRouteUpdate} from "vue-router";
import {useTagsStore} from "@/stores/dashboard/tags/operator";
import ModalCreateTag from "@/components/modals/settings/tags/CreateOrderItemStep.vue";
import ModalUpdateTag from "@/components/modals/settings/tags/UpdateOrderItemStep.vue";

const tableBlock = ref(null);
const tagsStore = useTagsStore();

tagsStore.getTagsSex(router.currentRoute.value.query);


onBeforeRouteUpdate((to, from, next) => {
  tagsStore.getTagsSex(to.query);
  next();
});

const tags = computed(() => {
  tagsStore.loading
      ? tableBlock.value?.statusLoading()
      : tableBlock.value?.statusNormal();
  return tagsStore.tags_sex;
});

const initTag = async () => {
  await tagsStore.getTagsSex(router.currentRoute.value.query);
}
const deleteTag = async (id) => {
  await tagsStore.deleteTag(id, async () => {
    await tagsStore.getTagsSex(router.currentRoute.value.query);
  })
}
</script>
