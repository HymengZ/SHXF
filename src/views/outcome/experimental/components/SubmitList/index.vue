<template>
  <div class="submit-container">
    <div class="search-form">
      <tag-check-box label="试点应用状态" :options="PRIZE_STATUS_EMNU" v-model="state"/>
    </div>

    <div class="table">
      <a-row class="search" type="flex" justify="start">
        <a-col :span="8">
          <a-input-group compact>
            <a-select v-model="searchParams.searchType" style="display: inline-block; width: 160px">
              <a-select-option value="PROJECT_NAME"> 试点应用名称</a-select-option>
            </a-select>
            <a-input style="width: calc(100% - 160px)" v-model="title" placeholder="请输入"/>
          </a-input-group>
        </a-col>
        <a-button type="primary" style="margin-left: 8px" @click="dataList">搜索</a-button>
      </a-row>
      <div class="tips">
        <a-alert banner>
          <div slot="message" class="message">
            1、已提交的当前无法修改，如需修改/删除请进行申请退回操作；<br/>
            2、已下架的如无问题，请及时联系平台申述重新发布，避免影响后期业务对接。
          </div>
        </a-alert>
      </div>
      <div class="actions">
        <a-button type="primary" @click="openReport">
          <a-icon type="plus"/>
          新增科技成果试点应用
        </a-button>
      </div>
      <div class="data">
        <list-table :list="list" :pagination="pagination">
          <div slot="icon">
            <a-icon type="control" theme="twoTone" style="font-size: 18px; color: #1890ff"/>
          </div>
          <div class="title" slot-scope="{ row }" slot="title">
            <span>{{ row.pilotName || '-' }}</span>
            <a-badge :color="row.color" class="numberStyle" :text="row.typeTitle"/>
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
                <a-menu-item v-if="row.processStatus === '150' || row.processStatus === '250'" key="back"
                             @click="SendBack(row)">申请退回
                </a-menu-item>
                <a-menu-item key="delete" @click="Delete(row)"
                             v-if="['100','130','140','200','230','240','900'].indexOf(row.processStatus) !== -1">删除
                </a-menu-item>
                <a-menu-item key="preview" @click="handlePreview(row)">预览</a-menu-item>
              </a-menu>
            </a-dropdown>
            <a-divider type="vertical"/>
            <span v-if="['100','130','140','200','230','240','900'].indexOf(row.processStatus) !== -1">
            <a-button type="primary" @click="openCompile(row.id)">编辑</a-button>
            <a-divider type="vertical"/>
            <a-button type="primary" @click="submit(row)">提交</a-button>
            </span>
            <a-button style="color: #1890ff; border: 1px solid #1890ff" @click="handlePreview(row)" v-else>
              试点应用详情
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
      :destoryOnClose="false"
      forceRender
    >
      <pop-modal-list ref="form" :equipmentRangeData="equipmentRangeData" :typeList="typeList" :type="type" :id="id"
                      :infoList="infoList"></pop-modal-list>
    </j-modal>
  </div>
</template>

<script>
import TagCheckBox from '../../../components/TagCheckBox'
import ListTable from '../../../components/ListTable'
import PopModalList from './popModalList.vue'
import {dictItem} from '@/api/outcome/catalog'
import {getAction, deleteAction, postAction} from '@api/manage'
import {
  EdtAchievePilot,
  EdAchievePilot,
  addAchievePilot,
  getAchievePilotDetail,
  submitAchievePilot, //提交
  backAchievePilot, getAchievePilot,
} from '@/api/outcome/experimental'

const PRIZE_STATUS_EMNU = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '领用申请待提交',
    value: '100',
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
    typeTitle: '领用申请已退回',
    color: '#FAAD14',
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
    typeTitle: '领用申请待退回',
    color: 'yellow',
  },
  200: {
    typeTitle: '总结待提交',
    color: '#FAAD14',
  },
  230: {
    typeTitle: '总结已退回',
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
    PopModalList,
  },
  data() {
    return {
      equipmentRangeData: [],
      pilotMain: {}, //表单
      type: '',
      id: '',
      infoList: {},
      reportVisible: false,
      searchParams: {
        prizeStatusValue: [''],
        searchType: 'PROJECT_NAME',
      },
      title: '',
      loading: false,
      //分页
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
      list: [],
      states,
      state: [''],
      PRIZE_STATUS_EMNU,
      currentModify: {},
      url: {
        list: '/fire/fireAchievePilot/list', //列表
        //apply: '/fire/achieveExtension/applyBackExtension',
        submit: '/fire/fireAchievePilot/submitPilot', //提交
        // SendBack: '/fire/achieveExtension/applyBackExtension',
        delete: '/fire/fireAchievePilot/delete', //删除
        back: '/fire/fireAchievePilot/backPilot', //申请退回
      },
    }
  },
  props: {
    typeList: {
      type: Array,
      default: () => [],
      required: false,
    },
  },
  created() {
    this.handleFetchEquipmentRangeData() //定义推广范围数据
  },
  mounted() {
    this.dataList()
  },
  methods: {
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
        queryType: 1,
      })
        .then((res) => {
          if (res.success) {
            this.list = res.result.records.map((item) => {
              return {
                ...item,
                ...this.states[item.processStatus],
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
    //pageSize 变化的回调
    pageChange(page, pageSize) {
      this.pagination.current = page || 1
      this.pagination.pageSize = pageSize
      this.dataList()
    },
    // 添加保存
    handleSubmit() {
      this.$refs.form.validateFields().then((val) => {
        if (this.pilotMain.pilotDetail && this.pilotMain.pilotDetail.id) {
          // 更新
          EdtAchievePilot({
            ...val,

            pilot: {
              ...val.pilot,
              id: this.pilotMain.pilotDetail.mainId,
            },
            pilotDetail: {
              ...val.pilotDetail,
              id: this.pilotMain.pilotDetail.id,
            },
          }).then((response) => {
            console.log(response)
            if (!response.success) {
              this.$message.error(response.message)
              return
            }
            this.dataList()
            this.handleCancel()
          })
        } else {
          // 新建
          addAchievePilot(val).then((response) => {
            if (!response.success) {
              this.$message.error(res.message)
              return
            }
            this.dataList()
            this.handleCancel()
          })
        }
      })
    },
    //跳转详情
    handlePreview(record) {
      this.$router.push(`/outcome/experimental/preview?id=${record.id}`)
    },
    //新增推广
    openReport() {
      this.type = 'add'
      this.reportVisible = true
    },
    //添加/详情弹框确定按钮
    handleOk() {
      this.reportVisible = false
    },
    //保存提交关闭按钮
    //添加/详情弹框取消按钮
    handleCancel() {
      this.pilotMain = {}
      this.reportVisible = false
    },
    //点击编辑获取表单详情
    openCompile(id) {
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
    //提交
    submit(e) {
      this.$confirm({
        title: '提交',
        icon: 'exclamation-circle',
        content: (
          <div>
            <p>确定提交？</p>
            <p>提交后将无法编辑与删除，需申请退回才可进行修改。</p>
          </div>
        ),
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          submitAchievePilot(this.url.submit, {id: e.id}).then((res) => {
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
    //申请退回
    SendBack(e) {
      this.$confirm({
        title: '申请退回',
        icon: 'exclamation-circle',
        content: "确定申请退回？",
        // content: (
        //   <div>
        //     <p>确定申请退回？</p>
        //     <p>发送申请后需审核人员操作才能进行编辑/删除。</p>
        //   </div>
        // ),
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          console.log('申请退回')
          backAchievePilot({id: e.id}).then((res) => {
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
          console.log('确定删除')
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
    overflow: hidden;

    .title {
      line-height: 24px;
      font-size: 16px;
    }
  }
}

.numberStyle /deep/ .ant-badge-status-dot {
  width: 8px;
  height: 8px;
  margin-left: 15px;
}
</style>