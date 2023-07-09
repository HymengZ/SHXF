<template>
  <div>
    <a-form :form="form">
      <!-- <a-card title="绩效评价录入节点信息">
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
      <a-card title="绩效评价信息">
        <a-form-item label="说明">
          <a-textarea
            v-decorator="['evaluateExplain']"
            placeholder="请输入5000字以内的文字"
          ></a-textarea>
        </a-form-item>
        <a-form-item label="绩效自评价报告（附件类型pdf，附件大小不超过3M，只需上传1份。）">
          <uploadFile
            @fileListChange="contract"
            :fileList="explainFile"
            :amount="1"
            :isLt1M="3"
            :typeList="['pdf']"
          ></uploadFile>
        </a-form-item>
        <a-form-item label="项目验收材料（附件类型pdf，附件大小不超过3M，不限个数。）">
          <uploadFile @fileListChange="accept" :fileList="acceptFiles" :isLt1M="3" :typeList="['pdf']"></uploadFile>
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
      finish: false,
      form: this.$form.createForm(this, { name: 'coordinated' }),
      id: '',
      validatorRules: {
        evaluateExplain: { rules: [{ required: true, message: '绩效评价说明不能为空' }] },
      },
      explainFile: [],
      acceptFiles: [],
      url: {
        add: '/fire/projectReport/add',
        edit: '/fire/projectReport/edit',
      },
      params: {},
    }
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
  },
  components: {
    uploadFile,
  },
  methods: {
    //详情
    info() {
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.infoList, 'evaluateExplain'))
        if (this.infoList.explainReportName) {
          let obj = {
            uid: Date.now(),
            name: this.infoList.explainReportName,
            url: this.infoList.explainReportUrl,
            status: 'done',
          }
          this.explainFile.push(obj)
        }
        let acceptFiles = []
        for (const i of this.infoList.acceptFiles) {
          let obj = {
            id: i.id,
            uid: i.id,
            name: i.fileName,
            url: i.fileUrl,
            status: 'done',
          }
          acceptFiles.push(obj)
        }
        this.acceptFiles = acceptFiles
      })
    },
    //保存
    handleOk() {
      this.form.validateFields((err) => {
        if (!err) {
          let params
          let obj
          params = this.form.getFieldsValue()
          if (this.explainFile.length > 0) {
            if (this.explainFile[0].response) {
              obj = {
                // id: i.id,
                explainReportName: this.explainFile[0].name,
                explainReportUrl: this.explainFile[0].response.message,
              }
            } else {
              obj = {
                // id: '',
                explainReportName: this.explainFile[0].name,
                explainReportUrl: this.explainFile[0].url,
              }
            }
          }
          let acceptFiles = this.acceptFiles.concat()
          let acceptArr = []
          for (const i of acceptFiles) {
            let obj = {}
            if (i.id) {
              obj = {
                id: i.id,
                fileName: i.name,
                fileUrl: i.url,
              }
            } else {
              obj = {
                id: '',
                fileName: i.name,
                fileUrl: i.response.message,
              }
            }
            acceptArr.push(obj)
          }
          params = Object.assign(params, obj, { acceptFiles: acceptArr })
          this.params = params
          this.finish = true
        }
      })
    },
    //关闭弹框
    handleCancel() {
      this.form.resetFields()
    },
    //上传检查报告
    contract(e) {
      this.explainFile = e
    },
    //项目验收材料附件
    accept(e) {
      this.acceptFiles = e
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