<template>
  <BasePageHeading
      title="Акксессуары"
      subtitle="На этой странице отображаются акксессуары"
  ></BasePageHeading>
  <div class="content">
    <BaseBlock title="Список акксессуары" ref="tableBlock">
      <template #options>
        <div class="space-x-1">
          <button
              class="btn btn-block-option"
              data-bs-target="#create-accessory"
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
                v-if="accessories?.content.length"
            >
              <thead>
              <tr>
                <th>
                  <span class="d-flex justify-content-center">
                    <i class="fa fa-image"></i>
                  </span>
                </th>
                <th>Название</th>
                <th>Описание</th>
                <th>Цена</th>
                <th>Доступно</th>
                <th>Дата создания</th>
                <th style="width: 126px;"></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="type in accessories?.content" :key="type.id">
                <td @click.prevent="showPhoto(0, type.images.map(e=>e.url))" style="width: 50px; min-width: 50px">
                <span class="d-flex justify-content-center">
                  <img style="object-fit: cover" width="45" height="45" v-lazy="type.images[0]?.url || '/src/assets/error.jpg'" alt="">
                </span>
                </td>
                <td class="fw-semibold fs-sm">{{ type.name }}</td>
                <td class="fw-semibold fs-sm">{{ type.description }}</td>
                <td class="fw-semibold fs-sm">{{ type.price.amount }} сум</td>
                <td class="fw-semibold fs-sm">{{ type.selling ? 'Да': 'Нет' }}</td>
                <td>
                  {{ new Date(type.created).toLocaleDateString("Ru-ru") }}
                  {{
                    new Date(type.created).toLocaleTimeString("Ru-ru", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  }}
                </td>

                <td>
                  <button
                      data-bs-toggle="modal"
                      data-bs-target="#update-accessory"
                      :data-bs-id="type.id"
                      class="btn btn-secondary me-2"
                  >
                    <i class="fa fa-pen"></i>
                  </button>
                  <button
                      v-if="type.selling"
                      class="btn btn-danger me-2"
                      @click.prevent="deleteServices(type.id)"
                  >
                    <i class="fa fa-stop-circle"></i>
                  </button>
                  <button
                      v-else
                      class="btn btn-success me-2"
                      @click.prevent="startServices(type.id)"
                  >
                    <i class="fa fa-play-circle"></i>
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
            <div class="form-control text-center p-5" v-else>
              Список aкксессуаров пуст
            </div>
          </div>
        </div>
        <div class="block-content block-content-full bg-body-light">
          <BasePagination :data="accessories" />
        </div>
      </template>
    </BaseBlock>
  </div>
  <ModalCreateAccessory />
  <ModalUpdateAccessory />
  <VueEasyLightbox
      :visible="gallery.visible"
      :index="gallery.index"
      :imgs="gallery.photos"
      @hide="handleHide"
  />
</template>

<script setup>
import BasePagination from "@/components/BasePagination.vue";
import ModalCreateAccessory from "@/components/modals/accessory/Create.vue";
import {computed, reactive, ref} from "vue";
import { onBeforeRouteUpdate } from "vue-router";
import router from "@/router";
import {useAccessoryAdministratorStore} from "@/stores/dashboard/accessory/administrator";
import ModalUpdateAccessory from "@/components/modals/accessory/Update.vue";
import VueEasyLightbox from "vue-easy-lightbox";

const tableBlock = ref(null);
const storeAccessory = useAccessoryAdministratorStore()

storeAccessory.getAccessories(router.currentRoute.value.query);
const accessories = computed(() => {
  storeAccessory.loading
      ? tableBlock.value?.statusLoading()
      : tableBlock.value?.statusNormal();
  return storeAccessory.accessories;
});
onBeforeRouteUpdate((to, from, next) => {
  storeAccessory.getAccessories(to.query);
  next();
});
const deleteServices = async (id) => {
  await storeAccessory.deleteAccessory(id, async () => {
    await storeAccessory.getAccessories(router.currentRoute.value.query);
  })
}
const startServices = async (id) => {
  await storeAccessory.startAccessory(id)
  await storeAccessory.getAccessories(router.currentRoute.value.query);
}
const gallery = reactive({
  visible: false,
  index: 0,
  photos: null,
});
function showPhoto(index, url) {
  if (url.length){
    gallery.index = index;
    gallery.visible = true;
    gallery.photos = url
  }
}
function handleHide() {
  gallery.visible = false;
  gallery.photos = []
}
</script>