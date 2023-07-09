<template>
  <div>
    <a-form :form="form">
      <a-card title="科技成果推广基本信息">
        <a-row type="flex" justify="space-between" align="top">
          <a-col :span="11">
            <a-form-item label="成果推广名称">
              <a-input
                v-decorator="['extension.extensionName', validatorRules.extensionName]"
                placeholder="请输入"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="成果推广编号">
              <a-input
                disabled
                v-decorator="['extension.extensionNumber', validatorRules.extensionNumber]"
                placeholder="自动生成"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="关联的成果名称">
              <a-input
                v-decorator="['extension.linkAchieveName', validatorRules.linkAchieveName]"
                placeholder="请输入"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="成果所在目录">
              <a-cascader
                :options="cascadeOpt"
                v-decorator="['extension.catalogueIds', validatorRules.catalogueIds]"
                placeholder="请选择"
              />
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="成果编号">
              <a-input
                v-decorator="['extension.linkAchieveNumber', validatorRules.linkAchieveNumber]"
                placeholder="请输入"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="成果配备范围">
              <a-select
                :options="equipmentRangeData"
                v-decorator="['extension.equipmentRange', validatorRules.equipmentRange]"
                placeholder="请选择"
              >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="填写单位">
              <a-input
                placeholder="自动读取"
                v-decorator="['extension.departName', validatorRules.departName]"
                disabled
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card title="采购信息">
        <a-row type="flex" justify="space-between" align="top">
          <a-col :span="11">
            <a-form-item label="配备数量（件）">
              <a-input
                @change="numberEx = $event.target.value"
                placeholder="0"
                v-decorator="['extensionDetail.equipmentAmount', validatorRules.equipmentAmount]"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="成果单价（万元）">
              <a-input
                @change="numberUne = $event.target.value"
                placeholder="00.00"
                v-decorator="['extensionDetail.unitPrice', validatorRules.unitPrice]"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="采购总支出（万元）">
              <a-input
                disabled
                placeholder="自动读取"
                v-decorator="['extensionDetail.totalPrice', validatorRules.totalPrice]"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="合同编号">
              <a-input
                v-decorator="['extensionDetail.contractNumber', validatorRules.contractNumber]"
                placeholder="请输入"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="合同期限">
              <!-- contractStartTime -->
              <!-- contractEndTime -->
              <a-range-picker
                v-decorator="['extensionDetail.contractTime', validatorRules.contractTime]"
                style="display: block"
              />
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="合同签订日期">
              <a-date-picker
                v-decorator="['extensionDetail.contractSignTime', validatorRules.contractSignTime]"
                style="display: block; width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="业务部门需求">
              <a-textarea
                placeholder="请输入5000字以内的文字"
                v-decorator="['extensionDetail.businessDemand', validatorRules.businessDemand]"
              ></a-textarea>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="其他部门意见">
              <a-textarea
                v-decorator="['extensionDetail.otherOpinion']"
                placeholder="请输入5000字以内的文字"
              ></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-form-item>
        <a-card title="发票附件">
          <p>附件（附件类型pdf，附件大小不超过3M，不限个数。）</p>
          <enclosure-uploader v-decorator="['extensionDetail.invoiceFiles']" />
        </a-card>
      </a-form-item>
      <a-form-item>
        <a-card title="合同附件">
          <p>附件（附件类型pdf，附件大小不超过3M，只需上传1份。）</p>
          <enclosure-uploader :max="1" v-decorator="['extensionDetail.contractFiles']" />
        </a-card>
      </a-form-item>
      <a-form-item>
        <a-card title="其他附件">
          <p>附件（附件类型pdf，附件大小不超过3M，最多上传5份。）</p>
          <enclosure-uploader :max="5" v-decorator="['extensionDetail.otherFiles']" />
        </a-card>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import {dictItem, fetchExtensionNumber} from '@/api/outcome/catalog'
import EnclosureUploader from '../../../components/EnclosureUploader/index.vue'
import { listPublished } from '@api/outcome/technology'

export default {
  name: 'LogNew',
  components: { EnclosureUploader },

  props: ['equipmentRangeData'],

  data() {
    return {
      treeData: [],
      numberEx: '', //配备数量
      numberUne: '', //成果单价
      form: this.$form.createForm(this),
      validatorRules: {
        extensionName: { rules: [{ required: true, message: '请输入成果推广名称' }] },
        extensionNumber: {
          initialValue: '',
          rules: [{ required: true, message: '请输入成果推广编号' }],
        },
        contractNumber: { rules: [{ required: true, message: '请输入合同编号' }] },
        linkAchieveName: { rules: [{ required: true, message: '请输入关联的成果名称' }] },
        catalogueIds: { rules: [{ required: true, message: '请选择成果所在目录' }] },
        linkAchieveNumber: { rules: [{ required: true, message: '请输入成果编号' }] },
        equipmentRange: { rules: [{ required: true, message: '请选择成果配备范围' }] },
        totalPrice: {
          initialValue: 0,
          rules: [{ required: true, message: '请输入采购总支出' }],
        },
        unitPrice: { rules: [{ required: true, pattern: /^\d+$|^\d+[.]?\d+$/, message: '请输入成果单价' }] },
        equipmentAmount: { rules: [{ required: true, pattern: /^\d+$|^\d+[.]?\d+$/, message: '请输入数字' }] },
        contractTime: { rules: [{ required: true, message: '请选择合同期限时间' }] },
        contractSignTime: { rules: [{ required: true, message: '请选择合同签订日期' }] },
        businessDemand: { rules: [{ required: true, message: '请输入业务部门需求' }] },
        departName: {
          initialValue: this.$store.state.user.info.departName,
          rules: [{ required: true, message: '填写单位不能为空' }],
        },
      },
    }
  },
  // computed: {
  //   numberUnit() {
  //     return this.numberEx * this.numberUne
  //   },
  // },
  computed: {
    totalPrice() {
      return (this.numberEx || 0) * (this.numberUne || 0)
    },
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

  created() {
    this.handleFetchTreeData()
    setTimeout(() => {
      this.generateExtensionNumber()
    })
  },
  methods: {
    onChange(e) {
      console.log(e)
    },
    generateExtensionNumber() {
      const val = this.form.getFieldValue('extension.extensionNumber')
      console.log("val", val)
      if (!val) {
        fetchExtensionNumber().then((res) => {
          this.setFieldsValue({
            extension: {
              extensionNumber: res.message,
            },
          })
        })
      }
    },
    resetFields() {
      this.form.resetFields()
      this.generateExtensionNumber()
    },
    async validateFields() {
      return await this.form.validateFields()
    },
    setFieldsValue(data) {
      this.form.setFieldsValue(data)
    },
    handleFetchTreeData(forceFirst = false) {
      listPublished({ param: null }).then((res) => {
        if (!res.success) {
          this.$message.error(res.message)
          return
        }
        this.treeData = res.result
      })
    },
  },
  // watch: {
  //   numberEx: function (newVal, oldVal) {
  //     // console.log('监听numberEx')
  //     console.log(newVal * oldVal)
  //     this.numberUnit = this.numberEx * this.numberUne
  //   },
  //   numberUne: function (newVal) {
  //     this.numberUnit = this.numberEx * newVal
  //   },
  // },
  watch: {
    totalPrice() {
      this.form.setFieldsValue({
        extensionDetail: { totalPrice: this.totalPrice.toFixed(2) },
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