<template>
  <div>
    <a-alert banner>
      <div slot="message" class="message">1、资源图片非必填，可为空；<br /></div>
    </a-alert>
    <a-card class="picture" title="成果图片">
      <p class="picture-text">仅支持视频类型jpg，png大小不超过3M，最多上传10张。</p>
      <UploadFile
        ref="picture"
        :amount="10"
        :isLt1M="3"
        typeList="jpg,png"
        uploadType="成果图片"
        :contentId="describeData.id"
        :attachment="pictureAttachment"
        btnText="上传照片"
      />
    </a-card>
    <a-modal title="信息保存提示" :visible="visible" :closable="false" :footer="false">
      <div class="modal-content">
        <div class="icon">
          <a-icon type="check-circle" theme="filled" style="color: #52c41a; font-size: 60px" />
        </div>
        <div class="text-blod">编辑信息保存成功</div>
        <div class="text">请尽快提交，如有修改可点击更多操作-编辑</div>
        <a-button class="back-btn" @click="backList">返回列表页</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { fetchAttachment } from '@/api/project/achievement'
import UploadFile from '../uploadFile'
export default {
  props: {
    describeData: {
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
      // 成果图片
      pictureAttachment: [],
      visible: false,
      form: this.$form.createForm(this),
    }
  },
  mounted() {
    this.showData()
  },
  methods: {
    async showData() {
      // 获取附件
      const { success, result, message } = await fetchAttachment(this.describeData.id)
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
        if (attachmentListObj.uploadType == '成果图片') {
          this.pictureAttachment.push(attachmentListObj)
        }
      }
    },
    // 表单校验和保存数据
    handleSubmit() {
      // 调用附件
      this.$refs.picture.handleSubmit()
      this.visible = true
    },
    // 返回列表页
    backList() {
      this.visible = false
      this.$emit('closeModal')
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
