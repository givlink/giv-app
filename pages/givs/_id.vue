<template>
  <div class="Detail Main">
    <div class="Detail__box">
      <div class="Detail__box__header">
        <a href="" class="Detail__box__header__user">
          <div class="Detail__box__header__user__icon">
            <img class="Detail__box__header__user__icon__img" src="~/assets/image/sample_profile_icon.png" alt="giv">
          </div>
          <div class="Detail__box__header__user__text">
            <p class="Detail__box__header__user__text__name">山田 太郎</p>
            <p class="Detail__box__header__user__text__position">KDS</p>
          </div>
        </a>
        <a href="" class="Detail__box__header__tag">
          トレーニング
        </a>
      </div>
      <div class="Detail__box__images">
        <img class="Detail__box__images__img" src="~/assets/image/sample_img.png" alt="giv">
        <img class="Detail__box__images__img" src="~/assets/image/sample_img.png" alt="giv">
        <img class="Detail__box__images__img" src="~/assets/image/sample_img.png" alt="giv">
      </div>
      <div class="Detail__box__info">
        <p class="Detail__box__info__good">
          <span class="Detail__box__info__good__heart">♡</span>
          <span class="Detail__box__info__good__text">いいね <span class="Detail__box__info__good__text__count">10</span>件</span>
        </p>
        <p class="Detail__box__info__time">１時間前</p>
      </div>
      <div class="Detail__box__content">
        <p class="Detail__box__content__date">2019.6.21</p>
        <h2 class="Detail__box__content__title">
          庄司さんからDGスタッフたちに<br>
          トレーニングのgivをいただきました
        </h2>
        <p class="Detail__box__content__text">
          普段、みんなパソコンに向かって座り続けているので、体の調子が悪かったり、ジムに行っても効果が感じられなかったりと、健康面で課題がありました。<br><br>
          今回は2度目になりますが、前回同様一人ひとりに合わせたプログラムを用意してくれていました。 運動するとスッキリして気持ちもどんどん前向きになりますね！<br><br>
          最後はフランス人とインド人の女の子たちが作ったヘルシーランチをみんなで美味しく頂きました。庄司さん、今回もありがとうございました😊
        </p>
      </div>
      <a href="" class="Detail__box__person">
        <div class="Detail__box__person__icon">
          <img class="Detail__box__person__icon__img" src="~/assets/image/sample_profile_icon.png" alt="giv">
        </div>
        <div class="Detail__box__person__text">
          <p class="Detail__box__person__text__head">givを贈った人</p>
          <p class="Detail__box__person__text__name">庄司 竜太郎</p>
          <p class="Detail__box__person__text__position">CO-FOUNDER & CCO</p>
        </div>
      </a>
    </div>
    <div class="Back">
      <nuxt-link to="/" class="Back__btn">
        一覧へ戻る
      </nuxt-link>
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
    async asyncData({ app, params }) {
        if(params.id) {
            const baseUrl = process.env.baseUrl + '/users/' + params.id;
            const getUrl = encodeURI(baseUrl);
            const token = app.$auth.$storage.getUniversal("_token.auth0");
            const response = await axios.get(getUrl, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token
                }
            });
            const givUrl = process.env.baseUrl + '/users/' + params.id + '/received_thanks_cards';
            const getUrl2 = encodeURI(givUrl);
            const response2 = await axios.get(getUrl2, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token
                }
            });
            return {
                me: response.data,
                givs: response2.data.thanks_cards,
            }
        }
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
