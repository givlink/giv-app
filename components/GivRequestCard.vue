<template>
  <div class="bg-white block py-2 px-2 rounded mx-2 mb-2">
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
        <p class="text-xs">
          <span v-if="item.requestType === 'send'">
            wants to send Giv to you
          </span>
          <span v-if="item.requestType === 'receive'">
            wants to receive a Giv from you
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
      loading="true"
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
        class="text-white font-semibold bg-giv-blue border-blue-500 border rounded-full px-4 py-2"
      >
        リクエスト承認
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
      if (this.item.requestType === "receive") return this.item.receiver;
      if (this.item.requestType === "send") return this.item.sender;
      return null;
    }
  },
  data() {
    return {
      showModal: false,
      loading: false
    };
  },
  methods: {
    async acceptRequest() {
      const requestId = this.item.id;
      //@Todo this is not id, but we should use givRequest id instead
      this.loading = true;
      await api.acceptGivRequest(requestId);
      this.loading = false;
      this.showModal = true;
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
