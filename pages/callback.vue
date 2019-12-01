<template>
  <div class="Home Main text-center">
    <b-spinner label="Spinning"></b-spinner>
  </div>
</template>

<script>
    const Cookie = process.client ? require('js-cookie') : undefined;
    export default {
        mounted() {
        },
        methods: {
            logout() {

                this.$auth.logout();
            }
        }
    }
</script>

<style>
</style>
