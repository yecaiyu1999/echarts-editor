<script setup>
import { ref, watch } from "vue";
import ObjectVisualizer from "./ObjectVisualizer/ObjectVisualizer.vue";

const props = defineProps({
  option: {
    type: Object,
    default: {},
  },
});

watch(
  () => props.option,
  (newVal, _) => {
    if (newVal !== "") {
      data.value = newVal;
      key.value = Date.now();
    }
  },
);

const key = ref(Date.now());
const rootName = "";
const data = ref({});

const onExpandOnCreatedAndUpdated = (path) => {
  return 0 === path.length || ("series" === path[0] && path.length <= 1);
};

const onGetKeys = (object, _) => {
  return Object.keys(object).filter((key) => {
    return !(Array.isArray(object[key]) && !object[key].length);
  });
};
</script>

<template>
  <ObjectVisualizer
    :data="data"
    :rootName="rootName"
    :expandOnCreatedAndUpdated="onExpandOnCreatedAndUpdated"
    :getKeys="onGetKeys"
    :key="key"
  />
</template>

<style lang="less">
.object-visualizer {
  border-radius: 4px;
  overflow-x: auto;
  margin: 0;
  padding: 10px;
  font-size: 0.6em;
  line-height: 1.7;

  .array > .value,
  .object > .value {
    display: flex;
    flex-direction: column;
    margin-left: 2em;
  }

  .key {
    color: #111;
  }

  span.i-icon {
    color: #337ab7;
    font-size: 10px;
    speak: none;
    font-style: normal;
    font-weight: 400;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    vertical-align: baseline;
    display: inline-block;
    -webkit-font-smoothing: antialiased;
  }

  a {
    color: #337ab7;
    text-decoration: none;
  }

  a:focus,
  a:hover {
    color: #23527c;
    text-decoration: underline;
  }

  .string > .value {
    color: #50a14f;
  }

  .boolean > .value,
  .number > .value {
    color: #d19a66;
  }

  .null > .value,
  .undefined > .value {
    color: hsl(0, 0%, 40%);
  }

  .separator {
    cursor: pointer;
    font-size: 0.8em;
    color: hsl(0, 0%, 30%);
  }

  .indicator {
    cursor: pointer;
    font-size: 0.8em;
    padding-right: 0.5em;
    user-select: none;
    vertical-align: text-bottom;
    color: hsl(0, 0%, 30%);
  }

  .array > .key,
  .object > .key {
    cursor: pointer;
  }

  .value > .array,
  .value > .object {
    position: relative;
    left: -0.8em;
  }

  .count,
  .preview,
  .quotes {
    cursor: pointer;
    font-size: 0.8em;
    user-select: none;
    color: hsl(0, 0%, 30%);
  }
}
</style>
