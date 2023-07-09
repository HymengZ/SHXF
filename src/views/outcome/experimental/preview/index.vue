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
          <div class="projectName">{{ pilotMain.pilot.pilotName }}</div>
          <a-badge
            v-if="pilotMain.pilot.processStatus"
            :color="states[pilotMain.pilot.processStatus].color"
            class="numberStyle"
            :text="states[pilotMain.pilot.processStatus].typeTitle"
          />
        </div>
        <div style="padding: 10px"></div>
        <div class="headbtn">
          <a-button @click="Delete" v-has="'outcome:experimental:delete'">删除</a-button>
          <a-button type="primary" @click="redact" v-has="'outcome:experimental:redact'"> 编辑 </a-button>
          <a-button type="primary" @click="submit" v-has="'outcome:experimental:submit'"> 提交 </a-button>
          <a-button @click="sendBack" v-has="'outcome:experimental:sendBack'">申请退回</a-button>
          <a-button type="primary" @click="audit" v-has="'outcome:experimental:audit'"> 审核 </a-button>
          <a-button @click="applyIssue" v-has="'outcome:experimental:applyIssue'">发布</a-button>
          <a-button @click="applySoldOut" v-has="'outcome:experimental:applySoldOut'">下架</a-button>
          <a-button @click="applySendBack" v-has="'outcome:experimental:applySendBack'">退回</a-button>
        </div>
        <div class="wrp">
          <div class="description">
            <div>
              <span>试点应用编号:</span><span>{{ pilotMain.pilot.pilotNumber }}</span>
            </div>
            <div>
              <span>关联的成果:</span><span>{{ pilotMain.pilot.linkAchieveName }}</span>
            </div>
            <div>
              <span>成果所在目录:</span><span>{{ pilotMain.pilot.catalogueId }}</span>
            </div>
            <div>
              <span>成果编号:</span><span>{{ pilotMain.pilot.linkAchieveNumber }}</span>
            </div>
            <div>
              <span>成果配备范围:</span><span>{{ pilotMain.pilot.equipmentRangeText }}</span>
            </div>
            <div>
              <span>填写单位:</span><span>{{ pilotMain.pilot.unitName }}</span>
            </div>
          </div>
        </div>
      </a-card>
      <!-- 采购信息 -->
      <a-card :bordered="false" style="margin-top: 16px">
        <div slot="title" class="grid-title">领用申请信息</div>
        <div class="content">
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 配备数量 </a-card-grid>
            <a-card-grid class="grid" style="width: 95%"> {{ pilotMain.pilotDetail.equipmentAmount || '-' }} </a-card-grid>
          </div>
          <!--  -->
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 装备要求 </a-card-grid>
            <a-card-grid class="grid" style="width: 95%"> {{ pilotMain.pilotDetail.equipmentRequirement }} </a-card-grid>
          </div>
          <!--  -->
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 业务部门需求 </a-card-grid>
            <a-card-grid class="grid" style="width: 95%">
              {{ pilotMain.pilotDetail.businessDemand || '-' }}
            </a-card-grid>
          </div>
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 其他部门意见 </a-card-grid>
            <a-card-grid class="grid" style="width: 95%"> {{ pilotMain.pilotDetail.otherOpinion || '-' }} </a-card-grid>
          </div>
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 领用附件 </a-card-grid>
            <a-card-grid class="grid" style="width: 95%">
              <a
                target="_blank"
                :href="uploadBaseDomain + item.fileUrl"
                v-for="(item, index) in pilotMain.pilotDetail.consumingFiles"
                :key="index"
              >
                <div class="fileAction">
                  <div><a-icon type="paper-clip" /></div>
                  <div class="title">{{ item.fileName }};</div>
                </div>
              </a>
            </a-card-grid>
          </div>
        </div>
      </a-card>

      <!-- 总结信息 -->
      <a-card :bordered="false" style="margin-top: 16px">
        <div slot="title" class="grid-title">总结信息</div>
        <div class="content">
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 应用时间 </a-card-grid>
            <a-card-grid class="grid" style="width: 95%">
              {{ pilotMain.pilotDetail.applicationEndTime || '-' }}
            </a-card-grid>
          </div>
          <!--  -->
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 参加实战应用次数 </a-card-grid>
            <a-card-grid class="grid" style="width: 95%"> {{ pilotMain.pilotDetail.actualAmount || '-' }} </a-card-grid>
          </div>
          <!--  -->
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 参加训练次数 </a-card-grid>
            <a-card-grid class="grid" style="width: 95%"> {{ pilotMain.pilotDetail.trainAmount || '-' }} </a-card-grid>
          </div>
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 参加演练次数 </a-card-grid>
            <a-card-grid class="grid" style="width: 95%"> {{ pilotMain.pilotDetail.drillAmount || '-' }} </a-card-grid>
          </div>
          <!--  -->
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 实战应验案例或演练案例 </a-card-grid>
            <a-card-grid class="grid" style="width: 95%"> {{ pilotMain.pilotDetail.actualCase || '-' }} </a-card-grid>
          </div>

          <!--  -->
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 成果的优点 </a-card-grid>
            <a-card-grid class="grid" style="width: 95%"> {{ pilotMain.pilotDetail.achieveMerit || '-' }} </a-card-grid>
          </div>
          <!--  -->
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 成果的不足 </a-card-grid>
            <a-card-grid class="grid" style="width: 95%">
              {{ pilotMain.pilotDetail.achieveDemerit || '-' }}
            </a-card-grid>
          </div>
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 改进建议 </a-card-grid>
            <a-card-grid class="grid" style="width: 95%">
              {{ pilotMain.pilotDetail.improveProposal || '-' }}
            </a-card-grid>
          </div>
          <!--  -->
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 与目前配备的同类产品的比较 </a-card-grid>
            <a-card-grid class="grid" style="width: 95%">
              {{ pilotMain.pilotDetail.productsCompare || '-' }}
            </a-card-grid>
          </div>
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 成果提供单位技术服务情况 </a-card-grid>
            <a-card-grid class="grid" style="width: 95%">
              {{ pilotMain.pilotDetail.serviceSituation || '-' }}
            </a-card-grid>
          </div>
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 应用照片 </a-card-grid>
            <a-card-grid class="grid" style="width: 95%">
              <div class="fileAction" v-for="(item, index) in pilotMain.pilotDetail.applyPhotos" :key="index">
                <img style="width: 120px; height: 120px;" :src="uploadBaseDomain + item.fileUrl" alt="" />
              </div>
            </a-card-grid>
          </div>
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 试点应用总结附件 </a-card-grid>
            <a-card-grid class="grid" style="width: 95%">
              <a
                target="_blank"
                :href="uploadBaseDomain + item.fileUrl"
                v-for="(item, index) in pilotMain.pilotDetail.summaryFiles"
                :key="index"
              >
                <div class="fileAction">
                  <div><a-icon type="paper-clip" /></div>
                  <div class="title">{{ item.fileName }};</div>
                </div>
              </a>
            </a-card-grid>
          </div>
        </div>
      </a-card>
      <!-- 添加/详情弹框 -->
      <j-modal
        title="科技成果推广编辑/新增"
        :visible="reportVisible"
        switchFullscreen
        :fullscreen="true"
        @ok="handleOk"
        okText="保存"
        @cancel="handleCancel"
        cancelText="关闭"
      >
        <pop-modal-list ref="form"></pop-modal-list>
      </j-modal>
      <a-modal v-model="auditVisible" @cancel="auditCancel" @ok="auditOk" width="50%" title="审核">
        <AuditForm ref="applys"></AuditForm>
      </a-modal>
    </div>
  </page-header-wrapper>
</template>

<script>
import PageHeaderWrapper from '../../../../components/PageHeaderWrapper'
import AuditForm from '../components/ApplyList/auditForm'
import PopModalList from '../components/SubmitList/popModalList'
import { getAction, deleteAction, postAction } from '../../../../api/manage'
import {
  backExtension, //退回
  applyAchieve, //审核
  publishAchieve, //发布
  submitAchievePilot, //提交
  unpublishAchieve, //下架
  EdtAchievePilot,
  backAchievePilot, //申请退回
  getAchievePilot,
  getAchievePilotDetail,
} from '@/api/outcome/experimental'
const states = {
  100: {
    typeTitle: '领用申请待提交',
    color: '#FAAD14',
  },
  130: {
    typeTitle: '已退回',
    color: '#FF0000',
  },
  140: {
    typeTitle: '领用申请审核驳回',
    color: '#FF0000',
  },
  150: {
    typeTitle: '领用申请待审核',
    color: '#FAAD14',
  },
  155: {
    typeTitle: '待退回',
    color: '#FAAD14',
  },
  200: {
    typeTitle: '总结待提交',
    color: '#FAAD14',
  },
  230: {
    typeTitle: '已退回',
    color: '#FF0000',
  },
  240: {
    typeTitle: '总结审核驳回',
    color: '#FF0000',
  },
  250: {
    typeTitle: '总结待审核',
    color: '#FAAD14',
  },
  255: {
    typeTitle: '待退回',
    color: '#FAAD14',
  },
  300: {
    typeTitle: '总结审核通过',
    color: '#FAAD14',
  },
  800: {
    typeTitle: '已发布',
    color: 'green',
  },
  900: {
    typeTitle: '已下架',
    color: 'green',
  },
}
export default {
  data() {
    return {
      currentModify: {},
      reportVisible: false,
      auditVisible: false,
      typeList: [],
      pilotMain: {
        pilot: {},
        pilotDetail: {},
      },
      // configurationVisible: false,
      // configurationType:''
      url: {
        list: '/fire/fireAchievePilot/list', //列表
        //apply: '/fire/achieveExtension/applyBackExtension',
        submit: '/fire/fireAchievePilot/submitPilot', //提交
        // SendBack: '/fire/achieveExtension/applyBackExtension',
        delete: '/fire/fireAchievePilot/delete', //删除
        back: '/fire/fireAchievePilot/backPilot', //申请退回
      },
      states,
    }
  },
  computed: {
    uploadBaseUrl() {
      return process.env.VUE_APP_UPLOAD_BASE_URL
    },
    uploadBaseDomain() {
      // VUE_APP_UPLOAD_BASE_DOMAIN
      return process.env.VUE_APP_UPLOAD_BASE_DOMAIN
    },
  },
  components: {
    PageHeaderWrapper,
    AuditForm,
    PopModalList,
  },
  mounted() {
    this.handleFetchDetail()
    this.$route.params
  },
  methods: {
    handleFetchDetail() {
      getAchievePilot(this.$route.query.id).then((res) => {
        this.pilotMain.pilot = res.result
      })

      getAchievePilotDetail(this.$route.query.id).then((res) => {
        this.pilotMain.pilotDetail = res.result
        // this.reportVisible = true
        // this.currentModify = record

        // setTimeout(() => {
        //   this.$refs.form.setFieldsValue(this.pilotMain)
        // })
      })
    },
    //删除项目
    Delete(e) {
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
          console.log('确定删除')
          deleteAction(this.url.delete, { id: this.$route.query.id }).then((res) => {
            if (res.success) {
              this.handleFetchDetail()
              this.$message.success(res.message)
            } else {
              this.$message.warning(res.message)
            }
          })
        },
      })
    },
    //提交
    submit(e) {
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
          submitAchievePilot(this.url.submit, { id: this.$route.query.id }).then((res) => {
            if (res.success) {
              this.handleFetchDetail()
              this.$message.success(res.message)
            } else {
              this.$message.warning(res.message)
            }
          })
        },
      })
    },
    //退回
    sendBack(e) {
      this.$confirm({
        title: '申请退回',
        icon: 'exclamation-circle',
        content: (
          <div>
            <p>确定申请退回？</p>
            <p>发送申请后需审核人员操作才能进行编辑/删除。</p>
          </div>
        ),
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          console.log('申请退回')
          backAchievePilot({ id: this.$route.query.id }).then((res) => {
            if (res.success) {
              this.$message.success('操作成功')
              this.handleFetchDetail()
            } else {
              this.$message.warning(res.message)
            }
          })
        },
      })
    },
    //推广审核
    audit() {
      this.auditVisible = true
    },
    //审核页面
    auditCancel() {
      this.auditVisible = false
    },
    //审核页面提交
    auditOk() {
      this.$refs.applys.validateFields().then((res) => {
        // this.auditVisible = false
        applyAchieve({
          id: this.$route.query.id,
          ...res,
        }).then((res) => {
          if (res.success) {
            this.auditVisible = false
            this.$message.success('审核成功')
            this.handleFetchDetail()
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
    //成果推广编辑
    redact() {
      this.reportVisible = true
      setTimeout(() => {
        this.$refs.form.setFieldsValue(this.pilotMain)
      })
    },
    //添加/详情弹框确定按钮
    handleOk() {
      // this.reportVisible = false
      this.$refs.form.validateFields().then((val) => {
        // 更新
        EdtAchievePilot({
          ...val,
          pilot: {
            ...val.pilot,
            id: this.pilotMain.pilotDetail.mainId,
          },
          pilotDetail: {
            ...val.pilotDetail,
            id: this.pilotMain.pilotDetail.id,
          },
        }).then((response) => {
          console.log(response)
          if (!res.success) {
            this.$message.error(response.message)
            return
          }
          this.handleFetchDetail()
          this.reportVisible = false
        })
      })
    },
    //添加/详情弹框取消按钮
    handleCancel() {
      this.reportVisible = false
    },
    //发布项目
    applyIssue(record) {
      this.$confirm({
        title: '发布',
        icon: 'exclamation-circle',
        content: (
          <div>
            <p>确定发布？</p>
            <p>发布会将进入发布列表，删除/编辑/退回请先下架。</p>
          </div>
        ),
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          publishAchieve({ id: this.$route.query.id }).then((res) => {
            if (res.success) {
              this.reportVisible = false
              this.$message.success('发布成功')
              this.handleFetchList()
            } else {
              this.$message.error(res.message)
            }
          })
          console.log('确定发布')
        },
      })
    },
    //下架项目
    applySoldOut(record) {
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
          unpublishAchieve({ id: this.$route.query.id }).then((res) => {
            if (res.success) {
              this.$message.success('下架成功')
              this.handleFetchDetail()
            } else {
              this.$message.error(res.message)
            }
          })
        },
      })
    },
    //退回项目
    applySendBack(record) {
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
          backExtension(this.$route.query.id).then((res) => {
            if (res.success) {
              this.handleFetchDetail()
              this.$message.success('退回成功')
            } else {
              this.$message.error(res.message)
            }
          })
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
  margin-bottom: 8px;
  button {
    margin-right: 10px;
  }
}
.wrp {
  display: block;
  background: #fafafa;
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
      width: 12%;
      background: #fafafa;
      color: #8c8c8c;
      display: flex;
      align-items: center;
    }
  }
}
.fileAction {
  display: flex;
  align-items: center;
  color: #1890ff;
  cursor: pointer;
  .title {
    color: #1890ff;
    margin-left: 7px;
  }
}
</style>