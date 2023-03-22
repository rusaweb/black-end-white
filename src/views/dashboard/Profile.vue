<template>
  <BaseBackground
      image="/assets/image/profile.jpg"
      inner-class="bg-black-75"
  >
    <div class="content content-full text-center">
      <div class="my-3">
        <i class="fa fa-user fs-1 text-primary"></i>
      </div>
      <h1 class="h2 text-white ">{{ user?.display_name }}</h1>
      <template v-if="user?.roles.length">
        <p class="badge bg-secondary mb-0 me-1" v-for="(role, key) in user?.roles" :key="key">{{ role }}</p>
      </template>
    </div>
  </BaseBackground>
  <div class="content">
    <ProfileInfoBlock />
    <ProfileAddressBlock />
    <ProfileInfoAccountBlock />
  </div>
  <ModalYMap />
  <ModalCreateAddressProfile />
</template>

<script setup>
import {computed, defineComponent} from "vue";
import ProfileInfoBlock from "@/components/blocks/profile/InfoProfile.vue";
import ProfileInfoAccountBlock from "@/components/blocks/profile/InfoAccount.vue";
import ProfileAddressBlock from "@/components/blocks/profile/ProfileAddress.vue";
import {useUserStore} from "@/stores/dashboard/user/user";
// import ModalMap from "@/components/modals/Map.vue";
import ModalYMap from "@/components/modals/yMap.vue";
import ModalCreateAddressProfile from "@/components/modals/profile/CreateAddress.vue";

const storeUser = useUserStore()
const user = computed(() => {
  return storeUser.user
})

defineComponent({
  name: "ProfilePage"
})
</script>
