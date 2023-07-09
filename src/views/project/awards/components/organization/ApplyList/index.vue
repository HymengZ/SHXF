<template>
  <div class="apply-container">
    <div class="search-form">
      <!-- 筛选组 -->
      <tag-check-box :options="projectApplyFilterGroup" @searchParams="searchParams" />
    </div>
    <div class="table">
      <div class="data">
        <list-table :list="applyList" :pagination="pagination" :loading="loading" :activeTab="2">
          <div class="title" slot-scope="{ row }" slot="title">
            <img class="icon" src="../../../../../../assets/icon_奖项.png" alt="无法显示" /><span>{{
              row.awardName
            }}</span>
          </div>
          <div class="label" slot-scope="{ row }" slot="label">
            <div class="tags">
              <a-tag color="blue"> {{ row.awardTypeName }}</a-tag>
              <a-tag color="green"> {{ row.year }}年奖项 </a-tag>
            </div>
            <div class="status">
              <img v-if="row.processStatus == '150'" src="../../../../../../assets/icon_待审核.png" alt="状态" />
              <img v-if="row.processStatus == '135'" src="../../../../../../assets/icon_待退回.png" alt="状态" />
              <img v-if="row.processStatus == '100'" src="../../../../../../assets/icon_待提交.png" alt="状态" />
              <img v-if="row.processStatus == '200'" src="../../../../../../assets/icon_审核通过.png" alt="状态" />
              <img v-if="row.processStatus == '400'" src="../../../../../../assets/icon_审核不通过.png" alt="状态" />
              <img v-if="row.processStatus == '136'" src="../../../../../../assets/icon_已退回.png" alt="状态" />
              <img v-if="row.processStatus == '300'" src="../../../../../../assets/icon_审核完成.png" alt="状态" />
              <span v-if="row.processStatus == '200'" class="adopt">审核意见：{{ row.result }}</span>
              <span v-if="row.processStatus == '400'" class="fail">审核意见：{{ row.result }}</span>
            </div>
          </div>
          <div class="info" slot-scope="{ row }" slot="desc-left">
            <div>
              <span>发布单位：{{ row.unitName }}</span>
            </div>
            <div><span>关联的科技项目：{{}}</span></div>
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
          <div slot-scope="{ row }" slot="actions">
            <a-dropdown>
              <a-button @click="handleClick">更多操作</a-button>
              <a-menu slot="overlay">
                <a-menu-item
                  key="edit"
                  @click="handleEdit(row)"
                  :disabled="['150', '200', '135', '300'].indexOf(row.processStatus) != -1"
                  v-has="'achievementSubmit:edit'"
                >
                  编辑
                </a-menu-item>
                <a-menu-item
                  key="back"
                  :disabled="['150'].indexOf(row.processStatus) == -1"
                  @click="handleBack(row)"
                  v-has="'achievementSubmit:applyReturn'"
                >
                  退回
                </a-menu-item>
                <a-menu-item
                  key="finish"
                  :disabled="['150'].indexOf(row.processStatus) == -1"
                  v-has="'achievementApply:finish'"
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
              v-has="'achievementApply:audit'"
              >审核</a-button
            >
            <a-button
              class="btn"
              type="primary"
              @click="openModel($event, row)"
              :disabled="['150'].indexOf(row.processStatus) == -1"
              v-has="'achievementApply:look'"
              >查看项目</a-button
            >
          </div>
        </list-table>
      </div>
    </div>
    <j-modal
      title="科技创新项目奖编辑/新增"
      :visible="reportVisible"
      switchFullscreen
      :fullscreen="true"
      @cancel="handleCancel"
      class="j-modal"
      @ok="handleOk"
    >
      <addAward ref="addAward" :type="type" :editListData="editListData" v-bind="$attrs" />
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
// 引入请求
import {
  fetchAwardProject,
  fetchAwardProjectById,
  editAwardProject,
  backAwardProject,
  auditAwardProject,
} from '@/api/project/projectAward'
// 引入封装的搜索框
import TagCheckBox from '../TagCheckBox'
// 引入封装的表格
import ListTable from '../ListTable'
// 引入新增/编辑弹框内容
import addAward from '@/views/project/awards/components/project/SubmitList/addAward'
import { formatMinute } from '@/utils/formatDate'
// 引入审核弹窗
import AuditModal from '../../../../components/AuditModal'
export default {
  props: {
    // 筛选组
    projectApplyFilterGroup: {
      type: Array,
      default: () => [],
      require: false,
    },
  },
  components: {
    TagCheckBox,
    ListTable,
    addAward,
    AuditModal,
  },
  data() {
    return {
      // 新增编辑弹框状态
      reportVisible: false,
      // 新增/编辑类型
      type: '',
      // 审核弹窗
      auditVisible: false,
      // 查询条件
      searchArray: '',
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
      // 我审核的列表数据
      applyList: [],
      // 编辑数据信息
      editListData: {},
      // 操作-当前数据id
      currentId: '',
      // 加载状态
      loading: false,
    }
  },
  mounted() {
    this.dataList()
  },
  methods: {
    formatMinute,
    //新增/编辑弹框取消按钮
    handleCancel() {
      this.reportVisible = false
      this.dataList()
    },
    // 审核弹框关闭
    auditCancel() {
      this.auditVisible = false
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
    async dataList() {
      this.loading = true
      let params = Object.assign(
        {},
        { queryType: 1, pageNo: this.pagination.current, pageSize: this.pagination.pageSize },
        this.searchArray
      )
      const { success, message, result } = await fetchAwardProject(params)

      if (success) {
        this.applyList = result.records
        // 总页数
        this.pagination.total = result.total
        this.loading = false
      } else {
        this.loading = false
        this.$message.warning(message || '请求列表数据失败')
      }
    },
    // 更多操作,阻止点击进入预览
    handleClick(e) {
      e.stopPropagation()
    },
    // 保存数据
    handleOk() {
      this.$refs.addAward.validateFields().then(async (values) => {
        let params = Object.assign(values, { id: this.editListData.id })
        const { success, message } = await editAwardProject(params)
        if (!success) {
          this.$message.warning(message)
          return
        }
        this.$message.success(message)
        this.reportVisible = false
        this.dataList()
      })
    },
    // 打开审核弹窗
    openModel(e, row) {
      e.stopPropagation()
      this.currentId = row.id
      this.auditVisible = true
      this.$nextTick(() => {
        this.$refs.apply.resetForm()
      })
    },
    // 审核
    auditOk() {
      this.$refs.apply.validateFields().then(async (res) => {
        let params = { id: this.currentId, operaCode: res.operaCode, opinion: res.opinion }
        const { success, message } = await auditAwardProject(params)
        if (success) {
          this.auditVisible = false
          this.$message.success(message)
          this.dataList()
        } else {
          this.$message.warning(message)
        }
      })
    },
    //编辑数据
    async handleEdit(e) {
      // 根据数据id获取
      const { success, message, result } = await fetchAwardProjectById(e.id)
      if (success) {
        this.type = 'edit'
        this.reportVisible = true
        this.editListData = result
      } else {
        this.$message.warning(message)
      }
    },

    //更多操作-退回
    async handleBack(e) {
      const { success, message } = await backAwardProject(e.id)
      if (success) {
        this.dataList()
        this.$message.success(message)
      } else {
        this.$message.warning(message)
      }
    },
    // 审核完成
    async handleComplete(e) {
      const { success, message } = await auditCompleteScienceAchieve(e.id)
      if (success) {
        this.dataList()
        this.$message.success(message)
      } else {
        this.$message.warning(message)
      }
    },
  },
}
</script>
<style lang="less" scoped>
.apply-container {
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

    .data {
      margin: 16px 24px;
      // 标题
      .title {
        display: flex;
        align-items: center;
        font-size: 20px;
        font-weight: 500;
        color: #262626;
        line-height: 28px;
        .icon {
          margin-right: 8px;
          margin-top: 3px;
        }
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
