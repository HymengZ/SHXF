<template>
  <div class="wait-claim">
    <div class="form">
      <form-search @search="search" />
    </div>
    <div class="table">
      <div class="btn">
        <a-button type="primary" @click="handleBatchAudit" :disabled="selectedRowKeys.length < 2"
          >批量归属审核</a-button
        >
      </div>
      <a-table
        rowKey="id"
        class="table"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :columns="columns"
        :data-source="listData"
        :pagination="pagination"
        :loading="loading"
      >
        <template slot="orderIndex" slot-scope="text, record, index">
          <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span></template
        >
        <template slot="action" slot-scope="text, record">
          <span @click="hanldeAudit(record)" style="color: #1890ff; cursor: pointer">归属审核</span>
        </template></a-table
      >
    </div>
    <a-modal title="归属审核" :visible="visible" @cancel="handleCancel" @ok="handleOk">
      <div class="tips">
        <a-alert banner>
          <div slot="message" class="message">
            审核通过的用户自动归位本单位的下属消防官兵，对方账号即可在”科技孵化-科技需求”的建言献策中发言，请注意查看管理！
          </div>
        </a-alert>
      </div>
      <div class="formModal">
        <a-form-model ref="form" :model="model" :rules="validatorRules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item required label="申请用户">
            <div v-for="item in applyUserList" :key="item.value">
              {{ item.label }}
            </div>
          </a-form-model-item>
          <a-form-model-item prop="operaCode" label="审核结果">
            <a-radio-group v-model="model.operaCode">
              <a-radio :value="1"> 通过 </a-radio>
              <a-radio :value="2"> 驳回 </a-radio>
            </a-radio-group>
          </a-form-model-item>
        </a-form-model>
      </div>
    </a-modal>
  </div>
</template>
<script>
import FormSearch from './formSearch'
import { getRanksList, auditAccount } from '@/api/center/userInfo'
import { formatMinute } from '@/utils/formatDate'
export default {
  components: { FormSearch },
  data() {
    return {
      visible: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      model: {
        operaCode: 1,
      },
      // 归属审核id
      ids: [],
      validatorRules: {
        operaCode: [{ required: true, message: '请选择审核结果' }],
      },
      // 申请用户数组
      applyUserList: [],
      searchParams: {},
      columns: [
        {
          title: '序列',
          dataIndex: 'orderIndex',
          key: 'orderIndex',
          width: '6%',
          align: 'left',
          scopedSlots: { customRender: 'orderIndex' },
        },
        {
          title: '真实姓名',
          dataIndex: 'realname',
          key: 'realname',
          align: 'left',
          width: '15%',
        },
        {
          title: '手机号码',
          dataIndex: 'phone',
          align: 'left',
          key: 'phone',
          width: '13%',
        },
        {
          title: '证件类型',
          dataIndex: 'certType_dictText',
          align: 'left',
          key: 'certType_dictText',
          width: '13%',
        },
        {
          title: '证件号码',
          dataIndex: 'certCode',
          align: 'left',
          key: 'certCode',
          width: '18%',
        },
        {
          title: '申请时间',
          dataIndex: 'applyTime',
          align: 'left',
          key: 'applyTime',
          width: '18%',
          customRender: (text, record, index) => formatMinute(record.applyTime),
        },
        {
          title: '操作',
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
      selectedRowKeys: [],
    }
  },

  methods: {
    // 查询
    search(val) {
      this.searchParams = val
      this.getDataList()
    },
    //pageSize 变化的回调
    pageChange(page, pageSize) {
      this.pagination.current = page || 1
      this.pagination.pageSize = pageSize
      this.getDataList()
    },
    // 选中
    onSelectChange(selectedRowKeys, e) {
      this.selectedRowKeys = selectedRowKeys
      let userList = []
      for (const item of e) {
        let userObj = {
          label: item.realname + '-' + item.phone,
          value: item.id,
        }
        userList.push(userObj)
      }
      this.applyUserList = userList
    },
    async getDataList() {
      this.loading = true
      let params = Object.assign(
        {},
        { applyStatus: 0, pageNo: this.pagination.current, pageSize: this.pagination.pageSize },
        this.searchParams
      )
      const { success, result, message } = await getRanksList(params)
      if (!success) {
        this.$message.warning(message)
        return
      }
      this.listData = result.records
      // 总页数
      this.pagination.total = result.total
      this.loading = false
    },
    handleCancel() {
      this.visible = false
    },
    // 归属审核
    hanldeAudit(e) {
      let userList = [
        {
          label: e.realname + '-' + e.phone,
          value: e.id,
        },
      ]
      this.selectedRowKeys = [e.id]
      this.applyUserList = userList
      this.model.operaCode = ''
      this.visible = true
    },
    // 批量归属审核
    handleBatchAudit() {
      this.model.operaCode = ''
      this.visible = true
    },
    // 审核提交
    handleOk() {
      let that = this
      that.$refs['form'].validate(async (success) => {
        if (success) {
          let params = Object.assign({}, { ids: that.selectedRowKeys.toString() }, that.model)
          const { success, message } = await auditAccount(params)
          if (!success) {
            that.$message.warning(message)
          }
          that.getDataList()
          that.visible = false
          that.$message.success(message || '审核完成')
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
.wait-claim {
  .form {
    border: 1px solid #d9d9d9;
    border-top: none;
    border-radius: 2px;
    padding: 16px 20px;
  }
  .table {
    .btn {
      margin: 16px 0;
    }
  }
  .tips {
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
}
</style>
