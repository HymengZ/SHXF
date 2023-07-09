<template>
  <div class="already-claim">
    <div class="form">
      <form-search @search="search" />
    </div>
    <div class="table">
      <div class="btn">
        <a-button @click="handleBatchStop" :disabled="selectedRowKeys.length < 2">批量停号</a-button
        ><a-button style="margin-left: 8px" @click="handleBatchRecovery" :disabled="selectedRowKeys.length < 2"
          >批量恢复</a-button
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
        ><template slot="state" slot-scope="text, record">
          <span v-if="record.applyStatus == 1">审核通过</span>
          <span v-else>已停号</span>
        </template>
        <template slot="orderIndex" slot-scope="text, record, index">
          <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span></template
        ><template slot="action" slot-scope="text, record">
          <span v-if="record.ifStop == 0" @click="openUnitModal(record)" style="color: #1890ff; cursor: pointer"
            >单位变更</span
          >
          <a-divider v-if="record.ifStop == 0" type="vertical" />
          <span
            @click="openOperateModal(record)"
            style="color: #1890ff; cursor: pointer"
            v-text="record.ifStop == 0 ? '停号' : '恢复'"
          ></span> </template
      ></a-table>
    </div>
    <!-- 停号 -->
    <a-modal title="停号" :visible="visible" @cancel="handleCancel" @ok="handleStop">
      <div class="tips">
        <a-alert banner>
          <div slot="message" class="message">停号后，对方账号将无法登录平台。</div>
        </a-alert>
      </div>
      <div class="formModal">
        <a-form-model ref="form" :model="model" :rules="validatorRules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item prop="reason" label="停号原因">
            <a-radio-group v-model="model.reason">
              <a-radio :value="item.itemValue" v-for="item in reasonList" :key="item.id"> {{ item.itemText }} </a-radio>
            </a-radio-group>
            <a-input v-model="otherReason" block placeholder="请输入"></a-input>
          </a-form-model-item>
        </a-form-model>
      </div>
    </a-modal>
    <!-- 单位变更 -->
    <a-modal title="单位变更" :visible="unitVisible" @cancel="handleUnitCancel" @ok="handleChangeUnit">
      <div class="tips">
        <a-alert banner>
          <div slot="message" class="message">
            转队后，消防员个人账号自动进入交接单位的待认领用户列表中，交接单位认领后，对方账号的管理和建言献策的管理自动转入交接单位，想要删除该用户，请联系系统管理员。
          </div>
        </a-alert>
      </div>
      <div class="formModal">
        <a-form-model
          ref="unitForm"
          :model="unitModel"
          :rules="unitValidatorRules"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 17 }"
        >
          <a-form-model-item prop="unitId" label="交接单位">
            <a-cascader
              :show-search="{ filter }"
              :field-names="{ label: 'name', value: 'id', children: 'children' }"
              expand-trigger="hover"
              :options="unitList"
              placeholder="请选择"
              v-model="unitModel.unitId"
            />
          </a-form-model-item>
        </a-form-model>
      </div>
    </a-modal>
  </div>
</template>
<script>
import FormSearch from './formSearch'
import { getRanksList, operaAccount, getUnitTree, switchRanks } from '@/api/center/userInfo'
import { listByDictCode } from '@/api/listByDictCode.js'
export default {
  components: { FormSearch },
  data() {
    return {
      searchParams: {},
      columns: [
        {
          title: '序列',
          dataIndex: 'orderIndex',
          key: 'orderIndex',
          width: '8%',
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
          width: '15%',
        },
        {
          title: '证件类型',
          dataIndex: 'certType_dictText',
          align: 'left',
          key: 'certType_dictText',
          width: '15%',
        },
        {
          title: '建言献策数量',
          dataIndex: 'count',
          align: 'left',
          key: 'count',
          width: '15%',
        },
        {
          title: '状态',
          dataIndex: 'state',
          align: 'left',
          key: 'state',
          width: '10%',
          scopedSlots: { customRender: 'state' },
        },
        {
          title: '操作',
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
      selectedRowKeys: [],
      selectedData: [],
      // 停号弹窗
      visible: false,
      // 单位变更弹窗
      unitVisible: false,
      // 单位列表
      unitList: [],
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
      model: {
        reason: '',
      },
      otherReason: '',
      validatorRules: {
        reason: [{ required: true, message: '请选择停号理由' }],
      },
      reasonList: [],
      recoverUserList: [],
      unitModel: {
        unitId: [],
      },
      unitValidatorRules: {
        unitId: [{ required: true, message: '请选择交接单位' }],
      },
    }
  },
  created() {
    this.getSelectList()
  },
  methods: {
    // 所属单位搜索
    filter(inputValue, path) {
      return path.some((option) => option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
    },
    async getSelectList() {
      const { result, success, message } = await listByDictCode('relieve_reason')
      if (!success) {
        this.$message.warning(message)
        return
      }
      this.reasonList = result
      const res = await getUnitTree()
      if (!res.success) {
        this.$message.warning(res.message)
        return
      }
      this.unitList = res.result
    },
    // 查询
    search(val) {
      this.searchParams = val
      this.getDataList()
    },
    //pageSize 变化的回调
    pageChange(page, pageSize) {
      this.pagination.current = page || 1
      this.pagination.pageSize = pageSize
      this.dataList()
    },
    // 选中
    onSelectChange(selectedRowKeys, e) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedData = e
      let userList = []
      for (const item of e) {
        let userObj = item.realname + '-' + item.phone
        userList.push(userObj)
      }
      this.recoverUserList = userList
    },
    async getDataList() {
      this.loading = true
      let params = Object.assign(
        {},
        { applyStatus: 1, pageNo: this.pagination.current, pageSize: this.pagination.pageSize },
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
    // 停号/恢复操作
    async openOperateModal(e) {
      let userId = [e.id]
      this.selectedRowKeys = userId
      if (e.ifStop === 1) {
        let userList = [e.realname + '-' + e.phone]
        this.recoverUserList = userList
        this.handleRecovery()
        return
      }
      this.model.reason = ''
      this.otherReason = ''
      this.visible = true
    },
    handleCancel() {
      this.visible = false
    },
    // 批量停号
    handleBatchStop() {
      let filterData = this.selectedData.filter((item) => item.ifStop != 0)
      if (filterData.length > 0) {
        this.$message.warning('请勾选都是未停号的人员')
        return
      }
      this.model.reason = ''
      this.otherReason = ''
      this.visible = true
    },
    // 批量恢复
    handleBatchRecovery() {
      let filterData = this.selectedData.filter((item) => item.ifStop != 1)
      if (filterData.length > 0) {
        this.$message.warning('请勾选的都是已停号的人员')
        return
      }
      this.handleRecovery()
    },
    // 停号
    handleStop() {
      let that = this
      that.$refs['form'].validate(async (success) => {
        if (success) {
          let stopReason = ''
          if (that.model.reason == 'ohter') {
            stopReason = that.otherReason
          }
          let params = {
            ids: that.selectedRowKeys.toString(),
            reason: stopReason,
            ifStop: 1,
            stopType: that.model.reason,
          }
          this.opera(params)
        }
      })
    },
    // 恢复
    handleRecovery() {
      let that = this
      let text = `确定恢复用户【${that.recoverUserList.toString()}】的账号访问平台权利？`
      that.$confirm({
        title: '恢复',
        icon: 'exclamation-circle',
        content: (h) => {
          return h('div', { domProps: { innerHTML: text } })
        },
        okText: '确认',
        cancelText: '取消',
        onOk() {
          let params = {
            ids: that.selectedRowKeys.toString(),
            ifStop: 0,
          }
          that.opera(params)
        },
      })
    },

    // 请求操作接口
    async opera(params) {
      const { success, message } = await operaAccount(params)
      if (!success) {
        this.$message.warning(message)
        return
      }
      this.getDataList()
      this.visible = false
      // 清空选中的数据
      this.selectedRowKeys = []
      this.selectedData = []
      this.$message.success(message || '操作成功')
    },
    handleUnitCancel() {
      this.unitVisible = false
    },
    // 打开修改单位弹窗
    openUnitModal(e) {
      this.selectedRowKeys = [e.id]
      // 先清空值
      this.unitModel.unitId = []
      this.unitVisible = true
    },
    // 单位变更
    handleChangeUnit() {
      let that = this
      that.$refs['unitForm'].validate(async (success) => {
        if (success) {
          let params = Object.assign({}, { id: that.selectedRowKeys.toString(), unitId: that.unitModel.unitId[2] })
          const { success, message } = await switchRanks(params)
          if (!success) {
            that.$message.warning(message)
            return
          }
          that.unitVisible = false
          that.getDataList()
          that.$message.success(message)
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
.already-claim {
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
.formModal {
  margin-top: 10px;
  /deep/ .ant-radio-group {
    margin-top: 10px;
    .ant-radio-wrapper {
      margin-bottom: 8px;
    }
  }
}
</style>
