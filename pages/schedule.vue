<template>
  <div class="GivList Main">
    <div class="GivList__tab">
      <div class="GivList__tab__btn on" id="receive">
        受け取り一覧
      </div>
      <div class="GivList__tab__btn" id="send">
        差し出し一覧
      </div>
    </div>
    <div class="GivList__box" id="receiveList">
      <div class="GivList__box__term">
        <div class="GivList__box__term__date">
          2019.6.21
        </div>
        <nuxt-link to="/thanks" class="GivList__box__term__content">
          <div class="GivList__box__term__content__person">
            <div class="GivList__box__term__content__person__icon">
              <img class="GivList__box__term__content__person__icon__img" src="~/assets/image/sample_profile_icon.png" alt="giv">
            </div>
            <div class="GivList__box__term__content__person__text">
              <p class="GivList__box__term__content__person__text__name">庄司 竜太郎</p>
              <p class="GivList__box__term__content__person__text__position">CO-FOUNDER & CCO</p>
            </div>
          </div>
          <div class="GivList__box__term__content__thanks">
                    <span class="GivList__box__term__content__thanks__text">
                        Thanksカードを<br>書きましょう
                    </span>
          </div>
        </nuxt-link>
        <nuxt-link to="/thanks" class="GivList__box__term__content">
          <div class="GivList__box__term__content__person">
            <div class="GivList__box__term__content__person__icon">
              <img class="GivList__box__term__content__person__icon__img" src="~/assets/image/sample_profile_icon.png" alt="giv">
            </div>
            <div class="GivList__box__term__content__person__text">
              <p class="GivList__box__term__content__person__text__name">庄司 竜太郎</p>
              <p class="GivList__box__term__content__person__text__position">CO-FOUNDER & CCO</p>
            </div>
          </div>
          <div class="GivList__box__term__content__thanks">
                    <span class="GivList__box__term__content__thanks__text">
                        Thanksカードを<br>書きましょう
                    </span>
          </div>
        </nuxt-link>
      </div>
      <div class="GivList__box__term">
        <div class="GivList__box__term__date">
          2019.6.22
        </div>
        <nuxt-link to="/thanks" class="GivList__box__term__content">
          <div class="GivList__box__term__content__person">
            <div class="GivList__box__term__content__person__icon">
              <img class="GivList__box__term__content__person__icon__img" src="~/assets/image/sample_profile_icon.png" alt="giv">
            </div>
            <div class="GivList__box__term__content__person__text">
              <p class="GivList__box__term__content__person__text__name">庄司 竜太郎</p>
              <p class="GivList__box__term__content__person__text__position">CO-FOUNDER & CCO</p>
            </div>
          </div>
          <div class="GivList__box__term__content__thanks">
                    <span class="GivList__box__term__content__thanks__text">
                        Thanksカードを<br>書きましょう
                    </span>
          </div>
        </nuxt-link>
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
