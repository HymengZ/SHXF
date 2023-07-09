<template>
  <div>
    <a-alert message="请认真填写。" style="margin-bottom: 20px" banner />
    <a-form :form="form">
      <a-card title="基本信息">
        <a-row type="flex" justify="space-between" align="top">
          <a-col :span="11">
            <a-form-item label="发布单位">
              <a-input
                style="display: block"
                disabled
                placeholder="自动读取"
                v-decorator="['publishUnitName', validatorRules.publishUnitName]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="示范情况发布人">
              <a-input placeholder="" disabled v-decorator="['publishUserId', validatorRules.publishUserId]" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="示范情况简介">
              <a-textarea
                v-decorator="['situationSummary', validatorRules.situationSummary]"
                placeholder="请输入5000字以内的文字"
              ></a-textarea>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="宣传视频（附件类型avi/mp4/pva，附件大小不超过30M)">
              <enclosure-uploader
                v-decorator="['propagateVideoUrl']"
                :max="1"
                accept=".avi,.mp4,.pva"
              >
              </enclosure-uploader>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card title="示范情况正文">
        <a-form-item>
          <j-editor
            trigger-change
            v-decorator="['situationText', { rules: [{ required: true, message: '请输入示范情况正文' }] }]"
          />
        </a-form-item>
      </a-card>
    </a-form>
  </div>
</template>

<script>
import EnclosureUploader from '../../../components/EnclosureUploader'
import moment from 'moment'
import { cloneDeep } from 'lodash'
export default {
  components: {
    EnclosureUploader,
  },
  name: 'LogModal',
  data() {
    return {
      form: this.$form.createForm(this, { name: 'coordinated' }),
      validatorRules: {
        publishUnitName: {
          initialValue: this.$store.state.user.info.departName,
          rules: [{ required: true, message: '' }],
        },
        publishUserId: { initialValue: this.$store.state.user.info.realname, rules: [{ required: true, message: '' }] },
        situationSummary: { rules: [{ required: true, message: '请输入示范基地简介' }] },
      },
      currentModifyData: {},
    }
  },
  methods: {
    onChange(e) {
      console.log(e)
    },
    validateFields() {
      return this.form.validateFields().then((val) => {
        return {
          ...val,
          propagateVideoUrl: val.propagateVideoUrl[0].response.message,
          propagateVideoName: val.propagateVideoUrl[0].name,
          publishUserId: this.$store.state.user.info.id,
          createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          sysOrgCode: this.$store.state.user.info.departId,
        }
      })
    },
    setFieldsValue(data) {
      this.form.setFieldsValue({
        ...data,
        propagateVideoUrl: [
          { status: 1, progress: 100, name: data.propagateVideoName, response: { message: data.propagateVideoUrl } },
        ],
      })
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
</style>