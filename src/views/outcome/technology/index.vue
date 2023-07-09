<template>
  <page-header-wrapper>
    <a-row class="technology-container">
      <!-- 左边页面 -->
      <div class="left">
        <tree @change="queryParams = $event" />
      </div>
      <!-- 右边页面 -->
      <div class="right">
        <article-list :query-params="queryParams" />
      </div>
    </a-row>
  </page-header-wrapper>
</template>

<script>
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import Tree from './components/Tree'
import ArticleList from './components/ArticleList'

export default {
  components: {
    PageHeaderWrapper,
    Tree,
    ArticleList,
  },
  data() {
    return {
      queryParams: {
        activeId: '', // 目录树ID
        activeType: '' // 目录类型，为'1'(选中年度)时不允许添加目录文章
      },
      // 分页
      pagination: {
        total: 85,
        pageSize: 5,
        current: 1,
      },

      // 数据
      list: [],
    }
  },

  methods: {},
}
</script>
<style lang="less" scoped>
.technology-container {
  min-height: calc(100vh - 252px);
  display: flex;
  align-items: stretch;
  background: #fff;
  margin-top: 15px;
  .left {
    background: #fff;
    border-right: 1px solid #e8e8e8;
    width: 240px;
  }

  .right {
    padding: 24px;
    flex: 1;
  }
}
</style>
