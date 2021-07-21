<template>
  <div
    :class="
      isSenderCurrent
        ? 'mine relative ml-auto bg-giv-blue-dark text-white'
        : 'mr-auto bg-gray-100 text-gray-800'
    "
    class="w-4/5 mb-2 rounded-xl"
  >
  <span v-if="showName" class="block pt-2 -mb-2 font-bold text-sm pl-2.5 underline">{{message.senderName}}</span>
    <div class="pt-3 pb-2 px-2.5 mx-1">
      <p class="text-sm" style="font-weight:bolder;">{{ message.content }}</p>
      <span class="-mt-1 block text-right text-xs text-gray-200 leading-none">12:13</span>
    </div>
  </div>
</template>

<script>
import api from "@/lib/api";
export default {
  props: ["message", "group"],
  computed: {
    isSenderCurrent() {
      return this.message.senderId === "kashif";
    },
    showName() {
      //In group show each members name
      return this.group && Object.keys(this.group.members).length > 2 && !this.isSenderCurrent;
    },
  },
};
</script>

<style>
.mine:after {
  content: "";
  position: absolute;
  z-index: 1;
  bottom: -5px;
  right: 0;
  width: 15px;
  height: 20px;
  background: inherit;
  border-bottom-left-radius: 20px;
}
</style>
