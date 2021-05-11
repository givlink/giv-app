<template>
  <div class="Form Main">
    <p class="Form__text">
      「{{ giv.giver.name }} 」さんからのgiv<br />
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
    <div class="Spinner" v-if="sending">
      <div class="Spinner__box">
        <b-spinner label="Loading..." :variant="'primary'"></b-spinner>
        <p class="Spinner__box__text">送信中</p>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../../lib/api";
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
    const { givId, notId } = query;
    const giv = await api.getGiv(givId);
    const giver = await api.getUserProfile(giv.giverId);
    //@Todo handle when giv or giver not found
    return {
      id: givId,
      notificationId: notId,
      file: null,
      file2: null,
      file3: null,
      giv: {
        ...giv,
        giver: {
          id: giver.id,
          name: giver.name,
          photoURL: giver.photoURL
        }
      }
    };
  },
  methods: {
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    },
    async send() {
      this.sending = true;
      const images = [];
      //@Todo more dynamic way to handle file1, file2, file3 etc...
      if (this.file) images.push(this.file);
      if (this.file2) images.push(this.file2);
      if (this.file3) images.push(this.file3);

      const data = {
        title: this.title,
        message: this.message,
        images,
        authorId: api.getCurrentUser().uid,
        giv: this.giv
      };

      try {
        const user = await api.getCurrentUser();
        this.post = await api.createPost(data);
        await api.updateNotification({
          userId: user.uid,
          id: this.notificationId,
          status: "read"
        });
      } catch (err) {
        //@Todo sentry
        console.log("Got err:", err);
        this.hasError = "送信に失敗しました";
      }

      this.sending = false;
      if (this.post) {
        this.$router.push({ path: `/posts/${this.post.id}` });
      }
    }
  }
};
</script>

<style></style>
