<template>
  <div class="submit-container">
    <div class="search-form">
      <tag-check-box label="新闻类别" :options="typeList" v-model="newstype" />
    </div>
    <div class="table">
      <a-row class="search" type="flex" justify="start">
        <a-col :span="8">
          <a-input-group compact>
            <a-select v-model="searchParams.searchType" style="display: inline-block; width: 160px">
              <a-select-option value="PROJECT_NAME"> 新闻名称 </a-select-option>
              <a-select-option value="PROJECT_number"> 新闻编号 </a-select-option>
              <a-select-option value="PROJECT_unit"> 发布单位 </a-select-option>
            </a-select>
            <a-input style="width: calc(100% - 160px)" allowClear v-model="title" placeholder="请输入" />
          </a-input-group>
        </a-col>
        <a-button type="primary" style="margin-left: 8px" @click="search">搜索</a-button>
      </a-row>
      <a-card :loading="loading">
        <div class="data" v-for="(item, index) in list" :key="index">
          <div class="icon">
            <a-icon type="read" />
          </div>
          <h4 class="content">
            <div class="title">
              <span>{{ item.title }}</span>
              <a-badge :color="item.color" class="numberStyle" :text="item.typeTitle" />
            </div>
            <a-row style="display: flex; margin-bottom: 10px">
              <a-col span="16" class="particulars">
                <div>新闻编号：{{ item.number }}</div>
                <div>创建时间：{{ item.createTime }}</div>
                <div>新闻类别：{{ typeFun(item.type) }}</div>
                <div>发布时间：{{ item.publishTime }}</div>
                <div>发布单位：{{ item.publishUnit }}</div>
                <div></div>
                <div>阅读：{{ item.readAmount }}</div>
              </a-col>
              <a-col span="8">
                <div class="action">
                  <div>
                    <a-button style="border: 1px solid #40a9ff; color: #40a9ff" @click="journalismInfo(item)"
                      >新闻详情</a-button
                    >
                  </div>
                </div>
              </a-col>
            </a-row>
          </h4>
        </div>
        <a-pagination
          class="pagination"
          show-size-changer
          show-quick-jumper
          :page-size-options="pageSizeOptions"
          :show-total="(total) => `共： ${total} 条`"
          :total="pagination.total"
          :pageSize="pagination.pageSize"
          :current="pagination.pageNo"
          @showSizeChange="onShowSizeChange"
          @change="pageChange"
        />
      </a-card>
    </div>
  </div>
</template>

<script>
import { getAction, postAction, deleteAction } from '@/api/manage.js'
import TagCheckBox from '../../../components/TagCheckBox'
export default {
  data() {
    return {
      searchParams: {
        prizeStatusValue: [''],
        prizeCategoryValue: [''],
        searchType: 'PROJECT_NAME',
      },
      loading: false,
      newstype: [''],
      //分页
      pagination: {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      },
      pageSizeOptions: ['5', '10', '15', '20'],
      list: [],
      title: '',
      url: {
        list: '/fire/news/list',
      },
    }
  },
  props: {
    typeList: {
      type: Array,
      default: [],
      required: false,
    },
  },
  components: {
    TagCheckBox,
  },
  mounted() {
    this.dataList()
  },
  methods: {
    //新闻类型
    typeFun(e) {
      for (const i of this.typeList) {
        if (i.value == e) {
          return i.label
        }
      }
    },
    //搜索
    search(){
     this.pagination = {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      }
      this.dataList()
    },
    dataList() {
      this.loading = true
      let newstype
      if (this.newstype.indexOf('') != -1) {
        newstype = []
      } else {
        newstype = this.newstype
      }
      let searchType = {}
      if (this.searchParams.searchType == 'PROJECT_NAME') {
        searchType = { title: this.title }
      } else if (this.searchParams.searchType == 'PROJECT_number') {
        searchType = { number: this.title }
      } else if (this.searchParams.searchType == 'PROJECT_unit') {
        searchType = { publishUnit: this.title }
      }
      let params = Object.assign({}, this.pagination, { flag: 1 }, searchType, { type: newstype.toString() })
      getAction(this.url.list, params).then((res) => {
        if (res.success) {
          this.list = res.result.records
          for (const i of this.list) {
            if (i.state == '0') {
              i.typeTitle = '待提交'
              i.color = 'yellow'
            } else if (i.state == '1') {
              i.typeTitle = '待审核'
              i.color = 'yellow'
            } else if (i.state == '2') {
              i.typeTitle = '审核通过'
              i.color = 'green'
            } else if (i.state == '3') {
              i.typeTitle = '审核驳回'
              i.color = 'red'
            } else if (i.state == '4') {
              i.typeTitle = '已发布'
              i.color = 'green'
            } else if (i.state == '5') {
              i.typeTitle = '已下架'
              i.color = 'red'
            } else if (i.state == '6') {
              i.typeTitle = '待退回'
              i.color = 'yellow'
            } else if (i.state == '7') {
              i.typeTitle = '已退回'
              i.color = 'red'
            }
          }
          this.pagination.total = res.result.total
          // this.$message.success(res.message || '查询成功')
        } else {
          this.$message.warning(res.message || '查询失败')
        }
        this.loading = false
      })
    },
    //打开新闻详情
    journalismInfo(e) {
      this.$router.push(`/policy/journalism/preview/${e.id}`)
    },
    //页码改变的回调
    onShowSizeChange(current, pageSize) {
      this.pagination.pageSize = pageSize
      this.dataList()
    },
    //pageSize 变化的回调
    pageChange(e, a) {
      this.pagination.pageNo = e
      this.dataList()
    },
  },
}
</script>

<style lang="less" scoped>
.submit-container {
  background: #f0f2f5;
  .search-form {
    padding: 0 20px 20px;
    background: #fff;
  }
  .table {
    margin-top: 16px;
    background: #fff;
  }
  .search {
    padding: 24px 16px;
    border-bottom: 1px #f0f0f0 solid;
  }
  .data {
    padding: 0 14px 15px;
    overflow: hidden;
    display: flex;
    .icon {
      width: 16px;
      height: 16px;
      color: #1890ff;
      margin: 5px 10px 0 10px;
    }
    .content {
      border-bottom: 1px solid rgb(216, 216, 216);
      flex: 1 0;
      .title {
        line-height: 24px;
        font-size: 16px;
      }
      .particulars {
        display: flex;
        flex-wrap: wrap;
        color: rgb(159, 159, 159);
        div {
          width: 50%;
        }
      }
      .action {
        height: 100%;
        text-align: right;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
      }
    }
  }
  .pagination {
    margin-top: 10px;
    float: right;
  }
}
.numberStyle /deep/ .ant-badge-status-dot {
  width: 8px;
  height: 8px;
  margin-left: 7px;
}
</style>