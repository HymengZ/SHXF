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
          <div class="projectName">{{ info.unitName }}</div>
          <span class="box">
            <span>成果示范情况介绍：</span>
            <strong style="color: rgb(250, 84, 28); font-size: 24px">{{ info.data.length }}</strong>
          </span>
          <a-badge :color="info.color" class="numberStyle" :text="info.typeTitle" />
        </div>
        <div style="padding: 10px"></div>
        <div class="headbtn">
          <a-button @click="handleOpenCertificatePhotoUrl">基地证明证件</a-button>
          <a-button @click="Delete" v-has="'outcome:demonstration:delete'">删除</a-button>
          <a-button type="primary" @click="redact"> 编辑 </a-button>
          <a-button
            @click="sendBack"
            v-if="createdUser && info.processStatus === '150'"
            v-has="'outcome:demonstration:sendBack'"
            >申请退回</a-button
          >
          <a-button
            type="primary"
            @click="audit"
            v-if="!createdUser && ['150', '155'].indexOf(info.processStatus) !== -1"
            v-has="'outcome:demonstration:audit'"
          >
            审核
          </a-button>
          <a-button
            @click="applyIssue"
            v-if="!createdUser && info.processStatus === '200'"
            v-has="'outcome:demonstration:applyIssue'"
            >发布</a-button
          >
          <a-button
            @click="applySoldOut"
            v-if="!createdUser && info.processStatus === '800'"
            v-has="'outcome:demonstration:applySoldOut'"
            >下架</a-button
          >
          <a-button
            @click="applySendBack"
            v-if="!createdUser && ['150', '155'].indexOf(info.processStatus) !== -1"
            v-has="'outcome:demonstration:applySendBack'"
            >退回</a-button
          >
        </div>
        <div class="wrp">
          <div class="description">
            <div>
              <span>单位编号:</span><span>{{ info.unitCode }}</span>
            </div>
            <div>
              <span>证书发放时间:</span><span>{{ info.certificateGrantTime }}</span>
            </div>
            <div>
              <span>发布单位:</span><span>{{ info.unitName }}</span>
            </div>
            <div><span>基地信息发布人:</span><span>上海消防</span></div>
            <div>
              <span>示范基地简介:</span>
              <div style="display: block; margin-left: 208px; margin-top: -24px">
                <p>
                  <span style="display: flow-root">{{ info.baseSummary }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </a-card>
      <!-- 单位联系人信息 -->
      <a-card :bordered="false" style="margin-top: 16px" v-if="false">
        <div slot="title" class="grid-title">单位联系人信息</div>
        <div class="content">
          <a-card-grid class="grid-label"> 证件信息 </a-card-grid>
          <a-card-grid class="grid" style="width: 38%"> 基本信息 </a-card-grid>
          <!--  -->
          <a-card-grid class="grid-label"> 联系人姓名 </a-card-grid>
          <a-card-grid class="grid" style="width: 38%"> 基本信息 </a-card-grid>
          <!--  -->
          <a-card-grid class="grid-label"> 所属单位 </a-card-grid>
          <a-card-grid class="grid" style="width: 38%"> 基本信息 </a-card-grid>
          <!--  -->
          <a-card-grid class="grid-label"> 联系电话 </a-card-grid>
          <a-card-grid class="grid" style="width: 38%"> 基本信息 </a-card-grid>
        </div>
      </a-card>

      <!-- 示范基地介绍 -->
      <a-card :bordered="false" style="margin-top: 16px">
        <div slot="title" class="grid-title">示范基地介绍</div>
        <div class="vid">
          <video :src="uploadBaseDomain + this.info.propagateVideoUrl" id="myVideo" controls preload="auto"></video>
        </div>

        <!-- <source type="video/mp4" :src="info.propagateVideoUrl" /> -->
        <p style="text-align: center">{{ info.propagateVideoName }}</p>
        <div v-html="info.baseIntroduce"></div>
      </a-card>
      <!-- 成果示范介绍 -->
      <a-card :bordered="false" style="margin-top: 16px">
        <div slot="title" class="grid-title">成果示范情况介绍</div>
        <div class="table">
          <a-list item-layout="horizontal" :data-source="info.data" :pagination="false" :loading="loading">
            <a-list-item slot="renderItem" slot-scope="item">
              <a-list-item-meta>
                <div slot="description" class="description">
                  <div class="image">
                    <!-- <img style="width: 120px,height:120px;" src="" alt="" /> -->
                  </div>
                  <div class="info">
                    <div style="font-size: 20px; color: #333; margin-bottom: 5px; line-height: 1; font-weight: 600">
                      {{ item.situationSummary }}
                    </div>
                    <div class="rich-text" v-html="item.situationText"></div>
                  </div>
                  <div class="actions">
                    <a-dropdown>
                      <a-button v-has="'outcome:demonstration:more'">更多操作</a-button>
                      <a-menu slot="overlay">
                        <a-menu-item key="edit" @click="handleEdit(item)" v-has="'outcome:demonstration:edits'"
                          >编辑</a-menu-item
                        >
                        <a-menu-item key="delete" @click="handleDelete(item)" v-has="'outcome:demonstration:daletes'"
                          >删除</a-menu-item
                        >
                      </a-menu>
                    </a-dropdown>
                    <a-divider type="vertical" />
                    <a-button ghost type="primary" @click="handleDet(item)">目录详情</a-button>
                  </div>
                </div>
                <h3 slot="title" class="item-title">{{ item.catalogueName }}</h3>
              </a-list-item-meta>
            </a-list-item>
          </a-list>
        </div>
      </a-card>
      <!-- 添加/详情弹框 -->
      <j-modal
        title="示范基地编辑/新增"
        :visible="articleVisible"
        switchFullscreen
        :fullscreen="true"
        @ok="handleOk"
        okText="保存"
        @cancel="handleCancel"
        cancelText="关闭"
      >
        <log-modal ref="form"></log-modal>
      </j-modal>
      <j-modal
        title="示范情况编辑/新增"
        :visible="prticleVisible"
        switchFullscreen
        :fullscreen="true"
        @ok="handleOk"
        okText="保存"
        @cancel="handleCancel"
        cancelText="关闭"
      >
        <look-modal ref="form"></look-modal>
      </j-modal>
      <j-modal
        title="示范情况编辑/新增"
        :visible="articleVisible"
        switchFullscreen
        :fullscreen="true"
        @ok="handleArticleOk"
        okText="保存"
        @cancel="handleCancel"
        cancelText="关闭"
      >
        <look-modal ref="article"></look-modal>
      </j-modal>
      <a-modal v-model="auditVisible" @cancel="auditCancel" @ok="auditOk" width="50%" title="审核">
        <AuditForm ref="apply"> </AuditForm>
      </a-modal>
    </div>
  </page-header-wrapper>
</template>

<script >
import PageHeaderWrapper from '../../../../components/PageHeaderWrapper'
import AuditForm from '../components/ApplyList/auditForm'
import LogModal from '../components/SubmitList/logModal'
import LookModal from '../components/SubmitList/lookModal'
// import { videoPlayer } from '../../../../api/outcome/videoindex'
// import 'video.js/dist/video-js.css'
// import 'vue-video-player/src/custom-theme.css'
// import videojs from 'video.js'
// window.videojs = videojs
import { isEqual } from 'lodash'
import { mapState } from 'vuex'
import {
  addDemonstration,
  fetchDemonstration,
  addDemoSituation,
  fetchDemonstrationDetail,
  fetchAchieveDemoSituation,
  deleteAchieveDemoSituation,
  updateDemonstration,
  updateAchieveDemoSituation,
  deleteDemonstration,
  submitDemonstration,
  publishDemonstration,
  applyBackDemonstration,
  unpublishDemonstration,
  applyDemonstration,
  backDemonstration,
} from '@/api/outcome/demonstration'

const states = {
  100: {
    typeTitle: '基地信息待提交',
    color: '#FAAD14',
  },
  130: {
    typeTitle: '已退回',
    color: '#FF0000',
  },
  140: {
    typeTitle: '基地信息审核驳回',
    color: '#FF0000',
  },
  150: {
    typeTitle: '基地信息待审核',
    color: '#FAAD14',
  },
  155: {
    typeTitle: '待退回',
    color: 'yellow',
  },
  200: {
    typeTitle: '审核通过',
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
      // playerOptions: {
      //   language: 'zh-CN',
      //   sources: [
      //     {
      //       type: 'video/mp4',
      //       src: 'info.propagateVideoUrl',
      //     },
      //   ],
      // },
      list: [{}],
      createdUser: false,
      reportVisible: false,
      auditVisible: false,
      articleVisible: false,
      prticleVisible: false,
      info: {},
      currentModify: {},
      loading: false,
      states,
      // configurationVisible: false,
      // configurationType:''
    }
  },
  components: {
    PageHeaderWrapper,
    AuditForm,
    LogModal,
    LookModal,
    // videoPlayer,
  },
  computed: {
    ...mapState({
      userinfo: (state) => state.user.info,
    }),
    uploadBaseDomain() {
      return process.env.VUE_APP_UPLOAD_BASE_DOMAIN
    },
  },
  mounted() {
    this.handleFetchDetail()
  },
  methods: {
    //播放源
    // setSrc(src, type = '') {
    //   this.playerOptions.sources[0].src = src
    //   this.playerOptions.sources[0].type = type
    // },
    handleOpenCertificatePhotoUrl() {
      window.location.href = this.info.certificatePhotoUrl
    },
    async handleFetchDetail() {
      const res = await fetchDemonstrationDetail({ id: this.$route.query.id })
      const data = await fetchAchieveDemoSituation({ baseId: this.$route.query.id, pageNo: 1, pageSize: 100 })
      this.info = {
        ...res.result,
        ...states[res.result.processStatus],
        data: data.result.records,
      }
      this.createdUser = this.$store.state.user.info.id === this.info.createBy
      console.log('this.createdUser', this.createdUser)
    },
    //跳转详情
    handleDet(record) {
      this.$router.push(`/outcome/demonstration/details?id=${record.id}`)
    },

    //编辑
    addOwn() {},
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
          deleteDemonstration({ id: this.info.id }).then((res) => {
            if (res.code !== 200) {
              this.$message.error(res.message)
              return
            }
            this.$message.success('删除成功')
            this.handleFetchDetail()
          })
        },
      })
    },
    handleArticleOk() {
      this.$refs.article.validateFields().then((item) => {
        updateAchieveDemoSituation({
          ...this.currentModify,
          ...item,
        }).then((res) => {
          if (res.code !== 200) {
            this.$message.error(res.message)
            return
          }
          this.$message.success('修改成功')
          this.handleFetchDetail()
          this.handleCancel()
        })
      })
    },
    handleEdit(record) {
      this.articleVisible = true
      setTimeout(() => {
        this.currentModify = record
        this.$refs.article.setFieldsValue(record)
      })
    },
    handleDelete(record) {
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
          deleteAchieveDemoSituation({ ids: record.id }).then((res) => {
            if (res.code !== 200) {
              this.$message.error(res.message)
              return
            }
            this.$message.success('删除成功')
            this.handleFetchDetail()
          })
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
        onOk() {
          console.log('确定退回')
        },
      })
    },
    //审核
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
        applyDemonstration({
          id: this.info.id,
          ...res,
        }).then((res) => {
          if (res.success) {
            this.reportVisible = false
            this.$message.success('审核成功')
            this.handleFetchList()
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
    //成果推广编辑
    redact() {
      this.articleVisible = true
      setTimeout(() => {
        this.$refs.form.setFieldsValue(this.info)
      })
    },
    //添加/详情弹框确定按钮
    handleOk() {
      this.$refs.form.validateFields().then(async (val) => {
        const addRow = val.data.filter((item) => item.id < 0)
        const deleteRow = this.info.data.filter((item) => !val.data.find((i) => i.id == item.id))
        const updateRow = val.data.filter((item) => {
          const finded = this.info.data.find((i) => i.id == item.id)
          if (finded && !isEqual(finded, item)) {
            return true && item.id > 0
          }
        })
        console.log(val.data)
        const res = await updateDemonstration({
          ...this.info,
          ...val,
        })
        if (res.code !== 200) {
          return this.$message.error(res.message)
        }
        if (deleteRow.length) {
          await deleteAchieveDemoSituation({ ids: deleteRow.map((item) => item.id).join(',') })
        }
        if (updateRow.length) {
          await Promise.all(
            updateRow.map((item) => {
              return updateAchieveDemoSituation({
                ...item,
                baseId: this.info.id,
              }).then((res) => {
                if (res.code != 200) {
                  return Promise.reject(res)
                }
                return res
              })
            })
          )
        }
        if (addRow.length) {
          await Promise.all(
            addRow.map((item) => {
              delete item.id
              return addDemoSituation({
                ...item,
                baseId: this.info.id,
              }).then((res) => {
                if (res.code != 200) {
                  return Promise.reject(res)
                }
                return res
              })
            })
          )
        }
        console.log('修改', updateRow)
        console.log('删除', deleteRow)
        console.log('新增', addRow)
        this.$message.success('编辑成功')
        this.handleFetchDetail()
        this.articleVisible = false
        this.prticleVisible = false
      })
    },
    //添加/详情弹框取消按钮
    handleCancel() {
      this.articleVisible = false
      this.prticleVisible = false
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
          publishDemonstration({ id: this.info.id }).then((res) => {
            if (res.code !== 200) {
              this.$message.error(res.message)
              return
            }
            this.handleFetchDetail()
          })
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
          unpublishDemonstration({ id: this.info.id }).then((res) => {
            if (res.code !== 200) {
              this.$message.error(res.message)
              return
            }
            this.handleFetchDetail()
          })
          console.log('确定下架')
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
          backDemonstration({ id: this.info.id }).then((res) => {
            if (res.code != 200) {
              this.$message.error(res.message)
              return
            }
            this.$message.success('退回成功')
            this.handleFetchDetail()
          })
        },
      })
    },
  },
}
</script>




<style lang="less" scoped>
.rich-text {
  /* autoprefixer: off */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  box-orient: vertical;
  flex-wrap: wrap;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre-line;
  /* autoprefixer: on */
  font-size: 12px;
}
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
  .box {
    display: block;
    float: right;
    font-size: 16px;
    color: #8c8c8c;
    font-weight: 400;
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
}
.table {
  flex: 1;
  margin-top: -20px;
  .description {
    margin-top: 0px;
    margin-bottom: -5px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;
    .actions {
      align-self: flex-end;
    }
    .info {
      flex: 1;
    }
    .image {
      width: 80px;
      height: 80px;
      background: #ccc;
      margin-right: 10px;
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

  #myVideo {
    width: 100%;
    height: 700px;
  }
}
.wrp {
  .description {
    display: block;
    margin: 2% 0;
    // background: #f5f5f5;
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
</style>