<template>
  <nav v-if="props && props.data && props.data.request?.size" aria-label="Photos Search Navigation" class="d-flex align-items-center justify-content-between">
    <div>
      <select
          class="form-select"
          @change="limitHandler"
          :value="props.data.request.size"
      >
        <option value="3">3</option>
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="20">20</option>
      </select>
    </div>
    <ul class="pagination pagination-sm justify-content-end mb-0" v-if="props.data.total_pages > 1">
      <li class="page-item" :class="{'pe-none user-select-none disabled': !props.data.has_previous}" @click="previousPage()">
        <a
            class="page-link"
            href="javascript:void(0)"
            tabindex="-1"
            aria-label="Previous"
        >
          Назад
        </a>
      </li>
      <li
          :class="`page-item ${props.data.request.page === page - 1 ? 'active': ''}`"
          v-for="page in props.data.total_pages" :key="page"
          @click="pageHandler(page)"
      >
        <a class="page-link" href="javascript:void(0)">{{ page }}</a>
      </li>
      <li class="page-item" :class="{'pe-none user-select-none disabled': !props.data.has_next}" @click="nextPage()">
        <a
            class="page-link"
            href="javascript:void(0)"
            aria-label="Next"
        >
          Далее
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import router from "@/router";
const props = defineProps({
  data: Object,
})
const pageHandler = (page) => {
  const query = {...router.currentRoute.value.query}
  query['page'] = (page - 1).toString()
  router.push({query})
}
const previousPage = () => {
  const query = {...router.currentRoute.value.query}
  query['page'] = (props.data.request.page - 1).toString()
  router.push({query})
}
const nextPage = () => {
  const query = {...router.currentRoute.value.query}
  query['page'] = (props.data.request.page + 1).toString()
  router.push({query})
}
const limitHandler = (limit) => {
  const query = {...router.currentRoute.value.query}
  query['size'] = limit.target.value
  router.push({query})
}
</script>
