<template>
  <div class="performance-evaluate">
    <div class="tips">
      <a-alert banner>
        <div slot="message" class="message">
          1、绩效评价管理员审核通过后整个项目将验收完成，验收完成后将无法进行项目终止或者项目信息修改；
          <br />
          2、根据您在项目信息录入时填写的的绩效评价截止时间，录入截止时间为
          <span>{{ formatDay(enterTime) }}</span
          >，请按时提交 ；
          <br />
          3、*为必填项，项目汇总说明和项目验收材料非必填，可为空。
        </div>
      </a-alert>
    </div>
    <a-form :form="form">
      <a-card class="opinion" title="绩效评价意见/专家意见">
        <a-form-item
          label="仅支持文档类型pdf，大小不超过50M，只需要上传1份。"
          :help="evaluateHelp"
          :validateStatus="evaluateValidateStatus"
        >
          <uploadFile
            ref="opinion"
            uploadType="绩效评价意见"
            :amount="1"
            :isLt1M="50"
            :typeList="'pdf'"
            :contentId="editData.evaluation.id"
            :attachment="opinionList"
            @fileChange="evaluateFileChange"
            v-decorator="['evaluateUploadFile', validatorRules.evaluateUploadFile]"
          >
          </uploadFile>
        </a-form-item>
      </a-card>
      <a-card class="material" title="验收完成其他材料">
        <p class="material-text">仅支持文档类型pdf、doc、xls、wpd，大小不超过30M，最多上传5份。</p>
        <uploadFile
          ref="material"
          uploadType="验收完成其他材料"
          :amount="5"
          :isLt1M="30"
          :typeList="'pdf, doc, xls, wpd'"
          :contentId="editData.evaluation.id"
          :attachment="materialList"
        >
        </uploadFile>
      </a-card>
      <a-card class="explain" title="项目验收说明">
        <a-form-item label="项目取得的主要成果及效益">
          <a-textarea
            v-decorator="['mainAchievement']"
            placeholder="请输入5000字以内的文字"
            :rows="5"
            allowClear
          ></a-textarea>
        </a-form-item>
        <a-form-item label="项目验收说明">
          <a-textarea
            v-decorator="['acceptanceSpecification']"
            placeholder="请输入5000字以内的文字"
            :rows="5"
            allowClear
          ></a-textarea>
        </a-form-item>
      </a-card>
    </a-form>
  </div>
</template>
<script>
import { formatDay } from '@/utils/formatDate'
import uploadFile from '../uploadFile'
import { getAction } from '@/api/manage.js'
import moment from 'moment'
export default {
  props: {
    // 编辑数据
    editData: {
      type: Object,
      default: '',
      required: false,
    },
  },
  components: {
    uploadFile,
  },
  data() {
    return {
      // 自定义校验规则
      evaluateHelp: '',
      evaluateValidateStatus: '',
      form: this.$form.createForm(this),
      validatorRules: {
        evaluateUploadFile: {
          rules: [
            { required: true, message: '请上传附件' },
            {
              validator: this.fileValidate,
            },
          ],
        },
      },
      // 验收的附件
      opinionList: [],
      // 材料的附件
      materialList: [],

      // 查询附件
      url: { attachment: '/fire/projectReport/select/attachment/' },
    }
  },
  computed: {
    enterTime() {
      let date = new Date(this.editData.performanceEndTime)

      return moment(date).format('YYYY-MM-DD HH:mm')
    },
  },
  created() {
    this.showData()
  },
  methods: {
    formatDay,
    fileValidate(rule, value, callBack) {
      if (value === 'error') {
        callBack('请上传文件')
      } else {
        callBack()
      }
    },
    evaluateFileChange(length) {
      if (length === 0) {
        this.evaluateValidateStatus = 'error'
        this.evaluateHelp = '请上传文件'
        this.form.setFieldsValue({ evaluateUploadFile: 'error' })
      } else {
        this.evaluateValidateStatus = 'success'
        this.evaluateHelp = ''
        this.form.setFieldsValue({ evaluateUploadFile: 'success' })
      }
    },
    showData() {
      this.form.resetFields()
      this.opinionList = []
      this.materialList = []
      this.$nextTick(() => {
        this.form.setFieldsValue({
          mainAchievement: this.editData.evaluation.mainAchievement,
          acceptanceSpecification: this.editData.evaluation.acceptanceSpecification,
        })
      })
      // 获取附件
      getAction(this.url.attachment + this.editData.evaluation.id).then((res) => {
        console.log('resfdasf', res)
        if (res.success) {
          let attachmentList = res.result
          for (let item of attachmentList) {
            let attachmentListObj = {
              id: item.id,
              uid: item.id,
              name: item.fileName + '.' + item.fileSuffix,
              uploadType: item.uploadType,
            }
            if (attachmentListObj.uploadType == '验收完成其他材料') {
              this.materialList.push(attachmentListObj)
            } else if (attachmentListObj.uploadType == '绩效评价意见') {
              this.opinionList.push(attachmentListObj)
            }
          }
        } else {
          this.$message.warning(res.message || '查询附件失败')
        }
      })
    },
    // 绩效评价表单信息
    performanceEvaluateForm() {
      // 上传附件
      this.$refs.opinion.handleSubmit()
      this.$refs.material.handleSubmit()
      // 表单
      return this.form.validateFields()
    },
  },
}
</script>
<style lang="less" scoped>
.performance-evaluate {
  .tips {
    .ant-alert {
      background: #fffbe6;
      border: 1px solid #ffe58f;
      border-radius: 2px;
      .message {
        font-size: 14px;
        font-weight: 400;
        text-align: left;
        color: rgba(0, 0, 0, 0.65);
        line-height: 20px;
        // 录入时间
        span {
          color: #ff6e6c;
        }
      }
    }
  }
  .opinion,
  .material,
  .explain {
    margin-top: 16px;
    /deep/ .ant-card-head {
      background: #fafafa;
    }
  }
}
</style>
