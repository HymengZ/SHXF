<template>
  <a-upload
    name="file"
    list-type="picture-card"
    class="avatar-uploader"
    :show-upload-list="false"
    :action="url.upload"
    :before-upload="beforeUpload"
    @change="handleChange"
    :accept="typeList"
    :headers="headers"
    :data="{ biz: 'temp' }"
  >
    <div class="img-content" v-if="imageUrl">
      <img class="image" :src="imageUrl" alt="图片不存在" />
      <div class="fix"><a-icon @click="handleDelete($event)" type="delete" style="font-size: 20px" /></div>
    </div>
    <div v-else>
      <a-icon :type="loading ? 'loading' : 'plus'" />
      <div class="ant-upload-text">上传照片</div>
    </div>
  </a-upload>
</template>
<script>
function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
export default {
  props: {
    isLt1K: {
      type: Number,
      default: 0,
      required: false,
    },
    typeList: {
      type: String,
      default: '',
      required: false,
    },
    // 已有附件地址
    attachmentUrl: {
      type: String,
      default: '',
      required: false,
    },
  },
  data() {
    return {
      loading: false,
      imageUrl: '',
      uploadImageUrl: '',
      headers: {},
      // 文件存放的地方，如果写上了这个不将上传后的结果赋值，那么文件一直处于uploading中
      // fileList: [],
      url: {
        upload: 'https://shfar.cwit.com.cn/api/sys/common/upload',
      },
    }
  },
  created() {
    // 获取token
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.headers = { 'X-Access-Token': token }
    if (this.attachmentUrl) {
      this.imageUrl = 'https://shfar.cwit.com.cn/api/' + this.attachmentUrl
      this.uploadImageUrl = this.attachmentUrl
    }
  },
  methods: {
    handleChange(info) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        this.uploadImageUrl = info.file.response.message
        getBase64(info.file.originFileObj, (imageUrl) => {
          this.imageUrl = imageUrl
          this.loading = false
        })
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
        return false
      }
      if (file.size > 1024 * this.isLt1K) {
        this.$message.warning('文件大小不能超过' + this.isLt1K + 'M')
        return false
      }
      return true
    },

    // 删除文件重新上传
    handleDelete(e) {
      e.stopPropagation()
      this.fileList = []
      this.imageUrl = ''
      this.uploadImageUrl = ''
    },
    uploadFile() {
      return this.uploadImageUrl
    },
  },
}
</script>
<style lang="less" scoped>
.img-content {
  width: 104px;
  height: 104px;
  position: relative;
  .image {
    width: 100%;
    height: 100%;
  }
  .fix {
    width: 100%;
    height: 100%;
    color: #fff;
    text-align: center;
    line-height: 104px;
    background: rgba(0, 0, 0, 0.5);
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0; //透明度为0 不显示遮罩层
  }
}
.img-content:hover .fix {
  opacity: 1;
}
</style>