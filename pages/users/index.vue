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
      <div class="flex items-center space-x-1 text-xs my-2">
        <select
          :value="selectedItem"
          @change="setSelected($event)"
          class="flex-1 border border-gray-200 rounded h-8 px-1 py-2"
        >
          <option value="" selected class="text-center"
            >興味・関心フィルター</option
          >
          <slot v-for="[cat, skills] in makeOptions2(skillsMap, 'skills')">
            <optgroup :key="cat.id" :label="cat.tag">
              <option
                class="block pl-1 py-1"
                v-for="(s, j) in skills"
                :value="s.id"
                >{{ s.tag }}</option
              >
            </optgroup>
          </slot>
        </select>
        <select
          :value="selectedItemArea"
          @change="setSelectedArea($event)"
          class="flex-1 border border-gray-200 rounded h-8 px-1 py-2"
        >
          <option value="" selected class="text-center">場所フィルター</option>
          <slot v-for="[cat, areas] in makeOptions2(areasMap, 'area')">
            <optgroup :key="cat.id" :label="cat.tag">
              <option
                class="block pl-1 py-1"
                v-for="(s, j) in areas"
                :value="s.id"
                >{{ s.tag }}</option
              >
            </optgroup>
          </slot>
        </select>
      </div>
    </div>
    <div class="mt-20" />
    <div v-if="!selectedItem && !selectedItemArea">
      <Recommendation type="matchingYourInterests" />
      <Recommendation type="matchingYourSkills" />
      <Recommendation type="similarInterests" />
    </div>
    <ul class="Search__list">
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
import api from "@/lib/api";
import OpenIndicator from "@/components/OpenIndicator";
import Recommendation from "@/components/Recommendation";
import Deselect from "@/components/Deselect";
import { mapState, mapActions } from "vuex";

export default {
  layout: "logined",
  components: {
    Recommendation
  },
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
      "areasMap",
      "areaCategories",
      "skillCategories"
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
    makeOptions2(map, type) {
      const result = [];

      let looper = this.skillCategories;
      if (type === "area") looper = this.areaCategories;

      looper.forEach(ac => {
        const itemsInCategory = [];
        Object.values(map).forEach(i => {
          if (i.category === ac.id) {
            itemsInCategory.push(i);
          }
        });
        const item = [ac, itemsInCategory];
        if (itemsInCategory.length) result.push(item);
      });

      return result;
    },
    setSelected(e) {
      const key = e.target.value;
      const val = this.skillsMap[key];
      this.selectedItem = key;
      this.selectedItemArea = null;
      const filter = { type: null, value: null };
      if (val) {
        this.searchQuery = "";
        filter.type = "skills";
        filter.value = val.id;
      }
      this.$store.dispatch({
        type: "updateUserSearchFilter",
        filter: filter,
        resetOffset: true
      });
    },
    setSelectedArea(e) {
      const key = e.target.value;
      const val = this.areasMap[key];
      this.selectedItemArea = key;
      this.selectedItem = null;
      const filter = { type: null, value: null };
      if (val) {
        this.searchQuery = "";
        filter.type = "area";
        filter.value = val.id;
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
