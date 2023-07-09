<template>
  <div class="hatch-container">
    <a-form :form="form" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
      <a-row :gutter="24" type="flex" align="middle" justify="space-between">
        <a-col :span="7">
          <a-form-item label="需求名称">
            <a-input v-decorator="['name']" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="7">
          <a-form-item label="需求类型">
            <a-select allowClear placeholder="请选择" v-decorator="['type']">
              <a-select-option v-for="(item, index) in resourceTypeList" :key="index" :value="item.itemValue">
                {{ item.itemText }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="7">
          <a-form-item label="匹配时间">
            <a-range-picker v-decorator="['matchTime']"
              ><a-icon slot="suffixIcon" type="clock-circle"
            /></a-range-picker>
          </a-form-item>
        </a-col>
        <a-col :span="7">
          <a-form-item label="愿意对接时间">
            <a-range-picker v-decorator="['needButtTime']"
              ><a-icon slot="suffixIcon" type="clock-circle"
            /></a-range-picker>
          </a-form-item>
        </a-col>
        <a-col :span="7">
          <a-form-item label="孵化状态">
            <a-select allowClear placeholder="请选择" v-decorator="['status']">
              <a-select-option v-for="(item, index) in hatchStatusList" :key="index" :value="item.itemValue">
                {{ item.itemText }}
              </a-select-option>
            </a-select>
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
import moment from 'moment'
import { listByDictCode } from '@/api/listByDictCode'
import { fetchQueryMatch } from '@/api/hatch/resource'
export default {
  data() {
    return {
      // 资源类型
      resourceTypeList: [],
      // 孵化类型
      hatchStatusList: [],
      form: this.$form.createForm(this),
      columns: [
        {
          title: '科技需求名称',
          dataIndex: 'name',
          key: 'name',
          width: '30%',
          align: 'left',
        },
        {
          title: '需求类别',
          dataIndex: 'type',
          key: 'type',
          align: 'left',
          width: '20%',
        },
        {
          title: '匹配时间',
          dataIndex: 'matchTime',
          align: 'left',
          key: 'matchTime',
          width: '17%',
        },
        {
          title: '愿意对接时间',
          dataIndex: 'needButtTime',
          align: 'left',
          key: 'needButtTime  ',
          width: '17%',
        },
        {
          title: '孵化状态',
          dataIndex: 'status',
          align: 'left',
          key: 'status',
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
      searchParams: {},
    }
  },
  created() {
    // 下拉框
    this.getSelectList()
    // 请求列表
    this.getDataList()
  },
  methods: {
    //pageSize 变化的回调
    pageChange(page, pageSize) {
      this.pagination.current = page || 1
      this.pagination.pageSize = pageSize
      this.getDataList()
    },
    async getSelectList() {
      // 获取资源类型
      const { success, message, result } = await listByDictCode('resource_type')
      if (!success) {
        this.$message.warning(message)
      }
      this.resourceTypeList = result
      // 获取孵化状态
      const res = await listByDictCode('hatch_status')
      if (!res.success) {
        this.$message.warning(res.message)
      }
      this.hatchStatusList = res.result
    },
    async getDataList() {
      let params = Object.assign(
        {},
        { pageNo: this.pagination.current, pageSize: this.pagination.pageSize },
        this.searchParams
      )
      const { success, result, message } = await fetchQueryMatch(params)
      if (!success) {
        this.$message.warning(message)
        return
      }
      this.listData = result.records
    },
    //    重置
    handleReset() {
      this.form.resetFields()
      this.handleSearch()
    },
    handleSearch() {
      this.form.validateFields((error, values) => {
        if (!error) {
          let matchTime = values.matchTime && moment(values.matchTime[0]).format('YYYY-MM-DD 00:00:00')
          let matchEndTime = values.matchTime && moment(values.matchTime[1]).format('YYYY-MM-DD 23:59:59')
          let needButtTime = values.needButtTime && moment(values.needButtTime[0]).format('YYYY-MM-DD 00:00:00')
          let needButtEndTime = values.needButtTime && moment(values.needButtTime[1]).format('YYYY-MM-DD 23:59:59')
          let params = {
            matchTime: matchTime,
            matchEndTime: matchEndTime,
            needButtTime: needButtTime,
            needButtEndTime: needButtEndTime,
            name: values.name,
            type: values.type,
            status: values.status,
          }
          this.searchParams = params
          this.getDataList()
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
.hatch-container {
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
