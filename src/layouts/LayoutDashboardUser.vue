<script setup>
import {computed} from "vue";
import { useTemplateStore } from "@/stores/template";

import BaseLayout from "@/layouts/BaseLayout.vue";

// Grab example data

// Grab menu navigation arrays
import {useLoginStore} from "@/stores/auth/login";
import {useUserStore} from "@/stores/dashboard/user/user";

// Main store
const store = useTemplateStore();
const storeLogin = useLoginStore()
const storeUser = useUserStore()

if (!storeUser.user){
  storeUser.getUser()
}
const user = computed(() => storeUser.user)
// Reactive variables
store.setLayout({
  header: true,
  sidebar: false,
  sideOverlay: false,
  footer: true,
});

// Set various template options for this layout variation
store.headerStyle({ mode: "dark" });
store.mainContent({ mode: "boxed" });
</script>

<template>
  <BaseLayout>
    <!-- Header Content -->
    <!-- Using the available v-slot, we can override the default Header content from layouts/partials/Header.vue -->
    <template #header-content>
      <!-- Left Section -->
      <div class="d-flex align-items-center">
        <!-- Logo -->
        <RouterLink
            :to="{ name: 'user' }"
            class="fw-semibold fs-5 tracking-wider text-dual me-3"
            style="width: 100px;"
        >
          <img style="width: 100%;" src="/assets/image/logo-white.svg" alt="">
        </RouterLink>
        <!-- END Logo -->

      </div>
      <div class="d-flex align-items-center">

        <!-- User Dropdown -->
        <div class="dropdown d-inline-block ms-2">
          <button
              type="button"
              class="btn btn-sm btn-alt-secondary d-flex align-items-center"
              id="page-header-user-dropdown"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
          >
            <template v-if="user">
              <i class="fa fa-user"></i>
              <span class="d-none d-sm-inline-block ms-2">{{ user.display_name }}</span>
              <i class="fa fa-fw fa-angle-down d-none d-sm-inline-block opacity-50 ms-1 mt-1"></i>
            </template>
            <template v-if="storeUser.loading">
              <span class="spinner-border spinner-border-sm text-dark"></span>
            </template>
          </button>
          <div
              class="dropdown-menu dropdown-menu-md dropdown-menu-end p-0 border-0"
              aria-labelledby="page-header-user-dropdown"
              v-if="user"
          >
            <div class="p-3 text-center bg-body-light border-bottom rounded-top">
              <i class="fa fa-user"></i>
              <p class="mt-2 mb-0 fw-medium">{{ user.display_name }}</p>
              <p class="badge bg-secondary mb-0 me-1" v-for="(role, key) in user.roles" :key="key">{{ role }}</p>
            </div>
            <div class="p-2">
              <RouterLink
                  :to="{ name: 'profile-user' }"
                  class="dropdown-item d-flex align-items-center justify-content-between"
              >
                <span class="fs-sm fw-medium">Профиль</span>
              </RouterLink>
            </div>
            <div role="separator" class="dropdown-divider m-0"></div>
            <div class="p-2">
              <a
                  href="javascript:void(0)"
                  @click.prevent="storeLogin.logout()"
                  class="dropdown-item d-flex align-items-center justify-content-between"
              >
                <span class="fs-sm fw-medium">Выйти из аккаунта</span>
              </a>
            </div>
          </div>
        </div>

        <!-- END User Dropdown -->
      </div>
      <!-- END Right Section -->
    </template>
    <!-- END Header Content -->

    <!-- Page Top Content -->
    <!-- Using the available v-slot, we can override the default Page Top Content from layouts/BaseLayout.vue -->

    <!-- END Page Top Content -->
  </BaseLayout>
</template>
