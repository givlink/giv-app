<template>
  <div class="bg-white block py-2 px-2 rounded mx-2 mb-2" v-if="requester">
    <div class="flex items-start">
      <div class="pr-3">
        <nuxt-link :to="`/users/${requester.id}`">
          <img
            :src="$utils.parseUrl(requester && requester.photoURL)"
            class="h-20 w-20 rounded-full object-cover"
            alt=""
          />
        </nuxt-link>
      </div>
      <div class="flex-1 h-full flex flex-col pt-2">
        <h3 class="text-sm font-semibold text-gray-700">
          {{ requester && requester.name }}
        </h3>
        <ul class="flex flex-wrap">
          <li
            v-for="skill in requester.skills"
            class="request-skill border rounded-full px-2 mr-1 py-1 leading-none"
          >
            {{ renderTag(skill) }}
          </li>
        </ul>
        <p class="text-xs mt-2">
          <span class="mr-px">{{ requester.name }}</span
          >さん
          <span v-if="item.type === 'send'">
            からギブを贈りたいとリクエストがありました。
          </span>
          <span v-if="item.type === 'receive'">
            からギブを受け取りたいとリクエストがありました。
          </span>
        </p>
        <span class="block text-right flex-1 mt-auto">
          {{ $utils.parseDate(item.createdAt) }}
        </span>
      </div>
    </div>
    <div class="Spinner" v-if="loading">
      <div class="Spinner__box">
        <b-spinner label="Loading..." :variant="'primary'"></b-spinner>
        <p class="Spinner__box__text">送信中</p>
      </div>
    </div>
    <b-modal
      id="modal"
      v-model="showModalError"
      hide-header-close
      no-close-on-backdrop
      centered
      cancel-disabled
      ok-disabled
    >
      <template #modal-header>
        <div class="w-full flex items-center justify-center">
          <img
            class="h-14 w-14 animate-shake"
            src="~/assets/icons/tama_def.png"
            alt="tama"
          />
          <span
            class="mx-2 text-center text-sm leading-none text-red-500 font-bold"
            >エラーが発生しました！</span
          >
          <img
            class="h-14 w-14 animate-shake"
            src="~/assets/icons/piyo_def.png"
            alt="poyo"
          />
        </div>
      </template>
      <template #default>
        <div class="text-center text-sm font-mono text-black">
          {{ error }}
        </div>
      </template>
      <template #modal-footer>
        <div class="w-full flex items-center justify-center">
          <button
            @click="showModalError = false"
            class="font-bold text-sm border-hack px-12 py-3 leading-none rounded-full text-giv-blue hover:bg-giv-blue hover:text-white"
          >
            閉じる
          </button>
        </div>
      </template>
    </b-modal>
    <b-modal
      id="modal"
      v-model="showModal"
      hide-header-close
      no-close-on-backdrop
      centered
      cancel-disabled
      ok-disabled
    >
      <template #modal-header>
        <div class="w-full flex items-center justify-center">
          <img class="h-14 w-14" src="~/assets/icons/tama_def.png" alt="tama" />
          <span
            class="mx-2 text-center text-sm leading-none text-giv-blue font-bold"
            >リクエストを承認しました！</span
          >
          <img class="h-14 w-14" src="~/assets/icons/piyo_def.png" alt="poyo" />
        </div>
      </template>
      <template #default>
        <div class="text-center text-sm font-bold text-black">
          運営事務局にて詳細をやりとりする <br />
          メッセージグループをご用意いたします。 <br />
          少しお待ちください。
        </div>
      </template>
      <template #modal-footer>
        <div class="w-full flex items-center justify-center">
          <button
            @click="showModal = false"
            class="font-bold text-sm border-hack px-12 py-3 leading-none rounded-full text-giv-blue hover:bg-giv-blue hover:text-white"
          >
            閉じる
          </button>
        </div>
      </template>
    </b-modal>
    <div class="w-full mt-2 flex items-center justify-between space-x-3">
      <nuxt-link
        :to="`/users/${requester.id}`"
        class="border-giv-blue border-blue-500 border rounded-full px-4 py-2"
      >
        プロファイルを見る
      </nuxt-link>
      <button
        @click="acceptRequest"
        :disabled="completed"
        class="text-white font-semibold border-blue-500 border rounded-full px-4 py-2"
        :class="completed ? 'bg-gray-300' : 'bg-giv-blue '"
      >
        <span v-if="completed">リクエスト承認済</span>
        <span v-else>リクエスト承認</span>
      </button>
    </div>
  </div>
</template>

<script>
import api from "@/lib/api";
export default {
  props: ["item"],
  computed: {
    requester() {
      if (!this.item) return null;
      if (this.item.type === "receive") return this.item.receiver;
      if (this.item.type === "send") return this.item.sender;
      return null;
    },
    completed() {
      return this.item.status === "match";
    }
  },
  data() {
    return {
      showModal: false,
      showModalError: false,
      loading: false,
      error: null
    };
  },
  methods: {
    async acceptRequest() {
      this.loading = true;
      try {
        await api.acceptGivRequest(this.item.id);
        this.showModal = true;
      } catch (err) {
        this.error = err.message;
        this.showModalError = true;
      }
      this.loading = false;
    },
    renderTag(id) {
      try {
        return this.$store.getters.getSkillTag(id).tag;
      } catch (err) {
        return id;
      }
    }
  }
};
</script>

<style>
.request-skill {
  font-size: 0.85em;
}

.border-hack {
  border: 2px solid #0eb9ec;
}

.modal-header {
  border-bottom: 0 none;
}

.modal-footer {
  border-top: 0 none;
}
</style>
