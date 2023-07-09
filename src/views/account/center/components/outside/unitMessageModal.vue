<template>
  <div class="unit-message-modal">
    <a-alert banner>
      <div slot="message" class="message">
        1、本平台只支持团队/单位等外部账号注册，注册申请必须提供单位证明;<br />
        2、高等院校/科研院所/专业机构请提供事业单位法人证书，企业单位请提供营业执照，科研团队和其他单位请提供具体的法人单位所出具
        的单位证明文件并盖有公章证明;
        <br />
        3、修改后提交将会重新进入平台人工审核，该账号已发布的资源都会同步自动下架，审核通过后注册百分比为60%，后续完成科技资源重新发布为100%，可开始接收平台推送的匹配清单。
      </div>
    </a-alert>
    <div class="content">
      <a-form-model
        ref="form"
        layout="horizontal"
        :model="model"
        :rules="validatorRules"
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-model-item label="单位logo">
          <uploadFile ref="logo" :attachmentUrl="userUnit.logo" :isLt1K="200" typeList="jpg,png" />
        </a-form-model-item>

        <a-form-model-item prop="name" label="单位/团队名称">
          <a-input v-model="model.name" size="large" placeholder="请输入单位或者团队名称"> </a-input>
        </a-form-model-item>
        <a-form-model-item prop="type" label="单位类型">
          <a-select v-model="model.type" style="width: 100%" allowClear placeholder="请选择">
            <a-select-option v-for="(item, index) in unitList" :key="index" :value="item.itemValue">
              {{ item.itemText }}
            </a-select-option>
          </a-select></a-form-model-item
        >
        <a-form-model-item prop="certifyType" label="单位证明类型">
          <a-radio-group v-model="model.certifyType">
            <a-radio v-for="item in unitProveList" :key="item.id" :value="item.itemValue">{{ item.itemText }}</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="单位证明文件">
          <div class="unit-prove">
            <div class="left">
              <uploadFile ref="proveFile" :attachmentUrl="userUnit.file" :isLt1K="1024 * 3" typeList="jpg,png" />
            </div>
            <div class="center">示例</div>
            <div class="right">
              <img src="~@/assets/单位证明样图-营业执照.png" alt="示例" />
            </div>
          </div>
        </a-form-model-item>
        <a-form-model-item prop="creditCodes" label="统一社会信用代码">
          <a-input v-model="model.creditCodes" size="large" placeholder="请输入统一社会信用代码"> </a-input>
        </a-form-model-item>
        <a-form-model-item prop="address" label="单位地址">
          <area-select v-model="model.address" type="text" :data="pcaa" :level="2"></area-select>
          <a-input style="margin-top: 16px" v-model="detailAddress" size="large" block placeholder="请输入详细地址" />
        </a-form-model-item>
      </a-form-model>
      <a-modal title="单位信息修改提示" :visible="visible" :closable="false" :footer="false">
        <div class="modal-content">
          <div class="icon">
            <a-icon type="check-circle" theme="filled" style="color: #52c41a; font-size: 60px" />
          </div>
          <div class="text-blod">单位信息修改成功</div>
          <a-button @click="handleBack" block>返回账号信息</a-button>
        </div>
      </a-modal>
    </div>
  </div>
</template>
<script>
import JAreaLinkage from '@/components/jeecg/JAreaLinkage'
import { getAction } from '@/api/manage'
import { editUnit } from '@/api/center/userInfo'
import uploadFile from '@/views/user/register/outside/uploadFile/index.vue'
export default {
  props: {
    // 单位信息
    userUnit: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    uploadFile,
    JAreaLinkage,
  },
  data() {
    return {
      pcaa: this.$Jpcaa,
      detailAddress: '',
      visible: false,
      // 单位类型
      unitList: [],
      unitProveList: [],
      model: {
        name: '',
        type: '',
        certifyType: '',
        creditCodes: '',
        address: [],
      },
      validatorRules: {
        name: [{ required: true, message: '单位/团队名称不能为空' }],
        type: [{ required: true, message: '单位类型不能为空' }],
        certifyType: [{ required: true, message: '请选择单位证明类型' }],
        creditCodes: [{ required: true, message: '统一社会信用代码不能为空' }],
        address: [{ required: true, message: '单位地址不能为空' }],
      },
    }
  },

  created() {
    this.getSelectList()
  },
  mounted() {
    this.showUnitData()
  },
  methods: {
    showUnitData() {
      let data = this.userUnit
      this.model = {}
      this.$set(this.model, 'name', data.name)
      this.$set(this.model, 'type', data.type)
      this.$set(this.model, 'certifyType', data.certifyType)
      this.$set(this.model, 'creditCodes', data.creditCodes)
      // 地址
      let address = data.address.split('-')
      let area = address.splice(0, 3)
      this.detailAddress = address.toString()
      this.$set(this.model, 'address', area)
    },
    async getSelectList() {
      getAction(`/sys/dictItem/listByDictCode`, { dictCode: 'unit_type' }).then((res) => {
        if (res.success) {
          this.unitList = res.result
        } else {
          this.$message.warning(res.message || '查询失败')
        }
      })
      getAction(`/sys/dictItem/listByDictCode`, { dictCode: 'unit_prove_type' }).then((res) => {
        if (res.success) {
          this.unitProveList = res.result
        } else {
          this.$message.warning(res.message || '查询失败')
        }
      })
    },
    handleSubmit() {
      this.$refs['form'].validate(async (success) => {
        if (success) {
          let allAddress = this.model.address.toString().replace(/,/g, '-') + '-' + this.detailAddress
          let proveFileUrl = this.$refs.proveFile.uploadFile()
          let logoUrl = ''
          if (this.$refs.logo.uploadFile()) {
            logoUrl = this.$refs.logo.uploadFile()
          }
          let params = {
            logo: logoUrl,
            file: proveFileUrl,
            id: this.userUnit.id,
            // identify: 2,
            name: this.model.name,
            type: this.model.type,
            certifyType: this.model.certifyType,
            creditCodes: this.model.creditCodes,
            address: allAddress,
          }
          const { success, message } = await editUnit(params)
          if (!success) {
            this.$message.warning(message)
            return
          }
          this.visible = true
        }
      })
    },
    handleBack() {
      this.visible = false
      this.$emit('close')
      this.$emit('refreshUnit')
    },
  },
}
</script>
<style lang="less" scoped>
.ant-alert {
  background: #fffbe6;
  border: 1px solid #ffe58f;
  border-radius: 2px;
  margin: 20px 0;
  .message {
    font-size: 14px;
    font-weight: 400;
    text-align: left;
    color: rgba(0, 0, 0, 0.65);
    line-height: 20px;
  }
}
.content {
  width: 500px;
  margin: 0 auto;
  .unit-prove {
    display: flex;
    .center {
      margin: 0 20px;
      padding-top: 40px;
      font-size: 14px;
      font-weight: 400;
      text-align: left;
      color: #df0035;
      line-height: 14px;
    }
    .right {
      margin-left: 8px;
    }
  }
  /deep/ .area-select-wrap {
    display: flex;
    .medium {
      margin-left: 0px;
    }
  }
}
// 弹框内容
.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  .icon {
    margin-bottom: 20px;
  }
  .text-blod {
    font-size: 20px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    line-height: 32px;
    margin-bottom: 20px;
  }
  .text {
    font-size: 13px;
    font-weight: 400;
    text-align: center;
    color: #8c8c8c;
    line-height: 22px;
    margin-bottom: 20px;
    span {
      color: #ff6d6f;
    }
  }
}
</style>

