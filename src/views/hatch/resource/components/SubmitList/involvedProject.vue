<template>
  <div class="project-container">
    <a-form :form="form" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
      <a-row :gutter="24" type="flex" align="middle" justify="space-between">
        <a-col :span="7">
          <a-form-item label="项目名称">
            <a-input v-decorator="['beInvitedUnitName']" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="7">
          <a-form-item label="项目来源">
            <a-input v-decorator="['beInvitedUnitName']" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="7">
          <a-form-item label="项目所属">
            <a-input v-decorator="['beInvitedUnitName']" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="7">
          <a-form-item label="所属年度">
            <a-input v-decorator="['beInvitedUnitName']" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="7">
          <a-form-item label="项目状态">
            <a-input v-decorator="['beInvitedUnitName']" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col style="text-align: right" :span="7">
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
      bordered
    ></a-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: this.$form.createForm(this),
      columns: [
        {
          title: '项目名称',
          dataIndex: 'orderIndex',
          key: 'orderIndex',
          width: '35%',
          align: 'left',
        },
        {
          title: '项目来源',
          dataIndex: 'beInvitedUnitName',
          key: 'beInvitedUnitName',
          align: 'left',
          width: '10%',
        },
        {
          title: '项目所属',
          dataIndex: 'createTime',
          align: 'left',
          key: 'createTime',
          width: '10%',
        },
        {
          title: '所属年度',
          dataIndex: 'inviteResult',
          align: 'left',
          key: 'inviteResult  ',
          width: '10%',
        },
        {
          title: '项目状态',
          dataIndex: '',
          align: 'left',
          key: 'action',
          width: '10%',
        },
        {
          title: '上次操作时间',
          dataIndex: '',
          align: 'left',
          key: '1121',
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
  methods: {
    //pageSize 变化的回调
    pageChange(page, pageSize) {
      this.pagination.current = page || 1
      this.pagination.pageSize = pageSize
      this.getDataList()
    },
    //    重置
    handleReset() {
      this.form.resetFields()
      this.handleSearch()
    },
    handleSearch() {
      this.form.validateFields((error, values) => {
        if (!error) {
          this.$emit('search', values)
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
.project-container {
  /deep/ .ant-form-item {
    display: flex;
    .ant-form-item-control-wrapper {
      flex: 1;
    }
  }
  .table {
    margin-top: 20px;
  }
}
</style>
