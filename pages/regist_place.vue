<template>
  <div class="Regist Main">
    <div class="Regist__flow">
      <div class="Regist__flow__position">
        <img class="Regist__flow__position__img" src="~/assets/image/regist_flow_03.png" alt="giv">
      </div>
      <div class="Regist__flow__text">
        <p class="Regist__flow__text__box">プロフィール<br>確認</p>
        <p class="Regist__flow__text__box">giv登録</p>
        <p class="Regist__flow__text__box">場所登録</p>
        <p class="Regist__flow__text__box">興味登録</p>
      </div>
    </div>
    <div class="Regist__main">
      <div class="Regist__main__select">
        <h3 class="Regist__main__select__text">
          提供場所を選択してください
        </h3>
        <ul class="Regist__main__select__box">
          <li class="Regist__main__select__box__li"  v-for="item in places">
            <p class="Regist__main__select__box__li__text">
              {{item.tag}}
            </p>
            <div class="Regist__main__select__box__li__btn">
              <b-form-radio
                v-model="selected"
                :key="`place_${item.id}`"
                :value="item.id"
                name="giv"
                :id="`place_${item.id}`"
                class="Regist__main__select__box__li__btn__check"
              >
                <span class="Regist__main__select__box__li__btn__text">選択</span>
              </b-form-radio>
            </div>
          </li>
        </ul>
      </div>
      <div class="Regist__main__bottom">
        <button v-on:click="next" class="Invite__btn__link">次へ</button>
      </div>
      <p class="Regist__main__error">{{this.error_message}}</p>
    </div>
  </div>
</template>

<script>

    import axios from 'axios'
    export default {
        data() {
            return {
                places: [],
                selected: [],
            }
        },
        async asyncData({ app }) {
            const baseUrl = process.env.baseUrl + '/area_tags';
            const getUrl = encodeURI(baseUrl);
            const response = await axios.get(getUrl, {
            });
            return {
                places: response.data.area_tags
            }
        },
        methods: {
            next() {
                this.error_message = '';
                if(this.selected.length < 1) {
                    this.error_message = '提供場所を一つ選択してください。';
                } else {
                    this.$store.commit("setPlaces", [this.selected]);
                    this.$router.push('/regist_interest');
                }
            }
        },
    }
</script>

<style>
</style>
