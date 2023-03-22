<template>
  <BaseModal title="Карта" id="map" :fullscreen="true" :footer="false">
    <template #content>
      <div class="fs-sm" :class="{'hide-point': !!show}">
        <GoogleMap :streetViewControl="false" :zoomControl="false" :mapTypeControl="false" :fullscreenControl="false" api-key="AIzaSyA2MBPJPkVM4xX-yb33aIbXAxqx-KiUusA" ref="map"
                   style="width: 100%; height: calc(100vh - 50px)" :center="center" :zoom="15">
          <Marker v-if="show" :options="{ position: center }" />
        </GoogleMap>
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
    <template #footer>

    </template>
  </BaseModal>
</template>

<script setup>
import {computed, defineComponent, onMounted, ref, watch} from "vue";
import BaseModal from "@/components/BaseModal.vue";
import {GoogleMap, Marker} from "vue3-google-map";
import {useMapStore} from "@/stores/dashboard/map";
const index = ref(null)
const target = ref(null)
const BackId = ref(null)
const modal = ref(null)
const center = ref({lat: 40.689247, lng: -74.044502});
const map = ref(null)
const data = computed(() => mapStore.map)
const mapStore = useMapStore()
const show = ref(false)

watch(data, value => {
  if (value) {
    show.value = true
    center.value = {lat: value.latitude, lng: value.longitude}
  }else {
    show.value = false
  }
})

async function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  }
}

function initAutocomplete () {
  const maps = map.value.map
  const input = document.createElement("input");
  input.classList.add('form-control');
  input.classList.add('rounded-0');
  input.id = 'pac-input';
  input.placeholder = 'Поиск';
  const searchBox = new window.google.maps.places.SearchBox(input);
  maps.controls[window.google.maps.ControlPosition.TOP_LEFT] = []
  maps.controls[window.google.maps.ControlPosition.TOP_LEFT].push(input);
  maps.addListener("bounds_changed", () => {
    searchBox.setBounds(maps.getBounds());
  });
  let markers = [];

  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    if (places.length === 0) {
      return;
    }

    // Clear out the old markers.

    markers = [];

    // For each place, get the icon, name and location.
    const bounds = new window.google.maps.LatLngBounds();

    places.forEach((place) => {
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }

      const icon = {
        url: place.icon,
        size: new window.google.maps.Size(71, 71),
        origin: new window.google.maps.Point(0, 0),
        anchor: new window.google.maps.Point(17, 34),
        scaledSize: new window.google.maps.Size(25, 25),
      };

      // Create a marker for each place.
      markers.push(
          new window.google.maps.Marker({
            map,
            icon,
            title: place.name,
            position: place.geometry.location,
          })
      );

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    maps.fitBounds(bounds);
  });
}

function submit() {
  let data = {
    latitude: map.value.map.center.lat(),
    longitude: map.value.map.center.lng(),
    index: index.value,
  }
  mapStore.setMap(data)
  modal.value.hide()

}

function showPosition(position) {
  center.value.lat = position.coords.latitude
  center.value.lng = position.coords.longitude
}

onMounted(async () => {
  await getLocation()

  modal.value = new window.bootstrap.Modal('#map')
  document.getElementById('map').addEventListener('shown.bs.modal', async (event) => {
    if (!event.relatedTarget.dataset.bsMarker){
      initAutocomplete()
      index.value = event.relatedTarget.dataset.bsIndex
      target.value = event.relatedTarget.dataset.bsBack
      BackId.value = event.relatedTarget.dataset.bsBackId
    }
  })
})


defineComponent({
  name: 'ModalMap'
})
</script>

<style>
.mapdiv {
  position: relative;
}

.mapdiv:after {
  width: 22px;
  height: 40px;
  display: block;
  content: ' ';
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -40px 0 0 -11px;
  background: url('https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png');
  background-size: 22px 40px; /* Since I used the HiDPI marker version this compensates for the 2x size */
  pointer-events: none; /* This disables clicks on the marker. Not fully supported by all major browsers, though */
}
.hide-point .mapdiv:after{
  content: none;
}
.pac-container {
  z-index: 100000000000000000000;
}

</style>