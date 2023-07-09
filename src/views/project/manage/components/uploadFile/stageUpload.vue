<template>
  <a-upload
    name="file"
    :multiple="true"
    listType="text"
    :action="url.upload"
    :data="{ biz: 'temp' }"
    :headers="headers"
    :fileList="fileList"
    @change="handleChange"
    :accept="typeList"
    :beforeUpload="beforeUpload"
    :showUploadList="false"
  >
    <a-button style="border: 0; color: #1890ff"> 上传附件</a-button>
  </a-upload>
</template>
<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
export default {
  data() {
    return {
      url: {
        upload: 'https://shfar.cwit.com.cn/api/sys/common/upload',
        // 删除
        delete: '/fire/projectReport/delete/attachment',
      },
      headers: {},
      // 文件存放的地方
      fileList: [],
      // 用来判断文件上传数量
      count: 0,
      // 要删除的文件
      removeIdList: [],
    }
  },
  created() {
    // 获取token
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.headers = { 'X-Access-Token': token }
  },

  props: {
    amount: {
      type: Number,
      default: 0,
      required: false,
    },
    isLt1M: {
      type: Number,
      default: 0,
      required: false,
    },
    typeList: {
      type: String,
      default: '',
      required: false,
    },
    // id
    contentId: {
      type: String,
      default: '',
      required: false,
    },
    //类型
    uploadType: {
      type: String,
      default: '',
      required: false,
    },
    // 数据ID
    recordId: {
      type: String,
      default: '',
      required: false,
    },
    // 所有数据
    stageList: {
      type: Array,
      default: () => [],
      required: false,
    },
  },

  methods: {
    //附件改变回调
    handleChange(info) {
      this.fileList = [...info.fileList]
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} 文件上传成功`)
        let list = JSON.parse(JSON.stringify(this.stageList))
        for (const item of list) {
          if (item.id == this.recordId) {
            item.attachmentStatus = '0'
            let fileObj = {
              contentId: this.recordId,
              fileName: info.file.name,
              fileSuffix: info.file.name.split('.')[1],
              fileUrl: info.file.response.message,
              uploadType: this.uploadType,
            }

            item.stageCheckUploads = fileObj
          }
        }
        this.$emit('changeList', list)
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 文件上传失败`)
      }
    },
    //文件上传校验
    beforeUpload(file) {
      // 能上传的文件类型
      let typeList = this.typeList
      // 正在上传文件的类型
      let fileInfo = file.name.split('.')[1]
      // 判断正在上传的文件是否可以上传
      let isType = typeList.indexOf(fileInfo)
      if (isType == -1) {
        this.$message.warning('请上传' + this.typeList + '格式文件')
        // 过滤格式不对的文件
        this.actionFile(file)
        return false
      }
      if (file.size > 1024 * 1024 * this.isLt1M) {
        this.$message.warning('文件大小不能超过' + this.isLt1M + 'M')
        this.actionFile(file)
        return false
      }
      if (this.amount > 0 && this.fileList.length + 1 > this.amount) {
        this.$message.warning('文件数量不能超过' + this.amount + '份')
        this.actionFile(file)
        return false
      }
      this.count++
      if (this.amount > 0 && this.count > this.amount) {
        this.count = 0
        this.$message.warning('文件数量不能超过' + this.amount + '份')
        this.actionFile(file)
        return false
      }

      return true
    },
    //过滤异常附件
    actionFile(file) {
      this.$nextTick(() => {
        let fileList = this.fileList
        this.fileList = fileList.filter((item) => item.uid !== file.uid)
      })
    },
  },
}
</script>

