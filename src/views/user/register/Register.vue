<template>
  <div class="register">
    <div class="title">用户注册须知</div>
    <div class="inner-process" style="margin-bottom: 40px">
      <div class="inner-process-title">内部账号注册流程</div>
      <a-steps>
        <a-step
          title="账号注册"
          description="填写手机号码，设置账号密码，完善个人信息，真实姓名、军官证/消防救援人员证。"
        />
        <a-step
          title="选择单位"
          description="选择所在支队/业务处室，完善职务、职称、电子邮箱信息，发送认领申请给到单位。"
        />
        <a-step
          title="单位认领"
          description="等待支队/业务处室管理员在队伍管理中进行人工认领审核，确认用户所属关系信息。"
        />
        <a-step title="参与科技业务" description="账号注册成功，可查看科技需求，参与建言献策，查看平台公开信息。" />
      </a-steps>
    </div>
    <div class="outside-process">
      <div class="outside-process-title">外部账号注册流程</div>
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
    <a-checkbox :checked="checked" @change="onChange">
      本人已认真阅读上述须知，自愿提交注册申请，在此郑重承诺：所提交的信息真实、
      合法、有效，本人信息发生变化后会及时更新。若因提交的信息失实或不符合法律法规造成任何不良后果的，本人承担相应的法律责任。
    </a-checkbox>
    <div class="check" v-if="checkVisible">请阅读并勾选</div>
    <div class="action">
      <div style="margin-top: 20px">
        <a-button class="btn" type="primary" @click="handleInside" block>内部账号注册</a-button>
      </div>
      <div style="margin: 16px 0">
        <a-button class="btn" type="primary" @click="handleOutside" block>外部账号注册</a-button>
      </div>
      <div>
        <a-button class="btn" @click="handleCancel" block>取消注册</a-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 选择状态
      checked: false,
      checkVisible: false,
    }
  },
  methods: {
    onChange(e) {
      this.checked = !this.checked
      if (this.checked) {
        this.checkVisible = false
      }
    },
    handleInside() {
      if (this.checked) {
        this.$router.push('insideRegister')
      } else {
        this.checkVisible = true
      }
    },
    handleOutside() {
      if (this.checked) {
        this.$router.push('outsideRegister')
      } else {
        this.checkVisible = true
      }
    },
    handleCancel() {
      this.$router.push('home')
    },
  },
}
</script>
<style lang="less" scoped>
.register {
  .title {
    font-size: 20px;
    font-weight: 500;
    text-align: center;
    color: #303133;
    line-height: 20px;
    margin-bottom: 20px;
  }
  .a-checkbox {
    span {
      font-size: 14px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.65);
      line-height: 24px;
    }
  }
  .inner-process,
  .outside-process {
    &-title {
      font-size: 16px;
      font-weight: 500;
      text-align: left;
      color: #1890ff;
      line-height: 16px;
      margin-bottom: 20px;
    }
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
  .check {
    color: #f5222d;
  }
  // 操作
  .action {
    div {
      text-align: center;
      .btn {
        max-width: 600px;
      }
    }
  }
}
</style>
