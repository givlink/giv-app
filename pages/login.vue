<template>
  <div class="Invite">
    <div class="Spinner" v-show="loading">
      <div class="Spinner__box">
        <b-spinner label="Loading..." :variant="'primary'"></b-spinner>
      </div>
    </div>
    <div class="Inner Invite__inner" v-show="!loading">
      <div class="Invite__logo mx-auto">
        <img class="Invite__logo__img" src="~/assets/image/giv_logo.png" alt="giv" />
      </div>
      <div class="Invite__form">
        <div class="Invite__btn">
          <button v-on:click="login()" class="Invite__btn__link">
            ログインする
          </button>
        </div>
        <div class="mt-12 text-xs font-medium">
          <a
            href="https://giv.link/privacy-policy/"
            target="_blank"
            class="border-b border-gray-400"
          >
            プライバシーポリシー
          </a>
        </div>
        <p class="Invite__error">{{ hasError }}</p>
      </div>
      <div class="fixed flex items-center justify-center bottom-0 left-0 right-0 mb-12">
        <button
          v-on:click="login('apple')"
          class="flex items-center leading-0 text-sm shadow-sm hover:shadow-xl transition duration-150 rounded-md px-4 py-2 bg-gray-900 font-semibold text-white"
        >
          <img class="h-5 w-5 mr-2" src="~/assets/image/apple_logo.svg" alt="apple" />
          <span class="mt-1">Sign in with Apple</span>
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
      loading: true,
    };
  },
  mounted() {
    this.loading = this.$store.state.authLoading;
    if (this.$route.query.pushtoken) {
      this.$store.commit("setPushToken", this.$route.query.pushtoken);
      localStorage.setItem("pushToken", this.$route.query.pushtoken);
    }
    firebase
      .auth()
      .getRedirectResult()
      .then((result) => {
        console.log("Got user: ", result);
      })
      .catch((err) => {
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
    },
  },
};
</script>

<style></style>
