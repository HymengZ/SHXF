<template>
  <div class="submit-container">
    <div class="search-form">
      <tag-check-box label="新闻类别" :options="typeList" v-model="newstype" />
      <tag-check-box label="新闻状态" :options="journalism_TYPE_EMNU" v-model="state" />
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
            <a-input allowClear style="width: calc(100% - 160px)" v-model="title" placeholder="请输入" />
          </a-input-group>
        </a-col>
        <a-button type="primary" style="margin-left: 8px" @click="search">搜索</a-button>
      </a-row>
      <div class="tips">
        <a-alert banner>
          <div slot="message" class="message">
            1、已提交的当前无法修改，如需修改/删除请进行申请退回操作；
            <br />
            2、已下架的如无问题，请及时联系平台申述重新发布，避免影响后期业务对接。
          </div>
        </a-alert>
      </div>
      <div class="actions" v-has="'journalism:add'">
        <a-button @click="openReport" type="primary">
          <a-icon type="plus" />
          新增消防新闻
        </a-button>
      </div>
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
                <div>
                  <div>新闻编号：{{ item.number }}</div>
                  <div>新闻类别：{{ typeFun(item.type) }}</div>
                  <div>发布单位：{{ item.publishUnit }}</div>
                  <div>阅读：{{ item.readAmount }}</div>
                </div>
                <div>
                  <div>新建时间：{{ item.createTime }}</div>
                  <div v-if="item.state == 4">发布时间：{{ item.submitTime }}</div>
                  <div v-if="item.state != 0">提交时间：{{ item.submitTime }}</div>
                  <div v-if="item.state == 2 || item.state == 3">
                    审核时间：{{ item.auditTime
                    }}<a-tooltip>
                      <template slot="title"> {{ item.auditAdvice }} </template
                      ><a-icon
                        style="margin-left: 20px"
                        :style="item.state == 2 ? 'color:gray' : 'color:red'"
                        type="info-circle"
                        theme="filled"
                      />
                    </a-tooltip>
                  </div>
                  <div v-if="item.state == 6 || item.state == 7">申请退回时间：{{ item.applyTime }}</div>
                  <div v-if="item.state == 7">退回时间：{{ item.backTime }}</div>
                </div>
              </a-col>
              <a-col span="8">
                <div class="action">
                  <div>
                    <a-dropdown>
                      <a-button>更多操作</a-button>
                      <a-menu slot="overlay">
                        <a-menu-item
                          v-has="'journalism:applyReturn'"
                          @click="submitSendBack(item)"
                          v-if="item.state === '1'"
                          >申请退回</a-menu-item
                        >
                        <a-menu-item v-has="'journalism:delete'" @click="submitDelete(item)" v-if="item.state !== '7'"
                          >删除</a-menu-item
                        >
                        <a-menu-item @click="journalismInfo(item)">预览</a-menu-item>
                      </a-menu>
                    </a-dropdown>
                    <a-divider type="vertical" />
                    <a-button
                      v-has="'journalism:edit'"
                      v-if="['0','3','5','7'].indexOf(item.state) !== -1"
                      type="primary"
                      @click="editReport(item)"
                      >编辑</a-button
                    >
                    <a-divider
                      v-has="'journalism:edit'"
                      type="vertical"
                      v-if="['0','3','5','7'].indexOf(item.state) !== -1"
                    />
                    <a-button
                      v-has="'journalism:submit'"
                      type="primary"
                      v-if="['0','3','5','7'].indexOf(item.state) !== -1"
                      @click="submit(item)"
                      >提交</a-button
                    >
                    <a-divider
                      v-has="'journalism:submit'"
                      type="vertical"
                      v-if="['0','3','5','7'].indexOf(item.state) !== -1"
                    />
                    <a-button
                      style="border: 1px solid #40a9ff; color: #40a9ff"
                      v-if="item.state != '0'"
                      @click="journalismInfo(item)"
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
    <!-- 添加/详情弹框 -->
    <j-modal
      title="消防新闻编辑/新增"
      :visible="reportVisible"
      switchFullscreen
      :fullscreen="true"
      @cancel="handleCancel"
      :footer="null"
    >
      <submit-modal-list
        :typeList="typeList"
        ref="formRef"
        :type="type"
        :id="id"
        :infoList="infoList"
        @ok="handleOk"
        @cancel="handleCancel"
      ></submit-modal-list>
    </j-modal>
  </div>
</template>

<script>
import { getAction, postAction, deleteAction } from '@/api/manage.js'
const journalism_TYPE_EMNU = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '待提交',
    value: '0',
  },
  {
    label: '待审核',
    value: '1',
  },
  {
    label: '审核通过',
    value: '2',
  },
  {
    label: '审核驳回',
    value: '3',
  },
  {
    label: '已发布',
    value: '4',
  },
  {
    label: '已下架',
    value: '5',
  },
  {
    label: '待退回',
    value: '6',
  },
  {
    label: '已退回',
    value: '7',
  },
]
import TagCheckBox from '../../../components/TagCheckBox'
import SubmitModalList from '../SubmitList/reportModalList.vue'
export default {
  data() {
    return {
      type: '',
      id: '',
      infoList: {},
      reportVisible: false,
      searchParams: {
        prizeStatusValue: [''],
        prizeCategoryValue: [''],
        searchType: 'PROJECT_NAME',
      },
      title: '',
      loading: false,
      url: {
        list: '/fire/news/list',
        submit: '/fire/news/submit',
        sendBack: '/fire/news/sendBack',
        delete: '/fire/news/delete',
        apply: '/fire/news/apply',
        info: '/fire/news/queryById',
      },
      //分页
      pagination: {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      },
      pageSizeOptions: ['5', '10', '15', '20'],
      list: [],
      title: '',
      newstype: [''],
      state: [''],
      journalism_TYPE_EMNU,
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
    SubmitModalList,
  },
  mounted() {
    this.dataList()
  },
  methods: {
    //搜索
    search() {
      this.pagination = {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      }
      this.dataList()
    },
    //新闻列表
    dataList() {
      this.loading = true
      let state
      let newstype
      if (this.newstype.indexOf('') != -1) {
        newstype = []
      } else {
        newstype = this.newstype
      }
      if (this.state.indexOf('') != -1) {
        state = []
      } else {
        state = this.state
      }
      let searchType = {}
      if (this.searchParams.searchType == 'PROJECT_NAME') {
        searchType = { title: this.title }
      } else if (this.searchParams.searchType == 'PROJECT_number') {
        searchType = { number: this.title }
      } else if (this.searchParams.searchType == 'PROJECT_unit') {
        searchType = { publishUnit: this.title }
      }
      let params = Object.assign(
        {},
        this.pagination,
        { flag: 2 },
        searchType,
        { state: state.toString() },
        { type: newstype.toString() }
      )

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
    //新闻类型
    typeFun(e) {
      for (const i of this.typeList) {
        if (i.value == e) {
          return i.label
        }
      }
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
    //提交
    submit(e) {
      let that = this
      that.$confirm({
        title: '提交',
        icon: 'exclamation-circle',
        content: (
          <div>
            <p>确定提交？</p>
            <p>提交后将无法编辑与删除，需申请退回才可进行修改。</p>
          </div>
        ),
        okText: '确认',
        cancelText: '取消',
        onOk() {
          console.log('确定提交')
          postAction(that.url.submit, { id: e.id }).then((res) => {
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
    //退回新闻
    submitSendBack(e) {
      let that = this
      this.$confirm({
        title: '申请退回',
        icon: 'exclamation-circle',
        content: (
          <div>
            <p>确定申请退回？</p>
            <p>发送申请后需审核人员操作才能进行编辑/删除。</p>
          </div>
        ),
        okText: '确认',
        cancelText: '取消',
        onOk() {
          console.log('申请退回')
          postAction(that.url.apply, { id: e.id }).then((res) => {
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
    //删除新闻
    submitDelete(e) {
      let that = this
      that.$confirm({
        title: '删除',
        icon: 'exclamation-circle',
        content: (
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
  .tips {
    margin: 14px 15px;
    .message {
      color: rgba(0, 0, 0, 0.65);
      font-size: 14px;
      font-weight: 400;
      line-height: 1.6;
      margin-left: 10px;
    }
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
          white-space: nowrap;
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
  .actions {
    margin: 14px 15px;
  }
}
.numberStyle /deep/ .ant-badge-status-dot {
  width: 8px;
  height: 8px;
  margin-left: 7px;
}
</style>
