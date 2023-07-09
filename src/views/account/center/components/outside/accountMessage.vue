<template>
  <div class="account-message">
    <top-message ref="top" :userInfo="userInfo">
      <div slot="other">邀请单位：</div>
      <div slot="speed" class="speed">
        <div class="blod-text">
          账号完善度：<span
            :class="applyStatus == '0' ? 'incomplete' : 'finish'"
            v-text="applyStatus == '0' ? '60%' : '100%'"
          ></span>
        </div>
        <div class="text">账号注册：<img src="~@/assets/icon_已完成.png" /></div>
        <div class="text">
          单位信息：<img v-if="applyStatus == '0'" src="~@/assets/icon_未完成.png" /><img
            v-else
            src="~@/assets/icon_已完成.png"
          />
        </div>
        <div class="text">
          科技资源：<img v-if="applyStatus == '1'" src="~@/assets/icon_未完成.png" /><img
            v-else
            src="~@/assets/icon_已完成.png"
          />
        </div>
      </div>
    </top-message>
    <a-card title="单位信息" class="card">
      <div class="message">
        <div class="logo">
          <img :src="logoUrl" alt="avatar" style="width: 120px; height: 120px; display: block; border-radius: 60px" />
        </div>
        <div class="info">
          <div class="info-title">{{ userUnit.name }}</div>
          <div class="info-detials">
            <div class="text">单位证明类型：{{ userUnit.certifyType }}</div>
            <div class="btn-row">
              <div class="text">统一社会信用代码：{{ userUnit.creditCodes }}</div>
              <div class="actions">
                <a-button class="btn" icon="download" @click="handleDownload">单位证明文件</a-button>
                <a-button class="btn" icon="setting" @click="handleModifyUnit">单位信息修改</a-button>
              </div>
            </div>
            <div class="text">单位地址：{{ userUnit.address | formatTrim }}</div>
          </div>
        </div>
      </div>
    </a-card>
    <a-card title="个人信息" class="card">
      <a-form-model ref="form" layout="horizontal" :model="model" :rules="validatorRules" :colon="false">
        <a-row type="flex" justify="space-between" align="top">
          <a-col :span="11"
            ><a-form-model-item label="真实姓名" prop="realname"
              ><a-input v-model="model.realname" size="large"> </a-input> </a-form-model-item
          ></a-col>
          <a-col :span="11"
            ><a-form-model-item label="性别" prop="sex">
              <a-radio-group v-model="model.sex">
                <a-radio :value="1">男</a-radio>
                <a-radio :value="2">女</a-radio>
              </a-radio-group>
            </a-form-model-item></a-col
          >
          <a-col :span="11">
            <a-form-model-item prop="certType" label="证件类型">
              <a-select v-model="model.certType" placeholder="请选择" size="large" disabled>
                <a-select-option value="IDcard"> 身份证 </a-select-option>
              </a-select>
            </a-form-model-item></a-col
          >
          <a-col :span="11">
            <a-form-model-item prop="certCode" label="证件号码">
              <a-input v-model="model.certCode" size="large" placeholder="请输入18位身份证号"> </a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="11">
            <a-form-model-item prop="post" label="职务">
              <a-input v-model="model.post" size="large" type="text" placeholder="请输入职务"> </a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="11">
            <a-form-model-item prop="jobTitle" label="职称">
              <a-select v-model="model.jobTitle" placeholder="请选择" size="large">
                <a-select-option v-for="(item, index) in jobTitleList" :key="index" :value="item.itemValue">
                  {{ item.itemText }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="11">
            <a-form-model-item prop="email" label="电子邮箱">
              <a-input v-model="model.email" size="large" type="text" placeholder="请输入电子邮箱"> </a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-card>
    <div class="action">
      <a-button type="primary" @click="handleSubmit">保存并提交</a-button>
    </div>
    <j-modal
      title="单位信息修改"
      :visible="visible"
      switchFullscreen
      :fullscreen="true"
      @cancel="handleCancel"
      class="j-modal"
      @ok="handleOk"
      okText="保存并提交"
    >
      <unit-message-modal ref="unitModal" :userUnit="userUnit" @close="handleCancel" v-on="$listeners" />
    </j-modal>
  </div>
</template>
<script>
import { emailCheck } from '@/utils/validate'
import { getAction } from '@/api/manage'
import TopMessage from '../TopMessage'
import UnitMessageModal from './unitMessageModal'
import { downloadPic } from '@/utils/downloadFile'
export default {
  components: {
    TopMessage,
    UnitMessageModal,
  },
  props: {
    // 用户信息
    userInfo: {
      type: Object,
      default: () => {},
    },
    // 用户单位
    userUnit: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      visible: false,
      jobTitleList: [],
      model: {
        realname: '',
        sex: '',
        certType: 'IDcard',
        certCode: '',
        post: '',
        jobTitle: undefined,
        email: '',
      },
      validatorRules: {
        realname: [{ required: true, message: '真实姓名不能为空!' }],
        sex: [{ required: true, message: '请选择性别!' }],
        certCode: [
          {
            pattern: /^([1-9]\d{5}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)/,
            message: '证件号码格式不正确',
          },
        ],
        email: [{ validator: emailCheck }],
      },
      url: {
        listByDictCode: '/sys/dictItem/listByDictCode',
      },
    }
  },
  filters: {
    formatTrim(e) {
      return e.replace(/-/g, '')
    },
  },
  computed: {
    applyStatus() {
      return this.userUnit.applyStatus
    },
    logoUrl() {
      return this.baseDomain + this.userUnit.logo
    },
    baseDomain() {
      return process.env.VUE_APP_API_BASE_URL + '/'
    },
  },
  created() {
    this.getSelectList()
  },
  mounted() {
    this.showUserData(this.userInfo)
  },
  methods: {
    showUserData(data) {
      this.model = {}
      this.$set(this.model, 'realname', data.realname)
      this.$set(this.model, 'sex', data.sex)
      this.$set(this.model, 'certType', data.certType)
      this.$set(this.model, 'certCode', data.certCode)
      this.$set(this.model, 'post', data.post)
      this.$set(this.model, 'jobTitle', data.jobTitle)
      this.$set(this.model, 'email', data.email)
    },
    async getSelectList() {
      const commnUrl = this.url.listByDictCode
      // 职称
      await getAction(commnUrl, { dictCode: 'work_title' }).then((res) => {
        const { result, success } = res
        if (success) {
          this.jobTitleList = result
        } else {
          this.$message.warning(res.message || '职称查询失败')
        }
      })
    },
    // 单位证明文件
    handleDownload() {
      let fileUrl = this.userUnit.file
      // 后续需要加上文件名
      downloadPic(fileUrl, '单位证明文件.png')
    },
    // 提交个人信息
    async handleSubmit() {
      let that = this
      that.$refs['form'].validate((success) => {
        if (success) {
          let avatarUrl = that.$refs.top.getImageUrl()
          let data = Object.assign({ id: that.userInfo.id, avatar: avatarUrl, ...that.model })
          // 更新个人信息
          this.$emit('update', data)
        }
      })
    },
    // 单位信息修改
    handleModifyUnit() {
      this.visible = true
    },
    // 提交单位信息
    handleOk() {
      this.$refs.unitModal.handleSubmit()
    },
    handleCancel() {
      this.visible = false
    },
  },
}
</script>
<style lang="less" scoped>
.account-message {
  .speed {
    margin-top: 10px;
    .blod-text {
      font-size: 16px;
      font-family: PingFang SC, PingFang SC-Semibold;
      font-weight: 600;
      text-align: right;
      color: #595959;
      line-height: 32px;
      margin-bottom: 10px;
      .finish {
        color: #52c41a;
        font-size: 28px;
      }
      .incomplete {
        color: #faad14;
        font-size: 28px;
      }
    }
    .text {
      font-size: 14px;
      font-family: PingFang SC, PingFang SC-Regular;
      font-weight: 400;
      text-align: right;
      color: #bfbfbf;
      line-height: 14px;
      margin-bottom: 5px;
    }
  }
  .card {
    margin-top: 24px;
    /deep/ .ant-card-head {
      background: #fafafa;
    }
    .message {
      display: flex;
      .logo {
        margin-right: 20px;
      }
      .info {
        flex: 1;
        .info-title {
          font-size: 20px;
          font-weight: 500;
          color: #262626;
          line-height: 20px;
          margin-bottom: 20px;
        }
        .info-detials {
          font-size: 14px;
          font-weight: 400;
          color: #595959;
          line-height: 20px;
          .text {
            margin-bottom: 3px;
          }
          .btn-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .btn {
              margin-left: 8px;
            }
          }
        }
      }
    }
  }
  .action {
    margin-top: 24px;
  }
}
</style>
