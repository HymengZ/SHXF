<template>
  <div class="submit-container">
    <div class="search-form">
      <tag-check-box label="成果类别" :options="[{ label: '全部', value: '' }, ...PRIZE_CATEGORY_EMNU]"
                     v-model="searchParams.prizeCategoryValue"/>
      <tag-check-box label="成果状态" :options="PRIZE_STATUS_EMNU" v-model="searchParams.prizeStatusValue"/>
    </div>

    <div class="table">
      <a-row class="search" type="flex" justify="start">
        <a-col :span="8">
          <a-input-group compact>
            <a-select v-model="searchParams.searchType" style="display: inline-block; width: 160px">
              <a-select-option value="PROJECT_NAME"> 成果名称</a-select-option>
            </a-select>
            <a-input style="width: calc(100% - 160px)" placeholder="请输入" v-model="searchParams.searchKey"/>
          </a-input-group>
        </a-col>
        <a-button type="primary" style="margin-left: 8px" @click="handleSearch">搜索</a-button>
      </a-row>
      <div class="tips">
        <a-alert banner>
          <div slot="message" class="message">
            1、本模块主要是对项目报备中产生的科技成果进行信息收集，成果与科技项目绑定后可在项目详情中查看，综合查询中也能通过成果名称搜索到相应科技项目; <br/>
            2、已提交的当前无法修改，如需修改/删除请进行申请退回操作； <br/>
            3、已下架的如无问题，请及时联系平台申述重新发布，避免影响后期业务对接。
          </div>
        </a-alert>
      </div>
      <div class="actions">
        <a-button type="primary" @click="openReport">
          <a-icon type="plus"/>
          新增科技成果
        </a-button>
      </div>
      <div class="data">
        <list-table :list="list" :pagination="pagination">
          <div slot="icon">
            <a-icon type="book-outlined" style="font-size: 18px; color: #1890ff"/>
          </div>
          <div slot="title" slot-scope="{row}">
            <span> {{ row.achieveName }}</span>
            <a-badge :color="row.color" style="margin-left: 10px" :text="row.typeTitle"/>
            <span></span>
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
            <span>审核时间：{{ row.auditTime }}
              <a-popover placement="topLeft" arrow-point-at-center>
                <template #content> {{ row.auditOpinion }}</template>
                <a-icon :style="{color:(row.auditOperate === 'pass' ? '#8C8C8C' : '#FF4D4F')}"
                        type="info-circle"></a-icon>
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
                <a-menu-item @click="handleSendBack(row)" v-if="row.processStatus === '150'">申请退回</a-menu-item>
                <a-menu-item @click="handleDelete(row)"
                             v-if="['100','130','140','900'].indexOf(row.processStatus) !== -1">删除
                </a-menu-item>
                <a-menu-item @click="preview(row)">预览</a-menu-item>
              </a-menu>
            </a-dropdown>
            <span v-if="['100','130','140','900'].indexOf(row.processStatus) !== -1">
            <a-divider type="vertical"/>
            <a-button type="primary" @click="openCompile(row)">编辑</a-button>
            <a-divider type="vertical"/>
            <a-button type="primary" @click="submit(row)">提交</a-button>
            </span>
          </div>

        </list-table>
      </div>
    </div>
    <!-- 添加/详情弹框 -->
    <j-modal title="科技成果编辑/新增" :visible="reportVisible" switchFullscreen :fullscreen="true" @ok="handleOk"
             @cancel="handleCancel" cancelText="关闭">
      <report-modal-list ref="form" :category="PRIZE_CATEGORY_EMNU" :id="id" :editType="editType"></report-modal-list>
    </j-modal>
  </div>
</template>

<script>
import TagCheckBox from '../../../components/TagCheckBox'
import ListTable from '../../../components/ListTable'
import ReportModalList from './reportModalList.vue'
import {
  fetchCategory,
  submitScienceAchieve,
  fetchScienceAchieve,
  addScienceAchieve,
  deleteScienceAchieve,
  getScienceAchieve,
  editScienceAchieve,
  applyBackScienceAchieve
} from '@api/project/achievements'
import Icons from '../../../../system/modules/icon/Icons.vue'

const PRIZE_STATUS_EMNU = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '待提交',
    value: '1',
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
  }
}

export default {
  components: {
    TagCheckBox,
    ListTable,
    ReportModalList,
    Icons
  },
  data() {
    return {
      id: '',
      editType: '',
      achieveNumber: '',
      reportVisible: false,
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
        searchType: 'PROJECT_NAME',
        searchKey: ''
      },
      PRIZE_STATUS_EMNU,
      PRIZE_CATEGORY_EMNU: [],
      currentModify: {}
    }
  },
  mounted() {
    this.handleFetchCategory()
    this.handleFetchList()
  },
  methods: {

    handleSearch() {
      this.pagination.current = 1
      this.handleFetchList()
    },
    pageChange(page, pageSize) {
      this.pagination.current = page || 1
      this.pagination.pageSize = pageSize
      this.handleFetchList()
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
    handleDelete(record) {
      this.$confirm({
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
        onOk: () => {
          deleteScienceAchieve(record.id).then(res => {
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
      fetchScienceAchieve({
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,

        achieveCategory: this.searchParams.prizeCategoryValue.includes('')
          ? ''
          : this.searchParams.prizeCategoryValue.join(','),
        processStatus: this.searchParams.prizeStatusValue.includes('') ? '' : this.searchParams.prizeStatusValue.join(','),
        achieveName: this.searchParams.searchKey,
        queryType: '1'
      }).then((res) => {
        console.log(res)
        this.list = res.result.records.map(item => {
          return {
            ...item,
            ...states[item.processStatus]
          }
        })
        this.pagination.current = res.result.current
        this.pagination.pageSize = res.result.size
        this.pagination.total = res.result.total
      })
    },
    //新增项目
    openReport() {
      this.reportVisible = true
      this.editType = 'add'
    },
    //添加/详情弹框确定按钮
    handleOk() {
      this.$refs.form.validateFields().then(val => {
        if (this.currentModify.id) {
          editScienceAchieve({
            ...this.currentModify,
            ...val
          }).then(res => {
            if (res.success) {
              this.reportVisible = false
              this.$message.success('修改成功')
              this.handleFetchList()
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          addScienceAchieve(val).then((res) => {
            if (res.success) {
              this.reportVisible = false
              this.$message.success('添加成功')
              this.handleFetchList()
            } else {
              this.$message.error(res.message)
            }
          })
        }

      })
    },
    //添加/详情弹框取消按钮
    handleCancel() {
      this.currentModify = {}
      this.reportVisible = false
    },
    //编辑
    openCompile(record) {
      this.editType = 'edit'
      this.id = record.id
      this.reportVisible = true
      this.currentModify.id = record.id
      // getScienceAchieve(record.id).then(res => {
      //   this.reportVisible = true
      //   this.currentModify = res.result
      //   setTimeout(() => {
      //     this.$refs.form.setFieldsValue(res.result)
      //   })
      // })
    },

    //提交
    submit(record) {
      this.$confirm({
        title: '提交',
        icon: 'exclamation-circle',
        content: (
          <div>
            <p>确定提交？</p>
            <p>提交后无法编辑与删除，需申请退回才可进行修改。</p>
          </div>
        ),
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          console.log('确定提交')
          submitScienceAchieve(record.id).then(res => {
            if (res.success) {
              this.$message.success('操作成功')
              this.handleFetchList()
              return
            }
            this.$message.error(res.message)
          })
        },
      })
    },
    //申请退回
    handleSendBack(record) {
      this.$confirm({
        title: '申请退回',
        icon: 'exclamation-circle',
        content: (
          <div>
            <p>确定申请退回？</p>
            <p>发送申请后需审核人员操作退回才能进行编辑/删除。</p>
          </div>
        ),
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          applyBackScienceAchieve(record.id).then(res => {
            if (res.success) {
              this.reportVisible = false
              this.$message.success('操作成功')
              this.handleFetchList()
            } else {
              this.$message.error(res.message)
            }
          })
        },
      })
    },

    //预览
    preview(row) {
      this.$router.push(`/project/achievements/preview/${row.id}`)
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
