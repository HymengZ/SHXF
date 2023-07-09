<template>
  <div>
    <div class="tips">
      <a-alert banner>
        <div slot="message" class="message">
          1、最新已开放提交节点报告，请在提交截止时间<span style="color: red"></span> 之前上传资料；<br />
          2、上传附件类型.pdf，附件大小不超过5M，只需上传1份，报告上传后修改请联系平台。
        </div>
      </a-alert>
    </div>
    <input type="file" style="display: none" ref="uploader" @change="handleFileUpload" accept="application/pdf" />
    <a-form :form="form">
      <a-table :columns="columns" :data-source="list" bordered :pagination="false"  rowKey="id">
        <template slot="processStatus" slot-scope="text, record">
          <a-badge color="green" text="已上传" v-if="record.fileName" />
          <a-badge color="yellow" text="未上传" v-else />
        </template>
        <template slot="noteName" slot-scope="text">
          <div>
            <a>{{ text || '-' }}</a>
          </div>
        </template>
        <template slot="fileName" slot-scope="text, record">
          <div v-if="text">
            <a-icon
              type="paper-clip"
              style="color: #1890ff; font-size: 15px; vertical-align: -3px; margin-right: 10px"
            />
            <a :href="uploadBaseDomain + record.fileUrl" style="color: #1890ff" target="_blank">{{ text }}</a>
          </div>
          <div v-else>-</div>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-button @click="upLook(record)" style="color: #1890ff; border: none" v-if="!record.fileName" ><span>上传附件</span></a-button>
          <div v-else>-</div>
        </template>
      </a-table>
    </a-form>
  </div>
</template>

<script>
// export default {
//   name: 'NodeConfiguration',
//   data() {
//     return {
//       personnelColumns: personnelColumns,
//       form: this.$form.createForm(this, { name: 'coordinated' }),
//       validatorRules: {},
//     }
//   },
//   methods: {
//     onChange(e) {
//       console.log(e)
//     },
//   },
// }
import { upload } from '../../../../../api/outcome/upload'
import { uploadNoteReport } from '../../../../../api/outcome/catalog'
import moment from 'moment'
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
  {
    title: '操作',
    align: 'center',
    scopedSlots: { customRender: 'operation' },
  },
]

const data = [
  {
    fj: '',
  },
]

export default {
  data() {
    this.cacheData = data.map((item) => ({ ...item }))
    return {
      data,
      columns,
      upSubLook: {},
      list: [],
      form: this.$form.createForm(this, {
        name: 'coordinated',
      }),
    }
  },
  props: ['currentModify'],
  computed: {
    uploadBaseUrl() {
      return process.env.VUE_APP_UPLOAD_BASE_URL
    },
    uploadBaseDomain() {
      // VUE_APP_UPLOAD_BASE_DOMAIN
      return process.env.VUE_APP_UPLOAD_BASE_DOMAIN
    },
  },
  methods: {
    upLook(record) {
      var uploadEndTime = new Date(record.uploadEndTime)
      var today = new Date()
      if (today > uploadEndTime) {
         this.$message.error('已超过上传截止时间，无法上传！')
         return
      }
      this.upSubLook = record
      this.$refs.uploader.click()
    },
    setFieldsValue(data) {
      this.list = data
    },
    async validateFields() {
      return this.list
    },
 resetFields() {
      this.form.resetFields()
    },
    async handleFileUpload(e) {
      const file = e.target.files[0]
      e.target.value = ''
      if (file.size / 1024 / 1024 > 5 || !file.name.endsWith('.pdf')) {
        this.$message.error('上传附件类型.pdf，附件大小不超过5M')
        return
      }
      const data = new FormData()
      data.append('file', file)
      data.append('biz', 'node')
      const res = await upload(data)

      this.list = this.list.map((item) => {
        if (item.id === this.upSubLook.id) {
          return {
            ...item,
            fileName: file.name,
            fileUrl: `/api/sys/common/static/${res.message}`,
            uploadBy: this.$store.state.user.info.realname,
            uploadTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          }
        }
        return item
      })
    },
  },
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