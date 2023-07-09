<template>
  <div class="submit-container">
    <div class="search-form">
      <!-- 筛选组 -->
      <tag-check-box :options="submitFilterGroup" @searchParams="searchParams" />
    </div>
    <div class="table">
      <div class="tips">
        <a-alert banner>
          <div slot="message" class="message">
            1、项目管理分为历史项目填写和正在进行中项目两种，如果历史项目填写，可在一次把所有资料上传，管理员审核完成后将直接验收完成；
            <br />
            2、正在进行中项目，管理员审核通过后点击【流转下一节点】，列表中出现后续资料待提交，橙色的“最新的截止时间”会根据项目信息获取，如需变更
            请联系后台修改；
            <br />
            3、已提交的项目当前无法修改，如需修改/删除请进行申请退回操作；
            <br />
            4、项目终止或者项目信息变成，请及时联系后台管理人员操作。
          </div>
        </a-alert>
      </div>
      <div class="actions">
        <a-button type="primary" @click="handleAdd" v-has="'manageSubmit:add'">
          <a-icon type="plus" />
          新增项目
        </a-button>
      </div>
      <div class="data">
        <list-table :list="submitList" :pagination="pagination" :loading="loading" :activeTab="1">
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
                v-if="['150', '400'].indexOf(row.processStatus) != -1"
                src="../../../../../assets/icon_待审核.png"
                alt="待审核"
              />
              <img v-if="row.processStatus == '135'" src="../../../../../assets/icon_待退回.png" alt="待退回" />
              <img v-if="row.processStatus == '100'" src="../../../../../assets/icon_待提交.png" alt="待提交" />
              <img v-if="row.processStatus == '136'" src="../../../../../assets/icon_已退回.png" alt="已退回" />
              <img v-if="row.processStatus == '140'" src="../../../../../assets/icon_审核不通过.png" alt="审核不通过" />
              <img v-if="row.processStatus == '450'" src="../../../../../assets/icon_验收完成.png" />
              <img v-if="row.processStatus == '950'" src="../../../../../assets/icon_项目终止.png" />
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
            <div class="endTime">最新截止时间：</div>
          </div>
          <div slot="actions" slot-scope="{ row }">
            <a-dropdown>
              <a-button @click="handleClick">更多操作</a-button>
              <a-menu slot="overlay">
                <a-menu-item
                  key="delete"
                  :disabled="['150', '135', '400', '450'].indexOf(row.processStatus) != -1"
                  @click="handleDelete(row)"
                  v-has="'manageSubmit:delete'"
                >
                  删除
                </a-menu-item>
                <a-menu-item
                  key="edit"
                  :disabled="['150', '135', '400', '450'].indexOf(row.processStatus) != -1"
                  @click="handleEdit(row.id)"
                  v-has="'manageSubmit:edit'"
                >
                  编辑
                </a-menu-item>
                <a-menu-item
                  key="submit"
                  @click="handleSubmit(row)"
                  :disabled="
                    row.projectInformation == null ||
                    ['150', '135', '136', '400', '450'].indexOf(row.processStatus) != -1
                  "
                  v-has="'manageSubmit:submit'"
                >
                  提交
                </a-menu-item>
                <a-menu-item
                  key="back"
                  :disabled="['100', '135', '136', '450', '950', '140', '400'].indexOf(row.processStatus) != -1"
                  @click="handleBack(row)"
                  v-has="'manageSubmit:applyReturn'"
                >
                  申请退回
                </a-menu-item>
              </a-menu>
            </a-dropdown>
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
        props: { disabled: manageTypeTitle == '项目新增' || (manageTypeTitle == '项目编辑' && !projectMessageFinish) },
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
  </div>
</template>
<script>
// 引入封装的搜索框
import TagCheckBox from '../TagCheckBox'
// 引入封装的表格
import ListTable from '../../components/ListTable'
// 引入时间线
import ProcessLine from '../../components/ProcessLine'
// 引入选择项目管理类型弹窗
import ManageType from './ManageType.vue'
// 引入项目信息步骤条
import StepBar from '../../components/StepBar'
// 引入阶段检查
import StageCheck from '@/views/project/manage/components/SubmitList/StageCheck'
// 引入绩效评价
import PerformanceEvaluate from '@/views/project/manage/components/SubmitList/PerformanceEvaluate'
import { formatMinute } from '@/utils/formatDate'
// 引入请求
import { getAction, postAction, deleteAction } from '@/api/manage.js'
export default {
  props: {
    // 筛选组
    submitFilterGroup: {
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
  },
  data() {
    return {
      // 当前ID
      currentId: '',
      // 项目管理类型确认弹框
      manageTypeVisible: false,
      // 项目管理类型确认弹框标题
      manageTypeTitle: '项目新增',
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
        //
        configureBatch: '/fire/projectReportConfig/configureBatch',
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
        { queryType: 1, pageNo: this.pagination.current, pageSize: this.pagination.pageSize },
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
    //新增-打开项目管理类型弹框
    handleAdd() {
      this.type = 'add'
      this.manageTypeTitle = '项目新增'
      this.manageTypeVisible = true
      this.$nextTick(() => {
        this.$refs.manageType.resetFields()
      })
    },
    //编辑-打开项目管理类型弹框
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

          // 项目管理类型选择框赋值
          this.$nextTick(() => {
            this.$refs.manageType.setManageTypeForm(res.result.projectManagementType)
          })
        } else {
          this.$message(res.message || '获取当前数据失败')
        }
      })
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
      console.log('id', id)
      this.visible = true
      this.currentId = id
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
          deleteAction(that.url.delete, { id: e.id, queryType: 1 }).then((res) => {
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
    // 更多操作-提交
    handleSubmit(e) {
      postAction(`${this.url.submitProjectReport}?id=${e.id}`).then((res) => {
        if (res.success) {
          this.dataList()
          this.$message.success('提交成功')
        } else {
          this.$message.warning(res.message || '提交失败')
        }
      })
    },
    //更多操作-申请退回
    handleBack(e) {
      postAction(`${this.url.applyBackProjectReport}?id=${e.id}`).then((res) => {
        if (res.success) {
          this.dataList()
          this.$message.success('申请退回成功')
        } else {
          this.$message.warning(res.message || '申请退回失败')
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
