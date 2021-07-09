<template>
  <div class="Notification Main mt-6">
    <giv-empty-state
      class="mt-12"
      v-if="countExcludingRequests === 0"
      msg="お知らせはありません。"
    />
    <ul class="Notification__list">
      <li class="Notification__list__li" v-for="item of notifications">
        <nuxt-link
          :to="`/posts/create?givId=${item.givId}&notId=${item.id}`"
          class="bg-white block py-2 px-2 rounded mx-1 mb-1"
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
          :to="`/giv/${item.givId}`"
          v-on:click.native="markAsRead(item.id)"
          class="bg-white block py-2 px-2 rounded mx-1 mb-1"
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
        <nuxt-link
          :to="`/posts/${item.postId}`"
          v-on:click.native="markAsRead(item.id)"
          class="bg-white block py-2 px-2 rounded mx-1 mb-1"
          v-if="item.type === 'commentCreated'"
        >
          <div class="Notification__list__li__link__text">
            <p class="Notification__list__li__link__text__info">
              新しいコメントがあります
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
import api from "@/lib/api";
import { mapState } from "vuex";

export default {
  layout: "logined-notifications",
  computed: {
    ...mapState(["givRequests", "notifications"]),
    countExcludingRequests() {
      let result = 0;

      //Count general notifications
      this.notifications.forEach(n => {
        if (n.type !== "givRequest") result++;
      });

      return result;
    }
  },
  methods: {
    markAsRead(id) {
      const { uid } = api.getCurrentUser();
      api.updateNotification({ userId: this.uid, id, status: "read" });
    }
  }
};
</script>
