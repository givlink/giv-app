<template>
  <div class="Home Main text-center font-mono">
    <h2
      class="uppercase text-sm tracking-widest border-b border-indigo-400 text-gray-500"
    >
      Debug
    </h2>
    <div class="mt-3 py-2 shadow-sm rounded bg-white">
      <div class="flex flex-col">
        <label class="uppercase text-xs tracking-widest text-gray-500"
          >PushToken</label
        >
        <span class="text-base">{{ pushToken }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../lib/api";
export default {
  layout: "logined",
  data() {
    return {
      count: 0,
      user: null,
      pushToken: null
    };
  },
  async created() {},
  async mounted() {
    this.pushToken = this.$store.getters.getPushToken();
  },
  methods: {
    deleteCount() {
      this.count = 0;
    }
  }
};
</script>
