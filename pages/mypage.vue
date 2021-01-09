<template>
  <div class="User Main" v-if="profile">
    <div class="User__profile">
      <div class="User__profile__icon">
        <b-img
          :src="profile.photoURL"
          class="User__profile__icon__img"
          alt
        ></b-img>
      </div>
      <p class="User__profile__name">{{ profile.displayName }}</p>
      <p class="User__profile__position">{{ profile.job }}</p>
      <p
        class="User__profile__message"
        v-html="changeUrl(profile.introduction)"
      ></p>
      <nuxt-link to="edit" class="User__profile__edit">
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

    <div class="User__giv">
      <h3 class="User__giv__title">givを提供できる場所</h3>
      <span class="User__giv__tags__tag">
        {{ renderAreaTag(profile.area) }}
      </span>
    </div>

    <div class="User__giv">
      <h3 class="User__giv__title">興味・関心</h3>
      <div class="User__giv__tags">
        <span class="User__giv__tags__tag" v-for="item of profile.interests">
          {{ renderTag(item) }}
        </span>
      </div>
    </div>
    <div class="User__latest">
      <h3 class="User__latest__title">最近のgiv</h3>
      <div class="User__latest__wrap">
        <template v-for="item of posts">
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
  </div>
</template>

<script>
import firebase from "../lib/firebase";
export default {
  layout: "logined",
  data() {
    return {
      profile: null,
      posts: []
    };
  },
  async asyncData({ app }) {
    //@Todo seems like there is no logout button on the app
    //@Todo handle when no user
    const user = firebase.auth().currentUser;
    if (!user) return null;
    const doc = await firebase
      .firestore()
      .doc(`/users/${user.uid}`)
      .get();
    const profile = { ...doc.data(), id: doc.id };
    profile.photoURL = `${process.env.cdn}/${profile.photoURL}`;

    const postSnap = await firebase
      .firestore()
      .collection("posts")
      .where("authorId", "==", user.uid)
      .limit(10)
      .get();
    const posts = [];
    postSnap.forEach(doc => posts.push({ ...doc.data(), id: doc.id }));

    return {
      profile,
      posts
    };
  },
  methods: {
    getUrl: path => `${process.env.cdn}/${path}`,
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
    changeUrl(text) {
      if (!text) return "";
      return text.replace(
        /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi,
        "<a href='$1'>$1</a>"
      );
    }
  }
};
</script>

<style></style>
