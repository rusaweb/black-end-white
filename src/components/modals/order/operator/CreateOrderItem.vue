<template>
  <BaseModal title="Добавить вещь" :modalLg="true" id="create-order-item">
    <template #content>
      <div class="block-content block-content-full">
        <div v-if="!load" class="row items-push">
          <div class="col-12">
            <label class="form-label">Изображение</label>
            <div class="row">
              <div class="col-md-2 col-4 mb-2" style="height: 100px;" v-for="(item, key) in imageResults" :key="key">
                <div class="h-100 position-relative border boder-1 d-flex justify-content-center align-items-center rounded overflow-hidden">
                  <img :src="item.url" class="w-100" alt="">
                  <div class="position-absolute bottom-0 end-0 bg-body-dark text-center px-1 rounded" style="cursor: pointer" @click="deleteItemImage(key)">
                    <i class="fa fa-trash text-danger"></i>
                  </div>
                </div>
              </div>
              <div
                  v-if="imageResults.length < 10"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasBottom"
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
                name="name"
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
                name="description"
                class="form-control"
                v-model="state.description"
                placeholder="Введите описание"
            >
<!--            <div-->
<!--                v-if="v$.description.$errors.length"-->
<!--                class="invalid-feedback animated fadeIn fs-xs"-->
<!--            >-->
<!--              Пожалуйста, введите описание-->
<!--            </div>-->
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
<!--            <div-->
<!--                v-if="v$.colors.$errors.length"-->
<!--                class="invalid-feedback animated fadeIn fs-xs"-->
<!--            >-->
<!--              Пожалуйста, выберите цвета-->
<!--            </div>-->
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
<!--            <div-->
<!--                v-if="v$.sex.$errors.length"-->
<!--                class="invalid-feedback animated fadeIn fs-xs"-->
<!--            >-->
<!--              Пожалуйста, выберите пол-->
<!--            </div>-->
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
<!--            <div-->
<!--                v-if="v$.defects.$errors.length"-->
<!--                class="invalid-feedback animated fadeIn fs-xs"-->
<!--            >-->
<!--              Пожалуйста, выберите дефекты-->
<!--            </div>-->
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
                placeholder="Введите код"
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
            <div class="input-group">
              <label class="form-label d-block w-100">Доп. обработка</label>
              <VueSelect
                  v-if="processing_list?.content"
                  v-model="state.additional_services_ids"
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
                :placeholder="`Выбирете тип`"
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
  <div class="offcanvas offcanvas-bottom shadow-lg" :style="`z-index: 9999999999; height: ${offcanvas_height}vh`" tabindex="-1" id="offcanvasBottom" aria-labelledby="offcanvasBottomLabel">
    <div class="offcanvas-header">
      <span class="d-block" style="width: 32px;"></span>
      <h5 class="offcanvas-title text-center text-black" id="offcanvasBottomLabel">Выберите способ</h5>
      <button type="button" class="btn-close" style="filter: none" data-bs-dismiss="offcanvas" aria-label="Close">
      </button>
    </div>
    <div class="offcanvas-body small">
      <div class="d-flex justify-content-center" v-if="!image && !cameraOpen">
        <label for="file-upload" class="btn btn-alt-secondary me-2">
          <i class="fa fa-file me-2"></i> Выбрать
        </label>
        <input id="file-upload" type="file" class="form-control d-none" @change="e => uploadImage(e.target.files[0])">
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
import {useCategoryStore} from "@/stores/dashboard/category/operator";
import {useBillingOperatorStore} from "@/stores/dashboard/order-billing/operator";
import VueCropper from "vue-cropperjs";
import BaseCamera from "@/components/BaseCamera.vue";
import {useTagsStore} from "@/stores/dashboard/tags/operator";
import {useAdditionalProcessingStore} from "@/stores/dashboard/additional-processing/operator";

const cropper = ref(null);

const modal = ref(null)
const offcanvas_height = ref(80)
const storeAdditionalProcessing = useAdditionalProcessingStore()
const storeOperatorOrderItem = useOrderItemOperatorStore()
const storeOperatorOrderItemType = useOrderItemTypeOperatorStore()
const storeCategory = useCategoryStore()
const storeBillingOperator = useBillingOperatorStore()
const storeTags = useTagsStore()
const types = computed(() => storeOperatorOrderItemType.orderItemTypes);
const colors = computed(() => storeTags.tags_color);
const defects = computed(() => storeTags.tags_defects);
const sex = computed(() => storeTags.tags_sex);
const categories_parent = computed(() => storeCategory.category_parent);
const categories_children = computed(() => storeCategory.category_child);
const processing_list = computed(() => storeAdditionalProcessing.processing_list);

let image = ref()
let imageResults = ref([])
const cameraOpen = ref(false)
const load = ref(false)


let state = reactive({
  name: "",
  description: "",
  code: "",
  order_id: "",
  category_parent: null,
  category_children: null,
  price_include_tariff_tax: true,
  additional_services_ids: [],
  colors: [],
  defects: [],
  sex: [],
  type_id: null,
  tags: []

})

const rules = computed(() => {
  return {
    name: {required},
    // description: {required},
    // sex: {required},
    // colors: {required},
    // defects: {required},
    code: {required},
    category_parent: {required},
    category_children: {required},
    type_id: {required},
  };
});
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
    state.colors.map(el => state.tags.push({name: 'color', value: el.suggestion}))
    state.sex.map(el => state.tags.push({name: 'sex', value: el.suggestion}))
    state.defects.map(el => state.tags.push({name: 'defects', value: el.suggestion}))
    state.additional_services_ids = state.additional_services_ids.map(el => el.id)
    await storeOperatorOrderItem.createOrderItem(state, imageResults.value)
    await storeOperatorOrderItem.getOrderItemsById(state.order_id)
    await storeBillingOperator.getBilling(router.currentRoute.value.params.id)
    state.name = ''
    state.description = ''
    state.code = ''
    state.order_id = ''
    state.category = null
    state.type_id = null
    image.value = null
    imageResults.value = []
    await modal.value.hide()
    cameraOpen.value = false
    v$.value.$reset()
  } catch (e) {
    console.log(e)
  }
}
onMounted(async () => {
  load.value = true
  await storeCategory.getCategoryParent({})
  modal.value = new window.bootstrap.Modal('#create-order-item')
  document.getElementById('create-order-item').addEventListener('shown.bs.modal', async () => {
    await storeAdditionalProcessing.getAdditionalProcessingList({})
    await storeTags.getTagsColor({})
    await storeTags.getTagsDefects({})
    await storeTags.getTagsSex({})
    await storeCategory.getCategories({})
    load.value = false
  })
})
const deleteItemImage = (key) => {
  imageResults.value.splice(key, 1)
}
const onSearchServices = (query) => {
  if (query){
    storeAdditionalProcessing.getAdditionalProcessingList({name: query})
  }else { storeAdditionalProcessing.getAdditionalProcessingList({}) }
}
const onSearch = (query) => {
  if (query){
    storeOperatorOrderItemType.getOrderItemTypes({name: query, categoryId: state.category.id})
  }else { storeOperatorOrderItemType.getOrderItemTypes({categoryId: state.category.id}) }
}
const changeType = (query) => {
    storeOperatorOrderItemType.getOrderItemTypes({categoryId: query.id})
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
  }).toBlob((blob) => {
    let file = new File([blob], "image.jpg", {type: blob.type,});
    imageResults.value.push({url: URL.createObjectURL(blob), file})
    image.value = null
    cameraOpen.value = null
  });
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
defineComponent({name: 'ModalCreateOrderItem'})
</script>

<style lang="scss">
@import "vue-select/dist/vue-select.css";
@import "@/assets/scss/vendor/vue-select";
@import "dropzone/dist/dropzone.css";
@import "@/assets/scss/vendor/dropzone";
@import "cropperjs/dist/cropper.css";
</style>
