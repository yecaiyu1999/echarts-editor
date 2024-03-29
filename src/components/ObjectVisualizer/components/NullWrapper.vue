<script>
import { defineComponent } from "vue";

export default defineComponent({
  inheritAttrs: false,
});
</script>

<script setup>
defineProps({
  data: null,
  name: String,
  href: String,
  role: { type: String, default: "" },
  ariaLevel: { type: Number, default: 0 },
});
</script>

<template>
  <span class="null" :role="role" :aria-level="ariaLevel">
    <span class="key">
      <a :href="href" target="_blank" title="查看文档">{{ name }}</a>
    </span>
    <span v-if="name !== ''" class="separator">:&nbsp;</span>
    <span class="value">null</span>
  </span>
</template>
