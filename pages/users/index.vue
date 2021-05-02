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
      <div class="flex items-center space-x-1 text-xs">
        <v-select
          class="flex-1 py-2"
          :value="selectedItem"
          @input="setSelected"
          placeholder="興味・関心フィルター"
          :options="makeOptions(skillsMap, 'skills')"
          :components="{ OpenIndicator, Deselect }"
        ></v-select>
        <v-select
          class="flex-1 py-2"
          :value="selectedItemArea"
          @input="setSelectedArea"
          placeholder="場所フィルター"
          :options="makeOptions(areasMap, 'area')"
          :components="{ OpenIndicator, Deselect }"
        ></v-select>
      </div>
    </div>
    <ul class="Search__list" style="margin-top:15px;">
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
import OpenIndicator from "../../components/OpenIndicator.vue";
import Deselect from "../../components/Deselect.vue";
import { mapState, mapActions } from "vuex";

export default {
  layout: "logined",
  data() {
    return {
      OpenIndicator,
      Deselect,
      searchField: null,
      searchTag: null,
      searchQuery: "",
      selectedItem: null,
      selectedItemArea: null,
      offset: null,
      limit: 30,
      hasNext: true
    };
  },
  computed: {
    ...mapState([
      "userSearchFilter",
      "userSearchLoading",
      "userSearchItems",
      "skillsMap",
      "areasMap"
    ])
  },
  watch: {
    searchQuery: async function(val, oldVal) {
      if (val !== "") {
        this.searchTag = "";
        this.searchField = "";
        this.selectedItem = null;
        this.selectedItemArea = null;
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
    makeOptions(map, type) {
      return Object.values(map).map(v => {
        return {
          type: type,
          key: v.id,
          label: v.tag
        };
      });
    },
    setSelected(val) {
      this.selectedItem = val;
      this.selectedItemArea = null;
      const filter = { type: null, value: null };
      if (val) {
        this.searchQuery = "";
        filter.type = val.type;
        filter.value = val.key;
      }
      this.$store.dispatch({
        type: "updateUserSearchFilter",
        filter: filter,
        resetOffset: true
      });
    },
    setSelectedArea(val) {
      this.selectedItemArea = val;
      this.selectedItem = null;
      const filter = { type: null, value: null };
      if (val) {
        this.searchQuery = "";
        filter.type = val.type;
        filter.value = val.key;
      }
      this.$store.dispatch({
        type: "updateUserSearchFilter",
        filter: filter,
        resetOffset: true
      });
    },
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

<style>
.v-select .vs__selected-options {
  flex-wrap: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vs__dropdown-toggle {
  border: 1px solid #d0d0d0;
}
</style>
