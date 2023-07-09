<template>
  <div class="submit-container">
    <div class="search-form">
      <tag-check-box label="项目类别" :options="pojectType" v-model="newstype" />
      <tag-check-box label="项目状态" :options="pojectState" v-model="state" />
    </div>
    <div class="table">
      <a-row class="search" type="flex" justify="start">
        <a-col :span="8">
          <a-input-group compact>
            <a-select v-model="searchParams.searchType" style="display: inline-block; width: 160px">
              <a-select-option value="PROJECT_NAME"> 项目名称 </a-select-option>
              <a-select-option value="PROJECT_number"> 项目编号 </a-select-option>
              <a-select-option value="PROJECT_contacts"> 项目联系人 </a-select-option>
              <a-select-option value="PROJECT_responsible"> 项目负责人 </a-select-option>
              <a-select-option value="PROJECT_unit"> 发布单位 </a-select-option>
            </a-select>
            <a-input style="width: calc(100% - 160px)" allowClear v-model="title" placeholder="请输入" />
          </a-input-group>
        </a-col>
        <a-button type="primary" style="margin-left: 8px" @click="search">搜索</a-button>
      </a-row>
      <div class="tips">
        <a-alert banner>
          <div slot="message" class="message">
            1、项目报备分为项目信息、中期检查、绩效评价三个节点，如是历史数据填写，后两个节点信息请同步编辑；
            <br />
            2、中期检查、绩效评价节点信息提交截止时间，根据项目信息报备时填写的项目节点信息为准，如有变更，请联系后台重修改录入节点配置，避免影响后续操作；
            <br />
            3、已提交的当前无法修改，如需修改/删除请进行申请退回操作，项目如终止，请及时联系后台管理人员。
          </div>
        </a-alert>
      </div>
      <a-card :loading="loading">
        <div class="data" v-for="(item, index) in list" :key="index">
          <div class="icon">
            <a-icon type="container" theme="twoTone" />
          </div>
          <h4 class="content">
            <div class="title">
              <a-row style="display: flex; margin-bottom: 10px">
                <a-col span="16" class="">
                  <div style="width: 50%; display: inline-block">
                    <span>{{ item.projectName }}</span>
                    <a-badge :color="item.color" class="numberStyle" :text="item.typeTitle" />
                  </div>
                  <div class="titleActive" v-if="item.evaluateEndTime != null">
                    绩效评价提交截止时间：{{ item.evaluateEndTime }}
                  </div>
                  <div class="titleActive" v-if="item.inspectEndTime != null">
                    中期检查提交截止时间：{{ item.inspectEndTime }}
                  </div>
                  <!--                  <div class="titleBlue" v-if="item.processStatus === 150">当前流转：姓名【审核单位名称】</div>-->
                </a-col>
              </a-row>
            </div>
            <a-row style="display: flex; margin-bottom: 10px">
              <a-col span="16" class="particulars">
                <div>
                  <div>项目编号：{{ item.projectNumber }}</div>
                  <div>项目类别：{{ territory(item.projectCategory) }}</div>
                  <div>项目联系人：姓名 {{ item.linkRealname }} | 手机号码 {{ item.linkPhone }}</div>
                  <div>项目负责人：姓名 {{ item.directorRealname }} | 手机号码 {{ item.directorPhone }}</div>
                  <div>发布单位：支队/业务处室名称 {{ item.publishUnitName }}</div>
                </div>
                <div>
                  <div>新建时间：{{ item.createTime }}</div>
                  <div v-if="item.submitTime != null">提交时间：{{ item.submitTime }}</div>
                  <div v-if="item.processStatus === '400'">验收完成时间：{{ item.auditTime }}</div>
                  <div v-if="item.auditTime != null">
                    审核时间：{{ item.auditTime }}
                    <a-tooltip>
                      <template slot="title">
                        {{ item.auditOpinion }}
                      </template>
                      <a-icon
                        :style="item.auditOperate === 'pass' ? 'color: gray' : 'color: red'"
                        style="margin-left: 20px"
                        type="info-circle"
                        theme="filled"
                      />
                    </a-tooltip>
                  </div>
                  <div v-if="item.applyBackTime != null">申请退回时间：{{ item.applyBackTime }}</div>
                  <div v-if="item.backTime != null">退回时间：{{ item.backTime }}</div>
                  <div v-if="item.processStatus === '800'">发布时间：{{ item.publishTime }}</div>
                  <div v-if="item.processStatus === '900'">下架时间：{{ item.lowerShelfTime }}</div>
                </div>
              </a-col>
              <a-col span="8">
                <div class="action">
                  <div>
                    <a-dropdown>
                      <a-button>更多操作</a-button>
                      <a-menu slot="overlay">
                        <a-menu-item
                          v-has="'filing:edit'"
                          @click="editReport(item)"
                          v-if="['800', '950'].indexOf(item.processStatus) === -1"
                          >编辑</a-menu-item
                        >
                        <a-menu-item
                          v-has="'filing:delete'"
                          @click="submitDelete(item)"
                          v-if="['800'].indexOf(item.processStatus) === -1"
                          >删除</a-menu-item
                        >
                        <a-menu-item
                          v-has="'filing:interim'"
                          @click="configuration('examine', item)"
                          v-if="item.hasInspect === 1"
                          >中期检查录入配置</a-menu-item
                        >
                        <a-menu-item
                          v-has="'filing:performance'"
                          @click="configuration('evaluate', item)"
                          v-if="['800', '950'].indexOf(item.processStatus) === -1"
                          >绩效评价录入配置</a-menu-item
                        >
                        <a-menu-item
                          v-has="'filing:termination'"
                          @click="termination(item)"
                          v-if="item.processStatus !== '950'"
                          >项目终止</a-menu-item
                        >
                        <a-menu-item
                          v-has="'filing:release'"
                          @click="applyIssue(item)"
                          v-if="item.processStatus === '400'"
                          >发布</a-menu-item
                        >
                        <a-menu-item
                          v-has="'filing:soldOut'"
                          @click="applySoldOut(item)"
                          v-if="item.processStatus === '800'"
                          >下架</a-menu-item
                        >
                        <a-menu-item
                          v-has="'filing:return'"
                          @click="submitSendBack(item)"
                          v-if="['150', '155', '250', '255', '350', '355'].indexOf(item.processStatus) !== -1"
                        >
                          退回
                        </a-menu-item>
                      </a-menu>
                    </a-dropdown>

                    <a-button style="border: 1px solid #40a9ff; color: #40a9ff" @click="journalismInfo(item)"
                      >项目详情</a-button
                    >
                    <a-button
                      v-if="['150', '155', '250', '255', '350', '355'].indexOf(item.processStatus) !== -1"
                      type="primary"
                      @click="audit(item)"
                      >审核</a-button
                    >
                  </div>
                </div>
              </a-col>
            </a-row>
            <div class="tag">
              <a-tag v-for="item in item.fixedKeywordList" :key="item">{{ item }}</a-tag>
              <a-tag v-for="item in item.customKeyword.split('；')" :key="item">{{ item }}</a-tag>
            </div>
          </h4>
        </div>
        <a-pagination
          class="pagination"
          show-size-changer
          show-quick-jumper
          :page-size-options="pageSizeOptions"
          :show-total="(total) => `共： ${total} 条`"
          :total="pagination.total"
          :pageSize="pagination.pageSize"
          :current="pagination.pageNo"
          @showSizeChange="onShowSizeChange"
          @change="pageChange"
        />
      </a-card>
    </div>
    <!-- 添加/详情弹框 -->
    <j-modal
      title="项目报备编辑/新增"
      :visible="reportVisible"
      switchFullscreen
      :fullscreen="true"
      @cancel="handleCancel"
      :footer="null"
    >
      <submit-modal-list
        ref="formRef"
        :type="type"
        :id="id"
        :pojectType="pojectType"
        :infoList="infoList"
        @ok="handleOk"
        @cancel="handleCancel"
      ></submit-modal-list>
    </j-modal>
    <a-modal v-model="auditVisible" @cancel="auditCancel" @ok="auditOk" width="50%" title="审核">
      <AuditForm ref="audit" :id="id" @auditCancel="auditCancel"></AuditForm>
    </a-modal>
    <a-modal
      destroyOnClose
      v-model="configurationVisible"
      :title="configurationType == 'examine' ? '中期检查录入配置' : '绩效评价录入配置'"
      @cancel="configurationCancel"
      @ok="configurationOk"
      width="50%"
    >
      <ApplyConfiguration
        ref="configForm"
        :id="id"
        :infoList="auditInfo"
        @configurationCancel="configurationCancel"
        :configurationType="configurationType"
      ></ApplyConfiguration>
    </a-modal>
  </div>
</template>

<script>
import AuditForm from '../ApplyList/auditForm.vue'
import { getAction, postAction, deleteAction } from '@/api/manage.js'
import TagCheckBox from '../../../components/TagCheckBox'
import SubmitModalList from '../SubmitList/reportModalList.vue'
import ApplyConfiguration from '..//ApplyList/applyConfiguration.vue'
export default {
  data() {
    return {
      type: '',
      id: '',
      infoList: {},
      reportVisible: false,
      auditVisible: false,
      configurationVisible: false,
      searchParams: {
        prizeStatusValue: [''],
        prizeCategoryValue: [''],
        searchType: 'PROJECT_NAME',
      },
      projectName: '',
      loading: false,
      url: {
        list: '/fire/projectReport/list',
        submit: '/fire/projectReport/submitProjectReport',
        sendBack: '/fire/news/sendBack',
        delete: '/fire/projectReport/delete',
        backProjectReport: '/fire/projectReport/backProjectReport',
        publishProjectReport: '/fire/projectReport/publishProjectReport',
        lowerShelfProjectReport: '/fire/projectReport/lowerShelfProjectReport',
        terminationProjectReport: '/fire/projectReport/terminationProjectReport',
        info: '/fire/projectReport/queryById',
      },
      //分页
      pagination: {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      },
      pageSizeOptions: ['5', '10', '15', '20'],
      list: [],
      title: '',
      newstype: [],
      state: [],
      configurationType: '',
      auditInfo: {},
    }
  },
  props: {
    pojectType: {
      type: Array,
      default: [],
      required: false,
    },
    pojectState: {
      type: Array,
      default: [],
      required: false,
    },
  },
  components: {
    TagCheckBox,
    SubmitModalList,
    AuditForm,
    ApplyConfiguration,
  },
  mounted() {
    this.dataList()
  },
  methods: {
    //搜索
    search() {
      this.pagination = {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      }
      this.dataList()
    },
    //列表
    dataList() {
      this.loading = true
      let state
      let newstype
      if (this.newstype.indexOf('') != -1) {
        newstype = []
      } else {
        newstype = this.newstype
      }
      if (this.state.indexOf('') != -1) {
        state = []
      } else {
        state = this.state
      }
      if (this.state.indexOf('155') != -1) {
        let arr = ['255', '355']
        state = state.concat(arr)
      }
      if (this.state.indexOf('130') != -1) {
        let arr = ['230', '330']
        state = state.concat(arr)
      }
      let searchType = {}
      if (this.searchParams.searchType == 'PROJECT_NAME') {
        searchType = { projectName: this.title }
      } else if (this.searchParams.searchType == 'PROJECT_number') {
        searchType = { projectNumber: this.title }
      } else if (this.searchParams.searchType == 'PROJECT_contacts') {
        searchType = { linkRealname: this.title }
      } else if (this.searchParams.searchType == 'PROJECT_responsible') {
        searchType = { directorRealname: this.title }
      } else if (this.searchParams.searchType == 'PROJECT_unit') {
        searchType = { publishUnitName: this.title }
      }
      let params = Object.assign(
        {},
        this.pagination,
        { queryType: 2 },
        searchType,
        { state: state.toString() },
        { projectCategory: newstype.toString() }
      )

      getAction(this.url.list, params).then((res) => {
        if (res.success) {
          this.list = res.result.records
          for (const i of this.list) {
            for (const y of this.pojectState) {
              if (i.processStatus === y.value || y.value.includes(i.processStatus)) {
                i.typeTitle = y.label
                i.color = y.color
              }
            }
          }

          this.pagination.total = res.result.total
        } else {
          this.$message.warning(res.message || '查询失败')
        }
        this.loading = false
      })
    },

    //打开详情
    journalismInfo(e) {
      console.log(e)
      this.$router.push(`/project/filing/preview/${e.id}`)
    },
    //页码改变的回调
    onShowSizeChange(current, pageSize) {
      this.pagination.pageSize = pageSize
      this.dataList()
    },
    //pageSize 变化的回调
    pageChange(e, a) {
      this.pagination.pageNo = e
      this.dataList()
    },
    //新增
    openReport() {
      this.type = 'add'
      this.reportVisible = true
    },
    //编辑
    editReport(e) {
      this.id = e.id
      this.type = 'edit'
      this.dataInfo()
    },
    //详情
    dataInfo() {
      getAction(this.url.info, { id: this.id }).then((res) => {
        if (res.success) {
          this.infoList = res.result
          this.reportVisible = true
          this.$nextTick(() => {
            this.$refs.formRef.$refs.formInfo.info()
            this.$refs.formRef.$refs.interInfo.info()
            this.$refs.formRef.$refs.performance.info()
          })
        } else {
          this.$message.warning(res.message || '查询失败')
        }
      })
    },
    //添加/详情弹框确定按钮
    handleOk() {
      this.dataList()
      this.reportVisible = false
    },
    //添加/详情弹框取消按钮
    handleCancel() {
      this.reportVisible = false
    },
    //项目审核
    audit(e) {
      this.id = e.id
      this.auditVisible = true
    },
    //审核页面
    auditCancel() {
      this.$refs.audit.handleCancel()
      this.dataList()
      this.auditVisible = false
    },
    //审核页面提交
    auditOk() {
      this.$refs.audit.submit()
      this.auditCancel()
    },
    //打开配置页面
    configuration(e, item) {
      if (e == 'examine') {
        //中期检查录入配置页面
        this.configurationType = 'examine'
      } else {
        //绩效评价录入配置页面
        this.configurationType = 'evaluate'
      }
      this.id = item.id
      this.auditInfo = item
      this.configurationVisible = true
    },
    //关闭配置页面
    configurationCancel() {
      this.$refs.configForm.handleCancel()
      this.configurationVisible = false
    },
    //配置页面提交
    configurationOk() {
      this.dataList()
      this.$refs.configForm.submit()
    },
    //发布项目
    applyIssue(e) {
      let that = this
      this.$confirm({
        title: '发布',
        icon: 'exclamation-circle',
        content: '发布后将进入发布列表，删除/编辑/退回请先下架。',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          console.log('确定发布')
          let fd = new FormData()
          fd.append('id', e.id)
          postAction(that.url.publishProjectReport, fd).then((res) => {
            if (res.success) {
              that.$message.success(res.message)
              that.dataList()
            } else {
              that.$message.warning(res.message)
            }
          })
        },
      })
    },
    //下架项目
    applySoldOut(e) {
      let that = this
      that.$confirm({
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
        onOk() {
          console.log('确定下架')
          let fd = new FormData()
          fd.append('id', e.id)
          postAction(that.url.lowerShelfProjectReport, fd).then((res) => {
            if (res.success) {
              that.$message.success(res.message)
              that.dataList()
            } else {
              that.$message.warning(res.message)
            }
          })
        },
      })
    },
    //终止项目
    termination(e) {
      let that = this
      that.$confirm({
        title: '下架',
        icon: 'exclamation-circle',
        content: (
          <div>
            <p>确定终止项目？</p>
            <p>终止项目后该信息将无法删除/编辑/退回。</p>
          </div>
        ),
        okText: '确认',
        cancelText: '取消',
        onOk() {
          let fd = new FormData()
          fd.append('id', e.id)
          postAction(that.url.terminationProjectReport, fd).then((res) => {
            if (res.success) {
              that.$message.success(res.message)
              that.dataList()
            } else {
              that.$message.warning(res.message)
            }
          })
        },
      })
    },
    //退回
    submitSendBack(e) {
      let that = this
      this.$confirm({
        title: '退回',
        icon: 'exclamation-circle',
        content: (
          <div>
            <p>确定退回？</p>
            <p>退回后改信息提交人员即可进行编辑/删除。</p>
          </div>
        ),
        okText: '确认',
        cancelText: '取消',
        onOk() {
          console.log('退回')
          let fd = new FormData()
          fd.append('id', e.id)
          postAction(that.url.backProjectReport, fd).then((res) => {
            if (res.success) {
              that.$message.success(res.message)
              that.dataList()
            } else {
              that.$message.warning(res.message)
            }
          })
        },
      })
    },
    //删除
    submitDelete(e) {
      let that = this
      that.$confirm({
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
        onOk() {
          console.log('确定删除')
          deleteAction(that.url.delete, { id: e.id }).then((res) => {
            if (res.success) {
              that.$message.success(res.message)
              that.dataList()
            } else {
              that.$message.warning(res.message)
            }
          })
        },
      })
    },
    //项目类别重构
    territory(e) {
      if (e == 0) {
        return (e = '其他')
      } else if (e == 1) {
        return (e = '基础研究')
      } else if (e == 2) {
        return (e = '重点研发')
      } else if (e == 3) {
        return (e = '消防管理理论与软科学')
      } else if (e == 4) {
        return (e = '应用创新')
      }
    },
  },
}
</script>

<style lang="less" scoped>
.submit-container {
  background: #f0f2f5;
  .search-form {
    padding: 0 20px 20px;
    background: #fff;
  }
  .table {
    margin-top: 16px;
    background: #fff;
  }
  .search {
    padding: 24px 16px;
    border-bottom: 1px #f0f0f0 solid;
  }
  .tips {
    margin: 14px 15px;
    .message {
      color: rgba(0, 0, 0, 0.65);
      font-size: 14px;
      font-weight: 400;
      line-height: 1.6;
      margin-left: 10px;
    }
  }
  .data {
    padding: 0 14px 15px;
    overflow: hidden;
    display: flex;
    .icon {
      width: 16px;
      height: 16px;
      color: #1890ff;
      margin: 5px 10px 0 10px;
    }
    .content {
      flex: 1 0;
      .title {
        line-height: 24px;
        font-size: 16px;
        .titleActive {
          font-size: 14px;
          width: 50%;
          display: inline-block;
          color: #faad14;
        }
      }
      .particulars {
        display: flex;
        flex-wrap: wrap;
        color: rgb(159, 159, 159);
        div {
          width: 50%;
          white-space: nowrap;
        }
      }
      .action {
        height: 100%;
        text-align: right;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        button {
          margin-left: 10px;
        }
      }
      .tag {
        background: #fafafa;
        padding: 10px;
      }
    }
  }
  .pagination {
    margin-top: 10px;
    float: right;
  }
  .actions {
    margin: 14px 15px;
  }
}
.numberStyle /deep/ .ant-badge-status-dot {
  width: 8px;
  height: 8px;
  margin-left: 7px;
}
</style>
