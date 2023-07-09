<template>
  <!-- 
  1.multiple 附件多选
  2.listType 上传列表样式
  3.action 上传的地址 
  4.data  上传所需参数
  5.headers 设置上传的请求头部
  6. fileList  已经上传的文件列表
  7.change 上传中、完成、失败都会调用这个函数。
  8.beforeUpload 上传文件之前的钩子，参数为上传的文件，若返回 false 则停止上传。支持返回一个 Promise 对象
 -->
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
    :remove="remove"
  >
    <a-button> <a-icon type="upload" /> 上传附件 </a-button>
  </a-upload>
</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { postAction, deleteActionJSON } from '@/api/manage.js'
export default {
  data() {
    return {
      url: {
        upload: 'https://shfar.cwit.com.cn/api/sys/common/upload',
        addAttachment: '/fire/projectReport/addAttachment',
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
    this.fileList = this.attachment
    this.count = this.attachment.length
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
    // 已有附件
    attachment: {
      type: Array,
      default: () => [],
      required: false,
    },
    //类型
    uploadType: {
      type: String,
      default: '',
      required: false,
    },
  },
  watch: {
    fileList(newVal, oldVal) {
      this.$emit('fileChange', newVal.length)
    },
  },
  methods: {
    //附件改变回调
    handleChange(info) {
      this.fileList = [...info.fileList]
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} 文件上传成功`)
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

    //把服务器上的附件删除
    remove(file) {
      // 删除文件后重新计数
      this.count = this.fileList.length - 1
      if (file.id && file.uploadType) {
        this.removeIdList.push(file.id)
      }
    },

    handleSubmit() {
      // 新增的
      if (this.fileList.length > 0) {
        // 过滤掉已上传的
        let filterList = this.fileList.filter((item) => {
          return item.type
        })
        if (filterList.length > 0) {
          let fileInfo = []
          for (let item of filterList) {
            let fileObj = {
              contentId: this.contentId,
              fileName: item.name.split('.')[0],
              fileSuffix: item.name.split('.')[1],
              fileUrl: item.response.message,
              uploadType: this.uploadType,
            }
            fileInfo.push(fileObj)
          }
          postAction(this.url.addAttachment, fileInfo).then((res) => {
            if (res.success) {
              // this.$message.success('附件保存成功')
            } else {
              this.$message.warning(res.message || '附件保存失败')
            }
          })
        }
      }
      //要删除的
      if (this.removeIdList.length > 0) {
        let params = this.removeIdList
        deleteActionJSON(this.url.delete, params).then((res) => {
          if (res.success) {
          } else {
            this.$message.warning(res.message || '附件删除失败')
          }
        })
      }
    },
  },
}
</script>

<style lang="less" scoped>
/deep/ .ant-upload-list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin-top: 16px;
  > div {
    border: 1px solid rgba(0, 0, 0, 0.1);
    width: 48%;
    margin-bottom: 8px;
    transition: all 0.5s ease;
    .ant-upload-list-item {
      margin-top: 0;
      margin: 10px;
      .ant-upload-list-item-card-actions {
        opacity: 1;
      }
    }
    .ant-upload-list-item:hover .ant-upload-list-item-info {
      background-color: #fff;
    }
  }
  > div:nth-child(2n + 1) {
    margin-right: 2%;
  }
}
</style>