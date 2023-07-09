<template>
  <div>
    <a-alert message="请认真填写，如已获得此奖项，请选择为历史数据。" style="margin-bottom: 20px" banner />
    <a-form :form="form">
      <a-card title="示范基地基本信息">
        <a-row type="flex" justify="space-between" align="top">
          <a-col :span="11">
            <a-form-item label="单位名称">
              <a-input
                style="display: block"
                disabled
                placeholder="自动读取"
                v-decorator="['unitName', rules.unitName]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="单位编号">
              <a-input v-decorator="['unitCode', rules.unitCode]" disabled placeholder="自动读取"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="示范基地信息发布人">
              <a-input placeholder="" v-decorator="['publishUserId', rules.publishUserId]" disabled> </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="示范基地简介">
              <a-textarea
                placeholder="请输入5000字以内的文字"
                v-decorator="['baseSummary', rules.baseSummary || {}]"
              ></a-textarea>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="是否历史数据">
              <a-radio-group
                name="radioGroup"
                @change="handleIsHistoryChange"
                default-value=""
                v-decorator="['ifHistoryData', rules.ifHistoryData]"
              >
                <a-radio value="1"> 是 </a-radio>
                <a-radio value="0"> 否 </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card title="获取信息" v-if="isHistory == 1">
        <a-row type="flex" justify="space-between" align="top">
          <a-col :span="11">
            <a-form-item label="证书发放时间">
              <a-date-picker
                style="display: block; width: 100%"
                v-decorator="['certificateGrantTime', rules.certificateGrantTime]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="证件照片（附件类型jpg/png，附件大小不超过200KB）">
              <enclosure-uploader
                v-decorator="['certificatePhotoUrl', rules.certificatePhotoUrl]"
                :max="1"
                accept=".jpg,.png,.jpeg"
              >
                <template slot="upload">
                  <div class="uploader-button">
                    <a-icon type="plus" />
                    <div class="ant-upload-text">上传图片</div>
                  </div>
                </template>
                <template slot-scope="{ file, dele }">
                  <div v-for="(item, index) in file" :key="index" class="img-file">
                    <div class="actions">
                      <a-icon type="delete" @click="dele(item)" />
                    </div>
                    <img :src="item.response ? uploadBaseDomain + item.response.message : item.file" alt="" />
                    <div class="progress">
                      <a-progress
                        :strokeWidth="1"
                        :stroke-color="item.status != '2' ? '#1890FF' : '#FF4D4F'"
                        :percent="item.progress"
                        :showInfo="false"
                      />
                    </div>
                  </div>
                </template>
              </enclosure-uploader>
              <!-- <a-upload
                name="avatar"
                list-type="picture-card"
                class="avatar-uploader"
                :show-upload-list="false"
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                :before-upload="beforeUpload"
                @change="handleChange"
                
              >
                <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
                <div v-else>
                  <a-icon :type="loading ? 'loading' : 'plus'" />
                  <div class="ant-upload-text">上传图片</div>
                </div>
              </a-upload> -->
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="宣传视频（附件类型avi/mp4/pva，附件大小不超过30M)">
              <enclosure-uploader
                v-decorator="['propagateVideoUrl', rules.propagateVideoUrl]"
                :max="1"
                :maxFileSize="30"
                accept=".avi,.mp4,.pva"
              >
              </enclosure-uploader>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card title="示范基地介绍">
        <a-form-item>
          <j-editor trigger-change v-decorator="['baseIntroduce', rules.baseIntroduce]" />
        </a-form-item>
      </a-card>
      <a-card title="成果示范情况介绍">
        <a-button style="color: #000; border: 1px solid #cecece; margin-right: 8px" @click="handleDelete()"
          >批量删除</a-button
        >
        <a-button type="primary" icon="plus" @click="addOwn"> 新增成果示范情况介绍 </a-button>
        <a-table
          rowKey="id"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          style="margin-top: 12px"
          :columns="columns"
          :data-source="data"
        >
          <template slot="operation" slot-scope="text, record">
            <a type="link" @click.prevent="handleDet(record)">详情</a>
            <a-divider type="vertical" />
            <a type="link" @click.prevent="updateOwn(record)">编辑</a>
          </template>
        </a-table>
      </a-card>
    </a-form>
    <j-modal
      title="示范情况编辑/新增"
      :visible="articleVisible"
      switchFullscreen
      :fullscreen="true"
      @ok="handleOk"
      okText="保存"
      @cancel="handleCancel"
      cancelText="关闭"
    >
      <look-modal ref="form"></look-modal>
    </j-modal>
  </div>
</template>

<script>
import LookModal from './lookModal'
import EnclosureUploader from '../../../components/EnclosureUploader'
import { isEqual } from 'lodash'
import moment from 'moment'
const columns = [
  {
    title: '序列',
    dataIndex: 'xl',
    align: 'center',
    width: '10%',
    customRender(text, record, index) {
      return index + 1
    },
  },
  {
    title: '成果示范情况介绍标题',
    dataIndex: 'situationSummary',
    width: '50%',
  },
  {
    title: '新建时间',
    dataIndex: 'createTime',
    width: '25%',
  },
  {
    title: '操作',
    align: 'center',
    scopedSlots: { customRender: 'operation' },
  },
]

export default {
  components: {
    LookModal,
    EnclosureUploader,
  },
  name: 'LogModal',
  computed: {
    uploadBaseUrl() {
      return process.env.VUE_APP_UPLOAD_BASE_URL
    },
    uploadBaseDomain() {
      // VUE_APP_UPLOAD_BASE_DOMAIN
      return process.env.VUE_APP_UPLOAD_BASE_DOMAIN
    },
  },
  data() {
    return {
      selectedRowKeys: [],
      rules: {
        unitName: {
          initialValue: this.$store.state.user.info.departName,
          rules: [{ required: true, message: '单位名称不能为空' }],
        },
        unitCode: {
          initialValue: this.$store.state.user.info.orgCode,
          rules: [{ required: true, message: '单位编号不能为空' }],
        },
        certificateGrantTime: { rules: [{ required: true, message: '请选择证书发放时间' }] },
        baseSummary: { rules: [{ required: true, message: '请输入示范基地简介' }] },
        publishUserId: {
          initialValue: this.$store.state.user.info.realname,
          rules: [{ required: true, message: '请输入示范基地简介' }],
        },
        ifHistoryData: { rules: [{ required: true, message: '请选择是否历史数据' }] },
        certificatePhotoUrl: { rules: [{ required: true, message: '请上传证件照片' }] },
        propagateVideoUrl: { rules: [{ required: true, message: '请上传宣传视频' }] },
      },
      data: [],
      articleVisible: false,
      columns,
      form: this.$form.createForm(this, { name: 'coordinated' }),
      validatorRules: {},
      deleteRow: [],
      addRow: [],
      updateRow: [],
      currentModify: {},
      isHistory: 1,
    }
  },
  methods: {
    handleIsHistoryChange(e) {
      console.log(e.target.value)
      this.isHistory = e.target.value
    },
    //跳详情
    handleDet() {
      this.$router.push(`/outcome/demonstration/details`)
    },
    handleDelete() {
      this.data = this.data.filter((item) => {
        return !this.selectedRowKeys.includes(item.id)
      })
    },
    onSelectChange(e) {
      this.selectedRowKeys = e
    },
    onChange(e) {
      console.log(e)
    },
    //新增示范情况简介
    addOwn(record) {
      this.currentModify = {}
      this.articleVisible = true
    },
    updateOwn(record) {
      this.articleVisible = true
      setTimeout(() => {
        this.currentModify = record
        this.$refs.form.setFieldsValue(record)
      })
    },
    //确认保存编辑页面
    handleOk() {
      this.$refs.form.validateFields().then((val) => {
        if (this.currentModify.id) {
          this.data = this.data.map((item) => {
            console.log(item, val)
            return item.id == this.currentModify.id ? { ...this.currentModify, ...val } : item
          })
          console.log(this.data)
        } else {
          this.data = [
            ...this.data,
            {
              id: -(new Date() - 0),
              ...val,
            },
          ]
        }

        this.articleVisible = false
      })
    },
    //取消编辑页面
    handleCancel() {
      this.articleVisible = false
    },
    validateFields() {
      return this.form.validateFields().then((val) => {
        console.log(this.data)
        return {
          ...val,
          certificatePhotoUrl: val.certificatePhotoUrl ? val.certificatePhotoUrl[0].response.message : '',
          propagateVideoName: val.propagateVideoUrl ? val.propagateVideoUrl[0].name : '',
          propagateVideoUrl: val.propagateVideoUrl ? val.propagateVideoUrl[0].response.message : '',
          publishUserId: this.$store.state.user.info.id,
          certificateGrantTime: moment(val.certificateGrantTime).format('YYYY-MM-DD HH:mm:ss'),
          data: this.data,
        }
      })
    },
    setFieldsValue(data) {
      console.log(data)
      this.data = data.data || []
      setTimeout(() => {
        this.form.setFieldsValue({
          ...data,
          certificatePhotoUrl: [
            {
              id: (new Date() - 0).toString(),
              progress: 100,
              status: 1,
              response: { message: data.certificatePhotoUrl },
              name: data.certificatePhotoUrl.split('/').slice(-1)[0],
            },
          ],
          propagateVideoName: data.propagateVideoName,
          propagateVideoUrl: [
            {
              id: (new Date() - 0).toString(),
              progress: 100,
              status: 1,
              response: { message: data.propagateVideoUrl },
              name: data.propagateVideoName,
            },
          ],
          publishUserId: data.publishUserId,
          data: this.data,
        })
      })
    },
  },
}
</script>

<style lang="less" scoped>
.uploader-button {
  width: 100px;
  height: 100px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  background-color: #fafafa;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
}
.img-file {
  position: relative;
  width: 100px;
  height: 100px;
  cursor: pointer;
  border-radius: 4px;
  overflow: hidden;
  &:hover {
    .actions {
      display: flex;
    }
  }
  .actions {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    color: #f5f5f5;
    font-size: 18px;
    cursor: pointer;

    align-items: center;
    justify-content: center;
    display: none;
  }
  img {
    width: 100px;
    height: 100px;
  }
  .progress {
    position: absolute;
    width: 100%;
    bottom: -7px;
    left: 0;
  }
}

/deep/ .ant-card {
  margin-bottom: 10px;
  .ant-card-head {
    background: #fafafa;
  }
}
</style>