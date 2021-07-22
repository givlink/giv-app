<template>
  <div class="Home Main">
    <vue-pull-refresh
      :top-load-method="refreshPosts"
      :topConfig="pullConfig"
      :is-top-bounce="onTop"
      :is-bottom-bounce="false"
    >
      <AreaSwitch />
      <div class="Home__cards">
        <giv-empty-state
          class="my-24"
          v-if="posts.length === 0"
          msg="新しいポストありません。"
        />
        <div class="Home__card" v-for="post in posts">
          <nuxt-link :to="`/users/${post.authorId}`" class="Home__card__header">
            <div class="Home__card__header__icon">
              <img
                v-lazy="$utils.parseUrl(post.author.photoURL)"
                class="Home__card__header__icon__img"
                alt
                lazy
              />
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
            <img
              v-lazy="$utils.parseUrl(post.images[0])"
              class="Home__card__view__img"
              alt
              lazy
            />
          </nuxt-link>
          <div class="Home__card__content">
            <nuxt-link
              :to="`/posts/${post.id}`"
              class="Home__card__content__info"
            >
              <div class="Home__card__content__info__tags"></div>
              <div class="Home__card__content__info__date">
                {{ $utils.parseDate(post.createdAt) }}
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
              {{ $utils.snipText(post.message) }}
            </nuxt-link>
            <nuxt-link
              :to="`/users/${post.giver.id}`"
              class="Home__card__content__person"
            >
              <div class="Home__card__content__person__icon">
                <img
                  v-lazy="$utils.parseUrl(post.giver.photoURL)"
                  class="Home__card__content__person__icon__img"
                  alt
                />
              </div>
              <div class="Home__card__content__person__text">
                <p class="Home__card__content__person__text__head">
                  givを贈った人
                </p>
                <p class="Home__card__content__person__text__name">
                  {{ post.giver.name }}
                </p>
              </div>
            </nuxt-link>
          </div>
        </div>
        <button
          class="w-full flex items-center justify-end hover:shadow-lg focus:translate-y-px transform bg-white shadow-sm rounded px-4 py-2"
          v-if="hasNext"
          v-on:click="loadPosts()"
        >
          <span class="text-sm mr-2" style="">さらに読み込む</span>

          <b-spinner v-if="loading" class="h-5 w-5"></b-spinner>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </vue-pull-refresh>
  </div>
</template>

<script>
import api from "../lib/api";
import AreaSwitch from "../components/AreaSwitch";
import RefreshPosts from "../components/RefreshPosts";
import { mapState } from "vuex";

export default {
  components: { AreaSwitch, RefreshPosts },
  layout: "logined",
  data() {
    return {
      loading: false,
      error: null,
      onTop: true,
      limit: 30,
      hasNext: true,
      pullConfig: {
        pullText: "Pull to Refresh", // The text is displayed when you pull down
        triggerText: "Release", // The text that appears when the trigger distance is pulled down
        loadingText: "Loading....", // The text in the load
        doneText: "", // Load the finished text
        failText: "Error", // Load failed text
        loadedStayTime: 400, // Time to stay after loading ms
        stayDistance: 50, // Trigger the distance after the refresh
        triggerDistance: 70 //
      }
    };
  },
  computed: mapState(["filterArea", "posts"]),
  watch: {
    filterArea(newValue, oldValue) {
      this.loadPosts();
    }
  },
  methods: {
    dedupePosts(posts) {
      const map = {};
      this.posts.forEach(p => (map[p.id] = p));
      posts.forEach(p => (map[p.id] = p));
      const result = Object.values(map);
      result.sort((a, b) => {
        if (a.createdAt > b.createdAt) return -1;
        if (b.createdAt > a.createdAt) return 1;
        return 0;
      });
      return result;
    },
    //@Todo copy paste from below
    async refreshPosts(loaded) {
      const [posts, offset] = await api.listPosts({
        area: this.filterArea,
        offset: null
      });
      this.$store.commit("setPosts", posts);
      this.$utils.setGlobalOffset(offset);
      loaded("done");
      //@Todo show empty posts component if list empty
    },
    async loadPosts(refresh = false) {
      this.loading = true;
      //@Todo do all this inside store instead of here.
      const [posts, offset] = await api.listPosts({
        area: this.filterArea,
        offset: this.$utils.getGlobalOffset()
      });
      if (posts.length === 0 && this.filterArea !== "all") {
        this.$store.commit("setPosts", this.dedupePosts(posts));

        //this was causing problems of "no posts", commenting for now
        //revisit later if there are further problems
        //@Hack to check for end of post for senboku shi
        /* this.$store.commit("setPosts", posts); */
      } else {
        this.$store.commit("setPosts", this.dedupePosts(posts));
      }

      this.hasNext = !!posts.length;

      if (!refresh) {
        this.$utils.setGlobalOffset(offset);
      }
      //@Todo show empty posts component if list empty
      this.loading = false;
    },

    async registerPushToken(token) {
      try {
        await api.setupNotifications(token);
      } catch (err) {
        console.error("Err register push token:", err);
        this.$store.commit("setLastError", err);
        this.error = err.message;
      }
    }
  },
  async mounted() {
    let vm = this;
    window.addEventListener("scroll", () => {
      vm.onTop = window.pageYOffset === 0;
    });

    const qToken = this.$route.query.pushtoken;
    if (qToken) {
      //Query token takes priority
      await this.registerPushToken(qToken);
    } else {
      const token = localStorage.getItem("pushToken");
      if (token) {
        await this.registerPushToken(token);
      }
    }
  }
};
</script>

<style></style>
