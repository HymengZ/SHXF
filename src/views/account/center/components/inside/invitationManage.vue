<template>
  <div class="invitation-mangage">
    <div class="top-title">
      <span>邀请函管理</span>
    </div>
    <a-card title="邀请统计">
      <div class="invitation-content">
        <div class="right-border">
          <div class="count">{{ statistics.creatCount }}</div>
          <div class="text">生成邀请函</div>
        </div>
        <div class="right-border">
          <div class="count">{{ statistics.acceptCount }}</div>
          <div class="text">接收邀请</div>
        </div>
        <div class="right-border">
          <div class="count">{{ statistics.refuseCount }}</div>
          <div class="text">拒绝邀请</div>
        </div>
        <div>
          <a-button @click="handleHistory">邀请历史记录</a-button>
        </div>
      </div>
    </a-card>
    <a-card title="生成新的邀请函" class="new">
      <a-form-model ref="form" :model="model" :rules="validatorRules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item prop="beInvitedUnitName" label="被邀请单位">
          <a-input v-model="model.beInvitedUnitName" size="large" placeholder="请输入被邀请单位全称"> </a-input>
        </a-form-model-item>
      </a-form-model>
    </a-card>
    <a-button type="primary" class="btn" @click="handleCreate">生成邀请函</a-button>
    <j-modal
      title="邀请历史记录"
      :visible="visible"
      switchFullscreen
      :fullscreen="true"
      @cancel="handleCancel"
      class="j-modal"
      @ok="handleOk"
      okText="确定"
    >
      <invitation-history />
    </j-modal>
    <a-modal title="结果提示" :visible="tipsVisible" @cancel="tipsCancel" :footer="false">
      <div class="modal-content">
        <div class="icon">
          <a-icon type="check-circle" theme="filled" style="color: #52c41a; font-size: 60px" />
        </div>
        <div class="text-blod">生成邀请函成功</div>
        <div class="text">{{ currentTime }}邀请{{ model.beInvitedUnitName }}，请截图发送被邀请方</div>
        <div class="qr-code">
          <vue-qr :logoSrc="imageUrl" :text="qrCodeUrl" :size="300" :callback="qrBack" />
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import VueQr from 'vue-qr'
import { dataURLtoFile } from '@/utils/urltoFile'
import InvitationHistory from './invitationHistory'
import { formatMinute, formatDay } from '@/utils/formatDate'
import { addLetter, editLetter, getInviteCount } from '@/api/center/userInfo'
import { upload } from '@/api/upload'
export default {
  components: {
    InvitationHistory,
    VueQr,
  },
  props: {
    userUnit: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      // 生成二维码记录id
      recordId: '',
      // 邀请函二维码
      qrCodeUrl: '',
      imageUrl: require('../../../../../assets/logo@3x.png'),
      currentTime: '',
      // 邀请统计
      statistics: {
        creatCount: '0',
        acceptCount: '0',
        refuseCount: '0',
      },
      labelCol: { span: 24 },
      wrapperCol: { span: 10 },
      model: {
        beInvitedUnitName: '',
      },
      visible: false,
      // 邀请函弹窗
      tipsVisible: false,
      validatorRules: {
        beInvitedUnitName: [{ required: true, message: '被邀请单位不能为空' }],
      },
    }
  },
  created() {
    this.getStatistics()
  },
  methods: {
    handleCancel() {
      this.visible = false
    },
    handleOk() {},
    // 历史记录
    handleHistory() {
      this.visible = true
    },
    // 获取邀请函统计
    async getStatistics() {
      const { result, message, success } = await getInviteCount()
      if (!success) {
        this.$message.warning(message)
        return
      }
      this.statistics.creatCount = result.count
      this.statistics.acceptCount = result.pass
      this.statistics.refuseCount = result.reject
    },
    // 生成邀请函
    handleCreate() {
      let that = this
      that.$refs['form'].validate(async (success) => {
        if (success) {
          that.currentTime = formatMinute(new Date())
          let params = {
            beInvitedUnitName: that.model.beInvitedUnitName,
            inviteResult: 1,
            inviteTime: formatDay(new Date()),
            inviteUnitId: that.userUnit.id,
            inviteUnitName: that.userUnit.name,
          }
          const { success, result, message } = await addLetter(params)
          if (!success) {
            that.$message.success(message)
            return
          }
          that.recordId = result.id
          that.qrCodeUrl = `https://baidu.com/${result.id}`
          that.tipsVisible = true
        }
      })
    },
    tipsCancel() {
      this.tipsVisible = false
    },
    async qrBack(e) {
      const file = dataURLtoFile(e, `${this.model.beInvitedUnitName}.png`)
      const data = new FormData()
      data.append('file', file)
      data.append('biz', 'qrcode')
      const { message } = await upload(data)
      let params = {
        id: this.recordId,
        qrCodeAddress: message,
      }
      const { success, returnMessage } = await editLetter(params)
      if (!success) {
        this.$message.warning(returnMessage)
        return
      }
      this.getStatistics()
    },
  },
}
</script>
<style lang="less" scoped>
.invitation-mangage {
  .top-title {
    margin-bottom: 16px;
    font-size: 18px;
    font-weight: 500;
    text-align: left;
    color: rgba(0, 0, 0, 0.85);
    line-height: 20px;
    padding: 8px 0;
  }
  .invitation-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .right-border {
      flex: 1;
      border-right: 1px solid #d9d9d9;
      margin-right: 24px;
    }
    .count {
      font-size: 32px;
      font-weight: 600;
      text-align: left;
      color: #1890ff;
      line-height: 32px;
      margin-bottom: 16px;
    }
    .text {
      font-size: 20px;
      font-weight: 400;
      text-align: left;
      color: #8c8c8c;
      line-height: 20px;
    }
  }
  .new,
  .btn {
    margin-top: 24px;
  }
}
// 弹框内容
.modal-content {
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
  }
  .text {
    font-size: 13px;
    font-weight: 400;
    text-align: center;
    color: #8c8c8c;
    line-height: 22px;
    span {
      color: #ff6d6f;
    }
  }
}
</style>
