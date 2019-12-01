<template>
  <div class="Regist Main">
    <div class="Regist__flow">
      <div class="Regist__flow__position">
        <img class="Regist__flow__position__img" src="~/assets/image/regist_flow_04.png" alt="giv" />
      </div>
      <div class="Regist__flow__text">
        <p class="Regist__flow__text__box">
          プロフィール
          <br />確認
        </p>
        <p class="Regist__flow__text__box">giv登録</p>
        <p class="Regist__flow__text__box">場所登録</p>
        <p class="Regist__flow__text__box">興味登録</p>
      </div>
    </div>
    <div class="Regist__main">
      <div class="Regist__main__select">
        <h3 class="Regist__main__select__text">あなたの興味・関心を選択してください</h3>
        <ul class="Regist__main__select__box">
          <li class="Regist__main__select__box__li" v-for="item in interests">
            <p class="Regist__main__select__box__li__text">{{item.tag}}</p>
            <div class="Regist__main__select__box__li__btn">
              <b-form-checkbox
                v-model="selected"
                :key="item.id"
                :value="item.id"
                name="giv"
                :id="item.id"
                class="Regist__main__select__box__li__btn__check"
              >
                <span class="Regist__main__select__box__li__btn__text">選択</span>
              </b-form-checkbox>
            </div>
          </li>
        </ul>
      </div>
      <div class="Regist__main__bottom">
        <button v-on:click="next" class="Invite__btn__link">givを始める</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
const Cookie = process.client ? require("js-cookie") : undefined;
export default {
  data() {
    return {
      interests: [],
      selected: []
    };
  },
  async asyncData({ app }) {
    const baseUrl = process.env.baseUrl + "/skill_tags";
    const getUrl = encodeURI(baseUrl);
    const response = await axios.get(getUrl, {});
    return {
      interests: response.data.skill_tags
    };
  },
  methods: {
    logout() {
      Cookie.remove("auth");
      this.$store.commit("setAuth", null);
    },
    next() {
      this.$store.commit("setInterests", this.selected);
      console.log(this.selected);
      console.log(this.$store.state);
      console.log(Cookie.get("auth._token.facebook"));
      const baseUrl = process.env.baseUrl + "/users";
      const getUrl = encodeURI(baseUrl);

      const token = this.$auth.$storage.getUniversal("_token.auth0");
      console.log(token);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        }
      };

      return axios
        .post(
          baseUrl,
          {
            first_name: this.$store.state.first_name,
            last_name: this.$store.state.last_name,
            profile_image_url: this.$store.state.img,
            giv_tags: this.$store.state.skills,
            area_tags: this.$store.state.places,
            interest_tags: this.$store.state.interests,
            time_tags: [],
            invitation_code: "aAbOUwpW" //this.$store.state.code,
          },
          config
        )
        .then(res => {
          this.$router.push("/");
        })
        .catch(e => {
          this.hasError = "もう一度はじめからやり直してください";
        });
    }
  }
};
</script>

<style>
</style>
