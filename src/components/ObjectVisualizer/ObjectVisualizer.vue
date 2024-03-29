<script setup>
import Wrapper from "./components/Wrapper.vue";
import "./index.css";

defineProps({
  data: [Object, Array],
  rootName: {
    type: String,
    default: "",
  },
  expandOnCreatedAndUpdated: {
    type: Function,
    default: (path) => false,
  },
  getKeys: {
    type: Function,
    default: (object, path) => Object.keys(object),
  },
});
</script>

<template>
  <section class="object-visualizer">
    <Wrapper
      :data="data"
      :option="data"
      :name="rootName"
      :expand-on-created-and-updated="expandOnCreatedAndUpdated"
      :get-keys="getKeys"
      :path="[]"
      :aria-level="0"
    >
    </Wrapper>
  </section>
</template>
