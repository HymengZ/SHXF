<template>
  <page-header-wrapper show-back>
    <a-card class="top">
      <div class="top-title">
        <div>{{ listData.awardName }}</div>
      </div>
      <div class="top-tag">
        <div class="tags">
          <a-tag color="blue"> {{ listData.awardTypeName }}</a-tag>
          <a-tag color="orange"> {{ listData.year }}年项目 </a-tag>
        </div>
        <div class="status">
          <img
            v-if="activeTab == 1 && ['150', '200'].indexOf(listData.processStatus) != -1"
            src="../../../../../assets/icon_待审核.png"
            alt="状态"
          />
          <img
            v-if="activeTab == 2 && listData.processStatus == '150'"
            src="../../../../../assets/icon_待审核.png"
            alt="状态"
          />
          <img v-if="listData.processStatus == '135'" src="../../../../../assets/icon_待退回.png" alt="状态" />
          <img v-if="listData.processStatus == '100'" src="../../../../../assets/icon_待提交.png" alt="状态" />
          <img
            v-if="listData.processStatus == '200' && activeTab == 2"
            src="../../../../../assets/icon_审核通过.png"
            alt="状态"
          />
          <img v-if="listData.processStatus == '500'" src="../../../../../assets/icon_审核不通过.png" alt="状态" />
          <img v-if="listData.processStatus == '136'" src="../../../../../assets/icon_已退回.png" alt="状态" />
          <img v-if="listData.processStatus == '300'" src="../../../../../assets/icon_审核完成.png" alt="状态" />
          <span v-if="listData.processStatus == '200' && activeTab == 2" class="adopt"
            >审核意见：{{ listData.result }}</span
          >
          <span v-if="listData.processStatus == '500'" class="fail">审核意见：{{ listData.result }}</span>
        </div>
      </div>
      <div class="top-message">
        <div class="top-message-content">
          <div class="text">奖项编号：{{ listData.awardNumber }}</div>
          <div class="text">
            <span
              >上次操作时间：<span v-if="listData.updateTime === null">{{ formatMinute(listData.createTime) }}</span>
              <span v-else>{{ formatMinute(listData.updateTime) }}</span></span
            >
          </div>
          <div class="text">
            当前操作人：<span class="current-name">{{ operationPersonList }}</span>
          </div>
        </div>
        <div class="top-message-btn">
          <a-button v-if="activeTab == 2" type="primary" @click="handleLook">查看项目</a-button>
          <a-button v-if="activeTab == 2" @click="handleRetrun">退回</a-button>
        </div>
      </div>
    </a-card>
    <div class="detail">
      <div class="left">
        <a-card id="basic" title="奖项基本信息"
          ><a-descriptions :column="2" bordered>
            <a-descriptions-item label="创建时间">{{ formatMinute(listData.createTime) }} </a-descriptions-item>
            <a-descriptions-item label="提交时间"
              >{{ listData.submitTime && formatMinute(listData.submitTime) }}
            </a-descriptions-item>
            <a-descriptions-item label="审核时间"
              >{{ listData.auditTime && formatMinute(listData.auditTime) }}
            </a-descriptions-item>
            <a-descriptions-item label="所属年度">{{ listData.year }}年</a-descriptions-item>
            <a-descriptions-item label="成果类型">{{ listData.awardTypeName }} </a-descriptions-item>
            <a-descriptions-item label="是否历史奖项"> {{ ifHistoryData }}</a-descriptions-item>
            <a-descriptions-item label="获奖/申奖单位"> {{ listData.unitName }}</a-descriptions-item>
            <a-descriptions-item label="获奖时间"> {{ listData.awardTime }}</a-descriptions-item>
            <a-descriptions-item label="颁奖单位" :span="2"> {{ listData.awardUnit }}</a-descriptions-item>
            <a-descriptions-item label="关联的科技项目" :span="2"
              >{{ listData.projectReport && listData.projectReport.projectName }}
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
        <a-card class="describe" id="describe" title="奖项描述">
          <div class="_content">
            <div class="title">参奖说明</div>
            <div class="text">
              {{ listData.referenceDescription }}
            </div>
          </div>
          <a-divider />
          <div class="_content">
            <div class="title">评奖说明</div>
            <div class="text">
              {{ listData.awardDescription }}
            </div>
          </div>
        </a-card>
      </div>
      <div class="right">
        <a-anchor @click.prevent="() => {}">
          <a-anchor-link href="#basic" title="奖项基本信息" />
          <a-anchor-link href="#describe" title="奖项描述" />
        </a-anchor>
      </div>
    </div>
  </page-header-wrapper>
</template>
<script>
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
// 引入审核弹窗
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { fetchAwardProjectById, backAwardProject } from '@/api/project/projectAward'
import { formatMinute } from '@/utils/formatDate'
export default {
  components: {
    PageHeaderWrapper,
  },
  data() {
    return {
      // 是否历史奖项
      ifHistoryData: '',
      // 当前操作人
      operationPersonList: '',
      token: '',
      listData: {},
    }
  },
  computed: {
    activeTab() {
      return this.$route.params.type
    },
  },
  created() {
    // 获取token
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.token = token
    // 根据id请求数据
    this.getCurrentData()
  },

  methods: {
    formatMinute,

    async getCurrentData() {
      let currentDataID = this.$route.params.id
      const { success, message, result } = await fetchAwardProjectById(currentDataID)
      if (success) {
        this.listData = result
        if (result.ifHistoryData == '0') {
          this.ifHistoryData = '是'
        } else {
          this.ifHistoryData = '无'
        }
        // 当前操作人
        let operationPersonArray = []
        for (const item of result.projectUserList || []) {
          let operationPerson = item.realName + `【${item.departName}】`

          operationPersonArray.push(operationPerson)
        }
        this.operationPersonList = operationPersonArray.join('、')
      } else {
        this.$message.warning(message)
        return
      }
    },

    // 查看项目
    handleLook() {
      this.$router.push({
        name: 'project-manage-preview-@id-@type',
        params: {
          id: this.listData.projectReport.id,
          type: 2,
        },
      })
    },
    // 退回
    async handleRetrun() {
      const { success, message } = await backAwardProject(this.listData.id)
      if (success) {
        this.getCurrentData()
        this.$message.success(message)
      } else {
        this.$message.warning(message)
      }
    },
  },
}
</script>
<style lang="less" scoped>
// 顶部间距
.top {
  margin-top: 20px;
  background-color: #fff;
  // 标题
  .top-title {
    font-size: 20px;
    font-weight: 500;
    color: #262626;
    line-height: 28px;
    margin-bottom: 8px;
  }
  // 标签
  .top-tag {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    .tags {
      .ant-tag {
        border: none;
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        padding: 0 18px;
      }
    }
    .status {
      margin-left: 24px;
      display: flex;
      align-items: center;
      // 审核通过
      .adopt {
        margin-left: 8px;
        font-size: 14px;
        font-weight: 400;
        color: #8c8c8c;
        line-height: 20px;
      }
      // 审核不通过
      .fail {
        margin-left: 8px;
        font-size: 14px;
        font-weight: 400;
        text-align: left;
        color: #e02020;
        line-height: 20px;
      }
    }
  }

  // 信息
  .top-message {
    display: flex;
    justify-content: space-between;
    &-content {
      .text {
        font-size: 14px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.65);
        line-height: 20px;
        margin-top: 8px;
        .current-name {
          color: #1890ff;
        }
      }
    }
    // 按钮
    &-btn {
      display: flex;
      align-items: flex-end;
      .ant-btn {
        margin-left: 8px;
        font-size: 16px;
        font-weight: 400;
        text-align: left;
        line-height: 25px;
      }
      .btn-black {
        margin-left: 8px;
        font-size: 16px;
        font-weight: 400;
        text-align: left;
        color: rgba(0, 0, 0, 0.85);
        line-height: 25px;
      }
    }
  }
}
.detail {
  display: flex;
  justify-content: space-between;
  .right {
    width: 18%;
    margin-top: 20px;
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
      margin-top: 20px;
      background-color: #fff;
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
    }

    // 奖项描述
    .describe {
      ._content {
        .title {
          font-size: 16px;
          font-weight: 500;
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
  // 描述公共样式
  /deep/ .ant-descriptions {
    .ant-descriptions-item-label {
      width: 16%;
      font-size: 14px;
      font-weight: 400;
      text-align: left;
      color: #8c8c8c;
      line-height: 20px;
    }
    .ant-descriptions-item-content {
      width: 32%;
      font-size: 14px;
      font-weight: 400;
      text-align: left;
      color: rgba(0, 0, 0, 0.65);
      line-height: 20px;
    }
  }
}
</style>
