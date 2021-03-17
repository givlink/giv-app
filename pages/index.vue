<template>
  <div class="Home Main">
    <div class="Home__cards">
      <div class="Home__card" v-for="post in posts">
        <nuxt-link :to="`/users/${post.authorId}`" class="Home__card__header">
          <div class="Home__card__header__icon">
            <b-img
              :src="getUrl(post.author.photoURL)"
              class="Home__card__header__icon__img"
              alt
            ></b-img>
          </div>
          <div class="Home__card__header__text">
            <p class="Home__card__header__text__name">
              {{ post.author.name }}
            </p>
          </div>
        </nuxt-link>
        <nuxt-link
          :to="`/posts/${post.id}`"
          class="Home__card__view"
          v-if="post.images && post.images.length > 0"
        >
          <b-img
            :src="getUrl(post.images[0])"
            class="Home__card__view__img"
            alt
          ></b-img>
        </nuxt-link>
        <div class="Home__card__content">
          <nuxt-link
            :to="`/posts/${post.id}`"
            class="Home__card__content__info"
          >
            <div class="Home__card__content__info__tags"></div>
            <div class="Home__card__content__info__date">
              {{ post.createdAt | moment }}
            </div>
          </nuxt-link>
          <nuxt-link
            :to="`/posts/${post.id}`"
            class="Home__card__content__title"
          >
            {{ post.title }}
          </nuxt-link>
          <nuxt-link
            :to="`/posts/${post.id}`"
            class="Home__card__content__text"
          >
            <template v-if="post.message && post.message.length > 40">
              {{ post.message | substringText }}
              <nuxt-link :to="`/posts/${post.id}`" class=""
                >続きを見る</nuxt-link
              >
            </template>
            <template v-else>
              {{ post.message }}
            </template>
          </nuxt-link>
          <nuxt-link
            :to="`/users/${post.giver.id}`"
            class="Home__card__content__person"
          >
            <!--          <nuxt-link :to="`/user/${post.giv.giv_user.id}`" class="Home__card__content__person">-->
            <div class="Home__card__content__person__icon">
              <b-img
                :src="getUrl(post.giver.photoURL)"
                class="Home__card__content__person__icon__img"
                alt
              ></b-img>
            </div>
            <div class="Home__card__content__person__text">
              <p class="Home__card__content__person__text__head">
                givを贈った人
              </p>
              <p class="Home__card__content__person__text__name">
                {{ post.giver.name }}
              </p>
              <!--              <p class="Home__card__content__person__text__position">CO-FOUNDER & CCO</p>-->
            </div>
          </nuxt-link>
        </div>
      </div>
      <div class="Search__list__li" v-if="hasNext" v-on:click="loadmore()">
        <span
          class="Search__list__li__link"
          style="text-align: center;font-size: 1.6em;"
          >さらに読み込む</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import firebase from "../lib/firebase";
import api from "../lib/api";

const getPosts = async (offset = null, limit = 20) => {
  let snap = firebase
    .firestore()
    .collection("posts")
    .orderBy("createdAt", "desc");

  if (offset) snap = snap.startAfter(offset);

  snap = await snap.limit(limit).get();

  const posts = [];
  snap.forEach(doc => posts.push({ ...doc.data(), id: doc.id }));
  return [posts, snap.docs[snap.docs.length - 1]];
};
const getSkills = async () => {
  const skills = {};
  const snap = await firebase
    .firestore()
    .collection("skills")
    .get();
  snap.forEach(doc => (skills[doc.id] = { id: doc.id, ...doc.data() }));
  return skills;
};
const getAreas = async () => {
  const areas = {};
  const snap = await firebase
    .firestore()
    .collection("areas")
    .get();
  snap.forEach(doc => (areas[doc.id] = { id: doc.id, ...doc.data() }));
  return areas;
};

export default {
  components: {},
  layout: "logined",
  data() {
    return {
      posts: [],
      error: null,
      code: "",
      hasError: "",
      img: "",
      first_name: "",
      last_name: "",
      posts: [],
      offset: null,
      limit: 30,
      hasNext: true
    };
  },
  methods: {
    getUrl(path) {
      if (path && path.startsWith("http")) {
        return path;
      } else {
        return `${process.env.cdn}/${path}`;
      }
    },
    async loadmore() {
      const [posts, offset] = await getPosts(this.offset);
      this.posts = [...this.posts, ...posts];
      this.offset = offset;
    },

    async registerPushToken(token) {
      try {
        await api.setupNotifications(token);
        this.$router.replace({ "query.pushToken": null });
      } catch (err) {
        console.error("Err register push token:", err);
        this.error = err.message;
      }
    }
  },
  async mounted() {
    if (this.$route.query.pushToken) {
      this.$store.commit("setPushToken", this.$route.query.pushToken);
      await this.registerPushToken(this.$route.query.pushToken);
    }
    this.$store.commit("setSkillsMap", await getSkills());
    this.$store.commit("setAreasMap", await getAreas());
  },
  async asyncData({ app }) {
    const [posts, offset] = await getPosts();
    return { posts, offset };
  },
  filters: {
    moment: function(date) {
      let str = moment.unix(date / 1000).format("YYYY.MM.DD");
      if (str === "Invalid date") {
        str = moment(date)
          .utc()
          .format("YYYY.MM.DD");
      }
      return str;
    },
    substringText: function(text) {
      let subText = text;
      if (text.length > 130) {
        subText = text.substring(0, 130);
        subText += "…";
      }
      return subText;
    }
  }
};
</script>

<style></style>
