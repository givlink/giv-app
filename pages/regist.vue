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
          <img class="Regist__main__profile__icon__img" src="~/assets/image/sample_profile_icon.png" alt="giv">
        </div>
        <p class="Regist__main__profile__name">山田 太郎</p>
        <p class="Regist__main__profile__position">KDS</p>
      </div>
      <div class="Regist__main__bottom">
        <nuxt-link to="/regist_giv" class="Invite__btn__link">次へ</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
    import Logo from '~/components/Logo.vue'

    export default {
    }
</script>

<style>
</style>
