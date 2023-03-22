<script setup>
import {useTemplateStore} from "@/stores/template";
import AuthSendPhoneNumber from "@/components/auth/SendPhoneNumber.vue";
import AuthSendSmsCode from "@/components/auth/SendSmsCode.vue";
import AuthRegistration from "@/components/auth/Registration.vue";

const store = useTemplateStore();
</script>

<template>
  <!-- Page Content -->
  <BaseBackground image="/assets/media/photos/photo1@2x.jpg">
    <div class="row g-0 bg-primary-dark-op">
      <!-- Meta Info Section -->
      <div
          class="hero-static col-lg-4 d-none d-lg-flex flex-column justify-content-center"
      >
        <div class="p-4 p-xl-5 flex-grow-1 d-flex align-items-center">
          <div class="w-100">
            <RouterLink
                :to="{ name: 'login' }"
                class="link-fx fw-semibold fs-2 text-white"
            >
              <img class="icon-logo" width="160" src="/assets/image/logo-white.svg" alt="">
            </RouterLink>
            <p class="text-white-75 me-xl-8 mt-2">
              Добро пожаловать! Это приложение служит для управления сайта <a href="https://black-end-white.uz/" target="_blank">Black & White</a>
            </p>
          </div>
        </div>
        <div class="p-4 p-xl-5 d-xl-flex justify-content-between align-items-center fs-sm">
          <p class="fw-medium text-white-50 mb-0">
            <strong>{{ store.app.name + " " + store.app.version }}</strong>
            &copy; {{ store.app.copyright }}
          </p>
        </div>
      </div>
      <!-- END Meta Info Section -->

      <!-- Main Section -->
      <div
          class="hero-static col-lg-8 d-flex flex-column align-items-center bg-body-extra-light"
      >
        <div class="p-3 w-100 d-lg-none text-center">
          <RouterLink
              :to="{ name: 'login' }"
              class="link-fx fw-semibold fs-3 text-dark"
          >
            <img class="icon-logo" width="160" src="/assets/image/logo-white.svg" alt="">
          </RouterLink>
        </div>
        <div class="p-4 w-100 flex-grow-1 d-flex align-items-center">
          <div class="w-100">
            <!-- Header -->
            <div class="text-center mb-5">
              <p class="mb-3">
                <i class="fa fa-circle-notch text-primary-light display-3"></i>
              </p>
              <h1 class="fw-bold mb-2">Авторизация</h1>
              <p class="fw-medium text-muted">
                Добро пожаловать! <br> Пожалуйста, войдите под своей учетной записью.
              </p>
            </div>
            <!-- END Header -->

            <!-- Sign In Form -->
            <AuthSendPhoneNumber />
            <AuthSendSmsCode />
            <AuthRegistration />
            <!-- END Sign In Form -->
          </div>
        </div>
        <div
            class="px-4 py-3 w-100 d-lg-none d-flex flex-column flex-sm-row justify-content-between fs-sm text-center text-sm-start"
        >
          <p class="fw-medium py-2 mb-0">
            <strong>{{ store.app.name + " " + store.app.version }}</strong>
            &copy; {{ store.app.copyright }}
          </p>
        </div>
      </div>
      <!-- END Main Section -->
    </div>
  </BaseBackground>
  <!-- END Page Content -->
</template>
