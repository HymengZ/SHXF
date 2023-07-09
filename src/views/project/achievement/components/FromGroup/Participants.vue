<template>
  <div>
    <a-alert banner>
      <div slot="message" class="message">
        1、成果宣传视频非必填，可为空；<br />
        2、成果描述非必填，可为空。
      </div>
    </a-alert>
    <a-card class="propaganda" title="成果宣传视频">
      <p class="propaganda-text">仅支持视频类型avi、wmv、mpg、mp4，大小不超过100M，最多上传5份。</p>
      <UploadFile
        ref="video"
        :amount="5"
        :isLt1M="100"
        typeList="avi,wmv,mpg,mp4"
        uploadType="成果宣传视频"
        :contentId="participantsData.id"
        :attachment="propagandaAttachment"
        btnText="上传视频"
      />
    </a-card>
    <a-card class="describe" title="成果描述">
      <a-form :form="form" :colon="false">
        <a-form-item label="主要创新点">
          <a-textarea v-decorator="['mainInnovationPoint']" placeholder="请输入5000字以内的文字" :rows="5"></a-textarea>
        </a-form-item>
        <a-form-item label="经济/社会效益">
          <a-textarea v-decorator="['benefit']" placeholder="请输入5000字以内的文字" :rows="5"></a-textarea>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>
<script>
import { addScienceAchieve, fetchAttachment } from '@/api/project/achievement'
import UploadFile from '../uploadFile'
import pick from 'lodash.pick'
export default {
  props: {
    participantsData: {
      type: Object,
      default: '',
      required: false,
    },
  },
  components: {
    UploadFile,
  },
  data() {
    return {
      // 宣传视频附件
      propagandaAttachment: [],
      form: this.$form.createForm(this),
    }
  },
  mounted() {
    this.showData()
  },
  methods: {
    async showData() {
      this.form.resetFields()
      let model = Object.assign({}, this.participantsData)
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(model, 'mainInnovationPoint', 'benefit'))
      })
      // 获取附件
      const { success, result, message } = await fetchAttachment(this.participantsData.id)
      if (!success) {
        this.$message.warning(message)
        return
      }
      let attachmentList = result
      for (let item of attachmentList) {
        let attachmentListObj = {
          id: item.id,
          uid: item.id,
          name: item.fileName + '.' + item.fileSuffix,
          uploadType: item.uploadType,
          url: 'https://shfar.cwit.com.cn/api/' + item.fileUrl,
        }
        if (attachmentListObj.uploadType == '成果宣传视频') {
          this.propagandaAttachment.push(attachmentListObj)
        }
      }
    },
    // 表单校验和保存数据
    handleSubmit() {
      this.form.validateFields(async (err, values) => {
        // 调用附件
        this.$refs.video.handleSubmit()
        // 第二步的新增（实际是对第一步已经增加好的数据其他字段赋值）
        let deepCloneData = JSON.parse(JSON.stringify(this.participantsData))
        let params = this.dealParams(deepCloneData, values)
        if (!err) {
          const { success, result, message } = await addScienceAchieve(params)
          if (!success) {
            this.$message.warning(message)
            return
          }
          this.$message.success('配置成功')
          this.$emit('addCurrent', result)
        }
      })
    },
    dealParams(data, val) {
      data.mainInnovationPoint = val.mainInnovationPoint
      data.benefit = val.benefit
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
.describe {
  margin-top: 16px;
}
</style>
