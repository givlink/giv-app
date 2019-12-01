<template>
  <div class="User Main">
    <div class="User__profile">
      <div class="User__profile__icon">
        <img class="User__profile__icon__img" src="~/assets/image/sample_profile_icon.png" alt="giv">
      </div>
      <p class="User__profile__name">山田 太郎</p>
      <p class="User__profile__position">KDS</p>
      <p class="User__profile__message">どうぞよろしくお願い致します！</p>
      <div class="User__profile__sns">
        <a href="" class="User__profile__sns__link">
          <img class="User__profile__sns__link__img" src="~/assets/image/facebook.png" alt="facebook">
        </a>
        <a href="" class="User__profile__sns__link">
          <img class="User__profile__sns__link__img" src="~/assets/image/twitter.png" alt="twitter">
        </a>
        <a href="" class="User__profile__sns__link">
          <img class="User__profile__sns__link__img" src="~/assets/image/instagram.png" alt="instagram">
        </a>
      </div>
    </div>
    <div class="User__giv">
      <h3 class="User__giv__title">登録しているgiv</h3>
      <div class="User__giv__tags">
        <a href="" class="User__giv__tags__tag">トレーニング</a>
      </div>
    </div>
    <div class="User__latest">
      <h3 class="User__latest__title">最近のgiv</h3>
      <div class="User__latest__wrap">
        <a href="" class="User__latest__wrap__box">
          <img class="User__latest__wrap__box__img" src="~/assets/image/01.png" alt="01">
        </a>
        <a href="" class="User__latest__wrap__box">
          <img class="User__latest__wrap__box__img" src="~/assets/image/02.png" alt="01">
        </a>
        <a href="" class="User__latest__wrap__box">
          <img class="User__latest__wrap__box__img" src="~/assets/image/03.png" alt="01">
        </a>
        <a href="" class="User__latest__wrap__box">
          <img class="User__latest__wrap__box__img" src="~/assets/image/04.png" alt="01">
        </a>
        <a href="" class="User__latest__wrap__box">
          <img class="User__latest__wrap__box__img" src="~/assets/image/05.png" alt="01">
        </a>
        <a href="" class="User__latest__wrap__box">
          <img class="User__latest__wrap__box__img" src="~/assets/image/06.png" alt="01">
        </a>
        <a href="" class="User__latest__wrap__box">
          <img class="User__latest__wrap__box__img" src="~/assets/image/07.png" alt="01">
        </a>
        <a href="" class="User__latest__wrap__box">
          <img class="User__latest__wrap__box__img" src="~/assets/image/08.png" alt="01">
        </a>
        <a href="" class="User__latest__wrap__box">
          <img class="User__latest__wrap__box__img" src="~/assets/image/09.png" alt="01">
        </a>
      </div>
    </div>
    <div class="Back">
      <nuxt-link to="/" class="Back__btn">
        一覧へ戻る
      </nuxt-link>
    </div>
    <a href="" class="GivBtn">
      <img class="GivBtn__img" src="~/assets/image/giv_btn.png" alt="giv">
    </a>
    <div class="GivModal">
      <a href="" class="GivModal__btn GivModal__btn--send">givをおくりたい</a>
      <a href="" class="GivModal__btn GivModal__btn--take">givをもらいたい</a>
      <a href="" class="GivModal__btn GivModal__btn--cancel">申請をキャンセルする</a>
    </div>
  </div>
</template>

<script>

const Cookie = process.client ? require('js-cookie') : undefined;
export default {
    components: {
    },
    middleware: 'auth',
    layout:'logined',
    data() {
        return {
            code: '',
            hasError: '',
        }
    },
    mounted() {
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
