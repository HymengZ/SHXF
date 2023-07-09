<template>
  <div>
    <a-alert message="审核结果为通过时意见选填，审核结果为驳回时意见必填，请注意选择！" banner />
    <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
      <a-form-item label="审核结果">
        <a-radio-group v-decorator="['state', validatorRules.state]">
          <a-radio :value="2"> 通过 </a-radio>
          <a-radio :value="3"> 驳回 </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="审核意见">
        <a-textarea
          v-decorator="['auditAdvice', validatorRules.auditAdvice]"
          placeholder="请输入5000字以内的文字"
        ></a-textarea>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { postAction } from '@/api/manage.js'
export default {
  data() {
    return {
      form: this.$form.createForm(this, { name: 'coordinated' }),
      validatorRules: {
        state: { rules: [{ required: true, message: '审核结果不能为空' }] },
        auditAdvice: { rules: [{ required: true, message: '审核意见不能为空' }] },
      },
    }
  },
  props: {
    id: {
      type: String,
      default: '',
      required: false,
    },
  },
  methods: {
    submit() {
      this.form.validateFields((err) => {
        if (!err) {
          let params = Object.assign({}, this.form.getFieldsValue(), { id: this.id })
          postAction('/fire/news/audit', params).then((res) => {
            if (res.success) {
              this.$message.success(res.message)
              this.$emit('auditCancel')
            } else {
              this.$message.warning(res.message)
            }
          })
        }
      })
    },
    auditCancel() {
      this.form.resetFields()
    },
  },
}
</script>

<style>
</style>