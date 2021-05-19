<template>
  <div class="Notification Main">
    <ul class="Notification__list">
      <li class="Notification__list__li" v-for="item of notifications">
        <nuxt-link
          :to="`/posts/create?givId=${item.givId}&notId=${item.id}`"
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
                {{ $utils.parseDate(item.createdAt) }}
              </p>
              <div
                style="display:flex; justify-content:center; align-items:center;"
              >
                <b-img
                  :src="$utils.parseUrl(item.giver && item.giver.photoURL)"
                  alt=""
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
              :src="$utils.parseUrl(item.sender && item.sender.photoURL)"
              class="Notification__list__li__link__icon__img"
              alt
            ></b-img>
          </div>
          <div class="Notification__list__li__link__text">
            <p class="Notification__list__li__link__text__info">
              「{{
                item.sender && item.sender.name
              }}」さんからgivを贈りたいのアクションがありました
            </p>
            <p class="Notification__list__li__link__text__date">
              {{ $utils.parseDate(item.createdAt) }}
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
              :src="$utils.parseUrl(item.receiver && item.receiver.photoURL)"
              class="Notification__list__li__link__icon__img"
              alt
            ></b-img>
          </div>
          <div class="Notification__list__li__link__text">
            <p class="Notification__list__li__link__text__info">
              「{{
                item.receiver && item.receiver.name
              }}」さんからgivを受け取りたいのアクションがありました
            </p>
            <p class="Notification__list__li__link__text__date">
              {{ $utils.parseDate(item.createdAt) }}
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
              {{ $utils.parseDate(item.createdAt) }}
            </p>
          </div>
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
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
      const nots = this.$store.getters.getNotifications();
      return nots;
    }
  },
  async asyncData({ app }) {
    const { uid } = api.getCurrentUser();
    return {
      uid
    };
  },
  methods: {
    markAsRead(id) {
      api.updateNotification({ userId: this.uid, id, status: "read" });
    }
  }
};
</script>

<style></style>
