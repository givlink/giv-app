<template>
  <nuxt-link :to="`/messages/${group.id}`">
    <div class="h-24 pl-2 shadow-sm bg-white grid grid-cols-10">
      <div class="py-2 mx-auto col-span-2">
        <img
          src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=668&q=80"
          class="mx-auto h-16 w-16 rounded-full border-2 border-gray-300 object-cover overflow-hidden"
        />
      </div>
      <div class="pt-2 pb-1 pr-2 pl-1 col-span-8">
        <div class="flex items-center justify-between">
          <h2 class="text-base font-bold">{{ groupName }}</h2>
          <span class="font-bold">{{ lastTimestamp }}</span>
        </div>
        <div class="flex-1 grid grid-cols-10" style="height:60px;">
          <p v-if="group.lastMessage" class="text-sm col-span-8 overflow-clip overflow-hidden">
            {{ $utils.snipText(group.lastMessage.content, 50) }}
          </p>
          <div class="col-span-2 flex items-end justify-end">
            <span
              v-if="!!group.unreadCount"
              class="text-xs bg-giv-blue text-white font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-sm"
              >{{ group.unreadCount }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </nuxt-link>
</template>
<script>
export default {
  props: ["group"],
  data() {
    return {
      currUser: {
        id: "kashif",
      },
    };
  },
  mounted() {
    /* console.log('group:', this.group) */
  },
  computed: {
    groupName() {
      const memKeys = Object.keys(this.group.members);
      if (memKeys.length == 2) {
        for (let m of memKeys) {
          if (m != this.currUser.id) {
            //@Todo fetch the user profile and show correct name here
            return m;
          }
        }
      }
      return "Group";
    },
    lastTimestamp() {
      //@Todo
      return "2 hrs ago.";
    },
  },
};
</script>
