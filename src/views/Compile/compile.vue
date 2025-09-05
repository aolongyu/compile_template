<template>
  <div class="container">
    <div class="editor-wrapper">
      <CodePenEditor ref="editorRef" v-model="codepen" />
    </div>
    <div class="actions">
      <el-button
        class="el-icon-menu"
        type="primary"
        :loading="control.previewLoading"
        @click="onPreview"
      >
        查看编译结果
      </el-button>
    </div>
    <el-drawer
      title="编译结果"
      direction="btt"
      size="100%"
      :visible.sync="control.previewDrawerVisible"
      @opened="onPreviewOpened"
    >
      <PreviewDrawer ref="previewDrawerRef" />
    </el-drawer>
  </div>
</template>

<script>
import CodePenEditor from "./components/CodePenEditor";
import PreviewDrawer from "./components/PreviewDrawer";

export default {
  name: "Compile",

  components: {
    CodePenEditor,
    PreviewDrawer,
  },

  data: () => ({
    codepen: {
      html: "",
      css: "",
      js: "",
    },
    control: {
      previewLoading: false,
      previewDrawerVisible: false,
    },
  }),

  methods: {
    async compile() {
      const { editorRef } = this.$refs;
      const codepen = await editorRef.getCodes("longyu_ao", "ZYbRjpg");
      Object.assign(this.codepen, codepen);
    },

    async onPreview() {
      try {
        this.control.previewLoading = true;
        await this.compile();
        this.control.previewDrawerVisible = true;
      } finally {
        this.control.previewLoading = false;
      }
    },

    onPreviewOpened() {
      const { previewDrawerRef } = this.$refs;
      previewDrawerRef.myRender(this.codepen);
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;

  .editor-wrapper {
    height: 100%;
  }

  .actions {
    position: absolute;
    bottom: 10px;
    right: 10px;
  }
}
</style>
