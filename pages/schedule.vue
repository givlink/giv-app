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
      <!--      <div class="GivList__box__term">-->
      <!--        <div class="GivList__box__term__date">-->
      <!--          2019.6.21-->
      <!--        </div>-->
      <template v-for="item of receives">
        <div class="GivList__box__term__content">
          <div class="GivList__box__term__content__person">
            <div class="GivList__box__term__content__person__icon">
              <b-img :src="`https://api-dev.giv.link${item.giv_user.profile_image_path}`" class="GivList__box__term__content__person__icon__img" alt></b-img>
            </div>
            <div class="GivList__box__term__content__person__text">
              <p class="GivList__box__term__content__person__text__name">{{ item.giv_user.last_name}} {{ item.giv_user.first_name}}</p>
            </div>
          </div>
          <nuxt-link v-if="item.thanks_card == null" :to="`/thanks?id=${item.id}`" class="GivList__box__term__content__thanks">
                    <span class="GivList__box__term__content__thanks__text">
                        Thanksカードを<br>書きましょう
                    </span>
          </nuxt-link>
        </div>
      </template>
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
            }
        },
        async asyncData({ app }) {
            const baseUrl = process.env.baseUrl + '/me/receive';
            const getUrl = encodeURI(baseUrl);
            const token = app.$auth.$storage.getUniversal("_token.auth0");
            const response = await axios.get(getUrl, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token
                }
            });
            const baseUrl2 = process.env.baseUrl + '/me/giv';
            const getUrl2 = encodeURI(baseUrl2);
            const response2 = await axios.get(getUrl2, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token
                }
            });
            return {
                receives: response.data.givs,
                givs: response2.data.givs,
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
