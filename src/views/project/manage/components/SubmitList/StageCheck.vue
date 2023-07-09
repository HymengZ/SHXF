<template>
  <div class="stage-check">
    <div class="stage-check-tips">
      <a-alert banner>
        <div slot="message" class="message">
          1、阶段检查录入需项目信息录入时选择项目有阶段检查才可录入，截止时间如需修改，请前往项目信息中修改；
          <br />
          2、上传附件类型仅支持类型pdf、doc、xls、wpd，大小不超过30M，只需上传1份，提交后如需修改请申请退回。
        </div>
      </a-alert>
    </div>
    <div class="stage-check-table">
      <a-table rowKey="id" :columns="stageColumns" :data-source="stageList" :pagination="false" bordered>
        <template slot="uploadEndTime" slot-scope="text, record">
          <div>{{ formatDay(record.uploadEndTime) }}</div>
        </template>
        <template slot="attachmentStatus" slot-scope="text, record">
          <div class="attachment-status">
            <div class="finish" v-if="record.attachmentStatus == 0">已上传</div>
            <div class="incomplete" v-if="record.attachmentStatus == 1">待上传</div>
          </div>
        </template>
        <template slot="stageCheckUploads" slot-scope="text, record">
          <div v-if="record.stageCheckUploads" class="name" @click="openFile(record.stageCheckUploads)">
            <a-icon type="paper-clip" /> <span>{{ record.stageCheckUploads.fileName }}</span>
          </div>
        </template>
        <template slot="action" slot-scope="text, record">
          <div v-if="!record.stageCheckUploads">
            <StageUpload
              :typeList="'pdf'"
              :amount="10"
              :isLt1M="30"
              :uploadType="'阶段检查录入'"
              :contentId="editData.id"
              :recordId="record.id"
              :stageList="stageList"
              @changeList="changeList"
            />
          </div>
          <div v-else>--</div>
        </template>
      </a-table>
    </div>
  </div>
</template>
<script>
import { formatDay } from '@/utils/formatDate'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import StageUpload from '@/views/project/manage/components/uploadFile/stageUpload'
export default {
  components: { StageUpload },
  props: {
    // 编辑数据
    editData: {
      type: Object,
      default: '',
      required: false,
    },
  },
  data() {
    return {
      token: '',
      // 表格数据
      stageList: [],
      //   列
      stageColumns: [
        {
          title: '序号',
          dataIndex: 'orderIndex',
          key: 'orderIndex',
          width: '6%',
          align: 'center',
        },
        {
          title: '名称',
          dataIndex: 'configName',
          key: 'configName',
          align: 'center',
          width: '22%',
        },
        {
          title: '提交截止时间',
          dataIndex: 'uploadEndTime',
          align: 'center',
          scopedSlots: { customRender: 'uploadEndTime' },
          key: 'uploadEndTime',
          width: '25%',
        },
        {
          title: '状态',
          dataIndex: 'attachmentStatus',
          align: 'center',
          key: 'attachmentStatus',
          scopedSlots: { customRender: 'attachmentStatus' },
          width: '12%',
        },
        {
          title: '附件',
          dataIndex: 'stageCheckUploads',
          align: 'center',
          key: 'stageCheckUploads',
          scopedSlots: { customRender: 'stageCheckUploads' },
          width: '28%',
        },
        {
          title: '操作',
          align: 'center',
          key: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
    }
  },
  created() {
    // 获取token
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.token = token
    this.stageList = this.editData.stageCheckList
  },
  methods: {
    formatDay,
    changeList(e) {
      this.stageList = e
    },
    hanldeSubmit() {
      return this.stageList
    },
    //打开附件
    openFile(data) {
      window.open(`https://shfar.cwit.com.cn/api/${data.fileUrl}?token=${this.token}`)
    },
  },
}
</script>
<style lang="less" scoped>
@import '~@/assets/less/project';
.stage-check {
  &-tips {
    // 提示
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
  /deep/ &-table {
    margin-top: 15px;
    // 表头
    .ant-table-column-title {
      font-size: 14px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
      line-height: 22px;
    }
    // 附件
    .name {
      cursor: pointer;
      span {
        margin-left: 8px;
        color: #1890ff;
      }
    }
  }
}
</style>
