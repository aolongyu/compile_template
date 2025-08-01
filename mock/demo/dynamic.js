import Vue from "vue";

/**
 * 为动态组件注入隔离样式（模拟scoped效果）
 * @param {Object} baseComponent - 基础组件选项（含template、data等）
 * @param {string} styleContent - 样式字符串（支持CSS语法）
 * @returns {Function} 带样式的组件构造器
 */
function withScopedStyle(baseComponent, styleContent) {
  // 创建带样式的组件构造器
  return Vue.extend({
    // 继承基础组件的所有选项
    ...baseComponent,

    data() {
      return {
        // 生成唯一标识（基于Vue实例的_uid，确保每个实例唯一）
        scopeId: `data-v-${this._uid}`,
        // 存储动态创建的style标签，用于销毁时清理
        styleElement: null,
      };
    },

    mounted() {
      // 步骤1：为组件根元素添加唯一属性（用于样式隔离）
      this.$el.setAttribute(this.scopeId, "");

      // 步骤2：处理样式字符串，为所有选择器添加唯一属性前缀
      const scopedStyle = this.processStyle(styleContent);

      // 步骤3：动态创建style标签并注入样式
      this.createStyleElement(scopedStyle);
    },

    beforeDestroy() {
      // 组件销毁时移除样式标签，避免内存泄漏和样式残留
      if (this.styleElement && this.styleElement.parentElement) {
        this.styleElement.parentElement.removeChild(this.styleElement);
      }
    },

    methods: {
      /**
       * 处理样式字符串，为选择器添加scopeId属性
       * @param {string} style - 原始样式字符串
       * @returns {string} 处理后的scoped样式
       */
      processStyle(style) {
        // 清除注释（避免注释中的内容被误处理）
        let cleanedStyle = style
          .replace(/\/\/.*$/gm, "") // 移除单行注释
          .replace(/\/\*[\s\S]*?\*\//g, ""); // 移除多行注释

        // 正则匹配CSS选择器（简单处理，支持类、ID、标签选择器）
        const selectorRegex = /([^\{\}]+)\{/g;

        // 为每个选择器添加scopeId属性（如 .class → .class[data-v-xxx]）
        return cleanedStyle.replace(selectorRegex, (match, selector) => {
          // 处理组合选择器（如 .a, .b → .a[data-v-xxx], .b[data-v-xxx]）
          const scopedSelectors = selector.split(",").map((sel) => {
            sel = sel.trim();
            if (!sel) return "";

            // 特殊选择器处理（如 :hover、::before 等伪类/伪元素）
            const pseudoClassIndex = sel.indexOf(":");
            if (pseudoClassIndex > -1) {
              const baseSel = sel.slice(0, pseudoClassIndex).trim();
              const pseudoSel = sel.slice(pseudoClassIndex).trim();
              return `${baseSel}[${this.scopeId}] ${pseudoSel}`;
            }

            // 普通选择器添加属性
            return `${sel}[${this.scopeId}]`;
          });

          return `${scopedSelectors.join(", ")} {`;
        });
      },

      /**
       * 创建style标签并注入样式
       * @param {string} styleContent - 处理后的样式内容
       */
      createStyleElement(styleContent) {
        this.styleElement = document.createElement("style");
        this.styleElement.type = "text/css";
        this.styleElement.setAttribute("data-scoped", this.scopeId); // 标记为scoped样式

        // 安全注入样式（使用textContent避免XSS风险）
        this.styleElement.textContent = styleContent;

        // 添加到head中（确保样式生效）
        document.head.appendChild(this.styleElement);
      },
    },
  });
}

// ------------------------------
// 使用示例
// ------------------------------

// 1. 定义基础组件（用户输入的组件结构）
const userComponent = {
  template: `
    <div class="user-card">
      <h2 class="title">{{ title }}</h2>
      <p class="desc">{{ description }}</p>
      <button class="btn" @click="onClick">点击我</button>
    </div>
  `,
  data() {
    return {
      title: "自定义组件",
      description: "这是带隔离样式的动态组件",
    };
  },
  methods: {
    onClick() {
      alert("按钮被点击");
    },
  },
};

// 2. 定义组件样式（用户输入的样式）
const componentStyle = `
  .user-card {
    padding: 20px;
    border: 1px solid #eee;
    border-radius: 8px;
    max-width: 300px;
  }

  .title {
    margin: 0 0 10px 0;
    color: #333;
    font-size: 18px;
  }

  .desc {
    margin: 0 0 15px 0;
    color: #666;
    font-size: 14px;
  }

  .btn {
    padding: 6px 12px;
    background: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .btn:hover {
    background: #359e75;
  }
`;

// 3. 注入样式并创建组件
const StyledComponent = withScopedStyle(userComponent, componentStyle);

// 4. 渲染组件到页面
new Vue({
  el: "#app",
  render: (h) => h(StyledComponent),
});
