<template>
  <div class="account-message">
    <top-message ref="top" :userInfo="userInfo">
      <div slot="other">用户类型：</div>
    </top-message>
    <a-card title="单位信息" class="card">
      <div class="message">
        <div class="info">
          <div class="info-title">{{ userUnit.name }}</div>
          <div class="info-detials">
            <div class="text">单位详细地址：{{ userUnit.address }}</div>
            <div class="text">单位联系人：</div>
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
              <a-select v-model="model.certType" placeholder="请选择" size="large">
                <a-select-option v-for="(item, index) in certTypeList" :key="index" :value="item.itemValue">
                  {{ item.itemText }}
                </a-select-option>
              </a-select>
            </a-form-model-item></a-col
          >
          <a-col :span="11">
            <a-form-model-item prop="certCode" label="证件号码">
              <a-input v-model="model.certCode" size="large" placeholder="请输入证件号码"> </a-input>
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
  </div>
</template>
<script>
import { emailCheck } from '@/utils/validate'
import { getAction } from '@/api/manage'
import TopMessage from '../TopMessage'
export default {
  components: {
    TopMessage,
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
      certTypeList: [],
      jobTitleList: [],
      model: {
        realname: '',
        sex: '',
        certType: '',
        certCode: '',
        post: '',
        jobTitle: undefined,
        email: '',
      },
      validatorRules: {
        realname: [{ required: true, message: '真实姓名不能为空!' }],
        sex: [{ required: true, message: '请选择性别!' }],
        certType: [{ required: true, message: '请选择证件类型!' }],
        certCode: [{ required: true, message: '证件号码不能为空!' }],
        email: [{ validator: emailCheck }],
      },
      url: {
        listByDictCode: '/sys/dictItem/listByDictCode',
      },
    }
  },
  created() {
    this.getSelectList()
  },
  mounted() {
    this.showUserData(this.userInfo)
  },
  methods: {
    // 展示数据
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
      await getAction(commnUrl, { dictCode: 'cert_type' }).then((res) => {
        const { result, success } = res
        if (success) {
          this.certTypeList = result
        } else {
          this.$message.warning(res.message || '证件类型查询失败')
        }
      })
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
  },
}
</script>
<style lang="less" scoped>
.account-message {
  .speed {
    margin-top: 18px;
    .blod-text {
      font-size: 15px;
      font-family: PingFang SC, PingFang SC-Semibold;
      font-weight: 600;
      text-align: right;
      color: #595959;
      line-height: 32px;
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
        }
      }
    }
  }
  .action {
    margin-top: 24px;
  }
}
</style>
