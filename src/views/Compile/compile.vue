<template>
  <div>
    <el-button @click="onComplieClick">Do</el-button>
    <el-input
      type="textarea"
      :rows="15"
      placeholder="请输入内容"
      v-model="text"
    >
    </el-input>
    <h3>123</h3>

    <div ref="renderContainer"></div>
  </div>
</template>

<script>
import { ComponentRender } from "./helper.js";
import { text } from "./config.js";

export default {
  name: "Compile",

  data() {
    return {
      text: "",
      cRender: null,
    };
  },

  created() {
    this.text = text;
  },

  mounted() {
    this.cRender = new ComponentRender(this.$refs.renderContainer);
  },

  methods: {
    onComplieClick() {
      try {
        this.cRender.render(this.text, {
          props: {
            subTitle: "myTitle",
          },
          events: {
            loaded: this.loaded,
            click: this.onClick,
          },
        });
      } catch (error) {
        console.error(error);
      }
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
