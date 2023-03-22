<template>
  <BasePageHeading
      title="Упоковщик"
      subtitle="На этой странице можно отсканировать вещь"
  />
  <div class="content">
    <div class="alert alert-danger d-flex justify-content-center align-items-center"
         v-if="error.status">
      <i class="fa fa-ban h5 mb-0 me-3"></i>
      <h5 class="mb-0 d-inline-flex">{{ error.message }}</h5>
    </div>
    <BaseBlock>
      <template #content>
        <div class="block-content block-content-full d-flex flex-column justify-content-center align-items-center text-center">
          <h1 class="text-center">Сканировать вещь</h1>
          <h5 class="text-center" v-if="scan === null">Нажмите на кнопку и отскарируйте бар код вещи чтобы <br> получить информацию или поменять статус чистки</h5>
          <h5 class="text-center" v-else>Напишите или отсканируйте бар код вещи чтобы <br> получить информацию или поменять статус чистки</h5>
          <button v-if="scan === null" @click="scanBtn" class="btn btn-light text-center px-5 w-25"><i class="fa fa-barcode display-1"></i></button>
          <form v-else @submit.prevent="submit">
            <div class="input-group mb-5 mt-2">
              <input ref="input" v-model="scan" type="text" class="form-control">
              <button type="submit" class="btn btn-success"><span v-if="!loading">Найти</span> <i v-if="loading" class="fa-solid fa-spinner"></i></button>
            </div>
          </form>
        </div>
      </template>
    </BaseBlock>
  </div>
</template>
<script setup>
import {defineComponent, nextTick, ref} from "vue";
import router from "@/router";
import {useOrderItemPackagerStore} from "@/stores/dashboard/order-item/packager";
const scan = ref(null)
const input = ref(null)
const storePackager = useOrderItemPackagerStore()
const loading = ref(false)
const error = ref({
  message: '',
  status: false,
})
const scanBtn = () => {
  scan.value = ''
  nextTick(() => {
    input.value.focus()
  })
}
const submit = async () => {
  if (!scan.value){
    return
  }
  loading.value = true
  try {
    await storePackager.getOrderItemByCode(scan.value)
    if (storePackager.orderItem.id) {
      await router.push({name: 'packager-order', params: {id: storePackager.orderItem.id}})
    }
  }catch (e) {
    if (e.status === 404) {
      error.value.status = e.status
      error.value.message = 'Такая вещь не существует'
    }
    setTimeout(() => {
      error.value.status = false
      error.value.message = ''
    }, 3000)
  }finally {
    loading.value = false
  }
}
defineComponent({name: 'PackagerScanPage'})
</script>