<template>
  <div class="Notification Main">
    <ul class="Notification__list">
      <li class="Notification__list__li" v-for="item of pendingPostGivs">
        <nuxt-link
          :to="`/posts/create?givId=${item.id}`"
          class="Notification__list__li__link"
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
                  alt="Giver Name"
                  style="height:30px; width:30px;border-radius:100%;"
                ></b-img>
                <span class="" style="margin-left:5px;">
                  {{ item.giver.name }} さん
                </span>
              </div>
            </div>
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
  methods: {
    getUrl(path) {
      if (path && path.startsWith("http")) {
        return path;
      } else {
        return `${process.env.cdn}/${path}`;
      }
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
        str = moment(new Date(date)).format("YYYY.MM.DD");
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
