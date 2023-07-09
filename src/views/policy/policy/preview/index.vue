<template>
  <page-header-wrapper  show-back>
    <div class="container">
      <div class="search-tab">
        <policy-info :content="content">
          <div slot="message" class="message">
            <div>发布单位：{{ content.publishUnit }}</div>
            <div>发布时间：{{ content.publishTime }}</div>
            <div>阅读：{{ content.readAmount }}</div>
          </div>
        </policy-info>
      </div>
    </div>
  </page-header-wrapper>
</template>

<script>
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import { getAction } from '@/api/manage.js'
import policyInfo from '../../components/policyInfo.vue'
export default {
  data() {
    return {
      id: '',
      content: {},
    }
  },
  components: { policyInfo, PageHeaderWrapper },
  mounted() {
    this.id = this.$route.params.id
    this.dataInfo()
  },
  methods: {
    //详情
    dataInfo() {
      getAction('/fire/controlPolicy/queryById', { id: this.id }).then((res) => {
        if (res.success) {
          this.content = res.result
          this.date = res.result.publishTime
          this.$message.success(res.message || '查询成功')
        } else {
          this.$message.warning(res.message || '查询失败')
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.container {
  .search-tab {
    background: #fff;
    margin-top: 20px;
  }
  .ant-tabs-nav-scroll {
    padding: 0 20px;
  }
}
.message {
  color: #c3c3c3;
  line-height: 300%;
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>