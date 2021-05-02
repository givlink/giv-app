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
      <div class="Search__box__tags" v-if="Object.values(skillsMap).length">
        <template v-for="item of Object.values(skillsMap)">
          <span
            v-on:click="clickTag(item.id, 'skills')"
            :class="
              userSearchFilter.type === 'skills' &&
                item.id == userSearchFilter.value &&
                'Search__box__tags__tag__active'
            "
            class="Search__box__tags__tag"
            >{{ item.tag }}</span
          >
        </template>
      </div>
      <div class="Search__box__tags" v-if="Object.values(areasMap).length">
        <template v-for="item of Object.values(areasMap)">
          <span
            v-on:click="clickTag(item.id, 'area')"
            :class="
              userSearchFilter.type === 'area' &&
                item.id == userSearchFilter.value &&
                'Search__box__tags__tag__active'
            "
            class="Search__box__tags__tag"
            >{{ item.tag }}</span
          >
        </template>
      </div>
    </div>
    <ul class="Search__list" style="margin-top:75px;">
      <li class="Search__list__li" v-for="item of userSearchItems">
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
      <div v-if="userSearchLoading" class="flex items-center justify-center">
        <b-spinner label="Loading..." :variant="'primary'"></b-spinner>
      </div>
      <li v-else class="Search__list__li" v-on:click="loadMoreUserSearch">
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
import { mapState, mapActions } from "vuex";

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
  computed: mapState([
    "userSearchFilter",
    "userSearchLoading",
    "userSearchItems",
    "skillsMap",
    "areasMap"
  ]),
  watch: {
    searchQuery: async function(val, oldVal) {
      if (val !== "") {
        this.searchTag = "";
        this.searchField = "";
      }
      if (val === "" && !this.searchTag && !this.searchField) {
        this.$store.dispatch({
          type: "updateUserSearchFilter",
          filter: { type: null, value: null },
          resetOffset: true
        });
      }
    }
  },
  methods: {
    ...mapActions(["loadMoreUserSearch"]),
    renderTag(id) {
      try {
        return this.$store.getters.getSkillTag(id).tag;
      } catch (err) {
        return id;
      }
    },
    async clickTag(value, filterType) {
      this.searchQuery = "";

      this.$store.dispatch({
        type: "updateUserSearchFilter",
        filter: { type: filterType, value },
        resetOffset: true
      });
    },
    async search() {
      if (this.searchQuery !== "") {
        this.$store.dispatch({
          type: "updateUserSearchFilter",
          filter: { type: "name", value: this.searchQuery },
          resetOffset: true
        });
      }
    }
  }
};
</script>

<style></style>
