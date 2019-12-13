<template>
  <div class="Form Main">
    <p class="Form__text">
      「{{giv.giv_user.last_name}}} {{giv.giv_user.first_name}}}」さんとのgiv<br>
      ありがとうございました!
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
      <label for="image" class="Form__box__label">画像を追加しましょう（※）</label>
      <b-form-file
        v-model="file"
        :state="Boolean(file)"
        placeholder="ファイルを選んでください。"
        drop-placeholder="ファイルをドロップしてください"
      ></b-form-file>
      <div class="mt-3">選択したファイル: {{ file ? file.name : '' }}</div>
      <!-- Plain mode -->
      <div v-on:click="send()" class="Form__box__send">送信</div>
    </div>
    <!--    <div class="Form__sns">-->
    <!--      <h2 class="Form__sns__title">SNSでシェア</h2>-->
    <!--      <a href="" class="Form__sns__share"><span class="Form__sns__share__text">Facebookでシェアする</span></a>-->
    <!--      <a href="" class="Form__sns__share"><span class="Form__sns__share__text">Twitterでシェアする</span></a>-->
    <!--      <a href="" class="Form__sns__share"><span class="Form__sns__share__text">Instagramでシェアする</span></a>-->
    <!--    </div>-->
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
            }
        },
        mounted() {
            this.id = this.$route.query.id;
            console.log(this.$route.query.id);
        },
        async asyncData({ app, query }) {
            const baseUrl = process.env.baseUrl + '/me/receive/' + query.id;
            const getUrl = encodeURI(baseUrl);
            const token = app.$auth.$storage.getUniversal("_token.auth0");
            const response = await axios.get(getUrl, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token
                }
            });
            return {
                giv: response.data,
            }
        },
        methods: {
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
                var fileData = '';
                await this.getBase64(this.file).then(image => fileData = image);
                console.log(fileData);
                const data = {
                    title: this.title,
                    message: this.message,
                    images: [
                        fileData
                        ]
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
