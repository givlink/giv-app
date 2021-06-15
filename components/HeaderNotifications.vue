<template>
  <header class="pt-2 border-b border fixed left-0 right-0 top-0 bg-white z-10">
    <div class="px-2 flex items-center justify-start">
      <nuxt-link to="/" class="Header__logo"
        ><img class="" width="32" src="~/assets/image/giv_logo.png" alt="giv"
      /></nuxt-link>
    </div>
    <div class="pt-3">
      <nav class="w-full grid grid-cols-2 gap-x-2">
        <nuxt-link
          to="/notification"
          class="flex-1 text-gray-400 text-center py-1 not-link"
          >お知らせ</nuxt-link
        >
        <nuxt-link
          to="/notification/received-requests"
          class="flex-1 text-gray-400 text-center py-1 not-link"
          >受け取ったリクエスト</nuxt-link
        >
      </nav>
    </div>
  </header>
</template>

<style>
.not-link.nuxt-link-exact-active {
  color: #0eb9ec;
  font-weight: bolder;
  border-bottom: 3px solid #0eb9ec;
}
</style>
