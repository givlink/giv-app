<template>
  <div class="Search Main">
    <div class="Search__box">
      <form v-on:submit.prevent="search" class="Search__box__form">
        <b-form-input
          id=""
          class="Search__box__form__input"
          v-model="searchQuery"
          placeholder="ユーザー検索"
        ></b-form-input>
        <span class="Search__box__form__submit" v-on:click="search()" />
      </form>
      <div class="Search__box__tags" v-if="skills">
        <template v-for="item of skills">
          <span
            v-on:click="clickTag(item.id, 'skills')"
            :class="item.id == searchTag && 'Search__box__tags__tag__active'"
            class="Search__box__tags__tag"
            >{{ item.tag }}</span
          >
        </template>
      </div>
      <div class="Search__box__tags" v-if="areas">
        <template v-for="item of areas">
          <span
            v-on:click="clickTag(item.id, 'area')"
            :class="item.id == searchTag && 'Search__box__tags__tag__active'"
            class="Search__box__tags__tag"
            >{{ item.tag }}</span
          >
        </template>
      </div>
    </div>
    <ul class="Search__list" style="margin-top:75px;">
      <li class="Search__list__li" v-for="item of users">
        <nuxt-link :to="`/users/${item.id}`" class="Search__list__li__link">
          <div class="Search__list__li__link__icon">
            <b-img
              :src="$utils.parseUrl(item.photoURL)"
              class="Search__list__li__link__icon__img"
              alt
            ></b-img>
          </div>
          <div class="Search__list__li__link__text">
            <p class="Search__list__li__link__text__name">
              {{ item.name }} さん
            </p>
            <p class="Search__list__li__link__text__tags">
              <span
                class="Search__list__li__link__text__tags__text"
                v-for="skill of item.skills"
              >
                {{ renderTag(skill) }}
              </span>
            </p>
          </div>
        </nuxt-link>
      </li>
      <li class="Search__list__li" v-if="hasNext" v-on:click="loadmore()">
        <span
          class="Search__list__li__link"
          style="text-align: center;font-size: 1.6em;"
          >さらに読み込む</span
        >
      </li>
    </ul>
  </div>
</template>

<script>
import api from "../../lib/api";

export default {
  layout: "logined",
  data() {
    return {
      searchField: null,
      searchTag: null,
      searchQuery: "",
      offset: null,
      limit: 30,
      hasNext: true
    };
  },
  watch: {
    searchQuery: async function(val, oldVal) {
      if (val !== "") {
        this.searchTag = "";
        this.searchField = "";
      }
      if (val === "" && !this.searchTag && !this.searchField) {
        const [users, offset] = await api.listUsers();
        this.users = users;
        this.offset = offset;
      }
    }
  },
  async asyncData({ app }) {
    const skillsMap = await api.listSkills();
    const areasMap = await api.listAreas();
    const [users, offset] = await api.listUsers();
    return {
      skills: Object.values(skillsMap),
      areas: Object.values(areasMap),
      users,
      offset
    };
  },
  async mounted() {
    if (
      !this.$store.state.skillsMap ||
      Object.keys(this.$store.state.skillsMap).length === 0
    ) {
      this.$store.commit("setSkillsMap", await api.listSkills());
    }
  },
  methods: {
    makeTagFilter() {
      if (!this.searchTag || this.searchTag == "" || !this.searchField) {
        return null;
      }

      let result = [this.searchField, "array-contains", this.searchTag];
      if (this.searchField === "area") {
        result = [this.searchField, "==", this.searchTag];
      }
      return result;
    },

    renderTag(id) {
      try {
        return this.$store.getters.getSkillTag(id).tag;
      } catch (err) {
        return id;
      }
    },
    async clickTag(id, field) {
      this.searchQuery = "";
      this.searchTag = id;
      this.searchField = field;

      const [users, offset] = await api.listUsers(
        null,
        this.limit,
        this.makeTagFilter()
      );

      this.users = users;
      this.offset = offset;
    },
    dedupeUser(users) {
      const map = [];
      users.forEach(u => (map[u.id] = u));
      return Object.values(map);
    },
    async loadmore() {
      const [users, offset] = await api.listUsers(
        this.offset,
        this.limit,
        this.makeTagFilter()
      );
      this.users = this.dedupeUser([...this.users, ...users]);
      this.offset = offset;
    },
    async search() {
      if (this.searchQuery !== "") {
        const [users, offset] = await api.listUsers(null, 5, [
          "name",
          ">",
          this.searchQuery
        ]);
        this.users = users;
        this.offset = offset;
      } else {
        const [users, offset] = await api.listUsers();
        this.users = users;
        this.offset = offset;
      }
    }
  }
};
</script>

<style></style>
