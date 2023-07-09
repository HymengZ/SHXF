<template>
  <a-form :form="form" :colon="false">
    <a-row type="flex" justify="space-between" align="middle">
      <a-col :span="11">
        <a-form-item label="真实姓名">
          <a-input v-decorator="['realname']" placeholder="请输入" />
        </a-form-item>
      </a-col>
      <a-col :span="11">
        <a-form-item label="手机号码">
          <a-input v-decorator="['phone']" placeholder="请输入" />
        </a-form-item>
      </a-col>
      <a-col :span="11">
        <a-form-item label="证件号码">
          <a-input v-decorator="['certCode']" placeholder="请输入" />
        </a-form-item>
      </a-col>
      <a-col style="margin-bottom: 24px; text-align: right" :span="11">
        <a-button @click="handleReset">重置</a-button>
        <a-button type="primary" style="margin-left: 8px" @click="handleSearch">查询</a-button>
      </a-col>
    </a-row>
  </a-form>
</template>
<script>
export default {
  data() {
    return {
      form: this.$form.createForm(this),
    }
  },
  methods: {
    //    重置
    handleReset() {
      this.form.resetFields()
      this.handleSearch()
    },
    handleSearch() {
      this.form.validateFields((error, values) => {
        if (!error) {
          this.$emit('search', values)
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
</style>
