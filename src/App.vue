<template>
  <RouterView />
  <BaseToast />
</template>
<script setup>
import BaseToast from "@/components/BaseToast.vue";
// import {onMounted} from "vue";
// import router from "@/router";
// import {setCookie} from "./utils/cookie";
//
// onMounted(() => {
//   inactivityTime();
// })
// let inactivityTime = () => {
//   let time;
//   document.addEventListener('mousemove', resetTimer);
//   document.addEventListener('keypress', resetTimer);
//
//   function resetTimer() {
//     clearTimeout(time);
//     //3600000
//     time = setTimeout(fn, 3600000)
//   }
//
//   function fn() {
//     router.push({name: 'lock'})
//     setCookie('active', false, 365 )
//   }
// };
</script>
<style lang="scss">

// Main Stylesheet
@import "@/assets/scss/main.scss";

// All color themes are included and available by default
// Feel free to comment out any of them if you won't use them in your project
@import "@/assets/scss/oneui/themes/amethyst.scss";
@import "@/assets/scss/oneui/themes/city.scss";
@import "@/assets/scss/oneui/themes/flat.scss";
@import "@/assets/scss/oneui/themes/modern.scss";
@import "@/assets/scss/oneui/themes/smooth.scss";
</style>
