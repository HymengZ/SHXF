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
            1、可通过批量导出功能导出科技成果.pdf文件，上面有上海消防科技平台水印；
            <br />
            2、科技成果审核通过后可在综合查询中通过成果名称搜索到相应科技项目，也会同步显示在首页的科技成果中展现。
          </div>
        </a-alert>
      </div>
      <div class="actions">
        <a-button @click="handleSelectAll"> {{ isSelectAll ? '全选' : '取消全选' }} </a-button>
        <a-button @click="handleExport" style="margin-left: 8px"> 导出科技成果 </a-button>
      </div>
      <div class="data">
        <list-table
          :list="applyList"
          :pagination="pagination"
          :loading="loading"
          :selection="selection"
          :disabledSelection="['1']"
          :activeTab="2"
          @select="handleSelectionChange"
        >
          <div class="extra" slot-scope="{ row }" slot="extra">
            <div class="extra-list" v-if="row.fireUploadsList && row.fireUploadsList.length > 0">
              <div class="extra-list-item" v-for="item in filter(row.fireUploadsList)" :key="item.id">
                <img class="image" :src="'https://shfar.cwit.com.cn/api/' + item.fileUrl" alt="成果图片未找到" />
              </div>
            </div>
          </div>
          <div class="title" slot-scope="{ row }" slot="title">
            <span>{{ row.achieveName }}</span>
          </div>
          <div class="label" slot-scope="{ row }" slot="label">
            <div class="tags">
              <a-tag color="blue"> {{ row.achieveTypeName }}</a-tag>
              <a-tag color="orange"> {{ row.ownerYear }}年成果 </a-tag>
              <a-tag color="green">{{ row.resultFormName }} </a-tag>
            </div>
            <div class="status">
              <img v-if="row.processStatus == '150'" src="../../../../../assets/icon_待审核.png" alt="状态" />
              <img v-if="row.processStatus == '200'" src="../../../../../assets/icon_审核通过.png" alt="状态" />
              <img v-if="row.processStatus == '135'" src="../../../../../assets/icon_待退回.png" alt="状态" />
              <img v-if="row.processStatus == '100'" src="../../../../../assets/icon_待提交.png" alt="状态" />
              <img v-if="row.processStatus == '136'" src="../../../../../assets/icon_已退回.png" alt="状态" />
              <img v-if="row.processStatus == '500'" src="../../../../../assets/icon_审核不通过.png" alt="状态" />
              <img v-if="row.processStatus == '300'" src="../../../../../assets/icon_审核完成.png" alt="状态" />
              <span v-if="row.processStatus == '200'" class="adopt">审核意见：{{ row.result || '无' }}</span>
              <span v-if="row.processStatus == '500'" class="fail">审核意见：{{ row.result }}</span>
            </div>
          </div>
          <div class="info" slot-scope="{ row }" slot="desc-left">
            <div>
              <span>发布单位：{{ row.publishUnitName }}</span>
            </div>
            <div>
              <span>成果联系人：{{ row.linkRealname }} <span v-if="row.linkRealname">|</span> {{ row.linkPhone }}</span>
            </div>
            <div>
              <span>关联的科技项目：{{ row.projectReport && row.projectReport.projectName }}</span>
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
          <div slot-scope="{ row }" slot="actions">
            <a-dropdown>
              <a-button @click="handleClick">更多操作</a-button>
              <a-menu slot="overlay">
                <!-- <a-menu-item
                  key="delete"
                  @click="handleDelete(row)"
                  :disabled="['136', '200'].indexOf(row.processStatus) != -1"
                  v-has="'achievementApply:delete'"
                >
                  删除
                </a-menu-item> -->
                <a-menu-item
                  key="edit"
                  @click="handleEdit(row)"
                  :disabled="['136', '200', '300', '500'].indexOf(row.processStatus) != -1"
                  v-has="'achievementApply:edit'"
                >
                  编辑
                </a-menu-item>
                <a-menu-item
                  key="back"
                  @click="handleBack(row)"
                  :disabled="['135'].indexOf(row.processStatus) == -1"
                  v-has="'achievementApply:return'"
                >
                  退回
                </a-menu-item>
                <a-menu-item
                  key="checked"
                  :disabled="['200'].indexOf(row.processStatus) == -1"
                  @click="handleComplete(row)"
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
            <a-button class="btn" type="primary" @click="handleLook($event, row)" v-has="'achievementApply:look'"
              >查看项目</a-button
            >
          </div>
        </list-table>
      </div>
    </div>
    <j-modal
      title="科技成果编辑/新增"
      :visible="reportVisible"
      switchFullscreen
      :fullscreen="true"
      @cancel="handleCancel"
      :footer="false"
      class="j-modal"
    >
      <StepBar @cancel="handleCancel" :type="type" :editData="editListData" v-bind="$attrs" />
    </j-modal>
    <!-- 审核弹窗 -->
    <AuditModal
      ref="apply"
      :adoptValue="'200'"
      :rejectValue="'500'"
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
import ListTable from '../ListTable'
// 引入步骤条
import StepBar from '../../components/StepBar'
// 引入审核弹窗
import AuditModal from '../../../components/AuditModal'
// 引入请求
import {
  fetchScienceAchieve,
  fetchScienceAchieveById,
  backScienceAchieve,
  auditCompleteScienceAchieve,
  auditScienceAchieve,
} from '@/api/project/achievement'
import { formatMinute } from '@/utils/formatDate'
export default {
  props: {
    // 筛选组
    applyFilterGroup: {
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
      // 选择
      selection: [],
      // 是否全选
      isSelectAll: true,
      // 新增编辑弹框状态
      reportVisible: false,
      // 新增/编辑类型
      type: '',
      // 编辑数据信息
      editListData: {},
      // 审核弹窗
      auditVisible: false,
      // 当前要审核的内容
      currentModify: {},
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
      // 加载状态
      loading: false,
    }
  },

  methods: {
    formatMinute,
    // 过滤成果图片
    filter(list) {
      let filterList = list.filter((item) => item.uploadType == '成果图片')
      return filterList.slice(0, 2)
    },
    // 审核弹框关闭
    auditCancel() {
      this.auditVisible = false
    },
    //编辑弹框取消按钮
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
        { queryType: 2, pageNo: this.pagination.current, pageSize: this.pagination.pageSize },
        this.searchArray
      )
      const { success, message, result } = await fetchScienceAchieve(params)

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
    //选中态改变
    handleSelectionChange(selection) {
      this.selection = selection
    },
    //全选
    handleSelectAll() {
      if (!this.isSelectAll) {
        this.selection = []
      } else {
        this.selection = this.applyList.map((item) => item.id)
      }
      this.isSelectAll = !this.isSelectAll
    },
    // 导出科技成果
    handleExport() {},
    // 更多操作,阻止点击进入预览
    handleClick(e) {
      e.stopPropagation()
    },
    //编辑数据
    async handleEdit(e) {
      // 根据数据id获取
      const { success, message, result } = await fetchScienceAchieveById(e.id)
      if (success) {
        this.type = 'edit'
        this.reportVisible = true
        this.editListData = result
      } else {
        this.$message.warning(message)
      }
    },
    // 退回
    async handleBack(e) {
      const { success, message } = await backScienceAchieve(e.id)
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
      this.$refs.apply.validateFields().then(async (res) => {
        let params = { id: this.currentModify.id, operaCode: res.operaCode, opinion: res.opinion }
        const { success, message } = await auditScienceAchieve(params)
        if (success) {
          this.auditVisible = false
          this.$message.success(message)
          this.dataList()
        } else {
          this.$message.warning(message)
        }
      })
    },
    // 查看项目
    handleLook(e, data) {
      e.stopPropagation()
      this.$router.push({
        name: 'project-manage-preview-@id-@type',
        params: {
          id: data.projectReport.id,
          type: 2,
        },
      })
    },
    // // 删除数据
    // handleDelete(e) {
    //   let that = this
    //   that.$confirm({
    //     title: '删除',
    //     icon: 'exclamation-circle',
    //     content: (
    //       <div>
    //         <p>确定删除？</p>
    //         <p>删除后将无法在列表中查到此条信息，请谨慎操作。</p>
    //       </div>
    //     ),
    //     okText: '确认',
    //     cancelText: '取消',
    //     async onOk() {
    //       const { success, message } = await deleteScienceAchieve({ id: e.id, queryType: 1 })
    //       if (success) {
    //         that.dataList()
    //         that.$message.success(message)
    //       } else {
    //         that.$message.warning(message)
    //       }
    //     },
    //   })
    // },
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
      // 图片
      /deep/ .ant-list-item-extra {
        margin-left: 0px;
        .extra {
          .extra-list {
            display: flex;
            justify-content: space-between;
            &-item:first-child {
              margin-left: 32px;
            }
            &-item {
              flex: 1;
              position: relative;
              width: 196px;
              height: 0px;
              padding-top: 196px;
              margin-left: 16px;
              .image {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
              }
            }
          }
        }
      }
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
