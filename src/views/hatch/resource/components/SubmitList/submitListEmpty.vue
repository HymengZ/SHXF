<template>
  <div class="submit-empty-container">
    <div class="table">
      <a-table></a-table>
      <div class="btn">
        <a-button type="primary" icon="plus" @click="handleAdd">新增科技资源</a-button>
      </div>
    </div>
    <div class="text-content">
      <div class="title">科技资源管理流程</div>
      <div class="step">
        <a-steps>
          <a-step
            title="账号注册"
            description="填写手机号码，设置账号密码，完善个人信息，真实姓名、身份证、职务、职称、邮箱地址。"
          />
          <a-step
            title="完善单位信息"
            description="根据单位类型准备资料（事业单位法人证书/营业执照/盖有公章的单位证明）。"
          />
          <a-step title="人工审核认证" description="等待平台人工审核通过。" />
          <a-step title="发布科技资源" description="账号注册成功，可发布科技资源，接收匹配消息，参与科技项目合作。" />
        </a-steps>
      </div>
      <a-divider dashed />
      <div class="title">科技资源样本示例</div>
      <div class="sample">
        <img class="img-bottom" src="~@/assets/科技资源样本1.png" alt="示例" />
        <img src="~@/assets/科技资源样本2.png" alt="示例" />
      </div>
    </div>
    <j-modal
      title="科技资源编辑/新增"
      :visible="reportVisible"
      switchFullscreen
      :fullscreen="true"
      @cancel="handleCancel"
      :footer="false"
      class="j-modal"
    >
      <StepBar @cancel="handleCancel" type="add" />
    </j-modal>
  </div>
</template>
<script>
// 引入步骤条
import StepBar from '../stepBar.vue'
export default {
  components: {
    StepBar,
  },
  data() {
    return {
      reportVisible: false,
    }
  },
  methods: {
    handleAdd() {
      this.reportVisible = true
    },
    handleCancel() {
      this.reportVisible = false
      this.$emit('refreshList')
    },
  },
}
</script>
<style lang="less" scoped>
.submit-empty-container {
  margin-top: 16px;
  padding: 16px 24px;
  background: #fff;
  .table {
    position: relative;
    overflow: hidden;
    /deep/ .ant-table-placeholder {
      border-bottom: 1px dashed #e8e8e8;
    }
    .btn {
      position: absolute;
      bottom: 6%;
      left: calc(50% - 69px);
      z-index: 999;
    }
  }
  .text-content {
    margin-top: 24px;
    .title {
      font-size: 16px;
      font-weight: 500;
      text-align: left;
      color: #1890ff;
      line-height: 16px;
    }
    .step {
      margin: 24px 0;
      /deep/ .ant-steps {
        .ant-steps-item-icon {
          background: #1890ff;
          .ant-steps-icon {
            color: #fff;
          }
        }
        .ant-steps-item-content {
          .ant-steps-item-title {
            font-size: 16px;
            font-weight: 600;
            color: #262626;
            line-height: 22px;
          }
          .ant-steps-item-title::after {
            background-color: #1890ff;
          }
          .ant-steps-item-description {
            font-size: 14px;
            font-weight: 400;
            text-align: justify;
            color: #8c8c8c;
            line-height: 20px;
            max-width: 210px;
          }
        }
      }
    }
    .sample {
      margin-top: 24px;
      img {
        width: 100%;
        margin-bottom: 24px;
      }
    }
  }
}
</style>
