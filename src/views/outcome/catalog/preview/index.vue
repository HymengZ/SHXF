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
          <div class="projectName">{{ infoList.extension.extensionName }}</div>
          <a-badge
            v-if="infoList.extension.processStatus"
            :color="states[infoList.extension.processStatus].color"
            class="numberStyle"
            :text="states[infoList.extension.processStatus].typeTitle"
          />
        </div>
        <div style="padding: 10px"></div>
        <div class="headbtn">
          <!-- 1 -->
          <a-button @click="Delete" v-has="'outcome:catalog:delete'">删除</a-button>
          <a-button type="primary" @click="compile" v-has="'outcome:catalog:edit'"> 编辑 </a-button>
          <a-button type="primary" @click="submit" v-has="'outcome:catalog:submit'"> 提交 </a-button>
          <a-button @click="sendBack">申请退回</a-button>
          <a-button type="primary" @click="audit" v-has="'outcome:catalog:audit'"> 审核 </a-button>
          <a-button @click="applyIssue" v-has="'outcome:catalog:applyIssue'">发布</a-button>
          <a-button @click="applySoldOut" v-has="'outcome:catalog:soldout'">下架</a-button>
          <a-button @click="applySendBack" v-has="'outcome:catalog:sendback'">退回</a-button>
          <a-button @click="nodeCog" v-has="'outcome:catalog:nodecog'">上传节点报告</a-button>
          <a-button @click="downCog" v-has="'outcome:catalog:downcog'">下载节点报告</a-button>
        </div>
        <div class="wrp">
          <div class="description">
            <div>
              <span>成果推广编号:</span><span>{{ infoList.extension.extensionNumber }}</span>
            </div>
            <div>
              <span>关联的成果:</span><span>{{ infoList.extension.linkAchieveName }}</span>
            </div>
            <div>
              <span>成果所在目录:</span><span>{{ infoList.extension.catalogueName }}</span>
            </div>
            <div>
              <span>成果编号:</span><span>{{ infoList.extension.linkAchieveNumber }}</span>
            </div>
            <div>
              <span>成果配备范围:</span><span>{{ infoList.extension.equipmentRangeText }}</span>
            </div>
            <div>
              <span>填写单位:</span><span>{{ infoList.extension.unitName }}</span>
            </div>
          </div>
        </div>
      </a-card>
      <!-- 采购信息 -->
      <a-card :bordered="false" style="margin-top: 16px">
        <div slot="title" class="grid-title">采购信息</div>
        <div class="content">
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 配备数量 </a-card-grid>
            <a-card-grid class="grid" style="width: 95%">
              {{ infoList.extensionDetail.equipmentAmount }}
            </a-card-grid>
          </div>
          <!--  -->
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 成果单价 </a-card-grid>
            <a-card-grid class="grid" style="width: 95%"> {{ infoList.extensionDetail.unitPrice }} 万元</a-card-grid>
          </div>
          <!--  -->
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 采购总支出 </a-card-grid>
            <a-card-grid class="grid" style="width: 95%"> {{ infoList.extensionDetail.totalPrice }} 万元</a-card-grid>
          </div>
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 合同编号 </a-card-grid>
            <a-card-grid class="grid" style="width: 95%"> {{ infoList.extensionDetail.contractNumber }} </a-card-grid>
          </div>
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 合同期限 </a-card-grid>
            <a-card-grid class="grid" style="width: 95%"> {{ infoList.extensionDetail.contractEndTime }} </a-card-grid>
          </div>
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 合同签订日期 </a-card-grid>
            <a-card-grid class="grid" style="width: 95%"> {{ infoList.extensionDetail.contractSignTime }} </a-card-grid>
          </div>
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 业务部门需求 </a-card-grid>
            <a-card-grid class="grid" style="width: 95%"> {{ infoList.extensionDetail.businessDemand }} </a-card-grid>
          </div>
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 其他部门需求 </a-card-grid>
            <a-card-grid class="grid" style="width: 95%"> {{ infoList.extensionDetail.otherOpinion }} </a-card-grid>
          </div>
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 发票附件 </a-card-grid>
            <a-card-grid class="grid" style="width: 95%; display: flex">
              <a
                target="_blank"
                :href="uploadBaseDomain + item.fileUrl"
                v-for="(item, index) in infoList.extensionDetail.invoiceFiles"
                :key="index"
              >
                <div class="fileAction">
                  <div><a-icon type="paper-clip" /></div>
                  <div class="title">{{ item.fileName }};</div>
                </div>
              </a>
            </a-card-grid>
          </div>
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 合同附件 </a-card-grid>
            <a-card-grid class="grid" style="width: 95%; display: flex">
              <a
                target="_blank"
                :href="uploadBaseDomain + item.fileUrl"
                v-for="(item, index) in infoList.extensionDetail.contractFiles"
                :key="index"
              >
                <div class="fileAction">
                  <div><a-icon type="paper-clip" /></div>
                  <div class="title">{{ item.fileName }};</div>
                </div>
              </a>
            </a-card-grid>
          </div>
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 其他附件 </a-card-grid>
            <a-card-grid class="grid" style="width: 95%; display: flex">
              <a
                target="_blank"
                :href="uploadBaseDomain + item.fileUrl"
                v-for="(item, index) in infoList.extensionDetail.otherFiles"
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
            <a-card-grid class="grid-label"> 成果应用概况 </a-card-grid>
            <a-card-grid class="grid" style="width: 95%">
              {{ infoList.extensionDetail.achieveSurvey }}
            </a-card-grid>
          </div>
          <!--  -->
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 成果的优点 </a-card-grid>
            <a-card-grid class="grid" style="width: 95%"> {{ infoList.extensionDetail.achieveMerit }} </a-card-grid>
          </div>
          <!--  -->
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 成果的不足 </a-card-grid>
            <a-card-grid class="grid" style="width: 95%"> {{ infoList.extensionDetail.achieveDemerit }} </a-card-grid>
          </div>
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 改进建议 </a-card-grid>
            <a-card-grid class="grid" style="width: 95%"> {{ infoList.extensionDetail.improveProposal }} </a-card-grid>
          </div>
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 应用照片 </a-card-grid>
            <a-card-grid class="grid" style="width: 95%; display: flex">
              <div class="fileAction" v-for="(item, index) in infoList.extensionDetail.applyPhotos" :key="index">
                <img style="width: 120px; height: 120px;" :src="uploadBaseDomain + item.fileUrl" alt="" />
              </div>
            </a-card-grid>
          </div>
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 成果推广总结附件 </a-card-grid>
            <a-card-grid class="grid" style="width: 95%; display: flex">
              <a
                target="_blank"
                :href="uploadBaseDomain + item.fileUrl"
                v-for="(item, index) in infoList.extensionDetail.summaryFiles"
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
        @ok="handleSubmit"
        okText="保存"
        @cancel="handleCancel"
        cancelText="关闭"
      >
        <pop-modal-list
          :treeData="treeData"
          :scopeData="scopeData"
          :typeList="typeList"
          :id="id"
          ref="form"
          :infoList="infoList"
        ></pop-modal-list>
      </j-modal>
      <a-modal v-model="auditVisible" @cancel="auditCancel" @ok="auditOk" width="50%" title="审核">
        <AuditForm ref="applys"></AuditForm>
      </a-modal>
      <!-- 上传节点报告 -->
      <a-modal
        width="1200px"
        higth="378px"
        title="上传节点报告"
        :visible="nodeVisible"
        @ok="handleOk"
        okText="保存并提交"
        @cancel="handleCancel"
        cancelText="关闭"
      >
        <node-configuration ref="configuration"></node-configuration>
      </a-modal>
      <!-- 下载节点报告 -->
      <a-modal
        width="1200px"
        higth="378px"
        title="下载节点报告"
        :visible="downVisible"
        @ok="handleCancel"
        okText="确定"
        @cancel="handleCancel"
        cancelText="关闭"
      >
        <down-configuration ref="downConfiguration" :currentModify="infoList.extension"></down-configuration>
      </a-modal>
    </div>
  </page-header-wrapper>
</template>

<script>
import { getAction, deleteAction, postAction, downloadFile, postDownload } from '@/api/manage.js'
import {
  // addAchieveExtension,
  getAchieveExtensionDetail,
  addNoteReport,
  applyAchieve, //审核
  submitAchieveExtension, //提交
  backAchieveExtension, //申请退回
  publishAchieve, //发布
  unpublishAchieve, //下架
  backExtension, //退回
  uploadNoteReport, //上传节点报告
  getAchieveExtension,
  // uploadNoteReport,
  // searchAchieveExtension,
  EdtAchieveExtension,
  // dictItem,
} from '../../../../api/outcome/catalog'
import PageHeaderWrapper from '../../../../components/PageHeaderWrapper'
import NodeConfiguration from '../components/SubmitList/nodeConfiguration'
import DownConfiguration from '../components/ApplyList/downConfiguration'
import AuditForm from '../components/ApplyList/auditForm'
import PopModalList from '../components/SubmitList/popModalList'

const states = {
  100: {
    typeTitle: '采购信息待提交',
    color: '#FAAD14',
  },
  130: {
    typeTitle: '采购信息已退回',
    color: '#FAAD14',
  },
  140: {
    typeTitle: '采购信息审核驳回',
    color: '#FF0000',
  },
  150: {
    typeTitle: '采购信息待审核',
    color: '#FAAD14',
  },
  155: {
    typeTitle: '采购信息待退回',
    color: 'yellow',
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
    typeTitle: '总结待退回',
    color: 'yellow',
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
    color: '#FF0000',
  },
}

export default {
  data() {
    return {
      currentModify: {},
      id: '',
      url: {
        info: '/fire/achieveExtension/queryById', //通过id查询
        delete: '/fire/achieveExtension/delete', //删除
        apply: '/fire/achieveExtension/applyBackExtension', //申请退回
        submit: '/fire/achieveExtension/submitExtension', //提交
      },
      looks: {},
      infoList: {
        extension: {
          processStatus: '130',
        },
        extensionDetail: {},
      }, //列表
      reportVisible: false,
      auditVisible: false,
      nodeVisible: false,
      extensinoMain: {},
      typeList: [],
      downVisible: false,
      // configurationVisible: false,
      // configurationType:''
      scopeData: [],
      treeData: [],
      type: '',
      states,
    }
  },
  mounted() {
    this.$route.params
    console.log(this.$route.params.id)
    this.handleFetchDetail()
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
    NodeConfiguration,
    DownConfiguration,
    AuditForm,
    PopModalList,
  },
  methods: {
    handleFetchDetail() {
      getAchieveExtension(this.$route.params.id).then((res) => {
        this.infoList.extension = res.result
      })
      getAchieveExtensionDetail(this.$route.params.id).then((res) => {
        this.infoList.extensionDetail = res.result
      })
    },
    //下载节点报告弹窗
    downCog() {
      // this.currentModify = record
      this.downVisible = true
    },
    //上传节点报告弹窗
    nodeCog() {
      this.nodeVisible = true
      setTimeout(() => {
        this.$refs.configuration.setFieldsValue(this.infoList.extension.noteReportConfig)
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
          deleteAction(this.url.delete, { id: this.$route.params.id }).then((res) => {
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
          submitAchieveExtension(this.url.submit, { id: this.$route.params.id }).then((res) => {
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
    //申请退回
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
          backAchieveExtension(this.url.apply, { id: this.$route.params.id }).then((res) => {
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
          id: this.$route.params.id,
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
    compile() {
      this.reportVisible = true
      setTimeout(() => {
        this.$refs.form.setFieldsValue(this.infoList)
      })
    },
    //添加/详情弹框确定按钮
    handleOk() {
      // this.reportVisible = false
      this.nodeVisible = false
      this.$refs.configuration.validateFields().then((val) => {
        uploadNoteReport({
          noteReportConfig: val.map((item) => ({
            contentId: item.contentId,
            id: item.id,
            fileName: item.fileName,
            fileUrl: item.fileUrl,
            uploadBy: item.uploadBy,
            uploadTime: item.uploadTime,
          })),
        })
        this.$message.success('保存成功')
        this.nodeVisible = false
        this.handleFetchDetail()
      })
    },
    //打开配置页面
    configuration() {
      this.configurationVisible = true
    },
    //关闭配置页面
    configurationCancel() {
      this.configurationVisible = false
    },
    //配置页面提交
    configurationOk() {
      this.$refs.configuration.validateFields().then((value) => {
        addNoteReport({
          ...value,
          submitStartTime: value.submitStartTime.format('YYYY-MM-DD HH:mm:ss'),
          uploadEndTime: value.uploadEndTime.format('YYYY-MM-DD HH:mm:ss'),
          unitId: this.$store.state.user.info.departId,
          userId: this.$store.state.user.info.id,
          contentIds: this.selection,
        }).then((res) => {
          if (!res.success) {
            this.$message.error(res.message)
            return
          }
          this.configurationCancel()
        })
      })
    },
    //编辑提交
    handleSubmit() {
      this.$refs.form.validateFields().then((val) => {
        EdtAchieveExtension({
          ...val,

          extension: {
            ...val.extension,
            id: this.infoList.extensionDetail.mainId,
          },
          extensionDetail: {
            ...val.extensionDetail,
            id: this.infoList.extensionDetail.id,
          },
        }).then((res) => {
          if (!res.success) {
            this.$message.error(res.message)
            return
          }
          this.handleFetchDetail()
          this.handleCancel()
        })
      })
    },
    //添加/详情弹框取消按钮
    handleCancel() {
      // this.currentModify = {}
      this.reportVisible = false
      this.nodeVisible = false
      this.downVisible = false
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
          publishAchieve(this.$route.params.id).then((res) => {
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
          unpublishAchieve(this.$route.params.id).then((res) => {
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
    //退回
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
          backExtension(this.$route.params.id).then((res) => {
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
  display: flex;
  background: #fafafa;
  display: block;

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