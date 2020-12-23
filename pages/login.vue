<template>
  <div class="Invite">
    <div class="Inner Invite__inner">
      <div class="Invite__logo">
        <img class="Invite__logo__img" src="~/assets/image/giv_logo.png" alt="giv" />
      </div>
      <div class="Invite__form">
        <div class="Invite__btn">
          <button v-on:click="login()" class="Invite__btn__link">ログインする</button>
        </div>
        <p class="Invite__error">{{ hasError }}</p>
        <p class="Invite__error">{{ hasUser }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "../lib/firebase";
export default {
  layout: "noheader",
  data() {
    return {
      hasError: "",
      hasUser: "",
    };
  },
  mounted() {
    // ここから追加
  },
  methods: {
    login() {
      const provider = new firebase.auth.FacebookAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
        console.log("Redirecting", result.user)
          this.$router.push({path:"/"});
        })
        .catch((error) => {
          this.hasError = error.message;
        });
    },
  },
};
</script>

<style></style>
