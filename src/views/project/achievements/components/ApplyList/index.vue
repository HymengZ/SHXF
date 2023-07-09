<template>
  <div class="submit-container">
    <div class="search-form">
      <tag-check-box
        label="成果类别"
        :options="[{ label: '全部', value: '' }, ...PRIZE_CATEGORY_EMNU]"
        v-model="searchParams.prizeCategoryValue"
      />
      <tag-check-box label="成果状态" :options="PRIZE_STATUS_EMNU" v-model="searchParams.prizeStatusValue" />
    </div>

    <div class="table">
      <a-row class="search" type="flex" justify="start">
        <a-col :span="8">
          <a-input-group compact>
            <a-select v-model="searchParams.searchType" style="display: inline-block; width: 160px">
              <a-select-option value="PROJECT_NAME"> 成果名称 </a-select-option>
            </a-select>
            <a-input style="width: calc(100% - 160px)" placeholder="请输入" v-model="searchParams.searchKey" />
          </a-input-group>
        </a-col>
        <a-button type="primary" style="margin-left: 8px" @click="handleSearch">搜索</a-button>
      </a-row>
      <div class="tips">
        <a-alert banner>
          <div slot="message" class="message">
            1、可通过批量导出功能导出科技成果.pdf文件，上面有上海消防科技平台水印；<br />
            2、发布后支队管理员/业务处室/消防员在项目查询中能通过成果信息选项查询搜索；<br />
            3、提交方申请退回后，可操作退回，如不进行退回，可继续当前业务流程。
          </div>
        </a-alert>
      </div>
      <div class="actions">
        <a-button style="margin-right: 10px" @click="handleToggleAll">
          {{ isSelectAll ? '取消全选' : '全选' }}
        </a-button>
        <a-button @click="exportAchieve"> 导出科技成果 </a-button>
      </div>
      <div class="data">
        <list-table
          :list="list"
          :selection="selection"
          :disabledSelection="['1']"
          @select="handleSelectionChange"
          :pagination="pagination"
          :footer="false"
        >
          <div slot="title" slot-scope="{ row }">
            {{ row.achieveName }}
            <a-badge :color="row.color" style="margin-left: 10px" :text="row.typeTitle" />
          </div>
          <div slot="desc-left" slot-scope="{ row }">
            <div>
              <span>成果编号：{{ row.achieveNumber }}</span>
            </div>
            <div>
              <span>成果类别：{{ row.achieveCategoryName }}</span>
            </div>
            <div>
              <span>发布单位：{{ row.unitName }}</span>
            </div>
            <div>
              <span>关联的科技项目：{{ row.linkProjectName }}</span>
            </div>
          </div>
          <div slot="desc-right" slot-scope="{ row }">
            <div>
              <span>新建时间：{{ row.createTime }}</span>
            </div>
            <div v-if="row.submitTime != null">
              <span>提交时间：{{ row.submitTime }}</span>
            </div>
            <div v-if="row.applyBackTime != null">
              <span>申请退回时间：{{ row.applyBackTime }}</span>
            </div>
            <div v-if="row.backTime != null">
              <span>退回时间：{{ row.backTime }}</span>
            </div>
            <div v-if="row.auditTime != null">
              <span
                >审核时间：{{ row.auditTime }}
                <a-popover placement="topLeft" arrow-point-at-center>
                  <template #content> {{ row.auditOpinion }}</template>
                  <a-icon
                    :style="{ color: row.auditOperate === 'pass' ? '#8C8C8C' : '#FF4D4F' }"
                    type="info-circle"
                  ></a-icon>
                </a-popover>
              </span>
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
                <a-menu-item @click="openReport(row)" v-if="row.processStatus !== '800'">编辑</a-menu-item>
                <a-menu-item @click="handleDelete(row)" v-if="row.processStatus !== '800'">删除</a-menu-item>
                <a-menu-item @click="release(row)" v-if="row.processStatus === '200'">发布</a-menu-item>
                <a-menu-item @click="soldOut(row)" v-if="row.processStatus === '800'">下架</a-menu-item>
                <a-menu-item @click="sendBack(row)" v-if="['150', '155', '200'].indexOf(row.processStatus) !== -1"
                  >退回</a-menu-item
                >
              </a-menu>
            </a-dropdown>

            <a-divider type="vertical" />
            <a-button @click="preview(row)">成果详情</a-button>
            <a-divider type="vertical" />
            <a-button type="primary" @click="audit(row)" v-if="['150', '155'].indexOf(row.processStatus) !== -1"
              >审核</a-button
            >
          </div>
          <!-- <div slot="footer" slot-scope="{ row }" :span="12">
            <a-tag v-for="index in 30" :key="index" style="margin-bottom: 9px">Tag 1</a-tag>
          </div> -->
        </list-table>
      </div>
    </div>
    <!-- 添加/详情弹框 -->
    <j-modal
      title="项目报备编辑/新增"
      :visible="reportVisible"
      switchFullscreen
      :fullscreen="true"
      @ok="handleOk"
      @cancel="handleCancel"
      cancelText="关闭"
    >
      <report-modal-list ref="form" :category="PRIZE_CATEGORY_EMNU" :id="id" :editType="editType"></report-modal-list>
    </j-modal>
    <a-modal v-model="auditVisible" @cancel="auditCancel" @ok="auditOk" width="50%" title="审核">
      <AuditForm ref="apply"></AuditForm>
    </a-modal>
  </div>
</template>

<script>
import TagCheckBox from '../../../components/TagCheckBox'
import ListTable from '../../../components/ListTable'
import ReportModalList from '../SubmitList/reportModalList.vue'
import AuditForm from './auditForm.vue'
import {
  fetchCategory,
  fetchScienceAchieve,
  backScienceAchieve,
  addScienceAchieve,
  publishScienceAchieve,
  unpublishScienceAchieve,
  deleteScienceAchieve,
  getScienceAchieve,
  editScienceAchieve,
  applyScienceAchieve,
  applyBackScienceAchieve,
} from '@api/project/achievements'
import {  downloadFile } from '@api/manage'
import moment from 'moment'

const PRIZE_STATUS_EMNU = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '待审核',
    value: '150',
  },
  {
    label: '审核通过',
    value: '200',
  },
  {
    label: '审核驳回',
    value: '140',
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
    value: '130',
  },
  {
    label: '已失效',
    value: '1',
  },
]

const states = {
  100: {
    typeTitle: '待提交',
    color: '#FAAD14',
  },
  130: {
    typeTitle: '已退回',
    color: '#FF0000',
  },
  140: {
    typeTitle: '审核驳回',
    color: '#FF0000',
  },
  150: {
    typeTitle: '待审核',
    color: '#FAAD14',
  },
  155: {
    typeTitle: '待退回',
    color: '#FAAD14',
  },
  200: {
    typeTitle: '审核通过',
    color: 'green',
  },
  800: {
    typeTitle: '已发布',
    color: 'green',
  },
  900: {
    typeTitle: '已下架',
    color: '#FAAD14',
  },
}

const exportUrl = '/fire/scienceAchieve/exportPdf'

export default {
  components: {
    TagCheckBox,
    ListTable,
    ReportModalList,
    AuditForm,
  },
  computed: {
    isSelectAll() {
      return this.list.every((item) => this.selection.indexOf(item.id) >= 0)
    },
  },
  data() {
    return {
      id: '',
      editType: 'appleEdit',
      reportVisible: false,
      auditVisible: false,
      selection: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        onChange: this.pageChange.bind(this),
        onShowSizeChange: this.pageChange.bind(this),
      },
      list: [],
      searchParams: {
        prizeStatusValue: [''],
        prizeCategoryValue: [''],
        searchKey: '',
        searchType: 'PROJECT_NAME',
      },
      PRIZE_STATUS_EMNU,
      PRIZE_CATEGORY_EMNU: [],
      currentModify: {},
    }
  },
  mounted() {
    this.handleFetchCategory()
    this.handleFetchList()
  },
  methods: {
    // 导出科技成果
    exportAchieve() {
      if (this.selection.length === 0) {
        this.$message.error('请至少选择一条需要导出的科技成果')
        return
      }
      let fileName = moment().format('YYYY年MM月DD日 科技成果导出') +'.pdf'
      let id = this.selection.join(',')
      downloadFile(exportUrl, fileName, {id:id })
    },
    handleSearch() {
      this.pagination.current = 1
      this.handleFetchList()
    },
    pageChange(page, pageSize) {
      this.pagination.current = page || 1
      this.pagination.pageSize = pageSize
      this.handleFetchList()
    },
    handleDelete(record) {
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
          deleteScienceAchieve(record.id).then((res) => {
            if (res.success) {
              this.$message.success('删除成功')
              this.handleFetchList()
              return
            }
            this.$message.error(res.message)
          })
          console.log('确定删除')
        },
      })
    },
    handleFetchList() {
      console.log(this.searchParams)
      fetchScienceAchieve({
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
        achieveCategory: this.searchParams.prizeCategoryValue.includes('')
          ? ''
          : this.searchParams.prizeCategoryValue.join(','),
        processStatus: this.searchParams.prizeStatusValue.includes('')
          ? ''
          : this.searchParams.prizeStatusValue.join(','),
        achieveName: this.searchParams.searchKey,
        queryType: '2',
      }).then((res) => {
        console.log(res)
        this.list = res.result.records.map((item) => {
          return {
            ...item,
            ...states[item.processStatus],
          }
        })
        this.pagination.current = res.result.current
        this.pagination.pageSize = res.result.size
        this.pagination.total = res.result.total
      })
    },
    handleFetchCategory() {
      fetchCategory().then((res) => {
        this.PRIZE_CATEGORY_EMNU = [
          ...res.result.map((item) => {
            return {
              label: item.itemText,
              value: item.id,
            }
          }),
        ]
      })
    },
    //项目审核
    audit(row) {
      this.currentModify = row
      this.auditVisible = true
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
        applyScienceAchieve({
          id: this.currentModify.id,
          ...res,
        }).then((res) => {
          if (res.success) {
            this.reportVisible = false
            this.$message.success('提交成功')
            this.handleFetchList()
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
    //成果详情
    preview(row) {
      this.$router.push(`/project/achievements/preview/${row.id}`)
    },
    //编辑项目
    openReport(record) {
      this.id = record.id
      this.reportVisible = true
      // getScienceAchieve(record.id).then(res => {
      //   this.reportVisible = true
      //   this.currentModify = res.result
      //   setTimeout(() => {
      //     this.$refs.form.setFieldsValue(res.result)
      //   })
      // })
    },
    //添加/详情弹框确定按钮
    handleOk() {
      this.$refs.form.validateFields().then((val) => {
        editScienceAchieve({
          ...val,
        }).then((res) => {
          if (res.success) {
            this.reportVisible = false
            this.$message.success('修改成功')
            this.handleFetchList()
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
    //添加/详情弹框取消按钮
    handleCancel() {
      this.currentModify = {}
      this.reportVisible = false
    },
    // 选中态改变
    handleSelectionChange(selection) {
      this.selection = selection
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

    //发布项目
    release(record) {
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
          publishScienceAchieve(record.id).then((res) => {
            if (res.success) {
              this.reportVisible = false
              this.$message.success('发布成功')
              this.handleFetchList()
            } else {
              this.$message.error(res.message)
            }
          })
          console.log('确定发布')
        },
      })
    },
    //下架项目
    soldOut(record) {
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
          unpublishScienceAchieve(record.id).then((res) => {
            if (res.success) {
              this.$message.success('下架成功')
              this.handleFetchList()
            } else {
              this.$message.error(res.message)
            }
          })
          // console.log('确定下架')
        },
      })
    },
    //退回项目
    sendBack(record) {
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
          backScienceAchieve(record.id).then((res) => {
            if (res.success) {
              this.$message.success('退回成功')
              this.handleFetchList()
            } else {
              this.$message.error(res.message)
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

  .actions {
    margin: 14px 15px 0;
  }

  .data {
    padding: 0 14px 15px;
  }
}
</style>
