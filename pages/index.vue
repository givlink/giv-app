<template>
  <div class="Home Main">
    <div class="Home__cards">
      <div class="Home__card"  v-for="item in thanks_cards">
        <nuxt-link :to="`/users/${item.giv.receive_user.id}`" class="Home__card__header">
          <div class="Home__card__header__icon">
            <b-img :src="`${basePath}${item.giv.receive_user.profile_image_path}`" class="Home__card__header__icon__img" alt></b-img>
          </div>
          <div class="Home__card__header__text">
            <p class="Home__card__header__text__name">{{item.giv.receive_user.last_name}} {{item.giv.receive_user.first_name}}</p>
          </div>
        </nuxt-link>
        <nuxt-link :to="`/thanks/${item.id}`" class="Home__card__view" v-if="item.images.length > 0">
          <b-img :src="`${basePath}${item.images[0].path}`" class="Home__card__view__img" alt></b-img>
        </nuxt-link>
        <div class="Home__card__content">
          <div class="Home__card__content__info">
            <div class="Home__card__content__info__tags">
              <span class="Home__card__content__info__tags__tag">{{item.giv.kind}}</span>
            </div>
            <div class="Home__card__content__info__date">
              {{ item.created_at | moment }}
            </div>
          </div>
          <h2 class="Home__card__content__title">
            {{ item.title }}
          </h2>
          <p class="Home__card__content__text">
            <template v-if="item.message.length > 40">
              {{ item.message | substringText  }}
              <nuxt-link :to="`/users/${item.giv.receive_user.id}`" class="">続きを見る</nuxt-link>
            </template>
            <template v-else>
              {{ item.message }}
            </template>
          </p>
          <nuxt-link :to="`/users/${item.giv.giv_user.id}`" class="Home__card__content__person">
            <!--          <nuxt-link :to="`/user/${item.giv.giv_user.id}`" class="Home__card__content__person">-->
            <div class="Home__card__content__person__icon">
              <b-img :src="`${basePath}${item.giv.giv_user.profile_image_path}`" class="Home__card__content__person__icon__img" alt></b-img>
            </div>
            <div class="Home__card__content__person__text">
              <p class="Home__card__content__person__text__head">givを贈った人</p>
              <p class="Home__card__content__person__text__name">{{item.giv.giv_user.last_name}} {{item.giv.giv_user.first_name}}</p>
              <!--              <p class="Home__card__content__person__text__position">CO-FOUNDER & CCO</p>-->
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  const Cookie = process.client ? require('js-cookie') : undefined;
  import axios from 'axios';
  import moment from 'moment';
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
        thanks_cards: '',
      }
    },
    async asyncData({ app }) {
      const baseUrl = process.env.baseUrl + '/thanks_cards';
      const getUrl = encodeURI(baseUrl);
      const token = app.$auth.$storage.getUniversal("_token.auth0");
      const response = await axios.get(getUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        }
      });
      console.log(response.data.thanks_cards);
      return {
        thanks_cards: response.data.thanks_cards,
      }
    },
    computed: {
      basePath () {
        return `${process.env.baseUrl}`;
      },
    },
    mounted() {

      const baseUrl = process.env.baseUrl + '/me';
      const getUrl = encodeURI(baseUrl);
      const token = this.$auth.$storage.getUniversal("_token.auth0");
      axios.get(getUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        }
      }).then((res) => {
        this.$store.commit("setMe", res.data);
      });
    },
    filters: {
      moment: function (date) {
        return moment(date).format('YYYY.MM.DD');
      },
      substringText: function(text) {
        let subText = text;
        if(text.length > 40 ) {
          subText = text.substring( 0, 40 );
          subText += '…';
        }
        return subText;
      }
    },
    methods: {
      async checkCode() {
      },
      logout() {

        this.$auth.logout();
      },
    }
  }
</script>

<style>
</style>
