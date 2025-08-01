<template>
  <div class="report-builder">
    <div class="editor-container">
      <!-- 模板输入区域 -->
      <div class="editor-section">
        <label>Vue 2模板（支持v-if、v-for、{{}}等语法）</label>
        <textarea 
          v-model="userTemplate" 
          class="template-input"
          placeholder='示例：<div><h3>{{ title }}</h3><ul><li v-for="(item,i) in list" :key="i">{{ item }}</li></ul></div>'
        ></textarea>
      </div>

      <!-- 数据配置区域 -->
      <div class="editor-section">
        <label>组件数据（JSON格式）</label>
        <textarea 
          v-model="userData" 
          class="data-input"
          placeholder='示例：{"title": "我的组件", "list": ["选项1", "选项2"]}'
        ></textarea>
      </div>

      <!-- 方法配置区域 -->
      <div class="editor-section">
        <label>组件方法（JSON格式，值为函数字符串）</label>
        <textarea 
          v-model="userMethods" 
          class="methods-input"
          placeholder='示例：{"handleClick": "function() { alert(this.title) }"}'
        ></textarea>
      </div>

      <button @click="renderComponent" class="render-btn">渲染组件</button>
    </div>

    <!-- 渲染结果区域 -->
    <div class="preview-container">
      <h3>预览效果</h3>
      <div class="dynamic-component" ref="componentContainer"></div>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  data() {
    return {
      // 示例模板（Vue 2 语法）
      userTemplate: `
        <div class="custom-component">
          <h3>{{ title }}</h3>
          <p v-if="showDesc">这是一个用户自定义组件（Vue 2 语法）</p>
          <ul>
            <li v-for="(item, index) in list" :key="index" class="list-item">
              {{ index + 1 }}. {{ item }}
            </li>
          </ul>
          <button @click="handleClick" class="custom-btn">点击切换描述</button>
        </div>
      `,
      // 示例数据
      userData: JSON.stringify({
        title: "Vue 2 自定义组件",
        list: ["基本信息", "报表数据", "统计分析"],
        showDesc: true
      }, null, 2),
      // 示例方法
      userMethods: JSON.stringify({
        handleClick: "function() { this.showDesc = !this.showDesc; }"
      }, null, 2),
      errorMessage: '',
      // 存储动态组件实例，用于销毁旧实例
      dynamicComponentInstance: null
    };
  },
  methods: {
    // 安全过滤：清理危险标签和指令
    sanitizeTemplate(template) {
      // 1. 移除<script>等危险标签
      const forbiddenTags = ['script', 'iframe', 'svg', 'canvas', 'video', 'audio'];
      let sanitized = template;
      forbiddenTags.forEach(tag => {
        const regex = new RegExp(`<\/?${tag}[^>]*>`, 'gi');
        sanitized = sanitized.replace(regex, `<div class="forbidden-tag">禁止使用${tag}标签</div>`);
      });

      // 2. 过滤v-html和危险事件绑定
      sanitized = sanitized
        .replace(/v-html="[^"]*"/gi, '') // 移除v-html
        .replace(/@(click|change|input|keyup|keydown)/gi, (match) => {
          // 只允许特定事件
          const allowedEvents = ['click', 'change', 'input', 'keyup', 'keydown'];
          const eventName = match.slice(1);
          return allowedEvents.includes(eventName) ? match : '';
        });

      return sanitized;
    },

    // 渲染用户输入的组件
    renderComponent() {
      this.errorMessage = '';
      // 销毁旧组件实例，避免内存泄漏
      if (this.dynamicComponentInstance) {
        this.dynamicComponentInstance.$destroy();
        this.$refs.componentContainer.innerHTML = '';
      }

      try {
        // 1. 安全处理模板
        const sanitizedTemplate = this.sanitizeTemplate(this.userTemplate);

        // 2. 解析用户数据（Vue 2 中data必须是函数）
        const parsedData = JSON.parse(this.userData || '{}');
        const dataFn = () => ({ ...parsedData });

        // 3. 解析用户方法
        const parsedMethods = JSON.parse(this.userMethods || '{}');
        const methods = {};
        Object.entries(parsedMethods).forEach(([key, fnStr]) => {
          try {
            // 转换函数字符串为实际函数（Vue 2 方法中this指向组件实例）
            methods[key] = new Function(`return ${fnStr}`)();
          } catch (e) {
            console.error(`方法${key}解析错误:`, e);
          }
        });

        // 4. 编译模板（Vue 2 核心API：Vue.compile）
        const { render, staticRenderFns } = Vue.compile(sanitizedTemplate);

        // 5. 创建组件构造器（Vue 2 核心API：Vue.extend）
        const ComponentConstructor = Vue.extend({
          data: dataFn,
          methods,
          render,          // 渲染函数
          staticRenderFns, // 静态渲染函数（优化性能）
        });

        // 6. 实例化组件并挂载到容器
        this.dynamicComponentInstance = new ComponentConstructor().$mount();
        this.$refs.componentContainer.appendChild(this.dynamicComponentInstance.$el);

      } catch (error) {
        this.errorMessage = `渲染失败: ${error.message}`;
        console.error('组件渲染错误:', error);
      }
    }
  },
  // 组件销毁时清理动态实例
  beforeDestroy() {
    if (this.dynamicComponentInstance) {
      this.dynamicComponentInstance.$destroy();
    }
  }
};
</script>

<style scoped>
.report-builder {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.editor-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.editor-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-weight: 600;
  color: #333;
}

textarea {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: monospace;
  resize: vertical;
}

.template-input {
  min-height: 200px;
}

.data-input, .methods-input {
  min-height: 120px;
}

.render-btn {
  padding: 10px 15px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.render-btn:hover {
  background: #359e75;
}

.preview-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.dynamic-component {
  padding: 20px;
  border: 1px dashed #ccc;
  border-radius: 4px;
  min-height: 300px;
}

.error-message {
  color: #ff4444;
  padding: 10px;
  border: 1px solid #ffdddd;
  border-radius: 4px;
}

/* 自定义组件样式（供预览用） */
::v-deep .custom-component {
  font-family: sans-serif;
}

::v-deep .list-item {
  margin: 5px 0;
}

::v-deep .custom-btn {
  margin-top: 10px;
  padding: 5px 10px;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

::v-deep .forbidden-tag {
  color: #ff4444;
  padding: 5px;
  border: 1px dotted #ff9999;
}
</style>
