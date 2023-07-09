<template>
  <div class="stage-check-detail">
    <div class="left">
      <a-card id="stage" title="阶段检查信息">
        <div class="stage-check-table">
          <a-table
            rowKey="id"
            :columns="stageColumns"
            :data-source="listData.stageCheckList"
            :pagination="false"
            bordered
          >
            <template slot="uploadEndTime" slot-scope="text, record">
              <div>{{ formatDay(record.uploadEndTime) }}</div>
            </template>
            <template slot="attachmentStatus" slot-scope="text, record">
              <div class="attachment-status">
                <div class="finish" v-if="record.attachmentStatus == 0">已完成</div>
                <div class="incomplete" v-if="record.attachmentStatus == 1">未完成</div>
              </div>
            </template>
            <template slot="submitTime" slot-scope="text, record">
              <span v-if="record.stageCheckUploads">{{ formatMinute(record.stageCheckUploads.createTime) }}</span>
            </template>
            <template slot="stageCheckUploads" slot-scope="text, record">
              <div v-if="record.stageCheckUploads" class="attachment" @click="openFile(record.stageCheckUploads)">
                <a-icon type="paper-clip" /> <span>{{ record.stageCheckUploads.fileName }}</span>
              </div>
            </template>
          </a-table>
        </div>
      </a-card>
    </div>
    <div class="right">
      <a-anchor @click.prevent="() => {}">
        <a-anchor-link href="#stage" title="阶段检查信息" />
      </a-anchor>
    </div>
  </div>
</template>
<script>
import { formatMinute, formatDay } from '@/utils/formatDate'
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
      //   列
      stageColumns: [
        {
          title: '序号',
          dataIndex: 'orderIndex',
          key: 'orderIndex',
          width: '10%',
          align: 'center',
        },
        {
          title: '名称',
          dataIndex: 'configName',
          key: 'configName',
          align: 'center',
          width: '15%',
        },
        {
          title: '提交截止时间',
          dataIndex: 'uploadEndTime',
          align: 'center',
          key: 'uploadEndTime',
          scopedSlots: { customRender: 'uploadEndTime' },
          width: '20%',
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
          title: '提交时间',
          dataIndex: 'submitTime',
          align: 'center',
          key: 'submitTime',
          scopedSlots: { customRender: 'submitTime' },
          width: '20%',
        },
        {
          title: '附件',
          dataIndex: 'stageCheckUploads',
          align: 'center',
          key: 'stageCheckUploads',
          scopedSlots: { customRender: 'stageCheckUploads' },
        },
      ],
    }
  },

  methods: {
    formatMinute,
    formatDay,
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
      .stage-check-table {
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
          cursor: pointer;
          span {
            margin-left: 8px;
            color: #1890ff;
          }
        }
      }
    }
  }
}
</style>
