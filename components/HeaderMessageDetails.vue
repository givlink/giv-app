<template>
  <header class="py-1.5 px-1 bg-gray-50 border-b border-gray-100 fixed left-0 right-0 top-0 z-10 flex items-center">
      <button @click="$router.go(-1)" class="py-2 hover:bg-gray-100 px-2 rounded-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <div class="flex-1 mr-4 flex items-center justify-center">
      <span v-if="!!title" class="text-gray-900 text-sm text-center py-1">{{ title }}</span>
      </div>
  </header>
</template>

<script>
export default {
  props: ["title"],
};
</script>
