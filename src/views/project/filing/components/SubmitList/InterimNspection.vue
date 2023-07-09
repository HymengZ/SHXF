<template>
  <div>
    <a-form :form="form">
      <!-- <a-card title="中期检查录入节点信息">
        <a-row type="flex" justify="space-between" align="top">
          <a-col :span="11">
            <a-form-item label="节点名称">
              <a-input disabled placeholder="请输入"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="发布单位">
              <a-input disabled placeholder="请输入"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="项目发布人">
              <a-input disabled placeholder="请输入"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="开始提交时间">
              <a-input disabled placeholder="请输入"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="上传截止时间">
              <a-input disabled placeholder="请输入"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card> -->
      <a-card title="中期检查信息">
        <a-form-item label="说明">
          <a-textarea
            :disabled="ifDisabled"
            v-decorator="['inspectExplain']"
            placeholder="请输入5000字以内的文字"
          ></a-textarea>
        </a-form-item>
        <a-form-item label="中期检查报告（附件类型pdf，附件大小不超过3M，只需上传1份。）">
          <uploadFile
            @fileListChange="contract"
            :fileList="inspectFile"
            :amount="1"
            :isLt1M="3"
            :typeList="['pdf']"
            :ifDisabled="ifDisabled"
          ></uploadFile>
        </a-form-item>
      </a-card>
    </a-form>
  </div>
</template>

<script>
import pick from 'lodash.pick'
import uploadFile from '../uploadFile/index.vue'
export default {
  data() {
    return {
      form: this.$form.createForm(this, { name: 'coordinated' }),
      validatorRules: {
        inspectExplain: { rules: [{ required: true, message: '	中期检查信息说明不能为空' }] },
      },
      inspectFile: [],
      params: {},
      finish:false,
      ifDisabled: this.infoList.hasInspect === 0,
    }
  },
  components: {
    uploadFile,
  },
  props: {
    infoList: {
      type: Object,
      default: {},
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
    handleIfDisabled(hasInspect) {
      this.ifDisabled = hasInspect === 0;
    },
    //保存
    handleOk() {
      this.form.validateFields((err) => {
        if (!err) {
          let params
          let obj
          params = this.form.getFieldsValue()
          if (this.inspectFile.length > 0) {
            if (this.inspectFile[0].response) {
              obj = {
                inspectReportName: this.inspectFile[0].name,
                inspectReportUrl: this.inspectFile[0].response.message,
              }
            } else {
              obj = {
                inspectReportName: this.inspectFile[0].name,
                inspectReportUrl: this.inspectFile[0].url,
              }
            }
          }
          params = Object.assign(params, obj)
          this.params = params
          this.finish = true
        }
      })
    },
    //关闭弹框
    handleCancel() {
      this.form.resetFields()
    },
    //详情
    info() {
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.infoList, 'inspectExplain', 'hasInspect'))
        console.log("form",this.form)
        // let inspectFile = []
        if (this.infoList.inspectReportName && this.infoList.inspectReportUrl) {
          let obj = {
            uid: Date.now(),
            name: this.infoList.inspectReportName,
            url: this.infoList.inspectReportUrl,
            status: 'done',
          }
          this.inspectFile.push(obj)
        }
      })
    },
    //上传检查报告
    contract(e) {
      this.inspectFile = e
    },
  },
}
</script>

<style lang="less" scoped>
/deep/ .ant-card{
  .ant-card-head{
    background: #fafafa;
  }
}
</style>