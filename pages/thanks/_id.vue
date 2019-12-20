<template>
  <div class="Detail Main">
    <div class="Detail__box">
      <div class="Detail__box__header">
        <nuxt-link :to="`/users/${thanks.giv.user}`" class="Detail__box__header__user">
          <div class="Detail__box__header__user__icon">
            <b-img :src="`https://api-dev.giv.link${thanks.giv.receive_user.profile_image_path}`" class="Detail__box__header__user__icon__img" alt></b-img>
          </div>

          <div class="Detail__box__header__user__text">
            <p class="Detail__box__header__user__text__name">{{thanks.giv.receive_user.last_name}} {{thanks.giv.receive_user.first_name}}</p>
          </div>
        </nuxt-link>
        <span class="Detail__box__header__tag">
          {{thanks.giv.kind}}
        </span>
      </div>
      <div class="Detail__box__images" v-if="thanks.images">
        <template v-for="item of thanks.images">
          <b-img :src="`https://api-dev.giv.link${item.path}`" class="Detail__box__images__img" alt></b-img>
        </template>
      </div>
      <div class="Detail__box__info">
        <template v-if="isLike && thanks.liked">

          <p class="Detail__box__info__good" v-on:click="deleteLike">
            <span class="Detail__box__info__good__heart on">♥</span>
            <span class="Detail__box__info__good__text">いいね済</span>
          </p>
        </template>
        <template v-else>

          <p class="Detail__box__info__good" v-on:click="sendLike">
            <span class="Detail__box__info__good__heart">♡</span>
            <span class="Detail__box__info__good__text">いいね</span>
          </p>
        </template>
        <p class="Detail__box__info__time">{{ thanks.created_at | moment }}</p>
      </div>
      <div class="Detail__box__content">
        <h2 class="Detail__box__content__title">
          {{ thanks.title }}
        </h2>
        <p class="Detail__box__content__text">
          {{ thanks.message }}
        </p>
      </div>
      <nuxt-link :to="`/users/3`" class="Home__card__content__person">
        <!--          <nuxt-link :to="`/user/${item.giv.giv_user.id}`" class="Home__card__content__person">-->
        <div class="Home__card__content__person__icon">
          <b-img :src="`https://api-dev.giv.link${thanks.giv.giv_user.profile_image_path}`" class="Home__card__content__person__icon__img" alt></b-img>
        </div>
        <div class="Home__card__content__person__text">
          <p class="Home__card__content__person__text__head">givを贈った人</p>
          <p class="Home__card__content__person__text__name">{{thanks.giv.giv_user.last_name}} {{thanks.giv.giv_user.first_name}}</p>
          <!--              <p class="Home__card__content__person__text__position">CO-FOUNDER & CCO</p>-->
        </div>
      </nuxt-link>
    </div>
    <div class="Back">
      <nuxt-link to="/" class="Back__btn">
        一覧へ戻る
      </nuxt-link>
    </div>
  </div>
</template>

<script>

    import axios from "axios";
    const Cookie = process.client ? require('js-cookie') : undefined;

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
                isLike: '',
                id: '',
            }
        },
        mounted() {
        },

        filters: {
            moment: function (date) {
                return moment(date).format('YYYY.MM.DD');
            }
        },
        async asyncData({ app, params }) {
            if(params.id) {
                const baseUrl = process.env.baseUrl + '/thanks_cards/' + params.id;
                const getUrl = encodeURI(baseUrl);
                const token = app.$auth.$storage.getUniversal("_token.auth0");
                const response = await axios.get(getUrl, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token
                    }
                });
                return {
                    thanks: response.data,
                    isLike: response.data.liked,
                    id: params.id
                }
            }
        },
        methods: {
            async sendLike() {
                const baseUrl = process.env.baseUrl + '/thanks_cards/' + this.id + '/like';
                const getUrl = encodeURI(baseUrl);

                const token = this.$auth.$storage.getUniversal("_token.auth0");
                const response = await axios.put(getUrl, {},{
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token
                    }
                });
                if(response.status === 200) {
                    this.isLike = true;
                }
            },
            async deleteLike() {
                const baseUrl = process.env.baseUrl + '/thanks_cards/' + this.id + '/like';
                const getUrl = encodeURI(baseUrl);
                const token = this.$auth.$storage.getUniversal("_token.auth0");
                const response = await axios.delete(getUrl, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token
                    }
                });
                if(response.status === 200) {
                    this.isLike = false;
                }
            },
            logout() {
                this.$auth.logout();
            }
        }
    }
</script>

<style>
</style>
