<template>
  <footer
    class="bg-white fixed z-10 left-0 right-0 bottom-0 px-2 border-t border-gray-300 px-1 py-3 "
  >
    <div class="max-w-xl mx-auto flex items-center justify-between">
      <nuxt-link to="/" class=" flex flex-col items-center footer-link">
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <p class="pt-1">タイムライン</p>
      </nuxt-link>
      <nuxt-link to="/users" class="flex flex-col items-center footer-link">
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
        <p class="pt-1">検索</p>
      </nuxt-link>
      <nuxt-link
        to="/notification"
        class="flex flex-col items-center relative footer-link"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          ></path>
        </svg>
        <div
          class="w-5 h-5 text-white flex items-center justify-center rounded-full absolute top-0 right-0 -mt-3 -mr-2 bg-giv-blue"
          v-if="count > 0"
        >
          {{ count }}
        </div>
        <p class="pt-1">お知らせ</p>
      </nuxt-link>
      <nuxt-link :to="myPage" class="flex flex-col items-center footer-link">
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 22 22"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <p class="pt-1">マイページ</p>
      </nuxt-link>
    </div>
  </footer>
</template>

<script>
import api from "../lib/api";
export default {
  computed: {
    myPage() {
      const user = api.getCurrentUser();
      return `/users/${user.uid}`;
    },
    count() {
      return this.$store.getters.getNotifications().length;
    }
  }
};
</script>

<style></style>
