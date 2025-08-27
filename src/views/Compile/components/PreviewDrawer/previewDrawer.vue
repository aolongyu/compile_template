<template>
  <div class="preview-drawer">
    <el-collapse :value="['preview']">
      <el-collapse-item title="实时渲染预览" name="preview">
        <div class="render-html">
          <iframe frameborder="no" :srcdoc="renderHtml"></iframe>
        </div>
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
    },
  },
};
</script>

<style lang="scss" scoped>
.preview-drawer {
  padding: 0 20px;
  border-top: 1px solid #e5e5e5;

  .render-html {
    width: 100%;
    height: 100%;
    border: 2px dashed #ccc;

    iframe {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
