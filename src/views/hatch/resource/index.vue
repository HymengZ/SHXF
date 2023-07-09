<template>
  <page-header-wrapper>
    <div class="container">
      <div class="search-tab">
        <a-tabs v-model="activeKey" @change="tabChange">
          <a-tab-pane :key="1" v-if="jurisdiction('establishment:submitShow') > -1 ? true : false">
            <div slot="tab">已发布的</div>
            <search ref="releaseSearch" @searchParams="getSearchParams" />
            <published-list
              ref="release"
              :resourceData="resourceData"
              :pagination="pagination"
              :loading="loading"
              @addContactUs="addContactUs"
            />
          </a-tab-pane>

          <a-tab-pane :key="2" v-if="jurisdiction('establishment:auditShow') > -1 ? true : false">
            <div slot="tab">我提交的</div>
            <search ref="submitSearch" @searchParams="getSearchParams" />
            <submit-list
              v-if="resourceData.length > 0"
              ref="submit"
              :resourceData="resourceData"
              :pagination="pagination"
              :loading="loading"
              @refreshList="dataList"
              @deleteData="deleteData"
              @operateData="operateData"
            />
            <submit-list-empty v-else @refreshList="dataList" />
          </a-tab-pane>
          <a-tab-pane :key="3" v-if="jurisdiction('establishment:auditShow') > -1 ? true : false">
            <div slot="tab">我审核的</div>
            <search ref="auditSearch" @searchParams="getSearchParams" />
            <audit-list
              ref="audit"
              :resourceData="resourceData"
              :pagination="pagination"
              :loading="loading"
              @refreshList="dataList"
              @operateData="operateData"
            />
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </page-header-wrapper>
</template>
<script>
import { USER_AUTH } from '@/store/mutation-types'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import search from '../components/search'
import SubmitList from './components/SubmitList/index.vue'
import SubmitListEmpty from './components/SubmitList/submitListEmpty.vue'
import AuditList from './components/AuditList/index.vue'
import PublishedList from './components/PublishedList/index.vue'
import { listByDictCode } from '@/api/listByDictCode'
import { getNewYear } from '@/utils/year'
// 引入请求
import { fetchResourceList, deleteResource, handleResource, addContactUs } from '@/api/hatch/resource'
export default {
  components: {
    PageHeaderWrapper,
    search,
    AuditList,
    SubmitList,
    SubmitListEmpty,
    PublishedList,
  },
  data() {
    return {
      activeKey: 1,
      // 资源数据
      resourceData: [],
      // 搜索参数
      searchParams: {},
      options: [
        {
          label: '资源类型',
          item: 'type',
          filterState: [
            {
              label: '全部',
              checked: true,
              value: '',
            },
          ],
        },
        {
          label: '资源状态',
          item: 'status',
          filterState: [
            {
              label: '全部',
              checked: true,
              value: '',
            },
            {
              label: '待提交',
              checked: false,
              value: '0',
            },
            {
              label: '待审核',
              checked: false,
              value: '1',
            },
            {
              label: '审核不通过',
              checked: false,
              value: '3',
            },
            {
              label: '寻求合作',
              checked: false,
              value: '6',
            },
            {
              label: '已下架',
              checked: false,
              value: '7',
            },
            {
              label: '待退回',
              checked: false,
              value: '4',
            },
            {
              label: '已退回',
              checked: false,
              value: '5',
            },
          ],
        },
        getNewYear(),
      ],
      auditFilterStatus: [
        {
          label: '全部',
          checked: true,
          value: '',
        },
        {
          label: '待审核',
          checked: false,
          value: '1',
        },
        {
          label: '审核通过',
          checked: false,
          value: '2',
        },
        {
          label: '审核不通过',
          checked: false,
          value: '3',
        },
        {
          label: '寻求合作',
          checked: false,
          value: '6',
        },
        {
          label: '已下架',
          checked: false,
          value: '7',
        },
        {
          label: '待退回',
          checked: false,
          value: '4',
        },
        {
          label: '已退回',
          checked: false,
          value: '5',
        },
      ],
      pagination: {
        total: 0,
        pageSize: 10,
        showLessItems: true,
        showTotal: (total) => `共 ${total} 条`,
        showSizeChanger: true,
        current: 1,
        onChange: this.pageChange.bind(this),
        onShowSizeChange: this.pageChange.bind(this),
      },
      loading: false,
    }
  },
  computed: {
    // 获取路由参数
    routerKey() {
      return this.$route.query.activeKey || ''
    },
  },
  created() {
    // 新注册外部用户发布科技资源
    if (this.routerKey) {
      this.activeKey = 2
    }
    // 获取搜索框数据
    this.getListByDictCode()
    this.dataList()
  },
  methods: {
    //pageSize 变化的回调
    pageChange(page, pageSize) {
      this.pagination.current = page || 1
      this.pagination.pageSize = pageSize
      this.dataList()
    },
    getSearchParams(params) {
      let result = {
        status: params.status ? params.status.toString() : '',
        type: params.type ? params.type.toString() : '',
        year: params.year ? params.year.toString() : '',
      }
      this.searchParams = {}
      this.searchParams = result
      this.dataList()
    },
    // 请求列表数据
    async dataList() {
      this.loading = true
      let params = Object.assign(
        {},
        {
          flag: this.activeKey,
          pageNo: this.pagination.current,
          pageSize: this.pagination.pageSize,
        },
        this.searchParams
      )
      const { success, message, result } = await fetchResourceList(params)
      if (success) {
        this.resourceData = result.records
        this.loading = false
        this.pagination.total = result.total
      } else {
        this.$message.warning(message || '请求列表数据失败')
      }
    },
    // 删除数据
    async deleteData(id) {
      const { success, message } = await deleteResource(id)
      if (success) {
        this.dataList()
        this.$message.success(message)
      } else {
        this.$message.warning(message)
      }
    },
    // 操作数据
    async operateData(params) {
      const { success, message } = await handleResource(params)
      if (success) {
        this.dataList()
        this.$message.success(message)
      } else {
        this.$message.warning(message)
      }
    },
    // 联系我们
    async addContactUs(params) {
      const { success, message } = await addContactUs(params)
      if (success) {
        this.dataList()
        this.$message.success(message || '操作成功')
      } else {
        this.$message.warning(message)
      }
    },
    //遍历权限
    jurisdiction(e) {
      let jurisdictionArr = []
      jurisdictionArr = JSON.parse(sessionStorage.getItem(USER_AUTH))
      return jurisdictionArr.findIndex((item) => {
        return item.action == e
      })
    },
    async getListByDictCode() {
      const { success, message, result } = await listByDictCode('resource_type')
      if (!success) {
        this.$message.warning(message)
      }
      this.formatData(result)
      this.initSearch(this.activeKey)
    },
    // 格式化数据字典数据
    formatData(e) {
      var array = []
      for (const item of e) {
        let itemObj = {
          label: item.itemText,
          value: item.itemValue,
          checked: false,
        }
        array.push(itemObj)
      }
      this.options[0].filterState = [...this.options[0].filterState, ...array]
    },
    tabChange(e) {
      this.activeKey = e
      this.searchParams = {}
      this.initSearch(e)
      this.dataList()
    },
    // 初始化查询
    initSearch(e) {
      const options = this.options
      let releaseFilterData = options.filter((item) => item.label != '资源类型')
      let auditFilterData = JSON.parse(JSON.stringify(options))
      if (e == 3) {
        auditFilterData[1].filterState = this.auditFilterStatus
      }
      this.$nextTick(() => {
        switch (e) {
          case 1:
            this.$refs['releaseSearch'].handleReset()
            this.$refs['releaseSearch'].init(releaseFilterData)
            break
          case 2:
            this.$refs['submitSearch'].handleReset()
            this.$refs['submitSearch'].init(options)
            break
          case 3:
            this.$refs['auditSearch'].handleReset()
            this.$refs['auditSearch'].init(auditFilterData)
            break
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
.ant-tabs {
  .ant-tabs-tabpane {
    background: #f0f2f5;
  }
}
/deep/ .ant-tabs-ink-bar {
  transition: transform 0.5s ease !important;
}
</style>
