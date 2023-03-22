<template>
  <div
      id="search-orders"
      class="block-content border-bottom"
  >
    <!-- Search Form -->
    <form @submit.prevent>
      <div class="push">

        <div class="input-group d-flex flex-nowrap">
          <select class="form-control-alt form-select border-0 w-auto" v-model="target" @change="removeParams">
            <option v-for="(item, key) in list" :key="key" :value="item.value">{{ item.label }}</option>
          </select>
          <input
              type="text"
              class="form-control form-control-alt w-100"
              id="example-group4-input1"
              name="example-group4-input1"
              aria-label="Text input with dropdown button"
              placeholder="Поиск ..."
              @keyup="keyup"
              @keydown="keydown"
              v-model="value"
          />
          <span class="input-group-text bg-body border-0">
            <i class="fa fa-search"></i>
          </span>
        </div>
      </div>
    </form>
    <!-- END Search Form -->
  </div>
</template>

<script setup>
  import router from "@/router";
  import { ref } from "vue";
  const props = defineProps({
    list: Array
  })
  const target = ref(props.list.at(0).value)
  const value = ref('')
  let typingTimer;                //timer identifier
  const doneTypingInterval = 1000;  //time in ms, 5 seconds for example
  const keyup = () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
  }
  const keydown = () => {
    clearTimeout(typingTimer);
  }
  const removeParams = () => {
    const query = {...router.currentRoute.value.query}
    props.list.map(e=> delete query[e.value])
    value.value = ''
    router.push({query})
  }
  const doneTyping = () => {
    const query = {...router.currentRoute.value.query}
    if (value.value){
      query[target.value] = value.value
      router.push({query})
    }else {
      delete query[target.value]
      router.push({query})
    }
  }
</script>
