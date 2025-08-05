<template>
  <div class="container">
    <div ref="editor"></div>
    <el-button
      class="btn"
      icon="el-icon-position"
      type="primary"
      @click="onComplieClick"
      >执行编译</el-button
    >

    <el-drawer
      size="90%"
      :with-header="false"
      direction="btt"
      :visible.sync="control.isShowDrawer"
      @opened="onDrawerOpened"
      @closed="onDrawerClosed"
    >
      <el-main>
        <el-tabs v-model="control.drawerActiveTab">
          <el-tab-pane label="编译日志" name="log">
            <transition-group name="el-fade-in-linear">
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
            </transition-group>
          </el-tab-pane>
          <el-tab-pane label="渲染预览" name="preview">
            <div class="render-wrapper">
              <div ref="renderContainer"></div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-drawer>
  </div>
</template>

<script>
import { ComponentRender, LogStatus } from "./helper.js";
import { text } from "./config.js";
import ace from "ace-builds";
import "ace-builds/src-noconflict/mode-vue";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

export default {
  name: "Compile",

  data: () => ({
    text: "",
    aceEditor: null,
    cRender: null,

    timeline: [],
    showTimeline: [],

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
    initAceEditor() {
      this.aceEditor = ace.edit(this.$refs.editor, {
        maxLines: 40,
        minLines: 40,
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
    onDrawerOpened() {
      this.cRender = new ComponentRender(
        this.$refs.renderContainer,
        this.addTimeline
      );
      this.cRender.render(this.text, {
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
      this.control.isShowDrawer = false;
      this.control.drawerActiveTab = "log";
      this.cRender.destroy();
      this.cRender = null;
    },
    addTimeline(type, title = "", content = "", ...others) {
      console.warn(`${this.timeline.length + 1}.log: `, title, content, others);
      this.timeline.unshift({
        timestamp: new Date().toLocaleString(),
        type,
        title,
        content,
        others,
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
</style>
