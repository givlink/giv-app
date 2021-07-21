<template>
  <div class="h-screen flex flex-col bg-white">
    <Header :title="group.name" />
    <ul id="chats" class="overflow-auto mt-16 mb-20 flex-1 h-full bg-white px-2" ref="chats">
      <li v-for="g in messages" :id="`msg-${g.id}`" :key="g.id">
        <MessageRowItem :group="group" :message="g" />
      </li>
    </ul>
    <Footer class="fixed bottom-0 w-full" />
  </div>
</template>
<script>
import Header from "~/components/HeaderMessageDetails.vue";
import Footer from "~/components/MessageFooter.vue";
import MessageRowItem from "@/components/MessageRowItem.vue";
export default {
  layout: "empty",
  components: {
    MessageRowItem,
    Header,
    Footer,
  },
  computed: {
    showTitle() {
      return true;
    },
  },
  mounted() {
    this.$nextTick(() => {
      const id = `#msg-${this.lastSeenId}`;
      const target = this.$el.querySelector(id);
      this.scrollToLastItem(target); //@Todo incomplete, update lastSeenId when user reads
    });
  },
  methods: {
    scrollToLastItem(target) {
      const container = this.$el.querySelector("#chats");
      if (target) {
        container.scrollTop = target.offsetTop;
      } else {
        container.scrollTop = container.scrollHeight;
      }
    },
    makeMsgs() {
      const msgs = [];
      for (let i = 0; i < 100; i++) {
        const id = `msg-${i}`;
        msgs.push({
          id,
          senderId: "nao",
          senderName: "Nao",
          content: "Msg-" + id,
          timestamp: new Date(),
        });
      }
      return msgs;
    },
  },
  data() {
    return {
      group: {
        id: 121212,
        name: "Kashif-Nao",
        members: { kashif: true, nao: true },
        unreadCount: 2,
        lastMessage: {
          content: "Hello THere!!",
          timestamp: new Date(),
        },
      },
      lastSeenId: 25,
      messages: [
        {
          id: 1,
          senderId: "nao",
          senderName: "Nao",
          content:
            "HHi, I'm Nao, some very long mesaageHi, I'm Nao, some very long mesaageHi, I'm Nao, some very long mesaagei, I'm Nao, some very long mesaage",
          timestamp: new Date(),
        },
        {
          id: 2,
          senderId: "kashif",
          senderName: "Kashif",
          content: "Hello There! how are you?",
          timestamp: new Date(),
        },
        {
          id: 3,
          senderId: "kashif",
          senderName: "Kashif",
          content: "I am good how about you",
          timestamp: new Date(),
        },
        {
          id: 4,
          senderId: "nao",
          senderName: "Nao",
          content:
            "HHi, I'm Nao, some very long mesaageHi, I'm Nao, some very long mesaageHi, I'm Nao, some very long mesaagei, I'm Nao, some very long mesaage",
          timestamp: new Date(),
        },
        {
          id: 5,
          senderId: "kashif",
          senderName: "Kashif",
          content: "Hello There! how are you?",
          timestamp: new Date(),
        },
        {
          id: 6,
          senderId: "kashif",
          senderName: "Kashif",
          content: "I am good how about you",
          timestamp: new Date(),
        },
        {
          id: 7,
          senderId: "nao",
          senderName: "Nao",
          content:
            "HHi, I'm Nao, some very long mesaageHi, I'm Nao, some very long mesaageHi, I'm Nao, some very long mesaagei, I'm Nao, some very long mesaage",
          timestamp: new Date(),
        },
        {
          id: 8,
          senderId: "kashif",
          senderName: "Kashif",
          content: "Hello There! how are you?",
          timestamp: new Date(),
        },
        {
          id: 9,
          senderId: "kashif",
          senderName: "Kashif",
          content: "I am good how about you",
          timestamp: new Date(),
        },
      ],
    };
  },
};
</script>
