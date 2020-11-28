<template>
  <div class="Detail Main">
    <div class="Detail__box">
      <div class="Detail__box__header">
        <nuxt-link :to="`/users/${thanks.giv.receive_user.id}`" class="Detail__box__header__user">
          <div class="Detail__box__header__user__icon">
            <b-img :src="`${basePath}${thanks.giv.receive_user.profile_image_path}`" class="Detail__box__header__user__icon__img" alt></b-img>
          </div>

          <div class="Detail__box__header__user__text">
            <p class="Detail__box__header__user__text__name">{{thanks.giv.receive_user.last_name}} {{thanks.giv.receive_user.first_name}}</p>
          </div>
        </nuxt-link>
        <span class="Detail__box__header__tag">
          {{thanks.giv.kind}}
        </span>
      </div>
      <slick ref="slick" :options="slickOptions" class="Detail__box__images" v-if="thanks.images">
        <template v-for="item of thanks.images">
          <div>
            <b-img :src="`${basePath}${item.path}`" class="Detail__box__images__img" alt></b-img>
          </div>
        </template>
      </slick>
      <div class="Detail__box__info">
        <template v-if="isLike || thanks.liked">

          <p class="Detail__box__info__good">
            <span class="Detail__box__info__good__heart on">♥</span>
            <span class="Detail__box__info__good__text">いいね済</span>
            <span class="Detail__box__info__good__text ml-2" v-if="isMe">{{thanks.like_count}}件</span>
          </p>
        </template>
        <template v-else>

          <p class="Detail__box__info__good" v-on:click="sendLike">
            <span class="Detail__box__info__good__heart">♡</span>
            <span class="Detail__box__info__good__text">いいね</span>
            <span class="Detail__box__info__good__text ml-2" v-if="isMe">{{thanks.like_count}}件</span>
          </p>
        </template>
        <p class="Detail__box__info__time">{{ thanks.created_at | moment }}</p>
      </div>
      <div class="Detail__box__content">
        <h2 class="Detail__box__content__title">
          {{ thanks.title }}
        </h2>
        <p class="Detail__box__content__text">{{thanks.message }}
        </p>
      </div>
      <div class="Detail__box__thanks">
        <nuxt-link :to="`/users/${thanks.giv.giv_user.id}`" class="Home__card__content__person">
          <!--          <nuxt-link :to="`/user/${item.giv.giv_user.id}`" class="Home__card__content__person">-->
          <div class="Home__card__content__person__icon">
            <b-img :src="`${basePath}${thanks.giv.giv_user.profile_image_path}`" class="Home__card__content__person__icon__img" alt></b-img>
          </div>
          <div class="Home__card__content__person__text">
            <p class="Home__card__content__person__text__head">givを贈った人</p>
            <p class="Home__card__content__person__text__name">{{thanks.giv.giv_user.last_name}} {{thanks.giv.giv_user.first_name}}</p>
            <!--              <p class="Home__card__content__person__text__position">CO-FOUNDER & CCO</p>-->
          </div>
        </nuxt-link>
      </div>
    </div>
    <template v-if="isMe">
      <nuxt-link :to="`/thanks/${thanks.id}/edit`" class="User__profile__edit">
        <b-img src="~/assets/image/icon_edit.png" class="User__profile__edit__img" alt></b-img>
      </nuxt-link>
    </template>
    <div class="Comment">
      <p class="Comment__title">コメント</p>
      <template v-for="item of comments">
        <div class="Comment__box" v-if="!item.is_delete">
          <div class="Comment__box__delete" v-on:click="deleteComments(item.uuid)" v-if="myId == item.user.id">削除</div>
          <p class="Comment__box__name">
            <nuxt-link :to="`/users/${item.user.id}`">
            <b-img :src="`${basePath}${item.user.profile_image_path}`" class="Detail__box__header__user__icon__img" alt></b-img>
            </nuxt-link>
            {{item.user.last_name}} {{item.user.first_name}} 投稿日:{{ item.updated_at | moment }}</p>
          <p class="Comment__box__text">{{item.message}}</p>
        </div>
      </template>
      <div class="Comment__send">
        <b-form-textarea
          id="message"
          v-model="message"
          placeholder="コメントを入力"
          rows="3"
          class="Comment__send__textarea"
          max-rows="6"
        ></b-form-textarea>
        <div v-on:click="sendComments()" class="Comment__send__btn">送信</div>
      </div>
    </div>
    <div class="Back">
      <nuxt-link to="/" class="Back__btn">
        一覧へ戻る
      </nuxt-link>
    </div>
  </div>
</template>

<script>

  import axios from "axios";
  const Cookie = process.client ? require('js-cookie') : undefined;
  import Slick from 'vue-slick' // Slick読み込み
  import '../../../node_modules/slick-carousel/slick/slick.css' // Slickのcss読み込み
  import '../../../node_modules/slick-carousel/slick/slick-theme.css' // Slickのcss読み込み

  import moment from 'moment';

  export default {
    components: {
      Slick
    },
    middleware: 'auth',
    layout:'logined',
    data() {
      return {
        message: '',
        slickOptions: {
          arrows: false,
          dots: true,
          adaptiveHeight: true
        },
        code: '',
        hasError: '',
        isLike: '',
        id: '',
      }
    },
    mounted() {
    },

    filters: {
      moment: function (date) {
        return moment(date).format('YYYY.MM.DD');
      },
    },
    async asyncData({ app, params }) {
      if(params.id) {
        const baseUrl = process.env.baseUrl + '/thanks_cards/' + params.id;
        const getUrl = encodeURI(baseUrl);
        const token = app.$auth.$storage.getUniversal("_token.auth0");
        const response = await axios.get(getUrl, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token
          }
        });
        const commentUrl = process.env.baseUrl + '/thanks_cards/' + params.id + '/comments';
        const response2 = await axios.get(encodeURI(commentUrl), {
        });
        console.log(response2);
        console.log(response2.data.comments);
        return {
          thanks: response.data,
          isLike: response.data.liked,
          comments: response2.data.comments,
          id: params.id,
          myId: app.store.state.me.id,
          isMe: app.store.state.me && response.data.user == app.store.state.me.id
        }
      }
    },

    computed: {
      basePath () {
        return `${process.env.baseUrl}`;
      },
    },
    methods: {
      async sendComments() {
        if(this.message == '') {
          alert('コメントが何も記入されていません。')
          return;
        }
        const baseUrl = process.env.baseUrl + '/thanks_cards/' + this.id + '/comments';
        const getUrl = encodeURI(baseUrl);
        const response = await axios.post(getUrl, {
          'message': this.message
        },{
        });
        console.log(response);
        if(response.status === 201) {
          alert("コメントを送信しました");
          this.message = '';
          const commentUrl = process.env.baseUrl + '/thanks_cards/' + this.id + '/comments';
          const response2 = await axios.get(encodeURI(commentUrl), {
          });
          this.comments = response2.data.comments;
        }
      },
      async deleteComments(uuid) {
        var confirm = window.confirm("本当に削除しますか？");
        if(confirm) {
          const baseUrl = process.env.baseUrl + '/thanks_cards/' + this.id + '/comments/'+ uuid;
          const getUrl = encodeURI(baseUrl);
          const response = await axios.delete(getUrl, {
          });
          if(response.status === 200) {
            alert("コメントを削除しました");
            const commentUrl = process.env.baseUrl + '/thanks_cards/' + this.id + '/comments';
            const response2 = await axios.get(encodeURI(commentUrl), {
            });
            this.comments = response2.data.comments;
          }
        }
      },
      async sendLike() {
        this.isLike = true;
        const baseUrl = process.env.baseUrl + '/thanks_cards/' + this.id + '/like';
        const getUrl = encodeURI(baseUrl);

        const token = this.$auth.$storage.getUniversal("_token.auth0");
        const response = await axios.put(getUrl, {},{
          headers: {
            "Content-Type": "application/json",
            Authorization: token
          }
        });
        // if(response.status === 200) {
        //   this.isLike = true;
        // }
      },
      // async deleteLike() {
      //     const baseUrl = process.env.baseUrl + '/thanks_cards/' + this.id + '/like';
      //     const getUrl = encodeURI(baseUrl);
      //     const token = this.$auth.$storage.getUniversal("_token.auth0");
      //     const response = await axios.delete(getUrl, {
      //         headers: {
      //             "Content-Type": "application/json",
      //             Authorization: token
      //         }
      //     });
      //     if(response.status === 200) {
      //         this.isLike = false;
      //     }
      // },
      logout() {
        this.$auth.logout();
      }
    }
  }
</script>

<style>
</style>
