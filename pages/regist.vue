<template>
  <div v-if="isShow" class="Regist Main">
    <div class="Regist__flow">
      <div class="Regist__flow__position">
        <img class="Regist__flow__position__img" src="~/assets/image/regist_flow_01.png" alt="giv" />
      </div>
      <div class="Regist__flow__text">
        <p class="Regist__flow__text__box">
          プロフィール
          <br />確認
        </p>
        <p class="Regist__flow__text__box">giv登録</p>
        <p class="Regist__flow__text__box">場所登録</p>
        <p class="Regist__flow__text__box">興味登録</p>
      </div>
    </div>
    <div class="Regist__main">
      <div class="Regist__main__profile">
        <h3 class="Regist__main__profile__text">プロフィールの確認</h3>
        <div class="Regist__main__profile__icon">
          <b-img :src="`${img}`" class="Regist__main__profile__icon__img" alt></b-img>
        </div>
        <p class="Regist__main__profile__name">{{last_name}} {{first_name}}</p>
        <!--        <p class="Regist__main__profile__position">KDS</p>-->
      </div>
      <div class="Regist__main__bottom">
        <button v-on:click="next" class="Invite__btn__link">次へ</button>
      </div>
    </div>
  </div>
</template>

<script>
    import axios from 'axios';
    const Cookie = process.client ? require('js-cookie') : undefined;
    export default {
        data() {
            return {
                img: "",
                first_name: "",
                last_name: "",
                isShow: false
            };
        },
        mounted() {
            const token = this.$auth.$storage.getUniversal("_token.auth0");
            if(token && token !== '') {
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
                        this.$auth.fetchUser();
                        const user = this.$auth.$storage.getState("user");
                        this.img = user.picture;
                        this.first_name = user.given_name;
                        this.last_name = user.family_name;
                        this.isShow = true;
                    });
            } else {
                this.$auth.loginWith('auth0');
            }
        },
        methods: {
            next() {
                this.$store.commit("setImg", this.img);
                this.$store.commit("setFirstName", this.first_name);
                this.$store.commit("setLastName", this.last_name);
                Cookie.set('img', this.img);
                Cookie.set('first_name', this.first_name);
                Cookie.set('last_name', this.last_name);
                this.$router.push("/regist_giv");
            }
        }
    };
</script>

<style>
</style>
