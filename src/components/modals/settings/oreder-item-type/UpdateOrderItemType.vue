<template>
  <BaseModal title="Редактировать тип" id="update-order-item-type">
    <template #content>
      <div class="block-content block-content-full">
        <div v-if="!load" class="row items-push">
          <div class="col-12">
            <label class="form-label">Название</label>
            <input
                type="text"
                class="form-control"
                v-model="state.name"
                placeholder="Введите название"
                :class="{ 'is-invalid': v$.name.$errors.length}"
                @blur="v$.name.$touch"
            >
            <div
                v-if="v$.name.$errors.length"
                class="invalid-feedback animated fadeIn fs-xs"
            >
              Пожалуйста, введите название
            </div>
          </div>
          <div class="col-12">
            <label class="form-label d-block">Цена</label>
            <div class="input-group">
              <input
                  type="text"
                  class="form-control"
                  v-model="state.price.amount"
                  placeholder="Введите цену"
                  :class="{ 'is-invalid': v$.price.amount.$errors.length}"
                  @blur="v$.price.amount.$touch"
              >
              <div class="input-group-text">{{ state.price.currency }}</div>
              <div
                  v-if="v$.price.amount.$errors.length"
                  class="invalid-feedback animated fadeIn fs-xs"
              >
                Пожалуйста, введите цену
              </div>
            </div>

          </div>
          <div class="col-12">
            <div class="input-group">
              <label class="form-label d-block w-100">Категория</label>
              <VueSelect
                  v-if="categories_parent?.content"
                  v-model="state.category_parent"
                  :options="categories_parent.content"
                  label="name"
                  value="id"
                  class="form-control p-0 text-secondary  w-100"
                  placeholder="Выбирете категорию"
                  @search="onSearchParent"
                  :class="{ 'is-invalid': v$.category_parent.$errors.length}"
                  @blur="v$.category_parent.$touch"
                  :filterable="false"
                  @option:selected="changeCat"
              >
                <template #no-options>
                  <div style="opacity: 0.8">Такой категории нет</div>
                </template>
              </VueSelect>
              <div
                  v-if="v$.category_parent.$errors.length"
                  class="invalid-feedback animated fadeIn fs-xs w-100"
              >
                Пожалуйста, выберите категорию
              </div>
            </div>
          </div>
          <div class="col-12">
            <div class="input-group">
              <label class="form-label w-100">Под категорию</label>
              <VueSelect
                  v-if="categories_children?.content"
                  v-model="state.category_children"
                  :options="categories_children.content"
                  label="name"
                  value="id"
                  class="form-control p-0 text-secondary"
                  placeholder="Выбирете категорию"
                  :class="{ 'is-invalid': v$.category_children.$errors.length}"
                  @blur="v$.category_children.$touch"
                  @search="onSearchChildren"
                  :filterable="false"
              >
                <template #no-options>
                  <div style="opacity: 0.8">Такой категории нет</div>
                </template>
              </VueSelect>
              <div
                  v-if="v$.category_children.$errors.length"
                  class="invalid-feedback animated fadeIn fs-xs"
              >
                Пожалуйста, выберите категорию
              </div>
            </div>
          </div>
          <div class="col-12" v-if="user?.roles?.includes('ADMINISTRATOR')">
            <div class="form-check form-switch">
              <input class="form-check-input"
                     type="checkbox"
                     role="switch"
                     v-model="state.disabled"
                     id="flexSwitchCheckDisable">
              <label class="form-check-label" for="flexSwitchCheckDisable">Order item status</label>
            </div>
          </div>
        </div>
        <div v-else class="w-100 d-flex justify-content-center py-5">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <button
          type="button"
          class="btn btn-sm btn-success me-1"
          @click.prevent="submit"
      >
        Сохранить
      </button>
      <button
          type="button"
          class="btn btn-sm btn-alt-secondary"
          data-bs-dismiss="modal"
      >
        Закрыть
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import BaseModal from "@/components/BaseModal.vue"
import {computed, defineComponent, onMounted, reactive, ref} from "vue";
import {required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import {useOrderItemTypeAdministratorStore} from "@/stores/dashboard/order-item-type/administrator";
import VueSelect from "vue-select";
import {useCategoryStore} from "@/stores/dashboard/category/administrator";

const modal = ref(null)
const storeOrderItemType = useOrderItemTypeAdministratorStore()
const storeCategory = useCategoryStore()
const categories_parent = computed(() => storeCategory.category_parent);
const categories_children = computed(() => storeCategory.category_child);
const category = computed(() => storeCategory.category);
const orderItemType = computed(() => storeOrderItemType.orderItemType);

// === store user ===
import { useUserStore } from "@/stores/dashboard/user/user";
import { storeToRefs } from "pinia";
const storeUser = useUserStore()
const { user } = storeToRefs(storeUser)

const load = ref(false);
let state = reactive({
  id: "",
  category_parent: null,
  category_children: null,
  price: {
    amount: "",
    currency: "UZS"
  },
  disabled: false
})
const rules = computed(() => {
  return {
    name: {required},
    category_parent: {required},
    category_children: {required},
    price: {
      amount: {required}
    },
  };
});
const v$ = useVuelidate(rules, state, {$scope: false});
//submit
const submit = async () => {
  const result = await v$.value.$validate();
  if (!result) {
    return;
  }
  try {
    state.category_id = state.category_children?.id || null
    await storeOrderItemType.updateOrderItemType(state)
    await storeOrderItemType.getOrderItemTypes()
    await modal.value.hide()
    state.name = ''
    state.category_parent = null
    state.category_children = null
    state.price = {
      amount: '',
      currency: "UZS"
    }
    v$.value.$reset()
  } catch (e) {
    console.log(e)
  }
}
onMounted(() => {
  modal.value = new window.bootstrap.Modal('#update-order-item-type')
  storeCategory.getCategoryParent({})

  document.getElementById('update-order-item-type').addEventListener('show.bs.modal', async (event) => {
    load.value = true
    state.id = event.relatedTarget.dataset.bsId
    await storeOrderItemType.getOrderItemType(state.id)
    await storeCategory.getCategory(orderItemType.value.category?.id)
    if (category.value.parent_category_id) {
      state.category_children = category.value
      await storeCategory.getCategory(category.value.parent_category_id)
      state.category_parent = category.value
      await storeCategory.getCategoryChild({id: category.value?.id})
    } else {
      state.category_parent = category.value
      await storeCategory.getCategoryChild({id: category.value?.id})
      state.category_children = null
    }
    state.name = orderItemType.value.name
    state.price = orderItemType.value.price
    state.disabled = orderItemType.value.disabled
    load.value = false
  })
})
const onSearchParent = async (query) => {
  if (query) {
    storeCategory.getCategoryParent({name: query})
  } else {
    storeCategory.getCategoryParent()
  }
}
const onSearchChildren = async (query) => {
  if (query) {
    storeCategory.getCategoryChild({name: query})
  } else {
    storeCategory.getCategoryChild()
  }
}
const changeCat = async (query) => {
  state.category_children = null
  await storeCategory.getCategoryChild({id: query.id})
}
defineComponent({name: 'ModalUpdateOrderItemType'})
</script>

<style lang="scss">
@import "vue-select/dist/vue-select.css";
@import "@/assets/scss/vendor/vue-select";
</style>
