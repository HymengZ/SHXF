<template>
  <div>
    <a-form :form="form" :colon="false">
      <a-card title="奖项基本信息">
        <a-row type="flex" justify="space-between" align="top">
          <a-col :span="11">
            <a-form-item label="奖项名称">
              <a-input allowClear v-decorator="['awardName', validatorRules.awardName]" placeholder="请输入"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="奖项编号">
              <a-input
                allowClear
                v-decorator="['awardNumber', validatorRules.awardNumber]"
                placeholder="自动生成"
                disabled
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="所属年度">
              <a-select allowClear placeholder="请选择" v-decorator="['year', validatorRules.year]">
                <a-select-option v-for="(item, index) in yearArray" :key="index" :value="item.value">
                  {{ item.value }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="奖项类型">
              <a-select allowClear placeholder="请选择" v-decorator="['awardType', validatorRules.awardType]">
                <a-select-option v-for="(item, index) in awardTypeList" :key="index" :value="item.itemValue">
                  {{ item.itemText }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="是否历史奖项">
              <a-radio-group v-decorator="['ifHistoryData', validatorRules.ifHistoryData]">
                <a-radio :value="'0'">是</a-radio>
                <a-radio :value="'1'">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="获奖/申奖单位">
              <a-select allowClear placeholder="自动读取" v-decorator="['unitId', validatorRules.unitId]" disabled>
                <a-select-option v-for="(item, index) in unitTypeList" :key="index" :value="item.key">
                  {{ item.title }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="获奖时间">
              <j-date
                v-decorator="['awardTime', validatorRules.awardTime]"
                style="width: 100%"
                placeholder="选择年月日 时间"
                :showTime="true"
                date-format="YYYY-MM-DD HH:mm:ss"
              >
                <a-icon slot="suffixIcon" type="clock-circle" />
              </j-date>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="颁奖单位">
              <a-input allowClear v-decorator="['awardUnit', validatorRules.awardUnit]" placeholder="请输入"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="关联的科技项目">
              <a-cascader
                :field-names="{ label: 'projectName', value: 'projectName', children: 'children' }"
                expand-trigger="hover"
                :options="relationProjectList"
                placeholder="请选择"
                v-decorator="['linkProjectId', validatorRules.linkProjectId]"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card class="describe" title="奖项描述">
        <a-form :form="form" :colon="false">
          <a-form-item label="参奖说明">
            <a-textarea
              v-decorator="['referenceDescription']"
              placeholder="请输入5000字以内的文字"
              :rows="5"
            ></a-textarea>
          </a-form-item>
          <a-form-item label="评奖说明">
            <a-textarea v-decorator="['awardDescription']" placeholder="请输入5000字以内的文字" :rows="5"></a-textarea>
          </a-form-item>
        </a-form>
      </a-card>
    </a-form>
  </div>
</template>
<script>
import { getAction } from '@/api/manage.js'
import { fetchAwardProjectNumber, fetchRelationProject } from '@/api/project/projectAward'
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
    // 编辑的数据
    editListData: {
      type: Object,
      default: '',
      required: false,
    },
    // 奖项类型
    awardTypeList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      //单位列表
      unitTypeList: [],
      // 关联的科技项目
      relationProjectList: [],
      // 所属年度
      yearArray: getSelectYear(),
      form: this.$form.createForm(this),
      validatorRules: {
        awardName: { rules: [{ required: true, message: '奖项名称不能为空' }] },
        awardNumber: { rules: [{ required: true, message: '奖项编号不能为空' }] },
        year: { rules: [{ required: true, message: '所属年度不能为空' }] },
        awardType: { rules: [{ required: true, message: '奖项类型不能为空' }] },
        ifHistoryData: { rules: [{ required: true, message: '请选择是否历史奖项' }] },
        unitId: { rules: [{ required: true, message: '获奖/申奖单位不能为空' }] },
        awardTime: { rules: [{ required: true, message: '请填写获奖时间' }] },
        awardUnit: { rules: [{ required: true, message: '颁奖单位不能为空' }] },
        linkProjectId: { rules: [{ required: false, message: '请选择关联的科技项目' }] },
      },
      // 请求url
      url: {
        // 发布单位
        queryIdTree: '/sys/sysDepart/queryIdTree',
      },
    }
  },
  computed: {
    unit() {
      return this.$store.state.user.info.departId
    },
  },
  created() {
    // 只有新增情况下才调接口读取的数据
    if (this.type === 'add') {
      this.getProjectAwardNumber()
    } else {
      // 编辑
      this.showData()
    }
    // 下拉框
    this.getSelectList()
  },
  methods: {
    // 获取奖项编号
    async getProjectAwardNumber() {
      const { message, success } = await fetchAwardProjectNumber()
      if (!success) {
        this.$message.warning('获取奖项编号失败')
        return
      }
      this.$nextTick(() => {
        this.form.setFieldsValue({ awardNumber: message })
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
      // 获取单位
      await getAction(this.url.queryIdTree).then((res) => {
        const { result, success } = res
        if (success) {
          this.unitTypeList = result
          if (this.type === 'add') {
            this.$nextTick(() => {
              // 设置单位
              this.form.setFieldsValue({ unitId: this.unit })
            })
          }
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 编辑的时候展示数据
    showData() {
      this.form.resetFields()
      let model = Object.assign({}, this.editListData)
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            model,
            'awardName',
            'awardNumber',
            'year',
            'awardType',
            'ifHistoryData',
            'unitId',
            'awardTime',
            'awardUnit',
            'projectName',
            // 'linkProjectId',
            'referenceDescription',
            'awardDescription'
          )
        )
      })
    },

    // 保存数据
    validateFields() {
      return this.form.validateFields()
    },
  },
}
</script>
<style lang="less" scoped>
/deep/ .ant-card-head {
  background: #fafafa;
}
.describe {
  margin-top: 16px;
}
</style>
