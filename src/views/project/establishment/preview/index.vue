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
            v-if="['150', '200'].indexOf(listData.processStatus) != -1 && activeTab == 1"
            src="../../../../assets/icon_待审核.png"
            alt="状态"
          />
          <img v-if="listData.processStatus == '135'" src="../../../../assets/icon_待退回.png" alt="状态" />
          <img v-if="listData.processStatus == '100'" src="../../../../assets/icon_待提交.png" alt="状态" />
          <img
            v-if="listData.processStatus == '200' && activeTab == 2"
            src="../../../../assets/icon_审核通过.png"
            alt="状态"
          />
          <img v-if="listData.processStatus == '400'" src="../../../../assets/icon_审核不通过.png" alt="状态" />
          <img v-if="listData.processStatus == '136'" src="../../../../assets/icon_已退回.png" alt="状态" />
          <img v-if="listData.processStatus == '300'" src="../../../../assets/icon_审核完成.png" alt="状态" />
          <span v-if="listData.processStatus == '200' && activeTab == 2" class="adopt"
            >审核意见：{{ listData.result }}</span
          >
          <span v-if="listData.processStatus == '400'" class="fail">审核意见：{{ listData.result }}</span>
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
        </div>
        <div class="top-message-back">
          <a-button
            :disabled="['100', '135', '136', '300', '400'].indexOf(listData.processStatus) != -1"
            @click="applyBack"
            v-if="activeTab == 1"
            v-has="'establishmentSubmit:applyReturn'"
            >申请退回</a-button
          >
        </div>
      </div>
    </a-card>
    <div class="detail">
      <div class="left">
        <a-card id="basic" title="项目基本信息"
          ><a-descriptions :column="2" bordered>
            <a-descriptions-item label="创建时间">{{ formatMinute(listData.createTime) }} </a-descriptions-item>
            <a-descriptions-item label="提交时间"
              >{{ listData.submitTime && formatMinute(listData.submitTime) }}
            </a-descriptions-item>
            <a-descriptions-item label="审核时间">
              {{ listData.auditTime && formatMinute(listData.auditTime) }}
            </a-descriptions-item>
            <a-descriptions-item label="所属年度">{{ listData.ownershipYear }}年</a-descriptions-item>
            <a-descriptions-item label="发布单位">{{ listData.publishUnitName }} </a-descriptions-item>
            <a-descriptions-item label="项目所属"> {{ projectOwnership }}</a-descriptions-item>
            <a-descriptions-item label="项目类型"> {{ projectCategory }}</a-descriptions-item>
            <a-descriptions-item label="专项资金(万元)">{{ specialFund }} </a-descriptions-item>
            <a-descriptions-item label="其他来源资金(万元)"> {{ otherFund }}</a-descriptions-item>
            <a-descriptions-item label="总预算(万元)">{{ totalBudget }} </a-descriptions-item>
            <a-descriptions-item label="项目开始时间">{{ formatMonth(listData.cycleStartTime) }} </a-descriptions-item>
            <a-descriptions-item label="项目结束时间">{{ formatMonth(listData.cycleEndTime) }} </a-descriptions-item>
            <a-descriptions-item label="实际完成时间"> {{ formatMonth(listData.completionTime) }}</a-descriptions-item>
            <a-descriptions-item label="里程碑考核节点">{{ formatMonth(listData.checkTime) }} </a-descriptions-item>
          </a-descriptions></a-card
        >
        <a-card id="responsible" title="项目负责人信息">
          <a-descriptions :column="2" bordered>
            <a-descriptions-item label="真实姓名">{{ listData.directorRealname }} </a-descriptions-item>
            <a-descriptions-item label="性别">{{ listData.directorSex }} </a-descriptions-item>
            <a-descriptions-item label="出生年月"
              >{{ listData.directorBirthday && formatMonth(listData.directorBirthday) }}
            </a-descriptions-item>
            <a-descriptions-item label="联系电话"> {{ listData.directorPhone }}</a-descriptions-item>
            <a-descriptions-item label="证件类型"> {{ directorCertType }}</a-descriptions-item>
            <a-descriptions-item label="证件号码"> {{ listData.directorCertId }}</a-descriptions-item>
            <a-descriptions-item label="所在单位"> {{ listData.directorUnitName }}</a-descriptions-item>
            <a-descriptions-item label="职务">{{ listData.directorPost }} </a-descriptions-item>
            <a-descriptions-item label="职称"> {{ directerTitle }}</a-descriptions-item>
            <a-descriptions-item label="最高学位">{{ directerDegree }} </a-descriptions-item>
            <a-descriptions-item label="电子邮箱"> {{ listData.directerEmail }}</a-descriptions-item>
          </a-descriptions>
        </a-card>
        <a-card id="contacts" title="项目联系人信息">
          <a-descriptions :column="2" bordered>
            <a-descriptions-item label="真实姓名">{{ listData.linkRealname }} </a-descriptions-item>
            <a-descriptions-item label="手机号码">{{ listData.linkPhone }} </a-descriptions-item>
            <a-descriptions-item label="职务">{{ listData.linkPosition }} </a-descriptions-item>
            <a-descriptions-item label="电子邮箱">{{ listData.linkEmail }} </a-descriptions-item>
            <a-descriptions-item label="通讯地址">{{ listData.linktAddress }} </a-descriptions-item>
          </a-descriptions>
        </a-card>
        <a-card id="company" title="项目参与单位">
          <a-table
            rowKey="id"
            :columns="listColumns"
            :data-source="listData.participationUnitList"
            :pagination="false"
            bordered
          >
            <template slot="unitType" slot-scope="text, record">
              <div v-for="item in unitList" :key="item.id">
                <div v-if="item.itemValue == record.unitType">{{ item.itemText }}</div>
              </div>
            </template></a-table
          >
        </a-card>
        <a-card id="describe" title="项目描述">
          <div class="describe">
            <div class="describe-actual _content">
              <div class="title">实际参加人数</div>
              <div class="text">
                共{{ total || 0 }}人，其中：高级职称{{ listData.seniorPost || 0 }}人，中级职称{{
                  listData.middlePost
                }}人，初级职称{{ listData.primaryPost || 0 }}人，其他{{ listData.other || 0 }}人。
              </div>
            </div>
            <a-divider />
            <div class="describe-expect _content">
              <div class="title">预期成果形式</div>
              <div class="text">
                {{ filterExpectAchieveList }}
              </div>
            </div>
            <a-divider />
            <div class="describe-situation _content">
              <div class="title">项目情况</div>
              <div class="text">
                {{ listData.projectSituation }}
              </div>
            </div>
          </div>
        </a-card>
        <a-card class="file" id="contract" title="项目合同">
          <div class="file-fileList">
            <div class="file-fileList-item" v-for="item in projectFile" :key="item.id" @click="openFile(item)">
              <a-icon type="paper-clip" /> <span>{{ item.fileName }}.{{ item.fileSuffix }}</span>
            </div>
          </div>
        </a-card>
        <a-card class="file" id="enclosure" title="其他附件">
          <div class="file-fileList">
            <div class="file-fileList-item" v-for="item in otherFile" :key="item.id" @click="openFile(item)">
              <a-icon type="paper-clip" /> <span>{{ item.fileName }}.{{ item.fileSuffix }}</span>
            </div>
          </div>
        </a-card>
      </div>
      <div class="right">
        <a-anchor @click.prevent="handleEvent(e)">
          <a-anchor-link href="#basic" title="项目基本信息" />
          <a-anchor-link href="#responsible" title="项目负责人信息" />
          <a-anchor-link href="#contacts" title="项目联系人信息" />
          <a-anchor-link href="#company" title="项目参与单位" />
          <a-anchor-link href="#describe" title="项目描述" />
          <a-anchor-link href="#contract" title="项目合同" />
          <a-anchor-link href="#enclosure" title="其他附件" />
        </a-anchor>
      </div>
    </div>
  </page-header-wrapper>
</template>
<script>
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import { getAction, postAction } from '@/api/manage.js'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { formatMinute, formatMonth } from '@/utils/formatDate'
export default {
  components: {
    PageHeaderWrapper,
  },
  data() {
    return {
      // 当前操作人
      operationPersonList: '',
      // 项目所属
      projectOwnership: '',
      // 项目类型
      projectCategory: '',
      // 证件类型
      directorCertType: '',
      // 职称
      directerTitle: '',
      // 最高学位
      directerDegree: '',
      // 单位类型
      unitList: [],
      // 预期成果形式
      filterExpectAchieveList: '',
      // 金额
      specialFund: '',
      otherFund: '',
      totalBudget: '',
      // token
      token: '',
      // 实际参与人数，总人数
      total: '',
      listData: {},

      // 项目合同附件
      projectFile: [],
      // 其他附件
      otherFile: [],
      listColumns: [
        {
          title: '序号',
          dataIndex: 'orderIndex',
          key: 'orderIndex',
          width: '8%',
        },
        {
          title: '单位名称',
          dataIndex: 'unitName',
          key: 'unitName',
          width: '58%',
        },
        {
          title: '单位类型',
          dataIndex: 'unitType',
          scopedSlots: { customRender: 'unitType' },
          key: 'unitType',
          width: '12%',
        },
        {
          title: '统一社会信用代码',
          dataIndex: 'unitCreditCode',
          key: 'unitCreditCode',
        },
      ],

      url: {
        currentData: '/fire/projectBuild/queryById',
        applicationBackProjectBuild: '/fire/projectBuild/applicationBackProjectBuild',
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
    formatMonth,
    // 阻止默认事件
    handleEvent(e) {
      e.preventDefault()
    },
    //打开附件
    openFile(data) {
      window.open(`https://shfar.cwit.com.cn/api/${data.fileUrl}?token=${this.token}`)
    },
    getCurrentData(val) {
      let params = { id: val }
      getAction(this.url.currentData, params).then((res) => {
        if (res.success) {
          this.listData = res.result
          // 金额
          this.specialFund = this.listData.specialFund.toFixed(2)
          this.otherFund = this.listData.otherFund.toFixed(2)
          this.totalBudget = this.listData.totalBudget.toFixed(2)
          // 当前操作人
          let operationPersonArray = []
          for (const item of res.result.projectUserList || []) {
            let operationPerson = item.realName + `【${item.departName}】`

            operationPersonArray.push(operationPerson)
          }
          this.operationPersonList = operationPersonArray.join('、')
          // 实际参与人数，总人数
          this.total =
            parseInt(this.listData.seniorPost) +
            parseInt(this.listData.middlePost) +
            parseInt(this.listData.primaryPost) +
            parseInt(this.listData.other)
          // 项目合同附件
          this.projectFile = res.result.fireUploadsList.filter((item) => item.uploadType == '项目合同')
          // 其他附件
          this.otherFile = res.result.fireUploadsList.filter((item) => item.uploadType == '其他附件')
          const commnUrl = this.url.listByDictCode
          // 单位类型
          getAction(commnUrl, { dictCode: 'unit_type' }).then((res) => {
            const { result, success } = res
            if (success) {
              this.unitList = result
            } else {
              this.$message.warning(res.message || '单位类型查询失败')
            }
          })
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
          // 证件类型
          getAction(commnUrl, { dictCode: 'cert_type' }).then((res) => {
            const { result, success } = res
            if (success) {
              if (this.listData.directorCertType) {
                for (const item of result) {
                  if (this.listData.directorCertType.indexOf(item.itemValue) != -1) {
                    this.directorCertType = item.itemText
                  }
                }
              }
            } else {
              this.$message.warning(res.message)
            }
          })
          // 职称
          getAction(commnUrl, { dictCode: 'work_title' }).then((res) => {
            const { result, success } = res
            if (success) {
              if (this.listData.directerTitle) {
                for (const item of result) {
                  if (this.listData.directerTitle.indexOf(item.itemValue) != -1) {
                    this.directerTitle = item.itemText
                  }
                }
              }
            } else {
              this.$message.warning(res.message || '请求失败')
            }
          })
          // 最高学位
          getAction(commnUrl, { dictCode: 'high_degree' }).then((res) => {
            const { result, success } = res
            if (success) {
              if (this.listData.directerDegree) {
                for (const item of result) {
                  if (this.listData.directerDegree.indexOf(item.itemValue) != -1) {
                    this.directerDegree = item.itemText
                  }
                }
              }
            } else {
              this.$message.warning(res.message || '请求失败')
            }
          })
          // 获取预期成果形式
          getAction(commnUrl, { dictCode: 'form_result' }).then((res) => {
            const { result, success } = res
            if (success) {
              if (this.listData.expectAchieve) {
                let expectAchieve = this.listData.expectAchieve.split(',')
                let filterExpectAchieve = []
                for (const item of result) {
                  if (expectAchieve.indexOf(item.itemValue) != -1) {
                    if (item.itemText == '其他') {
                      filterExpectAchieve.push(this.listData.expectAchieveStr)
                    } else {
                      filterExpectAchieve.push(item.itemText)
                    }
                  }
                }
                this.filterExpectAchieveList = filterExpectAchieve.join('、')
              }
            } else {
              this.$message.warning(res.message)
            }
          })
        }
      })
    },
    // 申请退回
    applyBack() {
      postAction(`${this.url.applicationBackProjectBuild}?id=${this.listData.id}`).then((res) => {
        if (res.success) {
          this.getCurrentData(this.listData.id)
          this.$message.success(res.message || '申请退回成功')
        } else {
          this.$message.warning(res.message || '申请退回失败')
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
      align-items: flex-end;
      .ant-btn {
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

    // 项目描述
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
    // 附件
    .file {
      .file-fileList {
        &-item {
          background-color: #fff;
          cursor: pointer;
          padding: 10px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          margin-bottom: 8px;
          span {
            margin-left: 8px;
            font-size: 14px;
            font-weight: 400;
            color: #1890ff;
            line-height: 14px;
          }
        }
        &-item:hover {
          background-color: #e6f7ff;
        }
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
