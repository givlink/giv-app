<template>
  <div class="Detail Main">
    <div class="Detail__box">
      <div class="Detail__box__header">
        <nuxt-link
          :to="`/users/${post.authorId}`"
          class="Detail__box__header__user"
        >
          <div class="Detail__box__header__user__icon">
            <b-img
              :src="getUrl(post.author.photoURL)"
              class="Detail__box__header__user__icon__img"
              alt
            ></b-img>
          </div>

          <div class="Detail__box__header__user__text">
            <p class="Detail__box__header__user__text__name">
              {{ post.author.name }}
            </p>
          </div>
        </nuxt-link>
        <span class="Detail__box__header__tag">
          {{ giv.kind }}
        </span>
      </div>
      <slick
        ref="slick"
        :options="slickOptions"
        class="Detail__box__images"
        v-if="post.images"
      >
        <template v-for="item of post.images">
          <div>
            <b-img
              :src="getUrl(item)"
              class="Detail__box__images__img"
              alt
            ></b-img>
          </div>
        </template>
      </slick>
      <div class="Detail__box__info">
        <template v-if="isLike">
          <p class="Detail__box__info__good" v-on:click="deleteLike">
            <span class="Detail__box__info__good__heart on">♥</span>
            <span class="Detail__box__info__good__text">いいね済</span>
            <span class="Detail__box__info__good__text ml-2" v-if="isMe"
              >{{ post.like_count }}件</span
            >
          </p>
        </template>
        <template v-else>
          <p class="Detail__box__info__good" v-on:click="sendLike">
            <span class="Detail__box__info__good__heart">♡</span>
            <span class="Detail__box__info__good__text">いいね</span>
            <span class="Detail__box__info__good__text ml-2" v-if="isMe"
              >{{ post.like_count }}件</span
            >
          </p>
        </template>
        <p class="Detail__box__info__time">{{ post.createdAt | moment }}</p>
      </div>
      <div class="Detail__box__content">
        <h2 class="Detail__box__content__title">
          {{ post.title }}
        </h2>
        <p class="Detail__box__content__text">{{ post.message }}</p>
      </div>
      <div class="Detail__box__thanks">
        <nuxt-link
          :to="`/users/${post.giver.id}`"
          class="Home__card__content__person"
        >
          <!--          <nuxt-link :to="`/user/${item.giv.giv_user.id}`" class="Home__card__content__person">-->
          <div class="Home__card__content__person__icon">
            <b-img
              :src="getUrl(post.giver.photoURL)"
              class="Home__card__content__person__icon__img"
              alt
            ></b-img>
          </div>
          <div class="Home__card__content__person__text">
            <p class="Home__card__content__person__text__head">givを贈った人</p>
            <p class="Home__card__content__person__text__name">
              {{ post.giver.name }}
            </p>
            <!--              <p class="Home__card__content__person__text__position">CO-FOUNDER & CCO</p>-->
          </div>
        </nuxt-link>
      </div>
    </div>
    <template v-if="isMe">
      <nuxt-link :to="`/posts/${post.id}/edit`" class="User__profile__edit">
        <b-img
          src="~/assets/image/icon_edit.png"
          class="User__profile__edit__img"
          alt
        ></b-img>
      </nuxt-link>
    </template>
    <div class="Comment">
      <p class="Comment__title">コメント</p>
      <template v-for="item of comments">
        <div class="Comment__box" v-if="!item.deleted">
          <div
            class="Comment__box__delete"
            v-on:click="deleteComments(item.id)"
            v-if="myId == item.authorId"
          >
            削除
          </div>
          <p class="Comment__box__name">
            <nuxt-link :to="`/users/${item.authorId}`">
              <b-img
                :src="getUrl(item.author && item.author.photoURL)"
                class="Detail__box__header__user__icon__img"
                alt
              ></b-img>
            </nuxt-link>
            {{ item.authorName }} 投稿日:{{ item.updatedAt | moment }}
          </p>
          <p class="Comment__box__text">{{ item.message }}</p>
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
const Cookie = process.client ? require("js-cookie") : undefined;
import Slick from "vue-slick"; // Slick読み込み
import "../../../node_modules/slick-carousel/slick/slick.css"; // Slickのcss読み込み
import "../../../node_modules/slick-carousel/slick/slick-theme.css"; // Slickのcss読み込み

import moment from "moment";
import firebase from "../../../lib/firebase";

const checkLiked = async ({ postId, userId }) => {
  if (!postId) {
    console.log("No postId in checklike");
    return;
  }
  if (!userId) {
    console.log("No userId in checklike");
    return;
  }
  const resp = await firebase
    .firestore()
    .doc(`/users/${userId}/likes/${postId}`)
    .get();
  return resp.exists;
};
const likePost = async ({ postId, userId }) => {
  if (!postId) {
    console.log("No postId in like");
    return;
  }
  if (!userId) {
    console.log("No userId in like");
    return;
  }

  //@Todo need a function to aggregate likes on a post
  //When this happens
  await firebase
    .firestore()
    .doc(`/users/${userId}/likes/${postId}`)
    .set({ liked: true });
};
const unlikePost = async ({ postId, userId }) => {
  if (!postId) {
    console.log("No postId in unlike");
    return;
  }
  if (!userId) {
    console.log("No userId in unlike");
    return;
  }

  //@Todo need a function to aggregate likes on a post
  //When this happens
  await firebase
    .firestore()
    .doc(`/users/${userId}/likes/${postId}`)
    .delete();
};

const getCurrentUser = async () => {
  const user = firebase.auth().currentUser;
  if (!user) return null;
  const doc = await firebase
    .firestore()
    .doc(`/users/${user.uid}`)
    .get();
  const profile = { ...doc.data(), id: doc.id };
  return profile;
};

const deleteComment = async ({ id = null }) => {
  if (!id) {
    console.log("No id in delete comment");
    return;
  }
  await firebase
    .firestore()
    .doc(`/comments/${id}`)
    .delete();
};
const postComment = async ({ message = "", author = null, postId = null }) => {
  if (!author) {
    console.log("No author");
    return null;
  }
  if (!postId) {
    console.log("No postid");
    return null;
  }

  const payload = {
    author: {
      id: author.id,
      name: author.name,
      photoURL: author.photoURL
    },
    authorId: author.id,
    createdAt: new Date(),
    updatedAt: new Date(),
    message,
    parentCommentId: null,
    postId
  };

  console.log("Creating payload:", payload);
  const response = await firebase
    .firestore()
    .collection(`/comments`)
    .add(payload);

  console.log(response);
  console.log(response.id);
};

export default {
  components: {
    Slick
  },
  /* middleware: 'auth', */
  layout: "logined",
  data() {
    return {
      message: "",
      slickOptions: {
        arrows: false,
        dots: true,
        adaptiveHeight: true
      },
      code: "",
      hasError: "",
      isLike: false,
      id: ""
    };
  },
  mounted() {},

  filters: {
    moment: function(date) {
      let str = moment.unix(date / 1000).format("YYYY.MM.DD");
      if (str === "Invalid date") {
        str = moment(date)
          .utc()
          .format("YYYY.MM.DD");
      }
      return str;
    }
  },
  async asyncData({ app, params }) {
    if (params.id) {
      const currentUser = await getCurrentUser();
      const doc = await firebase
        .firestore()
        .doc(`posts/${params.id}`)
        .get();
      const post = { ...doc.data(), id: doc.id };
      const givDoc = await firebase
        .firestore()
        .doc(`givs/${post.givId}`)
        .get();
      const commentsSnap = await firebase
        .firestore()
        .collection("comments")
        .where("postId", "==", params.id)
        .limit(10)
        .get();
      const comments = [];
      commentsSnap.forEach(d => comments.push({ ...d.data(), id: d.id }));

      const hasLiked = await checkLiked({
        postId: params.id,
        userId: currentUser && currentUser.id
      });

      return {
        post,
        giv: { ...givDoc.data(), id: givDoc.id },
        isLike: hasLiked,
        comments,
        id: params.id,
        isMe: false, //@Todo no support for edit post atm
        myId: currentUser && currentUser.id,
        currentUser
        /* myId: app.store.state.me.id, */
        /* isMe: app.store.state.me && response.data.user == app.store.state.me.id */
      };
    }
  },

  methods: {
    getUrl: path => {
      return `https://storage.googleapis.com/giv-link.appspot.com/${path}`;
    },
    async sendComments() {
      if (this.message == "") {
        alert("コメントが何も記入されていません。");
        return;
      }
      if (!this.currentUser) {
        this.currentUser = await getCurrentUser();
      }

      await postComment({
        message: this.message,
        author: this.currentUser,
        postId: this.id
      });

      //@Todo feedback user for success/failure
    },
    async deleteComments(id) {
      var confirm = window.confirm("本当に削除しますか？");
      if (confirm) {
        await deleteComment({ id });
        alert("コメントを削除しました");

        this.comments = this.comments.filter(c => c.id !== id);
      }
    },
    async sendLike() {
      this.isLike = true;

      if (!this.currentUser) {
        this.currentUser = await getCurrentUser();
      }
      await likePost({ postId: this.id, userId: this.currentUser.id });
    },
    async deleteLike() {
      this.isLike = false;

      if (!this.currentUser) {
        this.currentUser = await getCurrentUser();
      }
      await unlikePost({ postId: this.id, userId: this.currentUser.id });
    }
  }
};
</script>

<style></style>
