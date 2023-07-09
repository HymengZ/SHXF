<template>
  <div class="project-message-detail">
    <div class="left">
      <a-card id="basic" title="项目基本信息"
        ><a-descriptions :column="2" bordered>
          <a-descriptions-item label="创建时间">{{ formatMinute(listData.createTime) }} </a-descriptions-item>
          <a-descriptions-item label="提交时间"
            >{{ listData.submitTime && formatMinute(listData.submitTime) }}
          </a-descriptions-item>
          <a-descriptions-item label="审核时间"
            >{{ listData.auditTime && formatMinute(listData.auditTime) }}
          </a-descriptions-item>
          <a-descriptions-item label="所属年度">{{ listData.ownershipYear }}年 </a-descriptions-item>
          <a-descriptions-item label="发布单位">{{ listData.publishUnitName }} </a-descriptions-item>
          <a-descriptions-item label="项目所属"> {{ projectOwnership }}</a-descriptions-item>
          <a-descriptions-item label="项目类型">{{ projectCategory }} </a-descriptions-item>
          <a-descriptions-item label="专项资金(万元)">{{ specialFund }} </a-descriptions-item>
          <a-descriptions-item label="其他来源资金(万元)"> {{ otherFund }}</a-descriptions-item>
          <a-descriptions-item label="总预算(万元)">{{ totalBudget }} </a-descriptions-item>
          <a-descriptions-item label="项目开始时间">{{ formatMonth(listData.cycleStartTime) }} </a-descriptions-item>
          <a-descriptions-item label="项目结束时间">{{ formatMonth(listData.cycleEndTime) }} </a-descriptions-item>
          <a-descriptions-item label="所属管理类型"> {{ projectManagementType }}</a-descriptions-item>
          <a-descriptions-item label="是否有阶段检查">{{ phaseCheck }} </a-descriptions-item>
        </a-descriptions></a-card
      >
      <a-card id="relation" title="项目关联信息">
        <a-descriptions :column="1" bordered>
          <a-descriptions-item label="关联的科技指南">{{ listData.guideId }} </a-descriptions-item>
          <a-descriptions-item label="关联的科技需求">{{ listData.demandId }} </a-descriptions-item>
          <a-descriptions-item label="关注的话题">{{ listData.followTopic }} </a-descriptions-item>
          <a-descriptions-item label="固定关键词">{{ listData.fixedKeyword }} </a-descriptions-item>
          <a-descriptions-item label="自定义关键词">{{ listData.customKeyword }} </a-descriptions-item>
          <a-descriptions-item label="关联的成果">{{}} </a-descriptions-item>
        </a-descriptions>
      </a-card>
      <a-card id="responsible" title="项目负责人信息">
        <a-descriptions :column="2" bordered>
          <a-descriptions-item label="真实姓名">{{ listData.directorRealname }} </a-descriptions-item>
          <a-descriptions-item label="性别">{{ listData.directorSex }} </a-descriptions-item>
          <a-descriptions-item label="出生年月"
            >{{ listData.directorBirthday && formatMonth(listData.directorBirthday) }}
          </a-descriptions-item>
          <a-descriptions-item label="联系电话">{{ listData.directorPhone }} </a-descriptions-item>
          <a-descriptions-item label="证件类型">{{ directorCertType }} </a-descriptions-item>
          <a-descriptions-item label="证件号码">{{ listData.directorCertId }} </a-descriptions-item>
          <a-descriptions-item label="所在单位">{{ listData.directorUnitId }} </a-descriptions-item>
          <a-descriptions-item label="职务">{{ listData.directorPost }} </a-descriptions-item>
          <a-descriptions-item label="职称">{{ directerTitle }} </a-descriptions-item>
          <a-descriptions-item label="最高学位">{{ directerDegree }} </a-descriptions-item>
          <a-descriptions-item label="电子邮箱">{{ listData.directerEmail }} </a-descriptions-item>
        </a-descriptions>
      </a-card>
      <a-card id="contacts" title="项目联系人信息">
        <a-descriptions :column="2" bordered>
          <a-descriptions-item label="真实姓名">{{ listData.linkRealname }} </a-descriptions-item>
          <a-descriptions-item label="手机号码">{{ listData.linkPhone }} </a-descriptions-item>
          <a-descriptions-item label="职务">{{ listData.linkPost }} </a-descriptions-item>
          <a-descriptions-item label="电子邮箱">{{ listData.linkEmail }} </a-descriptions-item>
          <a-descriptions-item label="通讯地址">{{ listData.linkCommunicationAddress }} </a-descriptions-item>
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
              共{{ total }}人，其中：高级职称{{ listData.seniorPost || 0 }}人，中级职称{{
                listData.middlePost || 0
              }}人，初级职称{{ listData.primaryPost || 0 }}人，其他{{ listData.other || 0 }}人
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
            <div class="text">{{ listData.projectSituation }}</div>
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
      <a-anchor @click.prevent="() => {}">
        <a-anchor-link href="#basic" title="项目基本信息" />
        <a-anchor-link href="#relation" title="项目关联信息" />
        <a-anchor-link href="#responsible" title="项目负责人信息" />
        <a-anchor-link href="#contacts" title="项目联系人信息" />
        <a-anchor-link href="#company" title="项目参与单位" />
        <a-anchor-link href="#describe" title="项目描述" />
        <a-anchor-link href="#contract" title="项目合同" />
        <a-anchor-link href="#enclosure" title="其他附件" />
      </a-anchor>
    </div>
  </div>
</template>
<script>
import { getAction } from '@/api/manage.js'
import { formatMinute, formatMonth } from '@/utils/formatDate'
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
    // 项目所属
    projectOwnership: {
      type: String,
      default: '',
      require: false,
    },
    // 项目类型
    projectCategory: {
      type: String,
      default: '',
      require: false,
    },
  },
  data() {
    return {
      // 职称
      directerTitle: '',
      // 最高学位
      directerDegree: '',
      // 项目管理类型
      projectManagementType: '',
      // 证件类型
      directorCertType: '',
      // 阶段检查
      phaseCheck: '',
      // 预期成果形式
      expectAchieve: '',
      // 实际参与人数，总人数
      total: '',
      // 单位类型
      unitList: [],
      // 预期成果形式
      filterExpectAchieveList: '',
      // 项目合同附件
      projectFile: [],
      // 其他附件
      otherFile: [],
      // 金额
      specialFund: '',
      otherFund: '',
      totalBudget: '',
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
        // 数据字典接口
        listByDictCode: '/sys/dictItem/listByDictCode',
      },
    }
  },

  created() {
    if (this.listData.id) {
      this.$nextTick(() => {
        this.updateListData(this.listData)
        this.getSelectList()
      })
    }
  },

  watch: {
    listData(newVal, oldVal) {
      this.$nextTick(() => {
        this.updateListData(newVal)
        this.getSelectList()
      })
    },
  },

  methods: {
    formatMinute,
    formatMonth,
    // 修改字段值为文字
    updateListData(newVal) {
      // 金额
      this.specialFund = this.listData.specialFund.toFixed(2)
      this.otherFund = this.listData.otherFund.toFixed(2)
      this.totalBudget = this.listData.totalBudget.toFixed(2)
      this.total =
        parseInt(newVal.seniorPost) +
          parseInt(newVal.middlePost) +
          parseInt(newVal.primaryPost) +
          parseInt(newVal.other) || 0
      this.projectFile = newVal.fireUploadsList.filter((item) => item.uploadType == '项目合同')
      this.otherFile = newVal.fireUploadsList.filter((item) => item.uploadType == '其他附件')
      // 项目管理类型
      if (newVal.projectManagementType == '1') {
        this.projectManagementType = '正在进行中项目'
      } else {
        this.projectManagementType = '历史项目'
      }
      // 阶段检查
      if (newVal.phaseCheck == 1) {
        this.phaseCheck = '有'
      } else {
        this.phaseCheck = '无'
      }
    },

    async getSelectList() {
      const commnUrl = this.url.listByDictCode

      // 证件类型
      await getAction(commnUrl, { dictCode: 'cert_type' }).then((res) => {
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
      // 单位类型
      await getAction(commnUrl, { dictCode: 'unit_type' }).then((res) => {
        const { result, success } = res
        if (success) {
          this.unitList = result
        } else {
          this.$message.warning(res.message || '单位类型查询失败')
        }
      })
      // 职称
      await getAction(commnUrl, { dictCode: 'work_title' }).then((res) => {
        const { result, success } = res
        if (success) {
          for (const item of result) {
            if (this.listData.directerTitle.indexOf(item.itemValue) != -1) {
              this.directerTitle = item.itemText
            }
          }
        } else {
          this.$message.warning(res.message)
        }
      })
      // 最高学位
      await getAction(commnUrl, { dictCode: 'high_degree' }).then((res) => {
        const { result, success } = res
        if (success) {
          for (const item of result) {
            if (this.listData.directerDegree.indexOf(item.itemValue) != -1) {
              this.directerDegree = item.itemText
            }
          }
        } else {
          this.$message.warning(res.message)
        }
      })
      // 预期成果形式
      await getAction(commnUrl, { dictCode: 'form_result' }).then((res) => {
        const { result, success } = res
        if (success) {
          let expectAchieve = ''
          if (this.listData.expectAchieve) {
            expectAchieve = this.listData.expectAchieve.split(',')
          }
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
        } else {
          this.$message.warning(res.message)
        }
      })
    },

    //打开附件
    openFile(data) {
      window.open(`https://shfar.cwit.com.cn/api/${data.fileUrl}?token=${this.token}`)
    },
  },
}
</script>
<style lang="less" scoped>
.project-message-detail {
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
      // 项目参与单位
      .ant-table {
        .ant-table-column-title {
          font-size: 14px;
          font-weight: 600;
          text-align: left;
          color: rgba(0, 0, 0, 0.85);
          line-height: 14px;
        }
      }
    }

    // 项目描述
    .describe {
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
            color: #1890ff;
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
