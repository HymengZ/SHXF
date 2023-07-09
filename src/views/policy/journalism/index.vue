<template>
  <page-header-wrapper>
    <div class="container">
      <div class="search-tab">
        <a-tabs v-model="activeKey">
          <a-tab-pane key="releaseList" v-if="jurisdiction('journalism:releaseShow') > -1 ? true : false">
            <div slot="tab">已发布的</div>
            <ReleaseList :typeList="typeList"></ReleaseList>
          </a-tab-pane>
          <a-tab-pane key="submitList" v-if="jurisdiction('journalism:submitShow') > -1 ? true : false">
            <div slot="tab">我提交的</div>
            <submit-list :typeList="typeList" />
          </a-tab-pane>
          <a-tab-pane key="applyList" v-if="jurisdiction('journalism:applyShow') > -1 ? true : false">
            <div slot="tab">我审核的</div>
            <apply-list :typeList="typeList" />
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </page-header-wrapper>
</template>

<script>
import { USER_AUTH } from '@/store/mutation-types'
import { getAction } from '@/api/manage.js'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import SubmitList from './components/SubmitList'
import ApplyList from './components/ApplyList'
import ReleaseList from './components/ReleaseList'
export default {
  components: {
    PageHeaderWrapper,
    ApplyList,
    SubmitList,
    ReleaseList,
  },
  data() {
    return {
      activeKey:
        this.jurisdiction('journalism:releaseShow') > -1
          ? 'releaseList'
          : this.jurisdiction('journalism:submitShow') > -1
          ? 'submitList'
          : 'applyList',
      typeList: [],
    }
  },
  mounted() {
    //类型list
    this.typeData()
  },
  methods: {
    //便利权限
    jurisdiction(e) {
      let jurisdictionArr = []
      jurisdictionArr = JSON.parse(sessionStorage.getItem(USER_AUTH))
      return jurisdictionArr.findIndex((item) => {
        return item.action == e
      })
    },
    typeData() {
      getAction('/sys/dict/getDictItems/news_type', { type: 'news_type' }).then((res) => {
        if (res.success) {
          let arr = []
          for (const i of res.result) {
            let obj = {
              label: i.title,
              value: i.value,
            }
            arr.push(obj)
          }
          this.typeList = arr
          // this.$message.success(res.message || '查询成功')
        } else {
          this.$message.warning(res.message || '查询失败')
        }
      })
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