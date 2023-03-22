<template>
  <BaseModal title="Карта" id="map"
             :fullscreen="true"
             :footer="false">
    <template #content>
      <div class="fs-sm" :class="{'hide-point': !!show}">
        <YandexMap
            ref="ymaps"
            :coordinates="coordinates"
            @click="onClick">
          <YandexMarker
              :coordinates="coordinates"
              :marker-id="123"
          />
        </YandexMap>
      </div>
      <div class="position-absolute bottom-0 end-0 bg-body-light p-3">
        <button
            type="button"
            class="btn btn-sm btn-success me-1"
            @click="submit"
            :data-bs-target="target"
            :data-bs-id="BackId"
            data-bs-toggle="modal"
            v-if="!show"
        >
          Сохранить
        </button>
        <button
            type="button"
            class="btn btn-sm btn-alt-secondary"
            data-bs-dismiss="modal"
            @click="show = false"
        >
          Закрыть
        </button>
      </div>
    </template>
    <template #footer></template>
  </BaseModal>
</template>

<script setup>
import {defineComponent, onMounted, ref, watch} from 'vue';
import BaseModal from "@/components/BaseModal.vue";

import { useYMapStore } from "@/stores/dashboard/yMap";
import {storeToRefs} from "pinia";
const useYmapStore = useYMapStore()
const { yMap } = storeToRefs(useYmapStore)

const coordinates = ref([41.311158, 69.279737]);
const show = ref(false);
const target = ref(null)
const BackId = ref(null)
const modal = ref(null)
const ymaps = ref(null)
const index = ref(null)
// ===  show position coordinates ===
function showPosition(position) {
  coordinates.value[0] = position.coords.latitude
  coordinates.value[1] = position.coords.longitude
}

watch(yMap, value => {
  if (value) {
    show.value = true
    coordinates.value = [ value.latitude, value.longitude ]
  }else {
    show.value = false
  }
})

async function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  }
}

//  === select coordinates ===
const onClick = (e) => {
  coordinates.value = e.get('coords')
};

function submit() {
  let data = {
    latitude: coordinates.value[0],
    longitude: coordinates.value[1],
    index: index.value,
  }
  useYmapStore.setYMap(data)
  modal.value.hide()
}


//  === onMounted ===
onMounted(async function () {
  await getLocation()

  modal.value = new window.bootstrap.Modal('#map')
  document.getElementById('map').addEventListener('shown.bs.modal', async (event) => {
    if (!event.relatedTarget.dataset.bsMarker) {
      index.value = event.relatedTarget.dataset.bsIndex
      target.value = event.relatedTarget.dataset.bsBack
      BackId.value = event.relatedTarget.dataset.bsBackId
    }
  })
})
defineComponent({
  name: 'ModalYMap'
})
</script>

<style>
.yandex-container {
  height: calc(100vh - 50px);
}

.yandex-balloon {
  height: 200px;
  width: 200px;
}
</style>