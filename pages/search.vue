<template>
  <div class="Search Main">
    <div class="Search__box">
      <form action="" class="Search__box__form">
        <input type="text" class="Search__box__form__input">
        <input type="submit" class="Search__box__form__submit" value="">
      </form>
      <div class="Search__box__tags">
        <a href="" class="Search__box__tags__tag">Tag</a>
        <a href="" class="Search__box__tags__tag">Tag</a>
        <a href="" class="Search__box__tags__tag">Tag</a>
        <a href="" class="Search__box__tags__tag">Tag</a>
        <a href="" class="Search__box__tags__tag">Tag</a>
        <a href="" class="Search__box__tags__tag">Tag</a>
        <a href="" class="Search__box__tags__tag">Tag</a>
        <a href="" class="Search__box__tags__tag">Tag</a>
        <a href="" class="Search__box__tags__tag">Tag</a>
        <a href="" class="Search__box__tags__tag">Tag</a>
        <a href="" class="Search__box__tags__tag">Tag</a>
        <a href="" class="Search__box__tags__tag">Tag</a>
      </div>
    </div>
    <ul class="Search__list">
      <li class="Search__list__li">
        <nuxt-link to="/other" class="Search__list__li__link">
          <div class="Search__list__li__link__icon">
            <img class="Search__list__li__link__icon__img" src="~/assets/image/sample_profile_icon.png" alt="giv">
          </div>
          <div class="Search__list__li__link__text">
            <p class="Search__list__li__link__text__name">庄司 竜太郎さん</p>
            <p class="Search__list__li__link__text__position">CO-FOUNDER & CCO</p>
          </div>
        </nuxt-link>
      </li>
      <li class="Search__list__li">
        <nuxt-link to="/other" class="Search__list__li__link">
          <div class="Search__list__li__link__icon">
            <img class="Search__list__li__link__icon__img" src="~/assets/image/sample_profile_icon.png" alt="giv">
          </div>
          <div class="Search__list__li__link__text">
            <p class="Search__list__li__link__text__name">庄司 竜太郎さん</p>
            <p class="Search__list__li__link__text__position">CO-FOUNDER & CCO</p>
          </div>
        </nuxt-link>
      </li>
      <li class="Search__list__li">
        <nuxt-link to="/other" class="Search__list__li__link">
          <div class="Search__list__li__link__icon">
            <img class="Search__list__li__link__icon__img" src="~/assets/image/sample_profile_icon.png" alt="giv">
          </div>
          <div class="Search__list__li__link__text">
            <p class="Search__list__li__link__text__name">庄司 竜太郎さん</p>
            <p class="Search__list__li__link__text__position">CO-FOUNDER & CCO</p>
          </div>
        </nuxt-link>
      </li>
      <li class="Search__list__li">
        <nuxt-link to="/other" class="Search__list__li__link">
          <div class="Search__list__li__link__icon">
            <img class="Search__list__li__link__icon__img" src="~/assets/image/sample_profile_icon.png" alt="giv">
          </div>
          <div class="Search__list__li__link__text">
            <p class="Search__list__li__link__text__name">庄司 竜太郎さん</p>
            <p class="Search__list__li__link__text__position">CO-FOUNDER & CCO</p>
          </div>
        </nuxt-link>
      </li>
      <li class="Search__list__li">
        <nuxt-link to="/other" class="Search__list__li__link">
          <div class="Search__list__li__link__icon">
            <img class="Search__list__li__link__icon__img" src="~/assets/image/sample_profile_icon.png" alt="giv">
          </div>
          <div class="Search__list__li__link__text">
            <p class="Search__list__li__link__text__name">庄司 竜太郎さん</p>
            <p class="Search__list__li__link__text__position">CO-FOUNDER & CCO</p>
          </div>
        </nuxt-link>
      </li>
      <li class="Search__list__li">
        <nuxt-link to="/other" class="Search__list__li__link">
          <div class="Search__list__li__link__icon">
            <img class="Search__list__li__link__icon__img" src="~/assets/image/sample_profile_icon.png" alt="giv">
          </div>
          <div class="Search__list__li__link__text">
            <p class="Search__list__li__link__text__name">庄司 竜太郎さん</p>
            <p class="Search__list__li__link__text__position">CO-FOUNDER & CCO</p>
          </div>
        </nuxt-link>
      </li>
      <li class="Search__list__li">
        <nuxt-link to="/other" class="Search__list__li__link">
          <div class="Search__list__li__link__icon">
            <img class="Search__list__li__link__icon__img" src="~/assets/image/sample_profile_icon.png" alt="giv">
          </div>
          <div class="Search__list__li__link__text">
            <p class="Search__list__li__link__text__name">庄司 竜太郎さん</p>
            <p class="Search__list__li__link__text__position">CO-FOUNDER & CCO</p>
          </div>
        </nuxt-link>
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
