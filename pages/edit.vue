<template>
  <div class="User Main">
    <div class="User__profile">
      <div class="User__profile__icon">
        <b-img :src="imageData" class="User__profile__icon__img" alt></b-img>
        <div class="User__profile__icon__change">
          <p class="User__profile__icon__change__text">画像を変更する</p>
          <input class="User__profile__icon__change__file" type="file" id="image" accept="image/*" @change="onFileChange($event)">
          <button v-on:click="sendChangeImage" class="User__profile__icon__change__btn" v-if="changeImage">画像の変更を確定</button>
          <p class="" v-if="hasImageError != ''">{hasImageError}</p>
        </div>
      </div>
      <div class="UserForm">
        <div class="UserForm__box">
          <label class="UserForm__label">姓</label>
          <b-form-input v-model="last_name" placeholder="姓"></b-form-input>
        </div>
        <div class="UserForm__box">
          <label class="UserForm__label">名</label>
          <b-form-input v-model="first_name" placeholder="名"></b-form-input>
        </div>
        <div class="UserForm__box">
          <label class="UserForm__label">職業</label>
          <b-form-input v-model="position" placeholder="職業"></b-form-input>
        </div>
        <div class="UserForm__box">
          <label class="UserForm__label">紹介文</label>
          <b-form-textarea
            id="textarea"
            v-model="introduction"
            placeholder="紹介文"
            rows="3"
            max-rows="6"
          ></b-form-textarea>
        </div>
        <div class="Regist__main">
          <div class="Regist__main__select">
            <h3 class="Regist__main__select__text">あなたの興味・関心を選択してください</h3>
            <ul class="Regist__main__select__box">
              <li class="Regist__main__select__box__li" v-for="item in interests">
                <p class="Regist__main__select__box__li__text">{{item.tag}}</p>
                <div class="Regist__main__select__box__li__btn">
                  <b-form-checkbox
                    v-model="select_interests"
                    :key="`interest_${item.id}`"
                    :value="item.id"
                    name="giv"
                    :id="`interest_${item.id}`"
                    class="Regist__main__select__box__li__btn__check"
                  >
                    <span class="Regist__main__select__box__li__btn__text">選択</span>
                  </b-form-checkbox>
                </div>
              </li>
            </ul>
          </div>
          <div class="UserForm__regist">
            <button v-on:click="next" class="UserForm__regist__btn">変更する</button>
            <p class="UserForm__regist__error">{{error_message}}</p>
          </div>
        </div>
      </div>
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

  const Cookie = process.client ? require('js-cookie') : undefined;
  import axios from "axios";
  export default {
    components: {
    },
    middleware: 'auth',
    layout:'logined',
    data() {
      return {
        changeImage: false,
        sending: false,
        profileFile: null,
        imageData: '',
        code: '',
        hasError: '',
        error_message: '',
        img: '',
        first_name: '',
        last_name: '',
        introduction: '',
        position: '',
        me: '',
        hasImageError: '',
        givs: '',
      }
    },
    async asyncData({ app }) {
      const baseUrl = process.env.baseUrl + '/me';
      const getUrl = encodeURI(baseUrl);
      const token = app.$auth.$storage.getUniversal("_token.auth0");
      const response = await axios.get(getUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        }
      });
      const skilUrl = process.env.baseUrl + '/skill_tags';
      const response2 = await axios.get(encodeURI(skilUrl), {
      });
      const baseUrl_time = process.env.baseUrl + '/time_tags';
      const getUrl_time = encodeURI(baseUrl_time);
      const response3 = await axios.get(getUrl_time, {
      });
      const areaUrl = process.env.baseUrl + '/area_tags';
      const response4 = await axios.get(encodeURI(areaUrl), {
      });
      const me = response.data;
      let select_skills = [];
      let select_areas = '';
      let select_times = [];
      let select_interests = [];
      if(me.skills) {
        me.skills.map((value => select_skills.push(value.id)));
      }
      if(me.areas) {
        me.areas.map((value => select_areas = value.id));
      }if(me.times) {
        me.times.map((value => select_times.push(value.id)));
      }
      if(me.interests) {
        me.interests.map((value => select_interests.push(value.id)));
      }


      return {
        me: me,
        imageData: `${process.env.baseUrl}${me.profile_image_path}`,
        skills: response2.data.skill_tags,
        times: response3.data.time_tags,
        places: response4.data.area_tags,
        interests: response2.data.skill_tags,
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        introduction: response.data.introduction,
        position: response.data.position,
        select_skills: select_skills,
        select_times: select_times,
        select_areas: select_areas,
        select_interests: select_interests,
      }
    },
    mounted() {
    },

    computed: {
      basePath () {
        return `${process.env.baseUrl}`;
      },
    },
    methods: {
      async checkCode() {
      },
      onFileChange(e) {

        const files = e.target.files;

        if(files.length > 0) {

          const file = files[0];
          const reader = new FileReader();
          reader.onload = (e) => {

            this.imageData = e.target.result;
            this.changeImage = true;

          };
          reader.readAsDataURL(file);
          this.profileFile = file;

        }

      },
      async sendChangeImage() {
        this.sending = true;
        const baseUrl = process.env.baseUrl + "/me/profile_image";
        const getUrl = encodeURI(baseUrl);
        const token = this.$auth.$storage.getUniversal("_token.auth0");
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: token
          }
        };
        var fileData = '';
        if(this.profileFile) {
          await this.getBase64(this.profileFile).then(image => fileData = image);
        }
        if(fileData != '') {

          const data = {
            profile_image: fileData
          }
          return axios
            .put(
              baseUrl,
              data,
              config
            )
            .then(res => {
              this.sending = false;

              this.$router.push("/mypage");
            })
            .catch(e => {
              this.sending = false;
              this.hasImageError = "送信に失敗しました";
            });
        } else {
          this.sending = false;
          this.hasImageError = "送信に失敗しました";
        }
      },

      getBase64 (file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => resolve(reader.result)
          reader.onerror = error => reject(error)
        })
      },
      next() {
        this.error_message = '';
        let hasError = false;

        if(this.last_name == '') {
          this.error_message += '姓を入力してください<br>';
          hasError = true;
        }
        if(this.first_name == '') {
          this.error_message += '名を入力してください<br>';
          hasError = true;
        }
        if(this.select_skills.length < 1) {
          this.error_message += '自分のgivは最低一つ選択してください<br>';
          hasError = true;
        }
        if(this.select_times.length < 1) {
          this.error_message += 'givを提供できる時間は最低一つ選択してください<br>';
          hasError = true;
        }
        if(this.select_areas.length < 1) {
          this.error_message += '提供場所を一つ選択してください。<br>';
          hasError = true;
        }
        if(this.select_interests.length < 1) {
          this.error_message += '興味・関心は最低一つ選択してください。<br>';
          hasError = true;
        }

        if(!hasError) {
          const baseUrl = process.env.baseUrl + "/me";
          const getUrl = encodeURI(baseUrl);

          const token = this.$auth.$storage.getUniversal("_token.auth0");
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: token
            }
          };
          const data = {
            first_name: this.first_name,
            last_name: this.last_name,
            job: this.position,
            introduction: this.introduction,
            giv_tags: this.select_skills,
            area_tags: [this.select_areas],
            interest_tags: this.select_interests,
            time_tags: this.select_times,
          }

          console.log(data);

          return axios
            .put(
              baseUrl,
              data,
              config
            )
            .then(res => {
              console.log(res);
              this.$router.push("mypage");
            })
            .catch(e => {
              this.hasError = "もう一度はじめからやり直してください";
            });
        }


      },
      logout() {

        this.$auth.logout();
      }
    }
  }
</script>

<style>
</style>
