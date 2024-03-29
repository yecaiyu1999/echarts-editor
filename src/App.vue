<script setup>
import { ref, unref, onMounted, onUnmounted } from "vue";
import CodeEditor from "./components/CodeEditor.vue";
import CodeEditorOperation from "./components/CodeEditorOperation.vue";
import ChartModel from "./components/ChartModel.vue";
import { throttle } from "lodash-es";
import ChartOption from "./components/ChartOption.vue";
import { Download, Screenshot } from "@icon-park/vue-next";

const CodeEditorOperationRef = ref(null);
const ChartModelRef = ref(null);
const codeVal = ref("");
const fullCodeValue = ref("");
const containerWidth = ref("40%");
const chartOption = ref({});
const isDark = ref(false);
const onTabClick = (context, _) => {
  // 当点击配置项时
  if (context.index === "1") {
    setFullCodeValue();
  } else if (context.index === "2") {
    chartOption.value = ChartModelRef.value.getOption();
  }
};

const onCodeEditorChange = (val) => {
  codeVal.value = val;
};

const onChartModelInit = (val) => {
  codeVal.value = `option = ${JSON.stringify(val, null, 2)}`;
  // 格式化下代码
  onFromat();
};

const setFullCodeValue = () => {
  fullCodeValue.value = `import * as echarts from 'echarts'

var chartDom = document.getElementById('main')
var myChart = echarts.init(chartDom)
var option

${codeVal.value}
option && chart.setOption(option)
`;
};

// 复制代码
const onCopy = () => {
  if (CodeEditorOperationRef.value) {
    CodeEditorOperationRef.value.copyCode(codeVal.value);
  }
};

// 格式化代码
const onFromat = async () => {
  if (CodeEditorOperationRef.value) {
    codeVal.value = await CodeEditorOperationRef.value.prettierCode(
      unref(codeVal),
    );
  }
};

// 全屏代码编辑器
const onFullEditor = () => {
  if (CodeEditorOperationRef.value) {
    CodeEditorOperationRef.value.fullScreenCodeEditor(
      "div.code-editor-container",
    );
  }
};

// 运行代码
const onRun = () => {
  if (ChartModelRef.value) {
    ChartModelRef.value.runCode();
  }
};

// 截图
const onScreenShot = () => {
  if (ChartModelRef.value) {
    ChartModelRef.value.screenShot();
  }
};

// 下载示例
const onDownloadEcharts = () => {
  if (ChartModelRef.value) {
    ChartModelRef.value.downloadEcharts();
  }
};

//计算宽度
const calcWidth = (width, maxWidth) => {
  let curWidth = ((width / maxWidth) * 100).toFixed(2);
  curWidth = curWidth > 80 ? 80 : curWidth < 20 ? 20 : curWidth;
  return `${curWidth}%`;
};

// 鼠标按下事件
const onMouseDown = (event) => {
  document.addEventListener("mousemove", onMouseMove);
  containerWidth.value = calcWidth(event.screenX, window.innerWidth);
  resizeChart();
};

// 鼠标移动事件，将鼠标指针相对于屏幕的 X 轴坐标赋值给需要动态变化的元素宽度
const onMouseMove = (event) => {
  containerWidth.value = calcWidth(event.screenX, window.innerWidth);
  resizeChart();
};

// 鼠标释放事件
const onMouseUp = () => {
  document.removeEventListener("mousemove", onMouseMove);
  resizeChart();
};

const resizeChart = () => {
  if (ChartModelRef.value) {
    ChartModelRef.value.resizeChart();
  }
};

// 鼠标释放节流事件
const handleMoveThrottled = throttle(onMouseUp, 300);

// onMounted时添加鼠标移动事件监听器
onMounted(() => {
  document.addEventListener("mouseup", handleMoveThrottled);
});

// 组件卸载时移除监听
onUnmounted(() => {
  document.removeEventListener("mouseup", handleMoveThrottled);
});
</script>

<template>
  <div class="container">
    <el-tabs
      @tab-click="onTabClick"
      type="border-card"
      class="tabs-container"
      :style="{ width: containerWidth }"
    >
      <el-tab-pane label="代码编辑" class="tabs-pane editor-tab-container">
        <!-- 代码编辑器操作 -->
        <div class="code-editor-operation-container">
          <CodeEditorOperation
            ref="CodeEditorOperationRef"
            :copy="onCopy"
            :format="onFromat"
            :full-editor="onFullEditor"
            :run="onRun"
          />
        </div>
        <div class="code-editor-container">
          <!-- 代码编辑器 -->
          <CodeEditor
            ref="CodeEditorRef"
            :value="codeVal"
            @change="onCodeEditorChange"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="完整代码" class="tabs-pane">
        <div class="code-editor-container" style="height: 100%">
          <!-- 代码编辑器 -->
          <CodeEditor ref="CodeEditorRef" :value="fullCodeValue" readonly />
        </div>
      </el-tab-pane>
      <el-tab-pane label="配置项" class="tabs-pane">
        <!-- echarts配置项 -->
        <ChartOption class="chart-option-config" :option="chartOption" />
      </el-tab-pane>
    </el-tabs>
    <!-- 给可拖动元素添加鼠标按下事件 -->
    <div
      class="resize"
      :style="{ left: containerWidth }"
      @mousedown="onMouseDown"
    ></div>
    <!-- echarts图表实例-->
    <div
      class="chart-container"
      :style="{ width: 'calc( 100% - ' + containerWidth + ')' }"
    >
      <div class="chart-inner-container">
        <div class="chart-operation">
          <el-switch v-model="isDark" active-text="深色模式" inactive-text="" />
          <div style="margin-left: 15px">
            <el-button
              @click="onDownloadEcharts"
              :icon="Download"
              title="下载示例(HTML)"
            >
              下载示例
            </el-button>
            <el-button @click="onScreenShot" :icon="Screenshot">截图</el-button>
          </div>
        </div>
        <ChartModel
          ref="ChartModelRef"
          :value="codeVal"
          @init="onChartModelInit"
          :is-dark="isDark"
          style="height: calc(100% - 42px)"
        />
      </div>
    </div>
  </div>
</template>

<style>
* {
  padding: 0;
  margin: 0;
}

.container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.tabs-container {
  height: 100%;
  border: none;
  border-right: 1px solid #eceef1;
  position: absolute;
  left: 0;
  bottom: 0;
  top: 0;
  width: 40%;
}

.tabs-pane {
  width: 100%;
  height: 100%;
}

.code-editor-container {
  height: calc(100% - 33px);
  width: 100%;
  background-color: #ffffff;
}

.code-editor-operation-container {
  height: 32px;
  display: flex;
  justify-content: end;
  border-bottom: 1px solid #eee;
}

.chart-option-config {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  font-size: 13px;
  font-family: "Source Code Pro", "Monaco", "Menlo", "Ubuntu Mono", "Consolas",
    monospace;
}

.chart-container {
  position: absolute;
  right: 0;
  width: 60%;
  height: 100%;
  border: none;
  z-index: 30;
  background: #f3f4fa;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.chart-inner-container {
  padding: 15px;
  height: 100%;
  width: calc(100% - 30px);
  box-sizing: border-box;
}

.chart-operation {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  width: 100%;
}

.resize {
  position: absolute;
  left: 40%;
  top: 0;
  bottom: 0;
  width: 15px;
  cursor: col-resize;
  z-index: 100;
  background-color: transparent;
}

.el-tabs__content {
  height: calc(100% - 40px) !important;
  padding: 0 !important;
}

::-webkit-scrollbar {
  height: 8px;
  width: 8px;
  -webkit-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
  border-radius: 2px;
}

::-webkit-scrollbar-button {
  display: none;
}

::-webkit-scrollbar-thumb {
  width: 8px;
  min-height: 15px;
  background: rgba(50, 50, 50, 0.3) !important;
  -webkit-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.5) !important;
}
</style>
