<template>
  <div class="Invite">
    <div class="Spinner" v-show="loading">
      <div class="Spinner__box">
        <b-spinner label="Loading..." :variant="'primary'"></b-spinner>
      </div>
    </div>
    <div class="Inner Invite__inner" v-show="!loading">
      <div class="Invite__logo">
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
  },
  methods: {
    login() {
      const provider = new firebase.auth.FacebookAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(({ user }) => {
          const u = {
            name: user.displayName,
            id: user.uid
          };
          this.$store.commit("setUser", u);
          this.$router.push({ path: "/" });
        })
        .catch(error => {
          this.hasError = error.message;
        });
    }
  }
};
</script>

<style></style>
