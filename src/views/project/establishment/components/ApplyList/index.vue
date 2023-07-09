<template>
  <div class="submit-container">
    <div class="search-form">
      <!-- 筛选组 -->
      <tag-check-box :options="applyFilterGroup" @searchParams="searchParams" />
    </div>
    <div class="table">
      <div class="tips">
        <a-alert banner>
          <div slot="message" class="message">
            项目立项是对支队、大队的项目信息进行收集，具体科技项目管理请前往xxx网站操作。
          </div>
        </a-alert>
      </div>
      <div class="data">
        <list-table :list="submitList" :pagination="pagination" :loading="loading" :activeTab="2">
          <div class="title" slot-scope="{ row }" slot="title">
            <span>{{ row.projectName }}</span>
          </div>
          <div class="info" slot-scope="{ row }" slot="desc-left">
            <div>
              <span>发布单位：{{ row.publishUnitName }}</span>
            </div>
            <div>
              <span>项目联系人：{{ row.linkRealname }} <span v-if="row.linkRealname">|</span> {{ row.linkPhone }}</span>
            </div>
            <div>
              <span
                >上次操作时间：<span v-if="row.updateTime === null">{{ formatMinute(row.createTime) }}</span>
                <span v-else>{{ formatMinute(row.updateTime) }}</span></span
              >
            </div>
            <div class="operator">
              <span>当前操作人：</span
              ><span v-for="(item, index) in row.projectUserList" :key="item.id" class="name">
                {{ `${item.realName}【${item.departName}】` }}
                <span v-if="index < row.projectUserList.length - 1">、</span>
              </span>
            </div>
          </div>
          <div class="label" slot-scope="{ row }" slot="label">
            <div class="tags">
              <span v-for="item in projectCategory" :key="item.id">
                <a-tag color="blue" v-if="item.itemValue == row.projectCategory">{{ item.itemText }}</a-tag>
              </span>
              <a-tag color="orange"> {{ row.ownershipYear }}年项目 </a-tag>
              <span v-for="item in projectOwner" :key="item.id">
                <a-tag color="green" v-if="item.itemValue == row.projectOwnership">{{ item.itemText }}</a-tag>
              </span>
            </div>
            <div class="status">
              <img v-if="row.processStatus == '150'" src="../../../../../assets/icon_待审核.png" alt="状态" />
              <img v-if="row.processStatus == '135'" src="../../../../../assets/icon_待退回.png" alt="状态" />
              <img v-if="row.processStatus == '100'" src="../../../../../assets/icon_待提交.png" alt="状态" />
              <img v-if="row.processStatus == '200'" src="../../../../../assets/icon_审核通过.png" alt="状态" />
              <img v-if="row.processStatus == '400'" src="../../../../../assets/icon_审核不通过.png" alt="状态" />
              <img v-if="row.processStatus == '136'" src="../../../../../assets/icon_已退回.png" alt="状态" />
              <img v-if="row.processStatus == '300'" src="../../../../../assets/icon_审核完成.png" alt="状态" />
              <span v-if="row.processStatus == '200'" class="adopt">审核意见：{{ row.result }}</span>
              <span v-if="row.processStatus == '400'" class="fail">审核意见：{{ row.result }}</span>
            </div>
          </div>
          <div slot="actions" slot-scope="{ row }">
            <a-dropdown class="btn">
              <a-button @click="handleClick">更多操作</a-button>
              <a-menu slot="overlay">
                <a-menu-item
                  key="delete"
                  @click="handleDelete(row)"
                  v-has="'establishmentApply:delete'"
                  :disabled="['200', '300', '400', '136'].indexOf(row.processStatus) != -1"
                >
                  删除
                </a-menu-item>
                <a-menu-item
                  key="edit"
                  @click="handleEdit(row)"
                  :disabled="['200', '300', '400', '136'].indexOf(row.processStatus) != -1"
                  v-has="'establishmentApply:edit'"
                >
                  编辑
                </a-menu-item>
                <a-menu-item
                  key="back"
                  @click="handleBack(row)"
                  :disabled="['135'].indexOf(row.processStatus) == -1"
                  v-has="'establishmentApply:return'"
                >
                  退回
                </a-menu-item>
                <a-menu-item
                  key="checked"
                  :disabled="['200'].indexOf(row.processStatus) == -1"
                  @click="handleComplete(row)"
                  v-has="'establishmentApply:auditComplete'"
                >
                  审核完成
                </a-menu-item>
              </a-menu>
            </a-dropdown>
            <a-button
              class="btn"
              type="primary"
              @click="openModel($event, row)"
              :disabled="['150'].indexOf(row.processStatus) == -1"
              v-has="'establishmentApply:audit'"
              >审核</a-button
            >
          </div>
        </list-table>
      </div>
    </div>

    <j-modal
      title="项目立项编辑/新增"
      :visible="reportVisible"
      switchFullscreen
      :fullscreen="true"
      @cancel="handleCancel"
      :footer="false"
    >
      <StepBar
        @cancel="handleCancel"
        :type="type"
        :editData="editListData"
        :projectOwner="projectOwner"
        :projectCategory="projectCategory"
      />
    </j-modal>
    <!-- 审核弹窗 -->
    <AuditModal
      ref="apply"
      :adoptValue="'200'"
      :rejectValue="'400'"
      :visible="auditVisible"
      @cancel="auditCancel"
      @ok="auditOk"
    />
  </div>
</template>
<script>
// 引入封装的搜索框
import TagCheckBox from '../TagCheckBox'
// 引入封装的表格
import ListTable from '../../../components/ListTable'
// 引入步骤条
import StepBar from '../../components/StepBar'
// 引入审核
import AuditModal from '../../../components/AuditModal'
// 引入请求
import { getAction, postAction, deleteAction } from '@/api/manage.js'
import { formatMinute } from '@/utils/formatDate'

export default {
  props: {
    // 筛选组
    applyFilterGroup: {
      type: Array,
      default: () => [],
      require: false,
    },
    // 项目所属
    projectOwner: {
      type: Array,
      default: () => [],
      require: false,
    },
    // 项目类型
    projectCategory: {
      type: Array,
      default: () => [],
      require: false,
    },
  },
  components: {
    TagCheckBox,
    ListTable,
    StepBar,
    AuditModal,
  },
  data() {
    return {
      // 新增编辑弹框状态
      reportVisible: false,
      // 新增/编辑类型
      type: '',
      // 编辑数据信息
      editListData: {},
      // 查询条件
      searchArray: '',
      // 审核弹窗
      auditVisible: false,
      // 当前要审核的内容
      currentModify: {},
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
      // 我提交的列表数据
      submitList: [],

      // 加载状态
      loading: false,
      // 请求的url
      url: {
        list: '/fire/projectBuild/list',
        delete: '/fire/projectBuild/delete',
        // 退回
        backProjectBuild: '/fire/projectBuild/backProjectBuild',
        // 审核完成
        auditCompleteProjectBuild: '/fire/projectBuild/auditCompleteProjectBuild',
        // 审核
        auditProjectBuild: '/fire/projectBuild/auditProjectBuild',
        currentData: '/fire/projectBuild/queryById',
      },
    }
  },

  methods: {
    formatMinute,
    //新增/编辑弹框取消按钮
    handleCancel() {
      this.reportVisible = false
      this.dataList()
    },
    //pageSize 变化的回调
    pageChange(page, pageSize) {
      this.pagination.current = page || 1
      this.pagination.pageSize = pageSize
      this.dataList()
    },
    // 根据条件请求列表数据
    searchParams(e) {
      this.searchArray = e
      this.dataList()
    },
    // 请求列表数据
    dataList() {
      this.loading = true
      let params = Object.assign(
        {},
        { queryType: 2, pageNo: this.pagination.current, pageSize: this.pagination.pageSize },
        this.searchArray
      )
      getAction(this.url.list, params).then((res) => {
        if (res.success) {
          this.submitList = res.result.records
          // 总页数
          this.pagination.total = res.result.total
          this.loading = false
        } else {
          this.loading = false
          this.$message.warning(res.message || '请求列表数据失败')
        }
      })
    },
    // 更多操作阻止默认事件
    handleClick(e) {
      e.stopPropagation()
    },

    //编辑数据
    handleEdit(e) {
      // 根据id查看数据
      let params = { id: e.id }
      getAction(this.url.currentData, params).then((res) => {
        if (res.success) {
          this.editListData = res.result
          this.type = 'edit'
          this.reportVisible = true
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 删除数据
    handleDelete(e) {
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
    // 退回
    handleBack(e) {
      postAction(`${this.url.backProjectBuild}?id=${e.id}`).then((res) => {
        if (res.success) {
          this.dataList()
          this.$message.success(res.message || '退回成功')
        } else {
          this.$message.warning(res.message || '退回失败')
        }
      })
    },
    // 打开审核弹窗
    openModel(e, row) {
      e.stopPropagation()
      this.currentModify = row
      this.auditVisible = true
      this.$nextTick(() => {
        this.$refs.apply.resetForm()
      })
    },
    // 审核
    auditOk() {
      this.$refs.apply.validateFields().then((res) => {
        postAction(
          `${this.url.auditProjectBuild}?id=${this.currentModify.id}&operaCode=${res.operaCode}&opinion=${res.opinion}`
        ).then((res) => {
          if (res.success) {
            this.auditVisible = false
            this.$message.success('审核成功')
            this.dataList()
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
    // 审核弹框关闭
    auditCancel() {
      this.auditVisible = false
    },
    // 审核完成
    handleComplete(e) {
      postAction(this.url.auditCompleteProjectBuild + `?id=${e.id}`).then((res) => {
        if (res.success) {
          this.dataList()
          this.$message.success('审核完成')
        } else {
          this.$message.error(res.message)
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
.submit-container {
  background: #f0f2f5;
  // 筛选
  .search-form {
    padding: 0 24px 24px;
    background: #fff;
  }
  // 表格
  .table {
    margin-top: 16px;
    background: #fff;
    overflow: hidden;
    // 提示
    .tips,
    .actions {
      margin: 16px 24px;
      .ant-alert {
        background: #fffbe6;
        border: 1px solid #ffe58f;
        border-radius: 2px;
        .message {
          font-size: 14px;
          font-weight: 400;
          text-align: left;
          color: rgba(0, 0, 0, 0.65);
          line-height: 20px;
        }
      }
    }
    .data {
      margin: 16px 24px;
      // 标题
      .title {
        font-size: 20px;
        font-weight: 500;
        color: #262626;
        line-height: 28px;
      }
      // 标签格式
      .label {
        display: flex;
        align-items: center;
        .tags {
          .ant-tag {
            border: none;
            font-size: 12px;
            font-weight: 400;
            line-height: 20px;
            padding: 0 18px;
          }
        }
        .status {
          margin-left: 24px;
          display: flex;
          align-items: center;
          // 审核通过
          .adopt {
            margin-left: 8px;
            font-size: 14px;
            font-weight: 400;
            color: #8c8c8c;
            line-height: 20px;
          }
          // 审核不通过
          .fail {
            margin-left: 8px;
            font-size: 14px;
            font-weight: 400;
            text-align: left;
            color: #e02020;
            line-height: 20px;
          }
        }
      }
      // 列表info字体
      .info > div > span {
        font-size: 14px;
        font-weight: 500;
        text-align: left;
        color: rgba(0, 0, 0, 0.65);
        line-height: 25px;
      }
      // 操作人
      .info > .operator > .name {
        color: #1890ff;
      }
    }
  }
}
</style>
