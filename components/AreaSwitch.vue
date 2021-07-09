<template>
  <div
    v-show="shouldShow"
    class="flex items-center justify-center mb-3 space-x-1"
  >
    <button
      v-on:click="selectArea('all')"
      :class="selected == 'all' && 'Search__box__tags__tag__active'"
      class="Search__box__tags__tag focus:outline-none border border-gray-300"
    >
      全体
    </button>
    <button
      v-on:click="selectArea('senboku')"
      :class="selected == 'senboku' && 'Search__box__tags__tag__active'"
      class="Search__box__tags__tag focus:outline-none border border-gray-300"
    >
      泉北ニュータウン
    </button>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      selected: "all"
    };
  },
  computed: {
    ...mapState(["userProfile", "userProfileLoading"]),
    shouldShow() {
      return (
        !this.userProfileLoading &&
        this.userProfile &&
        this.userProfile.area == "senboku"
      );
    }
  },
  mounted() {
    this.selected = this.$store.getters.getFilterArea();
  },
  methods: {
    selectArea(area) {
      this.$store.commit("setFilterArea", area);
      this.selected = area;
    }
  }
};
</script>
