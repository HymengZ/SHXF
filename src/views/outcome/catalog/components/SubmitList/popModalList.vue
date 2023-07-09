<template>
  <div>
    <a-alert banner>
      <div slot="message">
        1、如录入历史数据，新增时可以直接两个标签同步编辑，保存后一并提交，审核人员审核通过后发布入库； <br />
        2、总结待提交状态中，可修改总结内容，已提交的领用申请无法修改，如需修改/删除请进行申请退回操作。
      </div>
    </a-alert>
    <a-tabs :active-key="activeKey" @change="handleTableChange">
      <a-tab-pane forceRender key="lognew">
        <span slot="tab">
          采购信息录入
          <a-icon type="exclamation-circle" v-if="error.lognew" style="color: red" />
        </span>
        <log-new
          :treeData="treeData"
          :equipmentRangeData="equipmentRangeData"
          ref="logNewForm"
          @fieldsValueChange="handleLogNewFormChange"
        />
      </a-tab-pane>
      <a-tab-pane forceRender key="sumlognew" force-render v-if="more">
        <span slot="tab">
          总结录入
          <a-icon type="exclamation-circle" v-if="error.sumlognew" style="color: red" />
        </span>
        <sum-log-new ref="sumLogNewForm" :logNewFormData="logNewFormData"  />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { dictItem } from '../../../../../api/outcome/catalog'
import moment from 'moment'
import LogNew from './logNew'
import SumLogNew from './sumLogNew'
// import logNewVue from './logNew.vue'
export default {
  components: {
    LogNew,
    SumLogNew,
  },
  props: ['equipmentRangeData', 'treeData'],
  data() {
    return {
      more: false,

      activeKey: 'lognew',
      error: {
        lognew: false,
        sumlognew: false,
      },
      logNewFormData: {},
      
    }
  },

  methods: {
    resetFields() {
      this.$refs.logNewForm && this.$refs.logNewForm.resetFields()
      this.$refs.sumLogNewForm && this.$refs.sumLogNewForm.resetFields()
      this.activeKey = 'lognew'
      this.more = false
    },
    handleLogNewFormChange(e) {
      this.logNewFormData = e
    },
    // 选项卡切换
    handleTableChange(e) {
      this.activeKey = e
      this.error[e] = false
    },
    formatFileListToRequest(data) {
      return data
        ? data.map((item) => {
            return {
              fileName: item.name,
              fileUrl: item.response.message,
            }
          })
        : []
    },
    formatRequestToFileList(data) {
      return data
        ? data.map((item) => {
            return {
              status: 1,
              progress: 100,
              name: item.fileName,
              response: { message: item.fileUrl },
            }
          })
        : []
    },
    async validateFields() {
      // 获取表单数据
      let logNewData = {}
      let sumLogNewData = { extensionDetail: {} }
      try {
        // 验证采购信息录入表单
        logNewData = await this.$refs.logNewForm.validateFields()
      } catch (e) {
        // 设置错误提示
        if (this.activeKey != 'lognew') this.error.lognew = true
        throw e
      }
      if (this.$refs.sumLogNewForm) {
        try {
          // 验证总结录入表单
          sumLogNewData = await this.$refs.sumLogNewForm.validateFields()
        } catch (e) {
          // 设置错误提示
          if (this.activeKey != 'sumlognew') this.error.sumlognew = true
          throw e
        }
      }

      return {
        extension: {
          ...logNewData.extension,
          ...sumLogNewData.extension,
          unitId: this.$store.state.user.info.departId,
          catalogueId: logNewData.extension.catalogueIds.slice(-1)[0],
        },
        extensionDetail: {
          ...logNewData.extensionDetail,
          ...sumLogNewData.extensionDetail,
          // 处理开始日期 结束日期
          contractStartTime: logNewData.extensionDetail.contractTime[0].format('YYYY-MM-DD HH:mm:ss'),
          contractEndTime: logNewData.extensionDetail.contractTime[1].format('YYYY-MM-DD HH:mm:ss'),
          contractSignTime: logNewData.extensionDetail.contractSignTime.format('YYYY-MM-DD HH:mm:ss'),
          contractFiles: this.formatFileListToRequest(logNewData.extensionDetail.contractFiles),
          applyPhotos: this.formatFileListToRequest(sumLogNewData.extensionDetail.applyPhotos),
          invoiceFiles: this.formatFileListToRequest(logNewData.extensionDetail.invoiceFiles),
          otherFiles: this.formatFileListToRequest(logNewData.extensionDetail.otherFiles),
          summaryFiles: this.formatFileListToRequest(sumLogNewData.extensionDetail.summaryFiles),
        },
      }
    },
    setFieldsValue(data) {
      console.log(data)
      if (data.extension.processStatus == '200' || data.extension.processStatus == '900') {
        this.more = true
      }

      // 回填表单数据
      const tempData = {
        extension: {
          ...data.extension,
          catalogueIds: [...data.extension.catalogueIds],
        },
        extensionDetail: {
          ...data.extensionDetail,
          // 处理文件
          contractFiles: this.formatRequestToFileList(data.extensionDetail.contractFiles),
          applyPhotos: this.formatRequestToFileList(data.extensionDetail.applyPhotos),
          invoiceFiles: this.formatRequestToFileList(data.extensionDetail.invoiceFiles),
          otherFiles: this.formatRequestToFileList(data.extensionDetail.otherFiles),
          summaryFiles: this.formatRequestToFileList(data.extensionDetail.summaryFiles),

          // 处理日期
          contractTime: [moment(data.extensionDetail.contractStartTime), moment(data.extensionDetail.contractEndTime)],
          contractSignTime: moment(data.extensionDetail.contractSignTime),
          // otherFiles: data.summaryFiles.map((item) => {}),
          // invoiceFiles: data.summaryFiles.map((item) => {}),
        },
      }
     setTimeout(()=>{
      this.$refs.logNewForm && this.$refs.logNewForm.setFieldsValue(tempData)
      this.$refs.sumLogNewForm && this.$refs.sumLogNewForm.setFieldsValue(tempData)
     })
    },
  },
}
</script>

<style>
</style>