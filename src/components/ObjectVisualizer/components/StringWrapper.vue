<script>
import { defineComponent } from "vue";

export default defineComponent({
  inheritAttrs: false,
  props: {
    data: String,
    href: String,
    name: String,
    role: {
      type: String,
      default: "",
    },
    ariaLevel: {
      type: Number,
      default: 0,
    },
  },
});
</script>

<template>
  <span class="string" :role="role" :aria-level="ariaLevel">
    <span class="key">
      <a :href="href" target="_blank" title="查看文档">{{ name }}</a>
    </span>
    <span v-if="name !== ''" class="separator">:&nbsp;</span>
    <span class="quotes">"</span>
    <span class="value">{{ JSON.stringify(data).slice(1, -1) }}</span>
    <span class="quotes">"</span>
  </span>
</template>
