<template>
  <div class="app">
    <div class="header">
      <div class="header__title">基于Vue2模版实时编辑/编译/渲染器</div>
      <el-menu
        ref="menuRef"
        mode="horizontal"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        :router="true"
        :default-active="defaultActiveMenu"
      >
        <el-menu-item index="intro"> 项目介绍 </el-menu-item>
        <el-menu-item index="compile"> 在线编译/渲染 </el-menu-item>
      </el-menu>
    </div>
    <div class="flow">
      <div class="placeholder"></div>
      <div class="content">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    defaultActiveMenu: "intro",
  }),
  beforeMount() {
    const activeMenu = window.location.hash.split("/")[1];
    this.defaultActiveMenu = activeMenu || "intro";
  },
};
</script>

<style lang="scss" scoped>
.app {
  height: 100vh;
  overflow: hidden;
}

.header {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1000;
  height: 60px;
  background-color: #545c64;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 16px;

  &__title {
    font-size: 20px;
    font-weight: bold;
    color: #fff;
  }
}

.flow {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;

  .placeholder {
    height: 60px;
  }

  .content {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    position: relative;
  }
}
</style>
