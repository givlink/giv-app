<template>
  <div class="Invite">
    <div class="Inner Invite__inner">
      <div class="Invite__logo">
        <img class="Invite__logo__img" src="~/assets/image/giv_logo.png" alt="giv">
      </div>
      <div class="Invite__form">
        <div class="Invite__btn">
          <button v-on:click="checkCode()" class="Invite__btn__link">ログインする</button>
        </div>
        <p class="Invite__error">{{hasError}}</p>
      </div>
    </div>
  </div>
</template>

<script>
    import axios from 'axios';
    import jwt from 'jwt-decode';
    const Cookie = process.client ? require('js-cookie') : undefined;
    export default {
        layout: 'noheader',
        middleware: 'auth',
        data() {
            return {
                code: '',
                hasError: '',
            }
        },
        mounted() {
            // ここから追加
        },
        methods: {
            checkCode(){
                const token = this.$auth.$storage.getUniversal("_token.auth0");
                if(token && token !== '') {

                    let decoded = jwt(token);
                    if(decoded.exp > new Date().getTime() / 1000) {
                        const baseUrl = process.env.baseUrl + '/login';
                        const getUrl = encodeURI(baseUrl);
                        const config = {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: token
                            }
                        };
                        return axios.get(baseUrl, config)
                            .then((res) => {
                              this.$router.push("/");
                            })
                            .catch((e) => {
                                this.hasError = 'ログインに失敗しました。';
                            });
                    } else {
                        this.$auth.loginWith('auth0');
                    }
                } else {
                    this.$auth.loginWith('auth0');
                }
            }
        }
    }
</script>

<style>

</style>
