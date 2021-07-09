<template>
  <div class="w-full h-full flex flex-col items-center justify-center">
    <img
      class="h-12 w-12 animate-wobble"
      src="~/assets/icons/tama_def_sleepy.png"
      alt="tama"
    />
    <span
      class="mx-2 mt-3 text-center text-sm leading-none text-gray-500 font-medium"
    >
      {{ msg }}
    </span>
  </div>
</template>

<script>
export default {
  props: ["msg"]
};
</script>
