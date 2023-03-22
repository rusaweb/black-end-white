<template>
  <div
      class="position-fixed bottom-0 end-0 p-3 space-y-3"
      style="z-index: 9999"
  >
    <div
        id="toast"
        class="toast fade hide"
        data-delay="4000"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
    >
      <div class="toast-header">
        <i :class="`${store.toast.iconClass} me-2`"></i>
        <strong class="me-auto">{{ store.toast.title }}</strong>
        <button
            type="button"
            class="btn-close"
            data-bs-dismiss="toast"
            aria-label="Close"
        ></button>
      </div>
      <div class="toast-body">
        {{ store.toast.subTitle }}
      </div>
    </div>
  </div>
  <div
      class="position-fixed bottom-0 end-0 p-3 space-y-3"
      style="z-index: 9999"
  >
    <div
        id="toast-error"
        class="toast fade hide"
        data-delay="4000"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
    >
      <div class="toast-header">
        <i :class="`${store.toastError.iconClass} me-2`"></i>
        <strong class="me-auto">{{ store.toastError.title }}</strong>
        <button
            type="button"
            class="btn-close"
            data-bs-dismiss="toast"
            aria-label="Close"
        ></button>
      </div>
      <div class="toast-body">
        {{ store.toastError.subTitle }}
      </div>
    </div>
  </div>
</template>

<script setup>
import {useTemplateStore} from "@/stores/template";
const store = useTemplateStore()
</script>
