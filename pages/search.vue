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
          <span v-if="item.id == searchTag" v-on:click="clickTag(item.id)" class="Search__box__tags__tag on">{{ item.tag }}</span>
          <span v-else v-on:click="clickTag(item.id)" class="Search__box__tags__tag">{{ item.tag }}</span>
        </template>
      </div>
    </div>
    <ul class="Search__list">
      <li class="Search__list__li" v-for="item of data.users">
        <nuxt-link :to="`/users/${item.id}`" class="Search__list__li__link">
          <div class="Search__list__li__link__icon">
            <b-img :src="`${basePath}${item.profile_image_path}`" class="Search__list__li__link__icon__img" alt></b-img>
          </div>
          <div class="Search__list__li__link__text">
            <p class="Search__list__li__link__text__name">{{item.last_name}} {{item.first_name}}さん</p>
            <p class="Search__list__li__link__text__tags">
              <span class="Search__list__li__link__text__tags__text" v-for="skill of item.skills">{{skill.tag}}</span>
            </p>
          </div>
        </nuxt-link>
      </li>
      <li class="Search__list__li" v-if="hasNext" v-on:click="loadmore()"><span class="Search__list__li__link" style="text-align: center;font-size: 1.6em;">さらに読み込む</span></li>
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
        nowSearchWord: '',
        offset: 0,
        limit: 30,
        hasNext: true,
        loadMode: 0,
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
      const baseUrl2 = process.env.baseUrl + "/users";

      const token = app.$auth.$storage.getUniversal("_token.auth0");
      const getUrl2 = encodeURI(baseUrl2);
      const response2 = await axios.get(getUrl2, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        }
      });
      return {
        skills: response.data.skill_tags,
        data: {
          users:  response2.data.users
        }
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
      async normal () {
        if(this.loadMode != 0 ) {
          this.offset = 0;
          this.data.users = [];
        }
        const baseUrl = process.env.baseUrl + "/users" + "?offset="+this.offset+"&limit="+this.limit;
        const getUrl = encodeURI(baseUrl);
        const token = this.$auth.$storage.getUniversal("_token.auth0");
        const response = await axios.get(getUrl, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token
          }
        });
        this.loadMode = 0;
        this.hasNext = response.data.total > this.offset + this.limit;
        let data = this.data.users.concat(response.data.users);
        this.$set(this.data, 'users', data);
      },
      async clickTag (item) {
        if(this.loadMode != 1 || item != this.searchTag ) {
          this.offset = 0;
          this.data.users = [];
        }
        const baseUrl = process.env.baseUrl + "/users" + "?giv_tags=" + item+"&offset="+this.offset+"&limit="+this.limit;
        const getUrl = encodeURI(baseUrl);
        const token = this.$auth.$storage.getUniversal("_token.auth0");
        const response = await axios.get(getUrl, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token
          }
        });
        this.searchTag = item;
        this.loadMode = 1;
        this.hasNext = response.data.total > this.offset + this.limit;
        let data = this.data.users.concat(response.data.users);
        this.$set(this.data, 'users', data);
      },
      async search () {
        if(this.loadMode != 2 || this.nowSearchWord != this.searchWord) {
          this.offset = 0;
          this.data.users = [];
        }
        const baseUrl = process.env.baseUrl + "/users" + "?keywords=" + this.searchWord+"&offset="+this.offset+"&limit="+this.limit;
        const getUrl = encodeURI(baseUrl);
        const token = this.$auth.$storage.getUniversal("_token.auth0");
        const response = await axios.get(getUrl, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token
          }
        });
        this.loadMode = 2;
        this.hasNext = response.data.total > this.offset + this.limit;
        this.nowSearchWord = this.searchWord;
        let data = this.data.users.concat(response.data.users);
        this.$set(this.data, 'users', data);
      },
      loadmore() {
        this.offset = this.offset + this.limit;
        if(this.loadMode == 0) {
          this.normal();
        }else if(this.loadMode == 1) {
          this.clickTag(this.searchTag);
        } else if(this.loadMode == 2) {
          this.search();
        }
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
