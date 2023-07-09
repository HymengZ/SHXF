<template>
  <div class="team-manage">
    <div class="top-title">
      <span>队伍/处室管理</span>
    </div>
    <div class="search-tab">
      <a-tabs v-model="activeTab" @change="changeTab">
        <a-tab-pane :key="1">
          <div slot="tab">待认领用户</div>
          <wait-claim ref="waitClaim" />
        </a-tab-pane>
        <a-tab-pane :key="2">
          <div slot="tab">已认领用户</div>
          <already-claim ref="alreadyClaim" />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script>
import AlreadyClaim from './alreadyClaim.vue'
import WaitClaim from './waitClaim.vue'
export default {
  components: {
    AlreadyClaim,
    WaitClaim,
  },
  data() {
    return {
      activeTab: 1,
    }
  },
  created() {
    // 临时
    this.changeTab(1)
  },
  methods: {
    changeTab(e) {
      if (e === 1) {
        this.activeTab = 1
        this.$nextTick(() => {
          this.$refs.waitClaim.getDataList()
        })
      } else {
        this.activeTab = 2
        this.$nextTick(() => {
          this.$refs.alreadyClaim.getDataList()
        })
      }
    },
  },
}
</script>
<style lang="less" scoped>
.team-manage {
  .top-title {
    margin-bottom: 16px;
    font-size: 18px;
    font-weight: 500;
    text-align: left;
    color: rgba(0, 0, 0, 0.85);
    line-height: 20px;
    padding: 8px 0;
  }
  .search-tab {
    /deep/ .ant-tabs {
      .ant-tabs-top-bar {
        border: 1px solid #e8e8e8;
        margin: 0;
      }
      .ant-tabs-nav-scroll {
        padding: 0 20px;
      }
    }
  }
}
</style>
