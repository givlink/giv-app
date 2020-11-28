<template>
  <div class="Invite">
    <div class="Inner Invite__inner">
      <div class="Invite__logo">
        <img class="Invite__logo__img" src="~/assets/image/giv_logo.png" alt="giv">
      </div>
      <div class="Invite__form">
        <div class="Invite__input">
          <p class="Invite__input__text">招待コードを入力してください</p>
          <b-form-input
            id=""
            class="Invite__input__input"
            v-model="code"
            placeholder="招待コード"
          ></b-form-input>
          <a href="https://giv.link/" class="Invite__input__link">招待コードを取得するにはこちらからご登録ください。</a>
        </div>
        <div class="Invite__btn">
          <button v-on:click="checkCode" class="Invite__btn__link">次へ</button>
        </div>
        <p class="Invite__error">{{hasError}}</p>
      </div>
    </div>
  </div>
</template>

<script>
    import axios from 'axios';
    const Cookie = process.client ? require('js-cookie') : undefined;
    export default {
        layout: 'noheader',
    data() {
        return {
            code: '',
            hasError: '',
        }
    },
    mounted() {
        // ここから追加
        this.code = this.$route.hash != '' ? this.$route.hash.slice(1) : '';
    },
    methods: {
        async checkCode(){
            this.hasError = '';
            const baseUrl = process.env.baseUrl + '/invitation_codes/' + this.code;
            const getUrl = encodeURI(baseUrl);
            return axios.get(baseUrl)
                .then((res) => {
                    this.$store.commit("setCode", this.code);
                    Cookie.set('code', this.code, { expires: 3 }); // saving token in cookie for server rendering
                    this.$auth.loginWith('auth0')
                })
                .catch((e) => {
                    this.hasError = '招待コードが間違っています';
                });
        }
    }
}
</script>

<style>

</style>
