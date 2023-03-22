import SignaturePad from "signature_pad";
import {useOrderCourierStore} from "../stores/dashboard/order/courier";

export function init(id) {
    var canvas = document.getElementById('signature-pad');
    function resizeCanvas() {
        canvas.width  = 600;
        canvas.height = 400;
        canvas.style.width  = '600px';
        canvas.style.height = '400px';
        canvas.getContext("2d")
    }

    window.onresize = resizeCanvas;
    resizeCanvas();

    var signaturePad = new SignaturePad(canvas, {
        backgroundColor: 'rgb(255, 255, 255)' // necessary for saving image as JPEG; can be removed is only saving as PNG or SVG
    });

    document.getElementById('save').addEventListener('click', async function  () {
        if (signaturePad.isEmpty()) {
            return alert("Please provide a signature first.");
        }
        var data = signaturePad.toDataURL('image/png');
        await useOrderCourierStore().setSignature({id, code: data.split(',')[1]})
        await useOrderCourierStore().getOrder(id)
    });

    document.getElementById('clear').addEventListener('click', function () {
        signaturePad.clear();
    });
}
