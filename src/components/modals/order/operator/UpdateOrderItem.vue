<template>
  <BaseModal title="Редактировать заказ" :modalLg="true" id="update-order-item">
    <template #content>
      <div class="block-content block-content-full">
        <div v-if="!load" class="row items-push">
          <div class="col-12">
            <label class="form-label">Изображение</label>
            <div class="row">
              <div class="col-md-2 col-4 mb-2" style="height: 100px;" v-for="(item, key) in state.images" :key="key">
                <div class="h-100 position-relative border boder-1 d-flex justify-content-center align-items-center rounded overflow-hidden">
                  <img :src="item.url" class="w-100" alt="">
                  <div class="position-absolute bottom-0 end-0 bg-body-dark text-center px-1 rounded" style="cursor: pointer" @click="deleteItemImage(item)">
                    <i class="fa fa-trash text-danger"></i>
                  </div>
                </div>
              </div>
              <div
                  v-if="state.images.length < 10"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasBottomUpdate"
                  aria-controls="offcanvasBottom"
                  class="col-md-2 col-4 mb-2"
                  style="height: 100px;"
              >
                <div class="h-100 border boder-1 d-flex justify-content-center align-items-center rounded overflow-hidden"><i class="fa fa-plus fa-xl"></i></div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-12">
            <label class="form-label">Название</label>
            <input
                type="text"
                class="form-control"
                v-model="state.name"
                placeholder="Введите название"
                :class="{ 'is-invalid': v$.name.$errors.length}"
                @blur="v$.name.$touch"
            >
            <div
                v-if="v$.name.$errors.length"
                class="invalid-feedback animated fadeIn fs-xs"
            >
              Пожалуйста, введите название
            </div>
          </div>
          <div class="col-md-6 col-12">
            <label class="form-label">Описание</label>
            <input
                type="text"
                class="form-control"
                v-model="state.description"
                placeholder="Введите описание"
                :class="{ 'is-invalid': v$.description.$errors.length}"
                @blur="v$.description.$touch"
            >
            <div
                v-if="v$.description.$errors.length"
                class="invalid-feedback animated fadeIn fs-xs"
            >
              Пожалуйста, введите описание
            </div>
          </div>
          <div class="col-md-6 col-12">
            <label class="form-label">Цвет</label>
            <VueSelect
                v-if="colors"
                v-model="state.colors"
                :options="colors"
                taggable
                multiple
                label="suggestion"
                class="form-control p-0 text-secondary"
                :placeholder="`Выбирете цвета`"
            >
              <template #no-options>
                <div style="opacity: 0.8">Такого цвета нет</div>
              </template>
            </VueSelect>
            <div
                v-if="v$.colors.$errors.length"
                class="invalid-feedback animated fadeIn fs-xs"
            >
              Пожалуйста, выберите цвета
            </div>
          </div>
          <div class="col-md-6 col-12">
            <label class="form-label">Пол</label>
            <VueSelect
                v-if="sex"
                v-model="state.sex"
                :options="sex"
                taggable
                multiple
                label="suggestion"
                class="form-control p-0 text-secondary"
                :placeholder="`Выбирете пол`"
            >
              <template #no-options>
                <div style="opacity: 0.8">Такого пола нет</div>
              </template>
            </VueSelect>
            <div
                v-if="v$.sex.$errors.length"
                class="invalid-feedback animated fadeIn fs-xs"
            >
              Пожалуйста, выберите пол
            </div>
          </div>
          <div class="col-md-6 col-12">
            <label class="form-label">Дефекты</label>
            <VueSelect
                v-if="defects"
                v-model="state.defects"
                :options="defects"
                taggable
                multiple
                label="suggestion"
                class="form-control p-0 text-secondary"
                :placeholder="`Выбирете дефекты`"
            >
              <template #no-options>
                <div style="opacity: 0.8">Такого дефекта нет</div>
              </template>
            </VueSelect>
            <div
                v-if="v$.defects.$errors.length"
                class="invalid-feedback animated fadeIn fs-xs"
            >
              Пожалуйста, выберите дефекты
            </div>
          </div>
          <div class="col-md-6 col-12">
            <div class="form-check-label fw-semibold">Процент от тарифа</div>
            <div class="form-check form-check form-switch">
              <input
                  type="checkbox"
                  class="form-check-input"
                  v-model="state.price_include_tariff_tax"
              />
            </div>
          </div>
          <div class="col-md-6 col-12">
            <label class="form-label">Код</label>
            <input
                type="text"
                class="form-control"
                v-model="state.code"
                placeholder="Введите Код"
                :class="{ 'is-invalid': v$.code.$errors.length}"
                @blur="v$.code.$touch"
            >
            <div
                v-if="v$.code.$errors.length"
                class="invalid-feedback animated fadeIn fs-xs"
            >
              Пожалуйста, введите код
            </div>
          </div>
          <div class="col-md-6 col-12">
            <label class="form-label">Номер вешалки</label>
            <span class="form-control">
              <span v-if="orderItem && orderItem.hanger_id && hanger">{{hanger?.code}}-{{hanger?.category.name}} ({{hanger?.category.width_sm}}см/{{hanger?.category.height_sm}}см)</span>
              <span v-else>Не установлено</span>
            </span>
          </div>
          <div class="col-md-6 col-12">
            <div class="input-group">
              <label class="form-label d-block w-100">Доп. обработка</label>
              <VueSelect
                  v-if="processing_list?.content"
                  v-model="state.additional_services"
                  :options="processing_list.content"
                  multiple
                  label="name"
                  class="form-control p-0 text-secondary  w-100"
                  placeholder="Выбирете доп. обработка"
                  @search="onSearchServices"
              >
                <template #no-options>
                  <div style="opacity: 0.8">Такой обработки нет</div>
                </template>
              </VueSelect>
            </div>
          </div>
          <div class="col-md-6 col-12">
            <div class="input-group">
              <label class="form-label d-block w-100">Категория</label>
              <VueSelect
                  v-if="categories_parent?.content"
                  v-model="state.category_parent"
                  :options="categories_parent.content"
                  label="name"
                  value="id"
                  class="form-control p-0 text-secondary  w-100"
                  placeholder="Выбирете категорию"
                  @search="onSearchParent"
                  :class="{ 'is-invalid': v$.category_parent.$errors.length}"
                  @blur="v$.category_parent.$touch"
                  :filterable="false"
                  @option:selected="changeCat"
              >
                <template #no-options>
                  <div style="opacity: 0.8">Такой категории нет</div>
                </template>
              </VueSelect>
              <div
                  v-if="v$.category_parent.$errors.length"
                  class="invalid-feedback animated fadeIn fs-xs w-100"
              >
                Пожалуйста, выберите категорию
              </div>
            </div>
          </div>
          <div class="col-md-6 col-12" v-if="categories_children?.content">
            <div class="input-group">
              <label class="form-label w-100">Под категорию</label>
              <VueSelect
                  v-model="state.category_children"
                  :options="categories_children.content"
                  label="name"
                  value="id"
                  class="form-control p-0 text-secondary"
                  placeholder="Выбирете категорию"
                  :class="{ 'is-invalid': v$.category_children.$errors.length}"
                  @blur="v$.category_children.$touch"
                  @search="onSearchChildren"
                  :filterable="false"
                  @option:selected="changeType"
              >
                <template #no-options>
                  <div style="opacity: 0.8">Такой категории нет</div>
                </template>
              </VueSelect>
              <div
                  v-if="v$.category_children.$errors.length"
                  class="invalid-feedback animated fadeIn fs-xs"
              >
                Пожалуйста, выберите категорию
              </div>
            </div>
          </div>
          <div class="col-md-6 col-12" v-if="types?.content">
            <label class="form-label">Тип</label>
            <VueSelect
                v-model="state.type_id"
                :options="types.content"
                label="name"
                class="form-control p-0 text-secondary"
                placeholder="Выбирете тип"
                @search="onSearch"
                :filterable="false"
                :class="{ 'is-invalid': v$.type_id.$errors.length}"
                @blur="v$.type_id.$touch"
            >
              <template #no-options>
                <div style="opacity: 0.8">Такого этапа нет</div>
              </template>
            </VueSelect>
            <div
                v-if="v$.type_id.$errors.length"
                class="invalid-feedback animated fadeIn fs-xs"
            >
              Пожалуйста, выберите тип
            </div>
          </div>
        </div>
        <div v-else class="w-100 d-flex justify-content-center py-10">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <button
          type="button"
          class="btn btn-sm btn-success me-1"
          @click.prevent="submit"
      >
        Сохранить
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
  <div class="offcanvas offcanvas-bottom shadow-lg" :style="`z-index: 9999999999; height: ${offcanvas_height}vh`" tabindex="-1" id="offcanvasBottomUpdate" aria-labelledby="offcanvasBottomLabel">
    <div class="offcanvas-header">
      <span class="d-block" style="width: 32px;"></span>
      <h5 class="offcanvas-title text-center" id="offcanvasBottomLabel">Выберите способ</h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body small">
      <div class="d-flex justify-content-center" v-if="!image && !cameraOpen">
        <label for="file-upload-update" class="btn btn-alt-secondary me-2">
          <i class="fa fa-file me-2"></i> Выбрать
        </label>
        <input id="file-upload-update" type="file" class="form-control d-none" @change="e => uploadImage(e.target.files[0])">
        <button @click="cameraOpen = true; offcanvas_height=80" class="btn btn-alt-secondary"><i class="fa fa-camera me-2"></i> Камера</button>
      </div>
      <BaseCamera v-else-if="cameraOpen" @close="cameraOpen = false" @done="uploadImageCamera"/>
      <div class="row justify-content-center" v-else>
        <div class="col-md-5 col-12">
          <div class="row">
            <div class="col-xl-6">
              <p class="form-label border-bottom text-black pb-2">Выберите размер</p>
              <div>
                <vue-cropper
                    ref="cropper"
                    :aspect-ratio="1"
                    :src="image"
                    :zoomOnWheel="false"
                    alt="Source Image"
                    preview=".js-img-cropper-preview"
                ></vue-cropper>
              </div>
            </div>
            <div class="col-xl-6">
              <p class="form-label border-bottom text-black pb-2">Результат</p>
              <div class="overflow-hidden mb-4">
                <div
                    class="js-img-cropper-preview mx-auto overflow-hidden"
                    style="height: 200px"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12"></div>
        <div class="col-md-5 col-12">
          <div class="btn-group mt-2">
            <button class="btn btn-alt-secondary" data-bs-dismiss="offcanvas" aria-label="Close" @click.prevent="cropperImage">Сохранить</button>
            <button class="btn btn-alt-danger" @click.prevent="image = null">Отмена</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseModal from "@/components/BaseModal.vue"
import {computed, defineComponent, onMounted, reactive, ref} from "vue";
import {useOrderItemOperatorStore} from "@/stores/dashboard/order-item/operator";
import {required} from "@vuelidate/validators";
import VueSelect from "vue-select";
import useVuelidate from "@vuelidate/core";
import {useOrderItemTypeOperatorStore} from "@/stores/dashboard/order-item-type/operator";
import router from "@/router";
import {useOperatorPackagerStore} from "@/stores/dashboard/hanger/operator";
import {useCategoryStore} from "@/stores/dashboard/category/operator";
import BaseCamera from "@/components/BaseCamera.vue";
import VueCropper from "vue-cropperjs";
import axios from "axios";
import {useTagsStore} from "@/stores/dashboard/tags/operator";
import {useAdditionalProcessingStore} from "@/stores/dashboard/additional-processing/operator";
const modal = ref(null)
const storeOperatorOrderItem = useOrderItemOperatorStore()
const storeOperatorOrderItemType = useOrderItemTypeOperatorStore()
const storeCategory = useCategoryStore()
const storeAdditionalProcessing = useAdditionalProcessingStore()
const processing_list = computed(() => storeAdditionalProcessing.processing_list);
const types = computed(() => storeOperatorOrderItemType.orderItemTypes);
const categories_parent = computed(() => storeCategory.category_parent);
const categories_children = computed(() => storeCategory.category_child);
const category = computed(() => storeCategory.category);
const orderItem = computed(() => storeOperatorOrderItem.orderItem);
const cropper = ref(null);
const load = ref(false);
const storeHanger = useOperatorPackagerStore()
const hanger = computed(()=>storeHanger.hanger)
const offcanvas_height = ref(80)
const image = ref()
const cameraOpen = ref(false)
let state = reactive({
  images: "",
  name: "",
  description: "",
  code: "",
  order_id: "",
  additional_services_ids: [],
  additional_services: [],
  colors: [],
  defects: [],
  sex: [],
  tags: [],
  price_include_tariff_tax: true,
  category_parent: null,
  category_children: null,
  type_id: null
})
const rules = computed(() => {
  return {
    name: {required},
    description: {required},
    sex: {required},
    colors: {required},
    defects: {required},
    code: {required},
    category_parent: {required},
    category_children: {required},
    type_id: {required},
  };
});
const storeTags = useTagsStore()
const colors = computed(() => storeTags.tags_color);
const defects = computed(() => storeTags.tags_defects);
const sex = computed(() => storeTags.tags_sex);
const v$ = useVuelidate(rules, state, {$scope: false});
//submit
const submit = async () => {
  const result = await v$.value.$validate();
  if (!result) {
    return;
  }

  try {
    state.order_id = router.currentRoute.value.params.id
    state.type_id = state.type_id.id
    state.tags = []
    state.colors.map(el => state.tags.push({name: 'color', value: el.suggestion}))
    state.sex.map(el => state.tags.push({name: 'sex', value: el.suggestion}))
    state.defects.map(el => state.tags.push({name: 'defects', value: el.suggestion}))
    state.additional_services_ids = state.additional_services.map(el => el.id)
    await storeOperatorOrderItem.updateOrderItem(state)
    await storeOperatorOrderItem.updateOrderItemType({type_id: state.type_id, id: state.id})
    await storeOperatorOrderItem.getOrderItemsById(state.order_id)
    await modal.value.hide()
  } catch (e) {
    console.log(e)
  }
}
onMounted(() => {
  modal.value = new window.bootstrap.Modal('#update-order-item')
  document.getElementById('update-order-item').addEventListener('show.bs.modal', mountedModal)
})

const mountedModal = async (event) => {
  load.value = true
  let id = event.relatedTarget.dataset.bsId
  await storeAdditionalProcessing.getAdditionalProcessingList({})
  await storeOperatorOrderItem.getOrderItemById(id)
  await storeTags.getTagsColor({})
  await storeTags.getTagsDefects({})
  await storeTags.getTagsSex({})
  await storeCategory.getCategories()
  await storeCategory.getCategory(orderItem.value.type.category_id)
  if (category.value.parent_category_id) {
    state.category_children = category.value
    await storeCategory.getCategory(category.value.parent_category_id)
    state.category_parent = category.value
    await storeCategory.getCategoryChild({id: category.value.id})
  } else {
    state.category_parent = category.value
    await storeCategory.getCategoryChild({id: category.value.id})
    state.category_children = null
  }
  await storeOperatorOrderItemType.getOrderItemTypes()
  try {
    if (orderItem.value.hanger_id){
      await storeHanger.getHanger(orderItem.value.hanger_id)
    }
  }catch (e) {
    console.log(e)
  }

  state.id = orderItem.value.id
  state.images = orderItem.value.images
  state.name = orderItem.value.name
  state.price_include_tariff_tax = orderItem.value.price_include_tariff_tax
  state.description = orderItem.value.description
  state.code = orderItem.value.code
  state.category = category.value
  state.order_id = orderItem.value.order_id
  state.type_id = orderItem.value.type
  state.additional_services = orderItem.value.additional_services
  state.colors = orderItem.value.tags.filter(e => e.name === 'color').map(el=> {
    el.suggestion = el.value
    colors.value.map(element => {
      if (el.value === element.suggestion){
        el = element
      }
    })
    return el
  })
  state.defects = orderItem.value.tags.filter(e => e.name === 'defects').map(el=> {
    el.suggestion = el.value
    defects.value.map(element => {
      if (el.value === element.suggestion){
        el = element
      }
    })
    return el
  })
  state.sex = orderItem.value.tags.filter(e => e.name === 'sex').map(el=> {
    el.suggestion = el.value
    sex.value.map(element => {
      if (el.value === element.suggestion){
        el = element
      }
    })
    return el
  })
  load.value = false
}
const changeType = (query) => {
  state.type_id = null
  storeOperatorOrderItemType.getOrderItemTypes({categoryId: query.id})
}
const onSearchServices = (query) => {
  if (query){
    storeAdditionalProcessing.getAdditionalProcessingList({name: query})
  }else { storeAdditionalProcessing.getAdditionalProcessingList({}) }
}
const onSearchParent = async (query) => {
  if (query) {
    storeCategory.getCategoryParent({name: query})
  } else {
    storeCategory.getCategoryParent()
  }
}
const onSearchChildren = async (query) => {
  if (query) {
    storeCategory.getCategoryChild({name: query})
  } else {
    storeCategory.getCategoryChild()
  }
}
const changeCat = async (query) => {
  state.category_children = null
  await storeCategory.getCategoryChild({id: query.id})
}
const onSearch = async (query) => {
  if (query){
    storeOperatorOrderItemType.getOrderItemTypes({name: query})
  }else { storeOperatorOrderItemType.getOrderItemTypes() }
}
const deleteItemImage = async (item) => {
  try {
    await storeOperatorOrderItem.deleteItemImage({id: orderItem.value.id, imgId: item.id}, async () => {
      await storeOperatorOrderItem.getOrderItemById(orderItem.value.id)
      state.images = orderItem.value.images
    })
  }catch (e) {
    console.log(e)
  }
}

const uploadImage = async (file) => {
  image.value = URL.createObjectURL(file)
}
const uploadImageCamera = async (e) => {
  image.value = URL.createObjectURL(e.get('file'))
  cameraOpen.value = false
}
const cropperImage = async () => {
  cropper.value.getCroppedCanvas({
    width: 800,
    height: 800,
    minWidth: 300,
    minHeight: 300,
    maxWidth: 800,
    maxHeight: 800,
    fillColor: '#fff',
    imageSmoothingEnabled: true,
    imageSmoothingQuality: 'high',
  }).toBlob(async (blob) => {
    let file = new File([blob], "image.jpg", {type: blob.type,});
    image.value = null
    cameraOpen.value = null
    const formData = new FormData()
    formData.append('image', file)
    await axios.post('/api/v1/order-item/operator/' + orderItem.value.id + "/image", formData, {
      headers: {
        "Content-Type":" multipart/form-data"
      }
    })
    await storeOperatorOrderItem.getOrderItemById(orderItem.value.id)
    state.images = orderItem.value.images
  });
}

defineComponent({name: 'ModalUpdateOrderItem'})
</script>

<style lang="scss">
@import "vue-select/dist/vue-select.css";
@import "@/assets/scss/vendor/vue-select";
</style>
