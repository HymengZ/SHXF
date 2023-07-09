<template>
  <div>
    <a-form :form="form" :colon="false">
      <a-card title="项目基本信息">
        <a-row type="flex" justify="space-between" align="top">
          <a-col :span="11">
            <a-form-item label="项目名称">
              <a-input
                allowClear
                v-decorator="['projectName', validatorRules.projectName]"
                placeholder="请输入"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="项目编号">
              <a-input
                allowClear
                v-decorator="['projectNumber', validatorRules.projectNumber]"
                placeholder="自动生成"
                disabled
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="所属年度">
              <a-select allowClear placeholder="请选择" v-decorator="['ownershipYear', validatorRules.ownershipYear]">
                <a-select-option v-for="(item, index) in yearArray" :key="index" :value="item.value">
                  {{ item.value }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="发布单位">
              <a-input
                disabled
                allowClear
                v-decorator="['publishUnitName', validatorRules.publishUnitName]"
                placeholder="自动读取"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="项目所属">
              <a-select
                allowClear
                placeholder="请选择"
                v-decorator="['projectOwnership', validatorRules.projectOwnership]"
              >
                <a-select-option v-for="(item, index) in projectOwner" :key="index" :value="item.itemValue">
                  {{ item.itemText }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="项目类型">
              <a-select
                allowClear
                placeholder="请选择"
                v-decorator="['projectCategory', validatorRules.projectCategory]"
              >
                <a-select-option v-for="(item, index) in projectCategory" :key="index" :value="item.itemValue">
                  {{ item.itemText }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!-- 分割线 -->
          <a-divider dashed />
          <a-col :span="11">
            <a-form-item label="专项资金（万元）">
              <a-input
                allowClear
                @change="amountCalculation"
                v-decorator="['specialFund', validatorRules.specialFund]"
                placeholder="00.00"
              >
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="其他来源资金（万元）">
              <a-input
                allowClear
                @change="amountCalculation"
                v-decorator="['otherFund', validatorRules.otherFund]"
                placeholder="00.00"
              >
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="总预算（万元）">
              <a-input v-decorator="['totalBudget', validatorRules.totalBudget]" placeholder="自动计算" disabled>
              </a-input>
            </a-form-item>
          </a-col>
          <!-- 分割线 -->
          <a-divider dashed />
          <a-col :span="11">
            <a-form-item label="项目开始时间">
              <a-month-picker
                v-decorator="['cycleStartTime', validatorRules.cycleStartTime]"
                :disabled-date="disabledStartDate"
                style="width: 100%"
                placeholder="选择年月"
                @change="cycleStartTime"
                format="YYYY年MM月"
              >
                <a-icon slot="suffixIcon" type="clock-circle" />
              </a-month-picker>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="项目结束时间">
              <a-month-picker
                v-decorator="['cycleEndTime', validatorRules.cycleEndTime]"
                :disabled-date="disabledEndDate"
                style="width: 100%"
                placeholder="选择年月"
                @change="cycleEndTime"
                format="YYYY年MM月"
              >
                <a-icon slot="suffixIcon" type="clock-circle" />
              </a-month-picker>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="实际完成时间">
              <a-month-picker
                v-decorator="['completionTime', validatorRules.completionTime]"
                style="width: 100%"
                placeholder="选择年月"
                @change="completionTime"
                format="YYYY年MM月"
              >
                <a-icon slot="suffixIcon" type="clock-circle" />
              </a-month-picker>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="里程碑考核节点">
              <a-month-picker
                v-decorator="['checkTime', validatorRules.checkTime]"
                style="width: 100%"
                placeholder="选择年月"
                @change="checkTime"
                format="YYYY年MM月"
              >
                <a-icon slot="suffixIcon" type="clock-circle" />
              </a-month-picker>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
    </a-form>
  </div>
</template>
<script>
import { getAction, postAction } from '@/api/manage.js'
import { getSelectYear } from '@/utils/year'
import pick from 'lodash.pick'
import moment from 'moment'
export default {
  props: {
    // 区分新增和编辑
    type: {
      type: String,
      default: '',
      required: false,
    },
    // 已新增的数据
    basicData: {
      type: Object,
      default: '',
      required: false,
    },
    // 项目所属
    projectOwner: {
      type: Array,
      default: () => [],
      require: false,
    },
    // 项目类型
    projectCategory: {
      type: Array,
      default: () => [],
      require: false,
    },
  },
  data() {
    return {
      // 所属年度
      yearArray: getSelectYear(),
      form: this.$form.createForm(this),
      validatorRules: {
        projectName: { rules: [{ required: true, message: '项目名称不能为空' }] },
        projectNumber: { rules: [{ required: true, message: '项目编号不能为空' }] },
        ownershipYear: { rules: [{ required: true, message: '所属年度不能为空' }] },
        publishUnitName: { rules: [{ required: true, message: '发布单位不能为空' }] },
        projectOwnership: { rules: [{ required: true, message: '项目所属不能为空' }] },
        projectCategory: { rules: [{ required: true, message: '项目类型不能为空' }] },
        specialFund: {
          rules: [
            { required: true, message: '专项资金不能为空' },
            { pattern: /^[0-9]+(.?[0-9]{1,100})?$/, message: '输入类型只能数字' },
          ],
        },
        otherFund: {
          rules: [
            { required: true, message: '其他来源资金不能为空' },
            { pattern: /^[0-9]+(.?[0-9]{1,100})?$/, message: '输入类型只能数字' },
          ],
        },
        totalBudget: { rules: [{ required: true, message: '总预算不能为空' }] },
        cycleStartTime: { rules: [{ required: true, message: '项目开始时间不能为空' }] },
        cycleEndTime: { rules: [{ required: true, message: '项目结束时间不能为空' }] },
        completionTime: { rules: [{ required: true, message: '实际完成时间不能为空' }] },
        checkTime: { rules: [{ required: true, message: '里程碑考核节点不能为空' }] },
      },
      // 请求url
      url: {
        projectNumber: '/fire/projectBuild/getNextNumber',
        // 数据字典接口
        listByDictCode: '/sys/dictItem/listByDictCode',
        // 新增数据
        add: '/fire/projectBuild/add',
      },
    }
  },
  computed: {
    // 当前账号用户发布单位信息
    unitId() {
      return this.$store.state.user.info.unitId
    },
    unitName() {
      return this.$store.state.user.info.belongUnitName
    },
  },
  created() {
    // 只有新增情况下才调接口读取的数据
    if (this.type === 'add' && !this.basicData.id) {
      // 项目编号
      this.getProjectNumber()
      // 设置发布单位
      this.setUnitName()
    }
  },
  mounted() {
    // 展示填写过的内容
    if (this.basicData.id) {
      this.showData()
    }
  },
  methods: {
    // start------------自动读取的内容-----

    // 获取项目编号
    getProjectNumber() {
      getAction(this.url.projectNumber).then((res) => {
        if (res.success) {
          this.$nextTick(() => {
            this.form.setFieldsValue({ projectNumber: res.message })
          })
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 发布单位
    setUnitName() {
      this.$nextTick(() => {
        // 设置发布单位
        this.form.setFieldsValue({ publishUnitName: this.unitName })
      })
    },

    // end------------自动读取的内容-----

    // 点击上一步时展示填写过的内容
    showData() {
      this.form.resetFields()
      let model = Object.assign({}, this.basicData)
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            model,
            'projectName',
            'projectNumber',
            'ownershipYear',
            'projectOwnership',
            'projectCategory',
            'publishUnitName',
            'specialFund',
            'otherFund',
            'totalBudget',
            'cycleStartTime',
            'cycleEndTime',
            'completionTime',
            'checkTime'
          )
        )
      })
    },
    // 总预算的计算
    amountCalculation() {
      this.$nextTick(() => {
        let otherFund = this.form.getFieldValue('otherFund') || null
        let specialFund = this.form.getFieldValue('specialFund') || null
        let total = Number(specialFund) + Number(otherFund)
        this.form.setFieldsValue({ totalBudget: total.toFixed(2) })
      })
    },
    // 判断项目开始时间不能大于结束时间
    disabledStartDate(startValue) {
      const endValue = this.form.getFieldValue('cycleEndTime')
      if (!startValue || !endValue) {
        return false
      }
      return startValue.valueOf() > moment(endValue).valueOf()
    },
    disabledEndDate(endValue) {
      const startValue = this.form.getFieldValue('cycleStartTime')
      if (!endValue || !startValue) {
        return false
      }
      return moment(startValue).valueOf() > endValue.valueOf()
    },
    // 对日期进行格式化
    // 项目开始时间
    cycleStartTime(e) {
      this.$nextTick(() => {
        if (e === null) {
          this.form.setFieldsValue({ cycleStartTime: null })
        } else {
          let date = moment(e).format('YYYY-MM-01 00:00:00')
          this.form.setFieldsValue({ cycleStartTime: date })
        }
      })
    },
    // 项目结束时间
    cycleEndTime(e) {
      this.$nextTick(() => {
        if (e === null) {
          this.form.setFieldsValue({ cycleEndTime: null })
        } else {
          let date = moment(e).format('YYYY-MM-01 00:00:00')
          this.form.setFieldsValue({ cycleEndTime: date })
        }
      })
    },
    // 实际完成时间
    completionTime(e) {
      this.$nextTick(() => {
        if (e === null) {
          this.form.setFieldsValue({ completionTime: null })
        } else {
          let date = moment(e).format('YYYY-MM-01 00:00:00')
          this.form.setFieldsValue({ completionTime: date })
        }
      })
    },
    // 里程碑考核节点
    checkTime(e) {
      this.$nextTick(() => {
        if (e === null) {
          this.form.setFieldsValue({ checkTime: null })
        } else {
          let date = moment(e).format('YYYY-MM-01 00:00:00')
          this.form.setFieldsValue({ checkTime: date })
        }
      })
    },

    // 表单校验和保存数据
    handleSubmit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.basicData.id) {
            // 对已新增的修改（非编辑功能）
            let deepCloneData = JSON.parse(JSON.stringify(this.basicData))
            let params = this.dealParams(deepCloneData, values)
            postAction(this.url.add, params).then((res) => {
              if (res.success) {
                this.$message.success(res.message || '修改成功')
                // 下一步&把从数据库读取到的当前数据取出来
                this.$emit('addCurrent', res.result)
              } else {
                this.$message.warning(res.message || '修改失败')
              }
            })
          } else {
            // 第一次新增,提交状态为待提交
            let params = Object.assign(values, { processStatus: '100', publishUnit: this.unitId })
            postAction(this.url.add, params).then((res) => {
              if (res.success) {
                this.$message.success(res.message || '新增成功')
                // 下一步&把从数据库读取到的当前数据取出来
                this.$emit('addCurrent', res.result)
              } else {
                this.$message.warning(res.message || '新增失败')
              }
            })
          }
        }
      })
    },
    // 处理数据
    dealParams(data, val) {
      // 编辑只有已退回，审核不通过状态才能再次变成待提交
      if (['136', '400'].indexOf(data.processStatus) != -1) {
        data.processStatus = '100'
      }
      data.projectName = val.projectName
      data.projectNumber = val.projectNumber
      data.ownershipYear = val.ownershipYear
      data.projectOwnership = val.projectOwnership
      data.projectCategory = val.projectCategory
      //单位id创建了就不会再变了 data.publishUnit = val.publishUnit
      data.specialFund = val.specialFund
      data.otherFund = val.otherFund
      data.totalBudget = val.totalBudget
      data.cycleStartTime = val.cycleStartTime
      data.cycleEndTime = val.cycleEndTime
      data.completionTime = val.completionTime
      data.checkTime = val.checkTime
      return data
    },
  },
}
</script>
<style lang="less" scoped>
// 分割线
.ant-divider {
  border-color: #d9d9d9;
}
</style>
