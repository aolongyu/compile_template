<template>
  <div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="欢迎访问～" name="welcome">
        <div>✌ Hi～ 欢迎访问我的学习站点！！！</div>
        <div>
          ➡ 我是敖龙宇，一名始终对知识保持好奇，不断探索和持续学习的前端开发者。
        </div>
      </el-collapse-item>
      <el-collapse-item title="项目介绍" name="function">
        <div>
          ✔
          基于Vue2模版语法，实时编辑和在线生成并挂载用户自定义组件，支持用户按照规范Vue模版语法
          template / script / style
          三级结构编辑组件内容，提供语法自动提示编辑器。
        </div>
        <div>
          ✔
          通过用户录入原始代码字符，解析三级结构字符片段，分别生成对应渲染对象，过滤
          template 语法中存在的危险标签和指令。
        </div>
        <div>
          ✔
          采用Vue原生运行时组件生成能力，编译生成组件实例并完成页面挂载。组件完全支持属性传递（props）、选项/组合（provide
          / inject）、事件分发（emits）等Vue语法。支持实例方法、指令系统、特殊
          attribute 和内置组件。
        </div>
      </el-collapse-item>
      <el-collapse-item title="使用方式" name="use">
        <div>
          ★
          在编辑器中输入Vue模版语法，支持三级结构编辑组件内容，提供语法自动提示编辑器。
        </div>
        <div>
          ★
          通过用户录入原始代码字符，解析三级结构字符片段，分别生成对应渲染对象，过滤template语法中存在的危险标签和指令。
        </div>
        <div></div>
      </el-collapse-item>
      <el-collapse-item title="使用案例" name="case">
        <img :src="caseExample" width="100%" />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import caseExample from "@/assets/images/case-example.gif";
console.log(caseExample);
export default {
  name: "Intro",
  data: () => ({
    activeNames: ["welcome", "function", "use", "case"],
    caseExample,
  }),
};
</script>

<style lang="scss">
.el-collapse-item {
  @mixin pd {
    padding: 0 16px;
  }

  position: relative;

  .el-collapse-item__header {
    @include pd();
    background-color: rgba($color: #545c64, $alpha: 0.1);
  }
  .el-collapse-item__wrap {
    @include pd();
  }

  .el-collapse-item__content {
    padding-top: 25px;
  }
}
</style>
