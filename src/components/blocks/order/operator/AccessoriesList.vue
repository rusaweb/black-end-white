<template>
  <BaseBlock title="Список аксссуаров">
    <template #options>
      <button
          data-bs-target="#add-accessory"
          data-bs-toggle="modal"
          class="btn-block-option"
      >
        <i class="fa fa-plus"></i> <span class="fw-semibold">Добавить</span>
      </button>
    </template>
    <template #content>
      <div class="block-content block-content-full" v-if="accessories?.content.length">
        <div class="table-responsive">
          <table class="table table-bordered table-striped table-vcenter">
            <thead>
            <tr>
              <th><span class="d-flex justify-content-center"><i class="fa fa-image"></i></span></th>
              <th>Название</th>
              <th>Описание</th>
              <th>Цена</th>
              <th>Количество</th>
              <th style="width: 120px;"></th>
            </tr>
            </thead>
            <tbody>
            <tr style="cursor:pointer;" v-for="item in accessories?.content" :key="item.id">
              <td @click.prevent="showPhoto(0, item.accessory.images.map(e=> e.url))" style="width: 50px; min-width: 50px">
                <span class="d-flex justify-content-center">
                  <img style="object-fit: cover" width="45" height="45" v-lazy="item.accessory.images[0]?.url || '/src/assets/error.jpg'" alt="">
                </span>
              </td>
              <td class="fw-semibold fs-sm">
                <span>{{ item.accessory.name }}</span>
              </td>
              <td class="fw-semibold fs-sm">
                <span>{{ item.accessory.description }}</span>
              </td>
              <td class="fw-semibold fs-sm">
                <span>{{ item.accessory.price.amount.toLocaleString('ru-RU') }} сум</span>
              </td>
              <td class="fw-semibold fs-sm">
                <span>{{ item.count }}</span>
              </td>
              <td>
                <div class="btn-group">
                  <button class="btn btn-primary text-white" @click.prevent="deleteAccessory(item.id)"><i class="fa fa-trash"></i></button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="block-content block-content-full" v-else>
        <div class="form-control p-5 text-center">Список аксссуаров этого заказа пуст</div>
      </div>
    </template>
  </BaseBlock>
  <VueEasyLightbox
      :visible="gallery.visible"
      :index="gallery.index"
      :imgs="gallery.photos"
      @hide="handleHide"
  />
</template>

<script setup>
import {computed, defineComponent, reactive} from "vue";
import {useAccessoryOperatorStore} from "@/stores/dashboard/accessory/operator";
import router from "@/router";
import VueEasyLightbox from "vue-easy-lightbox";

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

const store = useAccessoryOperatorStore()

const accessories = computed(() => store.accessories)
store.getAccessories({orderId: router.currentRoute.value.params.id})
const deleteAccessory = async (id) => {
  await store.deleteAccessory(id, async () => {
    await store.getAccessories({orderId: router.currentRoute.value.params.id})
  })
}

defineComponent({name: 'OrderDetailOperatorAccessoriesList'})
</script>
