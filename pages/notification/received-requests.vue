<template>
  <div class="Notification Main mt-3">
    <ul class="Notification__list">
      <li class="Notification__list__li" v-for="item of notifications">
        <GivRequestSend
          v-if="item.type === 'givRequest' && item.requestType == 'send'"
          :item="item"
        />
        <GivRequestReceive
          v-if="item.type === 'givRequest' && item.requestType == 'receive'"
          :item="item"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import api from "@/lib/api";
import GivRequestSend from "@/components/GivRequestSend.vue";
import GivRequestReceive from "@/components/GivRequestReceive.vue";
import { mapState } from "vuex";

export default {
  layout: "logined-notifications",
  components: { GivRequestSend, GivRequestReceive },
  computed: {
    ...mapState(["notifications"])
  },
  methods: {
    async markAsRead(id) {
      const { uid } = api.getCurrentUser();
      api.updateNotification({ userId: this.uid, id, status: "read" });
    }
  }
};
</script>
