<template>
  <BaseModal title="Добавить категорию" id="create-category">
    <template #content>
      <div class="block-content block-content-full">
        <div class="row items-push">
          <div class="col-12">
            <label for="name" class="form-label">Иконка</label>
            <input
                v-if="!state.icon"
                type="file"
                class="form-control"
                accept=".jpg, .jpeg, .png, .svg"
                @change="e => uploadIcon(e.target.files[0])"
            >
            <div v-else style="width: 200px;" class="position-relative bg-body rounded p-4">
              <img v-lazy="state.icon.url" class="w-100" alt="">
              <button class="btn btn-sm btn-alt-danger position-absolute bottom-0 end-0" @click.prevent="deleteIcon"><i class="fa fa-trash"></i></button>
            </div>
          </div>
          <div v-if="image" class="col-12 col-xl-6">
            <p class="form-label border-bottom pb-2">Выберите размер</p>
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
          <div v-if="image" class="col-12 col-xl-6">
            <p class="form-label border-bottom pb-2">Результат</p>
            <div class="overflow-hidden mb-4">
              <div
                  class="js-img-cropper-preview mx-auto overflow-hidden"
                  style="height: 200px"
              ></div>
            </div>
          </div>
          <div v-if="image" class="col-12"></div>
          <div v-if="image" class="col-12">
            <div class="btn-group mt-2">
              <button class="btn btn-alt-secondary" @click.prevent="cropperImage">Сохранить</button>
              <button class="btn btn-alt-danger" @click.prevent="image = null">Отмена</button>
            </div>
          </div>
          <div class="col-12">
            <label for="name" class="form-label">Название</label>
            <input
                type="text"
                class="form-control"
                placeholder="Введите название"
                v-model="state.name"
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
          <div class="col-12" v-if="state.cat">
            <label for="name" class="form-label">Категория</label>
            <VueSelect
                v-if="categories?.content"
                v-model="state.parent_category"
                :options="categories.content"
                label="name"
                class="form-control p-0 text-secondary"
                placeholder="Укажите клиента"
                @search="onSearch"
                :filterable="false"
            >
              <template #no-options>
                <div style="opacity: 0.8">Такого клиента нет</div>
              </template>
            </VueSelect>
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
</template>

<script setup>
import BaseModal from "@/components/BaseModal.vue"
import {computed, defineComponent, onMounted, reactive, ref} from "vue";
import {required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import router from "@/router";
import {useCategoryStore} from "@/stores/dashboard/category/administrator";
import VueSelect from "vue-select";
import VueCropper from "vue-cropperjs";
const modal = ref(null)
const storeCategory = useCategoryStore()
const categories = computed(() => storeCategory.categories)
const emit = defineEmits(['created'])
const image = ref(null)
let state = reactive({
  name: "",
  parent_category: null,
  parent_category_id: null,
  icon: null,
  cat: true
})
const rules = computed(() => {
  return {
    name: {required}
  };
});
const v$ = useVuelidate(rules, state, {$scope: false});
//submit
const submit = async () => {
  const result = await v$.value.$validate();
  if (!result) {
    return;
  }
  const formData = new FormData()
  try {
    if (!state.parent_category_id){
      state.parent_category_id = state.parent_category?.id
    }
    await storeCategory.createCategory(state)
    formData.append('id', storeCategory.category.id)
    formData.append('image', state.image)
    await storeCategory.uploadIcon(formData, () => {})
    state.name = ''
    state.image = null
    v$.value.$reset()
    await modal.value.hide()
    emit('created')
  } catch (e) {
    console.log(e)
  }
}
const uploadIcon = async (file) => {
  image.value = URL.createObjectURL(file)
}

const cropper = ref(null);
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
    state.image = new File([blob], "image.jpg", {type: blob.type,})
    state.icon = {url: URL.createObjectURL(state.image)}
    image.value = null
  });
}
const deleteIcon = async () => {
  state.icon = null
}

const onSearch = async (query) => {
  if (query) {
    await storeCategory.getCategories({name: query})
  } else {
    await storeCategory.getCategories()
  }
}
onMounted(() => {
  modal.value = new window.bootstrap.Modal('#create-category')
  document.getElementById('create-category').addEventListener('shown.bs.modal', async (event) => {
    const parentId = event.relatedTarget.dataset.bsParent
    if (parentId){
      state.parent_category_id = parentId
      state.cat = false
    }else {
      await storeCategory.getCategories(router.currentRoute.value.query)
      state.cat = true
    }
  })
})
defineComponent({name: 'ModalCreateCategory'})
</script>
<style lang="scss">
@import "vue-select/dist/vue-select.css";
@import "@/assets/scss/vendor/vue-select";
@import "cropperjs/dist/cropper.css";
</style>