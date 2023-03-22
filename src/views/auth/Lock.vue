<script setup>
import {reactive, computed, ref, onMounted} from "vue";
// Vuelidate, for more info and examples you can check out https://github.com/vuelidate/vuelidate
import useVuelidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import {useTemplateStore} from "../../stores/template";
import {useLoginStore} from "../../stores/auth/login";
const storeUser = useLoginStore()
// Main store and Router
const store = useTemplateStore();
const toast = ref(null);

// Initialize Bootstrap toasts on content load
onMounted(() => {
  toast.value = new window.bootstrap.Toast(
      document.getElementById("toast-done")
  );
});
// Input state variables
const state = reactive({
  username: 'Admin',
  password: null,
});

// Validation rules
const rules = computed(() => {
  return {
    password: {
      required,
      minLength: minLength(5),
    },
  };
});

// Use vuelidate
const v$ = useVuelidate(rules, state);

// On form submission
async function onSubmit() {
  const result = await v$.value.$validate();

  if (!result) {
    // notify user form is invalid
    return;
  }
  try {
    await storeUser.login({
      username: state.username,
      password: state.password,
    })
  }catch (e) {
    toast.value.show()
  }
  // Go to dashboard
}
</script>

<template>
  <!-- Page Content -->
  <BaseBackground image="/assets/media/photos/photo28@2x.jpg">
    <div class="row g-0 bg-primary-dark-op">
      <!-- Meta Info Section -->
      <div
        class="hero-static col-lg-4 d-none d-lg-flex flex-column justify-content-center"
      >
        <div class="p-4 p-xl-5 flex-grow-1 d-flex align-items-center">
          <div class="w-100">
            <RouterLink
              :to="{ name: 'lock' }"
              class="link-fx fw-semibold fs-2 text-white"
            >
              Black &<span class="fw-normal"> White</span>
            </RouterLink>
            <p class="text-white-75 me-xl-8 mt-2">
              Админ панель для работников компании <br>OOO “Black & White”
            </p>
          </div>
        </div>
        <div
          class="p-4 p-xl-5 d-xl-flex justify-content-between align-items-center fs-sm"
        >
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
            :to="{ name: 'lock' }"
            class="link-fx fw-semibold fs-3 text-dark"
          >
            Black &<span class="fw-normal">  White</span>
          </RouterLink>
        </div>
        <div class="p-4 w-100 flex-grow-1 d-flex align-items-center">
          <div class="w-100">
            <!-- Header -->
            <div class="text-center mb-5">
              <p class="mb-3">
                <i class="fa fa-2x fa-circle-notch text-primary-light"></i>
              </p>
              <h1 class="fw-bold mb-2">Учетная запись заблокирована</h1>
              <p class="fw-medium text-muted mb-0">
                Пожалуйста, введите пароль, чтобы разблокировать учетную запись
              </p>
              <p class="fw-medium text-muted mb-5">
                Если хотите войти в другую учетную запись <br> перейдите на страницу
                <a href="javascript:void(0)" @click.prevent="storeUser.logout({modal: false})"> "Войти"</a>
              </p>
              <i class="fa fa-user-circle display-1"></i>
              <p class="fw-semibold text-center my-2">{{ state.username }}</p>
            </div>
            <!-- END Header -->

            <!-- Unlock Form -->
            <div class="row g-0 justify-content-center">
              <div class="col-sm-8 col-xl-4">
                <form @submit.prevent="onSubmit">
                  <div class="mb-4">
                    <input
                      type="password"
                      class="form-control form-control-lg form-control-alt py-3"
                      id="lock-password"
                      name="lock-password"
                      placeholder="Пароль..."
                      :class="{
                        'is-invalid': v$.password.$errors.length,
                      }"
                      v-model="state.password"
                      @blur="v$.password.$touch"
                    />
                    <div
                      v-if="v$.password.$errors.length"
                      class="invalid-feedback animated fadeIn"
                    >
                      Пожалуйста введите пароль
                    </div>
                  </div>
                  <div class="text-center">
                    <button type="submit" class="btn btn-lg btn-secondary">
                      <i v-if="!storeUser.loading" class="fa fa-fw fa-lock-open me-1 opacity-50"></i>
                      <div v-else class="spinner-border spinner-border-sm btn-alt-primary me-1" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                      Разблокировать
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <!-- END Unlock Form -->
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
  <div class="position-fixed bottom-0 end-0 p-3 space-y-3" style="z-index: 9999">
    <div
        id="toast-done"
        class="toast fade hide"
        data-delay="4000"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
    >
      <div class="toast-header">
        <i class="fa-solid fa-user-minus text-danger me-2"></i>
        <strong class="me-auto">Ваши данные не совподает</strong>
        <button
            type="button"
            class="btn-close"
            data-bs-dismiss="toast"
            aria-label="Close"
        ></button>
      </div>
      <div class="toast-body">
        Введите верные данные пользователя <br> чтобы перейти в адин панель
      </div>
    </div>
  </div>
  <!-- END Page Content -->
</template>
