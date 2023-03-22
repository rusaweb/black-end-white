<template>
  <BaseBlock title="Список вещей">
    <template #options>
      <button
          class="btn btn-block-option"
          data-bs-target="#create-order-item"
          data-bs-toggle="modal"
          v-if="props.status === 'filling_details'"
      >
        <i class="fa fa-plus"></i>
        Добавить
      </button>
    </template>
    <template #content>
      <div
          class="block-content mb-3"
          :class="{'block-content-full': !orderItems?.content.length}"
      >
        <template v-if="orderItems?.content.length">
          <div class="table-responsive">
            <table class="table table-bordered table-striped table-vcenter">
            <thead>
            <tr>
              <th><span class="d-flex justify-content-center"><i class="fa fa-image"></i></span></th>
              <th>Название</th>
              <th>Статус</th>
              <th>Код</th>
              <th>Текущий этап</th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="item in orderItems?.content"
                :key="item.id"
            >
              <td @click.prevent="showPhoto(0, item.images.map(e=> e.url))" style="width: 50px; min-width: 50px">
                <span class="d-flex justify-content-center">
                  <img style="object-fit: cover" width="45" height="45" v-lazy="item.images[0]?.url || '/src/assets/error.jpg'" alt="">
                </span>
              </td>
              <td
                  class="fw-semibold fs-sm"
                  data-bs-target="#update-order-item"
                  data-bs-toggle="modal"
                  :data-bs-id="item.id"
              >
                {{ item.name }}
              </td>
              <td
                  class="fw-semibold fs-sm"
                  data-bs-target="#update-order-item"
                  data-bs-toggle="modal"
                  :data-bs-id="item.id"
                  style="white-space: nowrap;"
              >
                {{ statusOrderItem[item.status.type] }}
                <span v-if="item.status.type === 'ready'">({{item.issued ? 'Выдано': 'Не выдано'}})</span>
              </td>
              <td
                  class="fw-semibold fs-sm"
                  data-bs-target="#update-order-item"
                  data-bs-toggle="modal"
                  :data-bs-id="item.id"
              >
                {{ item.code }}
              </td>
              <td
                  class="fw-semibold fs-sm"
                  style="white-space: nowrap;"
                  data-bs-target="#update-order-item"
                  data-bs-toggle="modal"
                  :data-bs-id="item.id"
              >
                {{item.steps_history.at(-1)?.step.name || 'В ожидании'}}
              </td>
            </tr>
            </tbody>
          </table>
          </div>
        </template>
        <div class="form-control d-flex flex-column align-items-center justify-content-center p-5" v-else>Список вещей заказа пуст</div>
      </div>
      <div class="block-content block-content-full text-end block-content-sm bg-body-light fs-sm">
        <button v-if="orderItems?.content.length && props.status === 'filling_details'" @click.prevent="filled"
                class="btn btn-sm btn-alt-primary me-2">Заполнено
        </button>
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
import {computed, defineComponent, onMounted, reactive, ref} from "vue";
import statusOrderItem from "@/data/status-order-item";
import {useOrderItemOperatorStore} from "@/stores/dashboard/order-item/operator";
import router from "@/router";
import {useOrderOperatorStore} from "@/stores/dashboard/order/operator";
import VueEasyLightbox from "vue-easy-lightbox";

const props = defineProps({
  status: String
})
const gallery = reactive({
  visible: false,
  index: 0,
  photos: null,
});
const tableBlock = ref(null)
const storeOperatorOrderItem = useOrderItemOperatorStore()
const storeOperator = useOrderOperatorStore()


const orderItems = computed(() => storeOperatorOrderItem.orderItems)

onMounted(async () => {
  await tableBlock.value?.baseBlock?.statusLoading()
  await storeOperatorOrderItem.getOrderItemsById(router.currentRoute.value.params.id, '')
  await tableBlock.value?.baseBlock?.statusNormal()
})

const filled = async () => {
  await storeOperator.markOrderFilled(router.currentRoute.value.params.id)
  await storeOperator.getOrder(router.currentRoute.value.params.id)
}


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
defineComponent({name: 'OrderDetailOperatorOrderItems'})
</script>
