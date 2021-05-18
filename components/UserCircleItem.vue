<template>
  <nuxt-link :to="`/users/${user.id}`">
    <div class="h-40 w-32 grid grid-rows-6 items-center justify-between my-1">
      <img
        :src="$utils.parseUrl(user.photoURL + `?height=100`)"
        class="mx-auto row-span-4 h-full w-32 object-cover rounded-2xl overflow-hidden"
      />
      <div class="mt-auto flex flex-col items-center">
        <span class="text-center pt-2 pb-1 truncate">{{
          $utils.snipText(user.name, 10)
        }}</span>
        <span class="User__giv__tags__tag truncate">{{
          $utils.snipText(randomMatchingSkill, 8)
        }}</span>
      </div>
    </div>
  </nuxt-link>
</template>

<script>
export default {
  props: ["user"],
  computed: {
    randomMatchingSkill() {
      if (!this.user || !this.user.skills || !this.user.skills.length) {
        return "";
      }
      const id = this.user.skills[0];
      return this.$store.getters.getSkillTag(id).tag;
    }
  },
  mounted() {}
};
</script>
