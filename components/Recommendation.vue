<template>
  <div class="User__giv" v-if="!recommendationsLoading && users.length > 0">
    <h3 class="User__giv__title">{{ getLabel }}</h3>
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
    },
    getLabel() {
      if (this.label) return this.label;

      switch (this.type) {
        case "matchingYourInterests":
          return "受け取ってみませんか？　あなたが興味/関心あるギブを提供できるメンバー";
        case "matchingYourSkills":
          return "贈ってみませんか？　あなたのギブに興味/関心があるメンバー";
        case "similarInterests":
          return "あなたと同じ興味/関心を持つメンバー";
      }

      return "";
    }
  },
  components: {
    UserCircleItem
  }
};
</script>
