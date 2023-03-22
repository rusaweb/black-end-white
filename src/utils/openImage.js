export function openImage (url) {
    let image = new Image();
    image.src = "data:image/png;base64," + url;
    let w = window.open("");
    w.document.write(image.outerHTML);
}