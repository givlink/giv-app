<template>
  <header class="pt-2 pb-2 border-b border fixed left-0 right-0 top-0 bg-white z-10">
    <div class="px-2 flex items-center justify-between">
      <nuxt-link to="/" class="Header__logo"
        ><img class="" width="32" src="~/assets/image/giv_logo.png" alt="giv"
      /></nuxt-link>
      <div class="text-gray-900 text-sm text-center py-1 not-link">メッセージ</div>
    </div>
  </header>
</template>

<style>
.not-link {
  color: #0eb9ec;
  font-weight: bolder;
}
</style>

<script>
/* import api from "@/lib/api"; */
/* import { mapState } from "vuex"; */

export default {
  computed: {},
};
</script>
