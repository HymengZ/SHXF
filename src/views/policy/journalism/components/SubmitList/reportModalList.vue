<template>
  <div>
    <a-alert style="margin-bottom:20px" message="请认真填写信息。" banner />
    <a-form :form="form">
      <a-card title="消防新闻基本信息">
        <a-row type="flex" justify="space-between" align="top">
          <a-col :span="11">
            <a-form-item label="消防新闻标题名称">
              <a-input placeholder="请输入" allowClear v-decorator="['title', validatorRules.title]"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="新闻类别">
              <a-select placeholder="请选择" allowClear v-decorator="['type', validatorRules.type]">
                <a-select-option :value="item.value" v-for="(item, index) in typeList" :key="index">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="发布单位">
              <a-select placeholder="请选择" allowClear v-decorator="['publishUnit', validatorRules.publishUnit]">
                <a-select-option value="业务处室"> 业务处室 </a-select-option>
                <a-select-option value="支队"> 支队 </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="新闻发布人">
              <a-input
                placeholder="请输入"
                allowClear
                v-decorator="['publishPerson', validatorRules.publishPerson]"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card title="消防新闻正文">
        <j-editor v-model="content" />
      </a-card>
      <div class="footBtn">
        <a-button type="text" @click="handleCancel" style="margin-right: 8px">取消</a-button>
        <a-button type="primary" @click="handleOk">保存</a-button>
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
        title: { rules: [{ required: true, message: '标题名称不能为空' }] },
        type: { rules: [{ required: true, message: '新闻类别不能为空' }] },
        publishUnit: { rules: [{ required: true, message: '发布单位不能为空' }] },
        publishPerson: { rules: [{ required: true, message: '新闻发布人不能为空' }] },
      },
      url: {
        add: '/fire/news/add',
        edit: '/fire/news/edit',
      },
    }
  },
  props: {
    typeList: {
      type: Array,
      default: [],
      required: false,
    },
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
    //保存
    handleOk() {
      this.form.validateFields((err) => {
        if (!err) {
          let params
          let url
          if (this.type == 'add') {
            params = Object.assign({}, this.form.getFieldsValue(), { content: this.content })
            url = this.url.add
          } else {
            params = Object.assign({}, this.form.getFieldsValue(), { content: this.content }, { id: this.id })
            url = this.url.edit
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
        this.form.setFieldsValue(pick(this.infoList, 'title', 'publishUnit', 'publishPerson', 'type'))
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