<template>
  <div>
    <a-alert banner>
      <div slot="message" class="message">
        1、联系人信息默认读取资源发布账号，如需修改可直接替换；<br />
        2、联系人请尽量使用已注册过本平台的人员信息，可通过手机号码快速搜索填充已有数据。
      </div>
    </a-alert>
    <a-form :form="form" :colon="false">
      <a-card title="资源联系人信息">
        <a-row type="flex" justify="space-between" align="top">
          <a-col :span="11">
            <a-form-item label="真实姓名">
              <a-input
                allowClear
                v-decorator="['contactName', validatorRules.contactName]"
                placeholder="请输入"
              ></a-input>
            </a-form-item>
          </a-col>

          <a-col :span="11">
            <a-form-item label="手机号码">
              <a-input
                allowClear
                v-decorator="['contactMobile', validatorRules.contactMobile]"
                placeholder="请输入"
                @change="searchInfo"
              >
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="职务">
              <a-input allowClear v-decorator="['jobObligation', validatorRules.jobObligation]" placeholder="请输入">
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="电子邮箱">
              <a-input allowClear v-decorator="['email', validatorRules.email]" placeholder="请输入"> </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="通信地址">
              <a-input allowClear v-decorator="['address']" placeholder="请输入"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
    </a-form>
  </div>
</template>
<script>
import { fetchUserInfoByPhone } from '@/api/project/achievement'
import pick from 'lodash.pick'
export default {
  props: {
    // 已新增的数据
    currentData: {
      type: Object,
      default: '',
      required: false,
    },
  },
  data() {
    return {
      form: this.$form.createForm(this),
      validatorRules: {
        contactName: { rules: [{ required: true, message: '真实姓名不能为空' }] },
        contactMobile: {
          rules: [
            { required: true, message: '手机号码不能为空' },
            { pattern: /^1[345789]\d{9}$/, message: '手机号格式不正确' },
          ],
        },

        jobObligation: { rules: [{ required: true, message: '职务不能为空' }] },
        email: {
          rules: [
            {
              pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
              message: '电子邮箱格式不正确',
            },
          ],
        },
      },
    }
  },
  computed: {
    // 资源用户信息
    info() {
      return this.$store.state.user.info
    },
  },
  mounted() {
    // 展示填写过的内容
    // 只有返回上一步才执行
    if (this.currentData.contactName) {
      this.showData()
    } else {
      // 新增自动获取项目联系人信息
      this.getContactsMessage()
    }
  },
  methods: {
    // 点击上一步时展示填写过的内容
    showData() {
      this.form.resetFields()
      console.log('this.currentData', this.currentData)
      let model = Object.assign({}, this.currentData)
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(model, 'contactName', 'contactMobile', 'jobObligation', 'email', 'address'))
      })
    },
    // 设置联系人信息
    setLinkMessage(info) {
      const model = Object.assign(
        {},
        { contactName: info.realname, contactMobile: info.phone, jobObligation: info.post, email: info.email }
      )
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(model, 'contactName', 'contactMobile', 'jobObligation', 'email'))
      })
    },
    // 新增自动获取项目联系人信息
    getContactsMessage() {
      this.setLinkMessage(this.info)
    },
    // 根据手机号码搜索联系人信息
    searchInfo() {
      this.$nextTick(async () => {
        if (this.form.getFieldError('contactMobile')) {
          return
        }
        let params = { phone: this.form.getFieldValue('contactMobile') }
        console.log('params', params)
        const { success, result, message } = await fetchUserInfoByPhone(params)
        if (!success) {
          this.$message.warning(message)
          return
        }
        if (result) {
          this.$message.success('已自动填充项目联系人信息')
          this.setLinkMessage(result)
        } else {
          this.$message.warning('当前联系人信息未在本平台注册')
        }
      })
    },
    // 表单校验和保存数据
    handleSubmit() {
      this.form.validateFields(async (err, values) => {
        if (!err) {
          let params = Object.assign({}, values, { id: this.currentData.id })
          this.$emit('addData', params)
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
// 提示
.ant-alert {
  margin-bottom: 16px;
  background: #fffbe6;
  border: 1px solid #ffe58f;
  border-radius: 2px;
  // 提示字体
  .message {
    font-size: 14px;
    font-weight: 400;
    text-align: left;
    color: rgba(0, 0, 0, 0.65);
    line-height: 20px;
  }
}
</style>
