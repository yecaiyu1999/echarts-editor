<script setup>
import { ref, unref, onMounted, shallowRef, watch } from "vue";
import * as echarts from "echarts";

const emits = defineEmits(["init"]);

const props = defineProps({
  value: {
    type: String,
    default: "",
  },
  isDark: {
    type: Boolean,
    default: false,
  },
});

watch(
  () => props.value,
  (newVal, _) => {
    codeScript.value = newVal;
    runCode();
  },
);

watch(
  () => props.isDark,
  (newVal, _) => {
    theme.value = newVal ? "dark" : "";
    runCode();
  },
);

const ChartModelRef = ref(null);
// 图表实例
const chartInstance = shallowRef(null);
// 图表配置
const chartOption = ref(null);

const codeScript = ref("");

const theme = ref("");

// 初始化echarts
const initCharts = () => {
  // 通知父组件配置发生改变
  emits("init", {
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: "line",
      },
    ],
  });
};

const refreshCode = () => {
  // 用echarts时，如果不存在DOM，就会报错，处理方法先检查是否DOM存在：
  if (ChartModelRef.value == null) {
    return;
  }
  // 用echarts时，如果存在DOM，就会报存在警告，处理方法删除DOM：
  echarts.dispose(ChartModelRef.value);
  try {
    let fun = new Function(
      "echarts",
      "ChartModelRef",
      "chartInstance",
      "chartOption",
      `let chart = echarts.init(ChartModelRef.value,'${theme.value}');
       let option;
       ${codeScript.value}
       option && chart.setOption(option);
       chartInstance.value = chart;
       chartOption.value = chart.getOption();`,
    ).bind(this);
    fun(echarts, ChartModelRef, chartInstance, chartOption);
  } catch (e) {
    console.error(e);
  }
};

const timer = ref(null);
const runCode = () => {
  clearTimeout(timer.value);
  timer.value = setTimeout(refreshCode, 500);
};

const resizeChart = () => {
  if (chartInstance.value) {
    chartInstance.value.resize();
  }
};

const getOption = () => {
  return unref(chartOption);
};

// 截图
const screenShot = () => {
  //将图表替换为图片
  const base = chartInstance.value.getDataURL({
    pixelRatio: 2,
    backgroundColor: "transparent",
  });
  let a = document.createElement("a");
  a.href = base;
  a.download = `图例.jpg`;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
};

// 下载示例（HTML）
const downloadEcharts = async () => {
  let a = document.createElement("a");
  let url = window.URL.createObjectURL(
    new Blob([await getHtml()], {
      type: "",
    }),
  );
  a.href = url;
  a.download = `echarts.html`;
  a.click();
  window.URL.revokeObjectURL(url);
};

const getHtml = async () => {
  return await fetch("/src/assets/template.html")
    .then((response) => response.text())
    .then((content) => content.replace("#option#", codeScript.value));
};

onMounted(() => {
  initCharts();
  // 图例随着窗口变化
  window.addEventListener("resize", () => {
    resizeChart();
  });
});

defineExpose({
  runCode,
  resizeChart,
  getOption,
  screenShot,
  downloadEcharts,
});
</script>

<template>
  <div ref="ChartModelRef" id="chart-model"></div>
</template>

<style scoped>
#chart-model {
  background: white;
  border-radius: 8px;
  width: 100%;
  height: 100%;
}
</style>
