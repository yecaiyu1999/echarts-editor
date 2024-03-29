<script setup>
import prettier from "prettier/standalone";
import parserBabel from "prettier/plugins/babel";
import parserEstree from "prettier/plugins/estree";
import Clipboard from "clipboard";
import screenfull from "screenfull";
import { Code, Copy, FullScreen, Play } from "@icon-park/vue-next";

defineProps({
  copy: {
    type: Function,
    default: () => {},
  },
  format: {
    type: Function,
    default: () => {},
  },
  fullEditor: {
    type: Function,
    default: () => {},
  },
  run: {
    type: Function,
    default: () => {},
  },
});

// 格式化代码
const prettierCode = async (code) => {
  try {
    return await prettier.format(code, {
      semi: false,
      singleQuote: true,
      trailingComma: "none",
      quoteProps: "as-needed",
      parser: "babel",
      plugins: [parserBabel, parserEstree],
    });
  } catch (e) {
    ElMessage.error("格式化失败，请检查代码是否有误~");
    return code;
  }
};

// 复制代码
const copyCode = (code) => {
  let clipboard = new Clipboard("#copy-btn", {
    text(e) {
      return code;
    },
  });
  clipboard.on("success", (e) => {
    ElMessage.success("复制成功~");
    // 释放内存
    clipboard.destroy();
  });
  clipboard.on("error", (e) => {
    // 不支持复制
    ElMessage.error("该浏览器不支持自动复制~");
    // 释放内存
    clipboard.destroy();
  });
};

// 全屏代码编辑器
const fullScreenCodeEditor = (selector) => {
  const ele = document.querySelector(selector);
  if (screenfull.isEnabled) {
    screenfull.request(ele);
  }
};

defineExpose({ prettierCode, copyCode, fullScreenCodeEditor });
</script>

<template>
  <el-button @click="copy" :icon="Copy" link id="copy-btn">复制</el-button>
  <el-button @click="format" :icon="Code" link id="format-btn">
    格式化
  </el-button>
  <el-button @click="fullEditor" :icon="FullScreen" link id="full-btn">
    全屏
  </el-button>
  <el-button @click="run" :icon="Play" type="primary" id="run-btn"
    >运行
  </el-button>
</template>

<style scoped>
#copy-btn,
#format-btn,
#full-btn,
#run-btn {
  border-radius: 0;
}

.el-button.is-link:hover {
  color: #409eff !important;
}
</style>
