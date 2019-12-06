<template>
  <div class="Home Main">
    <div class="Home__cards">
      <div class="Home__card">
        <nuxt-link to="/detail" class="Home__card__header">
          <div class="Home__card__header__icon">
            <b-img :src="`${img}`" class="Home__card__header__icon__img" alt></b-img>
          </div>
          <div class="Home__card__header__text">
            <p class="Home__card__header__text__name">{{last_name}} {{first_name}}</p>
<!--            <p class="Home__card__header__text__position">KDS</p>-->
          </div>
        </nuxt-link>
        <nuxt-link to="/detail" class="Home__card__view">
          <img class="Home__card__view__img" src="~/assets/image/sample_img.png" alt="giv">
        </nuxt-link>
        <div class="Home__card__content">
          <div class="Home__card__content__info">
            <div class="Home__card__content__info__tags">
              <a href=""  class="Home__card__content__info__tags__tag">トレーニング</a>
            </div>
            <div class="Home__card__content__info__date">
              2019.06.21
            </div>
          </div>
          <p class="Home__card__content__text">
            庄司さんからDGスタッフたちに<br>
            トレーニングのgivをいただきました
          </p>
          <nuxt-link to="/other" class="Home__card__content__person">
            <div class="Home__card__content__person__icon">
              <img class="Home__card__content__person__icon__img" src="~/assets/image/sample_profile_icon.png" alt="giv">
            </div>
            <div class="Home__card__content__person__text">
              <p class="Home__card__content__person__text__head">givを贈った人</p>
              <p class="Home__card__content__person__text__name">庄司 竜太郎</p>
              <p class="Home__card__content__person__text__position">CO-FOUNDER & CCO</p>
            </div>
          </nuxt-link>
        </div>
      </div>
      <div class="Home__card">
        <a href="" class="Home__card__header">
          <div class="Home__card__header__icon">
            <img class="Home__card__header__icon__img" src="~/assets/image/sample_profile_icon.png" alt="giv">
          </div>
          <div class="Home__card__header__text">
            <p class="Home__card__header__text__name">山田 太郎</p>
            <p class="Home__card__header__text__position">KDS</p>
          </div>
        </a>
        <a href="" class="Home__card__view">
          <img class="Home__card__view__img" src="~/assets/image/sample_img.png" alt="giv">
        </a>
        <div class="Home__card__content">
          <div class="Home__card__content__info">
            <div class="Home__card__content__info__tags">
              <a href=""  class="Home__card__content__info__tags__tag">トレーニング</a>
            </div>
            <div class="Home__card__content__info__date">
              2019.06.21
            </div>
          </div>
          <a href="" class="Home__card__content__text">
            庄司さんからDGスタッフたちに<br>
            トレーニングのgivをいただきました
          </a>
          <nuxt-link to="/other" class="Home__card__content__person">
            <div class="Home__card__content__person__icon">
              <img class="Home__card__content__person__icon__img" src="~/assets/image/sample_profile_icon.png" alt="giv">
            </div>
            <div class="Home__card__content__person__text">
              <p class="Home__card__content__person__text__head">givを贈った人</p>
              <p class="Home__card__content__person__text__name">庄司 竜太郎</p>
              <p class="Home__card__content__person__text__position">CO-FOUNDER & CCO</p>
            </div>
          </nuxt-link>
        </div>
      </div>
      <div class="Home__card">
        <a href="" class="Home__card__header">
          <div class="Home__card__header__icon">
            <img class="Home__card__header__icon__img" src="~/assets/image/sample_profile_icon.png" alt="giv">
          </div>
          <div class="Home__card__header__text">
            <p class="Home__card__header__text__name">山田 太郎</p>
            <p class="Home__card__header__text__position">KDS</p>
          </div>
        </a>
        <a href="" class="Home__card__view">
          <img class="Home__card__view__img" src="~/assets/image/sample_img.png" alt="giv">
        </a>
        <div class="Home__card__content">
          <div class="Home__card__content__info">
            <div class="Home__card__content__info__tags">
              <a href=""  class="Home__card__content__info__tags__tag">トレーニング</a>
            </div>
            <div class="Home__card__content__info__date">
              2019.06.21
            </div>
          </div>
          <a href="" class="Home__card__content__text">
            庄司さんからDGスタッフたちに<br>
            トレーニングのgivをいただきました
          </a>
          <a href="" class="Home__card__content__person">
            <div class="Home__card__content__person__icon">
              <img class="Home__card__content__person__icon__img" src="~/assets/image/sample_profile_icon.png" alt="giv">
            </div>
            <div class="Home__card__content__person__text">
              <p class="Home__card__content__person__text__head">givを贈った人</p>
              <p class="Home__card__content__person__text__name">庄司 竜太郎</p>
              <p class="Home__card__content__person__text__position">CO-FOUNDER & CCO</p>
            </div>
          </a>
        </div>
      </div>
      <div class="Home__card">
        <a href="" class="Home__card__header">
          <div class="Home__card__header__icon">
            <img class="Home__card__header__icon__img" src="~/assets/image/sample_profile_icon.png" alt="giv">
          </div>
          <div class="Home__card__header__text">
            <p class="Home__card__header__text__name">山田 太郎</p>
            <p class="Home__card__header__text__position">KDS</p>
          </div>
        </a>
        <a href="" class="Home__card__view">
          <img class="Home__card__view__img" src="~/assets/image/sample_img.png" alt="giv">
        </a>
        <div class="Home__card__content">
          <div class="Home__card__content__info">
            <div class="Home__card__content__info__tags">
              <a href=""  class="Home__card__content__info__tags__tag">トレーニング</a>
            </div>
            <div class="Home__card__content__info__date">
              2019.06.21
            </div>
          </div>
          <a href="" class="Home__card__content__text">
            庄司さんからDGスタッフたちに<br>
            トレーニングのgivをいただきました
          </a>
          <nuxt-link to="/other" class="Home__card__content__person">
            <div class="Home__card__content__person__icon">
              <img class="Home__card__content__person__icon__img" src="~/assets/image/sample_profile_icon.png" alt="giv">
            </div>
            <div class="Home__card__content__person__text">
              <p class="Home__card__content__person__text__head">givを贈った人</p>
              <p class="Home__card__content__person__text__name">庄司 竜太郎</p>
              <p class="Home__card__content__person__text__position">CO-FOUNDER & CCO</p>
            </div>
          </nuxt-link>

          <button v-on:click="logout()" class="Invite__btn__link">ログアウト</button>
        </div>
      </div>
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
                img: '',
                first_name: '',
                last_name: '',
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
