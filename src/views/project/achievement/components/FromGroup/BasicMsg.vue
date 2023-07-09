<template>
  <div>
    <a-form :form="form" :colon="false">
      <a-card title="成果基本信息">
        <a-row type="flex" justify="space-between" align="top">
          <a-col :span="11">
            <a-form-item label="成果名称">
              <a-input
                allowClear
                v-decorator="['achieveName', validatorRules.achieveName]"
                placeholder="请输入"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="成果编号">
              <a-input
                allowClear
                v-decorator="['achieveNumber', validatorRules.achieveNumber]"
                placeholder="自动生成"
                disabled
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="成果类型">
              <a-select allowClear placeholder="请选择" v-decorator="['achieveType', validatorRules.achieveType]">
                <a-select-option v-for="(item, index) in formType" :key="index" :value="item.itemValue">
                  {{ item.itemText }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="成果形式">
              <a-select allowClear placeholder="请选择" v-decorator="['resultForm', validatorRules.resultForm]">
                <a-select-option v-for="(item, index) in formResult" :key="index" :value="item.itemValue">
                  {{ item.itemText }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="所属年度">
              <a-select allowClear placeholder="请选择" v-decorator="['ownerYear', validatorRules.ownerYear]">
                <a-select-option v-for="(item, index) in yearArray" :key="index" :value="item.value">
                  {{ item.value }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="关联的科技项目">
              <a-cascader
                :show-search="{ filter }"
                :field-names="{ label: 'projectName', value: 'id', children: 'children' }"
                expand-trigger="hover"
                :options="relationProjectList"
                placeholder="请选择"
                v-decorator="['scienceProjectId', validatorRules.scienceProjectId]"
              />
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
        </a-row>
      </a-card>
    </a-form>
  </div>
</template>
<script>
import {
  fetchRelationProject,
  fetchAchieveNumber,
  addScienceAchieve,
  fetchProjectReportById,
} from '@/api/project/achievement'
import { getSelectYear } from '@/utils/year'

import pick from 'lodash.pick'
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
    // // 成果形式
    formResult: {
      type: Array,
      default: () => [],
      require: false,
    },
    // // 成果类型
    formType: {
      type: Array,
      default: () => [],
      require: false,
    },
  },
  data() {
    return {
      // 关联的科技项目
      relationProjectList: [],
      // 所属年度
      yearArray: getSelectYear(),
      form: this.$form.createForm(this),
      validatorRules: {
        achieveName: { rules: [{ required: true, message: '成果名称不能为空' }] },
        achieveNumber: { rules: [{ required: true, message: '成果编号不能为空' }] },
        achieveType: { rules: [{ required: true, message: '成果类型不能为空' }] },
        resultForm: { rules: [{ required: true, message: '成果形式不能为空' }] },
        ownerYear: { rules: [{ required: true, message: '所属年度不能为空' }] },
        scienceProjectId: { rules: [{ required: true, message: '关联的科技项目不能为空' }] },
        publishUnitName: { rules: [{ required: true, message: '发布单位不能为空' }] },
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
      this.getAchieveNumber()
      // 设置发布单位
      this.setUnitName()
    }
    // 下拉框
    this.getSelectList()
  },
  mounted() {
    // 展示填写过的内容
    if (this.basicData.id) {
      this.showData()
    }
  },
  methods: {
    // 发布单位
    setUnitName() {
      this.$nextTick(() => {
        // 设置发布单位
        this.form.setFieldsValue({ publishUnitName: this.unitName })
      })
    },
    // 获取成果编号
    async getAchieveNumber() {
      const { message, success } = await fetchAchieveNumber()
      if (!success) {
        this.$message.warning('获取成果编号失败')
        return
      }
      this.$nextTick(() => {
        this.form.setFieldsValue({ achieveNumber: message })
      })
    },

    async getSelectList() {
      // 获取关联的科技项目
      const relationProject = await fetchRelationProject()
      if (!relationProject.success) {
        this.$message.warning(message)
      } else {
        this.relationProjectList = relationProject.result
      }
    },

    // 点击上一步时展示填写过的内容
    showData() {
      this.form.resetFields()
      let model = Object.assign({}, this.basicData)
      this.$nextTick(async () => {
        this.form.setFieldsValue(
          pick(model, 'achieveName', 'achieveNumber', 'achieveType', 'resultForm', 'ownerYear', 'publishUnitName')
        )
        // 关联的科技项目
        const { result, message, success } = await fetchProjectReportById(model.scienceProjectId)
        if (!success) {
          this.$message.warning(message)
          return
        }
        let scienceProjectObj = [result.ownershipYear, model.scienceProjectId]
        this.form.setFieldsValue({ scienceProjectId: scienceProjectObj })
      })
    },

    // 关联的科技成果搜索
    filter(inputValue, path) {
      return path.some((option) => option.projectName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
    },
    // 表单校验和保存数据
    handleSubmit() {
      this.form.validateFields(async (err, values) => {
        if (!err) {
          if (this.basicData.id) {
            // 对已新增的修改（非编辑功能）
            let deepCloneData = JSON.parse(JSON.stringify(this.basicData))
            let params = this.dealParams(deepCloneData, values)
            const { success, result, message } = await addScienceAchieve(params)
            if (!success) {
              this.$message.warning(message || '修改失败')
              return
            }
            this.$message.success(message || '修改成功')
            // 下一步&把从数据库读取到的当前数据取出来
            this.$emit('addCurrent', result)
          } else {
            // 第一次新增,提交状态为待提交
            // 设置关联的科技项目
            values.scienceProjectId = values.scienceProjectId[1]
            let params = Object.assign(values, { processStatus: '100', unitId: this.unitId })
            const { success, result, message } = await addScienceAchieve(params)
            if (!success) {
              this.$message.warning(message || '新增失败')
              return
            }
            this.$message.success(message || '新增成功')
            // 下一步&把从数据库读取到的当前数据取出来
            this.$emit('addCurrent', result)
          }
        }
      })
    },
    // 处理数据
    dealParams(data, val) {
      if (['136', '500'].indexOf(data.processStatus) != -1) {
        data.processStatus = '100'
      }
      data.achieveName = val.achieveName
      data.achieveNumber = val.achieveNumber
      data.achieveType = val.achieveType
      data.resultForm = val.resultForm
      data.ownerYear = val.ownerYear
      data.scienceProjectId = val.scienceProjectId[1]
      return data
    },
  },
}
</script>
<style lang="less" scoped>
</style>
