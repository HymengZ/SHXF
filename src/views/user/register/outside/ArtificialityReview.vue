<template>
  <div class="artificiality-review">
    <div class="content">
      <div class="status">
        <div class="icon">
          <a-icon v-if="examineSuccess" type="check-circle" theme="filled" style="color: #52c41a; font-size: 60px" />
          <a-icon v-else type="exclamation-circle" theme="filled" style="color: #faad14; font-size: 60px" />
        </div>
        <div class="text-blod" v-text="examineSuccess ? '人工审核认证通过' : '等待人工审核认证'"></div>
        <div
          class="text"
          v-text="
            examineSuccess
              ? '当前账号完善度60%，下一步请发布您的科技资源'
              : '请耐心等待平台管理员审核您的单位信息，审核通过后才可继续操作。'
          "
        ></div>
        <a-button v-if="examineSuccess" @click="handlePublish" type="primary" style="margin-bottom: 16px" block
          >发布科技资源</a-button
        >
        <a-button v-if="examineSuccess" @click="handleBack" block>返回平台首页</a-button>
        <a-button v-else @click="handleBackLogin" block>返回登录页</a-button>
      </div>
      <a-divider dashed />
      <div class="tips">
        <div class="title">科技资源名词解释</div>
        <div class="text">
          科技资源是指入驻平台的外部单位或机构，所提交的寻求业务合作的服务资源，包括不限于产品、服务、合作意向。敬请按照提示，
          真实填写。平台将根据贵方所提交的科技资源，尽可能提供相应科技需求，进行科技项目孵化匹配支持。
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getAction } from '@/api/manage'
export default {
  props: {
    currentData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      // 审核状态
      examineSuccess: false,
    }
  },
  created() {
    this.getExamineStatus()
  },
  methods: {
    // 获取人工审核状态
    getExamineStatus() {
      let userId = this.currentData.id
      getAction(`/sys/common/search/${userId}`).then((res) => {
        if (res.result.applyStatus) {
          this.examineSuccess = true
          let applyStatus = res.result.applyStatus
          if (applyStatus == '0') {
            this.examineSuccess = false
          } else {
            this.examineSuccess = true
          }
        }
      })
    },
    // 发布科技资源
    handlePublish() {
      this.$router.push({
        path: '/hatch/resource',
        query: {
          activeKey: 2,
        },
      })
    },
    handleBackLogin() {
      this.$router.push('login')
    },
    // 返回平台首页
    handleBack() {
      this.$router.back()
    },
  },
}
</script>
<style lang="less" scoped>
.content {
  // 审核内容
  .status {
    width: 500px;
    margin: 0 auto;
    margin-top: 40px;
    margin-bottom: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .icon {
      margin-bottom: 20px;
    }
    .text-blod {
      font-size: 20px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 32px;
      margin-bottom: 6px;
    }
    .text {
      font-size: 13px;
      font-weight: 400;
      text-align: center;
      color: #8c8c8c;
      line-height: 22px;
      margin-bottom: 20px;
      span {
        color: #ff6d6f;
      }
    }
  }
  .tips {
    .title {
      margin-bottom: 20px;
      font-size: 16px;
      font-weight: 500;
      text-align: left;
      color: #1890ff;
      line-height: 16px;
    }
    .text {
      padding: 0 60px 0 20px;
      font-size: 14px;
      font-weight: 400;
      text-align: left;
      color: #8c8c8c;
      line-height: 20px;
    }
  }
}
</style>
