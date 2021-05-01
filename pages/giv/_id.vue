<template>
  <div class="Detail Main">
    <div class="Detail__box Detail__box--other">
      <div class="Detail__box__header">
        <nuxt-link
          :to="`/users/${giv.receiver.id}`"
          class="Detail__box__header__user"
        >
          <div class="Detail__box__header__user__icon">
            <b-img
              :src="$utils.parseUrl(giv.receiver.photoURL)"
              class="Detail__box__header__user__icon__img"
              alt
            ></b-img>
          </div>

          <div class="Detail__box__header__user__text">
            <p class="Detail__box__header__user__text__name">
              {{ giv.receiver.name }}
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
          <template v-for="item of giv.post.images">
            <b-img
              :src="$utils.parseUrl(item)"
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
        <p class="Detail__box__info__time">
          {{ $utils.parseDate(giv.created_at) }}
        </p>
      </div>
      <div class="Detail__box__content">
        <h2 class="Detail__box__content__title">
          {{ giv.operatorComment }}
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
          >{{ $utils.parseDate(giv.meetup_date) }}{{ giv.start_time }}〜{{
            giv.end_time
          }}</span
        >
      </p>
    </div>
  </div>
</template>

<script>
import api from "../../lib/api";

export default {
  components: {},
  layout: "logined",
  data() {
    return {
      code: "",
      hasError: ""
    };
  },

  async asyncData({ app, params }) {
    const giv = await api.getGiv(params.id);
    return { giv };
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
