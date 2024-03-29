<script setup>
import { ref, watch } from "vue";
import CodeMirror from "vue-codemirror6";
import { javascript, esLint } from "@codemirror/lang-javascript";
// import { oneDark } from "@codemirror/theme-one-dark";
import { autocompletion } from "@codemirror/autocomplete";
import tips from "../assets/tips.json";
import * as eslint from "eslint-linter-browserify";

const emits = defineEmits(["change"]);

const props = defineProps({
  value: {
    type: String,
    default: "",
  },
  readonly: {
    type: Boolean,
    default: false,
  },
});

watch(
  () => props.value,
  (newVal, _) => {
    codeVal.value = newVal;
  },
);

// 代码内容
const codeVal = ref("");
// 支持语言
const lang = javascript();
// 扩展
const extensions = [autocompletion({ override: [myCompletions] })];
// 代码检查
const linter = esLint(new eslint.Linter(), {
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: "module",
  },
  env: {
    browser: true,
    node: true,
  },
  rules: {
    semi: ["error", "never"],
  },
});
// 代码提示
const completions = tips;

function myCompletions(context) {
  let before = context.matchBefore(/\w+/);
  // If completion wasn't explicitly started and there
  // is no word before the cursor, don't open completions.
  if (!context.explicit && !before) return null;
  return {
    from: before ? before.from : context.pos,
    options: completions,
    validFor: /^\w*$/,
  };
}

const onEditorChange = (state) => {
  emits("change", state.doc.toString());
};
</script>

<template>
  <CodeMirror
    id="code-editor"
    v-model="codeVal"
    basic
    tab
    wrap
    allow-multiple-selections
    :lang="lang"
    :linter="linter"
    :extensions="extensions"
    :readonly="readonly"
    @change="onEditorChange"
  ></CodeMirror>
</template>

<style scoped>
#code-editor {
  height: 100%;
  width: 100%;
}

/* required! */
:deep(.cm-editor) {
  height: 100% !important;
}

:deep(.cm-focused) {
  outline: none !important;
}
</style>
