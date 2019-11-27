<template>
  <div class="Regist Main">
    <div class="Regist__flow">
      <div class="Regist__flow__position">
        <img class="Regist__flow__position__img" src="~/assets/image/regist_flow_01.png" alt="giv">
      </div>
      <div class="Regist__flow__text">
        <p class="Regist__flow__text__box">プロフィール<br>確認</p>
        <p class="Regist__flow__text__box">giv登録</p>
        <p class="Regist__flow__text__box">場所登録</p>
        <p class="Regist__flow__text__box">興味登録</p>
      </div>
    </div>
    <div class="Regist__main">
      <div class="Regist__main__profile">
        <h3 class="Regist__main__profile__text">
          プロフィールの確認
        </h3>
        <div class="Regist__main__profile__icon">
          <b-img :src='`${img}`' class="Regist__main__profile__icon__img" alt=""></b-img>
        </div>
        <p class="Regist__main__profile__name">{{name}}</p>
<!--        <p class="Regist__main__profile__position">KDS</p>-->
      </div>
      <div class="Regist__main__bottom">
        <button v-on:click="next" class="Invite__btn__link">次へ</button>
      </div>
    </div>
  </div>
</template>

<script>
    import Logo from '~/components/Logo.vue'

    export default {
        data() {
            return {
                img: '',
                name: '',
            }
        },
        mounted() {
            this.img = this.$store.state.auth.user.picture?  this.$store.state.auth.user.picture.data.url: '';
            this.name = this.$store.state.auth.user.name;
        },
        methods: {
            next() {
                this.$store.commit("setUser", this.img, this.name);
                this.$router.push('/regist_giv')
            }
        }
    }
</script>

<style>
</style>
