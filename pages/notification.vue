<template>
  <div class="Notification Main">
    <ul class="Notification__list">
      <li class="Notification__list__li" v-for="item of notifications">
        <nuxt-link
          :to="`/posts/create?givId=${item.givId}`"
          v-on:click.native="markAsRead(item.id)"
          class="Notification__list__li__link"
          v-if="item.type === 'givFinished'"
        >
          <div class="Notification__list__li__link__text" style="width:100%;">
            <p class="Notification__list__li__link__text__info">
              サンクスカードを書きましょう
            </p>
            <div
              style="display:flex; justify-content: space-between; align-items: center;"
            >
              <p class="Notification__list__li__link__text__date">
                {{ item.createdAt | moment }}
              </p>
              <div
                style="display:flex; justify-content:center; align-items:center;"
              >
                <b-img
                  :src="getUrl(item.giver.photoURL)"
                  alt="item.giver.name"
                  style="height:30px; width:30px;border-radius:100%;"
                ></b-img>
                <span class="" style="margin-left:5px;">
                  {{ item.giver.name }} さん
                </span>
              </div>
            </div>
          </div>
        </nuxt-link>
        <nuxt-link
          :to="`/users/${item.senderId}`"
          v-on:click.native="markAsRead(item.id)"
          class="Notification__list__li__link"
          v-if="item.type === 'givRequest' && item.requestType == 'send'"
        >
          <div class="Notification__list__li__link__icon">
            <b-img
              :src="getUrl(item.sender.photoURL)"
              class="Notification__list__li__link__icon__img"
              alt
            ></b-img>
          </div>
          <div class="Notification__list__li__link__text">
            <p class="Notification__list__li__link__text__info">
              「{{
                item.sender.name
              }}」さんからgivを贈りたいのアクションがありました
            </p>
            <p class="Notification__list__li__link__text__date">
              {{ item.createdAt | moment }}
            </p>
          </div>
        </nuxt-link>
        <nuxt-link
          :to="`/users/${item.receiverId}`"
          v-on:click.native="markAsRead(item.id)"
          class="Notification__list__li__link"
          v-if="item.type === 'givRequest' && item.requestType == 'receive'"
        >
          <div class="Notification__list__li__link__icon">
            <b-img
              :src="getUrl(item.receiver.photoURL)"
              class="Notification__list__li__link__icon__img"
              alt
            ></b-img>
          </div>
          <div class="Notification__list__li__link__text">
            <p class="Notification__list__li__link__text__info">
              「{{
                item.receiver.name
              }}」さんからgivを受け取りたいのアクションがありました
            </p>
            <p class="Notification__list__li__link__text__date">
              {{ item.createdAt | moment }}
            </p>
          </div>
        </nuxt-link>
        <nuxt-link
          :to="`/giv/${item.givId}`"
          v-on:click.native="markAsRead(item.id)"
          class="Notification__list__li__link"
          v-if="item.type === 'givCreated'"
        >
          <div class="Notification__list__li__link__text">
            <p class="Notification__list__li__link__text__info">
              新しいgivがあります
            </p>
            <p class="Notification__list__li__link__text__date">
              {{ item.createdAt | moment }}
            </p>
          </div>
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
import moment from "moment";
import api from "../lib/api";

export default {
  layout: "logined",
  data() {
    return {
      pendingPostGivs: [],
      postsForMe: [],
      givs: []
    };
  },
  computed: {
    notifications() {
      return this.$store.getters.getNotifications();
    }
  },
  async asyncData({ app }) {
    const { uid } = api.getCurrentUser();
    return {
      uid
    };
  },
  methods: {
    getUrl(path) {
      if (path && path.startsWith("http")) {
        return path;
      } else {
        return `${process.env.cdn}/${path}`;
      }
    },
    markAsRead(id) {
      api.updateNotification({ userId: this.uid, id, status: "read" });
    }
  },

  filters: {
    moment: function(date) {
      let d;
      let str;
      try {
        d = date.toDate();
        str = moment.unix(d / 1000).format("YYYY.MM.DD");
      } catch (err) {
        try {
          str = moment.unix(parseFloat(date) / 1000).format("YYYY.MM.DD");
        } catch (err) {
          str = moment(new Date(date)).format("YYYY.MM.DD");
        }
      }
      if (str === "Invalid date") {
        str = moment(d)
          .utc()
          .format("YYYY.MM.DD");
      }
      return str;
    }
  }
};
</script>

<style></style>
