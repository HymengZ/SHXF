<template>
  <div>
    <a-alert banner>
      <div slot="message" class="message">
        1、有中期检查，审核通过进入中期检查待提交；无中期检查，审核通过进入绩效评价待提交；可一并提交三个节点信息，审核人员手动操作设为验收完成；
        <br />
        2、待提交状态可修改信息，已提交状态无法修改，如需修改/删除请进行申请退回操作。
      </div>
    </a-alert>
    <a-tabs default-active-key="1" @change="callback">
      <a-tab-pane :forceRender="true" key="1" tab="项目信息录入">
        <item-information-form
          ref="formInfo"
          :infoList="infoList"
          :type="type"
          :id="id"
          @ok="handleOk"
          @cancel="handleCancel"
          :pojectType="pojectType"
        ></item-information-form>
      </a-tab-pane>
      <a-tab-pane :forceRender="true" key="2" tab="中期检查录入" force-render>
        <interimNspection
          ref="interInfo"
          @ok="handleOk"
          @cancel="handleCancel"
          :infoList="infoList"
          :type="type"
          :id="id"
        ></interimNspection>
      </a-tab-pane>
      <a-tab-pane :forceRender="true" key="3" tab="绩效评价录入">
        <performance-evaluate
          ref="performance"
          @ok="handleOk"
          :infoList="infoList"
          :type="type"
          :id="id"
          @cancel="handleCancel"
        ></performance-evaluate>
      </a-tab-pane>
    </a-tabs>
    <div class="footBtn">
      <a-button type="text" @click="handleCancel" style="margin-right: 8px">取消</a-button>
      <a-button type="primary" @click="handleOk">保存</a-button>
    </div>
  </div>
</template>

<script>
import ItemInformationForm from './Item_Information_Form.vue'
import InterimNspection from './InterimNspection.vue'
import PerformanceEvaluate from './performanceEvaluate.vue'
import { getAction, postAction } from '@/api/manage.js'
export default {
  components: {
    ItemInformationForm,
    InterimNspection,
    PerformanceEvaluate,
  },
  data() {
    return {
      url: {
        add: '/fire/projectReport/add',
        edit: '/fire/projectReport/edit',
      },
      hasInspect: false,
    }
  },
  props: {
    pojectType: {
      type: Array,
      default: [],
      required: false,
    },
    infoList: {
      type: Object,
      default: {},
      required: false,
    },
    type: {
      type: String,
      default: '',
      required: false,
    },
    id: {
      type: String,
      default: '',
      required: false,
    },
  },
  methods: {
    //保存
    handleOk() {
      // console.log();
      this.$refs.formInfo.handleOk()
      this.$refs.interInfo.handleOk()
      this.$refs.performance.handleOk()
      let params
      let url
      if (this.type == 'add') {
        url = this.url.add
      } else {
        url = this.url.edit
      }
      params = Object.assign(this.$refs.formInfo.params, this.$refs.interInfo.params, this.$refs.performance.params)
      if (this.$refs.formInfo.finish && this.$refs.interInfo.finish && this.$refs.performance.finish) {
        postAction(url, params).then((res) => {
          if (res.success) {
            this.$message.success(res.message)
            this.$emit('ok')
          } else {
            this.$message.warning(res.message)
          }
        })
      }
    },
    //关闭弹框
    handleCancel() {
      this.$refs.formInfo.handleCancel()
      this.$refs.interInfo.handleCancel()
      this.$refs.performance.handleCancel()
      this.$emit('cancel')
    },
    // 选项卡切换
    callback(e) {
      this.$refs.interInfo.handleIfDisabled(this.infoList.hasInspect)
    },
  },
}
</script>

<style lang="less" scoped>
.footBtn {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}
</style>