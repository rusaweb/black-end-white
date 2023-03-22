<template>
  <div class="camera">
    <button type="button" @click="close" class="btn-close" style="filter: none"></button>
    <Camera ref="camera" :resolution="{width: 800, height: 600}" autoplay></Camera>
    <button class="btn camera-btn btn-primary" @click="snapshot"><i class="fa fa-camera"></i></button>
  </div>
</template>
<script lang="ts" setup>
import Camera from "simple-vue-camera";
import {defineComponent, ref} from "vue";
const emit = defineEmits(['done', 'close'])


// Get a reference of the component
const camera = ref();

// Use camera reference to call functions
const close = async () => {
  emit('close')
}

// Use camera reference to call functions
const snapshot = async () => {
  const blob = await camera.value?.snapshot();
  const formData = new FormData()
  formData.append('file', blob)

  // To show the screenshot with an image tag, create a url
  const url = URL.createObjectURL(blob);
  formData.append('url', url)
  emit('done', formData)
}

defineComponent({name: 'BaseCamera'});
</script>
<style lang="scss" scoped>
.camera{
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100000000000000000000;
  background: #fff;

}
.camera-btn{
  position: absolute;
  top: 50%;
  right: 0;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  transform: translateY(-50%);
  font-size: 40px;
  z-index: 100000000000000000001;
}
.btn-close{
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 100000000000000000002;
}
@media (max-width: 991.98px) {
  .camera-btn{
    top: 100%;
    right: 0;
    left: 50%;
    transform: translateY(-100%) translateX(-50%);
  }
}
</style>