<template>
  <div class="Detail Main">
    <div class="Detail__box Detail__box--other">
      <div class="Detail__box__header">
        <nuxt-link :to="`/users/${giv.user}`" class="Detail__box__header__user">
          <div class="Detail__box__header__user__icon">
            <b-img
              :src="`${basePath}${giv.giv_user.profile_image_path}`"
              class="Detail__box__header__user__icon__img"
              alt
            ></b-img>
          </div>

          <div class="Detail__box__header__user__text">
            <p class="Detail__box__header__user__text__name">
              {{ giv.giv_user.last_name }} {{ giv.giv_user.first_name }}
            </p>
          </div>
        </nuxt-link>
        <a href="" class="Detail__box__header__tag">
          {{ giv.kind }}
        </a>
      </div>
      <div class="Detail__box__wrap">
        <div class="Detail__box__finish" v-if="giv.status === 'finished'">
          このgivは終了いたしました
        </div>
        <div class="Detail__box__images">
          <template v-for="item of giv.images">
            <b-img
              :src="`${basePath}${item.path}`"
              class="Detail__box__images__img"
              alt
            ></b-img>
          </template>
        </div>
      </div>
      <div class="Detail__box__info">
        <template v-if="giv.liked">
          <div class="Detail__box__info__good">
            <span class="Detail__box__info__good__heart">♡</span>
            <span class="Detail__box__info__good__text">いいね</span>
          </div>
        </template>
        <template v-else>
          <div class="Detail__box__info__good">
            <span class="Detail__box__info__good__heart on">♡</span>
            <span class="Detail__box__info__good__text">いいね</span>
          </div>
        </template>
        <p class="Detail__box__info__time">{{ giv.created_at | moment }}</p>
      </div>
      <div class="Detail__box__content">
        <h2 class="Detail__box__content__title">
          {{ giv.comment_by_operator }}
        </h2>
        <p class="Detail__box__content__text Detail__box__content__text--other">
          {{ giv.comment }}
        </p>
      </div>
    </div>
    <div class="Detail__date">
      <h2 class="Detail__date__title">開催日時</h2>
      <p class="Detail__date__info">
        <img
          class="Detail__date__info__img"
          src="~/assets/image/calendar.png"
          alt="カレンダー"
        />
        <span class="Detail__date__info__text"
          >{{ giv.meetup_date | moment }}{{ giv.start_time }}〜{{
            giv.end_time
          }}</span
        >
      </p>
    </div>
    <div class="Detail__place">
      <div class="Detail__place__info">
        <h2 class="Detail__place__info__title">開催場所</h2>
        <p class="Detail__place__info__text">
          〒{{ giv.zip1 }}-{{ giv.zip2 }} {{ giv.address }}
        </p>
      </div>
      <div class="Detail__place__map">
        <iframe
          :src="
            `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.7272719155903!2d${giv.longitude}!3d${giv.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b5850e5a83f%3A0x70297507b32efce5!2z5riL6LC344OS44Kr44Oq44Ko!5e0!3m2!1sja!2sjp!4v1571947364891!5m2!1sja!2sjp`
          "
          width="100%"
          height="225"
          frameborder="0"
          style="border:0;"
          allowfullscreen=""
        ></iframe>
      </div>
      <div class="Detail__place__link">
        <a
          class="Detail__place__link__btn"
          :href="
            `https://www.google.co.jp/maps/@${giv.latitude},${giv.longitude},15z`
          "
        >
          Google Mapで見る
        </a>
      </div>
    </div>
    <div
      class="ThanksCard"
      v-if="giv.status == 'finished' && giv.postId == null"
    >
      <nuxt-link :to="`/posts/create?givId=${giv.id}`" class="ThanksCard__btn">
        ThanksCard・画像を投稿する
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import axios from "axios";

import moment from "moment";

const Cookie = process.client ? require("js-cookie") : undefined;
export default {
  components: {},
  middleware: "auth",
  layout: "logined",
  data() {
    return {
      code: "",
      hasError: ""
    };
  },

  filters: {
    moment: function(date) {
      return moment(date).format("YYYY.MM.DD");
    }
  },
  mounted() {},

  computed: {
    basePath() {
      return `${process.env.baseUrl}`;
    }
  },
  async asyncData({ app, params }) {
    if (params.id) {
      const baseUrl = process.env.baseUrl + "/me/receive/" + params.id;
      const getUrl = encodeURI(baseUrl);
      const token = app.$auth.$storage.getUniversal("_token.auth0");
      const response = await axios.get(getUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        }
      });
      console.log(response);
      return {
        giv: response.data
      };
    }
  },
  methods: {
    async checkCode() {},
    logout() {
      this.$auth.logout();
    }
  }
};
</script>

<style></style>
