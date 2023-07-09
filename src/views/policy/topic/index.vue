<template>
  <page-header-wrapper>
    <div class="container">
      <div class="search-tab">
        <a-card>
          <a-row :gutter="16">
            <a-col :span="8">
              <a-input addon-before="话题名称" allowClear v-model="title" placeholder="请输入" />
            </a-col>
            <a-col :span="2">
              <a-button type="primary" @click="search"> 搜索 </a-button>
            </a-col>
          </a-row>
        </a-card>
        <a-card>
          <a-button v-has="'topic:add'" type="primary" icon="plus" @click="openReport"> 新增话题 </a-button>
          <div class="dataList" v-for="(item, index) in data" :key="index">
            <div class="content">
              <div class="title"><j-ellipsis :value="item.title" :length="25"/></div>
              <div class="date">发布时间：{{ item.publishTime }}</div>
            </div>
            <div class="action">
              <a-dropdown>
                <div><a-button type="text"> 更多操作 </a-button></div>
                <a-menu slot="overlay">
                  <a-menu-item v-has="'topic:soldOut'" @click="applySoldOut(item)">下架</a-menu-item>
                  <a-menu-item v-has="'topic:edit'" @click="editReport(item)">编辑</a-menu-item>
                  <a-menu-item v-has="'topic:delete'" @click="applyDelete(item)">删除</a-menu-item>
                </a-menu>
              </a-dropdown>
              <div>
                <a-button type="text" style="color: #40a9ff; border: 1px solid #40a9ff" @click="infoTo(item.id)">
                  话题详情
                </a-button>
              </div>
            </div>
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
        <!-- 添加/详情弹框 -->
        <j-modal
          title="话题编辑/新增"
          @cancel="handleCancel"
          :visible="reportVisible"
          switchFullscreen
          :fullscreen="true"
          :footer="null"
        >
          <info-modal-form
            ref="formRef"
            :type="type"
            :id="id"
            :infoList="infoList"
            @ok="handleOk"
            @cancel="handleCancel"
          ></info-modal-form>
        </j-modal>
      </div>
    </div>
  </page-header-wrapper>
</template>

<script>
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import InfoModalForm from './Info_Modal_Form.vue'
import { getAction, postAction, deleteAction } from '@/api/manage.js'
import JEllipsis from '@/components/jeecg/JEllipsis'
export default {
  data() {
    return {
      reportVisible: false,
      title: '',
      type: '',
      id: '',
      pagination: {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      },
      //分页
      pageSizeOptions: ['5', '10', '15', '20'],
      data: [],
      infoList: {},
      loading: false,
      url: {
        list: '/fire/topic/list',
        info: '/fire/topic/queryById',
        delete: '/fire/topic/delete',
        state: '/fire/topic/changeState',
      },
    }
  },
  components: {
    PageHeaderWrapper,
    InfoModalForm,
    JEllipsis
  },
  mounted() {
    this.dataList()
  },
  methods: {
     //搜索
    search(){
     this.pagination = {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      }
      this.dataList()
    },
    //话题列表
    dataList() {
      this.loading = true
      let params = Object.assign({}, this.pagination, { title: this.title })
      getAction(this.url.list, params).then((res) => {
        if (res.success) {
          this.data = res.result.records
          this.pagination.total = res.result.total
          // this.$message.success(res.message || '查询成功')
        } else {
          this.$message.warning(res.message || '查询失败')
        }
        this.loading = false
      })
    },
    //话题详情
    dataInfo(e) {
      getAction(this.url.info, { id: e.id }).then((res) => {
        if (res.success) {
          this.infoList = res.result
          this.reportVisible = true
          this.$nextTick(() => {
            this.$refs.formRef.info()
          })

          this.$message.success(res.message || '查询成功')
        } else {
          this.$message.warning(res.message || '查询失败')
        }
      })
    },
    //新增
    openReport() {
      this.type = 'add'
      this.reportVisible = true
    },
    //编辑
    editReport(e) {
      this.type = 'edit'
      this.id = e.id
      this.dataInfo(e)
    },
    //添加/详情弹框确定按钮
    handleOk() {
      this.dataList()
      this.reportVisible = false
    },
    //添加/详情弹框取消按钮
    handleCancel() {
      this.reportVisible = false
    },
    //下架
    applySoldOut(e) {
      let that = this
      this.$confirm({
        title: '下架',
        icon: 'exclamation-circle',
        content: (
          <div>
            <p>确定下架？</p>
            <p>下架后该信息可删除/编辑/退回。</p>
          </div>
        ),
        okText: '确认',
        cancelText: '取消',
        onOk() {
          console.log('确定下架')
          postAction(that.url.state, { id: e.id, state: -1 }).then((res) => {
            if (res.success) {
              that.dataList()
              that.$message.success(res.message)
            } else {
              that.$message.warning(res.message)
            }
          })
        },
      })
    },
    //删除话题
    applyDelete(e) {
      let that = this
      that.$confirm({
        title: '删除',
        icon: 'exclamation-circle',
        content:  (
          <div>
            <p>确定删除？</p>
            <p>删除后将无法在列表中查到此条信息，请谨慎操作。</p>
          </div>
        ),
        okText: '确认',
        cancelText: '取消',
        onOk() {
          deleteAction(that.url.delete, { id: e.id }).then((res) => {
            if (res.success) {
              that.dataList()
              that.$message.success(res.message)
            } else {
              that.$message.warning(res.message)
            }
          })
        },
      })
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
    //详情
    infoTo(e) {
      this.$router.push(`/policy/topic/preview/${e}`)
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
.dataList {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: end;
  border-bottom: 1px solid rgb(195, 195, 195);
  .content {
    color: rgb(162, 162, 162);
    .title {
      color: black;
      font-size: 16px;
      font-weight: 600;
    }
  }
  .read {
    color: rgb(162, 162, 162);
  }
  .action {
    div {
      float: left;
    }
    div:nth-child(2) {
      margin-left: 10px;
    }
  }
}
.pagination {
  margin-top: 10px;
  float: right;
}
</style>