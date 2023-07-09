<template>
  <div>
    <a-modal v-on="$listeners" :visible="visible" @cancel="handleCancel" @ok="hanldeOk" width="50%" title="审核">
      <a-alert message="审核结果为通过时意见选填，审核结果为驳回时意见必填，请注意选择！" banner />
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
        <a-form-item label="审核结果">
          <a-radio-group v-decorator="['status', validatorRules.status]" @change="handleOpinionRequired($event)">
            <a-radio :value="adoptValue"> 通过 </a-radio>
            <a-radio :value="rejectValue"> 驳回 </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="审核意见">
          <a-textarea
            v-decorator="['auditContent', validatorRules.auditContent]"
            placeholder="请输入5000字以内的文字"
            :rows="5"
          ></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    adoptValue: {
      type: String,
      default: false,
    },
    rejectValue: {
      type: String,
      default: false,
    },
  },
  data() {
    return {
      form: this.$form.createForm(this, { name: 'coordinated' }),
      validatorRules: {
        status: { initialValue: '', rules: [{ required: true, message: '审核结果不能为空' }] },
        auditContent: { rules: [{ required: true, message: '审核意见不能为空' }] },
      },
    }
  },

  methods: {
    //关闭并更新父组件的属性
    handleCancel() {
      this.close()
    },
    hanldeOk() {
      this.close()
    },
    close() {
      this.$emit('update:visible', false)
    },
    // 审核结果为通过时审核意见非必填
    handleOpinionRequired(e) {
      this.validatorRules.auditContent.rules[0].required = e.target.value === '3'
    },

    validateFields() {
      return this.form.validateFields()
    },
    // 重置表单
    resetForm() {
      this.form.resetFields()
    },
  },
}
</script>

<style lang="less" scoped>
.ant-alert {
  background: #fffbe6;
  border: 1px solid #ffe58f;
  border-radius: 2px;
}
</style>



 