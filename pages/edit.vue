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
          :src="getUrl(photoURL)"
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
                v-for="item in all_interests"
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
import firebase from "../lib/firebase";
const getCurrentUser = async () => {
  const user = firebase.auth().currentUser;
  if (!user) return null;
  const doc = await firebase
    .firestore()
    .doc(`/users/${user.uid}`)
    .get();
  const profile = { ...doc.data(), id: doc.id };
  return profile;
};

const updateCurrentUser = async ({
  interests = null,
  name = null,
  job = null,
  intro = null
}) => {
  const user = firebase.auth().currentUser;
  if (!user) return null;
  let payload = {};
  if (interests && interests.length > 0) {
    payload.interests = interests;
  }
  if (intro && intro !== "") {
    payload.intro = intro;
  }
  if (name && name !== "") {
    payload.name = name;
  }
  if (job && job !== "") {
    payload.job = job;
  }

  await firebase
    .firestore()
    .doc(`/users/${user.uid}`)
    .set(payload, { merge: true });
};

const getSkills = async () => {
  const skills = [];
  const snap = await firebase
    .firestore()
    .collection("skills")
    .get();
  snap.forEach(doc => skills.push({ id: doc.id, ...doc.data() }));
  return skills;
};

export default {
  components: {},
  layout: "logined",
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
      imageSaved: false
    };
  },
  async asyncData({ app }) {
    //@Todo get user data, skills, times, areas, interests

    const user = await getCurrentUser();
    const skills = await getSkills();
    console.log(user);
    return {
      ...user,
      all_skills: skills,
      all_interests: skills
    };
  },
  async mounted() {
    if (
      !this.$store.state.skillsMap ||
      Object.keys(this.$store.state.skillsMap).length === 0
    ) {
      this.$store.commit("setSkillsMap", await getSkills());
    }
  },
  methods: {
    getUrl(path) {
      if (path && path.startsWith("http")) {
        return path;
      } else {
        return `${process.env.cdn}/${path}`;
      }
    },
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

      const ref = firebase
        .storage()
        .ref()
        .child(this.photoURL);

      ref.put(this.newPhotoFile).then(snapshot => {
        this.loading = false;
        this.imageChanged = false;
        this.imageSaved = true;
        this.photoURL = this.newPhotoURL;
        //@Todo bust the image cache as the old one stays
      });
    },
    async next() {
      this.loading = true;

      await updateCurrentUser({
        interests: this.interests,
        job: this.job,
        intro: this.intro,
        name: this.name
      });
      this.loading = false;
      /* this.error_message = ""; */
      /* let hasError = false; */
      /* if (this.last_name == "") { */
      /*   this.error_message += "姓を入力してください<br>"; */
      /*   hasError = true; */
      /* } */
      /* if (this.first_name == "") { */
      /*   this.error_message += "名を入力してください<br>"; */
      /*   hasError = true; */
      /* } */
      /* if (this.select_skills.length < 1) { */
      /*   this.error_message += "自分のgivは最低一つ選択してください<br>"; */
      /*   hasError = true; */
      /* } */
      /* if (this.select_times.length < 1) { */
      /*   this.error_message += */
      /*     "givを提供できる時間は最低一つ選択してください<br>"; */
      /*   hasError = true; */
      /* } */
      /* if (this.select_areas.length < 1) { */
      /*   this.error_message += "提供場所を一つ選択してください。<br>"; */
      /*   hasError = true; */
      /* } */
      /* if (this.select_interests.length < 1) { */
      /*   this.error_message += "興味・関心は最低一つ選択してください。<br>"; */
      /*   hasError = true; */
      /* } */
      /* if (!hasError) { */
      /*   const baseUrl = process.env.baseUrl + "/me"; */
      /*   const getUrl = encodeURI(baseUrl); */
      /*   const token = this.$auth.$storage.getUniversal("_token.auth0"); */
      /*   const config = { */
      /*     headers: { */
      /*       "Content-Type": "application/json", */
      /*       Authorization: token */
      /*     } */
      /*   }; */
      /*   const data = { */
      /*     first_name: this.first_name, */
      /*     last_name: this.last_name, */
      /*     job: this.position, */
      /*     introduction: this.introduction, */
      /*     giv_tags: this.select_skills, */
      /*     area_tags: [this.select_areas], */
      /*     interest_tags: this.select_interests, */
      /*     time_tags: this.select_times */
      /*   }; */
      /*   console.log(data); */
      /*   return axios */
      /*     .put(baseUrl, data, config) */
      /*     .then(res => { */
      /*       console.log(res); */
      /*       this.$router.push("mypage"); */
      /*     }) */
      /*     .catch(e => { */
      /*       this.hasError = "もう一度はじめからやり直してください"; */
      /*     }); */
      /* } */
    }
  }
};
</script>

<style></style>
