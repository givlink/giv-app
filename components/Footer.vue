<template>
  <footer class="Footer">
    <div class="Footer__inner">
      <nuxt-link to="/" class="Footer__box">
        <div class="Footer__box__icon">
          <img
            class="Footer__box__icon__img"
            src="~/assets/image/icon_01.png"
            alt=""
          />
        </div>
        <p class="Footer__box__text">タイムライン</p>
      </nuxt-link>
      <nuxt-link to="/users" class="Footer__box">
        <div class="Footer__box__icon">
          <img
            class="Footer__box__icon__img"
            src="~/assets/image/icon_03.png"
            alt=""
          />
        </div>
        <p class="Footer__box__text">検索</p>
      </nuxt-link>
      <nuxt-link to="/notification" class="Footer__box">
        <div class="Footer__box__icon">
          <img
            class="Footer__box__icon__img"
            src="~/assets/image/icon_04.png"
            alt=""
          />
        </div>
        <div class="Footer__box__notification" v-if="count > 0">
          {{ count }}
        </div>
        <p class="Footer__box__text">お知らせ</p>
      </nuxt-link>
    </div>
  </footer>
</template>

<script>
export default {
  computed: {
    count() {
      return this.$store.getters.getNotifications().length;
    }
  }
};
</script>

<style></style>
