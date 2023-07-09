<template>
  <div>
    <a-alert banner>
      <div slot="message" class="message">
        1、此项非必填，可为空；<br />
        2、点击新增后在当期那表格中新增一条"序号+1"的输入行，无排序功能，如需详细说明建议附表说明
      </div>
    </a-alert>
    <a-card title="项目参与单位">
      <a-button type="primary" icon="plus" @click="addUnit"> 新增参与单位 </a-button>
      <a-form-model ref="tableformRef" :model="form">
        <a-table rowKey="id" :columns="unitColumns" :data-source="form.projectUnits" :pagination="false" bordered>
          <template slot="unitName" slot-scope="text, record, index">
            <a-form-model-item :prop="'projectUnits.' + index + '.unitName'" :rules="rules.unitName">
              <a-input placeholder="请输入" v-model="record.unitName"></a-input>
            </a-form-model-item>
          </template>
          <template slot="unitType" slot-scope="text, record, index">
            <a-form-model-item :prop="'projectUnits.' + index + '.unitType'" :rules="rules.unitType">
              <a-select v-model="record.unitType" style="width: 100%" allowClear placeholder="请选择">
                <a-select-option v-for="(item, index) in unitList" :key="index" :value="item.itemValue">
                  {{ item.itemText }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </template>
          <template slot="unitCreditCode" slot-scope="text, record, index">
            <a-form-model-item :prop="'projectUnits.' + index + '.unitCreditCode'" :rules="rules.unitCreditCode">
              <a-input v-model="record.unitCreditCode" placeholder="请输入"></a-input>
            </a-form-model-item>
          </template>
          <template slot="action" slot-scope="text, record">
            <span @click="onDelete(record)" style="color: #1890ff; cursor: pointer">删除</span>
          </template>
        </a-table>
      </a-form-model>
    </a-card>
  </div>
</template>
<script>
import { getAction, postAction, deleteAction } from '@/api/manage.js'
export default {
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      // 表数据
      form: {
        projectUnits: [],
      },
      // 表数据长度，用来判断数据库是否已有数据
      unitsListLength: '',
      // 表头
      unitColumns: [
        {
          title: '序号',
          dataIndex: 'orderIndex',
          key: 'orderIndex',
          width: '6%',
          align: 'center',
        },
        {
          title: '单位名称',
          dataIndex: 'unitName',
          key: 'unitName',
          scopedSlots: { customRender: 'unitName' },
          align: 'center',
          width: '43%',
        },
        {
          title: '单位类型',
          dataIndex: 'unitType',
          align: 'center',
          key: 'unitType',
          scopedSlots: { customRender: 'unitType' },
          width: '22%',
        },
        {
          title: '统一社会信用代码',
          dataIndex: 'unitCreditCode',
          align: 'center',
          key: 'unitCreditCode',
          scopedSlots: { customRender: 'unitCreditCode' },
          width: '22%',
        },
        {
          title: '操作',
          dataIndex: '',
          align: 'center',
          key: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 单位类型
      unitList: [],
      url: {
        // 数据字典接口
        listByDictCode: '/sys/dictItem/listByDictCode',
        // 添加接口
        add: '/fire/project/fireProjectUnit/addBatch',
        // 查询接口
        list: '/fire/project/fireProjectUnit/queryByContentId',
        // 删除接口
        delete: '/fire/project/fireProjectUnit/delete',
      },
      // 表单校验
      rules: {
        unitName: { required: true, message: '单位名称不能为空' },
        unitType: { required: true, message: '单位类型不能为空' },
        unitCreditCode: [{ required: true, message: '统一社会信用代码不能为空' }],
      },
    }
  },
  created() {
    // 获取单位类型
    this.getUnitType()
    // 查询
    this.searchData()
  },
  methods: {
    // 单位类型
    getUnitType() {
      const commnUrl = this.url.listByDictCode
      getAction(commnUrl, { dictCode: 'unit_type' }).then((res) => {
        const { result, success } = res
        if (success) {
          this.unitList = result
        } else {
          this.$message.warning(res.message || '单位类型查询失败')
        }
      })
    },
    // 新增参与单位
    addUnit() {
      let obj = {
        key: Date.now(),
        orderIndex: this.form.projectUnits.length + 1,
        unitName: '',
        unitType: undefined,
        unitCreditCode: '',
        contentId: this.id,
      }
      this.form.projectUnits.push(obj)
    },

    // 删除参与单位&同时使序号不会乱
    onDelete(record) {
      if (record.id) {
        let that = this
        that.$confirm({
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
          onOk() {
            let params = { id: record.id }
            deleteAction(that.url.delete, params).then((res) => {
              if (res.success) {
                let id = record.id
                let projectUnits = [...that.form.projectUnits]
                that.form.projectUnits = projectUnits.filter((item) => item.id !== id)
                if (that.form.projectUnits.length > 0) {
                  let num = 1
                  for (let i of that.form.projectUnits) {
                    i.orderIndex = num
                    num++
                  }
                  let existsProjectUnits = that.form.projectUnits.filter((item) => item.id)
                  that.unitAdd(existsProjectUnits)
                }
                that.$message.success(res.message || '删除成功')
              } else {
                that.$message.warning(res.message || '删除失败')
              }
            })
          },
        })
      } else {
        let key = record.key
        let projectUnits = [...this.form.projectUnits]
        this.form.projectUnits = projectUnits.filter((item) => item.key !== key)
        if (this.form.projectUnits.length > 0) {
          let num = 1
          for (let i of this.form.projectUnits) {
            i.orderIndex = num
            num++
          }
        }
      }
    },
    // 查询表格数据
    searchData() {
      let params = Object.assign({}, { contentId: this.id })
      getAction(this.url.list, params).then((res) => {
        if (res.success) {
          this.form.projectUnits = res.result
          this.unitsListLength = res.result.length
        } else {
          this.$message.warning(res.message || '请求列表数据失败')
        }
      })
    },
    // 提交表格数据
    handleSubmit() {
      this.$refs.tableformRef.validate(async (valid) => {
        if (valid) {
          if (this.form.projectUnits.length > 0) {
            let addData = this.form.projectUnits
            await this.unitAdd(addData)
            this.$message.success('配置成功')
            this.$emit('addCurrent')
          } else {
            this.$message.success('配置成功')
            this.$emit('addCurrent')
          }
        }
      })
    },
    // 添加数据
    unitAdd(data) {
      postAction(this.url.add, data).then((res) => {
        if (!res.success) {
          this.$message.warning(res.message)
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
// 提示
.ant-alert {
  margin-bottom: 16px;
  background: #fffbe6;
  border: 1px solid #ffe58f;
  border-radius: 2px;
  // 提示字体
  .message {
    font-size: 14px;
    font-weight: 400;
    text-align: left;
    color: rgba(0, 0, 0, 0.65);
    line-height: 20px;
  }
}
/deep/ .ant-form-item {
  margin-bottom: 0;
  .ant-form-explain {
    position: absolute;
    font-size: 13px;
  }
}
// 表格
.ant-table-wrapper {
  margin-top: 16px;
  // 表头字体
  /deep/ .ant-table-column-title {
    font-size: 14px;
    font-weight: 500;
    color: rgba(0, 0, 0, 1);
    line-height: 22px;
  }
}
</style>
