<template>
  <div class="invitation-history">
    <a-form :form="form">
      <a-row :gutter="24" type="flex" align="middle">
        <a-col :span="6">
          <a-form-item label="被邀请单位名称">
            <a-input v-decorator="['beInvitedUnitName']" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="邀请时间">
            <j-date
              v-decorator="['inviteTime']"
              style="width: 100%"
              placeholder="请选择年度月份"
              date-format="YYYY-MM-DD"
            >
              <a-icon slot="suffixIcon" type="clock-circle" />
            </j-date>
          </a-form-item>
        </a-col>
        <a-col style="margin-bottom: 24px">
          <a-button @click="handleReset">重置</a-button>
          <a-button type="primary" style="margin-left: 8px" @click="handleSearch">查询</a-button>
        </a-col>
      </a-row>
    </a-form>
    <a-table
      rowKey="id"
      class="table"
      :columns="columns"
      :data-source="listData"
      :pagination="pagination"
      :loading="loading"
      ><template slot="createTime" slot-scope="text, record">
        <span>{{ record.createTime | formatDate }}</span></template
      ><template slot="orderIndex" slot-scope="text, record, index">
        <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span></template
      ><template slot="action" slot-scope="text, record">
        <span @click="hanldeLook(record)" style="color: #1890ff; cursor: pointer">查看</span>
      </template></a-table
    >
    <a-modal title="查看二维码" :visible="visible" @cancel="handleCancel" :footer="false">
      <div class="modal-content">
        <img :src="imageUrl" alt="二维码" />
      </div>
    </a-modal>
  </div>
</template>
<script>
import Vue from 'vue'
import { formatMinute } from '@/utils/formatDate'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { getInviteList } from '@/api/center/userInfo'
export default {
  data() {
    return {
      // 二维码地址
      imageUrl: '',
      visible: false,
      searchParams: {},
      form: this.$form.createForm(this),
      columns: [
        {
          title: '序号',
          dataIndex: 'orderIndex',
          key: 'orderIndex',
          width: '6%',
          align: 'left',
          scopedSlots: { customRender: 'orderIndex' },
        },
        {
          title: '被邀请单位名称',
          dataIndex: 'beInvitedUnitName',
          key: 'beInvitedUnitName',
          align: 'left',
          width: '40%',
        },
        {
          title: '邀请时间',
          dataIndex: 'createTime',
          align: 'left',
          key: 'createTime',
          width: '25%',
          scopedSlots: { customRender: 'createTime' },
        },
        {
          title: '邀请结果',
          dataIndex: 'inviteResult',
          align: 'left',
          key: 'inviteResult  ',
          width: '15%',
        },
        {
          title: '邀请二维码',
          dataIndex: '',
          align: 'left',
          key: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      listData: [],
      // 加载状态
      loading: false,
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
    }
  },
  filters: {
    formatDate(e) {
      return formatMinute(e)
    },
  },
  computed: {
    token() {
      return Vue.ls.get(ACCESS_TOKEN)
    },
  },
  created() {
    this.getDataList()
  },
  methods: {
    handleCancel() {
      this.visible = false
    },
    //pageSize 变化的回调
    pageChange(page, pageSize) {
      this.pagination.current = page || 1
      this.pagination.pageSize = pageSize
      this.getDataList()
    },
    async getDataList() {
      this.loading = true
      let params = Object.assign(
        {},
        { pageNo: this.pagination.current, pageSize: this.pagination.pageSize },
        this.searchParams
      )
      const { success, result, message } = await getInviteList(params)
      if (!success) {
        this.$message.warning(message)
        return
      }
      this.listData = result.records
      // 总页数
      this.pagination.total = result.total
      this.loading = false
    },
    // 查看
    hanldeLook(e) {
      const qrcodeUrl = e.qrCodeAddress
      this.imageUrl = `https://shfar.cwit.com.cn/api/${qrcodeUrl}?token=${this.token}`
      console.log('121313', this.qrcodeUrl)
      this.visible = true
    },
    handleReset() {
      this.form.resetFields()
    },
    handleSearch() {
      this.form.validateFields((error, values) => {
        if (!error) {
          this.searchParams = values
          this.getDataList()
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
.invitation-history {
  /deep/ .ant-form-item {
    display: flex;
    .ant-form-item-control-wrapper {
      flex: 1;
    }
  }
}
.table {
  margin-top: 20px;
}
.modal-content {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>