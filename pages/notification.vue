<template>
  <div class="Notification Main">
    <ul class="Notification__list">
      <li class="Notification__list__li">
        <a href="" class="Notification__list__li__link">
          <div class="Notification__list__li__link__icon">
            <img class="Notification__list__li__link__icon__img" src="~/assets/image/sample_profile_icon.png" alt="giv">
          </div>
          <div class="Notification__list__li__link__text">
            <p class="Notification__list__li__link__text__info">庄司 竜太郎さんからgivを受け取りたいのアクションがありました。</p>
            <p class="Notification__list__li__link__text__date">30日前</p>
          </div>
        </a>
      </li>
      <li class="Notification__list__li">
        <a href="" class="Notification__list__li__link">
          <div class="Notification__list__li__link__icon">
            <img class="Notification__list__li__link__icon__img" src="~/assets/image/sample_profile_icon.png" alt="giv">
          </div>
          <div class="Notification__list__li__link__text">
            <p class="Notification__list__li__link__text__info">庄司 竜太郎さんからgivを受け取りたいのアクションがありました。</p>
            <p class="Notification__list__li__link__text__date">30日前</p>
          </div>
        </a>
      </li>
      <li class="Notification__list__li">
        <a href="" class="Notification__list__li__link">
          <div class="Notification__list__li__link__icon">
            <img class="Notification__list__li__link__icon__img" src="~/assets/image/sample_profile_icon.png" alt="giv">
          </div>
          <div class="Notification__list__li__link__text">
            <p class="Notification__list__li__link__text__info">庄司 竜太郎さんからgivを受け取りたいのアクションがありました。</p>
            <p class="Notification__list__li__link__text__date">30日前</p>
          </div>
        </a>
      </li>
      <li class="Notification__list__li">
        <a href="" class="Notification__list__li__link">
          <div class="Notification__list__li__link__icon">
            <img class="Notification__list__li__link__icon__img" src="~/assets/image/sample_profile_icon.png" alt="giv">
          </div>
          <div class="Notification__list__li__link__text">
            <p class="Notification__list__li__link__text__info">庄司 竜太郎さんからgivを受け取りたいのアクションがありました。</p>
            <p class="Notification__list__li__link__text__date">30日前</p>
          </div>
        </a>
      </li>
      <li class="Notification__list__li">
        <a href="" class="Notification__list__li__link">
          <div class="Notification__list__li__link__icon">
            <img class="Notification__list__li__link__icon__img" src="~/assets/image/sample_profile_icon.png" alt="giv">
          </div>
          <div class="Notification__list__li__link__text">
            <p class="Notification__list__li__link__text__info">庄司 竜太郎さんからgivを受け取りたいのアクションがありました。</p>
            <p class="Notification__list__li__link__text__date">30日前</p>
          </div>
        </a>
      </li>
      <li class="Notification__list__li">
        <a href="" class="Notification__list__li__link">
          <div class="Notification__list__li__link__icon">
            <img class="Notification__list__li__link__icon__img" src="~/assets/image/sample_profile_icon.png" alt="giv">
          </div>
          <div class="Notification__list__li__link__text">
            <p class="Notification__list__li__link__text__info">庄司 竜太郎さんからgivを受け取りたいのアクションがありました。</p>
            <p class="Notification__list__li__link__text__date">30日前</p>
          </div>
        </a>
      </li>
    </ul>
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
