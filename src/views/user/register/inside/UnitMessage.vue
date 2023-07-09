<template>
  <div class="unit-message">
    <a-alert banner>
      <div slot="message" class="message">选择所属单位必须填写当前职务，单位管理员认领后根据职务分配不同权限。</div>
    </a-alert>
    <div class="content">
      <a-form-model
        ref="form"
        layout="horizontal"
        :model="model"
        :rules="validatorRules"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 19 }"
      >
        <a-form-model-item prop="owerUnit" label="所属单位">
          <a-cascader
            :show-search="{ filter }"
            :field-names="{ label: 'name', value: 'id', children: 'children' }"
            expand-trigger="hover"
            :options="owerUnitList"
            placeholder="请选择"
            v-model="model.owerUnit"
          />
        </a-form-model-item>
        <a-form-model-item prop="post" label="职务">
          <a-input v-model="model.post" size="large" type="text" placeholder="请输入"> </a-input>
        </a-form-model-item>
        <a-form-model-item prop="jobTitle" label="职称">
          <a-select v-model="model.jobTitle" style="width: 100%" allowClear placeholder="请选择">
            <a-select-option v-for="(item, index) in jobTitleList" :key="index" :value="item.itemValue">
              {{ item.itemText }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item prop="email" label="电子邮箱">
          <a-input v-model="model.email" size="large" type="text" placeholder="请输入"> </a-input>
        </a-form-model-item>
      </a-form-model>
      <a-modal title="账号注册提示" :visible="visible" :closable="false" :footer="false">
        <div class="modal-content">
          <div class="icon">
            <a-icon type="check-circle" theme="filled" style="color: #52c41a; font-size: 60px" />
          </div>
          <div class="text-blod">提交认领申请成功</div>
          <div class="text">请耐心等待单位管理员审核您的队伍从属申请，审核通过后才参与科技业务。</div>
          <a-button @click="handleOk" block>确定</a-button>
        </div>
      </a-modal>
    </div>
  </div>
</template>
<script>
import { emailCheck } from '@/utils/validate'
import { postAction, getAction } from '@/api/manage'
import { formatSecond } from '@/utils/formatDate'
export default {
  props: {
    currentData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      // 职称
      jobTitleList: [],
      owerUnitList: [],
      visible: false,
      // 单位类型
      model: {
        owerUnit: [],
        post: '',
        jobTitle: '',
        email: '',
      },
      validatorRules: {
        owerUnit: [{ required: true, message: '所属单位不能为空' }],
        email: [{ validator: emailCheck }],
      },
    }
  },
  created() {
    // 获取下拉列表
    this.getSelectList()
  },
  methods: {
    // 所属单位搜索
    filter(inputValue, path) {
      return path.some((option) => option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
    },
    async getSelectList() {
      //职称
      await getAction(`/sys/dictItem/listByDictCode`, { dictCode: 'work_title' }).then((res) => {
        const { result, success } = res
        if (success) {
          this.jobTitleList = result
        } else {
          this.$message.warning(res.message || '职称查询失败')
        }
      })
      //所属单位
      await getAction('/sys/common/_search/tree').then((res) => {
        const { result, success } = res
        if (success) {
          this.owerUnitList = result
        } else {
          this.$message.warning(res.message || '所属单位查询失败')
        }
      })
    },
    handleSubmit() {
      this.$refs['form'].validate((success) => {
        if (success) {
          let params = {
            unitId: this.model.owerUnit[2],
            id: this.currentData.id,
            post: this.model.post,
            jobTitle: this.model.jobTitle,
            email: this.model.email,
            applyTime: formatSecond(new Date()),
          }
          postAction('/sys/common/update/user', params).then((res) => {
            if (res.success) {
              this.visible = true
            } else {
              this.$notification['error']({
                message: '单位信息保存失败',
                description: res.message,
                duration: 4,
              })
            }
          })
        }
      })
    },
    handleOk() {
      this.$emit('nextStep', 2)
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
    margin-bottom: 6px;
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
