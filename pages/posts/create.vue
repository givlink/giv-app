<template>
  <div class="Form Main">
    <p class="Form__text">
      「{{ giv.sender.name }} 」さんからのgiv<br />
      ありがとうございました!
    </p>
    <div class="Form__box">
      <label for="title" class="Form__box__label">タイトル（※）</label>
      <b-form-input
        v-model="title"
        placeholder="例：○○さんから〇〇のgivを頂きました！"
        class="Form__box__input"
      ></b-form-input>
      <label for="message" class="Form__box__label">メッセージ（※）</label>
      <b-form-textarea
        id="message"
        v-model="message"
        placeholder="以下を内容等を参考に自由に書いてね！
-このgivを受け取った理由や背景
-実際givを受けてみた感想
-givを受けた後の結果や周囲の評価
-どんな人にこのgivが適しているか等"
        rows="3"
        class="Form__box__textarea"
        max-rows="6"
      ></b-form-textarea>
      <label for="image" class="Form__box__label"
        >画像を追加しましょう（※最大３つ）</label
      >
      <label for="image" class="Form__box__label">1つ目</label>
      <b-form-file
        v-model="file"
        :state="Boolean(file)"
        placeholder="ファイルを選んでください。"
        drop-placeholder="ファイルをドロップしてください"
      ></b-form-file>
      <label for="image" class="Form__box__label mt-3">2つ目</label>
      <b-form-file
        v-model="file2"
        :state="Boolean(file2)"
        placeholder="ファイルを選んでください。"
        drop-placeholder="ファイルをドロップしてください"
      ></b-form-file>
      <label for="image" class="Form__box__label mt-3">3つ目</label>
      <b-form-file
        v-model="file3"
        :state="Boolean(file3)"
        placeholder="ファイルを選んでください。"
        drop-placeholder="ファイルをドロップしてください"
      ></b-form-file>
      <!-- Plain mode -->
      <div v-on:click="send()" class="Form__box__send mt-3">送信</div>
    </div>
    <!--    <div class="Form__sns">-->
    <!--      <h2 class="Form__sns__title">SNSでシェア</h2>-->
    <!--      <a href="" class="Form__sns__share"><span class="Form__sns__share__text">Facebookでシェアする</span></a>-->
    <!--      <a href="" class="Form__sns__share"><span class="Form__sns__share__text">Twitterでシェアする</span></a>-->
    <!--      <a href="" class="Form__sns__share"><span class="Form__sns__share__text">Instagramでシェアする</span></a>-->
    <!--    </div>-->

    <div class="Spinner" v-if="sending">
      <div class="Spinner__box">
        <b-spinner label="Loading..." :variant="'primary'"></b-spinner>
        <p class="Spinner__box__text">送信中</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  /* middleware: 'auth', */
  layout: "logined",
  data() {
    return {
      title: "",
      message: "",
      file: "",
      id: "",
      sending: false
    };
  },
  mounted() {},
  async asyncData({ app, query }) {
    return {
      id: query.id,
      file1: null,
      file2: null,
      file3: null,
      giv: {
        sender: {
          name: "Test user"
        },
        status: "finished"
      } //@Todo get giv data
    };
  },
  methods: {
    async send() {
      //@Todo create post for the giv
      //@Todo upload images
      this.sending = true;
      /* const data = { */
      /*   title: this.title, */
      /*   message: this.message, */
      /*   images: fileData */
      /* }; */

      /* return axios */
      /*   .post(baseUrl, data, config) */
      /*   .then(res => { */
      /*     this.sending = false; */
      /*     this.$router.push("/"); */
      /*   }) */
      /*   .catch(e => { */
      /*     this.sending = false; */
      /*     this.hasError = "送信に失敗しました"; */
      /*   }); */
      //@Todo upload images
    }
  }
};
</script>

<style></style>
