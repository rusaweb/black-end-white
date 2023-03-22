<template>
  <BaseModal title="Добавить акксессуар" id="create-accessory">
    <template #content>
      <div class="block-content block-content-full">
        <div v-if="!load" class="row items-push">
          <div class="col-12">
            <label class="form-label">Изображение</label>
            <div class="row">
              <div class="col-md-3 col-4 mb-2" style="height: 100px;" v-for="(item, key) in imageResults" :key="key">
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
                  class="col-md-3 col-4 mb-2"
                  style="height: 100px;"
              >
                <div class="h-100 border boder-1 d-flex justify-content-center align-items-center rounded overflow-hidden"><i class="fa fa-plus fa-xl"></i></div>
              </div>
            </div>
          </div>
          <div class="col-12">
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
          <div class="col-12">
            <label class="form-label">Описание</label>
            <textarea
                type="text"
                class="form-control"
                v-model="state.description"
                placeholder="Введите название"
                :class="{ 'is-invalid': v$.description.$errors.length}"
                @blur="v$.description.$touch"
            />
            <div
                v-if="v$.description.$errors.length"
                class="invalid-feedback animated fadeIn fs-xs"
            >
              Пожалуйста, введите описание
            </div>
          </div>
          <div class="col-12">
            <label class="form-label d-block">Цена</label>
            <div class="input-group">
              <input
                  type="text"
                  class="form-control"
                  v-model="state.price.amount"
                  placeholder="Введите цену"
                  :class="{ 'is-invalid': v$.price.amount.$errors.length}"
                  @blur="v$.price.amount.$touch"
              >
              <div class="input-group-text">Сум</div>
            </div>
            <div
                v-if="v$.price.amount.$errors.length"
                class="invalid-feedback animated fadeIn fs-xs"
            >
              Пожалуйста, введите цену
            </div>
          </div>
        </div>
        <div v-else class="w-100 d-flex justify-content-center py-5">
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
import {required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import router from "@/router";
import {useAccessoryAdministratorStore} from "@/stores/dashboard/accessory/administrator";
import VueCropper from "vue-cropperjs";
import BaseCamera from "@/components/BaseCamera.vue";

const modal = ref(null)
const storeAccessory = useAccessoryAdministratorStore()
const load = ref(false);
const cropper = ref(null);
const offcanvas_height = ref(80)
let image = ref()
let imageResults = ref([])
const cameraOpen = ref(false)

let state = reactive({
  name: "",
  description: "",
  price: {
    amount: null,
    currency: "UZS"
  }
})
const rules = computed(() => {
  return {
    name: {required},
    description: {required},
    price: {
      amount: {required}
    },
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
    await storeAccessory.createAccessory(state, imageResults.value)
    await storeAccessory.getAccessories(router.currentRoute.value.query)
    imageResults.value = []
    state.name = ''
    state.description = ''
    state.price = {
      amount: null,
    }
    v$.value.$reset()
    await modal.value.hide()
  } catch (e) {
    console.log(e)
  }
}
onMounted(() => {
  modal.value = new window.bootstrap.Modal('#create-accessory')
})
const deleteItemImage = (key) => {
  imageResults.value.splice(key, 1)
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
defineComponent({name: 'ModalCreateAccessory'})
</script>
<style lang="scss">
@import "dropzone/dist/dropzone.css";
@import "@/assets/scss/vendor/dropzone";
@import "cropperjs/dist/cropper.css";
</style>
