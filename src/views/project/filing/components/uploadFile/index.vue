<template>
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
  
    accept=".pdf,.doc,.docx,.xlsx,.xls"
  >
    <a-button :disabled="this.ifDisabled"> <a-icon type="upload" /> 上传附件 </a-button>
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
      },
      headers: {},
    }
  },
  created() {
    const token = Vue.ls.get(ACCESS_TOKEN)
    //---------------------------- begin 图片左右换位置 -------------------------------------
    this.headers = { 'X-Access-Token': token }
    //---------------------------- end 图片左右换位置 -------------------------------------
  },
  props: {
    fileList: {
      type: Array,
      default: [],
      required: false,
    },
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
      type: Array,
      default: () => [],
      required: false,
    },
    ifDisabled: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  methods: {
    //附件改变回调
    change(e) {
      console.log(e)
      let { fileList } = e
      this.fileList = [...fileList]
      this.$emit('fileListChange',this.fileList)
    },
    //文件上传校验
    beforeUpload(file) {
      let typeList = this.typeList
      let fileInfo = file.name.split('.')[1]
      let isType = typeList.indexOf(fileInfo)
      if (isType == -1) {
        this.$message.warning('请上传' + this.typeList + '格式文件')
        this.actionFile(file)
        return false
      }
      if (file.size > 1024 * 1024 * this.isLt1M) {
        this.$message.warning('文件大小不能超过' + this.isLt1M + 'M')
        this.actionFile(file)
        return false
      }
      if (this.amount > 0 && this.fileList.length >= this.amount) {
        this.$message.warning('文件数量不能超过' + this.amount + '份')
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
  },
}
</script>

<style>
</style>