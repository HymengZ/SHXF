<template>
  <div>
    <a-alert message="节点报告配置完成后，科技需求方提交后，可在孵化记录中查看。" style="margin: 8px 24px" banner />
    <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
      <a-form-item label="节点名称">
        <a-input v-decorator="['noteName', validatorRules.noteName]" placeholder="请输入" ></a-input>
      </a-form-item>
      <a-form-item label="发布单位">
        <a-input v-decorator="['unitId', validatorRules.unitId]" placeholder="自动读取" disabled></a-input>
      </a-form-item>
      <a-form-item label="需求发布人">
        <a-input v-decorator="['userId', validatorRules.userId]" placeholder="自动读取" disabled></a-input>
      </a-form-item>
      <a-form-item label="开始提交时间">
        <a-date-picker
          v-decorator="['submitStartTime', validatorRules.submitStartTime]"
          style="display: block"
          placeholder="选择时间"
        />
      </a-form-item>
      <a-form-item label="上传截止时间">
        <a-date-picker
          v-decorator="['uploadEndTime', validatorRules.uploadEndTime]"
          style="display: block"
          placeholder="选择时间"
        />
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
        noteName: { rules: [{ required: true, message: '请输入节点名称' }] },
        unitId: {
          initialValue: this.$store.state.user.info.departName,
          rules: [{ required: true, message: '请输入节点名称' }],
        },
        userId: {
          initialValue: this.$store.state.user.info.realname,
          rules: [{ required: true, message: '请输入节点名称' }],
        },
        submitStartTime: { rules: [{ required: true, message: '请输入开始提交时间' }] },
        uploadEndTime: { rules: [{ required: true, message: '请输入上传截止时间' }] },
      },
    }
  },
  methods: {
    onChange(e) {
      console.log(e)
    },
    validateFields() {
      return this.form.validateFields()
    },
    setFieldsValue(data) {
      this.form.validateFields(data)
    },
  },
}
</script>

<style>
</style>