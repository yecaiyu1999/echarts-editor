<script>
import { defineComponent } from "vue";

export default defineComponent({
  inheritAttrs: false,
});
</script>

<script setup>
import { computed } from "vue";
import { useExpand, cache } from "../hooks";
import Wrapper from "./Wrapper.vue";
import { ViewList } from "@icon-park/vue-next";

const props = defineProps({
  path: Array,
  data: Object,
  option: [Object, Array],
  name: String,
  href: String,
  expandOnCreatedAndUpdated: Function,
  getKeys: Function,
  role: String,
  ariaLevel: Number,
  collapseSignal: {
    type: Boolean,
    default: false,
  },
  expandSignal: {
    type: Boolean,
    default: false,
  },
});

const { isExpanding, innerExpandSignal, innerCollapseSignal, handleClick } =
  useExpand(props);

const keys = computed(() => {
  return props.getKeys(props.data, props.path);
});

const isCircular = cache.has(props.data);
cache.add(props.data);
</script>

<template>
  <span
    class="object"
    :role="role"
    :aria-expanded="isExpanding"
    :aria-level="ariaLevel"
    @click.self="handleClick"
  >
    <span class="indicator" @click="handleClick">{{
      isExpanding ? "\u25BC" : "\u25B6"
    }}</span>
    <span class="key" @click="handleClick">
      {{ name === "" ? "" : name }}
      <a :href="href" target="_blank" title="查看文档"> <ViewList /></a>
    </span>
    <span class="separator" @click="handleClick">
      {{ name === "" ? "" : ": " }}
    </span>
    <span class="preview" @click="handleClick">
      {{ isExpanding ? "" : "{...}" }}
    </span>

    <template v-if="isCircular">
      <span v-if="isExpanding" class="value">
        <template v-for="key of keys" :key="key">
          <Wrapper
            class="value"
            :name="key"
            :path="[...path, key]"
            :data="data[key]"
            :option="option"
            :expand-signal="innerExpandSignal"
            :collapse-signal="innerCollapseSignal"
            :expandOnCreatedAndUpdated="() => false"
            :getKeys="getKeys"
            :aria-level="ariaLevel"
          ></Wrapper>
        </template>
      </span>
    </template>

    <template v-else>
      <span v-show="isExpanding" class="value">
        <template v-for="key of keys" :key="key">
          <Wrapper
            class="value"
            :name="key"
            :path="[...path, key]"
            :data="data[key]"
            :option="option"
            :expand-signal="innerExpandSignal"
            :collapse-signal="innerCollapseSignal"
            :expandOnCreatedAndUpdated="expandOnCreatedAndUpdated"
            :getKeys="getKeys"
            :aria-level="ariaLevel"
          ></Wrapper>
        </template>
      </span>
    </template>
  </span>
</template>
