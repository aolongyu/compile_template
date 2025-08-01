<template>
  <div class="custom-component">
    <h3>{{ title }}</h3>
    <h4>props-subTitle: {{ subTitle }}</h4>
    <p v-if="showDesc">{{ count }}</p>
    <ul>
      <li v-for="(item, index) in list" :key="index" class="list-item">
        {{ index + 1 }}. {{ item }}
      </li>
    </ul>
    <el-button @click="handleClick">Add</el-button>
  </div>
</template>
<script>
export default {
  name: "Example",
  props: {
    subTitle: String,
  },
  data() {
    return {
      title: "Vue 2 自定义组件",
      list: ["基本信息", "报表数据", "统计分析"],
      showDesc: true,
      count: 0,
    };
  },
  mounted() {
    this.$emit("loaded", "oh loaded");
  },
  methods: {
    handleClick() {
      this.count++;
      this.$emit("click", this.count);
    },
  },
};
</script>
<style>
h3 {
  color: #f40;
}
</style>
