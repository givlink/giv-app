<template>
  <div>
    <div class="Invite" v-show="step === 0">
      <div class="Inner Invite__inner">
        <div class="Invite__logo">
          <img
            class="Invite__logo__img"
            src="~/assets/image/giv_logo.png"
            alt="giv"
          />
        </div>
        <div class="Invite__form">
          <div class="Invite__input">
            <p class="Invite__input__text">招待コードを入力してください</p>
            <b-form-input
              id=""
              class="Invite__input__input"
              v-model="code"
              placeholder="招待コード"
            ></b-form-input>
            <a href="https://giv.link/" class="Invite__input__link"
              >招待コードを取得するにはこちらからご登録ください。</a
            >
          </div>
          <div class="Invite__btn">
            <button v-on:click="checkCode" class="Invite__btn__link">
              次へ
            </button>
          </div>
          <p class="Invite__error">{{ hasError }}</p>
        </div>
      </div>
    </div>
    <div v-if="step === 1 && currUser" class="Regist Main">
      <div class="Regist__flow">
        <div class="Regist__flow__position">
          <img
            class="Regist__flow__position__img"
            src="~/assets/image/regist_flow_01.png"
            alt="giv"
          />
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
        <div class="Regist__main__profile">
          <h3 class="Regist__main__profile__text">プロフィールの確認</h3>
          <div class="Regist__main__profile__icon">
            <b-img
              :src="currUser.photoURL"
              class="Regist__main__profile__icon__img"
              alt
            ></b-img>
          </div>
          <p class="Regist__main__profile__name">
            {{ currUser.displayName }}
          </p>
        </div>
        <div class="Regist__main__bottom">
          <button v-on:click="next" class="Invite__btn__link">次へ</button>
        </div>
      </div>
    </div>
    <div class="Regist Main" v-show="step === 2">
      <div class="Regist__flow">
        <div class="Regist__flow__position">
          <img
            class="Regist__flow__position__img"
            src="~/assets/image/regist_flow_02.png"
            alt="giv"
          />
        </div>
        <div class="Regist__flow__text">
          <p class="Regist__flow__text__box">プロフィール<br />確認</p>
          <p class="Regist__flow__text__box">giv登録</p>
          <p class="Regist__flow__text__box">場所登録</p>
          <p class="Regist__flow__text__box">興味登録</p>
        </div>
      </div>
      <div class="Regist__main">
        <div class="Regist__main__select">
          <h3 class="Regist__main__select__text">
            あなたのgivを選択してください
          </h3>
          <ul class="Regist__main__select__box">
            <li class="Regist__main__select__box__li" v-for="item in skills">
              <p class="Regist__main__select__box__li__text">
                {{ item.tag }}
              </p>
              <div class="Regist__main__select__box__li__btn">
                <b-form-checkbox
                  v-model="selectedSkills"
                  :key="`skill_${item.id}`"
                  :value="item.id"
                  name="giv"
                  :id="`skill_${item.id}`"
                  class="Regist__main__select__box__li__btn__check"
                >
                  <span class="Regist__main__select__box__li__btn__text"
                    >選択</span
                  >
                </b-form-checkbox>
              </div>
            </li>
          </ul>
        </div>
        <div class="Regist__main__bottom">
          <button v-on:click="next" class="Invite__btn__link">次へ</button>
        </div>
        <p class="Regist__main__error">{{ this.hasError }}</p>
      </div>
    </div>

    <div class="Regist Main" v-show="step === 3">
      <div class="Regist__flow">
        <div class="Regist__flow__position">
          <img
            class="Regist__flow__position__img"
            src="~/assets/image/regist_flow_03.png"
            alt="giv"
          />
        </div>
        <div class="Regist__flow__text">
          <p class="Regist__flow__text__box">プロフィール<br />確認</p>
          <p class="Regist__flow__text__box">giv登録</p>
          <p class="Regist__flow__text__box">場所登録</p>
          <p class="Regist__flow__text__box">興味登録</p>
        </div>
      </div>
      <div class="Regist__main">
        <div class="Regist__main__select">
          <h3 class="Regist__main__select__text">
            提供場所を選択してください
          </h3>
          <ul class="Regist__main__select__box">
            <li class="Regist__main__select__box__li" v-for="item in areas">
              <p class="Regist__main__select__box__li__text">
                {{ item.tag }}
              </p>
              <div class="Regist__main__select__box__li__btn">
                <b-form-radio
                  v-model="selectedArea"
                  :key="`place_${item.id}`"
                  :value="item.id"
                  name="giv"
                  :id="`place_${item.id}`"
                  class="Regist__main__select__box__li__btn__check"
                >
                  <span class="Regist__main__select__box__li__btn__text"
                    >選択</span
                  >
                </b-form-radio>
              </div>
            </li>
          </ul>
        </div>
        <div class="Regist__main__bottom">
          <button v-on:click="next" class="Invite__btn__link">次へ</button>
        </div>
        <p class="Regist__main__error">{{ this.hasError }}</p>
      </div>
    </div>

    <div class="Regist Main" v-show="step === 4">
      <div class="Regist__flow">
        <div class="Regist__flow__position">
          <img
            class="Regist__flow__position__img"
            src="~/assets/image/regist_flow_04.png"
            alt="giv"
          />
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
          <h3 class="Regist__main__select__text">
            あなたの興味・関心を選択してください
          </h3>
          <ul class="Regist__main__select__box">
            <li class="Regist__main__select__box__li" v-for="item in skills">
              <p class="Regist__main__select__box__li__text">{{ item.tag }}</p>
              <div class="Regist__main__select__box__li__btn">
                <b-form-checkbox
                  v-model="selectedInterest"
                  :key="`interest_${item.id}`"
                  :value="item.id"
                  name="giv"
                  :id="`interest_${item.id}`"
                  class="Regist__main__select__box__li__btn__check"
                >
                  <span class="Regist__main__select__box__li__btn__text"
                    >選択</span
                  >
                </b-form-checkbox>
              </div>
            </li>
          </ul>
        </div>
        <div class="Regist__main__bottom">
          <button v-on:click="submit" class="Invite__btn__link">
            givを始める
          </button>
        </div>
        <p class="Regist__main__error">{{ this.hasError }}</p>
      </div>
    </div>
    <div class="Spinner" v-if="loading">
      <div class="Spinner__box">
        <b-spinner label="Loading..." :variant="'primary'"></b-spinner>
        <p class="Spinner__box__text">送信中</p>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../lib/api";

export default {
  layout: "noheader",
  data() {
    return {
      loading: false,
      code: "",
      hasError: "",
      step: 0,
      currUser: null,
      areas: [],
      selectedArea: null,
      skills: [],
      selectedSkills: [],
      selectedInterest: []
    };
  },
  async mounted() {
    this.currUser = api.getCurrentUser();
    this.code = this.$route.hash != "" ? this.$route.hash.slice(1) : "";
    this.areas = await api.listAreas();
    this.skills = await api.listSkills();
  },
  methods: {
    async checkCode() {
      try {
        await api.getInviteCode(this.code);
        this.step++;
      } catch (err) {
        //@Todo sentry
        console.log("Got err (invites):", err);
        this.hasError = "招待コードが間違っています";
      }
    },
    next() {
      this.step++;
    },
    async submit() {
      this.loading = true;
      try {
        const payload = {
          code: this.code,
          uid: this.currUser.uid,
          area: this.selectedArea,
          skills: this.selectedSkills,
          interests: this.selectedInterest
        };
        await api.createUserProfile(payload);
        this.loading = false;
        this.$router.push("/");
      } catch (err) {
        console.log(err);
        this.hasError = err.message;
      }
      this.loading = false;
    }
  }
};
</script>

<style></style>
