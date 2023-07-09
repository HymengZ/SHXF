<template>
  <div>
    <a-form :form="form">
      <a-card title="试点应用基本信息">
        <a-row type="flex" justify="space-between" align="top">
          <a-col :span="11">
            <a-form-item label="试点应用名称">
              <a-input v-decorator="['pilot.pilotName', validatorRules.pilotName]" placeholder="请输入"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="试点应用编号">
              <a-input
                disabled
                v-decorator="['pilot.pilotNumber', validatorRules.pilotNumber]"
                placeholder="自动生成"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="关联的成果名称">
              <a-input
                v-decorator="['pilot.linkAchieveName', validatorRules.linkAchieveName]"
                placeholder="请输入"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="成果所在目录">
              <a-cascader
                :options="cascadeOpt"
                v-decorator="['pilot.catalogueIds', validatorRules.catalogueIds]"
                placeholder="请选择"
              />
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="成果编号">
              <a-input
                v-decorator="['pilot.linkAchieveNumber', validatorRules.linkAchieveNumber]"
                placeholder="请输入"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="成果配备范围">
              <a-select
                :options="equipmentRangeData"
                v-decorator="['pilot.equipmentRange', validatorRules.equipmentRange]"
                placeholder="请选择"
              >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="填写单位">
              <a-input
                placeholder="自动读取"
                v-decorator="['pilot.departName', validatorRules.departName]"
                disabled
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card title="领用申请信息">
        <a-row type="flex" justify="space-between" align="top">
          <a-col :span="11">
            <a-form-item label="配备数量（件）">
              <a-input
                placeholder="0"
                v-decorator="['pilotDetail.equipmentAmount', validatorRules.equipmentAmount]"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="装备要求">
              <a-input v-decorator="['pilotDetail.equipmentRequirement', validatorRules.equipmentRequirement]"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="业务部门需求">
              <a-textarea
                placeholder="请输入5000字以内的文字"
                v-decorator="['pilotDetail.businessDemand']"
              ></a-textarea>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="其他部门意见">
              <a-textarea v-decorator="['pilotDetail.otherOpinion']" placeholder="请输入5000字以内的文字"></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-form-item>
        <a-card title="领用附件">
          <p>附件（附件类型pdf，附件大小不超过3M，不限个数。）</p>
          <enclosure-uploader v-decorator="['pilotDetail.consumingFiles']" />
        </a-card>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { fetchExtensionNumber } from '@/api/outcome/catalog'
import { listPublished } from '@/api/outcome/technology'
import EnclosureUploader from '../../../components/EnclosureUploader/index.vue'

export default {
  name: 'LogNew',
  components: { EnclosureUploader },

  props: ['equipmentRangeData'],

  data() {
    return {
      treeData: [],
      form: this.$form.createForm(this),
      validatorRules: {
        pilotName: { rules: [{ required: true, message: '请输入试点应用名称' }] },
        pilotNumber: {
          rules: [{ required: true, message: '请输入试点应用编号' }],
        },
        linkAchieveName: { rules: [{ required: true, message: '请输入关联的成果名称' }] },
        catalogueIds: { rules: [{ required: true, message: '请选择成果所在目录' }] },
        linkAchieveNumber: { rules: [{ required: true, message: '请输入成果编号' }] },
        equipmentRange: { rules: [{ required: true, message: '请选择成果配备范围' }] },
        totalPrice: {
          initialValue: this.totalPrice,
          rules: [{ required: true, message: '请输入采购总支出' }],
        },
        equipmentRequirement: { rules: [{ required: true, message: '请输入装备要求' }] },
        equipmentAmount: { rules: [{ required: true, pattern: /^\d+$|^\d+[.]?\d+$/, message: '请输入数字' }] },
        businessDemand: { rules: [{ required: true, message: '请输入业务部门需求' }] },
        departName: {
          initialValue: this.$store.state.user.info.departName,
          rules: [{ required: true, message: '填写单位不能为空' }],
        },
      },
    }
  },
  computed: {
    cascadeOpt() {
      return this.treeData.map((item) => {
        return {
          label: item.levelYear,
          value: item.id,
          disabled: item.children.length === 0,
          children: item.children.map((child) => {
            return {
              label: child.levelName,
              value: child.id,
              disabled: child.achieveCatalogues.length === 0,
              children: child.achieveCatalogues.map((catalogue) => {
                return {
                  label: catalogue.catalogueName,
                  value: catalogue.id,
                }
              })
            }
          })
        }
      })
    },
  },
  mounted() {
    this.handleFetchTreeData()
    setTimeout(() => {
      this.generateExtensionNumber()
    })
  },

  methods: {
    generateExtensionNumber() {
      const val = this.form.getFieldValue('pilot.pilotNumber')
      console.log("val",val)
      if (!val) {
        fetchExtensionNumber().then((res) => {
          this.setFieldsValue({
            pilot: {
              pilotNumber: res.message,
            },
          })
        })
      }
    },
    onChange(e) {
      console.log(e)
    },
    async validateFields() {
      return await this.form.validateFields()
    },
    setFieldsValue(data) {
      this.form.setFieldsValue(data)
    },
    handleFetchTreeData(forceFirst = false) {
      listPublished({ param: null }).then((res) => {
        this.treeData = res.result
      })
    },
  },
}
</script>

<style lang="less" scoped>
/deep/ .ant-card {
  margin-bottom: 10px;
  .ant-card-head {
    background: #fafafa;
  }
}
</style>