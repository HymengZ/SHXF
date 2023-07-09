<template>
  <div>
    <div class="tips">
      <a-alert banner>
        <div slot="message" class="message">
          1、项目所属只能在部级项目、区级项目、市级项目；
          <br />
          2、项目的阶段检查信息在管理员点击后续资料继续提交后使用，后续资料待提交中，读取最近的截止时间；
          <br />
          3、成果录入时绑定项目会在项目管理的详情页中项目关联信息模块出现关联的成果，无法在项目管理中编辑；
        </div>
      </a-alert>
    </div>
    <a-form class="form" :form="form" :colon="false">
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
                format="YYYY年MM月"
                v-decorator="['cycleStartTime', validatorRules.cycleStartTime]"
                :disabled-date="disabledStartDate"
                style="width: 100%"
                placeholder="选择年月"
                @change="cycleStartTime"
              >
                <a-icon slot="suffixIcon" type="clock-circle" />
              </a-month-picker>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="项目结束时间">
              <a-month-picker
                format="YYYY年MM月"
                v-decorator="['cycleEndTime', validatorRules.cycleEndTime]"
                :disabled-date="disabledEndDate"
                style="width: 100%"
                placeholder="选择年月"
                @change="cycleEndTime"
              >
                <a-icon slot="suffixIcon" type="clock-circle" />
              </a-month-picker>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="绩效评价截止时间（历史项目可填实际完成时间）">
              <a-month-picker
                format="YYYY年MM月"
                v-decorator="['performanceEndTime', validatorRules.performanceEndTime]"
                style="width: 100%"
                placeholder="选择年月"
                @change="performanceEndTime"
              >
                <a-icon slot="suffixIcon" type="clock-circle" />
              </a-month-picker>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="是否有阶段检查">
              <a-radio-group v-decorator="['phaseCheck', validatorRules.phaseCheck]" @change="isStageExit">
                <a-radio :value="1">有</a-radio>
                <a-radio :value="2">无</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card title="阶段检查信息" v-if="stageVisible">
        <a-button
          type="primary"
          icon="plus"
          @click="addStage"
          v-if="stageForm.stageList.length < differDays || stageForm.stageList.length == differDays"
        >
          新增阶段检查
        </a-button>
        <a-form-model ref="tableformRef" :model="stageForm">
          <a-table rowKey="id" :columns="stageColumns" :data-source="stageForm.stageList" :pagination="false" bordered>
            <template slot="configName" slot-scope="text"> {{ text }} </template>
            <template slot="uploadEndTime" slot-scope="text, record, index">
              <a-form-model-item :prop="'stageList.' + index + '.uploadEndTime'" :rules="rules.uploadEndTime">
                <a-date-picker v-model="record.uploadEndTime" style="width: 100%" placeholder="选择年月日">
                  <a-icon slot="suffixIcon" type="clock-circle" />
                </a-date-picker>
              </a-form-model-item>
            </template>
            <template slot="action" slot-scope="text, record">
              <span @click="onDelete(record)" style="color: #1890ff; cursor: pointer">删除</span>
            </template>
          </a-table>
        </a-form-model>
      </a-card>
      <a-card title="项目关联信息">
        <a-row type="flex" justify="space-between" align="top">
          <a-col :span="11">
            <a-form-item label="关联的科技指南">
              <a-select allowClear placeholder="请选择" v-decorator="['guideId']">
                <!-- <a-select-option v-for="(item, index) in projectCategoryList" :key="index" :value="item.itemValue">
                  {{ item.itemText }}
                </a-select-option> -->
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="关联的科技需求">
              <a-select allowClear placeholder="请选择" v-decorator="['demandId']">
                <!-- <a-select-option v-for="(item, index) in projectCategoryList" :key="index" :value="item.itemValue">
                  {{ item.itemText }}
                </a-select-option> -->
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="关联的话题(可多选)">
              <a-select mode="multiple" allowClear placeholder="请选择" v-decorator="['followTopic']">
                <!-- <a-select-option v-for="(item, index) in projectCategoryList" :key="index" :value="item.itemValue">
                  {{ item.itemText }}
                </a-select-option> -->
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="关联的固定关键词(可多选)">
              <a-select mode="multiple" allowClear placeholder="请选择" v-decorator="['fixedKeyword']">
                <!-- <a-select-option v-for="(item, index) in projectCategoryList" :key="index" :value="item.itemValue">
                  {{ item.itemText }}
                </a-select-option> -->
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="自设关键词（可输入多个字段，“；”分割） ">
              <a-input allowClear v-decorator="['customKeyword']" placeholder="请输入"> </a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
    </a-form>
  </div>
</template>
<script>
import { getAction, postAction, deleteAction } from '@/api/manage.js'
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
      // 项目开始时间
      projectStartTime: '',
      // 项目结束时间
      projectEndTime: '',
      // 所属年度
      yearArray: getSelectYear(),
      // 阶段检查展示
      stageVisible: false,
      // 阶段检查表数据
      stageForm: {
        stageList: [],
      },
      // 表单校验
      rules: {
        uploadEndTime: { required: true, message: '请填写截止时间' },
      },
      // 阶段检查信息表头
      stageColumns: [
        {
          title: '序号',
          dataIndex: 'orderIndex',
          key: 'orderIndex',
          width: '6%',
          align: 'center',
        },
        {
          title: '名称',
          dataIndex: 'configName',
          key: 'configName',
          scopedSlots: { customRender: 'configName' },
          align: 'center',
          width: '43%',
        },
        {
          title: '截止时间',
          dataIndex: 'uploadEndTime',
          align: 'center',
          key: 'uploadEndTime',
          scopedSlots: { customRender: 'uploadEndTime' },
          width: '43%',
        },
        {
          title: '操作',
          dataIndex: '',
          align: 'center',
          key: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
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
        performanceEndTime: { rules: [{ required: true, message: '绩效评价截止时间不能为空' }] },
        phaseCheck: {
          // initialValue: 1,
          rules: [{ required: true, message: '请选择是否有阶段检查' }],
        },
      },
      // 请求url
      url: {
        projectNumber: '/fire/projectReport/getNextNumber',
        // 新增数据
        add: '/fire/projectReport/add',
        // 新增阶段检查
        configureBatch: '/fire/projectReportConfig/configureBatch',
        // 查询阶段检查
        queryByContentId: '/fire/projectReportConfig/queryByContentId',
        // 阶段检查删除
        delete: '/fire/projectReportConfig/delete',
      },
    }
  },
  computed: {
    // 相差的天数
    differDays() {
      if (this.projectEndTime && this.projectStartTime) {
        return this.projectEndTime - this.projectStartTime
      } else {
        return null
      }
    },
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
    // 获取项目编号
    getProjectNumber() {
      getAction(this.url.projectNumber).then((res) => {
        if (res.success) {
          this.$nextTick(() => {
            this.form.setFieldsValue({ projectNumber: res.message })
          })
        } else {
          this.$message.warning(res.message || '获取项目编号失败')
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

    // 点击上一步时展示填写过的内容
    showData() {
      this.form.resetFields()
      this.stageForm.stageList = []
      let model = Object.assign({}, this.basicData)
      // 转换关键词为数组
      if (model.followTopic) {
        model.followTopic = model.followTopic.replace(/;/g, ',').split(',')
      } else {
        model.followTopic = []
      }
      if (model.fixedKeyword) {
        model.fixedKeyword = model.fixedKeyword.replace(/;/g, ',').split(',')
      } else {
        model.fixedKeyword = []
      }

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
            'performanceEndTime',
            'phaseCheck',
            'guideId',
            'demandId',
            'followTopic',
            'fixedKeyword',
            'customKeyword'
          )
        )
        // 是否有阶段检查
        if (model.phaseCheck == 1) {
          this.stageVisible = true
          // 查询
          let params = Object.assign({}, { configType: '1', contentId: model.id })
          getAction(this.url.queryByContentId, params).then((val) => {
            this.stageForm.stageList = val.result
          })
        } else {
          this.stageVisible = false
        }
        // 读取已填写好的项目开始结束时间
        this.projectStartTime = new Date(model.cycleStartTime).getFullYear()
        this.projectEndTime = new Date(model.cycleEndTime).getFullYear()
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
    cycleStartTime(e) {
      this.$nextTick(() => {
        if (e === null) {
          this.stageForm.stageList = []
          this.projectStartTime = null
          this.form.setFieldsValue({ cycleStartTime: null })
        } else {
          this.projectStartTime = e._d.getFullYear()
          let date = moment(e).format('YYYY-MM-01 00:00:00')
          this.form.setFieldsValue({ cycleStartTime: date })
        }
      })
    },
    // 项目结束时间
    cycleEndTime(e) {
      this.$nextTick(() => {
        if (e === null) {
          this.stageForm.stageList = []
          this.projectEndTime = null
          this.form.setFieldsValue({ cycleEndTime: null })
        } else {
          this.projectEndTime = e._d.getFullYear()
          let date = moment(e).format('YYYY-MM-01 00:00:00')
          this.form.setFieldsValue({ cycleEndTime: date })
        }
      })
    },
    // 绩效评价截止时间
    performanceEndTime(e) {
      this.$nextTick(() => {
        if (e === null) {
          this.form.setFieldsValue({ performanceEndTime: null })
        } else {
          let date = moment(e).format('YYYY-MM-01 00:00:00')
          this.form.setFieldsValue({ performanceEndTime: date })
        }
      })
    },
    // 是否有阶段检查表单校验
    validatePhaseCheck(rule, value, callback) {
      if (value == 1) {
        if (this.stageForm.stageList.length == 0) {
          callback('请填写阶段检查信息，如无需填写，请选择无')
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    // 切换阶段检查的显隐
    isStageExit(e) {
      if (e.target.value == '2') {
        this.stageVisible = false
      } else {
        // 如果阶段检查有，
        this.stageVisible = true
      }
    },
    // 新增阶段检查
    addStage() {
      let obj = {
        key: Date.now(),
        orderIndex: this.stageForm.stageList.length + 1,
        configName: '阶段检查' + (this.stageForm.stageList.length + 1),
        uploadEndTime: null,
        configType: '1',
      }
      this.stageForm.stageList.push(obj)
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
                // 删除成功后再重新排序，并更新已存在数据库的数据的排序号
                let id = record.id
                let stageList = [...that.stageForm.stageList]
                that.stageForm.stageList = stageList.filter((item) => item.id !== id)
                if (that.stageForm.stageList.length > 0) {
                  let num = 1
                  for (let i of that.stageForm.stageList) {
                    i.orderIndex = num
                    i.configName = '阶段检查' + num
                    num++
                  }
                  let existsStageList = that.stageForm.stageList.filter((item) => item.id)
                  that.stageCheckAdd(existsStageList)
                }
                that.$message.success(res.message || '删除成功')
              } else {
                that.$message.warning(res.message || '删除失败')
              }
            })
          },
        })
      } else {
        // 删除还未保存到数据库中的数据
        let key = record.key
        let stageList = [...this.stageForm.stageList]
        this.stageForm.stageList = stageList.filter((item) => item.key !== key)
        if (this.stageForm.stageList.length > 0) {
          let num = 1
          for (let i of this.stageForm.stageList) {
            i.orderIndex = num
            i.configName = '阶段检查' + num
            num++
          }
        }
      }
    },
    // 表单校验和保存数据
    handleSubmit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          // 格式化关键词
          if (values.fixedKeyword) {
            values.fixedKeyword = values.fixedKeyword.toString().replace(/,/g, ';')
          }
          if (values.followTopic) {
            values.followTopic = values.followTopic.toString().replace(/,/g, ';')
          }
          let formatList = []
          // 判断阶段检查是否选择
          if (values.phaseCheck == 2) {
            this.stageForm.stageList = []
            this.saveData(values, formatList)
          } else {
            // 截止时间是否填写
            this.$refs.tableformRef.validate((valid) => {
              if (valid) {
                // 阶段检查信息日期格式化
                if (this.stageForm.stageList.length > 0) {
                  formatList = this.formatDate(this.stageForm.stageList)
                }
                this.saveData(values, formatList)
              }
            })
          }
        }
      })
    },

    // 调用表单数据接口
    saveData(values, formatList) {
      if (this.basicData.id) {
        // 对已新增的修改（非编辑功能）
        let deepCloneData = JSON.parse(JSON.stringify(this.basicData))
        let params = this.dealParams(deepCloneData, values)
        postAction(this.url.add, params).then((res) => {
          if (res.success) {
            this.$message.success('修改成功')
            // 下一步&把从数据库读取到的当前数据取出来
            this.$emit('addCurrent', res.result)
            if (formatList.length > 0) {
              for (const item of formatList) {
                item.contentId = this.basicData.id
              }
              this.stageCheckAdd(formatList)
            }
          } else {
            this.$message.warning(res.message || '修改失败')
          }
        })
      } else {
        // 第一次新增,提交状态为待提交，项目管理类型为正在进行中项目
        let params = Object.assign(values, {
          processStatus: '100',
          projectManagementType: '1',
          publishUnit: this.unitId,
        })
        postAction(this.url.add, params).then((res) => {
          if (res.success) {
            // 下一步&把从数据库读取到的当前数据取出来
            this.$emit('addCurrent', res.result)
            if (formatList.length > 0) {
              for (const item of formatList) {
                item.contentId = res.result.id
              }
              this.stageCheckAdd(formatList)
            }
            this.$message.success(res.message || '新增成功')
          } else {
            this.$message.warning(res.message || '新增失败')
          }
        })
      }
    },

    // 阶段检查新增
    stageCheckAdd(params) {
      postAction(this.url.configureBatch, params).then((result) => {
        if (!result.success) {
          this.$message.warning(result.message)
        }
      })
    },
    // 批量格式化日期
    formatDate(array) {
      for (let item of array) {
        item.uploadEndTime = moment(item.uploadEndTime).format('YYYY-MM-DD 00:00:00')
      }
      return array
    },
    // 处理数据
    dealParams(data, val) {
      // 编辑只有已退回，审核不通过状态才能再次变成待提交
      if (['136', '140'].indexOf(data.processStatus) != -1) {
        data.processStatus = '100'
      }
      // 有阶段检查，但数据为空的时候
      if (this.stageForm.stageList.length > 0) {
        data.phaseCheck = val.phaseCheck
      } else {
        data.phaseCheck = 2
      }
      data.projectName = val.projectName
      data.projectNumber = val.projectNumber
      data.ownershipYear = val.ownershipYear
      data.projectOwnership = val.projectOwnership
      data.projectCategory = val.projectCategory
      data.specialFund = val.specialFund
      data.otherFund = val.otherFund
      data.totalBudget = val.totalBudget
      data.cycleStartTime = val.cycleStartTime
      data.cycleEndTime = val.cycleEndTime
      data.performanceEndTime = val.performanceEndTime
      data.guideId = val.guideId
      data.demandId = val.demandId
      data.followTopic = val.followTopic
      data.fixedKeyword = val.fixedKeyword
      data.customKeyword = val.customKeyword
      return data
    },
  },
}
</script>
<style lang="less" scoped>
// 提示
.tips {
  margin: 16px 0;
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
/deep/ .ant-form-item {
  margin-bottom: 0;
  .ant-form-explain {
    position: absolute;
    font-size: 13px;
  }
}
// 卡片间距
.ant-card {
  margin-top: 16px;
}
// 阶段检查表格
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
// 分割线
.ant-divider {
  border-color: #d9d9d9;
}
</style>
