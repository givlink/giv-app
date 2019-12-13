<template>
  <div class="Search Main">
    <div class="Search__box">
      <div class="Search__box__form">
        <b-form-input
          id=""
          class="Search__box__form__input"
          v-model="searchWord"
          placeholder="検索word"
        ></b-form-input>
        <span class="Search__box__form__submit" v-on:click="search()"/>
      </div>
      <div class="Search__box__tags" v-if="skills">
        <template  v-for="item of skills">
          <span v-if="item.id == searchTag" v-on:click="clickTag(item)" class="Search__box__tags__tag on">{{ item.tag }}</span>
          <span v-else v-on:click="clickTag(item)" class="Search__box__tags__tag">{{ item.tag }}</span>
</template>
      </div>
    </div>
    <ul class="Search__list">
      <li class="Search__list__li" v-for="item of data.users">
        <nuxt-link :to="`/users/${item.id}`" class="Search__list__li__link">
          <div class="Search__list__li__link__icon">
            <b-img :src="`https://api-dev.giv.link${item.profile_image_path}`" class="Search__list__li__link__icon__img" alt></b-img>
          </div>
          <div class="Search__list__li__link__text">
            <p class="Search__list__li__link__text__name">{{item.last_name}} {{item.first_name}}さん</p>
          </div>
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>

    import axios from 'axios'
const Cookie = process.client ? require('js-cookie') : undefined;
export default {
    components: {
    },
    middleware: 'auth',
    layout:'logined',
    data() {
        return {
            code: '',
            hasError: '',
            searchTag: '',
            searchWord: '',
            data: {
                users: []
            }
        }
    },
    async asyncData({ app }) {
        const baseUrl = process.env.baseUrl + '/skill_tags';
        const getUrl = encodeURI(baseUrl);
        const response = await axios.get(getUrl, {
        });
        console.log(response.data);
        return {
            skills: response.data.skill_tags,
        }
    },
    mounted() {
    },
    methods: {
        async clickTag (item) {
            const baseUrl = process.env.baseUrl + "/users" + "?giv_tags=" + item.id;
            const getUrl = encodeURI(baseUrl);
            const token = this.$auth.$storage.getUniversal("_token.auth0");
            const response = await axios.get(getUrl, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token
                }
            });
            this.searchTag = item.id;
            this.$set(this.data, 'users', response.data.users);
        },
        async search () {
            console.log("hoge");
            console.log(this.searchWord);
            const baseUrl = process.env.baseUrl + "/users" + "?keywords=" + this.searchWord;
            const getUrl = encodeURI(baseUrl);
            console.log(baseUrl);
            const token = this.$auth.$storage.getUniversal("_token.auth0");
            const response = await axios.get(getUrl, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token
                }
            });
            this.$set(this.data, 'users', response.data.users);
        },
        async checkCode() {
        },
        logout() {

            this.$auth.logout();
        }
    }
}
</script>

<style>
</style>
