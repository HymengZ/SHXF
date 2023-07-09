<template>
  <div class="article-container">
    <div class="actions" v-has="'outcome:technology:add'">
      <a-button type="primary" @click="handleOpenArticleModal">
        <a-icon type="plus" />
        新增目录文章
      </a-button>
    </div>

    <!-- list页 -->
    <div class="table">
      <a-list item-layout="horizontal" :data-source="list" :pagination="false" :loading="loading">
        <a-list-item slot="renderItem" slot-scope="item">
          <a-list-item-meta>
            <div slot="description" class="description">
              <div>发布时间：{{ item.createTime }}</div>
              <div>阅读：{{ item.readAmount }}</div>
              <div>
                <a-dropdown>
                  <a-button v-has="'outcome:technology:more'">更多操作</a-button>
                  <a-menu slot="overlay">
                    <a-menu-item
                        :disabled="item.processStatus === '-1'"
                        key="unpublish"
                        @click="handleTogglePublishStatus(item)"
                        v-has="'outcome:technology:down'"
                    >
                      下架
                    </a-menu-item>
                    <a-menu-item
                        key="edit"
                        @click="handleEdit(item)"
                        :disabled="item.processStatus === '1'"
                        v-has="'outcome:technology:edits'"
                    >编辑
                    </a-menu-item
                    >
                    <a-menu-item
                        key="delete"
                        @click="handleDelete(item)"
                        :disabled="item.processStatus === '1'"
                        v-has="'outcome:technology:deletes'"
                    >删除
                    </a-menu-item
                    >
                  </a-menu>
                </a-dropdown>
                <a-divider type="vertical"/>
                <a-button ghost type="primary" @click="handleNavigateToDetai(item)">目录详情</a-button>
              </div>
            </div>
            <h3 slot="title" class="item-title">
              {{ item.catalogueName }} <span class="title_span" v-if="item.processStatus === '-1'"> 已下架 </span>
            </h3>
          </a-list-item-meta>
        </a-list-item>
      </a-list>
    </div>
    <div class="pagination">
      <a-pagination
          :total="pagination.total"
          :show-total="(total) => `共 ${total} 条`"
          :page-size="pagination.pageSize"
          :current="pagination.current"
          @change="handlePaginationChange"
          :pageSizeOptions="['5', '10', '20', '50']"
          @showSizeChange="handleShowSizeChange"
          show-quick-jumper
          show-size-changer
      />
    </div>
    <j-modal
        title="科技成果目录编辑/新增"
        :visible="articleVisible"
        switchFullscreen
        :fullscreen="true"
        @ok="handleOk"
        okText="保存并发布"
        @cancel="handleCancel"
        cancelText="关闭"
    >
      <article-modal ref="articleModal"/>
    </j-modal>
  </div>
</template>

<script>
import moment from 'moment'
import ArticleModal from './components/ArticleModal'
import {fetchArticle, unpublishArticle, deleteArticle, addArticle, updateArticle} from '@/api/outcome/technology'

export default {
  components: {
    ArticleModal,
  },
  data() {
    return {
      // 分页
      loading: false,
      pagination: {
        total: 0,
        pageSize: 5,
        current: 1,
      },
      articleVisible: false,
      // 数据
      list: [],

      formData: {},
    }
  },
  props: {
    queryParams: {
      type: Object,
    },
  },
  mounted() {
    this.handlefetchArticle()
  },
  methods: {
    //添加/详情弹框确定按钮
    handleOk() {
      this.$refs.articleModal.validateFields().then((val) => {
        if (this.formData.id) {
          updateArticle({
            ...this.formData,
            ...val,
            levelId: this.queryParams.activeId,
            publishTime: moment(val.publishTime).format('YYYY-MM-DD HH:mm:ss'),
          }).then((res) => {
            if (!res.success) {
              this.$message.error(res.message)
              return;
            }
            this.handleCancel()
            this.handlefetchArticle()
          })
        } else {
          if (!this.queryParams.activeId || this.queryParams.activeType !== '2') {
            this.$message.error('请选择左侧目录')
            return
          }
          addArticle({
            ...val,
            levelId: this.queryParams.activeId,
            publishTime: moment(val.publishTime).format('YYYY-MM-DD HH:mm:ss'),
          }).then((res) => {
            if (!res.success) {
              this.$message.error(res.message)
              return;
            }
            this.handleCancel()
            this.handlefetchArticle()
          })
        }
      })
    },

    // 跳转到详情
    handleNavigateToDetai(item) {
      this.$router.push(`/outcome/technology/preview/${item.id}`)
    },
    // 删除文章
    handleDelete(item) {
      this.$confirm({
        title: '删除',
        content: (
            <p>
              确定删除？ <br/>
              删除后将无法在列表中查询到此条信息，请谨慎操作。
            </p>
        ),
        onOk: () => {
          deleteArticle(item.id).then((res) => {
            this.handlefetchArticle()
          })
        },
      })
    },

    // 编辑文章
    handleEdit(item) {
      this.formData = item
      this.articleVisible = true
      setTimeout(() => {
        this.$refs.articleModal.setFieldsValue(item)
      })
    },
    // 下架文章
    handleTogglePublishStatus(item) {
      this.$confirm({
        title: '下架',
        content: (
            <p>
              确定下架？ <br/>
              下架后该信息可删除/编辑/退回。
            </p>
        ),
        onOk: () => {
          unpublishArticle(item.id).then((res) => {
            this.handlefetchArticle()
          })
        },
      })
    },
    // 分页大小改变
    handleShowSizeChange(current, size) {
      this.pagination.current = current
      this.pagination.pageSize = size
      this.handlefetchArticle()
    },
    // 页码改变
    handlePaginationChange(page) {
      this.pagination.current = page
      this.handlefetchArticle()
    },

    // 获取科技成果目录文章
    handlefetchArticle() {
      this.loading = true
      fetchArticle({
        levelId: this.queryParams.activeId,
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
      }).then((res) => {
        if (!res.success) {
          this.$message.error(res.message);
          return;
        }
        this.loading = false
        this.list = res.result.records
        this.pagination = {
          ...this.pagination,
          curent: res.result.pages,
          pageSize: res.result.size,
          total: res.result.total,
        }
      })
    },

    handleCancel() {
      this.articleVisible = false
      this.formData = {}
      this.$refs.articleModal.resetFields()
    },
    //新增
    handleOpenArticleModal() {
      if (!this.queryParams.activeId || this.queryParams.activeType !== '2') {
        this.$message.error('请选择左侧目录')
        return
      }
      this.articleVisible = true
    },
  },
  watch: {
    queryParams() {
      this.pagination.current = 1
      this.handlefetchArticle()
    },
  },
}
</script>

<style lang="less" scoped>
.article-container {
  height: 100%;

  display: flex;
  flex-direction: column;

  .actions {
    height: 32px;
  }

  .title_span {
    font-size: 12px;
    color: #8c8c8c;
  }

  .item-title {
    font-size: 16px;
  }

  .table {
    flex: 1;
    padding-top: 10px;

    .description {
      margin-top: 25px;
      margin-bottom: -5px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
  }

  .pagination {
    display: block;
    text-align: center;
  }
}
</style>