<template>
  <div>
    <a-alert
      :message="
        configurationType == 'examine'
          ? '中期检查录入配置完成后，项目填写人提交后，可在项目详情中查看。'
          : '绩效评价录入配置完成后，项目填写人提交后，可在项目详情中查看。'
      "
      banner
    />
    <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
      <a-form-item label="节点名称">
        <a-input placeholder="请输入" v-decorator="['configName', validatorRules.configName]"></a-input>
      </a-form-item>
      <a-form-item label="发布单位">
        <a-input placeholder="自动读取" v-model="infoList.publishUnitName" disabled></a-input>
      </a-form-item>
      <a-form-item label="项目发布人">
        <a-input placeholder="自动读取" v-model="infoList.publishUserRealname" disabled></a-input>
      </a-form-item>
      <a-form-item label="开始提交时间">
        <a-date-picker
          style="width: 100%"
          v-decorator="['submitStartTime', validatorRules.submitStartTime]"
          placeholder="选择时间"
        />
      </a-form-item>
      <a-form-item label="上传截止时间">
        <a-date-picker
          style="width: 100%"
          v-decorator="['uploadEndTime', validatorRules.uploadEndTime]"
          placeholder="选择时间"
        />
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import moment from 'moment'
import pick from 'lodash.pick'
import { postAction, getAction } from '@/api/manage.js'
export default {
  data() {
    return {
      form: this.$form.createForm(this, { name: 'coordinated' }),
      validatorRules: {
        configName: { rules: [{ required: true, message: '节点名称不能为空' }] },
        submitStartTime: { rules: [{ required: true, message: '请选择开始提交时间' }] },
        uploadEndTime: { rules: [{ required: true, message: '请选择上传截止时间' }] },
      },
      data: {},
    }
  },
  props: {
    configurationType: {
      type: String,
      default: '',
      required: false,
    },

    infoList: {
      type: Object,
      default: {},
      required: false,
    },
    id: {
      type: String,
      default: '',
      required: false,
    },
  },
  mounted() {
    this.queryByContentId()
  },
  methods: {
    //根据业务ID查询
    queryByContentId() {
      let params = {
        configType: this.configurationType == 'examine' ? 1 : 2,
        contentId: this.id,
      }
      getAction('/fire/projectReportConfig/queryByContentId', params).then((res) => {
        if (res.success) {
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(res.result, 'configName', 'submitStartTime', 'uploadEndTime'))
            this.data = res.result
          })
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    //提交
    submit() {
      this.form.validateFields((err) => {
        if (!err) {
          console.log(this.data)
          let params = Object.assign({}, this.form.getFieldsValue(), {
            id: this.data ? this.data.id : '',
            contentId: this.id,
            userId: this.infoList.publishUserId,
            unitId: this.infoList.publishUnitId,
            configType: this.configurationType == 'examine' ? 1 : 2,
          })
          params.submitStartTime = moment(params.submitStartTime).format('YYYY-MM-DD HH:mm:ss')
          params.uploadEndTime = moment(params.uploadEndTime).format('YYYY-MM-DD HH:mm:ss')
          console.log(params)
          postAction('/fire/projectReportConfig/configure', params).then((res) => {
            if (res.success) {
              this.$message.success(res.message)
              this.$emit('dataInfo')
              this.$emit('configurationCancel')
            } else {
              this.$message.warning(res.message)
            }
          })
        }
      })
    },
    // //关闭弹框
    handleCancel() {
      this.form.resetFields()
    },
  },
}
</script>

<style>
</style>