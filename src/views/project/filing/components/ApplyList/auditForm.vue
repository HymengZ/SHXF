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
        <a-textarea placeholder="请输入5000字以内的文字" v-decorator="['opinion', validatorRules.opinion]"></a-textarea>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { postAction } from '@/api/manage.js'
export default {
  data() {
    return {
      form: this.$form.createForm(this, {name: 'coordinated'}),
      params: {},
      validatorRules: {
        operate: {
          initialValue: '',
          rules: [{required: true, message: '请选择审核结果'}]
        },
        opinion: {rules: [{required: false, message: '审核意见不能为空'}]},
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
    handleOpinionRequired(e) {
      this.validatorRules.opinion.rules[0].required = e.target.value === 'reject';
    },
    //提交
    submit() {
      this.form.validateFields((err) => {
        if (!err) {
          console.log(this.form.getFieldsValue())
          let params = Object.assign({}, this.form.getFieldsValue(), { id: this.id })
          const { operate, opinion } = this.form.getFieldsValue()
          const editParams = new FormData()
          editParams.append('operate', operate)
          editParams.append('opinion', opinion)
          editParams.append('id', this.id)
          postAction('/fire/projectReport/auditProjectReport', editParams).then((res) => {
            if (res.success) {
              this.$message.success(res.message)
              this.$emit('auditCancel')
              this.$emit('dataInfo')
            } else {
              this.$message.warning(res.message)
            }
          })
        }
      })
    },
    // //关闭弹框
    handleCancel() {
      this.form.resetFields()
    },
  },
}
</script>

<style>
</style>