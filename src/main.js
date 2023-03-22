import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import YmapPlugin from 'vue-yandex-maps'

// You can use the following dashboard router instead of the default one as a clean starting point
// import router from "./router/dashboard";
import router from "./router/index";

// Template components
import BaseBlock from "@/components/BaseBlock.vue";
import BaseBackground from "@/components/BaseBackground.vue";
import BasePageHeading from "@/components/BasePageHeading.vue";
import CKEditor from '@ckeditor/ckeditor5-vue';
import './interceptors/axios';

// Template directives
import clickRipple from "@/directives/clickRipple";

// Bootstrap framework
import * as bootstrap from "bootstrap";
window.bootstrap = bootstrap;

// Craft new application
const app = createApp(App);
app.use(createPinia());

import Camera from "simple-vue-camera";
app.component("camera", Camera);

import VueLazyLoad from 'vue3-lazyload'

app.use(VueLazyLoad, {
    loading: '/assets/load.gif',
    error: '/assets/error.jpg',
})

const settings = {
    apiKey: '9408092d-e913-4951-9397-ad37c05d9285',
    lang: 'ru_RU',
    coordorder: 'latlong',
    enterprise: false,
    version: '2.1'
}

app.use(YmapPlugin, settings)


// Register global components
app.component("BaseBlock", BaseBlock);
app.component("BaseBackground", BaseBackground);
app.component("BasePageHeading", BasePageHeading);

// Register global directives
app.directive("click-ripple", clickRipple);

// Use Pinia and Vue Router
app.use(router);
app.use(CKEditor);

// ..and finally mount it!
app.mount("#app");
