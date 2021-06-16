<template>
  <div class="Notification Main mt-6 mb-12">
    <ul class="Notification__list">
      <li class="Notification__list__li" v-for="item of givRequests.combined">
        <GivRequestCard :item="item" />
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
    ...mapState(["givRequests"])
  },
  methods: {}
};
</script>
