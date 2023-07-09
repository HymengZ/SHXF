<template>
  <div>
    <a-alert banner>
      <div slot="message" class="message">
        1、资源宣传视频非必填，可为空；<br />
        2、资源描述中的科研资质请填写关于消防科技业务相关的内容，例如参与的历史消防科技项目、获得的消防类资质证书或者奖项。
      </div>
    </a-alert>
    <a-card class="propaganda" title="资源宣传视频">
      <p class="propaganda-text">仅支持视频类型avi、wmv、mpg、mp4，大小不超过100M，最多上传5份。</p>
      <UploadFile
        ref="video"
        :amount="5"
        :isLt1M="100"
        typeList="avi,wmv,mpg,mp4"
        :attachment="propagandaAttachment"
        btnText="上传视频"
        :uploadType="1"
      />
    </a-card>
    <a-card class="describe" title="资源描述">
      <a-form :form="form" :colon="false">
        <a-form-item label="团队力量">
          团队人数：<a-input-number
            :precision="0"
            :min="0"
            disabled
            v-decorator="['teamSize', validatorRules.teamSize]"
          />人，其中：学士学位<a-input-number
            :precision="0"
            @change="countCalculation"
            v-decorator="['xueshiSize', validatorRules.xueshiSize]"
            :min="0"
          />人，硕士学位<a-input-number
            :precision="0"
            @change="countCalculation"
            v-decorator="['shuoshiSize', validatorRules.shuoshiSize]"
            :min="0"
          />人，博士学位<a-input-number
            :precision="0"
            @change="countCalculation"
            v-decorator="['boshiSize', validatorRules.boshiSize]"
            :min="0"
          />
          人
        </a-form-item>
        <a-form-item label="资源团队/产品描述">
          <a-textarea
            v-decorator="['productDescribe', validatorRules.productDescribe]"
            placeholder="请输入5000字以内的文字"
            :rows="5"
          ></a-textarea>
        </a-form-item>
        <a-form-item label="科研资质">
          <a-textarea
            v-decorator="['scienceZizhi']"
            placeholder="请输入参与的历史消防科技项目、获得的消防类资质证书或者奖项，限1000字以内的文字"
            :rows="5"
          ></a-textarea>
        </a-form-item>
        <a-form-item label="曾获奖项">
          <a-textarea
            v-decorator="['awards']"
            placeholder="请输入曾获得的非消防科技类的奖励奖项，限1000字以内的文字"
            :rows="5"
          ></a-textarea>
        </a-form-item>
        <a-form-item label="知识产权">
          <a-textarea
            v-decorator="['zscq']"
            placeholder="请输入拥有的专项专利，限1000字以内的文字"
            :rows="5"
          ></a-textarea>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>
<script>
import UploadFile from '../uploadFile'
import pick from 'lodash.pick'
export default {
  props: {
    // 已新增的数据
    currentData: {
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
      validatorRules: {
        teamSize: {
          initialValue: 0,
          rules: [{ required: true }, { pattern: /^[1-9]\d{0,}$/, message: '团队人数不能为0' }],
        },
        xueshiSize: { initialValue: 0 },
        shuoshiSize: { initialValue: 0 },
        boshiSize: { initialValue: 0 },
        productDescribe: {
          rules: [{ required: true, message: '资源团队/产品描述不能为空' }],
        },
      },
    }
  },
  mounted() {
    if (this.currentData.productDescribe) {
      this.showData()
    }
  },
  methods: {
    async showData() {
      this.form.resetFields()
      let model = Object.assign({}, this.currentData)
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            model,
            'teamSize',
            'xueshiSize',
            'shuoshiSize',
            'boshiSize',
            'productDescribe',
            'scienceZizhi',
            'awards',
            'zscq'
          )
        )
      })

      if (model.mp4) {
        let attachmentList = model.mp4
        for (let item of attachmentList) {
          let attachmentListObj = {
            id: item.id,
            uid: item.id,
            name: item.name,
            url: item.url,
          }
          this.propagandaAttachment.push(attachmentListObj)
        }
        console.log('this.propagandaAttachment', this.propagandaAttachment)
      }
    },
    // 数字改变
    countCalculation() {
      this.$nextTick(() => {
        let xueshiSize = this.form.getFieldValue('xueshiSize') || 0
        let shuoshiSize = this.form.getFieldValue('shuoshiSize') || 0
        let boshiSize = this.form.getFieldValue('boshiSize') || 0
        this.form.setFieldsValue({
          teamSize: parseInt(xueshiSize) + parseInt(shuoshiSize) + parseInt(boshiSize),
        })
      })
    },
    // 表单校验和保存数据
    handleSubmit() {
      this.form.validateFields(async (err, values) => {
        if (!err) {
          // 调用附件
          const uploadFileList = this.$refs.video.uploadFile().addFile
          const removeFileList = this.$refs.video.uploadFile().removeFile
          // 新增
          let uploadParams = Object.assign({}, values, {
            id: this.currentData.id,
            mp4: uploadFileList.length > 0 ? uploadFileList : undefined,
          })
          this.$emit('addData', uploadParams)
          if (removeFileList.length > 0) {
            this.$emit('deleteFile', removeFileList)
          }
        }
      })
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
// 选择数字
.ant-input-number {
  width: 12%;
  margin: 0 8px;
  /deep/ .ant-input-number-handler-wrap {
    opacity: 1;
  }
}
</style>
