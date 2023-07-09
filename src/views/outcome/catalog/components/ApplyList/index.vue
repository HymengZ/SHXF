<template>
  <div class="submit-container">
    <div class="search-form">
      <tag-check-box label="成果推广状态" :options="PRIZE_STATUS_EMNU" v-model="state"/>
    </div>

    <div class="table">
      <a-row class="search" type="flex" justify="start">
        <a-col :span="8">
          <a-input-group compact>
            <a-select v-model="searchParams.searchType" style="display: inline-block; width: 160px">
              <a-select-option value="PROJECT_NAME"> 成果推广名称</a-select-option>
            </a-select>
            <a-input style="width: calc(100% - 160px)" placeholder="请输入" v-model="title"/>
          </a-input-group>
        </a-col>
        <a-button type="primary" style="margin-left: 8px" @click="handleSearch">搜索</a-button>
      </a-row>
      <div class="tips">
        <a-alert banner>
          <div slot="message" class="message">
            1、出现橙色“长效工作节点报告提交截止时间”字样，为已开放提交节点报告的长效科技成果推广，出现绿色图标为已提交，可下载节点报告；<br/>
            2、已发布的当前无法修改，如需修改/删除/退回请先下架；<br/>
            3、已下架的如后续检查无问题可重新发布，避免影响后期业务对接； <br/>
            4、提交方申请退回后，可操作退回，如不进行退回，可继续当前业务流程。
          </div>
        </a-alert>
      </div>
      <!-- <div class="actions">
        <a-button style="margin:0 4px 0 0">
          全选
        </a-button>
        <a-button >
          节点报告配置
        </a-button>
      </div> -->
      <div class="actions">
        <a-button style="margin-right: 10px" @click="handleToggleAll">
          {{ isSelectAll ? '取消全选' : '全选' }}
        </a-button>
        <a-button :disabled="!selection.length" @click="configuration"> 节点报告配置</a-button>
      </div>
      <div class="data">
        <list-table
          :list="list"
          :pagination="pagination"
          :selection="selection"
          :disabledSelection="['1']"
          @select="handleSelectionChange"
        >
          <div slot="icon">
            <a-icon type="reconciliation" style="font-size: 18px; color: #1890ff; margin-left: 6px"/>
          </div>
          <div class="title" slot-scope="{ row }" slot="title">
            <span>{{ row.extensionName || '-' }}</span>
            <a-badge :color="row.color" class="numberStyle" :text="row.typeTitle"/>

            <span style="color: #faad14; font-size: 14px; margin-left: 14px;"
                  v-if="row.noteReportConfig != null && row.noteReportConfig.length > 0"
            >长效工作节点报告提交截止时间：{{ row.noteReportConfig[0].uploadEndTime }}<a-icon
              v-if="row.noteReportConfig[0].fileUrl"
              type="check-circle"
              theme="filled"
              style="color: #52c41a; margin-left: 9px"
            /></span>
          </div>
          <div slot="desc-left" slot-scope="{ row }">

            <div>
              <span>成果推广编号：{{ row.extensionNumber }}</span>
            </div>
            <div>
              <span>关联的成果：{{ row.linkAchieveName }}</span>
            </div>
            <div>
              <span>配备范围：{{ row.equipmentRangeText }}</span>
            </div>
            <div>
              <span>填写单位：{{ row.unitName }}</span>
            </div>
          </div>
          <div slot="desc-right" slot-scope="{ row }">
            <div>
              <span>新建时间：{{ row.createTime }}</span>
            </div>

            <div v-if="row.submitTime !== null">
              <span>提交时间：{{ row.submitTime }}</span>
            </div>
            <div v-if="row.applyBackTime != null">
              <span>申请退回时间：{{ row.applyBackTime }}</span>
            </div>
            <div v-if="row.backTime != null">
              <span>退回时间：{{ row.backTime }}</span>
            </div>
            <div v-if="row.auditTime != null">
              <span>{{ row.auditNode === 'extension_purchase' ? '采购信息' : '总结' }}审核时间：{{ row.auditTime }} </span>
              <a-popover placement="topLeft" arrow-point-at-center>
                <template slot="content"> {{ row.auditOpinion }}</template>
                <a-icon :style="{color:(row.auditOperate === 'pass' ? '#8C8C8C' : '#FF4D4F')}"
                        type="info-circle" style="cursor: pointer"></a-icon>
              </a-popover>
            </div>
            <div v-if="row.processStatus === '800'">
              <span>发布时间：{{ row.publishTime }}</span>
            </div>
            <div v-if="row.processStatus === '900'">
              <span>下架时间：{{ row.lowerShelfTime }}</span>
            </div>
          </div>
          <div slot="actions" slot-scope="{ row }">
            <a-dropdown>
              <a-button>更多操作</a-button>
              <a-menu slot="overlay">
                <a-menu-item @click="openReport(row.id)" v-if="row.processStatus !== '800'">编辑</a-menu-item>
                <a-menu-item @click="Delete(row)" v-if="row.processStatus !== '800'">删除</a-menu-item>
                <a-menu-item @click="applyIssue(row)" v-if="row.processStatus === '300'">发布</a-menu-item>
                <a-menu-item @click="applySoldOut(row)" v-if="row.processStatus === '800'">下架</a-menu-item>
                <a-menu-item @click="SendBack(row)"
                             v-if="['150','155','250','255','300'].indexOf(row.processStatus) !== -1">退回
                </a-menu-item>
                <a-menu-item @click="downCog(row)" v-if="row.noteReportConfig.length >0">下载节点报告
                </a-menu-item>
              </a-menu>
            </a-dropdown>

            <a-divider type="vertical"/>
            <a-button ghost style="color: #1890ff; border: 1px solid #1890ff" @click="handelLook(row)">成果推广详情</a-button>
            <a-divider type="vertical"/>
            <a-button type="primary" @click="audit(row)"
                      v-if="['150','155','250','255'].indexOf(row.processStatus) !== -1">审核
            </a-button>
          </div>
        </list-table>
      </div>
    </div>
    <a-modal
      v-model="configurationVisible"
      title="节点报告配置"
      @cancel="configurationCancel"
      @ok="configurationOk"
      width="50%"
    >
      <ApplyConfiguration ref="configuration"></ApplyConfiguration>
    </a-modal>
    <!-- 添加/详情弹框 -->
    <j-modal
      title="科技成果推广编辑/新增"
      :visible="reportVisible"
      switchFullscreen
      :fullscreen="true"
      @ok="handleSubmit"
      okText="保存"
      @cancel="handleCancel"
      cancelText="关闭"
    >
      <pop-modal-list
        :treeData="treeData"
        :equipmentRangeData="equipmentRangeData"
        ref="form"
        :typeList="typeList"
        :type="type"
        :id="id"
        :infoList="infoList"
      ></pop-modal-list>
    </j-modal>
    <!-- 下载节点报告 -->
    <a-modal
      width="1200px"
      higth="378px"
      title="下载节点报告"
      :visible="downVisible"
      @ok="handleCancel"
      okText="保存并提交"
      @cancel="handleCancel"
      cancelText="关闭"
    >
      <down-configuration ref="configuration" :currentModify="currentModify"></down-configuration>
    </a-modal>
    <a-modal v-model="auditVisible" @cancel="auditCancel" @ok="auditOk" width="50%" title="审核">
      <AuditForm ref="apply"></AuditForm>
    </a-modal>
  </div>
</template>

<script>
import TagCheckBox from '../../../components/TagCheckBox'
import ListTable from '../../../components/ListTable'
import AuditForm from './auditForm.vue'
import ApplyConfiguration from './applyConfiguration'
import PopModalList from '../SubmitList/popModalList'
import DownConfiguration from './downConfiguration'
import {getAction, deleteAction} from '@api/manage'
import {
  addNoteReport,
  getAchieveExtensionDetail,
  backExtension,
  applyAchieve,
  publishAchieve,
  unpublishAchieve,
  searchAchieveExtension,
  EdtAchieveExtension,
  dictItem,
  getAchieveExtension,
} from '@api/outcome/catalog'
import {fetchTreeData} from '@/api/outcome/technology'

const PRIZE_STATUS_EMNU = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '采购信息待审核',
    value: '150',
  },
  {
    label: '采购信息审核驳回',
    value: '140',
  },
  {
    label: '总结待提交',
    value: '200',
  },
  {
    label: '总结待审核',
    value: '250',
  },
  {
    label: '总结审核通过',
    value: '300',
  },
  {
    label: '总结审核驳回',
    value: '240',
  },
  {
    label: '已发布',
    value: '800',
  },
  {
    label: '已下架',
    value: '900',
  },
  {
    label: '待退回',
    value: '155',
  },
  {
    label: '已退回',
    value: '230',
  },
]
const states = {
  100: {
    typeTitle: '采购信息待提交',
    color: '#FAAD14',
  },
  130: {
    typeTitle: '已退回',
    color: '#FAAD14',
  },
  140: {
    typeTitle: '采购信息审核驳回',
    color: '#FF0000',
  },
  150: {
    typeTitle: '采购信息待审核',
    color: '#FAAD14',
  },
  155: {
    typeTitle: '采购信息待退回',
    color: 'yellow',
  },
  200: {
    typeTitle: '总结待提交',
    color: '#FAAD14',
  },
  230: {
    typeTitle: '已退回',
    color: '#FF0000',
  },
  240: {
    typeTitle: '总结审核驳回',
    color: '#FF0000',
  },
  250: {
    typeTitle: '总结待审核',
    color: '#FAAD14',
  },
  255: {
    typeTitle: '总结待退回',
    color: 'yellow',
  },
  300: {
    typeTitle: '总结审核通过',
    color: '#FAAD14',
  },
  800: {
    typeTitle: '已发布',
    color: 'green',
  },
  900: {
    typeTitle: '已下架',
    color: '#FF0000',
  },
}
export default {
  components: {
    TagCheckBox,
    ListTable,
    AuditForm,
    ApplyConfiguration,
    PopModalList,
    DownConfiguration,
  },

  computed: {
    isSelectAll() {
      return this.list.every((item) => this.selection.indexOf(item.id) >= 0)
    },
  },
  data() {
    return {
      id: '',
      type: '',
      configurationVisible: false,
      configurationType: '',
      selection: [],
      auditVisible: false,
      reportVisible: false,
      downVisible: false,
      list: [],
      currentModify: {},
      extensinoMain: {},
      title: '',
      infoList: [],
      state: [],
      pagination: {
        total: 0,
        pageSize: 10,
        showLessItems: true,
        // showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条`,
        showSizeChanger: true,
        current: 1,
        onChange: this.pageChange.bind(this),
        onShowSizeChange: this.pageChange.bind(this),
      },
      pageSizeOptions: ['5', '10', '25', '50'],
      searchParams: {
        prizeStatusValue: [''],
        searchType: 'PROJECT_NAME',
      },
      PRIZE_STATUS_EMNU,
      url: {
        list: '/fire/achieveExtension/list',
        // SendBack: '/fire/achieveExtension/applyBackExtension',
        delete: '/fire/achieveExtension/delete',
      },
      equipmentRangeData: [],
      treeData: [],
    }
  },
  mounted() {
    this.dataList()
    this.handleFetchEquipmentRangeData()
    this.handleFetchTreeData()
  },
  props: {
    typeList: {
      type: Array,
      default: () => [],
      required: false,
    },
  },
  methods: {
    handleFetchTreeData(forceFirst = false) {
      fetchTreeData({levelType: 1}).then((res) => {
        this.treeData = res.result
      })
    },
    //推广范围
    handleFetchEquipmentRangeData() {
      dictItem({dictCode: 'equipment_range'}).then((res) => {
        this.equipmentRangeData = res.result.map((item) => {
          return {
            value: item.id,
            label: item.itemText,
          }
        })
      })
    },
    //查找搜索
    handleSearch() {
      this.dataList()
    },
    dataList() {
      this.loading = true
      let state = this.state.includes('') ? [] : this.state
      getAction(this.url.list, {
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
        extensionName: this.title,
        processStatusList: state.toString(),
        queryType: 2,
      }).then((res) => {
        if (res.success) {
          this.list = res.result.records.map((item) => {
            return {
              ...item,
              ...states[item.processStatus],
            }
          })
          this.pagination.total = res.result.total
        }
        this.loading = false
      })
    },
    pageChange(page, pageSize) {
      this.pagination.current = page || 1
      this.pagination.pageSize = pageSize
      this.dataList()
    },

    //跳转到成果详情
    handelLook(e) {
      this.$router.push(`/outcome/catalog/preview/${e.id}`)
    },
    //下载报告
    downCog(record) {
      this.currentModify = record
      this.downVisible = true
    },
    //打开编辑获取内容
    openReport(id) {
      this.reportVisible = true
      getAchieveExtension(id).then((res) => {
        if (!res.success) {
          this.$message.error(res.message)
          return
        }
        this.extensinoMain.extension = res.result
      })
      getAchieveExtensionDetail(id).then((res) => {
        if (res.success) {
          this.extensinoMain.extensionDetail = res.result
          //this.currentModify = record
        }

        setTimeout(() => {
          this.$refs.form.setFieldsValue(this.extensinoMain)
        })
      })
    },
    //编辑修改
    handleSubmit() {
      this.$refs.form.validateFields().then((val) => {
        if (this.extensinoMain.extensionDetail && this.extensinoMain.extensionDetail.id) {
          val = this.extensinoMain;
          // 更新
          EdtAchieveExtension(val).then((res) => {
            if (!res.success) {
              this.$message.error(res.message)
              return
            }
            this.dataList()
            this.reportVisible = false
          })
        }
      })
    },
    //确认关闭编辑页面
    handleCancel() {
      this.currentModify = {}
      this.reportVisible = false
      this.downVisible = false
    },
    //取消页面
    handleOk() {
      // this.reportVisible = false
      this.downVisible = false
    },
    //打开配置页面
    configuration() {
      this.configurationVisible = true
    },
    //关闭配置页面
    configurationCancel() {
      this.configurationVisible = false
    },
    //配置页面提交
    configurationOk() {
      this.$refs.configuration.validateFields().then((value) => {
        addNoteReport({
          ...value,
          submitStartTime: value.submitStartTime.format('YYYY-MM-DD HH:mm:ss'),
          uploadEndTime: value.uploadEndTime.format('YYYY-MM-DD HH:mm:ss'),
          unitId: this.$store.state.user.info.departId,
          userId: this.$store.state.user.info.id,
          contentIds: this.selection,
        }).then((res) => {
          if (!res.success) {
            this.$message.error(res.message)
            return
          }
          this.$message.success('配置成功')
          this.configurationCancel()
        })
      })
    },
    //推广审核
    audit(row) {
      this.currentModify = row
      this.auditVisible = true
      // this.$refs.apply.setFieldsValue({
      //   operate: auditOperate,
      //   opinion: auditOpinion,
      // })
    },
    //审核页面
    auditCancel() {
      this.currentModify = {}
      this.auditVisible = false
    },
    //审核页面提交
    auditOk() {
      this.$refs.apply.validateFields().then((res) => {
        this.auditVisible = false
        applyAchieve({
          id: this.currentModify.id,
          ...res,
        }).then((res) => {
          if (res.success) {
            this.reportVisible = false
            this.$message.success('审核成功')
            this.dataList()
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },

    //选中态改变
    handleSelectionChange(selection) {
      this.selection = selection
    },
    //删除项目
    Delete(e) {
      this.$confirm({
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
        onOk: () => {
          deleteAction(this.url.delete, {id: e.id}).then((res) => {
            if (res.success) {
              this.dataList()
              this.$message.success(res.message)
            } else {
              this.$message.warning(res.message)
            }
          })
        },
      })
    },
    //发布
    applyIssue(record) {
      this.$confirm({
        title: '发布',
        icon: 'exclamation-circle',
        content: (
          <div>
            <p>确定发布？</p>
            <p>发布会将进入发布列表，删除/编辑/退回请先下架。</p>
          </div>
        ),
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          publishAchieve(record.id).then((res) => {
            if (res.success) {
              this.reportVisible = false
              this.$message.success('发布成功')
              this.dataList()
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
    },
    //下架
    applySoldOut(record) {
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
        onOk: () => {
          unpublishAchieve(record.id).then((res) => {
            if (res.success) {
              this.$message.success('下架成功')
              this.dataList()
            } else {
              this.$message.error(res.message)
            }
          })
        },
      })
    },
    //退回
    SendBack(record) {
      this.$confirm({
        title: '退回',
        icon: 'exclamation-circle',
        content: (
          <div>
            <p>确定退回？</p>
            <p>退回后该信息提交人员即可进行编辑/删除。</p>
          </div>
        ),
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          backExtension(record.id).then((res) => {
            if (res.success) {
              this.dataList()
              this.$message.success('退回成功')
            } else {
              this.$message.error(res.message)
            }
          })
        },
      })
    },
    // 全选
    handleToggleAll() {
      // 假如全选 取消全选
      if (this.isSelectAll) {
        this.selection = []
      } else {
        this.selection = this.list.map((item) => item.id)
      }
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

  .actions {
    margin: 14px 15px 0;
  }

  .data {
    padding: 0 14px 15px;
  }
}

.numberStyle /deep/ .ant-badge-status-dot {
  width: 8px;
  height: 8px;
  margin-left: 15px;
}
</style>