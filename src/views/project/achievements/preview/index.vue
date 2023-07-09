<template>
  <page-header-wrapper show-back>
    <div class="preview-container">
      <!-- 回到顶部 -->
      <a-back-top>
        <a-button type="primary" shape="circle">
          <a-icon type="up" />
        </a-button>
      </a-back-top>
      <!-- 项目名称 -->
      <a-card :bordered="false">
        <div class="title">
          <a-icon type="container" class="icon" />
          <div class="projectName">{{ info.achieveName }}</div>
          <a-badge :color="states[info.processStatus].color" :text="states[info.processStatus].typeTitle" />
        </div>
        <div style="padding: 10px"></div>
        <div class="headbtn">
          <a-button @click="Delete">删除</a-button>
          <a-button type="primary" @click="redact" > 编辑 </a-button>
          <a-button type="primary" @click="submit"> 提交 </a-button>
          <a-button @click="sendBack">申请退回</a-button>
          <a-button type="primary" @click="audit"> 审核 </a-button>
          <a-button @click="applyIssue">发布</a-button>
          <a-button @click="applySoldOut">下架</a-button>
          <a-button @click="applySendBack">退回</a-button>
        </div>
        <div class="description">
          <div>
            <span>成果编号:</span> <span>{{ info.achieveNumber }}</span>
          </div>
          <div>
            <span>成果类别:</span><span>{{ info.achieveCategoryName }}</span>
          </div>
          <div>
            <span>发布单位:</span><span>{{ info.unitName }}</span>
          </div>
          <div>
            <span>成果发布人:</span><span>{{ info.userRealname }}</span>
          </div>
          <div>
            <span>发布年度:</span><span>{{ info.publishYear }}</span>
          </div>
          <div>
            <span>是否被部局收录:</span><span>{{ info.ifInclude == '0' ? '否' : '是' }}</span>
          </div>
          <div>
            <span>关联的科技项目:</span><span>{{ info.linkProjectName }}</span>
          </div>
          <div>
            <span>项目编号:</span><span>{{ info.linkProjectNumber }}</span>
          </div>
        </div>
      </a-card>
      <!-- 成果所有人信息 -->
      <a-card :bordered="false" style="margin-top: 16px">
        <div slot="title" class="grid-title">参与人员</div>
        <div class="content">
          <a-table
            rowKey="id"
            :pagination="false"
            bordered
            :data-source="info.scienceAchieveUsers"
            :columns="personnelColumns"
          >
            <template slot="ssdw" slot-scope="text">
              <div>
                <a @click.prevent="">{{ text }}</a>
              </div>
            </template>
            <template slot="cert" slot-scope="text, record">
              <div>{{ record.certTypeName }}: {{ record.certId }}</div>
            </template>
          </a-table>
        </div>
      </a-card>
      <!-- 成果描述 -->
      <a-card :bordered="false" style="margin-top: 16px">
        <div slot="title" class="grid-title">成果描述</div>
        <div class="content" v-html="info.description"></div>
      </a-card>
      <!-- 添加/详情弹框 -->
      <j-modal
        title="项目报备编辑/新增"
        :visible="reportVisible"
        switchFullscreen
        :fullscreen="true"
        @ok="handleOk"
        @cancel="handleCancel"
        cancelText="关闭"
      >
        <report-modal-list ref="form" :category="PRIZE_CATEGORY_EMNU"></report-modal-list>
      </j-modal>
      <a-modal v-model="auditVisible" @cancel="auditCancel" @ok="auditOk" width="50%" title="审核">
        <AuditForm ref="apply"></AuditForm>
      </a-modal>
    </div>
  </page-header-wrapper>
</template>

<script>
import {
  fetchCategory,
  fetchScienceAchieve,
  backScienceAchieve,
  submitScienceAchieve,
  addScienceAchieve,
  publishScienceAchieve,
  unpublishScienceAchieve,
  deleteScienceAchieve,
  getScienceAchieve,
  editScienceAchieve,
  applyScienceAchieve,
  applyBackScienceAchieve,
} from '@/api/project/achievements'

const personnelColumns = [
  {
    title: '序号',
    dataIndex: 'serial',
    key: 'serial',
    align: 'center',
    width: 80,
    customRender: (text, record, index) => index + 1,
  },
  {
    title: '成果所有人证件信息',
    dataIndex: 'card',
    key: 'card',
    align: 'center',
    scopedSlots: { customRender: 'cert' },
  },
  {
    title: '成果所有人姓名',
    dataIndex: 'realname',
    key: 'syrxm',
    align: 'center',
  },
  {
    title: '成果所有人所属单位',
    dataIndex: 'unitName',
    key: 'ssdw',
    align: 'center',
    scopedSlots: { customRender: 'ssdw' },
  },
]

const states = {
  100: {
    typeTitle: '待提交',
    color: '#FAAD14',
  },

  150: {
    typeTitle: '待审核',
    color: '#FAAD14',
  },
  155: {
    typeTitle: '待退回',
    color: '#FAAD14',
  },
  130: {
    typeTitle: '已退回',
    color: '#FAAD14',
  },
  900: {
    typeTitle: '已下架',
    color: '#FAAD14',
  },
  800: {
    typeTitle: '已发布',
    color: 'green',
  },
  140: {
    typeTitle: '审核驳回',
    color: '#FF0000',
  },
  200: {
    typeTitle: '审核通过',
    color: 'green',
  },
}

const personnelData = [
  {
    serial: 1,
    card: '参与人证件信息',
    syrxm: '参与人姓名',
    ssdw: '参与人所属单位',
  },
]

import ReportModalList from '../components/SubmitList/reportModalList.vue'
import PageHeaderWrapper from '../../../../components/PageHeaderWrapper'
import AuditForm from '../components/ApplyList/auditForm.vue'
export default {
  data() {
    return {
      personnelColumns: personnelColumns,
      personnelData: personnelData,
      reportVisible: false,
      auditVisible: false,
      info: {},
      PRIZE_CATEGORY_EMNU: [],
      states,
    }
  },
  components: {
    PageHeaderWrapper,
    ReportModalList,
    AuditForm,
  },
  mounted() {
    this.handleFetchCategory()
    this.handleFetchDetail()
  },
  methods: {
    handleFetchCategory() {
      fetchCategory().then((res) => {
        this.PRIZE_CATEGORY_EMNU = [
          ...res.result.map((item) => {
            return {
              label: item.itemText,
              value: item.id,
            }
          }),
        ]
      })
    },
    handleFetchDetail() {
      getScienceAchieve(this.$route.params.id).then((res) => {
        this.info = res.result
      })
    },
    //删除项目
    Delete() {
      this.$confirm({
        title: '删除',
        icon: 'exclamation-circle',
        content: (
          <div>
            <p>确定删除？</p>
            <p>删除后将无法在列表中查到此条信息，请谨慎操作。</p>
          </div>
        ),
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          deleteScienceAchieve(this.info.id).then((res) => {
            if (res.success) {
              this.$message.success('删除成功')
              this.handleFetchList()
              return
            }
            this.$message.error(res.message)
          })
          console.log('确定删除')
        },
      })
    },
    //提交
    submit() {
      this.$confirm({
        title: '提交',
        icon: 'exclamation-circle',
        content: (
          <div>
            <p>确定提交？</p>
            <p>提交后将无法编辑与删除，需申请退回才可进行修改。</p>
          </div>
        ),
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          console.log('确定提交')
          submitScienceAchieve(this.info.id).then((res) => {
            if (res.success) {
              this.$message.success('操作成功')
              this.handleFetchDetail()
              return
            }
            this.$message.error(res.message)
          })
        },
      })
    },
    //退回
    sendBack() {
      this.$confirm({
        title: '申请退回',
        icon: 'exclamation-circle',
        content: (
          <div>
            <p>确定申请退回？</p>
            <p>发送申请后需审核人员操作退回才能进行编辑/删除。</p>
          </div>
        ),
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          applyBackScienceAchieve(this.info.id).then((res) => {
            if (res.success) {
              this.reportVisible = false
              this.$message.success('操作成功')
              this.handleFetchDetail()
            } else {
              this.$message.error(res.message)
            }
          })
        },
      })
    },
    //项目审核
    audit() {
      this.auditVisible = true
    },
    //审核页面
    auditCancel() {
      this.auditVisible = false
    },
    //审核页面提交
    auditOk() {
      this.$refs.apply.validateFields().then((res) => {
        this.auditVisible = false
        applyScienceAchieve({
          id: this.info.id,
          ...res,
        }).then((res) => {
          if (res.success) {
            this.reportVisible = false
            this.$message.success('提交成功')
            this.handleFetchDetail()
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
    //项目编辑

    redact() {
      console.log(this.info.processStatus)
      if (['100', '130', '900', '140','150'].indexOf(this.info.processStatus) >= 0) {
        getScienceAchieve(this.$route.params.id).then((res) => {
          this.reportVisible = true
          this.currentModify = res.result
          setTimeout(() => {
            this.$refs.form.setFieldsValue(res.result)
          })
        })
      } else {
        this.$message.warn('下架后该信息可删除/编辑/退回。')
      }
    },
    //添加/详情弹框确定按钮
    handleOk() {
      this.$refs.form.validateFields().then((val) => {
        editScienceAchieve({
          ...this.info,
          ...val,
        }).then((res) => {
          if (res.success) {
            this.reportVisible = false
            this.$message.success('修改成功')
            this.handleFetchDetail()
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
    //添加/详情弹框取消按钮
    handleCancel() {
      this.reportVisible = false
    },
    //发布项目
    applyIssue() {
      this.$confirm({
        title: '发布',
        icon: 'exclamation-circle',
        content: '发布后将进入发布列表，删除/编辑/退回请先下架。',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          publishScienceAchieve(this.info.id).then((res) => {
            if (res.success) {
              this.reportVisible = false
              this.$message.success('发布成功')
              this.handleFetchDetail()
            } else {
              this.$message.error(res.message)
            }
          })
          console.log('确定发布')
        },
      })
    },
    //下架项目
    applySoldOut() {
      this.$confirm({
        title: '下架',
        icon: 'exclamation-circle',
        content: (
          <div>
            <p>确定下架？</p>
            <p>下架后该信息可删除/编辑/退回。</p>
          </div>
        ),
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          unpublishScienceAchieve(this.info.id).then((res) => {
            if (res.success) {
              this.$message.success('下架成功')
              this.handleFetchDetail()
            } else {
              this.$message.error(res.message)
            }
          })
          // console.log('确定下架')
        },
      })
    },
    //退回项目
    applySendBack() {
      this.$confirm({
        title: '退回',
        icon: 'exclamation-circle',
        content: (
          <div>
            <p>确定退回？</p>
            <p>退回后该信息提交人员即可进行编辑/删除。</p>
          </div>
        ),
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          publishScienceAchieve(this.info.id).then((res) => {
            if (res.success) {
              this.reportVisible = false
              this.$message.success('发布成功')
              this.handleFetchDetail()
            } else {
              this.$message.error(res.message)
            }
          })
          console.log('确定发布')
        },
      })
    },
  },
}
</script>

<style lang="less" scoped>
.title {
  .projectName {
    font-size: 24px;
    font-weight: 600;
    display: inline-block;
    margin: 0 10px;
  }

  .icon {
    color: #1890ff;
    font-size: 24px;
  }
}

.headbtn {
  button {
    margin-right: 10px;
  }
}

.description {
  display: block;
  margin: 2% 0;
  background: #f5f5f5;
  padding: 16px 0;
  line-height: 182%;
  font-size: 14px;
  color: #8c8c8c;
  & > div {
    & > span:first-child {
      color: #8c8c8c;
      display: inline-block;
      margin-right: 5px;
      line-height: 14px;
      width: 200px;
      text-align: right;
    }
  }

  span {
    margin-left: 5px;
    color: rgb(63, 63, 63);
  }
}

.plan {
  display: flex;
  justify-content: space-between;

  .content {
    border: 1px rgb(236, 236, 236) solid;
    width: 33%;
    padding: 15px;
    display: flex;

    i {
      font-size: 20px;
      color: #1890ff;
      margin-right: 10px;
    }

    div {
      width: 100%;

      div {
        display: flex;
        justify-content: space-between;

        span:nth-child(1) {
          color: #8c8c8c;
        }

        span:nth-child(2) {
          font-weight: 600;
        }

        .emphasis {
          font-size: 24px;
          color: #1890ff;
          font-weight: 600;
        }
      }
    }
  }
}

.ant-back-top-inner {
  background: #fff;
  box-shadow: 1px 1px 10px rgba(1, 1, 1, 0.3);
  text-align: center;
  padding: 5px;
}

.preview-container {
  margin-top: 16px;

  .grid-title {
    font-size: 16px;
    font-weight: bold;
    margin: -4px 0;
  }

  .content {
    .grid-wrapper {
      display: flex;
      align-items: stretch;
    }

    // padding: 16px 24px;
    .grid,
    .grid-label {
      width: 30%;
      // height: 40px;
      min-height: 40px;
      // padding: 0;
      text-align: center;
      box-shadow: none;
      border: 1px #e9e9e9 solid;
      // line-height: 40px;
      text-align: left;
      padding: 8px 16px;

      &:hover {
        box-shadow: none;
        border: 1px #e9e9e9 solid;
      }
    }

    .grid-label {
      width: 20%;
      background: #fafafa;
      color: #8c8c8c;
      display: flex;
      align-items: center;
    }
  }
}
</style>
