<template>
  <a-upload
    name="file"
    :multiple="true"
    listType="text"
    :customRequest="customRequest"
    :file-list="[]"
    :accept="accept"
  >
    <slot name="upload" :file="value" v-if="max === -1 || (value ? value.length : 0) < this.max">
      <a-button> <a-icon type="upload" /> 上传附件 </a-button>
    </slot>
    <div class="filelist" @click.stop>
      <slot :file="value" :dele="handleDeletFile">
        <div v-for="(item, index) in value" :key="index" class="file">
          <a-icon type="paper-clip" />
          <span>{{ item.name }}</span>
          <a-icon type="close" @click="handleDeletFile(item)" />
          <div class="progress">
            <a-progress
              :strokeWidth="1"
              :stroke-color="item.status !== '2' ? '#1890FF' : '#FF4D4F'"
              :percent="item.progress"
              :showInfo="false"
            />
          </div>
        </div>
      </slot>
    </div>
  </a-upload>
</template>

<script>
import { upload } from '@/api/outcome/upload'
const MB = 1024 * 1024
const KB = 1024
export default {
  props: {
    max: {
      type: Number,
      default: -1,
    },
    maxFileSize: {
      type: Number,
      default: 3,
    },
    maxFileSizeKB: {
      type: Number,
      default: 0,
    },
    value: {
      type: Array,
    },
    accept: {
      type: String,
      default: '.pdf',
    },
    uploadType: {
      type: String,
      default: 'default',
    },
  },
  data() {
    return {
      interval: {},
      status: ['active', 'success', 'exception'],
    }
  },
  computed: {
    uploadBaseUrl() {
      return process.env.VUE_APP_UPLOAD_BASE_URL
    },
    uploadBaseDomain() {
      // VUE_APP_UPLOAD_BASE_DOMAIN
      return process.env.VUE_APP_UPLOAD_BASE_DOMAIN
    },
  },
  methods: {
    handleDeletFile(item) {
      this.$emit(
        'change',
        (this.value || []).filter((file) => {
          console.log(file, item)
          return file.id != item.id
        })
      )
    },
    handleFileChange(file) {
      this.$emit(
        'change',
        (this.value || []).map((item) => {
          return item.id == file.id ? file : item
        })
      )
    },
    customRequest(options, name) {
      if (this.maxFileSizeKB > 0 && options.file.size > this.maxFileSizeKB * KB) {
        this.$message.error(`上传附件大小不得超过${this.maxFileSizeKB}K`)
        return
      }
      if (options.file.size > MB * this.maxFileSize) {
        this.$message.error(`上传附件大小不得超过${this.maxFileSize}M`)
        return
      }
      const data = new FormData()
      data.append('file', options.file)
      data.append('biz', this.uploadType)
      const id = (new Date() - 0).toString()
      // 0 上传中  1上传成功  2上传失败
      this.$emit('change', [...(this.value || []), { options, id, status: 0, progress: 10, name: options.file.name }])
      // 进度条
      this.interval[id] = setInterval(() => {
        const item = (this.value || []).find((item) => item.id === id)
        if (!item) return
        if (item.progress >= 90) {
          clearInterval(this.interval[id])
        }

        this.handleFileChange({
          ...item,
          progress: item.progress + 4,
        })
      }, 500)
      upload(data)
        .then((response) => {
          clearInterval(this.interval[id])
          const item = (this.value || []).find((item) => item.id === id)
          this.handleFileChange({
            ...item,
            response: {
              ...response,
              message: `${this.uploadBaseUrl}${response.message}`,
            },
            status: 1,
            progress: 100,
          })
        })
        .catch(() => {
          const item = (this.value || []).find((item) => item.id === id)
          this.handleFileChange({
            ...item,
            response,
            status: 2,
            progress: 100,
          })
        })
    },
  },
}
</script>


<style lang="less" scoped>
.filelist {
  margin-top: 20px;
  width: 100%;
  min-height: 40px;
  height: fit-content;
  display: flex;
  .file {
    width: 336px;
    height: 40px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    padding: 0 16px;
    margin-right: 10px;
    margin-bottom: 10px;
    display: flex;
    cursor: pointer;
    user-select: none;
    align-items: center;
    position: relative;
    span {
      display: block;
      font-size: 14px;
      margin-left: 4px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: left;
      color: #595959;
      line-height: 14px;
      flex: 1;
    }
    .progress {
      position: absolute;
      width: 100%;
      bottom: -9px;
      left: 0;
    }
  }
}
</style>