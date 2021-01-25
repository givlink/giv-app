<template>
  <div class="Search Main">
    <div class="Search__box">
      <div class="Search__box__tags" v-if="skills">
        <template v-for="item of skills">
          <span
            v-on:click="clickTag(item.id)"
            :class="item.id == searchTag && 'Search__box__tags__tag__active'"
            class="Search__box__tags__tag"
            >{{ item.tag }}</span
          >
        </template>
      </div>
    </div>
    <ul class="Search__list">
      <li class="Search__list__li" v-for="item of users">
        <nuxt-link :to="`/users/${item.id}`" class="Search__list__li__link">
          <div class="Search__list__li__link__icon">
            <b-img
              :src="getUrl(item.photoURL)"
              class="Search__list__li__link__icon__img"
              alt
            ></b-img>
          </div>
          <div class="Search__list__li__link__text">
            <p class="Search__list__li__link__text__name">
              {{ item.name }} さん
            </p>
            <p class="Search__list__li__link__text__tags">
              <span
                class="Search__list__li__link__text__tags__text"
                v-for="skill of item.skills"
              >
                {{ renderTag(skill) }}
              </span>
            </p>
          </div>
        </nuxt-link>
      </li>
      <li class="Search__list__li" v-if="hasNext" v-on:click="loadmore()">
        <span
          class="Search__list__li__link"
          style="text-align: center;font-size: 1.6em;"
          >さらに読み込む</span
        >
      </li>
    </ul>
  </div>
</template>

<script>
import firebase from "../lib/firebase";

//@Todo refactor to common lib
const listUsers = async (offset = null, limit = 20, filter = null) => {
  let snap = firebase.firestore().collection("users");
  if (offset) snap = snap.startAfter(offset);

  if (filter) snap = snap.where(filter[0], filter[1], filter[2]);
  //eg
  /* snap = snap.where("skills", "array-contains",[ "accomodation"]); */

  snap = await snap.limit(limit).get(); //@Todo sec rules

  const users = [];
  snap.forEach(doc => users.push({ ...doc.data(), id: doc.id }));
  return [users, snap.docs[snap.docs.length - 1]];
};

const listSkills = async () => {
  const skills = {};
  const snap = await firebase
    .firestore()
    .collection("skills")
    .get();
  snap.forEach(doc => (skills[doc.id] = { id: doc.id, ...doc.data() }));
  return skills;
};

export default {
  layout: "logined",
  data() {
    return {
      searchTag: null,
      offset: null,
      limit: 30,
      hasNext: true
    };
  },
  async asyncData({ app }) {
    const skillsMap = await listSkills();
    const [users, offset] = await listUsers();
    return {
      skills: Object.values(skillsMap),
      users,
      offset
    };
  },
  async mounted() {
    if (
      !this.$store.state.skillsMap ||
      Object.keys(this.$store.state.skillsMap).length === 0
    ) {
      console.log("setting again");
      this.$store.commit("setSkillsMap", await listSkills());
    }
  },
  methods: {
    makeTagFilter() {
      if (!this.searchTag || this.searchTag == "") {
        return null;
      }
      return ["skills", "array-contains", this.searchTag];
    },

    renderTag(id) {
      try {
        return this.$store.getters.getSkillTag(id).tag;
      } catch (err) {
        return id;
      }
    },
    getUrl: path => `${process.env.cdn}/${path}`,
    async clickTag(id) {
      this.searchTag = id;

      const [users, offset] = await listUsers(null, 20, this.makeTagFilter());

      this.users = users;
      this.offset = offset;
    },
    async loadmore() {
      const [users, offset] = await listUsers(
        this.offset,
        this.limit,
        this.makeTagFilter()
      );
      this.users = [...this.users, ...users];
      this.offset = offset;
    }
  }
};
</script>

<style></style>
