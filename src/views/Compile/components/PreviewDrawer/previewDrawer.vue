<template>
  <div class="preview-drawer">
    <el-collapse :value="['preview']">
      <el-collapse-item title="实时渲染预览" name="preview">
        <div id="shadow-dom-box"></div>
      </el-collapse-item>
      <el-collapse-item title="HTML" name="html">
        <pre>{{ data.html || "-" }}</pre>
      </el-collapse-item>
      <el-collapse-item title="CSS" name="css">
        <pre>{{ data.css || "-" }}</pre>
      </el-collapse-item>
      <el-collapse-item title="JS" name="js">
        <pre>{{ data.js || "-" }}</pre>
      </el-collapse-item>
      <el-collapse-item title="完整 DOM 结构" name="dom">
        <pre>{{ renderHtml || "-" }}</pre>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import axios from "axios";
import { combineHtml } from "./helper.js";

export default {
  name: "PreviewDrawer",

  data: () => ({
    data: {
      html: "",
      css: "",
      js: "",
      iframeSrcdoc: "",
    },
    shadowRoot: null, // 保存shadow root引用
  }),

  computed: {
    renderHtml() {
      const { html, css, js } = this.data;
      return combineHtml(html, css, js);
    },
  },

  methods: {
    myRender(data) {
      Object.assign(this.data, data || {});

      this.handleRender();
    },

    handleRender() {
      try {
        const { html, css, js } = this.data;
        const shadowDom = document.querySelector("#shadow-dom-box");

        if (!shadowDom) {
          console.error("Shadow DOM container not found");
          return;
        }

        // 如果已经存在shadow root，先移除
        if (this.shadowRoot) {
          shadowDom.innerHTML = "";
          this.shadowRoot = null;
        }

        // 创建新的shadow root
        this.shadowRoot = shadowDom.attachShadow({ mode: "open" });

        // 在shadow root中添加HTML和CSS内容
        this.shadowRoot.innerHTML = combineHtml(html, css, js);

        // this.$nextTick(() => {
          this.executeScripts();

          console.log("Shadow DOM content rendered successfully");
        // });
      } catch (error) {
        console.error("Error rendering shadow DOM:", error);
      }
    },

    async executeScripts() {
      const scripts = this.shadowRoot.querySelectorAll("script");
      for (const script of scripts) {
        if (script.src) {
          const res = await axios.get(script.src);
          script.textContent = res.data;
        }
        const scriptContent = script.textContent;
        if (scriptContent) {
          const scriptFn = new Function(scriptContent);
          scriptFn.call(this.shadowRoot);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.preview-drawer {
  padding: 0 20px;
  border-top: 1px solid #e5e5e5;

  #shadow-dom-box {
    min-height: 300px;
    border: 2px dashed #ccc;
    background-color: #f9f9f9;
    overflow: auto;
  }
}
</style>
