<template>
  <el-container>
    <el-header>
      <el-menu
        class="el-menu-demo"
        mode="horizontal"
        :router="true"
        :active="defaultActiveMenu"
      >
        <el-menu-item index="intro"> 项目介绍 </el-menu-item>
        <el-menu-item index="compile"> 项目能力展示 </el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    defaultActiveMenu: "intro",
  }),
  created() {
    this.defaultActiveMenu = this.$route.path.split("/")[1];
  },
};
</script>
