<template>
  <div>
    <a-alert banner>
      <div slot="message" class="message">*为必填项，附件非必填，可为空。</div>
    </a-alert>
    <a-form :form="form" :colon="false">
      <a-card title="项目描述">
        <a-form-item label="实际参与人数">
          共：<a-input-number
            :precision="0"
            :min="0"
            disabled
            v-decorator="['total', validatorRules.total]"
          />人，其中：高级职称<a-input-number
            :precision="0"
            @change="countCalculation"
            v-decorator="['seniorPost', validatorRules.seniorPost]"
            :min="0"
          />人，中级职称<a-input-number
            :precision="0"
            @change="countCalculation"
            v-decorator="['middlePost', validatorRules.middlePost]"
            :min="0"
          />人，初级职称<a-input-number
            :precision="0"
            @change="countCalculation"
            v-decorator="['primaryPost', validatorRules.primaryPost]"
            :min="0"
          />
          人，其他
          <a-input-number
            :precision="0"
            @change="countCalculation"
            v-decorator="['other', validatorRules.other]"
            :min="0"
          />人。
        </a-form-item>

        <a-divider dashed />
        <a-form-item label="预期成果形式" :help="help" :validateStatus="validateStatus">
          <a-checkbox-group
            @change="checkBoxChange"
            class="checkbox"
            v-decorator="['expectAchieve', validatorRules.expectAchieve]"
            ><a-checkbox v-for="(item, index) in modalityList" :key="index" :value="item.itemValue">{{
              item.itemText
            }}</a-checkbox></a-checkbox-group
          >
          <a-input
            class="other"
            v-decorator="['expectAchieveStr', validatorRules.expectAchieveStr]"
            placeholder="请输入"
            allowClear
            style="width: 50%"
            @change="inputChange"
          ></a-input>
        </a-form-item>
        <a-divider dashed />
        <a-form-item label="项目情况">
          <a-textarea
            v-decorator="['projectSituation', validatorRules.projectSituation]"
            placeholder="请输入项目完成情况、考核指标完成情况、解决的技术关键、主要创新点等文字介绍，限1000字以内的文字"
            :rows="5"
          ></a-textarea>
        </a-form-item>
      </a-card>
      <a-card class="contract" title="项目合同">
        <a-form-item
          label="仅支持文档类型pdf、doc、xls、wpd，大小不超过100M，仅上传1份。"
          :help="contractHelp"
          :validateStatus="contractValidateStatus"
        >
          <uploadFile
            ref="contract"
            uploadType="项目合同"
            :contentId="describeData.id"
            :attachment="projectAttachment"
            :amount="1"
            :isLt1M="100"
            typeList="pdf,doc,xls,wpd"
            @fileChange="contractFileChange"
            v-decorator="['contractUploadFile', validatorRules.contractUploadFile]"
          >
          </uploadFile>
        </a-form-item>
      </a-card>

      <a-card class="enclosure" title="其他附件">
        <p class="contract-text">仅支持文档类型pdf、doc、xls、wpd，大小不超过30M，最多上传5份。</p>
        <uploadFile
          ref="otherEnclosure"
          uploadType="其他附件"
          :contentId="describeData.id"
          :attachment="ohterAttachment"
          :amount="5"
          :isLt1M="30"
          typeList="pdf,doc,xls,wpd"
        >
        </uploadFile>
      </a-card>
    </a-form>
    <a-modal title="信息保存提示" :visible="visible" :closable="false" :footer="false">
      <div class="modal-content">
        <div class="icon">
          <a-icon type="check-circle" theme="filled" style="color: #52c41a; font-size: 60px" />
        </div>
        <div class="text-blod">{{ editOrAdd }}信息保存成功</div>
        <div class="text">请尽快提交，如有修改可点击更多操作-编辑</div>
        <a-button class="back-btn" @click="backList">返回列表页</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { getAction, postAction } from '@/api/manage.js'
import pick from 'lodash.pick'
import uploadFile from '../uploadFile/index.vue'
export default {
  components: { uploadFile },
  props: {
    describeData: {
      type: Object,
      default: '',
      required: false,
    },
  },
  data() {
    return {
      // 自定义校验规则
      //预期成果形式
      help: '',
      validateStatus: '',
      // 项目合同
      contractHelp: '',
      contractValidateStatus: '',
      // 信息保存提示
      visible: false,
      // 新增or编辑
      editOrAdd: '',
      // 项目附件
      projectAttachment: [],
      // 其他附件
      ohterAttachment: [],
      form: this.$form.createForm(this),
      validatorRules: {
        total: {
          initialValue: 0,
          rules: [{ required: true }, { pattern: /^[1-9]\d{0,}$/, message: '实际参与人数不能为0' }],
        },
        seniorPost: { initialValue: 0 },
        middlePost: { initialValue: 0 },
        primaryPost: { initialValue: 0 },
        other: { initialValue: 0 },
        expectAchieve: { rules: [{ required: true, message: '请选择预期成果形式' }] },
        expectAchieveStr: {
          rules: [
            {
              validator: this.validateInput,
            },
          ],
        },
        projectSituation: { rules: [{ required: true, message: '项目情况不能为空' }] },
        contractUploadFile: {
          rules: [
            { required: true, message: '请上传附件' },
            {
              validator: this.fileValidate,
            },
          ],
        },
      },
      // 多选框数据
      modalityList: [],
      url: {
        // 新增数据
        add: '/fire/projectBuild/add',
        // 附件
        attachment: '/fire/projectBuild/select/attachment/',
        // 数据字典接口
        listByDictCode: '/sys/dictItem/listByDictCode',
      },
    }
  },
  created() {
    // 只有返回上一步才执行
    if (this.describeData.projectSituation) {
      this.showData()
    }
    this.getCheckBox()
  },
  methods: {
    fileValidate(rule, value, callBack) {
      if (value === 'error') {
        callBack('请上传文件')
      } else {
        callBack()
      }
    },
    contractFileChange(length) {
      if (length === 0) {
        this.contractValidateStatus = 'error'
        this.contractHelp = '请上传文件'
        this.form.setFieldsValue({ contractUploadFile: 'error' })
      } else {
        this.contractValidateStatus = 'success'
        this.contractHelp = ''
        this.form.setFieldsValue({ contractUploadFile: 'success' })
      }
    },
    // 预期成果形式校验输入
    validateInput(rule, value, callBack) {
      let expect = this.form.getFieldValue('expectAchieve')
      if (expect) {
        if (expect.indexOf(this.modalityList.length.toString()) != -1) {
          if (value) {
            callBack()
          } else {
            callBack('请输入其他')
          }
        } else {
          callBack()
        }
      } else {
        callBack('请选择预期成果形式')
      }
    },
    // 预期成果形式内容改变取消提示
    checkBoxChange(value) {
      if (value.length > 0) {
        this.validateStatus = 'success'
        this.help = ''
      } else {
        this.validateStatus = 'error'
        this.help = '请选择预期成果形式'
      }
    },
    inputChange() {
      this.$nextTick(() => {
        if (this.form.getFieldValue('expectAchieveStr')) {
          this.validateStatus = 'success'
          this.help = ''
        } else {
          this.validateStatus = 'error'
          this.help = '请输入其他'
        }
      })
    },
    // 获取预期成果形式的多选
    getCheckBox() {
      const commnUrl = this.url.listByDictCode
      getAction(commnUrl, { dictCode: 'form_result' }).then((res) => {
        const { result, success } = res
        if (success) {
          this.modalityList = result
        } else {
          this.$message.warning(res.message || '预期成果形式查询失败')
        }
      })
    },
    // 展示数据
    showData() {
      this.form.resetFields()
      let model = Object.assign({}, this.describeData)
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(model, 'seniorPost', 'middlePost', 'primaryPost', 'other', 'projectSituation', 'expectAchieveStr')
        )
        this.form.setFieldsValue({ expectAchieve: model.expectAchieve.split(',') })
        this.form.setFieldsValue({
          total:
            parseInt(model.seniorPost) +
            parseInt(model.middlePost) +
            parseInt(model.primaryPost) +
            parseInt(model.other),
        })
      })
      // 获取附件
      getAction(this.url.attachment + this.describeData.id).then((res) => {
        if (res.success) {
          let attachmentList = res.result
          for (let item of attachmentList) {
            let attachmentListObj = {
              id: item.id,
              uid: item.id,
              name: item.fileName + '.' + item.fileSuffix,
              uploadType: item.uploadType,
            }
            if (attachmentListObj.uploadType == '其他附件') {
              this.ohterAttachment.push(attachmentListObj)
            } else if (attachmentListObj.uploadType == '项目合同') {
              this.projectAttachment.push(attachmentListObj)
            }
          }
        } else {
          this.$message.warning(res.message || '查询附件失败')
        }
      })
    },
    // 数字改变
    countCalculation() {
      this.$nextTick(() => {
        let seniorPost = this.form.getFieldValue('seniorPost') || 0
        let middlePost = this.form.getFieldValue('middlePost') || 0
        let primaryPost = this.form.getFieldValue('primaryPost') || 0
        let other = this.form.getFieldValue('other') || 0
        this.form.setFieldsValue({
          total: parseInt(seniorPost) + parseInt(middlePost) + parseInt(primaryPost) + parseInt(other),
        })
      })
    },

    // 返回列表页
    backList() {
      this.visible = false
      this.$emit('closeModal')
    },
    // 保存
    handleSubmit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          // 处理预期成果形式的值格式
          if (this.form.getFieldValue('expectAchieve')) {
            let expectNewValue = this.form.getFieldValue('expectAchieve').toString()
            values.expectAchieve = expectNewValue
          } else {
            values.expectAchieve = ''
          }
          let deepCloneData = JSON.parse(JSON.stringify(this.describeData))
          let params = this.dealParams(deepCloneData, values)
          // 调用项目附件
          this.$refs.contract.handleSubmit()
          // 调用其他附件
          this.$refs.otherEnclosure.handleSubmit()
          if (!this.describeData.projectSituation) {
            postAction(this.url.add, params).then((res) => {
              if (res.success) {
                this.visible = true
                this.editOrAdd = '新增'
              } else {
                this.$message.warning(res.message || '保存失败')
              }
            })
          } else {
            postAction(this.url.add, params).then((res) => {
              if (res.success) {
                this.visible = true
                this.editOrAdd = '编辑'
              } else {
                this.$message.warning(res.message || '修改失败')
              }
            })
          }
        } else {
          // 预期成果形式校验
          if (err.expectAchieve) {
            this.validateStatus = 'error'
            this.help = err.expectAchieve.errors[0].message
          } else if (err.expectAchieveStr) {
            this.validateStatus = 'error'
            this.help = err.expectAchieveStr.errors[0].message
          } else {
            this.validateStatus = 'success'
            this.help = ''
          }
        }
      })
    },
    dealParams(data, val) {
      data.seniorPost = val.seniorPost
      data.middlePost = val.middlePost
      data.primaryPost = val.primaryPost
      data.other = val.other
      data.expectAchieve = val.expectAchieve
      data.expectAchieveStr = val.expectAchieveStr
      data.projectSituation = val.projectSituation
      return data
    },
  },
}
</script>
<style lang="less" scoped>
// 提示
.ant-alert {
  margin-bottom: 16px;
  background: #fffbe6;
  border: 1px solid #ffe58f;
  border-radius: 2px;
  // 提示字体
  .message {
    font-size: 14px;
    font-weight: 400;
    text-align: left;
    color: rgba(0, 0, 0, 0.65);
    line-height: 20px;
  }
}
// 选择数字
.ant-input-number {
  width: 12%;
  margin: 0 8px;
  /deep/ .ant-input-number-handler-wrap {
    opacity: 1;
  }
}
// 分割线
.ant-divider {
  border-color: #d9d9d9;
}
// 复选框
.checkbox {
  position: relative;
  /deep/ .ant-checkbox-wrapper {
    margin-left: 0;
    margin-right: 8px;
    margin-bottom: 16px;
    width: 11%;
  }
  /deep/ .ant-checkbox-wrapper:nth-last-child(1) {
    width: 20%;
  }
}

// 项目合同&其他合同
.contract,
.enclosure {
  margin-top: 16px;
}

/deep/ .ant-modal-title {
  font-size: 15px;
  font-weight: 600;
  text-align: left;
  color: rgba(0, 0, 0, 0.85);
  line-height: 24px;
}
// 保存弹出框内容
.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  .icon {
    margin-bottom: 20px;
  }
  .text-blod {
    font-size: 20px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    line-height: 32px;
    margin-bottom: 6px;
  }
  .text {
    font-size: 13px;
    font-weight: 400;
    text-align: center;
    color: #8c8c8c;
    line-height: 22px;
    margin-bottom: 20px;
  }
  .back-btn {
    width: 100%;
  }
}
</style>
