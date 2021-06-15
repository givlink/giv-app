<template>
  <div class="Notification Main mt-6">
    <ul class="Notification__list">
      <li class="Notification__list__li" v-for="item of notifications">
        <GivRequestCard v-if="item.type === 'givRequest'" :item="item" />
      </li>
    </ul>
  </div>
</template>

<script>
import api from "@/lib/api";
import GivRequestCard from "@/components/GivRequestCard.vue";
import { mapState } from "vuex";

export default {
  layout: "logined-notifications",
  components: { GivRequestCard },
  computed: {
    ...mapState(["notifications"])
  },
  methods: {
    async markAsRead(id) {
      const { uid } = api.getCurrentUser();
      //@Todo err handling
      api.updateNotification({ userId: this.uid, id, status: "read" });
    }
  }
};
</script>
