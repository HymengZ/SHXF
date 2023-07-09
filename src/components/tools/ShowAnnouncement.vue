<template>
  <j-modal
    :title="title"
    :width="modelStyle.width"
    :visible="visible"
    :bodyStyle ="bodyStyle"
    :switchFullscreen="switchFullscreen"
    @cancel="handleCancel"
   >
    <template slot="footer">
      <a-button key="back" @click="handleCancel">关闭</a-button>
      <a-button type="primary" @click="handleOk(record)">确认</a-button>
    </template>
    <a-card class="daily-article" :loading="loading">
      <p>消息来源：{{ record.msgFrom }}</p>
      <p>发送时间：{{ record.sendTime }}</p>
      <p v-html="record.msgContent" class="article-content"></p>
    </a-card>
  </j-modal>
</template>

<script>
import {getUserList} from '@/api/api'
import {putAction} from '@/api/manage'

export default {
  name: "SysAnnouncementModal",
  components: {},
  props: {
    projectMsgFromList: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      title: "通知消息",
      record: {},
      labelCol: {
        xs: {span: 24},
        sm: {span: 5},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
      visible: false,
      switchFullscreen: true,
      loading: false,
      bodyStyle: {
        padding: "0",
        "overflow-y": "auto",

      },
      modelStyle: {
        width: '60%',
        style: {top: '20px'},
        fullScreen: false
      }
    }
  },
  created() {
  },
  computed: {
  },
  methods: {
    detail(record) {
      this.visible = true;
      this.record = record;
    },
    handleCancel() {
      this.visible = false;
    },
    /** 切换全屏显示 */
    handleClickToggleFullScreen() {
      let mode = !this.modelStyle.fullScreen
      if (mode) {
        this.modelStyle.width = '100%'
        this.modelStyle.style.top = '20px'
      } else {
        this.modelStyle.width = '60%'
        this.modelStyle.style.top = '50px'
      }
      this.modelStyle.fullScreen = mode
    },
    handleOk(record) {
      console.log("record", record)
      putAction("sys/sysAnnouncementSend/editByAnntIdAndUserId", {anntId: record.anntId || record.id}).then((res) => {
        if (!res.success) {
          this.$message.error(res.message);
          return;
        }
        this.$emit('reloadList');
        this.visible = false;
      });
    },
  }
}
</script>

<style lang="less">
  .announcementCustomModal{
    .ant-modal-header {
      border: none;
      display: inline-block;
      position: absolute;
      z-index: 1;
      right: 56px;
      padding: 0;
      .ant-modal-title{
        .custom-btn{
          width: 56px;
          height: 56px;
          border: none;
          box-shadow: none;
        }
      }
    }
    .daily-article{
      border-bottom: 0;
    }
  }
</style>
<style scoped lang="less">
  .daily-article {
    .article-button {
      font-size: 1.2rem !important;
    }
    .ant-card-body {
      padding: 18px !important;
    }
    .ant-card-head {
      padding: 0 1rem;
    }
    .ant-card-meta {
      margin-bottom: 1rem;
    }
    .article-content {
      p {
        word-wrap: break-word;
        word-break: break-all;
        text-overflow: initial;
        white-space: normal;
        font-size: .9rem !important;
        margin-bottom: .8rem;
      }
    }
  }
</style>
