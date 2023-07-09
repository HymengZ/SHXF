<template>
  <div class="submit-container">
    <div class="table">
      <div class="tips">
        <a-alert banner>
          <div slot="message" class="message">
            1、已提交的当前无法修改，如需修改/删除请进行申请退回操作，单条成果示范情况介绍如果需要修改，也必须整个申请退回才能修改；<br />
            2、已下架的如无问题，请及时联系平台申述重新发布，避免影响后期业务对接。
          </div>
        </a-alert>
      </div>

      <div class="data">
        <a-button @click="handleAdd" type="primary" v-if="list.length">
          <a-icon type="plus"> </a-icon>
          <span>新增示范基地申请</span>
        </a-button>
        <list-table :list="list" :emptyText="emptyText" :pagination="pagination">
          <div slot="icon" slot-scope="{ row }">
            <img style="width: 85px; height: 85px" :src="uploadBaseDomain + row.certificatePhotoUrl" alt="" />
          </div>
          <div slot="title" slot-scope="{ row }" :span="12">
            <span>{{ row.unitName }}</span>
            <a-badge :color="row.color" class="numberStyle" :text="row.typeTitle" />
          </div>
          <div slot="desc-left" slot-scope="{ row }">
            <div>
              <span>单位编号：{{ row.unitCode }}</span>
            </div>
            <div>
              <span>证书发放时间：{{ row.certificateGrantTime }}</span>
            </div>
            <div class="introduce">成果示范情况介绍：<j-ellipsis :value="row.baseSummary" :length="15" /></div>
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
                <a-menu-item key="1" @click="Delete(row)" v-if="['100', '130'].indexOf(row.processStatus) !== -1"
                  >删除</a-menu-item
                >
                <a-menu-item key="2" @click="handlePreview(row)">预览</a-menu-item>
              </a-menu>
            </a-dropdown>
            <spn v-if="['100', '130'].indexOf(row.processStatus) !== -1">
              <a-divider type="vertical" />
              <a-button type="primary" @click="openCompile(row.id)">编辑</a-button>
              <a-divider type="vertical" />
              <a-button type="primary" @click="submit(row)">提交</a-button>
            </spn>
            <a-divider type="vertical" />
            <a-button type="primary" @click="back(row)" v-if="row.processStatus == '150'">申请退回</a-button>
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
  </div>
</template>

<script>
import TagCheckBox from '../../../components/TagCheckBox'
import ListTable from '../../../components/ListTable'
import LogModal from './logModal'
import JEllipsis from '../../../../../components/jeecg/JEllipsis.vue'
import { isEqual } from 'lodash'
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
  applyBackDemonstration,
} from '@/api/outcome/demonstration'
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
export default {
  components: {
    TagCheckBox,
    ListTable,
    LogModal,
    JEllipsis,
  },
  data() {
    return {
      articleVisible: false,
      
      list: [
        // {
        //   title: 'xxxxxxx',
        //   status: '',
        //   data1: '',
        //   data2: '',
        //   data3: '',
        //   data4: '',
        // },
      ],
      states,
      state: [],
      currentModify: {},
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
    }
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
      return (
        <a-empty>
          <a-button
            onClick={() => {
              this.handleAdd()
            }}
            type="primary"
          >
            <a-icon type="plus"> </a-icon>
            <span>新增示范基地申请</span>
          </a-button>
        </a-empty>
      )
    },
  },
  mounted() {
    this.handleFetchList()
  },
  methods: {
    handlePreview(record) {
      this.$router.push(`/outcome/demonstration/preview?id=${record.id}`)
    },
    pageChange(page, pageSize) {
      this.pagination.current = page || 1
      this.pagination.pageSize = pageSize
      this.handleFetchList()
    },
    //编辑
    async openCompile(id) {
      const res = await fetchDemonstrationDetail({ id })
      const data = await fetchAchieveDemoSituation({ pageNo: 1, pageSize: 100 })
      this.articleVisible = true
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
    handleFetchList() {
      const state = this.state.includes('') ? [] : this.state
      fetchDemonstration({
        publishUserId: this.$store.state.user.info.id,
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
        queryType: 1,
        unitName: this.title,
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
    handleCancel() {
      this.articleVisible = false
    },
    handleAdd() {
      this.articleVisible = true
    },
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
          console.log('确定提交', record)
          submitDemonstration({ id: record.id }).then((res) => {
            if (res.code !== 200) {
              this.$message.error(res.message)
              return
            }
            this.$message.success('提交成功')
            this.handleFetchList()
          })
        },
      })
    },
    back(record) {
      this.$confirm({
        title: '退回',
        icon: 'exclamation-circle',
        content: (
          <div>
            <p>确定退回？</p>
          </div>
        ),
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          console.log('确定提交', record)
          applyBackDemonstration({ id: record.id }).then((res) => {
            if (res.code !== 200) {
              this.$message.error(res.message)
              return
            }
            this.$message.success('退回成功')
            this.handleFetchList()
          })
        },
      })
    },
    Delete(record) {
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

  .numberStyle {
    margin-left: 10px;
  }
}
</style>