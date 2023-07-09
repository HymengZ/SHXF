<template>
  <div>
    <div class="tips">
      <a-alert banner>
        <div slot="message" class="message">
          1、关注的话题为平台已发布的话题，是最近几年上海消防总队觉得适合研究的消防领域/方向，下拉多选您感兴趣的关注方向；<br />
          2、自设关键词可人性化输入，不限制关键词数量，请用不超过10个字的精准词汇形容科技资源，不要使用反动、侮辱、色情词汇；<br />
          3、资源单位信息默认读取当前账号注册时的单位信息，如需修改请在列表页面点击【单位信息修改】修改。
        </div>
      </a-alert>
    </div>
    <a-form :form="form" :colon="false">
      <a-card title="资源基本信息">
        <a-row type="flex" justify="space-between" align="top">
          <a-col :span="11">
            <a-form-item label="资源名称">
              <a-input allowClear v-decorator="['name', validatorRules.name]" placeholder="请输入"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="资源编号">
              <a-input allowClear v-decorator="['code', validatorRules.code]" placeholder="自动生成" disabled></a-input>
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
            <a-form-item label="资源类型">
              <a-select allowClear placeholder="请选择" v-decorator="['type', validatorRules.type]">
                <a-select-option v-for="(item, index) in resourceTypeList" :key="index" :value="item.itemValue">
                  {{ item.itemText }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="资源水平">
              <a-select allowClear placeholder="请选择" v-decorator="['level', validatorRules.level]">
                <a-select-option v-for="(item, index) in resourceLevelList" :key="index" :value="item.itemValue">
                  {{ item.itemText }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="关注的话题（可多选）">
              <a-select
                mode="multiple"
                allowClear
                placeholder="请选择"
                v-decorator="['followTopic', validatorRules.followTopic]"
              >
                <!-- <a-select-option v-for="(item, index) in projectCategoryList" :key="index" :value="item.itemValue">
                  {{ item.itemText }}
                </a-select-option> -->
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="固定关键词">
              <a-select
                mode="multiple"
                allowClear
                placeholder="请选择"
                v-decorator="['fixedKeyword', validatorRules.fixedKeyword]"
              >
                <!-- <a-select-option v-for="(item, index) in projectCategoryList" :key="index" :value="item.itemValue">
                  {{ item.itemText }}
                </a-select-option> -->
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="自设关键词（可输入多个字段，“；”分割） ">
              <a-input allowClear v-decorator="['customKeyword']" placeholder="请输入"> </a-input
            ></a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card title="资源单位信息" class="card">
        <div class="message">
          <div class="logo" v-if="unit.logo">
            <img
              :src="unit.logo"
              alt="avatar"
              style="width: 120px; height: 120px; display: block; border-radius: 60px"
            />
          </div>
          <div class="info">
            <div class="info-title">{{ unit.name }}</div>
            <div class="info-detials">
              <div class="text">单位证明类型：{{ unit.certifyType }}</div>
              <div class="btn-row">
                <div class="text">统一社会信用代码：{{ unit.creditCodes }}</div>
                <div class="actions">
                  <a-button class="btn" icon="download" @click="handleDownload">单位证明文件</a-button>
                </div>
              </div>
              <div class="text">单位地址：{{ unit.address | formatText }}</div>
            </div>
          </div>
        </div>
      </a-card>
    </a-form>
  </div>
</template>
<script>
import { fetchUserInfo } from '@/api/center/userInfo'
import { getSelectYear } from '@/utils/year'
import { downloadPic } from '@/utils/downloadFile'
import { fetchResourceNumber } from '@/api/hatch/resource'
import { listByDictCode } from '@/api/listByDictCode'
import pick from 'lodash.pick'
export default {
  props: {
    // 区分新增和编辑
    type: {
      type: String,
      default: '',
      required: false,
    },
    currentData: {
      type: Object,
      default: () => {},
      required: false,
    },
  },
  data() {
    return {
      // 资源类型
      resourceTypeList: [],
      // 资源水平
      resourceLevelList: [],
      // 单位信息
      unit: {
        id: '',
        name: '',
        certifyType: '',
        creditCodes: '',
        logo: '',
        address: '',
        file: '',
      },
      // 所属年度
      yearArray: getSelectYear(),
      form: this.$form.createForm(this),
      validatorRules: {
        name: { rules: [{ required: true, message: '资源名称不能为空' }] },
        code: { rules: [{ required: false, message: '资源编号不能为空' }] },
        year: { rules: [{ required: false, message: '所属年度不能为空' }] },
        type: { rules: [{ required: false, message: '资源类型不能为空' }] },
        level: { rules: [{ required: false, message: '资源水平不能为空' }] },
        followTopic: { rules: [{ required: false, message: '关联的话题不能为空' }] },
        fixedKeyword: { rules: [{ required: false, message: '固定关键词不能为空' }] },
      },
    }
  },
  filters: {
    formatText(e) {
      if (e) {
        return e.replace(/-/g, '')
      }
    },
  },
  computed: {
    baseUrl() {
      return process.env.VUE_APP_API_BASE_URL + '/'
    },
  },
  created() {
    // 只有新增情况下才调接口读取的数据
    if (this.type === 'add' && !this.currentData.id) {
      // 自动读取的内容
      this.getAutoRead()
    }
    // 下拉框
    this.getSelectList()
  },
  watch: {
    currentData(newVal) {
      if (newVal) {
        this.showData()
      }
    },
  },

  methods: {
    async getAutoRead() {
      // 获取资源编号
      const { message, success } = await fetchResourceNumber()
      if (!success) {
        this.$message.warning('获取资源编号失败')
        return
      }
      this.$nextTick(() => {
        this.form.setFieldsValue({ code: message })
      })
      // 获取用户单位信息
      const res = await fetchUserInfo()
      if (!res.success) {
        this.$message.warning(res.message)
        return
      }
      const unitMessage = res.result.userUnit
      this.unit.name = unitMessage.name
      this.unit.id = unitMessage.id
      this.unit.certifyType = unitMessage.certifyType
      this.unit.creditCodes = unitMessage.creditCodes
      this.unit.address = unitMessage.address
      this.unit.logo = this.baseUrl + unitMessage.logo
      this.unit.file = unitMessage.file
    },
    // 下载单位证明文件
    handleDownload() {
      let fileUrl = this.unit.file
      downloadPic(fileUrl, '单位证明文件.png')
    },

    async getSelectList() {
      // 获取资源类型
      const { success, message, result } = await listByDictCode('resource_type')
      if (!success) {
        this.$message.warning(message)
      }
      this.resourceTypeList = result
      // 获取资源水平
      const res = await listByDictCode('resource_level')
      if (!res.success) {
        this.$message.warning(res.message)
      }
      this.resourceLevelList = res.result
    },

    // 点击上一步时展示填写过的内容
    showData() {
      this.unit = {}
      this.form.resetFields()
      let model = Object.assign({}, this.currentData)
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(model, 'name', 'code', 'year', 'type', 'level', 'customKeyword'))
      })
      const unit = model.sysUserUnit
      this.unit = {
        id: unit.id,
        name: unit.name,
        certifyType: unit.certifyType,
        creditCodes: unit.creditCodes,
        logo: this.baseUrl + unit.logo,
        address: unit.address,
        file: unit.file,
      }
    },

    // 关联的科技资源搜索
    // filter(inputValue, path) {
    //   return path.some((option) => option.projectName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
    // },
    // 表单校验和保存数据
    handleSubmit() {
      this.form.validateFields(async (err, values) => {
        if (!err) {
          let addOrEdit = this.currentData.id
            ? {
                id: this.currentData.id,
                status: this.currentData.status == '1' ? '1' : '0',
              }
            : {
                // 待提交
                status: '0',
                // 只有新增才传当前账号的单位
                unitId: this.unit.id,
                unitName: this.unit.name,
              }
          let params = Object.assign(values, addOrEdit)
          this.$emit('addData', params)
        }
      })
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
  margin-bottom: 10px;
  .ant-form-explain {
    position: absolute;
    font-size: 13px;
  }
}
// 卡片间距
.ant-card {
  margin-top: 16px;
}
.message {
  display: flex;
  .logo {
    margin-right: 20px;
  }
  .info {
    flex: 1;
    .info-title {
      font-size: 20px;
      font-weight: 500;
      color: #262626;
      line-height: 20px;
      margin-bottom: 20px;
    }
    .info-detials {
      font-size: 14px;
      font-weight: 400;
      color: #595959;
      line-height: 20px;
      .text {
        margin-bottom: 3px;
      }
      .btn-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .btn {
          margin-left: 8px;
        }
      }
    }
  }
}
</style>
