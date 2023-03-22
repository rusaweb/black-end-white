<template>
  <div class="row g-0 justify-content-center" v-if="!storeUser.sms_token && !storeUser.registration_id">
    <div class="col-sm-8 col-xl-4">
      <form @submit.prevent="onSubmit">
        <div class="mb-4">
          <input
              type="text"
              class="form-control form-control-lg form-control-alt py-3"
              id="login-username"
              name="login-username"
              placeholder="Номер телофона"
              :class="{
                        'is-invalid': v$.phone_number.$errors.length,
                      }"
              v-model="state.phone_number"
              @blur="v$.phone_number.$touch"
          />
          <div
              v-if="v$.phone_number.$errors.length"
              class="invalid-feedback animated fadeIn"
          >
            Пожалуйста, введите Ваш логин
          </div>
        </div>
        <div
            class="d-flex justify-content-between align-items-center mb-4"
        >
          <div></div>
          <button type="submit" class="btn btn-lg btn-alt-primary" :disabled="storeUser.loading">
            <i v-if="!storeUser.loading" class="fa fa-fw fa-sign-in-alt me-1 opacity-50"></i>
            <div v-else class="spinner-border spinner-border-sm btn-alt-primary me-1" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            Продолжить
          </button>
        </div>
      </form>
    </div>
  </div>
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
        Введите коректный номер телефона <br>чтобы подтвердить номер и перейти в адин панель
      </div>
    </div>
  </div>
</template>
<script setup>
import useVuelidate from "@vuelidate/core";
import {computed, defineComponent, onMounted, reactive, ref} from "vue";
import {required} from "@vuelidate/validators";
import {useLoginStore} from "@/stores/auth/login";

const storeUser = useLoginStore();
const toast = ref(null);
const state = reactive({
  phone_number: null
});

// Validation rules
const rules = computed(() => {
  return {
    phone_number: {
      required,
    },
  };
});
const v$ = useVuelidate(rules, state);
async function onSubmit() {
  const result = await v$.value.$validate();

  if (!result) {
    // notify user form is invalid
    return;
  }
  try {
    await storeUser.sendPhoneNumber(state)
  }catch (e) {
    toast.value.show()
  }
}
onMounted(() => {
  toast.value = new window.bootstrap.Toast(
      document.getElementById("toast-done")
  );
});
defineComponent({name: 'AuthSendPhoneNumber'})
</script>