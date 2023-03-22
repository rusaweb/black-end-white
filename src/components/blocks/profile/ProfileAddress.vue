<template>
  <BaseBlock title="Мои адреса" v-if="user">
    <template #options>
      <button
          class="btn btn-block-option"
          data-bs-target="#create-address"
          data-bs-toggle="modal"
      >
        <i class="fa fa-plus me-1"></i> Добавить
      </button>
    </template>
    <template #content>
      <div class="block-content block-content-full" v-if="user.addresses.length">
        <ul class="list-group">
          <li class="list-group-item" v-for="item in user.addresses" :key="item.id">
            <p class="fw-bold"><span class="fw-normal me-1">Адресс: </span>{{ item.address_line }}</p>
            <p class="fw-bold"><span class="fw-normal me-1">Ориентир: </span>{{ item.reference_point }}</p>
            <button
                class="btn btn-alt-primary"
                data-bs-target="#map"
                data-bs-toggle="modal"
                data-bs-marker="1"
                @click.prevent="storeMap.setYMap(item.location)"
            >
              Посмотреть на карте
            </button>
            <span class="position-absolute top-0 end-0 m-2">
              <button class="btn btn-danger" @click.prevent="deleteAddress(item.id)">
                <i class="fa fa-trash"></i>
              </button>
            </span>
          </li>
        </ul>
      </div>
      <div class="block-content block-content-full" v-else>
        <div class="form-control text-center p-5">
          <h4>Список адресов пуст</h4>
          <button
              class="btn btn-sm btn-alt-primary mt-3"
              data-bs-target="#create-address"
              data-bs-toggle="modal"
          >
            <i class="fa fa-plus me-1"></i> Добавить
          </button>
        </div>
      </div>
    </template>
  </BaseBlock>
</template>

<script setup>
import {computed, defineComponent} from "vue";
import {useUserStore} from "@/stores/dashboard/user/user";
// import {useMapStore} from "@/stores/dashboard/map";
import { useYMapStore } from "@/stores/dashboard/yMap";

const userStore = useUserStore()
const storeMap = useYMapStore()

const user = computed(() => userStore.user)

const deleteAddress = async (id) => {
  try {
    await userStore.deleteAddress(id)
  }catch (e) {
    console.log(e)
  }
}

defineComponent({name: 'ProfileAddressBlock'})
</script>