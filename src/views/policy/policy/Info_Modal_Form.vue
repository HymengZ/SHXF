<template>
  <div>
    <a-alert style="margin-bottom:20px" message="请认真填写信息。" banner />
    <a-form :form="form">
      <a-card title="消防政策标题名称">
        <a-row type="flex" justify="space-between" align="top">
          <a-col :span="11">
            <a-form-item label="消防政策标题名称">
              <a-input placeholder="请输入" allowClear v-decorator="['title', validatorRules.title]"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="发布单位">
              <a-select placeholder="请选择" allowClear v-decorator="['publishUnit', validatorRules.publishUnit]">
                <a-select-option value="总队火调处"> 总队火调处 </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="发布时间">
              <a-date-picker
                show-time
                v-decorator="['publishTime', validatorRules.publishTime]"
                style="width: 100%"
                @change="onChange"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card title="消防政策正文">
        <j-editor v-model="content" />
      </a-card>
      <div class="footBtn">
        <a-button type="text" @click="handleCancel" style="margin-right: 8px">取消</a-button>
        <a-button type="primary" @click="handleOk">保存并发布</a-button>
      </div>
    </a-form>
  </div>
</template>

<script>
import pick from 'lodash.pick'
import { getAction, postAction } from '@/api/manage.js'
export default {
  data() {
    return {
      form: this.$form.createForm(this, { name: 'coordinated' }),
      content: '',
      validatorRules: {
        publishUnit: { rules: [{ required: true, message: '发布单位不能为空' }] },
        title: { rules: [{ required: true, message: '指南名称不能为空' }] },
        publishTime: { rules: [{ required: true, message: '发布时间不能为空' }] },
      },
      url: {
        add: '/fire/controlPolicy/add',
        edit: '/fire/controlPolicy/edit',
      },
    }
  },
  props: {
    infoList: {
      type: Object,
      default: () => {},
      required: false,
    },
    type: {
      type: String,
      default: '',
      required: false,
    },
    id: {
      type: String,
      default: '',
      required: false,
    },
  },
  methods: {
    onChange(e, a) {
      console.log(a)
      this.form.setFieldsValue({ publishTime: a })
    },
    //添加/详情弹框确定按钮
    handleOk() {
      console.log(this.content)
      this.form.validateFields((err) => {
        if (!err) {
          let params
          let url
          if (this.type === 'add') {
            params = Object.assign({}, this.form.getFieldsValue(), { content: this.content })
            url = this.url.add
          } else {
            params = Object.assign({}, this.form.getFieldsValue(), { content: this.content }, { id: this.id })
            url = this.url.edit
          }
          if (params.publishTime && typeof params.publishTime != 'string') {
            params.publishTime = params.publishTime.format('YYYY-MM-DD HH:mm:ss')
          }
          postAction(url, params).then((res) => {
            if (res.success) {
              this.$message.success(res.message)
              this.$emit('ok')
            } else {
              this.$message.warning(res.message)
            }
          })
        }
      })
    },
    //详情
    info() {
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.infoList, 'title', 'publishUnit', 'publishTime'))
        this.content = this.infoList.content
      })
    },
    //关闭弹框
    handleCancel() {
      this.form.resetFields()
      this.$emit('cancel')
    },
  },
}
</script>

<style lang="less" scoped>
/deep/ .ant-card {
  margin-bottom: 10px;
  .ant-card-head{
    background: #fafafa;
  }
}
.footBtn {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}
</style>