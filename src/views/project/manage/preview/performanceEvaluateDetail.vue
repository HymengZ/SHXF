<template>
  <div class="stage-check-detail">
    <div class="left">
      <a-card id="message" title="绩效评价信息">
        <div class="evaluate-table">
          <a-table rowKey="id" :columns="evaluateColumns" :data-source="evaluateData" :pagination="false" bordered>
            <template slot="status" slot-scope="text, record">
              <div class="attachment-status">
                <div class="finish" v-if="record.status == 0">已完成</div>
                <div class="incomplete" v-if="record.status == 1">未完成</div>
              </div>
            </template>
            <template slot="attachment" slot-scope="text, record">
              <div class="attachment" v-for="item in record.attachment" :key="item.id" @click="openFile(item)">
                <a-icon type="paper-clip" /> <span>{{ item.fileName }}.{{ item.fileSuffix }}</span>
              </div>
            </template>
          </a-table>
        </div>
      </a-card>
      <a-card id="explain" title="项目验收说明">
        <div class="explain">
          <div class="benefit _content">
            <div class="title">项目取得的主要成果及效益</div>
            <div class="text" v-if="listData.evaluation">{{ listData.evaluation.mainAchievement }}</div>
          </div>
          <a-divider />
          <div class="check _content">
            <div class="title">项目验收说明</div>
            <div class="text" v-if="listData.evaluation">{{ listData.evaluation.acceptanceSpecification }}</div>
          </div>
        </div>
      </a-card>
    </div>
    <div class="right">
      <a-anchor @click.prevent="() => {}">
        <a-anchor-link href="#message" title="绩效评价信息" />
        <a-anchor-link href="#explain" title="项目验收说明" />
      </a-anchor>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  props: {
    listData: {
      type: Object,
      default: () => {},
    },
    token: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      evaluateData: [],
      //   列
      evaluateColumns: [
        {
          title: '序号',
          dataIndex: 'orderIndex',
          key: 'orderIndex',
          width: '10%',
          align: 'center',
        },
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
          align: 'center',
          width: '15%',
        },
        {
          title: '提交截止时间',
          dataIndex: 'submitEndTime',
          align: 'center',
          key: 'submitEndTime',
          width: '20%',
        },
        {
          title: '状态',
          dataIndex: 'status',
          align: 'center',
          key: 'status',
          scopedSlots: { customRender: 'status' },
          width: '12%',
        },
        {
          title: '提交时间',
          dataIndex: 'submitTime',
          align: 'center',
          key: 'submitTime',
          scopedSlots: { customRender: 'submitTime' },
          width: '20%',
        },
        {
          title: '附件',
          dataIndex: 'attachment',
          align: 'center',
          key: 'attachment',
          scopedSlots: { customRender: 'attachment' },
        },
      ],
    }
  },
  mounted() {
    // 初始化表格数据
    if (this.listData.evaluation) {
      this.initializeData()
    }
  },
  computed: {
    enterTime() {
      if (this.listData.performanceEndTime) {
        let date = new Date(this.listData.performanceEndTime)
        return moment(date).format('YYYY-MM-DD HH:mm')
      } else {
        return ''
      }
    },
    submitTime() {
      let date = ''
      if (this.listData.evaluation) {
        date = new Date(this.listData.evaluation.createTime)
      }
      return moment(date).format('YYYY-MM-DD HH:mm')
    },
  },
  methods: {
    initializeData() {
      let obj = {
        key: 1,
        orderIndex: 1,
        name: '绩效评价',
        submitEndTime: this.enterTime,
        status: this.listData.evaluation && this.listData.evaluation.attachmentStatus == '0' ? 0 : 1,
        submitTime: this.submitTime,
        attachment: this.listData.evaluation.evaluationUploads,
      }
      this.evaluateData.push(obj)
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
.stage-check-detail {
  display: flex;
  justify-content: space-between;
  .right {
    width: 18%;
    // 锚点
    .ant-anchor-link {
      font-size: 14px;
      font-weight: 400;
      text-align: left;
      color: rgba(0, 0, 0, 0.65);
      line-height: 22px;
    }
  }
  .left {
    width: 80%;
    /deep/ .ant-card {
      background-color: #fff;
      margin-bottom: 20px;
      .ant-card-head {
        // 标题前面icon
        .ant-card-head-title {
          font-size: 16px;
          font-weight: 500;
          text-align: left;
          color: #1890ff;
          line-height: 16px;
        }
        .ant-card-head-title::before {
          content: '';
          width: 4px;
          height: 16px;
          background: #1890ff;
          display: inline-block;
          position: absolute;
          top: 17px;
          left: 16px;
        }
      }
      .evaluate-table {
        margin-top: 15px;
        // 表头
        .ant-table-column-title {
          font-size: 14px;
          font-weight: 600;
          color: rgba(0, 0, 0, 0.85);
          line-height: 22px;
        }
        // 附件
        .attachment {
          text-align: left;
          margin: 3px 0;
          cursor: pointer;
          span {
            margin-left: 8px;
            color: #1890ff;
          }
        }
      }
      //   项目验收说明
      .explain {
        ._content {
          .title {
            font-size: 16px;
            font-weight: 600;
            text-align: left;
            color: #595959;
            line-height: 16px;
            margin-bottom: 9px;
          }
          .text {
            font-size: 14px;
            font-weight: 400;
            text-align: left;
            color: #595959;
            line-height: 28px;
          }
        }
        .ant-divider {
          margin: 16px 0;
        }
      }
    }
  }
}
</style>
