<template>
  <div class="Form Main">
    <p class="Form__text">
      「庄司 竜太郎」さんとのgiv<br>
      ありがとうございました!
    </p>
    <div class="Form__box">
      <label for="title" class="Form__box__label">タイトル（※）</label>
      <input type="text" name="title" id="title" class="Form__box__input">
      <label for="message" class="Form__box__label">タイトル（※）</label>
      <textarea type="text" id="message" name="message" class="Form__box__textarea"></textarea>
      <label for="image" class="Form__box__label">画像を追加しましょう（※）</label>
      <a href="" class="Form__box__file">
        画像を選択する
      </a>
    </div>
    <div class="Form__sns">
      <h2 class="Form__sns__title">SNSでシェア</h2>
      <a href="" class="Form__sns__share"><span class="Form__sns__share__text">Facebookでシェアする</span></a>
      <a href="" class="Form__sns__share"><span class="Form__sns__share__text">Twitterでシェアする</span></a>
      <a href="" class="Form__sns__share"><span class="Form__sns__share__text">Instagramでシェアする</span></a>
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
