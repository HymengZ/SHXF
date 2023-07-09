<template>
  <div class="top-message">
    <div class="top-message-title">账号信息</div>
    <div class="top-message-data">
      <div class="avatar">
        <div class="image" @click="$refs.upload.click()">
          <img
            v-if="imageUrl"
            :src="uploadBaseDomain + imageUrl"
            alt="avatar"
            style="width: 115px; height: 115px; display: block; border-radius: 60px"
            @error="imageUrl = ''"
          />
          <a-avatar v-else :size="110" icon="user" style="font-size: 70px" />
        </div>
        <div class="avatar-text">点击图片修改头像</div>
        <input type="file" accept="image/*" ref="upload" style="display: none" @change="handleUpload" />
      </div>
      <a-row style="flex: 1">
        <a-col :span="16">
          <div class="info">
            <div class="info-account">账号：{{ userInfo.username | formatPhone }}</div>
            <div class="info-details">
              <div class="text">
                最新登录时间：<span>{{ loginTime | formatTime }}</span>
              </div>
              <div class="text">账号注册时间：{{ userInfo.createTime | formatTime }}</div>
              <slot name="other" class="text"> </slot>
            </div>
          </div>
        </a-col>
        <a-col :span="8">
          <div class="speed">
            <slot name="speed"> </slot>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script>
import { formatMinute } from '@/utils/formatDate'
import { USER_LOGIN_TIME } from '@/store/mutation-types'
import { upload } from '@/api/upload'
export default {
  props: {
    // 用户全部信息
    userInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      // 用户登录时间
      loginTime: '',
      imageUrl: '',
    }
  },
  filters: {
    formatTime(e) {
      return formatMinute(e)
    },
    formatPhone(e) {
      const reg = /^(\d{3})\d{4}(\d{4})$/
      return e.replace(reg, '$1****$2')
    },
  },
  computed: {
    uploadBaseDomain() {
      return process.env.VUE_APP_API_BASE_URL + '/'
    },
  },
  mounted() {
    // 获取用户登录时间
    this.loginTime = this.$ls.get(USER_LOGIN_TIME) || '无'
    // 获取用户头像
    this.imageUrl = this.userInfo.avatar
  },
  methods: {
    async handleUpload(e) {
      let type = e.target.files[0].type
      const typeList = ['image/jpeg', 'image/png']
      if (typeList.indexOf(type) != -1) {
        const data = new FormData()
        data.append('file', e.target.files[0])
        data.append('biz', 'avatar')
        const url = await upload(data)
        this.imageUrl = url.message
      } else {
        this.$message.warning('请上传图片格式的文件')
      }
    },
    getImageUrl() {
      return this.imageUrl || ''
    },
  },
}
</script>
<style lang="less" scoped>
.top-message {
  &-title {
    margin-bottom: 16px;
    font-size: 18px;
    font-weight: 500;
    text-align: left;
    color: rgba(0, 0, 0, 0.85);
    line-height: 20px;
    padding: 8px 0;
  }
  &-data {
    display: flex;
    .avatar {
      .avatar-text {
        font-size: 13px;
        font-weight: 400;
        text-align: center;
        color: #bfbfbf;
        line-height: 14px;
        margin-top: 4px;
      }
    }
    .info {
      flex: 1;
      margin-left: 16px;
      .info-account {
        font-size: 24px;
        font-weight: 500;
        text-align: left;
        color: #262626;
        line-height: 30px;
        margin-bottom: 8px;
      }
      .info-details {
        font-size: 14px;
        font-weight: 400;
        text-align: left;
        color: #595959;
        line-height: 16px;
        .text {
          margin-bottom: 10px;
          span {
            color: #009dff;
          }
        }
      }
    }
  }
}
</style>
