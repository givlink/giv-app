<template>
  <div class="bg-white block py-2 px-2 rounded mx-1 my-1">
    <div class="flex items-start">
      <div class="pr-3">
        <img
          :src="$utils.parseUrl(item.receiver && item.receiver.photoURL)"
          class="h-20 w-20 rounded-full object-cover"
          alt=""
        />
      </div>
      <div class="flex-1 h-full flex flex-col pt-2">
        <h3 class="text-sm font-semibold text-gray-700">
          {{ item.receiver && item.receiver.name }}
        </h3>
        <p class="text-xs">
          <span v-if="item.requestType === 'receive'">
            wants to receive a Giv from you
          </span>
          <span v-if="item.requestType === 'send'">
            wants to send a Giv to you
          </span>
        </p>
        <span class="block text-right flex-1 pt-auto">
          {{ $utils.parseDate(item.createdAt) }}
        </span>
      </div>
    </div>
    <div class="w-full mt-2 flex items-center justify-between space-x-3">
      <nuxt-link
        :to="`/users/${item.receiverId}`"
        class="border-giv-blue border-blue-500 border rounded-full px-4 py-2"
      >
        プロファイルを見る
      </nuxt-link>
      <button
        class="text-white font-semibold bg-giv-blue border-blue-500 border rounded-full px-4 py-2"
      >
        リクエスト承認
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["item"],
  /* Notification__list__li__link__icon__img */
  methods: {
    renderTag(id) {
      try {
        return this.$store.getters.getSkillTag(id).tag;
      } catch (err) {
        return id;
      }
    }
  }
};

/* <ul class="flex items-center flex-wrap space-y-1 py-2"> */
/*   <li */
/*     v-for="(tag, index) in item.receiver.interests" */
/*     class="inline px-2 py-1 mr-2 rounded-full border border-gray-500" */
/*     v-show="index <= 1" */
/*   > */
/*     {{ renderTag(tag) }} */
/*   </li> */
/* </ul> */
</script>
