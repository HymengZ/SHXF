<template>
  <page-header-wrapper>
    <div class="container">
      <div class="search-tab">
        <a-tabs v-model="activeKey" @change="handleTabsChange" >
          <a-tab-pane key="issueList" v-if="jurisdiction('demonstration:issueShow') > -1 ? true : false">
            <div slot="tab">已发布的</div>
            <issue-list ref="issueList" />
          </a-tab-pane>
          <a-tab-pane key="submitList"  v-if="jurisdiction('demonstration:submitShow') > -1 ? true : false">
            <div slot="tab">我提交的</div>
            <submit-list ref="submitList" />
          </a-tab-pane>
          <a-tab-pane key="applyList"   v-if="jurisdiction('demonstration:auditShow') > -1 ? true : false">
            <div slot="tab">我审核的</div>
            <apply-list ref="applyList" />
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </page-header-wrapper>
</template>

<script>
import { USER_AUTH } from '@/store/mutation-types'
import PageHeaderWrapper from '../../../components/PageHeaderWrapper'
import SubmitList from './components/SubmitList'
import ApplyList from './components/ApplyList'
import IssueList from './components/IssueList'
export default {
  components: {
    PageHeaderWrapper,
    ApplyList,
    SubmitList,
    IssueList
  },
  data() {
    return {
      // activeKey: 'issueList',
           activeKey: this.jurisdiction('demonstration:issueShow') > -1 ? 'issueList' : this.jurisdiction('demonstration:submitShow') > -1 ?'submitList': (this.jurisdiction('demonstration:auditShow') > -1 ?'applyList':'')

    }
  },
  methods: {
          //遍历权限
    jurisdiction(e) {
      let jurisdictionArr = []
      jurisdictionArr = JSON.parse(sessionStorage.getItem(USER_AUTH))
      return jurisdictionArr.findIndex((item) => {
        return item.action == e
      })
    },
    handleTabsChange(key){
      this.$refs[key] && this.$refs[key].handleFetchList()
    }
  }
}
</script>

<style lang="less">
.container {
  .ant-tabs-nav-scroll {
    padding: 0 20px;
  }
}
</style>
<style lang="less" scoped>
.container {
  
  .search-tab {
    background: #fff;
    margin-top: 20px;
    padding-bottom: 30px;
  }
}
</style>