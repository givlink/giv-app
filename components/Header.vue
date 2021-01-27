<template>
  <header class="Header">
    <nuxt-link to="/" class="Header__logo"
      ><img
        class="Header__logo__img"
        src="~/assets/image/giv_logo.png"
        alt="giv"
    /></nuxt-link>
    <button v-on:click="goToMyPage()" class="Header__mypage">
      <img
        class="Header__mypage__img"
        src="~/assets/image/giv_mypage.png"
        alt="giv"
      />
    </button>
  </header>
</template>

<script>
import api from "../lib/api";
export default {
  methods: {
    goToMyPage() {
      const user = api.getCurrentUser();
      console.log("Pushing");
      this.$router.push(`/users/${user.uid}`);
    }
  }
};
</script>

<style></style>
