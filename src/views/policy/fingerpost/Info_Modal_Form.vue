<template>
  <div>
    <a-alert style="margin-bottom: 20px" message="请认真填写信息。" banner />
    <a-form :form="form">
      <a-card title="指南基本信息">
        <a-row type="flex" justify="space-between" align="top">
          <a-col :span="11">
            <a-form-item label="所属年度">
              <a-date-picker
                style="width: 100%"
                :mode="mode"
                v-decorator="['year', validatorRules.year]"
                format="YYYY"
                :open="yearShowOne"
                @openChange="openChangeOne"
                @panelChange="panelChangeOne"
              />
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
            <a-form-item label="指南名称">
              <a-input placeholder="请输入" allowClear v-decorator="['title', validatorRules.title]"></a-input>
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
      <a-card title="指南描述">
        <a-form-item label="指南描述">
          <a-textarea
            :auto-size="{ minRows: 6 }"
            v-decorator="['content', validatorRules.content]"
            placeholder="请输入5000字以内的文字"
          />
        </a-form-item>
      </a-card>
      <a-card title="指南附件">
        <p>附件（附件类型pdf/word/excel，附件大小不超过3M，最多上传5份。）</p>
        <!-- <j-upload
          text="上传附件"
          @change="change"
          :returnUrl="false"
          :value="fileList"
          :multiple="true"
          :beforeUpload="beforeUpload"
        ></j-upload> -->
        <a-upload
          name="file"
          class="upload"
          :multiple="true"
          listType="text"
          :action="url.upload"
          :data="{ biz: 'temp' }"
          :headers="headers"
          :fileList="fileList"
          @change="change"
          :beforeUpload="beforeUpload"
          :remove="remove"
          accept=".pdf,.doc,.docx,.xlsx,.xls"
        >
          <a-button> <a-icon type="upload" /> 上传附件 </a-button>
        </a-upload>
      </a-card>
      <a-card title="其他">
        <a-form-item label="是否提供正文下载">
          <a-radio-group name="radioGroup" v-decorator="['isDownload', { initialValue: '1' }]">
            <a-radio value="1"> 是 </a-radio>
            <a-radio value="0"> 否 </a-radio>
          </a-radio-group>
        </a-form-item>
      </a-card>
      <div class="footBtn">
        <a-button type="text" @click="handleCancel" style="margin-right: 8px">取消</a-button>
        <a-button type="primary" @click="handleOk">保存并发布</a-button>
      </div>
    </a-form>
  </div>
</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import pick from 'lodash.pick'
import { deleteAction, postAction } from '@/api/manage.js'
export default {
  data() {
    return {
      FILE_3M: 3 * 1024 * 1024,
      uploadAction: window._CONFIG['domianURL'] + '/sys/common/upload',
      headers: {},
      form: this.$form.createForm(this, { name: 'coordinated' }),
      mode: 'year',
      yearShowOne: false,
      validatorRules: {
        year: { rules: [{ required: true, message: '年度不能为空' }] },
        publishUnit: { rules: [{ required: true, message: '发布单位不能为空' }] },
        title: { rules: [{ required: true, message: '指南名称不能为空' }] },
        publishTime: { rules: [{ required: true, message: '发布时间不能为空' }] },
        content: { rules: [{ required: true, message: '指南正文不能为空' }] },
      },
      url: {
        upload: 'https://shfar.cwit.com.cn/api/sys/common/upload',
        add: '/fire/scienceGuide/add',
        edit: '/fire/scienceGuide/edit',
        delete: '/fire/scienceGuide/deleteFile',
      },
      fileList: [],
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
  created() {
    const token = Vue.ls.get(ACCESS_TOKEN)
    //---------------------------- begin 图片左右换位置 -------------------------------------
    this.headers = { 'X-Access-Token': token }
    //---------------------------- end 图片左右换位置 -------------------------------------
  },
  methods: {
    onChange(e, a) {
      console.log(e, a)
      this.form.setFieldsValue({ publishTime: a })
    },
    //自定义年份选择器
    openChangeOne(status) {
      if (status) {
        console.log(this.status)
        this.yearShowOne = true
      }
    },
    panelChangeOne(e) {
      let year = e.toString()
      this.form.setFieldsValue({ year: year.substring(11, 15) })
      this.yearShowOne = false
    },
    //添加/详情弹框确定按钮
    handleOk() {
      this.form.validateFields((err) => {
        if (!err) {
          let params
          let url
          let arr = []
          if (this.type === 'add') {
            params = Object.assign({}, { fileList: this.fileList }, this.form.getFieldsValue())
            for (const i of params.fileList) {
              let obj = {
                fileUrl: i.response.message,
                fileName: i.name,
                fileSuffix: i.name.split('.')[1],
                fileSize: i.size,
              }
              arr.push(obj)
            }
            console.log(arr)
            url = this.url.add
          } else {
            params = Object.assign({}, { fileList: this.fileList }, this.form.getFieldsValue(), { id: this.id })
            let obj
            for (const i of params.fileList) {
              if (i.id) {
                obj = {
                  id: i.id,
                  fileUrl: i.url,
                  fileName: i.name,
                  fileSuffix: i.name.split('.')[1],
                  fileSize: i.size,
                }
              } else {
                obj = {
                  id: '',
                  fileUrl: i.response.message,
                  fileName: i.name,
                  fileSuffix: i.name.split('.')[1],
                  fileSize: i.size,
                }
              }

              arr.push(obj)
            }
            url = this.url.edit
          }
          if (params.publishTime && typeof params.publishTime != 'string') {
            params.publishTime = params.publishTime.format('YYYY-MM-DD HH:mm:ss')
          }
          params.fileList = arr
          console.log(params)
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
        this.form.setFieldsValue(
          pick(this.infoList, 'title', 'content', 'publishUnit', 'year', 'publishTime', 'isDownload')
        )
        let arr = []
        for (const i of this.infoList.fileList) {
          let obj = {
            id: i.id,
            uid: i.id,
            name: i.fileName,
            url: i.fileUrl,
            status: 'done',
          }
          arr.push(obj)
        }
        this.fileList = arr
        console.log(this.fileList)
      })
    },
    //附件改变回调
    change(e) {
      console.log(e)
      let { fileList } = e
      this.fileList = [...fileList]
      console.log(this.fileList)
    },
    //文件上传校验
    beforeUpload(file) {
      let typeList = ['pdf', 'doc', 'docx', 'xlsx', 'xls']
      let fileInfo = file.name.split('.')[1]
      let isType = typeList.indexOf(fileInfo)
      if (isType == -1) {
        this.$message.warning('请上传pdf/word/excel格式文件')
        this.actionFile(file)
        return false
      }
      if (file.size > this.FILE_3M) {
        this.$message.warning('文件大小不能超过3M')
        this.actionFile(file)
        return false
      }
      if (this.fileList.length >= 5) {
        this.$message.warning('文件数量不能超过5份')
        this.actionFile(file)
        return false
      }
      return true
    },
    //附件删除
    remove(file) {
      console.log(file)
      if (file.id) {
        deleteAction(this.url.delete, { id: file.id }).then((res) => {
          if (res.success) {
            this.$message.success(res.message)
          } else {
            this.$message.warning(res.message)
            return false
          }
        })
      }
    },
    //过滤异常附件
    actionFile(file) {
      this.$nextTick(() => {
        this.fileList.splice(
          this.fileList.findIndex((item) => item.uid === file.uid),
          1
        )
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
  .ant-card-head {
    background: #fafafa;
  }
}
.footBtn {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}
</style>