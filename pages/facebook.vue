<template>
  <div class="Invite">
    <div class="Inner Invite__inner">
      <button @click="authenticate">Facebook login </button>
    </div>
  </div>
</template>

<script>
    import Logo from '~/components/Logo.vue'

    export default {
        methods: {
            auth: false,
            authenticate() {
                this.$auth.loginWith('facebook');
            },
        },
    }
</script>

<style>
</style>
