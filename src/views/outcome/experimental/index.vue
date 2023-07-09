<template>
  <page-header-wrapper>
    <div class="container">
      <div class="search-tab">
        <a-tabs v-model="activeKey" @change="handleTabChange">
          <a-tab-pane key="submitList" forceRender v-if="jurisdiction('experimental:submitShow') > -1 ? true : false">
            <div slot="tab">我提交的</div>
            <submit-list ref="submitList" />
          </a-tab-pane>
          <a-tab-pane key="applyList" forceRender  v-if="jurisdiction('experimental:auditShow') > -1 ? true : false">
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
export default {
  components: {
    PageHeaderWrapper,
    ApplyList,
    SubmitList,
  },
  data() {
    return {
           activeKey: this.jurisdiction('experimental:submitShow') > -1 ? 'submitList' : 'applyList',

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
    handleTabChange(key){
      this.$refs[key].dataList()
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
  }
}
</style>