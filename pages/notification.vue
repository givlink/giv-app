<template>
  <div class="Notification Main">
    <ul class="Notification__list">
      <template v-for="item of events">
        <template v-if="item.event_type == 'send_giv'">
          <li class="Notification__list__li">
            <a href="" class="Notification__list__li__link">
              <div class="Notification__list__li__link__icon">
                <b-img :src="`${basePath}${item.from_user.profile_image_path}`" class="Notification__list__li__link__icon__img" alt></b-img>
              </div>
              <div class="Notification__list__li__link__text">
                <p class="Notification__list__li__link__text__info">「{{item.from_user.last_name}} {{item.from_user.first_name}}」さんからgivを送りたいのアクションがありました</p>
                <p class="Notification__list__li__link__text__date">{{ item.created_at | moment }}</p>
              </div>
            </a>
          </li>
        </template>
        <template v-else-if="item.event_type == 'want_giv'">
          <li class="Notification__list__li">
            <a href="" class="Notification__list__li__link">
              <div class="Notification__list__li__link__icon">
                <b-img :src="`${basePath}${item.from_user.profile_image_path}`" class="Notification__list__li__link__icon__img" alt></b-img>
              </div>
              <div class="Notification__list__li__link__text">
                <p class="Notification__list__li__link__text__info">「{{item.from_user.last_name}} {{item.from_user.first_name}}」さんからgivを受け取りたいのアクションがありました</p>
                <p class="Notification__list__li__link__text__date">{{ item.created_at | moment }}</p>
              </div>
            </a>
          </li>
        </template>
        <template v-else-if="item.event_type == 'thanks_card'">
          <li class="Notification__list__li">
            <nuxt-link :to="`/thanks?id=${getThanksJsonData(item.detail_json)}`" class="Notification__list__li__link">
              <div class="Notification__list__li__link__text">
                <p class="Notification__list__li__link__text__info">サンクスカードを書きましょう</p>
                <p class="Notification__list__li__link__text__date">{{ item.created_at | moment }}</p>
              </div>
            </nuxt-link>
          </li>
        </template>

        <template v-else-if="item.event_type == 'giv'">
          <li class="Notification__list__li">
            <nuxt-link :to="`${getJsonData(item.detail_json)}`" class="Notification__list__li__link">
              <div class="Notification__list__li__link__text">
                <p class="Notification__list__li__link__text__info">新しいgivがあります</p>
                <p class="Notification__list__li__link__text__date">{{ item.created_at | moment }}</p>
              </div>
            </nuxt-link>
          </li>
        </template>

      </template>
    </ul>
  </div>
</template>

<script>

  import moment from 'moment';
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
      }
    },
    async asyncData({ app }) {
      const baseUrl = process.env.baseUrl + '/me/events';
      const getUrl = encodeURI(baseUrl);
      const token = app.$auth.$storage.getUniversal("_token.auth0");
      const response = await axios.get(getUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        }
      });
      return {
        events: response.data.events,
      }
    },

    filters: {
      moment: function (date) {
        return moment(date).format('YYYY.MM.DD');
      },

    },
    computed: {
      basePath () {
        return `${process.env.baseUrl}`;
      },

    },
    mounted() {
    },
    methods: {
      getJsonData: function(json) {
        if(json && json !== '') {
          const obj = JSON.parse(json);
          if(obj.receive_id) {
            return '/receive/' + obj.receive_id;
          } else if(obj.giv_id) {
            return '/giv/' + obj.giv_id;
          }
        }
        return '';
      },
      getThanksJsonData: function(json) {
        if(json && json !== '') {
          const obj = JSON.parse(json);
          if(obj.receive_id) {
            return obj.receive_id;
          }
        }
        return '';
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
