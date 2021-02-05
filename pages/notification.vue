<template>
  <div class="Notification Main">
    <ul class="Notification__list">
      <li class="Notification__list__li" v-for="item of pendingPostGivs">
        <nuxt-link
          :to="`/posts/create?givId=${item.id}`"
          class="Notification__list__li__link"
        >
          <div class="Notification__list__li__link__text">
            <p class="Notification__list__li__link__text__info">
              サンクスカードを書きましょう
            </p>
            <p class="Notification__list__li__link__text__date">
              {{ item.createdAt | moment }}
            </p>
          </div>
        </nuxt-link>
      </li>
    </ul>
    <ul class="Notification__list" v-for="item of newGivs">
      <li class="Notification__list__li">
        <nuxt-link :to="`/giv/${item.id}`" class="Notification__list__li__link">
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
    <ul class="Notification__list">
      <li class="Notification__list__li" v-for="item of givRequests">
        <nuxt-link
          :to="`/users/${item.senderId}`"
          class="Notification__list__li__link"
          v-if="item.type == 'send'"
        >
          <div class="Notification__list__li__link__icon">
            <b-img
              :src="`${item.sender.photoURL}`"
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
          :to="`/users/${item.senderId}`"
          class="Notification__list__li__link"
          v-if="item.type == 'receive'"
        >
          <div class="Notification__list__li__link__icon">
            <b-img
              :src="`${item.receiver.photoURL}`"
              class="Notification__list__li__link__icon__img"
              alt
            ></b-img>
          </div>
          <div class="Notification__list__li__link__text">
            <p class="Notification__list__li__link__text__info">
              「{{
                item.receiver.name
              }}」さんからgivを贈りたいのアクションがありました
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
  async asyncData({ app }) {
    const { uid } = api.getCurrentUser();
    const finishedGivs = await api.getFinishedGivs(uid);
    const newGivs = await api.getNewGivs(uid);
    const givRequests = await api.getGivRequests(uid);
    const postsForMe = await api.getPostsForMe(uid);
    const pendingPostGivs = [];
    finishedGivs.forEach(async giv => {
      const post = await api.getPostByGivId(giv.id);
      if (!post) {
        pendingPostGivs.push(giv);
      }
    });
    return {
      notifications: await api.listNotifications(uid),
      pendingPostGivs,
      postsForMe,
      newGivs,
      givRequests
    };
  },

  filters: {
    moment: function(date) {
      return moment(date).format("YYYY.MM.DD");
    }
  }
};
</script>

<style></style>
