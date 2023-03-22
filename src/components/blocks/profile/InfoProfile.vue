<template>
  <BaseBlock title="Информация о профиле">
    <form action="" class="form-block items-push row">
      <div class="col-lg-6 fw-normal">
        <label for="name" class="form-label">Имя</label>
        <input
            type="text"
            id="name"
            class="form-control"
            placeholder="Введите ваше имя"
            v-model="state.display_name"
            :class="{ 'is-invalid': v$.display_name.$errors.length}"
            @blur="v$.display_name.$touch"
        >
        <div
            v-if="v$.display_name.$errors.length"
            class="invalid-feedback animated fadeIn fs-xs"
        >
          Пожалуйста, введите ваше имя
        </div>
      </div>

      <div class="col-lg-6 fw-normal">
        <label for="birthday" class="form-label">День рождения</label>
        <input
            type="date"
            id="birthday"
            class="form-control"
            v-model="state.birthday"
        >
      </div>
      <div class="col-12 fw-normal d-flex">
        <button class="btn ms-auto btn-primary" @click.prevent="submit">Сохранить</button>
      </div>
    </form>
  </BaseBlock>
</template>

<script setup>
import {computed, defineComponent, onMounted, reactive, watch} from "vue";
import {minLength, required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import {useUserStore} from "@/stores/dashboard/user/user";

const storeUser = useUserStore()

let state = reactive({
  display_name: "",
  birthday: "",
})
const rules = computed(() => {
  return {
    display_name: {required, minLength: minLength(3)},
  };
});
const v$ = useVuelidate(rules, state);

const submit = async () => {
  const result = await v$.value.$validate();
  if (!result) {
    return;
  }
  try {
    await storeUser.updateProfileData(state)
  } catch (e) {
    console.log(e)
  }
}
const user = computed(() => {
  return storeUser.user
})

onMounted(() => {
  if (user.value) {
    const {display_name, phone_number, birthday} = user.value
    state.display_name = display_name
    state.phone_number = phone_number
    state.birthday = birthday
  }
})

watch(user, (value) => {
  if  (value) {
    const {display_name, phone_number, birthday} = value
    state.display_name = display_name
    state.phone_number = phone_number
    state.birthday = birthday
  }
})

defineComponent({name: 'ProfileInfoBlock'})
</script>