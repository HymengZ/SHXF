<template>
  <div>
    <a-alert message="审核结果为通过时意见选填，审核结果为驳回时意见必填，请注意选择！" banner />
    <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
      <a-form-item label="审核结果">
        <a-radio-group v-decorator="['operate', validatorRules.operate]" @change="handleOpinionRequired($event)">
          <a-radio value="pass"> 通过 </a-radio>
          <a-radio value="reject"> 驳回 </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="审核意见">
        <a-textarea v-decorator="['opinion', validatorRules.opinion]" placeholder="请输入5000字以内的文字"></a-textarea>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: this.$form.createForm(this, { name: 'coordinated' }),
      validatorRules: {
        operate: { initialValue: '', rules: [{ required: true, message: '审核结果不能为空' }] },
        opinion: { initialValue: '', rules: [{ required: true, message: '审核意见不能为空' }] },
      },
    }
  },
  methods: {
     handleOpinionRequired(e) {
      this.validatorRules.opinion.rules[0].required = e.target.value === 'reject'
    },
    validateFields() {
      return this.form.validateFields()
    },
    setFieldsValue(data) {
      this.form.setFieldsValue(data)
    },
  },
}
</script>

<style>
</style>