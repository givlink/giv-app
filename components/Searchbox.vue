<template>
  <form v-on:submit.prevent="submit" class="relative group">
    <input
      class="w-full py-2.5 pl-2.5 rounded focus:outline-none leading-none text-sm bg-gray-200"
      v-model="value"
      :placeholder="placeholder"
    />
    <button @click="submit" class="absolute right-0 top-0 bottom-0 mb-2 mr-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </button>
  </form>
</template>

<script>
export default {
  props: ["placeholder"],
  methods: {
    submit() {
      this.$emit("submit", this.value);
    },
  },
  data() {
    return {
      value: "",
    };
  },
};
</script>
