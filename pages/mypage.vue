<template>
  <div class="User Main">
    <div class="User__profile">
      <div class="User__profile__icon">
        <b-img :src="`https://api-dev.giv.link${me.profile_image_path}`" class="User__profile__icon__img" alt></b-img>
      </div>
      <p class="User__profile__name">{{me.last_name}} {{me.first_name}}</p>
<!--      <p class="User__profile__position">KDS</p>-->
      <p class="User__profile__message">{{me.introduction}}</p>
<!--      <div class="User__profile__sns">-->
<!--        <a href="" class="User__profile__sns__link">-->
<!--          <img class="User__profile__sns__link__img" src="~/assets/image/facebook.png" alt="facebook">-->
<!--        </a>-->
<!--        <a href="" class="User__profile__sns__link">-->
<!--          <img class="User__profile__sns__link__img" src="~/assets/image/twitter.png" alt="twitter">-->
<!--        </a>-->
<!--        <a href="" class="User__profile__sns__link">-->
<!--          <img class="User__profile__sns__link__img" src="~/assets/image/instagram.png" alt="instagram">-->
<!--        </a>-->
<!--      </div>-->
    </div>
    <div class="User__giv">
      <h3 class="User__giv__title">登録しているgiv</h3>
      <div class="User__giv__tags">
        <span class="User__giv__tags__tag" v-for="item of me.skills">
          {{item.tag}}
        </span>
      </div>
    </div>

    <div class="User__giv">
      <h3 class="User__giv__title">提供できる時間帯</h3>
      <div class="User__giv__tags">
        <span class="User__giv__tags__tag" v-for="item of me.times">
          {{item.tag}}
        </span>
      </div>
    </div>

    <div class="User__giv">
      <h3 class="User__giv__title">givを提供できる場所</h3>
      <div class="User__giv__tags">
        <span class="User__giv__tags__tag" v-for="item of me.areas">
          {{item.tag}}
        </span>
      </div>
    </div>

    <div class="User__giv">
      <h3 class="User__giv__title">興味・関心</h3>
      <div class="User__giv__tags">
        <span class="User__giv__tags__tag" v-for="item of me.interests">
          {{item.tag}}
        </span>
      </div>
    </div>
    <div class="User__latest">
      <h3 class="User__latest__title">最近のgiv</h3>
      <div class="User__latest__wrap">
        <template v-for="item of givs">
          <nuxt-link :to="`/thanks/${item.id}`" class="User__latest__wrap__box">
            <template v-if="item.images">
              <b-img :src="`https://api-dev.giv.link${item.images[0].path}`" class="User__latest__wrap__box__img" alt></b-img>
            </template>
            <template v-else>
              <span>NO IMAGE</span>
            </template>
          </nuxt-link>
        </template>
      </div>
    </div>
<!--    <div class="Back">-->
<!--      <nuxt-link to="/" class="Back__btn">-->
<!--        一覧へ戻る-->
<!--      </nuxt-link>-->
<!--    </div>-->
<!--    <a href="" class="GivBtn">-->
<!--      <img class="GivBtn__img" src="~/assets/image/giv_btn.png" alt="giv">-->
<!--    </a>-->
<!--    <div class="GivModal">-->
<!--      <a href="" class="GivModal__btn GivModal__btn&#45;&#45;send">givをおくりたい</a>-->
<!--      <a href="" class="GivModal__btn GivModal__btn&#45;&#45;take">givをもらいたい</a>-->
<!--      <a href="" class="GivModal__btn GivModal__btn&#45;&#45;cancel">申請をキャンセルする</a>-->
<!--    </div>-->
  </div>
</template>

<script>

const Cookie = process.client ? require('js-cookie') : undefined;
import axios from "axios";
export default {
    components: {
    },
    middleware: 'auth',
    layout:'logined',
    data() {
        return {
            code: '',
            hasError: '',
            img: '',
            first_name: '',
            last_name: '',
            me: '',
            givs: ''
        }
    },
    async asyncData({ app }) {
        const baseUrl = process.env.baseUrl + '/me';
        const getUrl = encodeURI(baseUrl);
        const token = app.$auth.$storage.getUniversal("_token.auth0");
        const response = await axios.get(getUrl, {
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            }
        });
        const givUrl = process.env.baseUrl + '/users/' + response.data.id + '/received_thanks_cards';
        const getUrl2 = encodeURI(givUrl);
        const response2 = await axios.get(getUrl2, {
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            }
        });
        return {
            me: response.data,
            givs: response2.data.thanks_cards,
        }
    },
    mounted() {
        const user = this.$auth.$storage.getState("user");
        this.img = user.picture;
        this.first_name = user.given_name;
        this.last_name = user.family_name;
    },
    methods: {
        async checkCode() {
        },
        logout() {

            this.$auth.logout();
        }
    }
}
</script>

<style>
</style>
