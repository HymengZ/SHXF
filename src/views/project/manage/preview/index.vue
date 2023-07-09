<template>
  <page-header-wrapper show-back>
    <a-card class="top">
      <div class="top-title">
        <div>{{ listData.projectName }}</div>
      </div>
      <div class="top-tag">
        <div class="tags">
          <a-tag color="blue"> {{ projectCategory }}</a-tag>

          <a-tag color="orange"> {{ listData.ownershipYear }}年项目 </a-tag>
          <a-tag color="green"> {{ projectOwnership }} </a-tag>
        </div>
        <div class="status">
          <img
            v-if="listData.processStatus == '150' && activeTab == 2"
            src="../../../../assets/icon_待审核.png"
            alt="状态"
          />
          <img
            v-if="['150', '400'].indexOf(listData.processStatus) != -1 && activeTab == 1"
            src="../../../../assets/icon_待审核.png"
            alt="状态"
          />
          <img v-if="listData.processStatus == '135'" src="../../../../assets/icon_待退回.png" alt="状态" />
          <img v-if="listData.processStatus == '100'" src="../../../../assets/icon_待提交.png" alt="状态" />
          <img
            v-if="listData.processStatus == '400' && activeTab == 2"
            src="../../../../assets/icon_审核通过.png"
            alt="状态"
          />
          <img v-if="listData.processStatus == '140'" src="../../../../assets/icon_审核不通过.png" alt="状态" />
          <img v-if="listData.processStatus == '136'" src="../../../../assets/icon_已退回.png" alt="状态" />
          <img v-if="listData.processStatus == '450'" src="../../../../assets/icon_验收完成.png" />
          <img v-if="listData.processStatus == '950'" src="../../../../assets/icon_项目终止.png" />
          <span v-if="listData.processStatus == '400' && activeTab == 2" class="adopt"
            >审核意见：{{ listData.result }}</span
          >
          <span v-if="listData.processStatus == '140'" class="fail">审核意见：{{ listData.result }}</span>
        </div>
      </div>
      <div class="top-message">
        <div class="top-message-content">
          <div class="text">项目编号：{{ listData.projectNumber }}</div>
          <div class="text">
            <span
              >上次操作时间：<span v-if="listData.updateTime === null">{{ formatMinute(listData.createTime) }}</span>
              <span v-else>{{ formatMinute(listData.updateTime) }}</span></span
            >
          </div>
          <div class="text">
            当前操作人：<span class="blue-color">{{ operationPersonList }}</span>
          </div>
          <ProcessLine />
        </div>
        <div class="top-message-back">
          <div class="stage">
            <div class="text">
              项目信息：<img
                v-if="listData.projectInformation && listData.projectInformation.attachmentStatus == '0'"
                src="../../../../assets/icon_已完成.png"
                alt="已完成"
              />
              <img v-else src="../../../../assets/icon_未完成.png" alt="未完成" />
            </div>
            <div v-if="listData.stageCheckList">
              <div class="text" v-for="item in listData.stageCheckList" :key="item.id">
                {{ item.configName }}：
                <img v-if="item.attachmentStatus == '0'" src="../../../../assets/icon_已完成.png" alt="已完成" />
                <img v-else src="../../../../assets/icon_未完成.png" alt="未完成" />
              </div>
            </div>
            <div class="text">
              绩效评价：<img
                v-if="listData.evaluation && listData.evaluation.attachmentStatus == '0'"
                src="../../../../assets/icon_已完成.png"
                alt="已完成"
              />
              <img v-else src="../../../../assets/icon_未完成.png" alt="未完成" />
            </div>
            <div class="endTime">最新截止时间：<span>--</span></div>
          </div>
          <div>
            <a-button
              :disabled="['136', '135', '100', '450', '950', '140'].indexOf(listData.processStatus) != -1"
              @click="applyBack"
              v-if="activeTab == 1"
              v-has="'manageSubmit:applyReturn'"
              >申请退回</a-button
            >
          </div>
        </div>
      </div>
    </a-card>
    <div class="tab-menu">
      <div
        :class="selected == '1' ? 'tab-menu-item-select' : 'tab-menu-item'"
        @click="switchTab('1', 'projectMessageDetail')"
      >
        <img v-if="selected == '1'" src="../../../../assets/icon_项目信息_select.svg" />
        <img v-else src="../../../../assets/icon_项目信息.svg" />

        <span>项目信息</span>
      </div>
      <div
        :class="selected == '2' ? 'tab-menu-item-select' : 'tab-menu-item'"
        @click="switchTab('2', 'stageCheckDetail')"
      >
        <img v-if="selected == '2'" src="../../../../assets/icon_阶段检查_select.svg" />
        <img v-else src="../../../../assets/icon_阶段检查.svg" />
        <span>阶段检查</span>
      </div>
      <div
        :class="selected == '3' ? 'tab-menu-item-select' : 'tab-menu-item'"
        @click="switchTab('3', 'performanceEvaluateDetail')"
      >
        <img v-if="selected == '3'" src="../../../../assets/icon_绩效评价_select.svg" />
        <img v-else src="../../../../assets/icon_绩效评价.svg" />
        <span>绩效评价</span>
      </div>
    </div>
    <component
      :is="menuComponent"
      :listData="listData"
      :token="token"
      :projectOwnership="projectOwnership"
      :projectCategory="projectCategory"
    ></component>
  </page-header-wrapper>
</template>
<script>
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import { getAction, postAction } from '@/api/manage.js'
import ProcessLine from '../components/ProcessLine'
// 引入三个菜单对应页面
import projectMessageDetail from './projectMessageDetail.vue'
import stageCheckDetail from './stageCheckDetail'
import performanceEvaluateDetail from './performanceEvaluateDetail'

import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { formatMinute } from '@/utils/formatDate'
export default {
  components: {
    PageHeaderWrapper,
    ProcessLine,
    projectMessageDetail,
    stageCheckDetail,
    performanceEvaluateDetail,
  },
  data() {
    return {
      // 当前操作人
      operationPersonList: '',
      // 项目所属
      projectOwnership: '',
      // 项目类型
      projectCategory: '',
      // token
      token: '',
      // 数据
      listData: {},
      // 是否选中
      selected: '1',
      menuComponent: 'projectMessageDetail',
      url: {
        currentData: '/fire/projectReport/queryById',
        applyBackProjectReport: '/fire/projectReport/applyBackProjectReport',
        // 数据字典接口
        listByDictCode: '/sys/dictItem/listByDictCode',
      },
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
    let currentDataID = this.$route.params.id
    // 根据id请求数据
    this.getCurrentData(currentDataID)
  },
  methods: {
    formatMinute,
    // 阻止默认事件
    handleEvent(e) {
      e.preventDefault()
    },
    // 切换菜单
    switchTab(current, name) {
      this.selected = current
      switch (name) {
        case 'projectMessageDetail':
          this.menuComponent = projectMessageDetail
          break
        case 'stageCheckDetail':
          this.menuComponent = stageCheckDetail
          break
        case 'performanceEvaluateDetail':
          this.menuComponent = performanceEvaluateDetail
          break
      }
    },

    getCurrentData(val) {
      let params = { id: val }
      getAction(this.url.currentData, params).then((res) => {
        if (res.success) {
          this.listData = res.result
          // 当前操作人
          let operationPersonArray = []
          for (const item of res.result.projectUserList || []) {
            let operationPerson = item.realName + `【${item.departName}】`
            operationPersonArray.push(operationPerson)
          }
          this.operationPersonList = operationPersonArray.join('、')
          const commnUrl = this.url.listByDictCode
          // 项目所属
          getAction(commnUrl, { dictCode: 'project_owner' }).then((res) => {
            const { result, success } = res
            if (success) {
              if (this.listData.projectOwnership) {
                for (const item of result) {
                  if (this.listData.projectOwnership.indexOf(item.itemValue) != -1) {
                    this.projectOwnership = item.itemText
                  }
                }
              }
            } else {
              this.$message.warning(res.message)
            }
          })
          // 项目类型
          getAction(commnUrl, { dictCode: 'project_category' }).then((res) => {
            const { result, success } = res
            if (success) {
              if (this.listData.projectCategory) {
                for (const item of result) {
                  if (this.listData.projectCategory.indexOf(item.itemValue) != -1) {
                    this.projectCategory = item.itemText
                  }
                }
              }
            } else {
              this.$message.warning(res.message)
            }
          })
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 申请退回
    applyBack() {
      postAction(`${this.url.applyBackProjectReport}?id=${this.listData.id}`).then((res) => {
        if (res.success) {
          this.getCurrentData(this.listData.id)
          this.$message.success(res.message)
        } else {
          this.$message.warning(res.message)
        }
      })
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
        .blue-color {
          color: #1890ff;
        }
      }
    }
    &-back {
      display: flex;
      justify-content: flex-end;
      flex-direction: column;
      text-align: right;
      .stage {
        font-size: 14px;
        font-weight: 400;
        color: #bfbfbf;
        line-height: 20px;
        margin-bottom: 8px;
        .endTime {
          margin-top: 16px;
        }
      }
      .ant-btn {
        font-size: 16px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.85);
        line-height: 25px;
      }
    }
  }
}
.tab-menu {
  width: 100%;
  display: flex;
  background: #ffffff;
  border-radius: 4px;
  height: 46px;
  margin: 16px 0;
  .tab-menu-item {
    padding: 9px 24px;
    font-size: 16px;
    font-weight: 500;
    color: #8c8c8c;
    line-height: 16px;
    cursor: pointer;
    span {
      margin-left: 8px;
    }
  }
  .tab-menu-item-select {
    padding: 9px 24px;
    font-size: 16px;
    font-weight: 500;
    color: #ffffff;
    line-height: 16px;
    background: #0091ff;
    cursor: pointer;
    transition: all 0.5s ease-out;
    span {
      margin-left: 8px;
    }
  }
}
</style>
