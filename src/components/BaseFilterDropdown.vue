<template>
  <div class="dropdown d-inline-block">
    <button
        type="button"
        class="btn btn-sm btn-alt-secondary"
        id="dropdown-recent-orders-filters"
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
    >
      <i class="fa fa-fw fa-flask"></i>
      <span class="d-md-inline-block d-none">
        Фильтры
      </span>
      <i class="d-md-inline d-none fa fa-angle-down ms-1"></i>
    </button>
    <div
        class="dropdown-menu dropdown-menu-md dropdown-menu-end fs-sm"
        aria-labelledby="dropdown-recent-orders-filters"
    >
      <a
          v-for="(item, key) in props.list"
          :key="key"
          class="dropdown-item fw-medium d-flex align-items-center justify-content-between"
          href="javascript:void(0)"
          @click="dropdownHandler(item)"
      >
        {{item.label}}
      </a>
    </div>
  </div>
</template>

<script setup>
import router from "@/router";
const props = defineProps({
  list: Array
})
const dropdownHandler = (item) => {
  const query = {...router.currentRoute.value.query}
  if (query && query.page){
    query.page = '0'
  }
  if (query && query.statuses){
    delete query.statuses
  }
  if (query && query.expiredNextCalls){
    delete query.expiredNextCalls
  }
  if (query && query.comingNextCalls){
    delete query.comingNextCalls
  }
  if (query && query.type){
    delete query.type
  }
  if (item.prop){
    query[item.prop] = item.value
    router.push({query: {...query}})
    return
  }

  if (item.value) {
    router.push({query: {...query, statuses: item.value}})
  } else {
    delete query.statuses
    router.push({query: {...query}})
  }
}
</script>
