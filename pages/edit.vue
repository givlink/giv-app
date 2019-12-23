<template>
  <div class="User Main">
    <div class="User__profile">
      <div class="User__profile__icon">
        <b-img :src="`https://api-dev.giv.link${me.profile_image_path}`" class="User__profile__icon__img" alt></b-img>
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
          <label class="UserForm__label">役職</label>
          <b-form-input v-model="position" placeholder="役職"></b-form-input>
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
            <h3 class="Regist__main__select__text">
              あなたのgivを選択してください
            </h3>
            <ul class="Regist__main__select__box">

              <li class="Regist__main__select__box__li"  v-for="item in skills">
                <p class="Regist__main__select__box__li__text">
                  {{item.tag}}
                </p>
                <div class="Regist__main__select__box__li__btn">
                  <b-form-checkbox
                    v-model="select_skills"
                    :key="`skill_${item.id}`"
                    :value="item.id"
                    name="giv"
                    :id="`skill_${item.id}`"
                    class="Regist__main__select__box__li__btn__check"
                  >
                    <span class="Regist__main__select__box__li__btn__text">選択</span>
                  </b-form-checkbox>
                </div>
              </li>
            </ul>
          </div>
          <div class="Regist__main__select">
            <h3 class="Regist__main__select__text">
              givを提供できる時間帯を選択してください
            </h3>
            <ul class="Regist__main__select__box">

              <li class="Regist__main__select__box__li"  v-for="item in times">
                <p class="Regist__main__select__box__li__text">
                  {{item.tag}}
                </p>
                <div class="Regist__main__select__box__li__btn">
                  <b-form-checkbox
                    v-model="select_times"
                    :key="`times_${item.id}`"
                    :value="item.id"
                    name="giv"
                    :id="`times_${item.id}`"
                    class="Regist__main__select__box__li__btn__check"
                  >
                    <span class="Regist__main__select__box__li__btn__text">選択</span>
                  </b-form-checkbox>
                </div>
              </li>
            </ul>
          </div>
          <div class="Regist__main__select">
            <h3 class="Regist__main__select__text">
              提供場所を選択してください
            </h3>
            <ul class="Regist__main__select__box">
              <li class="Regist__main__select__box__li"  v-for="item in places">
                <p class="Regist__main__select__box__li__text">
                  {{item.tag}}
                </p>
                <div class="Regist__main__select__box__li__btn">
                  <b-form-radio
                    v-model="select_areas"
                    :key="`place_${item.id}`"
                    :value="item.id"
                    name="giv"
                    :id="`place_${item.id}`"
                    class="Regist__main__select__box__li__btn__check"
                  >
                    <span class="Regist__main__select__box__li__btn__text">選択</span>
                  </b-form-radio>
                </div>
              </li>
            </ul>
          </div>
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
        code: '',
        hasError: '',
        error_message: '',
        img: '',
        first_name: '',
        last_name: '',
        introduction: '',
        position: '',
        me: '',
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
    methods: {
      async checkCode() {
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
