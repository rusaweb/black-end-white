<template>
  <BaseBlock title="Информация об аккунте" v-if="user">
    <form class="form-block items-push row">
      <div class="list-group">
        <div class="list-group-item d-flex justify-content-between">
          <div class="col-lg-6">
            <label for="username" class="form-label">Удалить профиль</label>
          </div>
          <div class="col-lg-6">
            <button
                class="btn me-2 btn-danger"
                @click.prevent="deleteUser(user.id)"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    </form>
  </BaseBlock>
</template>

<script setup>
import {computed, defineComponent} from "vue";
import {useUserStore} from "@/stores/dashboard/user/user";

const storeUser = useUserStore()

const user = computed(() => {
  return storeUser.user
})

const deleteUser = async (id) => {
  try {
    await storeUser.deleteProfile(id)
  } catch (e) {
    console.log(e)
  }
}

defineComponent({name: 'ProfileInfoAccountBlock'})
</script>