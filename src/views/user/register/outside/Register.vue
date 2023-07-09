<template>
  <div class="register">
    <div class="title">外部账号注册</div>
    <a-steps :current="current">
      <!-- 头部 -->
      <a-step v-for="item in steps" :key="item.title" :title="item.title" />
    </a-steps>

    <!-- 内容 -->
    <div class="steps-content">
      <component
        :is="stepName"
        ref="step"
        @nextStep="changeComponent"
        :currentData="currentData"
        @sendCurrentData="getCurrentData"
      ></component>
      <!-- 操作按钮 -->
      <div class="steps-content-action">
        <a-button v-if="current < 2" type="primary" style="margin-bottom: 8px" @click="next" block> 下一步 </a-button>
        <a-button v-if="current > 0 && current < 2" @click="prev" block> 上一步 </a-button>
      </div>
    </div>
  </div>
</template>
<script>
import AccountMessage from './AccountMessage.vue'
import UnitMessage from './UnitMessage.vue'
import ArtificialityReview from './ArtificialityReview.vue'
export default {
  components: {
    AccountMessage,
    UnitMessage,
    ArtificialityReview,
  },

  data() {
    return {
      currentData: {},
      stepName: AccountMessage,
      current: 0,
      steps: [
        {
          title: '账号注册',
        },
        {
          title: '完善单位信息',
        },
        {
          title: '人工审核认证',
        },
        {
          title: '发布科技资源',
        },
      ],
    }
  },
  created() {
    if (this.$route.query.userId) {
      this.loginJump()
    }
  },
  methods: {
    // 登录后跳转注册页继续填写
    loginJump() {
      this.currentData = { id: this.$route.query.userId }
      let stepValue = +this.$route.query.step
      this.changeComponent(stepValue)
    },
    // 注册后的信息保存
    getCurrentData(data) {
      this.currentData = data
    },
    // 下一步
    next() {
      if (this.current == 0 || this.current == 1) {
        this.$refs.step.handleSubmit()
      }
    },
    prev() {
      this.current--
      this.changeComponent(this.current)
    },
    changeComponent(val) {
      this.current = val
      switch (val) {
        case 0:
          this.stepName = AccountMessage
          break
        case 1:
          this.stepName = UnitMessage
          break
        case 2:
          this.stepName = ArtificialityReview
          break
      }
    },
  },
}
</script>
<style lang="less" scoped>
.title {
  font-size: 20px;
  font-weight: 500;
  text-align: center;
  color: #303133;
  line-height: 20px;
  margin-bottom: 20px;
}
.steps-content-action {
  width: 500px;
  margin: 0 auto;
}
</style>
