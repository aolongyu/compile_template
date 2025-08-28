<template>
  <div ref="containerRef" class="container">
    <div ref="editor"></div>
    <el-button
      class="btn"
      icon="el-icon-position"
      type="primary"
      @click="onComplieClick"
      >执行</el-button
    >

    <el-drawer
      custom-class="drawer"
      size="100%"
      direction="btt"
      :with-header="false"
      :destroy-on-close="true"
      :visible.sync="control.isShowDrawer"
      @opened="onDrawerOpened"
      @closed="onDrawerClosed"
    >
      <div style="display: flex; flex-direction: column; height: 100%">
        <el-header class="header">
          <div class="title">执行</div>
          <el-button icon="el-icon-close" @click="onCloseClick"></el-button>
        </el-header>
        <el-main>
          <el-tabs v-model="control.drawerActiveTab">
            <el-tab-pane label="编译日志" name="log">
              <div v-show="loading" class="loading-wrapper">
                <i class="el-icon-loading"></i>
              </div>
              <el-timeline :key="timeline.length">
                <el-timeline-item
                  v-for="(tl, index) in timeline"
                  :key="index"
                  :timestamp="tl.timestamp"
                  placement="top"
                  :type="tl.type"
                >
                  <el-card>
                    <strong>{{ tl.title }}</strong>
                    <div style="margin-top: 16px">{{ tl.content }}</div>
                    <p v-for="other in tl.others" :key="other">{{ other }}</p>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </el-tab-pane>
            <el-tab-pane label="渲染预览" name="preview">
              <div class="render-wrapper">
                <div ref="renderContainer"></div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-main>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import Scheduler from "@/utils/scheduler.js";
import { ComponentRender } from "./helper.js";
import { text } from "./config.js";
import ace from "ace-builds";
import "ace-builds/src-noconflict/mode-vue";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

const scheduler = new Scheduler();

export default {
  name: "Compile",

  data: () => ({
    text: "",
    aceEditor: null,
    cRender: null,

    loading: true,
    timeline: [],

    control: {
      isShowDrawer: false,
      drawerActiveTab: "log",
    },
  }),

  created() {
    this.text = text;
  },

  mounted() {
    this.initAceEditor();
  },

  methods: {
    getLines() {
      const height = this.$refs.containerRef.clientHeight;
      return height / 16;
    },
    initAceEditor() {
      const lines = this.getLines();
      this.aceEditor = ace.edit(this.$refs.editor, {
        maxLines: lines,
        minLines: lines,
        mode: "ace/mode/vue",
        tabSize: 2,
        selectionStyle: "text",
        ext: ["language_tools"],
        value: this.text,
        theme: "ace/theme/monokai",
      });
    },
    onComplieClick() {
      this.control.isShowDrawer = true;
    },
    onCloseClick() {
      this.control.isShowDrawer = false;
    },
    onDrawerOpened() {
      this.cRender = new ComponentRender(
        this.$refs.renderContainer,
        this.addTimeline
      );
      const text = this.aceEditor.getValue();
      this.cRender.render(text, {
        props: {
          subTitle: "myTitle",
        },
        events: {
          loaded: this.loaded,
          click: this.onClick,
        },
      });
    },
    onDrawerClosed() {
      this.control.drawerActiveTab = "log";
      this.cRender.destroy();
      this.cRender = null;
      this.timeline = [];
    },
    addTimeline({ status, done = false }, title = "", content = "", ...others) {
      scheduler.add(() => {
        // console.warn(`${this.timeline.length + 1}.log: `, title, content, others);
        this.timeline.unshift({
          timestamp: new Date().toLocaleString(),
          type: status,
          title,
          content,
          others,
        });
        this.loading = !done;
      });
    },
    loaded(e) {
      console.log("loaded", e);
    },
    onClick(e) {
      console.log("click", e);
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  height: 100%;

  .btn {
    position: absolute;
    top: 8px;
    right: 24px;
  }

  .render-wrapper {
    border: 2px dashed #ccc;
  }
}

.drawer {
  .header {
    // position: absolute;
    // top: 16px;
    // left: 16px;
    // right: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    z-index: 1000;

    .title {
      font-size: 22px;
      font-weight: bold;
    }
  }
  .el-drawer__title {
    margin-bottom: 16px;
  }
  .el-tabs__header {
    position: absolute;
    top: 32px;
  }
  .loading-wrapper {
    color: #7ec050;
    text-align: center;
    font-size: 20px;
  }
}
</style>
