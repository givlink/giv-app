<template>
  <div
    v-show="shouldShow"
    class="flex items-center justify-center mb-3 space-x-1"
  >
    <button
      v-on:click="selectArea('all')"
      :class="filterArea == 'all' && 'Search__box__tags__tag__active'"
      class="Search__box__tags__tag focus:outline-none border border-gray-300"
    >
      全体
    </button>
    <button
      v-on:click="selectArea('senboku')"
      :class="filterArea == 'senboku' && 'Search__box__tags__tag__active'"
      class="Search__box__tags__tag focus:outline-none border border-gray-300"
    >
      泉北ニュータウン
    </button>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["userProfile", "userProfileLoading", "filterArea"]),
    shouldShow() {
      return (
        !this.userProfileLoading &&
        this.userProfile &&
        this.userProfile.area == "senboku"
      );
    }
  },
  methods: {
    selectArea(area) {
      this.$store.commit("setFilterArea", area);
    }
  }
};
</script>
