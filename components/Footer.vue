<template>
  <footer class="Footer">
    <nuxt-link to="/" class="Footer__box">
      <div class="Footer__box__icon">
        <img class="Footer__box__icon__img" src="~/assets/image/icon_01.png" alt="">
      </div>
      <p class="Footer__box__text">タイムライン</p>
    </nuxt-link>
    <nuxt-link to="/schedule" class="Footer__box">
      <div class="Footer__box__icon">
        <img class="Footer__box__icon__img" src="~/assets/image/icon_02.png" alt="">
      </div>
      <p class="Footer__box__text">予定/履歴</p>
    </nuxt-link>
    <nuxt-link to="/search" class="Footer__box">
      <div class="Footer__box__icon">
        <img class="Footer__box__icon__img" src="~/assets/image/icon_03.png" alt="">
      </div>
      <p class="Footer__box__text">検索</p>
    </nuxt-link>
    <nuxt-link to="/notification" class="Footer__box" @click.native="deleteCount()">
      <div class="Footer__box__icon">
        <img class="Footer__box__icon__img" src="~/assets/image/icon_04.png" alt="">
      </div>
      <div class="Footer__box__notification" v-if="count > 0">
        {{count}}
      </div>
      <p class="Footer__box__text">お知らせ</p>
    </nuxt-link>
  </footer>
</template>

<script>

  import axios from 'axios'
  export default {
    data() {
      return {
        count: 0
      };

    },
    async created() {
      const baseUrl = process.env.baseUrl + '/me/events';
      const getUrl = encodeURI(baseUrl);
      const response = await axios.get(getUrl);
      const events =  response.data.events;
      var count = 0;
      events.map((event)=> {
        if(event.read_at == null) {
          count++;
        }
      });
      this.count = count;
    },
    methods: {
      deleteCount() {
        this.count = 0
      }
    }


  }

</script>

<style>

</style>
