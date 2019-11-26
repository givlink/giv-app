<template>
  <div class="Home Main text-center">
    <b-spinner label="Spinning"></b-spinner>

    <button @click="logout">Facebook login </button>
  </div>
</template>

<script>
    const Cookie = process.client ? require('js-cookie') : undefined;
    export default {
        mounted() {
            // ここから追加
            console.log(Cookie.get("auth._token.facebook"));
            console.log("hoge");

            console.log(this.$auth.token)
            console.log(this.$store.state.auth);

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
