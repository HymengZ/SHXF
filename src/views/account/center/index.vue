<template>
  <page-header-wrapper>
    <div class="contianer">
      <div class="search-tab">
        <a-card class="no-margin">
          <a-tabs v-model="activeTab" tab-position="left" @change="changeTab">
            <a-tab-pane :forceRender="true" :key="1" tab="账号信息">
              <outside-account-message
                v-if="userInfo.userType == 0"
                :userInfo="userInfo"
                :userUnit="userUnit"
                @update="updateUserInfo"
                @refreshUnit="getUserInfo"
              />
              <inside-accountmsg-fireman
                v-else-if="userInfo.userType == 1"
                :userInfo="userInfo"
                :userUnit="userUnit"
                @update="updateUserInfo"
              />
              <!-- <inisde-accountmsg-administrators /> -->
            </a-tab-pane>
            <a-tab-pane :forceRender="true" :key="2" tab="修改密码">
              <modify-password :username="userInfo.username" />
            </a-tab-pane>
            <a-tab-pane :forceRender="false" :key="3" tab="修改手机号"> <modify-phone /></a-tab-pane>
            <a-tab-pane :forceRender="false" :key="4" tab="邀请函管理">
              <invitation-manage :userUnit="userUnit" />
            </a-tab-pane>
            <a-tab-pane :key="5" tab="队伍/处室管理"> <team-manage /></a-tab-pane>
          </a-tabs>
        </a-card>
      </div>
    </div>
  </page-header-wrapper>
</template>
<script>
import { USER_INFO } from '@/store/mutation-types'
import { fetchUserInfo, updateUserInfo } from '@/api/center/userInfo'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import OutsideAccountMessage from './components/outside/accountMessage.vue'
import InsideAccountmsgFireman from './components/inside/accountMsgFireman.vue'
import InisdeAccountmsgAdministrators from './components/inside/accountMsgAdministrators.vue'
import ModifyPassword from './components/modifyPassword'
import ModifyPhone from './components/modifyPhone'
import InvitationManage from './components/inside/invitationManage'
import TeamManage from './components/inside/TeamManage/index.vue'
export default {
  components: {
    PageHeaderWrapper,
    OutsideAccountMessage,
    InsideAccountmsgFireman,
    InisdeAccountmsgAdministrators,
    ModifyPassword,
    ModifyPhone,
    InvitationManage,
    TeamManage,
  },

  data() {
    return {
      userInfo: {},
      userUnit: {},
      activeTab: 1,
    }
  },
  mounted() {
    // 获取用户信息
    this.getUserInfo()
  },
  methods: {
    changeTab(e) {
      this.activeTab = e
    },
    // 获取用户信息
    async getUserInfo() {
      const { result, success, message } = await fetchUserInfo()
      if (!success) {
        this.$message.warning(message)
        return
      }
      this.userInfo = result.userInfo
      this.userUnit = result.userUnit
    },
    // 更新用户信息
    async updateUserInfo(data) {
      const { success, message } = await updateUserInfo(data)
      if (!success) {
        this.$message.warning(message)
        return
      }
      // 为了刷新本地存储的数据
      this.refreshStorage()
      this.$message.success(message || '更新成功')
    },
    async refreshStorage() {
      const { success, message, result } = await fetchUserInfo()
      if (!success) {
        this.$message.warning(message)
      }
      const userInfo = result.userInfo
      this.$ls.set(USER_INFO, userInfo, 7 * 24 * 60 * 60 * 1000)
    },
  },
}
</script>
<style lang="less" scoped>
.contianer {
  .search-tab {
    background: #fff;
    margin-top: 20px;
    /deep/ .no-margin > .ant-card-body {
      padding: 0;
    }
    /deep/ .ant-tabs {
      .ant-tabs-nav-container {
        margin-top: 16px;
      }
      .ant-tabs-left-bar {
        width: 200px;
        .ant-tabs-tab {
          text-align: left;
        }
        .ant-tabs-tab-active {
          background: rgba(0, 145, 255, 0.1);
          text-align: left;
          color: #0091ff;
        }
      }
      .ant-tabs-left-content {
        padding: 16px 24px;
      }
    }
  }
}
</style>