<template>
  <div class="Invite">
    <div class="Spinner" v-show="loading">
      <div class="Spinner__box">
        <b-spinner label="Loading..." :variant="'primary'"></b-spinner>
      </div>
    </div>
    <div class="Inner Invite__inner" v-show="!loading">
      <div class="Invite__logo flex justify-center">
        <img
          class="Invite__logo__img"
          src="~/assets/image/giv_logo.png"
          alt="giv"
        />
      </div>
      <div class="Invite__form">
        <div class="Invite__btn">
          <button v-on:click="login()" class="Invite__btn__link">
            ログインする
          </button>
        </div>
        <p class="Invite__error">{{ hasError }}</p>
      </div>
      <div
        class="fixed flex items-center justify-center bottom-0 left-0 right-0 mb-12"
      >
        <button
          v-on:click="login('apple')"
          class="font-semibold text-gray-700 text-sm border-b-4 border-solid border-gray-500 px-1 py-1"
        >
          Sign in with Apple
        </button>
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
      loading: true
    };
  },
  mounted() {
    this.loading = this.$store.state.authLoading;
    firebase
      .auth()
      .getRedirectResult()
      .then(result => {
        console.log("Got user: ", result);
      })
      .catch(err => {
        console.log("Got err:", err);
        this.hasError = err.message;
      });
  },
  methods: {
    async login(prov) {
      let provider = new firebase.auth.FacebookAuthProvider();
      if (prov && prov === "apple") {
        provider = new firebase.auth.OAuthProvider("apple.com");
      }
      firebase.auth().signInWithRedirect(provider);
    }
  }
};
</script>

<style></style>
