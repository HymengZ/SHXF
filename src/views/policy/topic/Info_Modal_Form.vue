<template>
  <div>
    <a-alert style="margin-bottom:20px" message="请认真填写信息。" banner />
    <a-form :form="form">
      <a-card>
        <a-row type="flex" justify="space-between" align="top">
          <a-col :span="24">
            <a-form-item label="话题标题名称">
              <a-input v-decorator="['title', validatorRules.title]" placeholder="请输入"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="话题解释">
              <a-textarea
                v-decorator="['content', validatorRules.content]"
                :auto-size="{ minRows: 6 }"
                placeholder="请输入5000字以内的文字"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <div class="footBtn">
        <a-button type="text" @click="handleCancel" style="margin-right: 8px">取消</a-button>
        <a-button type="primary" @click="handleOk">保存并发布</a-button>
      </div>
    </a-form>
  </div>
</template>

<script>
import { getAction, postAction } from '@/api/manage.js'
import pick from 'lodash.pick'
export default {
  data() {
    return {
      form: this.$form.createForm(this, { name: 'coordinated' }),
      validatorRules: {
        title: { rules: [{ required: true, message: '话题标题名称不能为空' }] },
        content: { rules: [{ required: true, message: '话题正文不能为空' }] },
      },
      url: {
        add: '/fire/topic/add',
        edit:'/fire/topic/edit'
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
    id:{
      type:String,
      default: '',
      required: false,
    }
  },
  methods: {
    //添加/详情弹框确定按钮
    handleOk() {
      this.form.validateFields((err) => {
        if (!err) {
          let params
          let url
          if (this.type === 'add') {
            params = Object.assign({}, this.form.getFieldsValue())
            url = this.url.add
          }else{
            params = Object.assign({}, this.form.getFieldsValue(),{id:this.id})
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
        this.form.setFieldsValue(pick(this.infoList, 'title', 'content'))
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