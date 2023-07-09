<template>
  <div>
    <a-alert message="请认真填写信息。" style="margin-bottom: 20px" banner />
    <a-form :form="form">
      <a-card title="科技成果目录基本信息">
        <a-row type="flex" justify="space-between" align="top">
          <a-col :span="11">
            <a-form-item label="所属年度">
              <a-date-picker
                mode="year"
                :value="year"
                placeholder="请选择年份"
                format="YYYY"
                :open="yearShowOne"
                style="display: block"
                v-decorator="['catalogueYear', { rules: [{ required: true, message: '请输入所属年度' }] }]"
                @openChange="openChangeOne"
                @panelChange="panelChangeOne"
              />
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="发布单位">
              <a-input
                v-decorator="['publishUnitName', { rules: [{ required: true, message: '请输入发布单位' }] }]"
                placeholder="请输入"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="目录名称">
              <a-input
                v-decorator="['catalogueName', { rules: [{ required: true, message: '请输入目录名称' }] }]"
                placeholder="请输入"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="发布时间">
              <a-date-picker
                style="display: block; width: 100%"
                v-decorator="['publishTime', { rules: [{ required: true, message: '请输入发布时间' }] }]"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card title="科技成果目录正文">
        <a-form-item>
          <j-editor
            trigger-change
            v-decorator="['catalogueText', { rules: [{ required: true, message: '请输入科技成果目录正文' }] }]"
          />
        </a-form-item>
      </a-card>
    </a-form>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  components: {},
  data() {
    return {
      yearShowOne: false,
      year: moment(),
      form: this.$form.createForm(this, { name: 'catalogue' }),
    }
  },
  methods: {
    openChangeOne(status) {
      //status是打开或关闭的状态
      if (status) {
        this.yearShowOne = true
      } else {
        this.yearShowOne = false
      }
    },
    // 得到年份选择器的值
    panelChangeOne(value) {
      this.year = value
      this.yearShowOne = false
      this.form.setFieldsValue({
        catalogueYear: value.format('YYYY'),
      })
    },
    resetFields() {
      this.form.resetFields()
    },
    setFieldsValue(data) {
      console.log(data)
      setTimeout(() => {
        this.form.setFieldsValue(data)
      })
    },
    validateFields() {
      return this.form.validateFields()
    },
  },
}
</script>

<style lang="less" scoped >
// .a-card{
//   background:#cecece;
// }
/deep/ .ant-card {
  margin-bottom: 10px;
  .ant-card-head {
    background: #fafafa;
  }
}
</style>