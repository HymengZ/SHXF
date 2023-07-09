<template>
  <div class="submit-container">
    <div class="search-form">
      <!-- 筛选组 -->
      <tag-check-box :options="organizationSubmitFilterGroup" @searchParams="searchParams" />
    </div>
    <div class="table">
      <div class="tips">
        <a-alert banner>
          <div slot="message" class="message">
            1、此列表为总队管理员新增后配置给到本单位填写的表单，请在橙色提示文字“提交截止时间：xxxx”之前提交;<br />
            2、填写该年度表单后，总队将进行打分，评分结果直接显示为本年度的组织排行榜，奖项评比依据组织排行榜发布，请认真填写;<br />
            3、本账号无法删除列表中的科技创新组织奖申报表，提交后如需修改请申请退回。
          </div>
        </a-alert>
      </div>
      <div class="actions">
        <a-button type="primary" @click="openReport" v-has="'achievementSubmit:add'">
          <a-icon type="plus" />
          新增科技创新项目奖
        </a-button>
      </div>
      <div class="data">
        <list-table :list="submitList" :pagination="pagination" :loading="loading" :activeTab="1">
          <div class="title" slot-scope="{ row }" slot="title">
            <span>{{ row.awardName }}</span>
          </div>
          <div class="label" slot-scope="{ row }" slot="label">
            <div class="status">
              <img
                v-if="['150', '200'].indexOf(row.processStatus) != -1"
                src="../../../../../../assets/icon_待审核.png"
                alt="状态"
              />
              <img v-if="row.processStatus == '135'" src="../../../../../../assets/icon_待退回.png" alt="状态" />
              <img v-if="row.processStatus == '100'" src="../../../../../../assets/icon_待提交.png" alt="状态" />
              <img v-if="row.processStatus == '136'" src="../../../../../../assets/icon_已退回.png" alt="状态" />
              <img v-if="row.processStatus == '500'" src="../../../../../../assets/icon_审核不通过.png" alt="状态" />
              <img v-if="row.processStatus == '300'" src="../../../../../../assets/icon_审核完成.png" alt="状态" />
              <span v-if="row.processStatus == '500'" class="fail">审核意见：{{ row.result }}</span>
            </div>
          </div>
          <div class="info" slot-scope="{ row }" slot="desc-left">
            <div>
              <span>参与评比项：{{}}</span>
            </div>
            <div><span>填写数据(条)：{{}}</span></div>
            <div><span>总队判定有效数据(条)：{{}}</span></div>
            <div>
              <span
                >上次操作时间：<span v-if="row.updateTime === null">{{ formatMinute(row.createTime) }}</span>
                <span v-else>{{ formatMinute(row.updateTime) }}</span></span
              >
            </div>
          </div>
          <div slot-scope="{ row }" slot="actions">
            <div>
              <span
                >上次操作时间：<span v-if="row.updateTime === null">{{ formatMinute(row.createTime) }}</span>
                <span v-else>{{ formatMinute(row.updateTime) }}</span></span
              >
            </div>
            <a-dropdown>
              <a-button @click="handleClick">更多操作</a-button>
              <a-menu slot="overlay">
                <a-menu-item
                  key="delete"
                  @click="handleDelete(row)"
                  :disabled="['150', '200', '135'].indexOf(row.processStatus) != -1"
                  v-has="'achievementSubmit:delete'"
                >
                  删除
                </a-menu-item>
                <a-menu-item
                  key="edit"
                  @click="handleEdit(row)"
                  :disabled="['150', '200', '135', '300'].indexOf(row.processStatus) != -1"
                  v-has="'achievementSubmit:edit'"
                >
                  编辑
                </a-menu-item>
                <a-menu-item
                  key="submit"
                  @click="handleSubmit(row)"
                  :disabled="['100'].indexOf(row.processStatus) == -1"
                  v-has="'achievementSubmit:submit'"
                >
                  提交
                </a-menu-item>
                <a-menu-item
                  key="back"
                  :disabled="['150'].indexOf(row.processStatus) == -1"
                  @click="handleApplyBack(row)"
                  v-has="'achievementSubmit:applyReturn'"
                >
                  申请退回
                </a-menu-item>
              </a-menu>
            </a-dropdown>
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
  </div>
</template>
<script>
// 引入请求
import {
  fetchAwardProject,
  deleteAwardProject,
  addAwardProject,
  fetchAwardProjectById,
  submitAwardProject,
  applyBackAwardProject,
  editAwardProject,
} from '@/api/project/projectAward'
// 引入封装的搜索框
import TagCheckBox from '../TagCheckBox'
// 引入封装的表格
import ListTable from '../ListTable'
// 引入新增/编辑弹框内容
import addAward from '@/views/project/awards/components/project/SubmitList/addAward'
import { formatMinute } from '@/utils/formatDate'

export default {
  props: {
    // 筛选组
    organizationSubmitFilterGroup: {
      type: Array,
      default: () => [],
      require: false,
    },
  },
  components: {
    TagCheckBox,
    ListTable,
    addAward,
  },
  data() {
    return {
      // 新增编辑弹框状态
      reportVisible: false,
      // 新增/编辑类型
      type: '',
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
      // 我提交的列表数据
      submitList: [],
      // 编辑数据信息
      editListData: {},
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
        this.submitList = result.records
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
    //新增数据
    openReport() {
      this.type = 'add'
      this.reportVisible = true
    },
    // 保存数据
    handleOk() {
      this.$refs.addAward.validateFields().then(async (values) => {
        // 第一次新增,提交状态为待提交
        if (this.type == 'add') {
          let params = Object.assign(values, { processStatus: '100' })
          const { success, message } = await addAwardProject(params)
          if (!success) {
            this.$message.warning(message)
            return
          }
          this.$message.success(message)
        } else {
          let params = Object.assign(values, { id: this.editListData.id })
          const { success, message } = await editAwardProject(params)
          if (!success) {
            this.$message.warning(message)
            return
          }
          this.$message.success(message)
        }
        this.reportVisible = false
        this.dataList()
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
        async onOk() {
          const { success, message } = await deleteAwardProject(e.id)
          if (success) {
            that.dataList()
            that.$message.success(message)
          } else {
            that.$message.warning(message)
          }
        },
      })
    },
    // 更多操作-提交
    async handleSubmit(e) {
      const { success, message } = await submitAwardProject(e.id)
      if (success) {
        this.dataList()
        this.$message.success(message)
      } else {
        this.$message.warning(message)
      }
    },
    //更多操作-申请退回
    async handleApplyBack(e) {
      const { success, message } = await applyBackAwardProject(e.id)
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
        .status {
          display: flex;
          align-items: center;
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
    }
  }
}
</style>
