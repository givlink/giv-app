<template>
  <div class="User Main">
    <div class="Back">
      <button @click="$router.go(-1)"class="Back__btn focus:outline-none">
        一覧へ戻る
      </button>
    </div>
    <div class="User__profile" v-if="profile">
      <div class="User__profile__icon" v-if="profile">
        <img
          :src="$utils.parseUrl(profile.photoURL + `?height=500`)"
          class="User__profile__icon__img"
          alt
        ></img>
      </div>
      <p class="User__profile__name">{{ profile.name }}</p>
      <p class="User__profile__position">{{ profile.job }}</p>
      <p class="User__profile__message" v-html="changeUrl(profile.intro)"></p>
      <nuxt-link
        to="/edit"
        class="User__profile__edit"
        v-show="currentUserId == id"
      >
        <img
          src="~/assets/image/icon_edit.png"
          class="User__profile__edit__img"
          alt
        ></img>
      </nuxt-link>
    </div>
    <div class="User__giv">
      <h3 class="User__giv__title">登録しているgiv</h3>
      <div class="User__giv__tags" v-if="profile">
        <span class="User__giv__tags__tag" v-for="item of profile.skills">
          {{ renderTag(item) }}
        </span>
      </div>
    </div>

    <div class="User__giv" v-if="profile">
      <h3 class="User__giv__title">登録してる場所</h3>
      <span class="User__giv__tags__tag">
        {{ renderAreaTag(profile.area) }}
      </span>
    </div>
    <div class="User__giv" v-if="profile">
      <h3 class="User__giv__title">興味・関心</h3>
      <div class="User__giv__tags">
        <span class="User__giv__tags__tag" v-for="item of profile.interests">
          {{ renderTag(item) }}
        </span>
      </div>
    </div>

    <div class="User__latest" v-if="profile">
      <h3 class="User__latest__title">贈ったgiv</h3>
      <div class="User__latest__wrap">
        <template v-if="posts" v-for="item of received">
          <nuxt-link :to="`/posts/${item.id}`" class="User__latest__wrap__box">
            <template v-if="item.images && item.images.length > 0">
              <img
                :src="$utils.parseUrl(item.images[0])"
                class="User__latest__wrap__box__img"
                alt
              ></img>
            </template>
            <template v-else>
              <span>NO IMAGE</span>
            </template>
          </nuxt-link>
        </template>
      </div>
    </div>
    <div class="User__latest" v-if="profile">
      <h3 class="User__latest__title">受け取ったgiv</h3>
      <div class="User__latest__wrap">
        <template v-if="posts" v-for="item of posts">
          <nuxt-link :to="`/posts/${item.id}`" class="User__latest__wrap__box">
            <template v-if="item.images && item.images.length > 0">
              <img
                :src="$utils.parseUrl(item.images[0])"
                class="User__latest__wrap__box__img"
                alt
              ></img>
            </template>
            <template v-else>
              <span>NO IMAGE</span>
            </template>
          </nuxt-link>
        </template>
      </div>
    </div>
    <div class="LogoutBtn_Container">
      <button
        class="LogoutBtn"
        v-on:click="logout"
        v-show="currentUserId === id"
      >
        Logout
      </button>
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
      received: "",
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
      const receivedPosts = await api.getUserReceivedPosts(params.id);

      const result = {
        profile,
        posts,
        received: receivedPosts,
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
    if (
      !this.$store.state.areasMap ||
      Object.keys(this.$store.state.areasMap).length === 0
    ) {
      console.log("setting again");
      this.$store.commit("setAreasMap", await api.listAreas());
    }
  },
  methods: {
    renderAreaTag(id) {
      try {
        return this.$store.getters.getAreaTag(id).tag;
      } catch (err) {
        return id;
      }
    },
    renderTag(id) {
      try {
        return this.$store.getters.getSkillTag(id).tag;
      } catch (err) {
        return id;
      }
    },
    async sendGiv() {
      const senderId = this.currentUserId;
      const receiverId = this.id;
      const type = "send";

      //@Todo err handling
      await api.createGivRequest(senderId, receiverId, type);
      this.onModal = false;
    },
    async wantGiv() {
      const senderId = this.id;
      const receiverId = this.currentUserId;
      const type = "receive";

      //@Todo loading spinner?
      //@Todo err handling
      await api.createGivRequest(senderId, receiverId, type);
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
    },
    async logout() {
      await api.logout();
      this.$router.push({ path: "/login" });
    }
  }
};
</script>

<style></style>
