<script>
import { computed, defineComponent } from "vue";
import { objectToString } from "../util";
import ObjectWrapper from "./ObjectWrapper.vue";
import ArrayWrapper from "./ArrayWrapper.vue";
import StringWrapper from "./StringWrapper.vue";
import NumberWrapper from "./NumberWrapper.vue";
import NullWrapper from "./NullWrapper.vue";
import FalseWrapper from "./FalseWrapper.vue";
import TrueWrapper from "./TrueWrapper.vue";

const Wrapper = defineComponent({
  inheritAttrs: false,
  props: {
    path: {
      required: true,
      type: Array,
    },
    data: {
      required: true,
    },
    option: {
      required: true,
    },
    name: {
      required: true,
      type: String,
    },
    collapseSignal: {
      default: false,
      type: Boolean,
    },
    expandSignal: {
      default: false,
      type: Boolean,
    },
    expandOnCreatedAndUpdated: {
      required: true,
      type: Function,
    },
    getKeys: {
      required: true,
      type: Function,
    },

    ariaLevel: {
      required: true,
      type: Number,
    },
  },
  setup(props) {
    let e = props.option;
    let i = props.name;
    let r = props.path;
    let o = [];
    let a = e;
    for (let s = 0; s < r.length; s++) {
      // r[s] 从当前path中获取第几个元素
      let l = r[s];
      // a = a[l] 从配置项里，根据key获取对应值
      if (null == (a = a[l])) {
        o.push(l);
      }
      if (Array.isArray(a)) {
        let c = a[r[s + 1]],
          u = c && c.type;
        u && ((l += "-" + u), s++, (a = c));
      } else if (!isNaN(l)) {
        continue;
      }
      o.push(l);
    }
    let href = o.includes("bmap")
      ? "https://github.com/apache/echarts/blob/release/extension-src/bmap/README.md"
      : "https://echarts.apache.org/zh/option.html#".concat(o.join("."));

    const type = computed(() => objectToString(props.data));
    const is = computed(() => {
      switch (type.value) {
        case "Null":
          return "null-wrapper";
        case "Boolean":
          return props.data ? "true-wrapper" : "false-wrapper";
        case "Number":
          return "number-wrapper";
        case "String":
          return "string-wrapper";
        case "Array":
          return "array-wrapper";
        case "Object":
          return "object-wrapper";
      }
    });
    const role = computed(() => {
      if (props.ariaLevel === 0) {
        if (type.value === "Array" || type.value === "Object") {
          return "tree";
        } else {
          return void 0;
        }
      } else {
        if (type.value === "Array" || type.value === "Object") {
          return "group";
        } else {
          return "treeitem";
        }
      }
    });
    const attrs = computed(() => {
      const attrs = {};
      if (role.value !== void 0) {
        attrs.role = role.value;
        attrs.ariaLevel = props.ariaLevel + 1;
      }
      return attrs;
    });
    return {
      is,
      role,
      attrs,
      href,
    };
  },
  components: {
    ObjectWrapper,
    ArrayWrapper,
    StringWrapper,
    NumberWrapper,
    NullWrapper,
    FalseWrapper,
    TrueWrapper,
  },
});

export default Wrapper;
</script>

<template>
  <component
    :is="is"
    :name="name"
    :href="href"
    :path="path"
    :data="data"
    :option="option"
    :collapse-signal="collapseSignal"
    :expand-signal="expandSignal"
    :expandOnCreatedAndUpdated="expandOnCreatedAndUpdated"
    :getKeys="getKeys"
    :class="ariaLevel === 0 ? 'object-visualizer' : void 0"
    v-bind="attrs"
  />
</template>
