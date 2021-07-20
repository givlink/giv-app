<template>
  <footer class="bg-white z-10 pl-1.5 py-1.5 flex items-center">
    <textarea
      placeholder="Message"
      v-model="text"
      rows="1"
      @input="resizeTextarea"
      style="max-height:200px;"
      class="rounded-lg resize-none overflow-auto w-full bg-gray-200 pl-3 pr-1 py-2.5 text-base"
    />
    <button class="pr-1" @click="sendMessage">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-12 w-12 text-giv-blue"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </footer>
</template>

<script>
import api from "../lib/api";
import { mapState } from "vuex";
export default {
  methods: {
    sendMessage() {
      this.text = ""; //reset text
    },
    resizeTextarea(e) {
      let area = e.target;
      area.style.height = "auto";
      area.style.height = area.scrollHeight + "px";
    },
  },
  data() {
    return {
      text: "",
    };
  },
};
</script>

<style></style>
