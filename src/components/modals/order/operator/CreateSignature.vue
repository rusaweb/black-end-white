<template>
  <BaseModal title="Подпись клиента" :modalLg="true" id="create-signature">
    <template #content>
      <div class="block-content block-content-full">
        <div class="block-content fs-sm">
          <form action="" class="items-push row">
            <div class="fw-normal">
              <h3 class="form-label text-center mb-3 d-block">Подпись</h3>
              <div class="wrapper d-flex justify-content-center">
                <canvas id="signature-pad" class="signature-pad" width="600" height="400"></canvas>
              </div>
            </div>
          </form>
        </div>
      </div>
    </template>
    <template #footer>
      <button
          type="button"
          class="btn btn-sm btn-success me-1"
          id="save"
          :data-bs-target="backModal"
          data-bs-toggle="modal"
      >
        Сохранить
      </button>
      <button
          type="button"
          class="btn btn-sm btn-alt-secondary"
          data-bs-dismiss="modal"
          id="clear"
      >
        Закрыть
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import BaseModal from "@/components/BaseModal.vue"
import {defineComponent, onMounted, ref} from "vue";
import SignaturePad from "signature_pad";
import event from '@/utils/eventBus'
const modal = ref(null)
const type = ref(null)
const backModal = ref(null)
const signaturePad = ref(null)

//submit
const submit = async () => {
  if (signaturePad.value.isEmpty()) {
    return alert("Please provide a signature first.");
  }
  var data = signaturePad.value.toDataURL('image/png');
  event.$emit('signature-submit', {str: data.split(',')[1], type: type.value})
}
onMounted(() => {
  modal.value = new window.bootstrap.Modal('#create-signature')
  document.getElementById('create-signature').addEventListener('shown.bs.modal', async (event) => {
    backModal.value = event.relatedTarget.dataset.bsBack
    type.value = event.relatedTarget.dataset.bsType
  })
  var canvas = document.getElementById('signature-pad');
  signaturePad.value = null
  function resizeCanvas() {
    canvas.width  = 600;
    canvas.height = 400;
    canvas.style.width  = '600px';
    canvas.style.height = '400px';
    canvas.getContext("2d")
  }
  window.onresize = resizeCanvas;
  resizeCanvas();

  signaturePad.value = new SignaturePad(canvas, {
    backgroundColor: 'rgb(255, 255, 255)' // necessary for saving image as JPEG; can be removed is only saving as PNG or SVG
  });

  document.getElementById('save').addEventListener('click', submit);

  document.getElementById('clear').addEventListener('click', function () {
    signaturePad.value.clear();
  });
})
defineComponent({name: 'ModalCreateSignatureOperator'})
</script>
