<template>
  <div class="User__giv" v-if="!recommendationsLoading && users.length > 0">
    <h3 class="User__giv__title">{{ label }}</h3>
    <ul class="flex items-center overflow-x-auto overflow-y-hidden space-x-3">
      <UserCircleItem
        :user="user"
        class=""
        v-for="user of users"
        :key="user.id"
      />
    </ul>
  </div>
</template>

<script>
import api from "@/lib/api";
import UserCircleItem from "@/components/UserCircleItem";
import { mapState } from "vuex";

export default {
  props: ["type", "label"],
  computed: {
    ...mapState(["recommendations", "recommendationsLoading"]),
    users() {
      return this.$utils.shuffleArray(this.recommendations[this.type]);
    }
  },
  components: {
    UserCircleItem
  }
};
</script>
