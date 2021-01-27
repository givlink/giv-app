<template>
  <div class="User Main">
    <div class="User__profile">
      <div class="User__profile__icon">
        <b-img
          :src="getUrl(profile.photoURL)"
          class="User__profile__icon__img"
          alt
        ></b-img>
      </div>
      <p class="User__profile__name">{{ profile.name }}</p>
      <p class="User__profile__position">{{ profile.job }}</p>
      <p class="User__profile__message" v-html="changeUrl(profile.intro)"></p>
      <nuxt-link
        to="/edit"
        class="User__profile__edit"
        v-show="currentUserId == id"
      >
        <b-img
          src="~/assets/image/icon_edit.png"
          class="User__profile__edit__img"
          alt
        ></b-img>
      </nuxt-link>
    </div>
    <div class="User__giv">
      <h3 class="User__giv__title">登録しているgiv</h3>
      <div class="User__giv__tags">
        <span class="User__giv__tags__tag" v-for="item of profile.skills">
          {{ renderTag(item) }}
        </span>
      </div>
    </div>
    <div class="User__latest">
      <h3 class="User__latest__title">最近のgiv</h3>
      <div class="User__latest__wrap">
        <template v-if="posts" v-for="item of posts">
          <nuxt-link :to="`/posts/${item.id}`" class="User__latest__wrap__box">
            <template v-if="item.images && item.images.length > 0">
              <b-img
                :src="getUrl(item.images[0])"
                class="User__latest__wrap__box__img"
                alt
              ></b-img>
            </template>
            <template v-else>
              <span>NO IMAGE</span>
            </template>
          </nuxt-link>
        </template>
      </div>
    </div>
    <div class="GivBtn" v-on:click="toggleModal" v-show="currentUserId !== id">
      <img class="GivBtn__img" src="~/assets/image/giv_btn.png" alt="giv" />
    </div>
    <div class="GivModal" v-if="onModal">
      <div
        class="GivModal__btn GivModal__btn--send"
        v-b-modal="'send-modal'"
        v-on:click="sendGiv"
      >
        givを贈りたい
      </div>
      <div
        class="GivModal__btn GivModal__btn--take"
        v-b-modal="'want-modal'"
        v-on:click="wantGiv"
      >
        givを受け取りたい
      </div>
      <div class="GivModal__btn GivModal__btn--cancel" v-on:click="toggleModal">
        閉じる
      </div>
    </div>
    <b-modal ok-only id="send-modal">givを送りたいと送信しました</b-modal>
    <b-modal ok-only id="want-modal">givを受け取りたいと送信しました</b-modal>
  </div>
</template>

<script>
import api from "../../lib/api";
export default {
  layout: "logined",
  data() {
    return {
      profile: "",
      posts: "",
      onModal: false,
      currentUserId: "",
      id: null
    };
  },
  async asyncData({ app, params }) {
    if (params.id) {
      const currentUser = api.getCurrentUser();
      const profile = await api.getUserProfile(params.id);
      const posts = await api.getUserPosts(params.id);

      const result = {
        profile,
        posts,
        id: params.id,
        currentUserId: currentUser.uid
      };
      return result;
    }
  },
  async mounted() {
    if (
      !this.$store.state.skillsMap ||
      Object.keys(this.$store.state.skillsMap).length === 0
    ) {
      console.log("setting again");
      this.$store.commit("setSkillsMap", await api.listSkills());
    }
  },
  methods: {
    renderTag(id) {
      try {
        return this.$store.getters.getSkillTag(id).tag;
      } catch (err) {
        return id;
      }
    },
    getUrl: path => `${process.env.cdn}/${path}`,
    async sendGiv() {
      const baseUrl = process.env.baseUrl + "/users/" + this.id + "/send_giv";
      const getUrl = encodeURI(baseUrl);

      const token = this.$auth.$storage.getUniversal("_token.auth0");
      const response = await axios.put(
        getUrl,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token
          }
        }
      );
      this.onModal = false;
    },
    async wantGiv() {
      const baseUrl = process.env.baseUrl + "/users/" + this.id + "/want_giv";
      const getUrl = encodeURI(baseUrl);

      const token = this.$auth.$storage.getUniversal("_token.auth0");
      const response = await axios.put(
        getUrl,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token
          }
        }
      );
      this.onModal = false;
    },
    toggleModal() {
      this.onModal = !this.onModal;
    },
    changeUrl(text) {
      if (!text) return "";
      return text.replace(
        /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi,
        "<a target='_blank' href='$1'>$1</a>"
      );
    }
  }
};
</script>

<style></style>
