<template>
  <div class="modify-password">
    <div class="top-title">
      <span>修改密码</span>
    </div>
    <a-form-model ref="form" :model="model" :rules="validatorRules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item prop="oldPasswod" label="当前密码">
        <a-input v-model="model.oldPasswod" size="large" type="password" placeholder="请输入当前登录密码"> </a-input>
      </a-form-model-item>
      <a-form-model-item prop="password" label="新密码设置">
        <a-input
          v-model="model.password"
          size="large"
          type="password"
          autocomplete="new-password"
          placeholder="请输入数字+字母不少于8位数的密码"
        >
        </a-input>
      </a-form-model-item>
      <a-form-model-item prop="confirmPassword" label="确认密码">
        <a-input v-model="model.confirmPassword" size="large" type="password" placeholder="再次输入密码"> </a-input>
      </a-form-model-item>
    </a-form-model>
    <a-button type="primary" @click="handleOk">确定</a-button>
  </div>
</template>
<script>
import { changePassword } from '@/api/center/userInfo'
export default {
  props: {
    username: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      labelCol: { span: 24 },
      wrapperCol: { span: 10 },
      model: {
        oldPasswod: '',
        password: '',
        confirmPassword: '',
      },
      validatorRules: {
        oldPasswod: [{ required: true, message: '请输入当前密码' }],
        password: [{ required: true, message: '密码由8位数字+字母组成!!' }, { validator: this.handlePasswordRepeat }],
        confirmPassword: [{ required: true, message: '确认密码不能为空!' }, { validator: this.handlePasswordCheck }],
      },
    }
  },

  methods: {
    handlePasswordRepeat(rule, value, callback) {
      let oldPasswod = this.model['oldPasswod']
      if (value && oldPasswod && value.trim() == oldPasswod.trim()) {
        callback(new Error('新密码和当前密码一致'))
      }
      callback()
    },
    // 校验密码
    handlePasswordCheck(rule, value, callback) {
      let password = this.model['password']
      if (value && password && value.trim() !== password.trim()) {
        callback(new Error('两次密码不一致'))
      }
      callback()
    },
    async handleOk() {
      let that = this
      that.$refs['form'].validate(async (success) => {
        if (success) {
          let data = {
            username: that.username,
            oldPasswod: that.model.oldPasswod,
            password: that.model.password,
          }
          const { success, message } = await changePassword(data)
          if (!success) {
            this.$message.warning(message)
            return
          }
          this.model.oldPasswod = ''
          this.model.password = ''
          this.model.confirmPassword = ''
          this.$message.success(message || '修改密码成功')
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
.modify-password {
  .top-title {
    margin-bottom: 16px;
    font-size: 18px;
    font-weight: 500;
    text-align: left;
    color: rgba(0, 0, 0, 0.85);
    line-height: 20px;
    padding: 8px 0;
  }
}
</style>
