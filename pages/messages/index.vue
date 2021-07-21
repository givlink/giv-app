<template>
  <div class="mt-12 mb-24 h-full">
    <Searchbox placeholder="メッセージ検索" class="mx-1 mt-3 pb-1" @submit="filterChats" />
    <ul class="space-y-0.5 py-2">
      <li v-for="g in userGroups"><ChatGroupCard :group="g" /></li>
    </ul>
  </div>
</template>
<script>
import ChatGroupCard from "@/components/ChatGroupCard.vue";
import Searchbox from "@/components/Searchbox.vue";
export default {
  layout: "logined-messages",
  components: {
    ChatGroupCard,
    Searchbox,
  },
  methods: {
    filterChats(query) {
      console.log("got seeach:", query);
    },
  },
  data() {
    return {
      userGroups: [
        {
          id: 121212,
          name: "Kashif-Nao",
          members: { kashif: true, nao: true },
          unreadCount: 2,
          lastMessage: {
            content: "Hello THere!!",
            timestamp: new Date(),
          },
        },
        {
          id: 121212,
          name: "Kashif-Ai",
          members: { kashif: true, ai: true },
          unreadCount: 0,
          lastMessage: {
            content: "Hello THere!!",
            timestamp: new Date(),
          },
        },
      ],
    };
  },
};
</script>
