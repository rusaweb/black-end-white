<template>
  <div
      class="modal fade text-start"
      :id="props.id"
      tabindex="-1"
      role="dialog"
      :aria-labelledby="props.id"
      aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" :class="{
      'modal-fullscreen': props.fullscreen,
      'modal-sm': props.modalSm,
      'modal-lg': props.modalLg,
      'modal-xl': props.modalXl
    }">
      <div class="modal-content">
        <BaseBlock :title="props.title" ref="baseBlock" transparent class="mb-0">
          <template #options>
            <button
                type="button"
                class="btn-block-option"
                data-bs-dismiss="modal"
                aria-label="Close"
            >
              <i class="fa fa-fw fa-times"></i>
            </button>
          </template>

          <template #content>
            <slot name="content"></slot>
            <div class="block-content block-content-full text-end bg-body" v-if="footer">
              <slot name="footer"></slot>
            </div>
          </template>
        </BaseBlock>
      </div>
    </div>
  </div>
</template>

<script setup>
import {defineComponent, ref} from "vue";
defineComponent({name: 'BaseModal', ref: true})
const baseBlock = ref()
defineExpose({ baseBlock })
const props = defineProps({
  title: String,
  id: String,
  fullscreen: Boolean,
  modalSm: Boolean,
  modalLg: Boolean,
  modalXl: Boolean,
  footer: {
    default: true,
    type: Boolean
  },
})
</script>
