<template>
  <page-header-wrapper>
    <div class="container">
      <div class="search-tab">
        <a-card>
          <a-row :gutter="16">
            <a-col :span="8" type="flex">
              <a-input addon-before="消防政策名称" allowClear v-model="title" placeholder="请输入" />
            </a-col>
            <a-col :span="2">
              <a-button type="primary" @click="search"> 搜索 </a-button>
            </a-col>
          </a-row>
        </a-card>
        <a-card>
          <a-button v-has="'policy:add'" type="primary"  icon="plus" @click="openReport"> 新增消防政策 </a-button>
          <div class="dataList" v-for="(item, index) in data" :key="index">
            <div class="content">
              <div class="title"><j-ellipsis :value="item.title" :length="25"/>  <span class="title_span"> {{item.state_dictText}} </span></div>
              <div class="date">发布时间：{{ item.publishTime }}</div>
            </div>
            <div class="read">阅读：{{ item.readAmount }}</div>
            <div class="action">
              <a-dropdown>
                <div><a-button v-has="'policy:more'"  type="text"> 更多操作 </a-button></div>
                <a-menu slot="overlay">
                  <a-menu-item v-has="'policy:soldOut'" @click="applySoldOut(item)" :disabled="item.state === '-1'">下架</a-menu-item>
                  <a-menu-item v-has="'policy:edit'" @click="editReport(item)">编辑</a-menu-item>
                  <a-menu-item v-has="'policy:delete'" @click="applyDelete(item)">删除</a-menu-item>
                </a-menu>
              </a-dropdown>
              <div>
                <a-button type="text" style="color: #40a9ff; border: 1px solid #40a9ff" @click="infoTo(item.id)">
                  政策详情
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
          title="消防政策编辑/新增"
          :visible="reportVisible"
          switchFullscreen
          :fullscreen="true"
          @cancel="handleCancel"
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
import { getAction, postAction, deleteAction } from '@/api/manage.js'
import InfoModalForm from './Info_Modal_Form.vue'
import JEllipsis from '@/components/jeecg/JEllipsis'
export default {
  data() {
    return {
      title: '',
      type: '',
      id: '',
      infoList: {},
      reportVisible: false,
      loading: false,
      //分页
      pagination: {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      },
      //分页
      pageSizeOptions: ['5', '10', '15', '20'],
      data: [],
      url: {
        list: '/fire/controlPolicy/list',
        info: '/fire/controlPolicy/queryById',
        state: '/fire/controlPolicy/changeState',
        delete: '/fire/controlPolicy/delete',
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
    // trimTitle(value) {
    //   if (value.length > 50) {
    //     value = value.substr(0, 50) + '...'
    //   }
    //   return value
    // },
    //搜索
    search(){
     this.pagination = {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      }
      this.dataList()
    },
    //列表
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
    //新增
    openReport() {
      this.type = 'add'
      this.reportVisible = true
    },
    //编辑
    editReport(e) {
      this.id = e.id
      this.type = 'edit'
      this.dataInfo()
    },
    //详情
    dataInfo() {
      getAction(this.url.info, { id: this.id }).then((res) => {
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
      that.$confirm({
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
              that.$message.success(res.message || '下架成功')
            } else {
              that.$message.warning(res.message)
            }
          })
        },
      })
    },
    //删除指南
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
          console.log('确定删除')
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
      this.$router.push(`/policy/policy/preview/${e}`)
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
    width: 65%;
    .title {
      color: black;
      font-size: 16px;
      font-weight: 600;
    }
  }
  .title_span {
    font-size: 12px;
    color: #8c8c8c;
  }
  .read {
    width: 15%;
    color: rgb(162, 162, 162);
  }
  .action {
    width: 15%;
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