<template>
  <div class="User Main">
    <div class="User__profile">
      <div class="User__profile__icon">
        <b-img
          v-if="imageChanged"
          :src="newPhotoURL"
          class="User__profile__icon__img"
          alt
        ></b-img>
        <b-img
          v-else-if="!imageChanged && imageSaved"
          :src="photoURL"
          class="User__profile__icon__img"
          alt
        ></b-img>
        <b-img
          v-else
          :src="$utils.parseUrl(photoURL)"
          class="User__profile__icon__img"
          alt
        ></b-img>
        <div class="User__profile__icon__change">
          <p class="User__profile__icon__change__text">画像を変更する</p>
          <input
            class="User__profile__icon__change__file"
            type="file"
            id="image"
            accept="image/*"
            @change="onFileChange($event)"
          />
          <button
            v-on:click="sendChangeImage"
            class="User__profile__icon__change__btn"
            v-if="imageChanged"
          >
            画像の変更を確定
          </button>
        </div>
      </div>
      <div class="UserForm">
        <div class="UserForm__box">
          <label class="UserForm__label">名前</label>
          <b-form-input v-model="name" placeholder="名前"></b-form-input>
        </div>
        <div class="UserForm__box">
          <label class="UserForm__label">職業</label>
          <b-form-input v-model="job" placeholder="職業"></b-form-input>
        </div>
        <div class="UserForm__box">
          <label class="UserForm__label">紹介文</label>
          <b-form-textarea
            id="textarea"
            v-model="intro"
            placeholder="紹介文"
            rows="3"
            max-rows="6"
          ></b-form-textarea>
        </div>
        <div class="Regist__main">
          <div class="Regist__main__select">
            <h3 class="Regist__main__select__text">
              あなたの興味・関心を選択してください
            </h3>
            <ul class="Regist__main__select__box">
              <li
                class="Regist__main__select__box__li"
                v-for="item in skillsMap"
              >
                <p class="Regist__main__select__box__li__text">
                  {{ renderTag(item.id) }}
                </p>
                <div class="Regist__main__select__box__li__btn">
                  <b-form-checkbox
                    v-model="interests"
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
          <div class="UserForm__regist">
            <button v-on:click="next" class="UserForm__regist__btn">
              変更する
            </button>
            <p class="UserForm__regist__error">{{ error }}</p>
          </div>
        </div>
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
import { mapState } from "vuex";

export default {
  components: {},
  layout: "logined",
  computed: {
    ...mapState(["skillsMap"])
  },
  data() {
    return {
      photoURL: null,
      intro: "",
      name: "",
      job: "",
      interests: [],
      skills: [],
      area: null,
      loading: false,
      error: null,
      imageChanged: false,
      imageSaved: false,
      newPhotoFile: null
    };
  },
  async asyncData({ app }) {
    //@Todo show user skills, and also make them updateable
    const user = await api.getCurrentUserProfile();
    return {
      ...user
    };
  },
  methods: {
    renderTag(id) {
      try {
        return this.$store.getters.getSkillTag(id).tag;
      } catch (err) {
        return id;
      }
    },
    onFileChange(e) {
      this.imageChanged = false;
      const files = e.target.files;
      if (files.length > 0) {
        const file = files[0];
        this.newPhotoURL = this.photoURL;
        this.imageChanged = true;
        this.newPhotoFile = file;
        this.newPhotoURL = URL.createObjectURL(file);
      }
    },
    async sendChangeImage() {
      this.loading = true;

      this.photoURL = this.newPhotoURL;
      await api.updateCurrentUserPhoto(this.newPhotoFile);
      this.imageChanged = false;
      this.imageSaved = true;

      this.loading = false;
    },
    async next() {
      this.loading = true;

      await api.updateCurrentUser({
        interests: this.interests,
        job: this.job,
        intro: this.intro,
        name: this.name
      });

      this.loading = false;
    }
  }
};
</script>

<style></style>
