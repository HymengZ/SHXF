<template>
  <div class="manage-type">
    <div class="tips">
      <a-alert banner>
        <div slot="message" class="message">已完成的节点可以再次进入修改，请选择此次需要编辑的资料类型。</div>
      </a-alert>
    </div>
    <div class="typeRadio">
      <a-form :form="form" :colon="false">
        <a-form-item label="项目管理类型">
          <a-radio-group v-decorator="['projectManagementType', validatorRules.projectManagementType]">
            <a-radio :value="'0'">正在进行中项目</a-radio>
            <a-radio :value="'1'">历史项目</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </div>
    <div class="card">
      <a-card @click="openProjectMessage">
        <div class="content">
          <div class="title"><img src="../../../../../assets/icon_项目信息.svg" /> <span>项目信息</span></div>
          <div class="status">
            项目信息：
            <img v-if="manageTypeTitle === '项目新增'" src="../../../../../assets/icon_未完成.png" />
            <img
              v-if="manageTypeTitle === '项目编辑' && projectMessageFinish"
              src="../../../../../assets/icon_已完成.png"
            />
            <img
              v-if="manageTypeTitle === '项目编辑' && !projectMessageFinish"
              src="../../../../../assets/icon_未完成.png"
            />
          </div>
        </div>
      </a-card>
      <a-card
        v-if="manageTypeTitle === '项目编辑' && currentEditData.projectInformation && currentEditData.phaseCheck == 1"
        @click="openStageCheck"
      >
        <div class="content">
          <div class="title"><img src="../../../../../assets/icon_阶段检查.svg" /> <span>阶段检查</span></div>
          <div class="status" v-if="stageFinish">
            <div v-for="item in currentEditData.stageCheckList" :key="item.id">
              {{ item.configName }}：
              <img v-if="item.attachmentStatus == '1'" src="../../../../../assets/icon_未完成.png" />
              <img v-else src="../../../../../assets/icon_已完成.png" />
            </div>
          </div>
        </div>
      </a-card>
      <a-card v-if="manageTypeTitle === '项目编辑' && currentEditData.projectInformation" @click="openEvaluate">
        <div class="content">
          <div class="title"><img src="../../../../../assets/icon_绩效评价.svg" /> <span>绩效评价</span></div>
          <div class="status">
            绩效评价：<img v-if="!evaluateFinish" src="../../../../../assets/icon_未完成.png" />
            <img v-else src="../../../../../assets/icon_已完成.png" />
          </div>
        </div>
      </a-card>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    manageTypeTitle: {
      type: String,
      required: false,
      default: '项目新增',
    },
    // 项目信息完成
    projectMessageFinish: {
      type: Boolean,
      required: false,
      default: false,
    },
    //阶段检查完成
    stageFinish: {
      type: Boolean,
      required: false,
      default: false,
    },
    // 绩效评价完成
    evaluateFinish: {
      type: Boolean,
      required: false,
      default: false,
    },
    // 当前编辑的数据
    currentEditData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      form: this.$form.createForm(this),
      validatorRules: {
        projectManagementType: { initialValue: '0', rules: [{ required: true, message: '项目管理类型不能为空' }] },
      },
    }
  },
  methods: {
    // 打开项目信息弹窗
    openProjectMessage() {
      this.$emit('openProjectMessageModal')
    },
    // 打开阶段检查弹窗
    openStageCheck() {
      this.$emit('openStageCheckModal')
    },
    // 打开绩效评价弹窗
    openEvaluate() {
      this.$emit('openEvaluateModal')
    },
    // 项目管理表单信息
    manageTypeForm() {
      return this.form.validateFields()
    },
    setManageTypeForm(data) {
      this.form.resetFields()
      this.form.setFieldsValue({ projectManagementType: data })
    },
    resetFields() {
      this.form.resetFields()
    },
  },
}
</script>
<style lang="less" scoped>
.manage-type {
  .tips {
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
  /deep/ .typeRadio {
    margin: 0 35px;
    .ant-radio-wrapper {
      span {
        font-size: 14px;
        font-weight: 400;
        text-align: left;
        color: rgba(0, 0, 0, 0.88);
        line-height: 22px;
      }
    }
  }
  .card {
    .ant-card {
      margin-top: 24px;
      cursor: pointer;
      .content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title {
          font-size: 18px;
          font-weight: 500;
          text-align: left;
          color: #262626;
          line-height: 28px;
          span {
            margin-left: 8px;
          }
        }
      }
    }
    .ant-card:hover {
      background-color: #e8e8e8;
    }
  }
}
</style>
