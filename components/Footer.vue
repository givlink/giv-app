<template>
  <footer class="Footer">
    <nuxt-link to="/" class="Footer__box">
      <div class="Footer__box__icon">
        <img
          class="Footer__box__icon__img"
          src="~/assets/image/icon_01.png"
          alt=""
        />
      </div>
      <p class="Footer__box__text">タイムライン</p>
    </nuxt-link>
    <nuxt-link to="/users" class="Footer__box">
      <div class="Footer__box__icon">
        <img
          class="Footer__box__icon__img"
          src="~/assets/image/icon_03.png"
          alt=""
        />
      </div>
      <p class="Footer__box__text">検索</p>
    </nuxt-link>
    <nuxt-link
      to="/notification"
      class="Footer__box"
      @click.native="deleteCount()"
    >
      <div class="Footer__box__icon">
        <img
          class="Footer__box__icon__img"
          src="~/assets/image/icon_04.png"
          alt=""
        />
      </div>
      <div class="Footer__box__notification" v-if="count > 0">
        {{ count }}
      </div>
      <p class="Footer__box__text">お知らせ</p>
    </nuxt-link>
  </footer>
</template>

<script>
/* <nuxt-link to="/debug" class="Footer__box" v-show="isAdmin"> */
/*   <div class="Footer__box__icon flex flex-col items-center"> */
/*     <svg */
/*       class="w-7 h-7 text-gray-400" */
/*       fill="none" */
/*       stroke="currentColor" */
/*       viewBox="0 0 24 24" */
/*       xmlns="http://www.w3.org/2000/svg" */
/*     > */
/*       <path */
/*         stroke-linecap="round" */
/*         stroke-linejoin="round" */
/*         stroke-width="2" */
/*         d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" */
/*       ></path> */
/*     </svg> */
/*     <p class="Footer__box__text">Debug</p> */
/*   </div> */
/* </nuxt-link> */
import api from "../lib/api";
export default {
  data() {
    return {
      count: 0,
      user: null,
      isAdmin: false
    };
  },
  async created() {},
  async mounted() {
    try {
      const user = await api.getCurrentUser();
      if (!user) return;

      const { claims } = await user.getIdTokenResult();
      this.isAdmin = !!claims.admin;
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    deleteCount() {
      this.count = 0;
    }
  }
};
</script>

<style></style>
