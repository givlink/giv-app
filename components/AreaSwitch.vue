<template>
  <div class="flex items-center justify-center mb-6 space-x-1">
    <button
      v-on:click="selectArea('all')"
      :class="selected == 'all' && 'Search__box__tags__tag__active'"
      class="Search__box__tags__tag focus:outline-none border border-gray-300"
    >
      全体
    </button>
    <button
      v-on:click="selectArea('sakai')"
      :class="selected == 'sakai' && 'Search__box__tags__tag__active'"
      class="Search__box__tags__tag focus:outline-none border border-gray-300"
    >
      泉北ニュータウン
    </button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      selected: "all"
    };
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
