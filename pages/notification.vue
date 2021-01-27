<template>
  <div class="Notification Main">
    <ul class="Notification__list">
      <template v-for="item of notifications">
        <template v-if="item.event_type == 'send_giv'">
          <li class="Notification__list__li">
            <nuxt-link
              :to="`/users/${item.from_user.id}`"
              class="Notification__list__li__link"
            >
              <div class="Notification__list__li__link__icon">
                <b-img
                  :src="`${basePath}${item.from_user.profile_image_path}`"
                  class="Notification__list__li__link__icon__img"
                  alt
                ></b-img>
              </div>
              <div class="Notification__list__li__link__text">
                <p class="Notification__list__li__link__text__info">
                  「{{ item.from_user.last_name }}
                  {{
                    item.from_user.first_name
                  }}」さんからgivを贈りたいのアクションがありました
                </p>
                <p class="Notification__list__li__link__text__date">
                  {{ item.created_at | moment }}
                </p>
              </div>
            </nuxt-link>
          </li>
        </template>
        <template v-else-if="item.event_type == 'want_giv'">
          <li class="Notification__list__li">
            <nuxt-link
              :to="`/users/${item.from_user.id}`"
              class="Notification__list__li__link"
            >
              <div class="Notification__list__li__link__icon">
                <b-img
                  :src="`${basePath}${item.from_user.profile_image_path}`"
                  class="Notification__list__li__link__icon__img"
                  alt
                ></b-img>
              </div>
              <div class="Notification__list__li__link__text">
                <p class="Notification__list__li__link__text__info">
                  「{{ item.from_user.last_name }}
                  {{
                    item.from_user.first_name
                  }}」さんからgivを受け取りたいのアクションがありました
                </p>
                <p class="Notification__list__li__link__text__date">
                  {{ item.created_at | moment }}
                </p>
              </div>
            </nuxt-link>
          </li>
        </template>
        <template v-else-if="item.event_type == 'thanks_card'">
          <li class="Notification__list__li">
            <nuxt-link
              :to="`/thanks?id=${getThanksJsonData(item.detail_json)}`"
              class="Notification__list__li__link"
            >
              <div class="Notification__list__li__link__text">
                <p class="Notification__list__li__link__text__info">
                  サンクスカードを書きましょう
                </p>
                <p class="Notification__list__li__link__text__date">
                  {{ item.created_at | moment }}
                </p>
              </div>
            </nuxt-link>
          </li>
        </template>

        <template v-else-if="item.event_type == 'giv'">
          <li class="Notification__list__li">
            <nuxt-link
              :to="`${getJsonData(item.detail_json)}`"
              class="Notification__list__li__link"
            >
              <div class="Notification__list__li__link__text">
                <p class="Notification__list__li__link__text__info">
                  新しいgivがあります
                </p>
                <p class="Notification__list__li__link__text__date">
                  {{ item.created_at | moment }}
                </p>
              </div>
            </nuxt-link>
          </li>
        </template>
      </template>
    </ul>
  </div>
</template>

<script>
import moment from "moment";
import api from "../lib/api";

export default {
  layout: "logined",
  async asyncData({ app }) {
    const { uid } = firebase.auth().currentUser;
    return {
      notifications: await api.listNotifications(uid)
    };
  },

  filters: {
    moment: function(date) {
      return moment(date).format("YYYY.MM.DD");
    }
  },
  methods: {
    getJsonData: function(json) {
      if (json && json !== "") {
        const obj = JSON.parse(json);
        if (obj.receive_id) {
          return "/receive/" + obj.receive_id;
        } else if (obj.giv_id) {
          return "/giv/" + obj.giv_id;
        }
      }
      return "";
    },
    getThanksJsonData: function(json) {
      if (json && json !== "") {
        const obj = JSON.parse(json);
        if (obj.receive_id) {
          return obj.receive_id;
        }
      }
      return "";
    }
  }
};
</script>

<style></style>
