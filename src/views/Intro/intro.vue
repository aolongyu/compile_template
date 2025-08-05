<template>
  <div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="欢迎访问～" name="welcome">
        <div>Hi～ 欢迎访问我的学习站点！！！</div>
        <div>我是敖龙宇，一名始终对知识保持好奇，不断探索和持续学习的前端开发者。</div>
      </el-collapse-item>
      <el-collapse-item title="项目介绍" name="function">
        <div>
          这是一个基于Vue2所开发的
        </div>
        <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
      </el-collapse-item>
      <el-collapse-item title="效率 Efficiency" name="3">
        <div>简化流程：设计简洁直观的操作流程；</div>
        <div>
          清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；
        </div>
        <div>
          帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。
        </div>
      </el-collapse-item>
      <el-collapse-item title="可控 Controllability" name="4">
        <div>
          用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；
        </div>
        <div>
          结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  name: "Intro",
  data: () => ({
    activeNames: ["function"],
  }),
};
</script>
