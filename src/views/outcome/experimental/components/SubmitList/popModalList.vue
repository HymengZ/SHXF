<template>
  <div>
    <a-alert banner>
      <div slot="message">
        1、如录入历史数据，新增时可以直接两个标签同步编辑，保存后一并提交，审核人员审核通过后发布入库； <br />
        2、总结待提交状态中，可修改总结内容，已提交的领用申请无法修改，如需修改/删除请进行申请退回操作。。
      </div>
    </a-alert>
    <a-tabs :active-key="activeKey" @change="handleTableChange">
      <a-tab-pane key="lognew" forceRender>
        <span slot="tab">
          领用申请录入
          <a-icon type="exclamation-circle" v-if="error.lognew" style="color: red" />
        </span>
        <log-new
          :equipmentRangeData="equipmentRangeData"
          ref="logNewForm"
          @fieldsValueChange="handleLogNewFormChange"
        />
      </a-tab-pane>
      <a-tab-pane key="sumlognew" forceRender v-if="more">
        <span slot="tab">
          总结录入
          <a-icon type="exclamation-circle" v-if="error.sumlognew" style="color: red" />
        </span>
        <sum-log-new ref="sumLogNewForm" :logNewFormData="logNewFormData" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { dictItem } from '../../../../../api/outcome/catalog'
import LogNew from './logNew'
import moment from 'moment'
import SumLogNew from './sumLogNew'

export default {
  components: {
    LogNew,
    SumLogNew,
  },
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
  props: ['equipmentRangeData'],
  mounted() {},
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
      let sumLogNewData = {  pilot: {}, pilotDetail: {}}
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
        pilot: {
          ...logNewData.pilot,
          ...sumLogNewData.pilot,
          unitId: this.$store.state.user.info.departId,
          catalogueId: logNewData.pilot.catalogueIds.slice(-1)[0],
        },
        pilotDetail: {
          ...logNewData.pilotDetail,
          ...sumLogNewData.pilotDetail,
          //开始时间和结束时间
          applicationStartTime:
            sumLogNewData.pilotDetail.applicationStartTime && sumLogNewData.pilotDetail.applicationStartTime.length > 0
              ? sumLogNewData.pilotDetail.applicationStartTime[0].format('YYYY-MM-DD HH:mm:ss')
              : null,
          applicationEndTime:
            sumLogNewData.pilotDetail.applicationStartTime && sumLogNewData.pilotDetail.applicationStartTime.length > 1
              ? sumLogNewData.pilotDetail.applicationStartTime[1].format('YYYY-MM-DD HH:mm:ss')
              : null,
          consumingFiles: this.formatFileListToRequest(logNewData.pilotDetail.consumingFiles),
          applyPhotos: this.formatFileListToRequest(sumLogNewData.pilotDetail.applyPhotos),
          summaryFiles: this.formatFileListToRequest(sumLogNewData.pilotDetail.summaryFiles),
        },
      }
    },
    setFieldsValue(data) {
      console.log(data)
      if (data.pilot.processStatus == '200' || data.pilot.processStatus == '900') {
        this.more = true
      }

      // 回填表单数据
      const tempData = {
        pilot: {
          ...data.pilot,
          catalogueIds: [...data.pilot.catalogueIds],
        },
        pilotDetail: {
          ...data.pilotDetail,
          // 处理文件
          consumingFiles: this.formatRequestToFileList(data.pilotDetail.consumingFiles),
          applyPhotos: this.formatRequestToFileList(data.pilotDetail.applyPhotos),
          summaryFiles: this.formatRequestToFileList(data.pilotDetail.summaryFiles),
          // 处理日期
          applicationStartTime: [moment(data.pilot.applicationStartTime), moment(data.pilot.applicationEndTime)],
          // otherFiles: data.summaryFiles.map((item) => {}) ,
          // invoiceFiles: data.summaryFiles.map((item) => {}) ,
        },
      }

      setTimeout(() => {
        this.$refs.logNewForm && this.$refs.logNewForm.setFieldsValue(tempData)
        this.$refs.sumLogNewForm && this.$refs.sumLogNewForm.setFieldsValue(tempData)
      })
    },
  },
}
</script>

<style>
</style>