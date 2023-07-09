<template>
  <div>
    <a-alert message="请认真填写信息。" banner />
    <a-form :form="form">
      <a-card title="消防新闻基本信息">
        <a-row type="flex" justify="space-between" align="top">
          <a-col :span="11">
            <a-form-item label="消防新闻标题名称">
              <a-input placeholder="请输入"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="新闻类别">
              <a-select placeholder="请选择">
                <a-select-option value="jack"> Jack </a-select-option>
                <a-select-option value="lucy"> Lucy </a-select-option>
                <a-select-option value="disabled" disabled> Disabled </a-select-option>
                <a-select-option value="Yiminghe"> yiminghe </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="发布单位">
              <a-select placeholder="请选择">
                <a-select-option value="jack"> Jack </a-select-option>
                <a-select-option value="lucy"> Lucy </a-select-option>
                <a-select-option value="disabled" disabled> Disabled </a-select-option>
                <a-select-option value="Yiminghe"> yiminghe </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="新闻发布人">
              <a-input placeholder="请输入"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card title="消防新闻正文">
        <j-editor  />
      </a-card>
    </a-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: this.$form.createForm(this, { name: 'coordinated' }),
    }
  },
}
</script>

<style lang="less" scoped>
.ant-card{
    margin-bottom: 10px;
}
</style>