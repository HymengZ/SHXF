<template>
  <a-card :bordered="false" style="background: #f5f5f5" id="aaa">
    <a-card>
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <a-row :gutter="24">
            <a-col :span="16">
              <div class="search-form">
                <tag-check-box
                  label="消息来源"
                  :options="projectMsgFromList"
                  v-model="msgFromSelected"
                  style="font-size: 14px"
                />
                <tag-check-box
                  label="是否处理"
                  :options="readerFlagList"
                  v-model="readFlagSelected"
                  style="font-size: 14px"
                />
              </div>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card style="margin-top: 30px">
      <div class="table-operator">
        <a-button @click="deleteSelected">删除</a-button>
        <a-button @click="readAll">已读</a-button>
      </div>

      <a-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <span slot="readFlag" slot-scope="text">
          <a-badge :color="text === '1' ? '#52C41A' : '#FAAD14'" /> {{ text === '1' ? '已读' : '未读' }}
        </span>
        <span slot="action" slot-scope="text, record">
          <a @click="showAnnouncement(record)">详情</a>
        </span>
      </a-table>
      <show-announcement ref="ShowAnnouncement" @reloadList="handleFetchList(1)"></show-announcement>
      <dynamic-notice ref="showDynamNotice" :path="openPath" :formData="formData" />
    </a-card>
  </a-card>
</template>

<script>
import { deleteAction, getAction, putAction } from '@/api/manage'
import ShowAnnouncement from '@/components/tools/ShowAnnouncement'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import DynamicNotice from '../../components/tools/DynamicNotice'
import TagCheckBox from '@views/project/components/TagCheckBox'

export default {
  name: 'UserAnnouncementList',
  mixins: [JeecgListMixin],
  components: {
    DynamicNotice,
    ShowAnnouncement,
    TagCheckBox,
  },
  data() {
    return {
      description: '消息中心',
      queryParam: {},
      readerFlagList: [
        {
          label: '全部',
          value: '',
        },
        {
          label: '已读',
          value: '1',
        },
        {
          label: '未读',
          value: '0',
        },
      ],
      dataSource: [],
      projectMsgFromList: [
        {
          label: '全部',
          value: '',
        },
      ],
      msgFromSelected: [],
      readFlagSelected: [],
      readFlag: '',
      msgFromArr: [],
      columns: [
        {
          title: '序号',
          align: 'center',
          dataIndex: 'id',
          width: '100px',
          customRender: (text, record, index) => {
            return index + 1
          },
        },
        {
          title: '消息标题',

          dataIndex: 'titile',
        },
        {
          title: '消息状态',
          align: 'center',
          dataIndex: 'readFlag',
          scopedSlots: {
            customRender: 'readFlag',
          },
        },
        {
          title: '消息来源',
          align: 'center',
          dataIndex: 'msgFrom',
        },
        {
          title: '发送时间',

          dataIndex: 'sendTime',
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          width: '100px',
          scopedSlots: { customRender: 'action' },
        },
      ],
      url: {
        list: '/sys/sysAnnouncementSend/getMyAnnouncementSend',
        editCementSend: 'sys/sysAnnouncementSend/editByAnntIdAndUserId',
        readAllMsg: 'sys/sysAnnouncementSend/readAll',
        deleteBatch: 'sys/sysAnnouncementSend/deleteBatch',
        listDicItem: '/sys/dictItem/listByDictCode',
      },
      loading: false,
      openPath: '',
      formData: '',
      selectedRowKeys: [],
      actioned: '',
    }
  },
  created() {
    this.handleProjectMsgTypes()
    // this.handleMyAnnouncementSends();
  },
  computed: {
    rowSelection(val) {
      console.log('rowSelection val', val)
    },
  },
  watch: {
    value() {},
    msgFromSelected() {
      if (this.msgFromSelected.indexOf('') !== -1) {
        this.msgFromArr = []
      } else {
        this.msgFromArr = [...this.msgFromSelected]
      }
      this.handleFetchList(1)
    },
    readFlagSelected() {
      if (this.readFlagSelected.length === 1 && this.readFlagSelected.indexOf('') === -1) {
        this.readFlag = this.readFlagSelected[0]
      } else {
        this.readFlag = ''
      }
      this.handleFetchList(1)
    },
  },
  methods: {
    handleOk(record) {
      console.log('record', record)
      putAction('sys/sysAnnouncementSend/editByAnntIdAndUserId', { anntId: record.anntId }).then((res) => {
        if (!res.success) {
          this.$message.error(res.message)
          return
        }
        this.visible = false
      })
    },
    // 查询消息来源字典
    handleProjectMsgTypes: function () {
      getAction(this.url.listDicItem, { dictCode: 'project_msg_from' }).then((res) => {
        console.log('res', res)
        if (!res.success) {
          this.$message.error(res.message)
          return
        }
        this.projectMsgFromList = [
          ...res.result.map((item) => {
            return {
              value: item.itemValue,
              label: item.itemText,
            }
          }),
        ]
        this.projectMsgFromList.unshift({
          value: '',
          label: '全部',
        })
      })
    },
    handleFetchList(val) {
      this.queryParam = {
        readFlag: this.readFlag,
        msgFrom: this.msgFromArr.join(','),
      }
      this.loadData(val)
    },
    handleDetail: function (record) {
      this.$refs.sysAnnouncementModal.detail(record)
      this.$refs.sysAnnouncementModal.title = '查看'
    },
    showAnnouncement(record) {
      if (record.openType === 'component') {
        this.openPath = record.openPage
        this.formData = { id: record.busId }
        this.$refs.showDynamNotice.detail()
      } else {
        console.log('record', record)
        this.$refs.ShowAnnouncement.detail(record)
      }
    },
    syncHeadNotic(anntId) {
      getAction('sys/annountCement/syncNotic', { anntId: anntId })
    },
    deleteSelected() {
      let that = this
      if (this.selectedRowKeys.length === 0) {
        this.$message.error('请至少选择一条消息')
        return
      }
      let selectIds = this.selectedRowKeys.join(',')
      console.log('that', that)
      that.$confirm({
        title: '确认操作',
        content: '是否删除已选择消息?',
        onOk: function () {
          deleteAction(that.url.deleteBatch, { ids: selectIds }).then((res) => {
            if (!res.success) {
              this.$message.error(res.message)
              return
            }
            that.selectedRowKeys = []
            that.$message.success(res.message)
            that.loadData()
            that.syncHeadNotic()
          })
        },
      })
    },
    readAll() {
      var that = this
      if (this.selectedRowKeys.length === 0) {
        this.$message.error('请至少选择一条消息')
        return
      }
      let selectIds = this.selectedRowKeys.join(',')
      that.$confirm({
        title: '确认操作',
        content: '是否全部标注已读?',
        onOk: function () {
          putAction(that.url.readAllMsg, { ids: selectIds }).then((res) => {
            if (!res.success) {
              this.$message.error(res.message)
              return
            }
            that.selectedRowKeys = []
            that.$message.success(res.message)
            that.loadData()
            that.syncHeadNotic()
          })
        },
      })
    },
  },
}
</script>
<style lang="less" scoped>
.ant-card-body .table-operator {
  margin-top: 18px;
  margin-bottom: 18px;
}

.anty-row-operator button {
  margin: 0 5px;
}

.page-header-wrapper {
  margin: -12px;
}

.ant-modal-cust-warp .ant-modal-body {
  height: calc(100% - 110px) !important;
  overflow-y: auto;
}

.container {
  .search-tab {
    background: #fff;
    margin-top: 20px;
  }
}
</style>
