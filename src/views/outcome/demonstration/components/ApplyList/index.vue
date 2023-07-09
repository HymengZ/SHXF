<template>
  <div class="submit-container">
    <div class="search-form">
      <tag-check-box label="基地状态" :options="PRIZE_STATUS_EMNU" v-model="state" />
    </div>

    <div class="table">
      <a-row class="search" type="flex" justify="start">
        <a-col :span="8">
          <a-input-group compact>
            <a-select v-model="searchParams.searchType" style="display: inline-block; width: 160px">
              <a-select-option value="PROJECT_NAME"> 基地名称</a-select-option>
            </a-select>
            <a-input v-model="title" style="width: calc(100% - 160px)" placeholder="请输入" />
          </a-input-group>
        </a-col>
        <a-button type="primary" style="margin-left: 8px" @click="handleFetchList">搜索</a-button>
      </a-row>
      <div class="tips">
        <a-alert banner>
          <div slot="message" class="message">
            1、已发布的当前无法修改，如需修改/删除/退回请先下架；<br />
            2、已下架的如后续检查无问题可重新发布，避免影响后期业务对接；<br />
            3、提交方申请退回后，可操作退回，如不进行退回，可继续当前业务流程。
          </div>
        </a-alert>
      </div>

      <div class="data">
        <list-table :list="list" :pagination="pagination">
          <div slot="icon" slot-scope="{ row }">
            <img style="width: 105px; height: 105px" :src="uploadBaseDomain + row.certificatePhotoUrl" alt="" />
          </div>
          <div slot="title" slot-scope="{ row }">
            <span> {{ row.unitName }}</span>
            <a-badge :color="row.color" class="numberStyle" :text="row.typeTitle" />
          </div>
          <div slot="desc-left" slot-scope="{ row }">
            <div>
              <span>单位编号：{{ row.unitCode }}</span>
            </div>
            <div>
              <span>证书发放时间：{{ row.certificateGrantTime }}</span>
            </div>
             <div class="introduce">
              成果示范情况介绍：<j-ellipsis :value="row.baseSummary" :length="15"/> 
            </div>
          </div>
          <div slot="desc-right" slot-scope="{ row }">
            <div>
              <span>新建时间：{{ row.createTime }}</span>
            </div>
            <div v-if="row.submitTime != null">
              <span>提交时间:{{ row.submitTime }}</span>
            </div>
            <div v-if="row.auditTime != null">
              <span>审核时间：{{ row.auditTime }} </span>
              <a-popover placement="topLeft" arrow-point-at-center>
                <template #content> {{ row.auditOpinion }}</template>
                <a-icon
                  :style="{ color: row.auditOperate === 'pass' ? '#8C8C8C' : '#FF4D4F' }"
                  type="info-circle"
                  style="cursor: pointer"
                ></a-icon>
              </a-popover>
            </div>
            <div v-if="row.applyBackTime != null">
              <span>申请退回时间：{{ row.applyBackTime }}</span>
            </div>
            <div v-if="row.backTime != null">
              <span>退回时间:{{ row.backTime }}</span>
            </div>
            <div v-if="row.processStatus === '800'">
              <span>发布时间:{{ row.publishTime }}</span>
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
                <a-menu-item @click="applyDelete(row)" v-if="row.processStatus !== '800'">删除</a-menu-item>
                <a-menu-item @click="applyIssue(row)" v-if="row.processStatus === '200'">发布</a-menu-item>
                <a-menu-item @click="applySoldOut(row)" v-if="row.processStatus === '800'">下架</a-menu-item>
                <a-menu-item @click="applySendBack(row)" v-if="['150', '155'].indexOf(row.processStatus) !== -1">
                  退回
                </a-menu-item>
              </a-menu>
            </a-dropdown>

            <a-divider type="vertical" />
            <a-button style="color: #1890ff; border: 1px solid #1890ff" @click="handlePre(row)">基地详情</a-button>
            <a-divider type="vertical" />
            <a-button
              type="primary"
              @click="audit(row)"
              v-if="row.processStatus === '150' || row.processStatus === '155'"
            >
              审核
            </a-button>
          </div>
        </list-table>
      </div>
    </div>
    <j-modal
      title="示范基地编辑/新增"
      :visible="articleVisible"
      switchFullscreen
      :fullscreen="true"
      @ok="handleOk"
      okText="保存"
      @cancel="handleCancel"
      cancelText="关闭"
    >
      <log-modal ref="form"></log-modal>
    </j-modal>
    <a-modal v-model="auditVisible" @cancel="auditCancel" @ok="auditOk" width="50%" title="审核">
      <AuditForm ref="apply"></AuditForm>
    </a-modal>
  </div>
</template>

<script>
import TagCheckBox from '../../../components/TagCheckBox'
import ListTable from '../../../components/ListTable'
import LogModal from '../SubmitList/logModal'
import AuditForm from './auditForm'
import { isEqual } from 'lodash'

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
]
const states = {
  100: {
    typeTitle: '基地信息待提交',
    color: '#FAAD14',
  },
  130: {
    typeTitle: '已退回',
    color: '#FF0000',
  },
  140: {
    typeTitle: '基地信息审核驳回',
    color: '#FF0000',
  },
  150: {
    typeTitle: '基地信息待审核',
    color: '#FAAD14',
  },
  155: {
    typeTitle: '待退回',
    color: 'yellow',
  },
  200: {
    typeTitle: '审核通过',
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
import {
  addDemonstration,
  fetchDemonstration,
  addDemoSituation,
  fetchDemonstrationDetail,
  fetchAchieveDemoSituation,
  deleteAchieveDemoSituation,
  updateDemonstration,
  updateAchieveDemoSituation,
  deleteDemonstration,
  submitDemonstration,
  publishDemonstration,
  applyBackDemonstration,
  unpublishDemonstration,
  applyDemonstration,
  backDemonstration,
} from '@/api/outcome/demonstration'

export default {
  components: {
    TagCheckBox,
    ListTable,
    LogModal,
    AuditForm,
  },
  mounted() {
    this.handleFetchList()
  },
  computed: {
    uploadBaseUrl() {
      return process.env.VUE_APP_UPLOAD_BASE_URL
    },
    uploadBaseDomain() {
      // VUE_APP_UPLOAD_BASE_DOMAIN
      return process.env.VUE_APP_UPLOAD_BASE_DOMAIN
    },
    emptyText() {
      return <a-empty></a-empty>
    },
  },
  data() {
    return {
      articleVisible: false,
      auditVisible: false,
      list: [],
      title: '',
      states,
      state: [],
      pagination: {
        total: 0,
        pageSize: 10,
        showLessItems: true,
        showQuickJumper: true,
        showSizeChanger: true,
        current: 1,
        onChange: this.pageChange.bind(this),
        onShowSizeChange: this.pageChange.bind(this),
      },
      searchParams: {
        prizeStatusValue: [''],

        searchType: 'PROJECT_NAME',
      },
      currentModify: {},
      PRIZE_STATUS_EMNU,
    }
  },
  methods: {
    pageChange(page, pageSize) {
      this.pagination.current = page || 1
      this.pagination.pageSize = pageSize
      this.handleFetchList()
    },
    handleFetchList() {
      const state = this.state.includes('') ? [] : this.state
      fetchDemonstration({
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
        queryType: 2,
        processStatusList: state.join(','),
        unitName: this.title,
      }).then((res) => {
        console.log(res)
        this.list = res.result.records.map((item) => {
          console.log(this.states[item.processStatus], item.processStatus)
          return {
            ...item,
            ...this.states[item.processStatus],
          }
        })
        this.pagination.current = res.result.current
        this.pagination.pageSize = res.result.size
        this.pagination.total = res.result.total
      })
    },
    //跳转详情
    handlePre(row) {
      this.$router.push(`/outcome/demonstration/preview?id=${row.id}`)
    },
    //编辑
    async openReport(record) {
      this.articleVisible = true

      const res = await fetchDemonstrationDetail({ id: record.id })
      const data = await fetchAchieveDemoSituation({ baseId: record.id, pageNo: 1, pageSize: 100 })
      this.currentModify = {
        ...res.result,
        data: data.result.records,
      }
      console.log(res)
      setTimeout(() => {
        this.$refs.form.setFieldsValue({
          ...res.result,
          data: data.result.records,
        })
      })
    },
    //取消编辑弹窗
    handleCancel() {
      this.articleVisible = false
    },
    //确定编辑保存
    handleOk() {
      this.$refs.form.validateFields().then(async (val) => {
        console.log(val)
        if (!this.currentModify.id) {
          const res = await addDemonstration(val)
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }
          await Promise.all(
            val.data.map((item) => {
              delete item.id
              return addDemoSituation({
                ...item,
                baseId: res.result,
              }).then((res) => {
                if (res.code != 200) {
                  return Promise.reject(res)
                }
                return res
              })
            })
          )
          this.articleVisible = false
          this.$message.success('添加成功')
          this.handleFetchList()
        } else {
          const addRow = val.data.filter((item) => item.id < 0)
          const deleteRow = this.currentModify.data.filter((item) => !val.data.find((i) => i.id == item.id))
          const updateRow = val.data.filter((item) => {
            const finded = this.currentModify.data.find((i) => i.id == item.id)
            if (finded && !isEqual(finded, item)) {
              return true && item.id > 0
            }
          })
          console.log(val.data)
          const res = await updateDemonstration({
            ...this.currentModify,
            ...val,
          })
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }
          if (deleteRow.length) {
            await deleteAchieveDemoSituation({ ids: deleteRow.map((item) => item.id).join(',') })
          }
          if (updateRow.length) {
            await Promise.all(
              updateRow.map((item) => {
                return updateAchieveDemoSituation({
                  ...item,
                  baseId: this.currentModify.id,
                }).then((res) => {
                  if (res.code != 200) {
                    return Promise.reject(res)
                  }
                  return res
                })
              })
            )
          }
          if (addRow.length) {
            await Promise.all(
              addRow.map((item) => {
                delete item.id
                return addDemoSituation({
                  ...item,
                  baseId: this.currentModify.id,
                }).then((res) => {
                  if (res.code != 200) {
                    return Promise.reject(res)
                  }
                  return res
                })
              })
            )
          }
          console.log('修改', updateRow)
          console.log('删除', deleteRow)
          console.log('新增', addRow)
          this.articleVisible = false
          this.$message.success('编辑成功')
          this.handleFetchList()
        }
      })
    },
    //审核
    audit(row) {
      this.currentModify = row
      this.auditVisible = true
      this.$refs.apply.setFieldsValue({
        operate: auditOperate,
        opinion: auditOpinion,
      })
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
        applyDemonstration({
          id: this.currentModify.id,
          ...res,
        }).then((res) => {
          if (res.success) {
            this.reportVisible = false
            this.$message.success('审核成功')
            this.handleFetchList()
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
    //删除项目
    applyDelete(record) {
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
          deleteDemonstration({ id: record.id }).then((res) => {
            if (res.code !== 200) {
              this.$message.error(res.message)
              return
            }
            this.$message.success('删除成功')
            this.handleFetchList()
          })
        },
      })
    },
    //发布项目
    applyIssue(record) {
      this.$confirm({
        title: '发布',
        icon: 'exclamation-circle',
        content: '发布后将进入发布列表，删除/编辑/退回请先下架。',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          console.log('确定发布')
          publishDemonstration({ id: record.id }).then((res) => {
            if (res.code !== 200) {
              this.$message.error(res.message)
              return
            }
            this.handleFetchList()
          })
        },
      })
    },
    //下架项目
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
          unpublishDemonstration({ id: record.id }).then((res) => {
            if (res.code !== 200) {
              this.$message.error(res.message)
              return
            }
            this.handleFetchList()
          })
          console.log('确定下架')
        },
      })
    },
    //退回项目
    applySendBack(row) {
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
          backDemonstration({ id: row.id }).then((res) => {
            if (res.code != 200) {
              this.$message.error(res.message)
              return
            }
            this.$message.success('退回成功')
            this.handleFetchList()
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

  .numberStyle {
    margin-left: 10px;
  }

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
    padding: 0 24px;
  }
}
</style>