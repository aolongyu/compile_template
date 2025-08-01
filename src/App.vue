<template>
  <el-container>
    <el-header>
      <router-link to="/home">
        <el-button>Home</el-button>
      </router-link>
      <router-link to="/complie">
        <el-button>Complie</el-button>
      </router-link>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "App",
};
</script>
