<template>
  <page-header-wrapper>
    <div class="container">
      <div class="search-tab">
        <a-tabs v-model="activeKey" @change="handleTabChange">
          <a-tab-pane key="submitList">
            <div slot="tab">我提交的</div>
            <submit-list ref="submitList" />
          </a-tab-pane>
          <a-tab-pane key="applyList" v-if="button.indexOf('outcome:catalog:apply') >= 0">
            <div slot="tab">我审核的</div>
            <apply-list ref="applyList" />
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </page-header-wrapper>
</template>

<script>
import { mapState } from 'vuex'
import PageHeaderWrapper from '../../../components/PageHeaderWrapper'
import SubmitList from './components/SubmitList'
import ApplyList from './components/ApplyList'
export default {
  components: {
    PageHeaderWrapper,
    ApplyList,
    SubmitList,
  },
  computed: {
    ...mapState({
      button: (state) => state.user.button,
    }),
  },
  data() {
    return {
      activeKey: 'submitList',
    }
  },
  methods: {
    handleTabChange(key) {
      this.$refs[key].dataList()
    },
  },
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