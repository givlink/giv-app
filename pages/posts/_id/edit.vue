<template>
  <div class="Form Main">
    <div class="Spinner" v-show="loading">
      <div class="Spinner__box">
        <b-spinner label="Loading..." :variant="'primary'"></b-spinner>
      </div>
    </div>
    <p class="Form__text"></p>
    <div class="Form__box">
      <label for="title" class="Form__box__label">タイトル（※）</label>
      <b-form-input
        v-model="post.title"
        placeholder="タイトルを入力"
        class="Form__box__input"
      ></b-form-input>
      <label for="message" class="Form__box__label">メッセージ（※）</label>
      <b-form-textarea
        id="message"
        v-model="post.message"
        placeholder="メッセージを入力"
        rows="3"
        class="Form__box__textarea"
        max-rows="6"
      ></b-form-textarea>
      <div v-on:click="updateText()" class="Form__box__send mt-3">変更</div>
      <label for="image" class="Form__box__label mt-4"
        >画像一覧（※最大３つ）</label
      >
      <template v-if="image1">
        <div class="Form__img mt-2">
          <b-img
            :src="makeOrParseUrl(image1)"
            class="Form__img__img mx-auto object-cover h-auto w-full max-w-md"
            alt
          ></b-img>
          <button class="Form__img__delete" v-on:click="deleteImage('image1')">
            <b-img
              src="~/assets/image/icon_delete.png"
              class="Form__img__delete__img"
              alt
            ></b-img>
          </button>
        </div>
      </template>
      <template v-else>
        <b-form-file
          v-model="image1"
          :state="Boolean(image1)"
          placeholder="ファイルを選んでください。"
          drop-placeholder="ファイルをドロップしてください"
          class="mt-2"
        ></b-form-file>
      </template>

      <template v-if="image2">
        <div class="Form__img mt-2">
          <b-img
            :src="makeOrParseUrl(image2)"
            class="Form__img__img mx-auto object-cover h-auto w-full max-w-md"
            alt
          ></b-img>
          <button class="Form__img__delete" v-on:click="deleteImage('image2')">
            <b-img
              src="~/assets/image/icon_delete.png"
              class="Form__img__delete__img"
              alt
            ></b-img>
          </button>
        </div>
      </template>
      <template v-else>
        <b-form-file
          v-model="image2"
          :state="Boolean(image2)"
          placeholder="ファイルを選んでください。"
          drop-placeholder="ファイルをドロップしてください"
          class="mt-2"
        ></b-form-file>
      </template>

      <template v-if="image3">
        <div class="Form__img mt-2">
          <b-img
            :src="makeOrParseUrl(image3)"
            class="Form__img__img mx-auto object-cover h-auto w-full max-w-md"
            alt
          ></b-img>
          <button class="Form__img__delete" v-on:click="deleteImage('image3')">
            <b-img
              src="~/assets/image/icon_delete.png"
              class="Form__img__delete__img"
              alt
            ></b-img>
          </button>
        </div>
      </template>
      <template v-else>
        <b-form-file
          v-model="image3"
          :state="Boolean(image3)"
          placeholder="ファイルを選んでください。"
          drop-placeholder="ファイルをドロップしてください"
          class="mt-2"
        ></b-form-file>
      </template>
      <div v-on:click="updateImages()" class="Form__box__send mt-3">
        画像を更新
      </div>
    </div>
    <div class="flex items-center justify-center">
      <button
        v-on:click="deletePost()"
        class="text-center my-4 font-bold bg-gray-100 rounded-sm text-red-500 border border-red-600 px-3 py-2"
      >
        ポストを削除する
      </button>
    </div>
  </div>
</template>

<script>
import api from "~/lib/api";
import shortId from "short-uuid";
export default {
  layout: "logined",
  data() {
    return {
      image1: null,
      image2: null,
      image3: null,
      id: "",
      loading: false
    };
  },
  mounted() {
    this.id = this.$route.params.id;
  },
  async asyncData({ app, params }) {
    if (params.id) {
      const post = await api.getPostById(params.id);
      const images = post && post.images ? post.images : [];

      const payload = {
        post
      };
      if (images[0]) payload.image1 = images[0];
      if (images[1]) payload.image2 = images[1];
      if (images[2]) payload.image3 = images[2];

      return payload;
    }
  },
  computed: {
    basePath() {
      return `${process.env.baseUrl}`;
    }
  },
  methods: {
    async updateText() {
      this.loading = true;
      try {
        await api.updatePost({
          id: this.id,
          title: this.post.title,
          message: this.post.message
        });
        this.$router.push(`/posts/${this.id}`);
      } catch (err) {
        this.hasError = `送信に失敗しました: ${err.message}`;
      }
      this.loading = false;
    },
    async deleteImage(imgId) {
      this.$confirm({
        message: "本当に画像を削除しますか？",
        button: {
          no: "いいえ",
          yes: "はい"
        },
        callback: confirm => {
          if (confirm) {
            this[imgId] = null;
          }
        }
      });
    },
    async deletePost() {
      this.$confirm({
        message: "本当にこのポストを削除しますか？",
        button: {
          no: "いいえ",
          yes: "はい"
        },
        callback: async confirm => {
          if (confirm) {
            await api.deletePost(this.id);
            this.loading = false;
            this.$router.push("/");
            location.reload();
          }
        }
      });
    },
    async updateImages() {
      try {
        if (!this.image1 && !this.image2 && !this.image3) {
          alert("画像が設定されていません");
          return;
        }

        this.loading = true;

        //Handle user deleted images
        if (!this.image1 && !!this.post.images[0]) {
          //user deleted image 1
          await api.deleteImage(this.post.images[0]);
          this.post.images[0] = null;
        }
        if (!this.image2 && !!this.post.images[1]) {
          await api.deleteImage(this.post.images[1]);
          this.post.images[1] = null;
        }
        if (!this.image3 && !!this.post.images[2]) {
          await api.deleteImage(this.post.images[2]);
          this.post.images[2] = null;
        }

        if (this.image1 && typeof this.image1 !== "string") {
          //upload image 1 and replace
          const path = `images/${this.post.authorId}/posts/${
            this.post.id
          }/images/${shortId.generate()}`;
          await api.uploadImage(this.image1, path);
          if (this.post.images[0]) {
            await api.deleteImage(this.post.images[0]);
          }
          this.post.images[0] = path;
        }
        if (this.image2 && typeof this.image2 !== "string") {
          //upload image 2 and replace
          const path = `images/${this.post.authorId}/posts/${
            this.post.id
          }/images/${shortId.generate()}`;
          await api.uploadImage(this.image2, path);
          if (this.post.images[1]) {
            await api.deleteImage(this.post.images[1]);
          }
          this.post.images[1] = path;
        }
        if (this.image3 && typeof this.image3 !== "string") {
          //upload image 3 and replace
          const path = `images/${this.post.authorId}/posts/${
            this.post.id
          }/images/${shortId.generate()}`;
          await api.uploadImage(this.image3, path);
          if (this.post.images[2]) {
            await api.deleteImage(this.post.images[2]);
          }
          this.post.images[2] = path;
        }

        this.post.images = this.post.images.filter(i => i !== null);
        await api.updatePost({ id: this.id, images: this.post.images });
      } catch (err) {
        this.$sentry.captureException(err);
        const msg = `送信に失敗しました${err.message}`;
        alert(msg);
        this.hasError = msg;
      }
      this.loading = false;
    },
    makeOrParseUrl(path) {
      try {
        if (path && path.startsWith("http")) {
          return path;
        } else {
          return `${process.env.cdn}/${path}`;
        }
      } catch (err) {
        //@Todo seems this catch will never hit.
        //Possible bug
        return URL.createObjectURL(path);
      }
    }
  }
};
</script>

<style></style>
