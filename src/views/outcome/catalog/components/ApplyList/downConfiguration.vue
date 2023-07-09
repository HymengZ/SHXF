<template>
  <div>
    <div class="tips">
      <a-alert banner>
        <div slot="message" class="message">
          1、只能下载对方已上传的节点报告，点击附件链接即可下载；
          <br/>
          2、注意节点报告提交截止时间，请及时通知联系人上传。
        </div>
      </a-alert>
    </div>
    <input type="file" style="display:none" ref="uploader">
    <a-form :form="form">
      <a-table :columns="columns" :data-source="currentModify.noteReportConfig" bordered :pagination="false" rowKey="id">
        <template slot="jdbg" slot-scope="text">
          <div>
            <a @click.prevent="">{{ text }}</a>
          </div>
        </template>
        <template slot="processStatus" slot-scope="text, record">
          <a-badge color="green" text="已上传" v-if="record.fileName" />
          <a-badge color="yellow" text="未上传" v-else />
        </template>
        <template slot="fileName" slot-scope="text, record">
          <div v-if="text">
            <a-icon
              type="paper-clip"
              style="color: #1890ff; font-size: 15px; vertical-align: -3px; margin-right: 10px"
            />
            <a :href="uploadBaseDomain + record.fileUrl" :download="record.fileName" style="color: #1890ff" target="_blank">{{ text }}</a>
          </div>
          <div v-else>-</div>
        </template>
        <!-- <template slot="operation" slot-scope="text, record">
        <span @click="upLook(record)" style="color: #1890ff">上传附件</span>
      </template> -->
      </a-table>
      
    </a-form>
  </div>
</template>

<script>
const columns = [
  {
    title: '序号',
    dataIndex: 'serial',
    width: '9%',
    align: 'center',
    customRender: (text, record, index) => index + 1,
  },
  {
    title: '节点名称',
    dataIndex: 'noteName',
    width: '18%',
    align: 'center',
    scopedSlots: { customRender: 'noteName' },
  },
  {
    title: '提交截止时间',
    dataIndex: 'uploadEndTime',
    width: '18%',
    align: 'center',
    scopedSlots: { customRender: 'uploadEndTime' },
  },
  {
    title: '报告状态',
    dataIndex: 'processStatus',
    width: '15%',
    align: 'center',
    scopedSlots: { customRender: 'processStatus' },
  },
  {
    title: '附件',
    dataIndex: 'fileName',
    width: '30%',
    align: 'center',
    scopedSlots: { customRender: 'fileName' },
  },
  
]


export default {
  data() {
    return {
      
      columns,
      form: this.$form.createForm(this, { name: 'coordinated' }),
      upSubLook:{}
    }
  },  
  computed: {
    uploadBaseDomain() {
      // VUE_APP_UPLOAD_BASE_DOMAIN
      return process.env.VUE_APP_UPLOAD_BASE_DOMAIN
    },
  },
  props: ['currentModify'],
  methods:{
    validateFields() {
      return this.form.validateFields()
    },
    }
  }

</script>

<style lang="less" scoped >
.tips {
  margin-bottom: 16px;
  .message {
    width: 1000px;
    height: 44px;
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: rgba(0, 0, 0, 0.65);
    line-height: 22px;
  }
}
</style>