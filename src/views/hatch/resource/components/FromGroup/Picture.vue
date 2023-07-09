<template>
  <div>
    <a-alert banner>
      <div slot="message" class="message">
        1、资源图片非必填，可为空；<br />
        2、资源附件非必填，可为空。
      </div>
    </a-alert>
    <a-card class="picture" title="资源图片">
      <p class="picture-text">仅支持图片类型jpg，png大小不超过3M，最多上传10张。</p>
      <UploadFile
        ref="picture"
        :amount="10"
        :isLt1M="3"
        typeList="jpg,png"
        :uploadType="2"
        :attachment="pictureAttachment"
        btnText="上传照片"
      />
    </a-card>
    <a-card title="资源附件" class="resource">
      <p class="resource-text">仅支持文档类型pdf、doc、xls、wpd，大小不超过30M，最多上传5份。</p>
      <upload-document
        ref="resource"
        :amount="5"
        :isLt1M="30"
        typeList="pdf,doc,xls,wpd"
        :uploadType="3"
        :attachment="resourceAttachment"
      />
    </a-card>
  </div>
</template>
<script>
import UploadFile from '../uploadFile'
import UploadDocument from '../uploadFile/uploadDocument.vue'
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
    UploadDocument,
  },
  data() {
    return {
      // 资源图片
      pictureAttachment: [],
      // 资源附件
      resourceAttachment: [],
    }
  },
  computed: {
    baseUrl() {
      return process.env.VUE_APP_API_BASE_URL + '/'
    },
  },
  mounted() {
    this.showData()
  },
  methods: {
    async showData() {
      if (this.currentData.pic) {
        let pictureAttachment = this.currentData.pic
        this.existenceFile(pictureAttachment, 'pictureAttachment')
      }
      if (this.currentData.accessory) {
        let resourceAttachment = this.currentData.accessory
        this.existenceFile(resourceAttachment, 'resourceAttachment')
      }
    },
    //
    existenceFile(file, name) {
      for (let item of file) {
        let attachmentListObj = {
          id: item.id,
          uid: item.id,
          name: item.name,
          url: name == 'pictureAttachment' ? this.baseUrl + item.url : item.url,
        }
        this[name].push(attachmentListObj)
      }
    },
    // 表单校验和保存数据
    handleSubmit() {
      // 调用附件
      const picUploadFileList = this.$refs.picture.uploadFile().addFile
      const picRemoveFileList = this.$refs.picture.uploadFile().removeFile
      const resUploadFileList = this.$refs.resource.uploadFile().addFile
      const resRemoveFileList = this.$refs.resource.uploadFile().removeFile
      let params = Object.assign(
        {},
        {
          id: this.currentData.id,
          pic: picUploadFileList.length > 0 ? picUploadFileList : undefined,
          accessory: resUploadFileList.length > 0 ? resUploadFileList : undefined,
        }
      )
      this.$emit('addData', params)
      let removeList = [...picRemoveFileList, ...resRemoveFileList]
      if (removeList.length > 0) {
        this.$emit('deleteFile', removeList)
      }
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
.resource {
  margin-top: 16px;
}
</style>
