<template>
  <div class="User Main">
    <div class="User__profile">
      <div class="User__profile__icon">
        <b-img :src="`${basePath}${me.profile_image_path}`" class="User__profile__icon__img" alt></b-img>
      </div>
      <p class="User__profile__name">{{me.last_name}} {{me.first_name}}</p>
      <p class="User__profile__position">{{me.job}}</p>
      <p class="User__profile__message" v-html=changeUrl(me.introduction)></p>
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
    <div class="User__latest">
      <h3 class="User__latest__title">最近のgiv</h3>
      <div class="User__latest__wrap">
        <template v-if="givs" v-for="item of givs">
          <nuxt-link :to="`/thanks/${item.id}`" class="User__latest__wrap__box">
            <template v-if="item.images.length > 0">
              <b-img :src="`${basePath}${item.images[0].path}`" class="User__latest__wrap__box__img" alt></b-img>
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
    <div class="GivBtn" v-on:click="toggleModal">
      <img class="GivBtn__img" src="~/assets/image/giv_btn.png" alt="giv">
    </div>
    <div class="GivModal" v-if="onModal">
      <div class="GivModal__btn GivModal__btn--send" v-b-modal="'send-modal'" v-on:click="sendGiv">givを贈りたい</div>
      <div class="GivModal__btn GivModal__btn--take" v-b-modal="'want-modal'" v-on:click="wantGiv">givを受け取りたい</div>
      <div class="GivModal__btn GivModal__btn--cancel" v-on:click="toggleModal">閉じる</div>
    </div>
    <b-modal ok-only id="send-modal">givを送りたいと送信しました</b-modal>
    <b-modal ok-only id="want-modal">givを受け取りたいと送信しました</b-modal>
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
      givs: '',
      onModal: false
    }
  },
  async asyncData({ app, params }) {
    if(params.id) {
      const baseUrl = process.env.baseUrl + '/users/' + params.id;
      const getUrl = encodeURI(baseUrl);
      const token = app.$auth.$storage.getUniversal("_token.auth0");
      const response = await axios.get(getUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        }
      });
      const givUrl = process.env.baseUrl + '/users/' + params.id + '/received_thanks_cards';
      const getUrl2 = encodeURI(givUrl);
      const response2 = await axios.get(getUrl2, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        }
      });
      if(app.store.state.me && response.data.user.id == app.store.state.me.id) {
        app.router.push("/mypage");
      }
      return {
        me: response.data.user,
        givs: response2.data.thanks_cards,
        id: params.id
      }
    }
  },
  mounted() {
    const user = this.$auth.$storage.getState("user");
    this.img = user.picture;
    this.first_name = user.given_name;
    this.last_name = user.family_name;
  },

  computed: {
    basePath () {
      return `${process.env.baseUrl}`;
    },
  },
  methods: {
    async sendGiv() {
      const baseUrl = process.env.baseUrl + '/users/' + this.id + '/send_giv';
      const getUrl = encodeURI(baseUrl);

      const token = this.$auth.$storage.getUniversal("_token.auth0");
      const response = await axios.put(getUrl, {},{
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        }
      });
      this.onModal = false;
    },
    async wantGiv() {
      const baseUrl = process.env.baseUrl + '/users/' + this.id + '/want_giv';
      const getUrl = encodeURI(baseUrl);

      const token = this.$auth.$storage.getUniversal("_token.auth0");
      const response = await axios.put(getUrl, {},{
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        }
      });
      this.onModal = false;
    },
    toggleModal() {
      this.onModal = !this.onModal
    },
    logout() {

      this.$auth.logout();
    },
    changeUrl(text) {
      console.log("hoge")
      return text.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig,"<a href='$1'>$1</a>");
    }
  }
}
</script>

<style>
</style>
