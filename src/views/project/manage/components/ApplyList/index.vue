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
            1、项目管理分为历史项目填写和正在进行中项目两种，如果历史项目填写，提交方会一次把所有资料上传，审核完成后可直接操作“验收完成”；
            <br />
            2、项目如终止，请直接操作“更多操作”中的“项目终止”。
          </div>
        </a-alert>
      </div>

      <div class="data">
        <list-table :list="submitList" :pagination="pagination" :loading="loading" projectType="apply" :activeTab="2">
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
              <span>关联的科技需求：{{ row.demandId }}</span>
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
            <!-- 进程轴 -->
            <ProcessLine />
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
              <img
                v-if="['150', '200'].indexOf(row.processStatus) != -1"
                src="../../../../../assets/icon_待审核.png"
                alt="状态"
              />

              <img v-if="row.processStatus == '140'" src="../../../../../assets/icon_审核不通过.png" alt="状态" />
              <img v-if="row.processStatus == '400'" src="../../../../../assets/icon_审核通过.png" alt="状态" />
              <img v-if="row.processStatus == '450'" src="../../../../../assets/icon_验收完成.png" />
              <img v-if="row.processStatus == '950'" src="../../../../../assets/icon_项目终止.png" />
              <img v-if="row.processStatus == '135'" src="../../../../../assets/icon_待退回.png" alt="状态" />
              <img v-if="row.processStatus == '136'" src="../../../../../assets/icon_已退回.png" alt="状态" />
              <span v-if="row.processStatus == '400'" class="adopt">审核意见：{{ row.result }}</span>
              <span v-if="row.processStatus == '140'" class="fail">审核意见：{{ row.result }}</span>
            </div>
          </div>
          <div slot="stage" slot-scope="{ row }" class="stage">
            <div class="text">
              项目信息：
              <img
                v-if="row.projectInformation && row.projectInformation.attachmentStatus == '0'"
                src="../../../../../assets/icon_已完成.png"
                alt="已完成"
              />
              <img v-else src="../../../../../assets/icon_未完成.png" alt="未完成" />
            </div>
            <div v-if="row.stageCheckList">
              <div class="text" v-for="item in row.stageCheckList" :key="item.id">
                {{ item.configName }}：
                <img v-if="item.attachmentStatus == '0'" src="../../../../../assets/icon_已完成.png" alt="已完成" />
                <img v-else src="../../../../../assets/icon_未完成.png" alt="未完成" />
              </div>
            </div>

            <div class="text">
              绩效评价：<img
                v-if="row.evaluation && row.evaluation.attachmentStatus == '0'"
                src="../../../../../assets/icon_已完成.png"
                alt="已完成"
              />
              <img v-else src="../../../../../assets/icon_未完成.png" alt="未完成" />
            </div>
            <div class="endTime">最新截止时间：2022-12-12 13:00:00</div>
          </div>
          <div slot="actions" slot-scope="{ row }">
            <a-dropdown>
              <a-button @click="handleClick">更多操作</a-button>
              <a-menu slot="overlay">
                <a-menu-item
                  :disabled="['400', '140', '450', '950', '136'].indexOf(row.processStatus) != -1"
                  key="edit"
                  @click="handleEdit(row.id)"
                  v-has="'manageApply:edit'"
                >
                  编辑
                </a-menu-item>
                <a-menu-item
                  :disabled="['400', '140', '450', '950', '136'].indexOf(row.processStatus) != -1"
                  key="delete"
                  @click="handleDelete(row)"
                  v-has="'manageApply:delete'"
                >
                  删除
                </a-menu-item>
                <a-menu-item
                  :disabled="['150', '140', '135', '450', '950', '136'].indexOf(row.processStatus) != -1"
                  key="examine"
                  @click="handleExamine(row)"
                  v-has="'manageApply:finish'"
                >
                  验收完成
                </a-menu-item>
                <a-menu-item
                  :disabled="['150', '140', '135', '450', '950', '136'].indexOf(row.processStatus) != -1"
                  key="termination"
                  @click="handleTermination(row)"
                  v-has="'manageApply:over'"
                >
                  项目终止
                </a-menu-item>
                <a-menu-item
                  :disabled="['135'].indexOf(row.processStatus) == -1"
                  key="back"
                  @click="handleBack(row)"
                  v-has="'manageApply:return'"
                >
                  退回
                </a-menu-item>
              </a-menu>
            </a-dropdown>
            <a-button
              class="btn"
              type="primary"
              @click="openAuditModel($event, row)"
              :disabled="['136', '400', '140', '450', '950', '135'].indexOf(row.processStatus) != -1"
              v-has="'manageApply:audit'"
              >审核</a-button
            >
            <a-button
              class="btn"
              type="primary"
              @click="openFlowModel($event, row)"
              :disabled="['150', '135', '136', '400', '140', '950'].indexOf(row.processStatus) != -1"
              v-has="'manageApply:next'"
              >流转下一节点</a-button
            >
          </div>
        </list-table>
      </div>
    </div>

    <a-modal
      :visible="manageTypeVisible"
      :title="manageTypeTitle"
      @cancel="handleCancel"
      @ok="handleOk"
      okText="保存"
      :ok-button-props="{
        props: { disabled: !projectMessageFinish },
      }"
    >
      <ManageType
        ref="manageType"
        :manageTypeTitle="manageTypeTitle"
        :projectMessageFinish="projectMessageFinish"
        :evaluateFinish="evaluateFinish"
        :stageFinish="stageFinish"
        :currentEditData="editListData"
        @openProjectMessageModal="openProjectMessage"
        @openStageCheckModal="openStageCheck"
        @openEvaluateModal="openEvaluate"
      />
    </a-modal>
    <j-modal
      title="项目信息录入"
      :visible="messageVisible"
      switchFullscreen
      :fullscreen="true"
      @cancel="messageModalCancel"
      :footer="false"
    >
      <StepBar
        @cancelModal="messageModalCancel"
        :type="type"
        :editData="editListData"
        @choiceDataType="choiceDataType"
        :projectOwner="projectOwner"
        :projectCategory="projectCategory"
      />
    </j-modal>
    <j-modal
      title="阶段检查录入"
      :visible="checkVisible"
      switchFullscreen
      :fullscreen="true"
      @cancel="checkModalCancel"
      @ok="stageOk"
    >
      <StageCheck ref="stageCheck" :editData="editListData" />
    </j-modal>
    <j-modal
      title="绩效评价录入"
      :visible="evaluateVisible"
      switchFullscreen
      :fullscreen="true"
      @cancel="evaluateModalCancel"
      @ok="evaluateOk"
    >
      <PerformanceEvaluate ref="performanceEvaluate" :editData="editListData" />
    </j-modal>
    <a-modal v-if="visible" class="enterTips" title="资料录入提示" :visible="visible" :closable="false" :footer="false">
      <div class="modal-content">
        <div class="icon">
          <a-icon type="check-circle" theme="filled" style="color: #52c41a; font-size: 60px" />
        </div>
        <div class="text-blod">资料录入成功</div>
        <div class="text">如是历史项目，如一次性把所有资料上传。</div>
        <a-button class="back-btn" @click="backChoice">返回选择资料类型</a-button>
      </div>
    </a-modal>
    <!-- 审核弹窗 -->
    <AuditModal
      ref="apply"
      :adoptValue="'400'"
      :rejectValue="'140'"
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
import ListTable from '../../components/ListTable'
// 引入时间线
import ProcessLine from '../../components/ProcessLine'
// 引入项目信息步骤条
import StepBar from '../../components/StepBar'
// 引入审核弹窗
import AuditModal from '../../../components/AuditModal'
// 引入选择项目管理类型弹窗
import ManageType from '@/views/project/manage/components/SubmitList/ManageType'
// 引入阶段检查
import StageCheck from '@/views/project/manage/components/SubmitList/StageCheck'
// 引入绩效评价
import PerformanceEvaluate from '@/views/project/manage/components/SubmitList/PerformanceEvaluate'
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
    ProcessLine,
    ManageType,
    StageCheck,
    PerformanceEvaluate,
    AuditModal,
  },
  data() {
    return {
      // 当前ID
      currentId: '',
      // 当前要审核的数据信息
      currentModify: {},
      // 项目管理类型确认弹框
      manageTypeVisible: false,
      // 项目管理类型确认弹框标题
      manageTypeTitle: '',
      validatorRules: {
        projectManagementType: { initialValue: '1', rules: [{ required: true, message: '项目管理类型不能为空' }] },
      },
      // 项目信息是否完成
      projectMessageFinish: false,
      // 阶段检查是否完成
      stageFinish: false,
      // 绩效评价是否完成
      evaluateFinish: false,
      // 项目信息-弹框
      messageVisible: false,

      // 项目信息-编辑数据信息
      editListData: {},
      // 阶段检查-弹框
      checkVisible: false,
      // 绩效评价-弹框
      evaluateVisible: false,
      // 信息保存提示-弹框
      visible: false,
      // 审核弹窗
      auditVisible: false,
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

      // 加载状态
      loading: false,
      // 请求的url
      url: {
        list: '/fire/projectReport/list',
        delete: '/fire/projectReport/delete',
        submitProjectReport: '/fire/projectReport/submitProjectReport',
        applyBackProjectReport: '/fire/projectReport/applyBackProjectReport',
        queryById: '/fire/projectReport/queryById',
        edit: '/fire/projectReport/edit',
        // 阶段检查，绩效评价
        configure: '/fire/projectReportConfig/configure',
        //批量配置
        configureBatch: '/fire/projectReportConfig/configureBatch',
        // 审核
        auditProjectReport: '/fire/projectReport/auditProjectReport',
        // 流转下一节点
        nextNode: '/fire/projectReport/nextNode',
        // 项目终止
        terminationProjectReport: '/fire/projectReport/terminationProjectReport',
        // 退回
        backProjectReport: '/fire/projectReport/backProjectReport',
        // 验收完成
        acceptanceProjectReport: '/fire/projectReport/acceptanceProjectReport',
      },
    }
  },

  methods: {
    formatMinute,
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
    // 阻止点击更多操作也能进入预览
    handleClick(e) {
      e.stopPropagation()
    },

    // 项目管理类型弹窗关闭
    handleCancel() {
      this.manageTypeVisible = false
    },

    // 项目管理类型保存
    handleOk() {
      this.$refs.manageType.manageTypeForm().then((values) => {
        let params = Object.assign({}, { id: this.editListData.id }, values)
        postAction(this.url.edit, params).then((res) => {
          if (!res.success) {
            this.$message.warning(res.message || '保存失败')
            return
          }
          this.$message.success('保存成功')
          this.manageTypeVisible = false
          this.dataList()
        })
      })
    },
    //阶段检查录入保存
    stageOk() {
      let stageData = this.$refs.stageCheck.hanldeSubmit()
      postAction(this.url.configureBatch, stageData).then((res) => {
        if (!res.success) {
          this.$message.warning(res.message)
          return
        }
        this.currentId = this.editListData.id
        this.visible = true
      })
    },

    // 绩效评价录入保存
    evaluateOk() {
      this.$refs.performanceEvaluate.performanceEvaluateForm().then((values) => {
        let params = Object.assign(
          {},
          {
            id: this.editListData.evaluation.id,
            contentId: this.editListData.id,
            // 是否完成
            attachmentStatus: '0',
            configType: '2',
          },
          values
        )
        postAction(this.url.configure, params).then((res) => {
          if (!res.success) {
            this.$message.warning(res.message)
            return
          }
          this.currentId = this.editListData.id
          this.visible = true
        })
      })
    },

    // 打开项目信息弹窗
    openProjectMessage() {
      this.messageVisible = true
      this.manageTypeVisible = false
    },
    //项目信息-弹框取消按钮
    messageModalCancel() {
      this.messageVisible = false
      this.dataList()
    },
    // 阶段检查-弹框关闭
    checkModalCancel() {
      this.checkVisible = false
    },
    // 打开阶段检查弹窗
    openStageCheck() {
      this.checkVisible = true
      this.manageTypeVisible = false
    },
    // 绩效评价-弹框关闭
    evaluateModalCancel() {
      this.evaluateVisible = false
    },
    // 打开绩效评价弹框
    openEvaluate() {
      this.evaluateVisible = true
      this.manageTypeVisible = false
    },
    // 项目信息-打开选择资料类型
    choiceDataType(id) {
      this.visible = true
      this.currentId = id
    },
    // 打开审核弹窗
    openAuditModel(e, row) {
      e.stopPropagation()
      this.currentModify = row
      this.auditVisible = true
      this.$nextTick(() => {
        this.$refs.apply.resetForm()
      })
    },
    // 审核弹框关闭
    auditCancel() {
      this.auditVisible = false
    },
    // 返回选择资料类型
    backChoice() {
      this.visible = false
      this.messageVisible = false
      this.evaluateVisible = false
      this.checkVisible = false
      this.dataList()
      this.handleEdit(this.currentId)
    },
    //编辑
    handleEdit(e) {
      let params = { id: e }
      // 根据id查看当前数据
      getAction(this.url.queryById, params).then((res) => {
        if (res.success) {
          this.editListData = res.result
          this.type = 'edit'
          this.manageTypeVisible = true
          this.manageTypeTitle = '项目编辑'
          // 判断项目信息是否完成
          if (res.result.projectInformation && res.result.projectInformation.attachmentStatus == '0') {
            this.projectMessageFinish = true
            // 阶段检查是否完成
            if (res.result.stageCheckList) {
              this.stageFinish = true
            } else {
              this.stageFinish = false
            }

            // 项目信息完成了再判断绩效评价是否完成
            if (res.result.evaluation && res.result.evaluation.attachmentStatus == '0') {
              this.evaluateFinish = true
            } else {
              this.evaluateFinish = false
            }
          } else {
            this.projectMessageFinish = false
          }

          // 项目管理类型设置
          this.$nextTick(() => {
            this.$refs.manageType.setManageTypeForm(res.result.projectManagementType)
          })
        } else {
          this.$message(res.message || '获取当前数据失败')
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
            <div>确定删除？</div>
            <span>删除后将无法在列表中查到此条信息，请谨慎操作。</span>
          </div>
        ),
        okText: '确定',
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

    // 验收完成
    handleExamine(e) {
      let that = this
      that.$confirm({
        title: '验收完成',
        icon: 'exclamation-circle',
        content: (
          <div>
            <div>确定验收完成？</div>
            <span>验收完成后项目将结束后续资料的填报工作。</span>
          </div>
        ),
        okText: '确定',
        cancelText: '取消',
        onOk() {
          postAction(that.url.acceptanceProjectReport + `?id=${e.id}`).then((res) => {
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
    // 项目终止
    handleTermination(e) {
      let that = this
      that.$confirm({
        title: '项目终止',
        icon: 'exclamation-circle',
        content: (
          <div>
            <div>确定项目终止？</div>
            <span>项目终止后将不再进行项目管理，后续资料继续提交也将关闭。</span>
          </div>
        ),
        okText: '确定',
        cancelText: '取消',
        onOk() {
          postAction(that.url.terminationProjectReport + `?id=${e.id}`).then((res) => {
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
      postAction(`${this.url.backProjectReport}?id=${e.id}`).then((res) => {
        if (res.success) {
          this.dataList()
          this.$message.success(res.message)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 审核
    auditOk() {
      this.$refs.apply.validateFields().then((res) => {
        postAction(
          `${this.url.auditProjectReport}?id=${this.currentModify.id}&operaCode=${res.operaCode}&opinion=${res.opinion}`
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
    // 流转下一节点
    openFlowModel(e, row) {
      e.stopPropagation()
      this.currentModify = row
      let that = this
      that.$confirm({
        title: '流转到下一节点',
        icon: 'exclamation-circle',
        content: (
          <div>
            <div>确定进入下一节点？</div>
            <span>
              进入新节点后，操作权限转到提交单位，继续编辑其他材料，保存后下一节点显示“已完成”，提交后继续审核。
            </span>
          </div>
        ),
        okText: '确定',
        cancelText: '取消',
        onOk() {
          postAction(that.url.nextNode + `?id=${row.id}`).then((res) => {
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
    .tips {
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
          //审核通过
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
      // 阶段
      .stage {
        margin-bottom: 8px;
        .text {
          font-size: 14px;
          font-weight: 400;
          text-align: right;
          color: #bfbfbf;
          line-height: 20px;
        }
        .endTime {
          margin-top: 16px;
          font-size: 14px;
          font-weight: 500;
          text-align: right;
          color: rgba(0, 0, 0, 0.25);
          line-height: 20px;
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
// 保存弹出框内容
.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  .icon {
    margin-bottom: 20px;
  }
  .text-blod {
    font-size: 20px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    line-height: 32px;
    margin-bottom: 6px;
  }
  .text {
    font-size: 13px;
    font-weight: 400;
    text-align: center;
    color: #8c8c8c;
    line-height: 22px;
    margin-bottom: 20px;
  }
  .back-btn {
    width: 100%;
  }
}
</style>
