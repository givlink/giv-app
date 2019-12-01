<template>
  <div class="Detail Main">
    <div class="Detail__box Detail__box--other">
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
      <div class="Detail__box__wrap">
        <div class="Detail__box__finish">
          このgivは終了いたしました
        </div>
        <div class="Detail__box__images">
          <img class="Detail__box__images__img" src="~/assets/image/sample_img.png" alt="giv">
          <img class="Detail__box__images__img" src="~/assets/image/sample_img.png" alt="giv">
          <img class="Detail__box__images__img" src="~/assets/image/sample_img.png" alt="giv">
        </div>
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
        <p class="Detail__box__content__text Detail__box__content__text--other">
          普段、みんなパソコンに向かって座り続けているので、体の調子が悪かったり、ジムに行っても効果が感じられなかったりと、健康面で課題がありました。<br><br>
          今回は2度目になりますが、前回同様一人ひとりに合わせたプログラムを用意してくれていました。 運動するとスッキリして気持ちもどんどん前向きになりますね！<br><br>
          最後はフランス人とインド人の女の子たちが作ったヘルシーランチをみんなで美味しく頂きました。庄司さん、今回もありがとうございました😊
        </p>
        <div class="Detail__box__content__show">
          <span class="Detail__box__content__show__text">続きを見る</span>
          <img class="Detail__box__content__show__img" src="~/assets/image/giv_down_arrow.png" alt="下矢印">
        </div>
      </div>
    </div>
    <div class="Detail__date">
      <h2 class="Detail__date__title">開催日時</h2>
      <p class="Detail__date__info">
        <img class="Detail__date__info__img" src="~/assets/image/calendar.png" alt="カレンダー">
        <span class="Detail__date__info__text">2019年6月21日  15:00〜</span>
      </p>
      <a href="" class="Detail__date__regist">
        予定 / 履歴に日程登録
      </a>
    </div>
    <div class="Detail__place">
      <div class="Detail__place__info">
        <h2 class="Detail__place__info__title">開催場所</h2>
        <p class="Detail__place__info__text">
          〒150-8510 東京都渋谷区渋谷２丁目２１−１
        </p>
      </div>
      <div class="Detail__place__map">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.7272719155903!2d139.70129415113493!3d35.65909048869558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b5850e5a83f%3A0x70297507b32efce5!2z5riL6LC344OS44Kr44Oq44Ko!5e0!3m2!1sja!2sjp!4v1571947364891!5m2!1sja!2sjp" width="100%" height="225" frameborder="0" style="border:0;" allowfullscreen=""></iframe>
      </div>
      <div class="Detail__place__link">

        <a class="Detail__place__link__btn" href="https://goo.gl/maps/pQEDuoEsgWCpdPEk7">
          Google Mapで見る
        </a>
      </div>
    </div>
    <div class="ThanksCard">
      <a href="" class="ThanksCard__btn">
        ThanksCard・画像を投稿する
      </a>
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
