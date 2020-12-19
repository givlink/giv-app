<template>
  <div class="Form Main">
    <p class="Form__text">
    </p>
    <div class="Form__box">
      <label for="title" class="Form__box__label">タイトル（※）</label>
      <b-form-input v-model="title" placeholder="タイトルを入力" class="Form__box__input"></b-form-input>
      <label for="message" class="Form__box__label">メッセージ（※）</label>
      <b-form-textarea
        id="message"
        v-model="message"
        placeholder="メッセージを入力"
        rows="3"
        class="Form__box__textarea"
        max-rows="6"
      ></b-form-textarea>
      <div v-on:click="updateText()" class="Form__box__send mt-3">変更</div>
      <label for="image" class="Form__box__label mt-4">画像一覧（※最大３つ）</label>
      <label for="image" class="Form__box__label mt-3">1つ目</label>
      <template v-if="images.length > 0 && image1">
        <div class="Form__img">
          <b-img :src="`${basePath}${images[0].path}`" class="Form__img__img" alt></b-img>
          <div class="Form__img__delete" v-on:click="deleteImage(1)">
            <b-img src="~/assets/image/icon_delete.png" class="Form__img__delete__img" alt></b-img>
          </div>
        </div>
      </template>
      <template v-else>
        <b-form-file
          v-model="file"
          :state="Boolean(file)"
          placeholder="ファイルを選んでください。"
          drop-placeholder="ファイルをドロップしてください"
        ></b-form-file>
        <div v-on:click="sendImage(1)" class="Form__box__send mt-3">1つ目の画像を設定</div>
      </template>
      <label for="image" class="Form__box__label mt-3">2つ目</label>
      <template v-if="images.length > 1 && image2">
        <div class="Form__img">
          <b-img :src="`${basePath}${images[1].path}`" class="Form__img__img" alt></b-img>
          <div class="Form__img__delete" v-on:click="deleteImage(2)">
            <b-img src="~/assets/image/icon_delete.png" class="Form__img__delete__img" alt></b-img>
          </div>
        </div>
      </template>
      <template v-else>
        <b-form-file
          v-model="file2"
          :state="Boolean(file2)"
          placeholder="ファイルを選んでください。"
          drop-placeholder="ファイルをドロップしてください"
        ></b-form-file>
        <div v-on:click="sendImage(2)" class="Form__box__send mt-3">2つ目の画像を設定</div>
      </template>
      <label for="image" class="Form__box__label mt-3">3つ目</label>
      <template v-if="images.length > 2 && image2">
        <div class="Form__img">
          <b-img :src="`${basePath}${images[2].path}`" class="Form__img__img" alt></b-img>
          <div class="Form__img__delete" v-on:click="deleteImage(3)">
            <b-img src="~/assets/image/icon_delete.png" class="Form__img__delete__img" alt></b-img>
          </div>
        </div>
      </template>
      <template v-else>
        <b-form-file
          v-model="file3"
          :state="Boolean(file3)"
          placeholder="ファイルを選んでください。"
          drop-placeholder="ファイルをドロップしてください"
        ></b-form-file>
        <div v-on:click="sendImage(3)" class="Form__box__send mt-3">3つ目の画像を設定</div>
      </template>
    </div>
  </div>
</template>

<script>

  const Cookie = process.client ? require('js-cookie') : undefined;
  import axios from 'axios';
  export default {
    components: {
    },
    middleware: 'auth',
    layout:'logined',
    data() {
      return {
        'title': '',
        'message': '',
        'file': '',
        'id': '',
        'images': []
      }
    },
    mounted() {
      this.id = this.$route.query.id;
      console.log(this.$route.query.id);
    },
    async asyncData({ app, params  }) {
      if(params.id) {
        const baseUrl = process.env.baseUrl + '/thanks_cards/' + params.id;
        const getUrl = encodeURI(baseUrl);
        const token = app.$auth.$storage.getUniversal("_token.auth0");
        const response = await axios.get(getUrl, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token
          }
        });
        let thanks = response.data;
        return {
          thanks: thanks,
          title: thanks.title,
          message: thanks.message,
          images: thanks.images,
          image1: thanks.images.length > 0,
          image2: thanks.images.length > 1,
          image3: thanks.images.length > 2,
        }
      }
    },
    computed: {
      basePath () {
        return `${process.env.baseUrl}`;
      },
    },
    methods: {
      async updateText() {
        const baseUrl = process.env.baseUrl + "/me/receive/"+ this.thanks.giv.id +"/thanks_card/" + this.thanks.id;
        const getUrl = encodeURI(baseUrl);
        const data = {
          title: this.title,
          message: this.message,
        }
        return axios
          .put(
            baseUrl,
            data,
          )
          .then(res => {
            alert("変更しました");
            this.$router.push("/thanks/"+this.thanks.id);
          })
          .catch(e => {
            this.hasError = "送信に失敗しました";
          });
      },
      async deleteImage(num) {
        var result = confirm('本当に画像'+num+'を削除しますか？');

        if(result) {
          //はいを選んだときの処理
          const baseUrl = process.env.baseUrl + "/me/receive/"+ this.thanks.giv.id +"/thanks_card/" + this.thanks.id + "/image/"+this.thanks.images[num - 1].id;
          const getUrl = encodeURI(baseUrl);
          return axios
            .delete(
              baseUrl,
            )
            .then(res => {
              alert("画像を削除しました");
              switch (num) {
                case 1:
                  this.image1 = false;
                  break;
                case 2:
                  this.image2 = false;
                  break;
                case 3:
                  this.image3 = false;
                  break;
              }
            })
            .catch(e => {
              this.hasError = "削除に失敗しました";
            });
        } else {
          //いいえを選んだときの処理
          alert("キャンセルしました");
        }

      },
      async sendImage(num) {
        const baseUrl = process.env.baseUrl + "/me/receive/"+ this.thanks.giv.id +"/thanks_card/" + this.thanks.id + "/image";
        const getUrl = encodeURI(baseUrl);
        var imageData = '';
        switch (num) {
          case 1:
            if(this.file) {
              await this.getBase64(this.file).then(image => imageData = image );
            }
            break;
          case 2:
            if(this.file2) {
              await this.getBase64(this.file2).then(image => imageData = image );
            }
            break;
          case 3:
            if(this.file3) {
              await this.getBase64(this.file3).then(image => imageData = image );
            }
            break;
        }
        if(!imageData || imageData == '') {
          alert("画像が設定されていません");
          return;
        }

        const data = {
          'image' : imageData
        };
        return axios
          .post(
            baseUrl,
            data,
          )
          .then(res => {
            alert("画像を追加しました");
            this.$router.push("/thanks/"+this.thanks.id);
          })
          .catch(e => {
            this.hasError = "送信に失敗しました";
          });
      },
      async send() {
        const baseUrl = process.env.baseUrl + "/me/receive/"+ this.id +"/thanks_card";
        const getUrl = encodeURI(baseUrl);
        const token = this.$auth.$storage.getUniversal("_token.auth0");
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: token
          }
        };
        var fileData = [];
        if(this.file) {
          await this.getBase64(this.file).then(image => fileData.push(image));
        }
        if(this.file2) {
          await this.getBase64(this.file2).then(image => fileData.push(image));
        }
        if(this.file3) {
          await this.getBase64(this.file3).then(image => fileData.push(image));
        }
        const data = {
          title: this.title,
          message: this.message,
          images: fileData
        }

        return axios
          .post(
            baseUrl,
            data,
            config
          )
          .then(res => {
            this.$router.push("/");
          })
          .catch(e => {
            this.hasError = "送信に失敗しました";
          });
      },
      getBase64 (file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => resolve(reader.result)
          reader.onerror = error => reject(error)
        })
      },
      logout() {
        this.$auth.logout();
      }
    }
  }
</script>

<style>
</style>
