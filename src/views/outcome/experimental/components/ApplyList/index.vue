<template>
  <div class="submit-container">
    <div class="search-form">
      <tag-check-box label="试点应用状态" :options="PRIZE_STATUS_EMNU" v-model="state" />
    </div>

    <div class="table">
      <a-row class="search" type="flex" justify="start">
        <a-col :span="8">
          <a-input-group compact>
            <a-select v-model="searchParams.searchType" style="display: inline-block; width: 160px">
              <a-select-option value="PROJECT_NAME"> 试点应用名称</a-select-option>
            </a-select>
            <a-input style="width: calc(100% - 160px)" placeholder="请输入" v-model="title" />
          </a-input-group>
        </a-col>
        <a-button type="primary" style="margin-left: 8px" @click="handleSearch">搜索</a-button>
      </a-row>
      <div class="tips">
        <a-alert banner>
          <div slot="message" class="message">
            1、已发布的当前无法修改，如需修改/删除/退回请先下架；<br />
            2、已下架的如后续检查无问题可重新发布，避免影响后期业务对接； <br />
            3、提交方申请退回后，可操作退回，如不进行退回，可继续当前业务流程。
          </div>
        </a-alert>
      </div>
      <!-- <div class="actions">
        <a-button type="primary">
          <a-icon type="plus" />
          新增科技成果试点应用
        </a-button>
      </div> -->
      <div class="data">
        <list-table :list="list" :pagination="pagination">
          <div slot="icon">
            <a-icon type="control" theme="twoTone" style="font-size: 18px; color: #1890ff" />
          </div>
          <div class="title" slot-scope="{ row }" slot="title">
            <span>{{ row.pilotName || '-' }} </span>
            <a-badge :color="row.color" class="numberStyle" :text="row.typeTitle" />
          </div>
          <div slot="desc-left" slot-scope="{ row }">
            <div>
              <span>试点应用编号：{{ row.pilotNumber }}</span>
            </div>
            <div>
              <span>关联的成果:成果名称：{{ row.linkAchieveName }}</span>
            </div>
            <div>
              <span>配备范围：{{ row.equipmentRangeText }}</span>
            </div>
            <div>
              <span>填写单位：{{ row.unitName }}</span>
            </div>
          </div>
          <div slot="desc-right" slot-scope="{ row }">
            <div v-if="row.createTime !== null">
              <span>新建时间：{{ row.createTime }}</span>
            </div>
            <div v-if="row.submitTime !== null">
              <span>提交时间：{{ row.submitTime }}</span>
            </div>
            <div v-if="row.applyBackTime !== null">
              <span>申请退回时间：{{ row.applyBackTime }}</span>
            </div>
            <div v-if="row.auditTime !== null">
              <span>{{ row.auditNode === 'pilot_receive' ? '领用申请' : '总结' }}审核时间：{{ row.auditTime }} </span>
              <a-popover placement="topLeft" arrow-point-at-center>
                <template #content> {{ row.auditOpinion }}</template>
                <a-icon
                  :style="{ color: row.auditOperate === 'pass' ? '#8C8C8C' : '#FF4D4F' }"
                  type="info-circle"
                  style="cursor: pointer"
                ></a-icon>
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
                <a-menu-item v-if="row.processStatus === '300'" @click="applyIssue(row)">发布</a-menu-item>
                <a-menu-item v-if="row.processStatus === '800'" @click="applySoldOut(row)">下架</a-menu-item>
                <a-menu-item
                  v-if="['100', '155', '200', '255'].indexOf(row.processStatus) !== -1"
                  @click="SendBack(row)"
                >
                  退回
                </a-menu-item>
              </a-menu>
            </a-dropdown>
            <a-divider type="vertical" />
            <a-button ghost style="color: #1890ff; border: 1px solid #1890ff" @click="handlePreview(row)"
              >试点应用详情
            </a-button>
            <a-divider type="vertical" />
            <a-button
              type="primary"
              @click="audit(row)"
              v-if="['150', '155', '250', '255'].indexOf(row.processStatus) !== -1"
              >审核
            </a-button>
          </div>
        </list-table>
      </div>
    </div>
    <!-- 添加/详情弹框 -->
    <j-modal
      title="科技成果试点应用编辑/新增"
      :visible="reportVisible"
      switchFullscreen
      :fullscreen="true"
      @ok="handleSubmit"
      okText="保存"
      @cancel="handleCancel"
      cancelText="关闭"
    >
      <pop-modal-list
        ref="form"
        :equipmentRangeData="equipmentRangeData"
        :typeList="typeList"
        :type="type"
        :id="id"
        :infoList="infoList"
      >
      </pop-modal-list>
    </j-modal>
    <a-modal v-model="auditVisible" @cancel="auditCancel" @ok="auditOk" width="50%" title="审核">
      <AuditForm ref="apply"></AuditForm>
    </a-modal>
  </div>
</template>

<script>
import TagCheckBox from '../../../components/TagCheckBox'
import ListTable from '../../../components/ListTable'
import PopModalList from '../SubmitList/popModalList'
import AuditForm from './auditForm'
import { getAction, deleteAction, postAction } from '@/api/manage'
import {
  backExtension, //退回
  applyAchieve, //审核
  publishAchieve, //发布
  unpublishAchieve, //下架
  searchAchieveExtension, //查找
  getAchievePilotDetail, //编辑
  EdtAchieveExtension,
  getAchievePilot, //更新
} from '@/api/outcome/experimental'
import { dictItem } from '@/api/outcome/catalog'

const PRIZE_STATUS_EMNU = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '领用申请待审核',
    value: '150',
  },
  {
    label: '领用申请审核驳回',
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
    typeTitle: '领用申请待提交',
    color: '#FAAD14',
  },
  130: {
    typeTitle: '已退回',
    color: '#FF0000',
  },
  140: {
    typeTitle: '领用申请审核驳回',
    color: '#FF0000',
  },
  150: {
    typeTitle: '领用申请待审核',
    color: '#FAAD14',
  },
  155: {
    typeTitle: '待退回',
    color: '#FAAD14',
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
    typeTitle: '待退回',
    color: '#FAAD14',
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
    color: 'green',
  },
}
export default {
  components: {
    TagCheckBox,
    ListTable,
    PopModalList,
    AuditForm,
  },
  data() {
    return {
      id: '',
      type: '',
      reportVisible: false,
      auditVisible: false,
      list: [],
      infoList: [],
      equipmentRangeData: [],
      pilotMain: {},
      title: '',
      currentModify: {},
      state: [''],
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
      pageSizeOptions: ['5', '10', '25', '50'],
      searchParams: {
        prizeStatusValue: [''],

        searchType: 'PROJECT_NAME',
      },
      PRIZE_STATUS_EMNU,
      url: {
        list: '/fire/fireAchievePilot/list',
        delete: '/fire/fireAchievePilot/delete', //删除
      },
    }
  },
  created() {
    this.handleFetchEquipmentRangeData()
  },
  mounted() {
    this.dataList()
  },
  props: {
    typeList: {
      type: Array,
      default: () => [],
      required: false,
    },
  },
  methods: {
    //推广范围
    handleFetchEquipmentRangeData() {
      dictItem({ dictCode: 'equipment_range' }).then((res) => {
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
      let state = this.state.includes('') ? [] : this.state
      searchAchieveExtension(this.url.list, {
        processStatusList: state.toString(),
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
        extensionName: this.title,
      }).then((res) => {
        if (!res.success) {
          this.$message.error(res.message)
          return
        }
        this.dataList()
      })
    },
    //列表
    dataList() {
      this.loading = true
      let state = this.state.includes('') ? [] : this.state

      getAction(this.url.list, {
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
        uploadEndTime: this.uploadEndTime, //长效节点截止时间
        pilotName: this.title,
        processStatusList: state.toString(),
        queryType: 2,
      })
        .then((res) => {
          if (res.success) {
            this.list = res.result.records.map((item) => {
              return {
                ...item,
                ...states[item.processStatus],
              }
            })
            this.pagination.total = res.result.total
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    //页码改变的回调
    pageChange(page, pageSize) {
      this.pagination.current = page || 1
      this.pagination.pageSize = pageSize
      this.dataList()
    },

    //跳转详情
    handlePreview(record) {
      this.$router.push(`/outcome/experimental/preview?id=${record.id}`)
    },
    //打开编辑
    openReport(id) {
      getAchievePilot(id).then((res) => {
        this.pilotMain.pilot = res.result
      })
      getAchievePilotDetail(id).then((res) => {
        
          this.pilotMain.pilotDetail = res.result
          this.reportVisible = true
          // this.currentModify = record
     
        setTimeout(() => {
          this.$refs.form.setFieldsValue(this.pilotMain)
        })
      })
    },
    //关闭编辑
    handleCancel() {
      this.reportVisible = false
    },
    //提交编辑弹窗
    handleSubmit() {
      this.$refs.form.validateFields().then((val) => {
        if (this.pilotMain.pilotDetail && this.pilotMain.pilot.id) {
          // 更新
          EdtAchieveExtension(val).then((res) => {
            console.log(res)
            this.dataList()
            this.reportVisible = false
          })
        }
      })
    },
    //试点应用审核
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
    //删除项目
    Delete(e) {
      this.$confirm({
        title: '删除',
        icon: 'exclamation-circle',
        content: (
          <div>
            <p> 确定删除？</p>
            <p> 删除后将无法在列表中查到此条信息，请谨慎操作。</p>
          </div>
        ),
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          console.log('确定删除')
          deleteAction(this.url.delete, { id: e.id }).then((res) => {
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
    //发布项目
    applyIssue(record) {
      this.$confirm({
        title: '发布',
        icon: 'exclamation-circle',
        content: (
          <div>
            <p> 确定发布？</p>
            <p> 发布会将进入发布列表，删除 / 编辑 / 退回请先下架。</p>
          </div>
        ),
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          publishAchieve({ id: record.id }).then((res) => {
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
    applySoldOut(record) {
      this.$confirm({
        title: '下架',
        icon: 'exclamation-circle',
        content: (
          <div>
            <p> 确定下架？</p>
            <p> 下架后该信息可删除 / 编辑 / 退回。</p>
          </div>
        ),
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          unpublishAchieve({ id: record.id }).then((res) => {
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
            <p> 确定退回？</p>
            <p> 退回后该信息提交人员即可进行编辑 / 删除。</p>
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