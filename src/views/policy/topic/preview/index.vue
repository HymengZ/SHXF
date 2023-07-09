<template>
  <page-header-wrapper  show-back>
    <div class="container">
      <div class="search-tab">
        <a-card>
          <p class="title">消防救援</p>
          <p class="dateTime">发布时间：{{ date }}</p>
          <div v-html="content" style="white-space: pre-wrap"></div>
        </a-card>
      </div>
    </div>
  </page-header-wrapper>
</template>

<script>
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import { getAction } from '@/api/manage.js'
export default {
  data() {
    return {
      content: '',
      id: '',
      date: '',
    }
  },
  components: {
    PageHeaderWrapper,
  },
  mounted() {
    this.id = this.$route.params.id
    this.dataInfo()
  },
  methods: {
    //话题详情
    dataInfo() {
      getAction('/fire/topic/queryById', { id: this.id }).then((res) => {
        if (res.success) {
          this.content = res.result.content
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
p {
  margin: 0;
  padding: 0;
}
.title {
  text-align: center;
  font-size: 28px;
  font-weight: 600;
  line-height: 300%;
  border-bottom: 1px solid #c3c3c3;
}
.ant-card {
  border-top: 5px solid #1890ff;
  /deep/.ant-card-body {
    padding-top: 0;
  }
}
.dateTime {
  color: #c3c3c3;
  text-align: center;
  line-height: 300%;
}
</style>