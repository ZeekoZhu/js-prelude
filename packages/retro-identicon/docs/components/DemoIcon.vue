<template>
  <input v-model="src" class="seed-input" type="text" />
  <br />
  <img class="icon-preview" :src="iconSrc" alt="retro-icon" />
</template>
<script setup>
import { ref, watch } from 'vue';
import { retroIdenticon, svgRender } from '../../src';

const src = ref('');

const iconSrc = ref('');

watch(src, () => {
  const svg = svgRender(retroIdenticon(src.value, { sidePixels: 10 }));
  // to base64 url
  iconSrc.value = `data:image/svg+xml;base64,${btoa(svg)}`;
});
</script>
<style scoped>
.icon-preview {
  width: 64px;
  height: 64px;
}

.seed-input {
  border: 1px solid #ccc;
}
</style>
