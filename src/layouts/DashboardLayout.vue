<script setup>
import {useTemplateStore} from "@/stores/template";

import BaseLayout from "@/layouts/BaseLayout.vue";
import BaseNavigation from "@/components/BaseNavigation.vue";
import {useLoginStore} from "@/stores/auth/login";
import menu from '../data/menu'
import {useUserStore} from "@/stores/dashboard/user/user";
import {computed} from "vue";
// Main store
const store = useTemplateStore();
const storeLogin = useLoginStore()
const storeUser = useUserStore()
if (!storeUser.user){
  storeUser.getUser()
}
const user = computed(() => storeUser.user)
// Set default elements for this layout
store.setLayout({
  header: true,
  sidebar: true,
  sideOverlay: false,
  footer: true,
});

// Set various template options for this layout variation
store.headerStyle({mode: "light"});
store.mainContent({mode: "narrow"});
const menus = computed(() => {
  let res = []
  if (user.value && menu){
    res =  menu.main.filter(e => e.roles?.map(role => user.value.roles.includes(role)).includes(true))
  }
  return res
})
</script>

<template>
  <BaseLayout>
    <!-- Side Overlay Content -->
    <!-- Using the available v-slot, we can override the default Side Overlay content from layouts/partials/SideOvelay.vue -->
    <template #side-overlay-content>
      <div class="content-side">
        <p>Side Overlay content..</p>
      </div>
    </template>
    <!-- END Side Overlay Content -->

    <!-- Sidebar Content -->
    <!-- Using the available v-slot, we can override the default Sidebar content from layouts/partials/Sidebar.vue -->
    <template #sidebar-content>
      <div class="content-side">
        <BaseNavigation
            :nodes="menus"
        />
      </div>
    </template>
    <!-- END Sidebar Content -->

    <!-- Header Content Left -->
    <!-- Using the available v-slot, we can override the default Header content from layouts/partials/Header.vue -->
    <template #header-content-left>
      <!-- Toggle Sidebar -->
      <button
          type="button"
          class="btn btn-sm btn-alt-secondary me-2 d-lg-none"
          @click="store.sidebar({ mode: 'toggle' })"
      >
        <i class="fa fa-fw fa-bars"></i>
      </button>
      <!-- END Toggle Sidebar -->

      <!-- Toggle Mini Sidebar -->
      <button
          type="button"
          class="btn btn-sm btn-alt-secondary me-2 d-none d-lg-inline-block"
          @click="store.sidebarMini({ mode: 'toggle' })"
      >
        <i class="fa fa-fw fa-ellipsis-v"></i>
      </button>
      <!-- END Toggle Mini Sidebar -->
    </template>
    <!-- END Header Content Left -->

    <!-- Header Content Right -->
    <!-- Using the available v-slot, we can override the default Header content from layouts/partials/Header.vue -->
    <template #header-content-right>
      <!-- Toggle Side Overlay -->
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
                :to="{ name: 'profile' }"
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

      <!-- END Toggle Side Overlay -->
    </template>
    <!-- END Header Content Right -->

    <!-- Footer Content Left -->
    <!-- Using the available v-slot, we can override the default Footer content from layouts/partials/Footer.vue -->
    <template #footer-content-left>
      <strong>{{ store.app.name }}</strong>
      &copy; {{ store.app.copyright }}
    </template>
    <!-- END Footer Content Left -->
  </BaseLayout>
</template>
