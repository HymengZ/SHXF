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
          <div class="projectName">{{ infoList.projectName }}</div>
          <a-badge :color="infoList.color" class="numberStyle" :text="infoList.typeTitle" />
        </div>
        <div class="tag">
          <a-tag v-for="(item, index) in this.infoList.tagList" :key="index">{{ item }}</a-tag>
        </div>
        <div class="headbtn">
          <a-button v-has="'filing:delete'" @click="Delete">删除</a-button>
          <a-button v-has="'filing:edit'" type="primary" @click="redact"> 编辑 </a-button>
          <a-button v-has="'filing:submit'" type="primary" @click="submit"> 提交 </a-button>
          <a-button v-has="'filing:applyReturn'" @click="sendBack">申请退回</a-button>
          <a-button v-has="'filing:audit'" type="primary" @click="audit"> 审核 </a-button>
          <a-button v-has="'filing:interim'" @click="configuration('examine')" v-if="infoList.hasInspect === 1"
            >中期检查录入配置</a-button
          >
          <a-button v-has="'filing:performance'" @click="configuration('evaluate')">绩效评价录入配置</a-button>
          <a-button v-has="'filing:release'" @click="applyIssue">发布</a-button>
          <a-button v-has="'filing:soldOut'" @click="applySoldOut">下架</a-button>
          <a-button v-has="'filing:return'" @click="applySendBack">退回</a-button>
        </div>
        <div class="description" style="display: flex">
          <div style="text-align: right">
            <div>项目编号:</div>
            <div>项目类别:</div>
            <div>发布单位:</div>
            <div>项目发布人:</div>
            <div>关联的指南:</div>
            <div>关联的科技需求:</div>
            <div>关注的话题:</div>
            <div>预期成果:</div>
          </div>
          <div>
            <div>
              <span>{{ infoList.projectNumber }}</span>
            </div>
            <div>
              <span>{{ projectCategory(infoList.projectCategory) }}</span>
            </div>
            <div>
              <span>{{ infoList.publishUnitName }}</span>
            </div>
            <div>
              <span>{{ infoList.publishUserRealname }}</span>
            </div>
            <div>
              <span>{{ infoList.guideName || '无' }}</span>
            </div>
            <div>
              <span>{{ infoList.demandId || '无' }}</span>
            </div>
            <div>
              <span>{{ infoList.followTopic || '无' }}</span>
            </div>
            <div>
              <span>{{ infoList.expectAchieveText }}</span>
            </div>
          </div>
        </div>
        <div class="plan">
          <div class="content">
            <a-icon type="money-collect" />
            <div>
              <div>
                <span>总预算</span>
                <span class="emphasis">{{ infoList.totalBudget }}万元</span>
              </div>
              <div>
                <span>专项资金</span>
                <span>{{ infoList.specialFund }}万元</span>
              </div>
              <div>
                <span>其他来源资金</span>
                <span>{{ infoList.otherFund }}万元</span>
              </div>
            </div>
          </div>
          <div class="content">
            <a-icon type="history" />
            <div>
              <div>
                <span>实施周期</span>
                <span class="emphasis">{{ infoList.cycleMonths }}个月</span>
              </div>
              <div>
                <span>项目周期</span>
                <span>{{ infoList.cycleStartTime }}至{{ infoList.cycleEndTime }}</span>
              </div>
              <div>
                <span>是否有中期检查</span>
                <span>{{ infoList.hasInspect === 1 ? '是' : '否' }}</span>
              </div>
              <div v-if="infoList.inspectTime != null">
                <span>中期检查节点时间</span>
                <span>{{ infoList.inspectTime }}</span>
              </div>
              <div>
                <span>绩效评价节点时间</span>
                <span>{{ infoList.evaluateTime }}</span>
              </div>
            </div>
          </div>
          <div class="content">
            <a-icon type="book" />
            <div>
              <div>
                <span>科技项目成果</span>
                <span class="emphasis">{{ infoList.scienceAchieveNumsTotal }}个</span>
              </div>
              <div>
                <span>科技项目成果审核通过</span>
                <span>{{ infoList.scienceAchieveNumsPass }}个</span>
              </div>
            </div>
          </div>
        </div>
      </a-card>
      <!-- 项目联系人信息 -->
      <a-card :bordered="false" style="margin-top: 16px">
        <div slot="title" class="grid-title">项目联系人信息</div>
        <div class="content">
          <a-card-grid class="grid-label"> 证件信息 </a-card-grid>
          <a-card-grid class="grid"> {{ infoList.linkCertId }} </a-card-grid>
          <!--  -->
          <a-card-grid class="grid-label"> 联系人姓名 </a-card-grid>
          <a-card-grid class="grid"> {{ infoList.linkRealname }} </a-card-grid>
          <!--  -->
          <a-card-grid class="grid-label"> 所属单位 </a-card-grid>
          <a-card-grid class="grid"> {{ infoList.linkUnitName }} </a-card-grid>
          <!--  -->
          <a-card-grid class="grid-label"> 联系电话 </a-card-grid>
          <a-card-grid class="grid"> {{ infoList.linkPhone }} </a-card-grid>
        </div>
      </a-card>
      <!-- 项目负责人 -->
      <a-card :bordered="false" style="margin-top: 16px">
        <div slot="title" class="grid-title">项目负责人信息</div>
        <div class="content">
          <a-card-grid class="grid-label"> 证件信息 </a-card-grid>
          <a-card-grid class="grid"> {{ infoList.directorCertId }} </a-card-grid>
          <!--  -->
          <a-card-grid class="grid-label"> 所属单位 </a-card-grid>
          <a-card-grid class="grid"> {{ infoList.directorUnitName }} </a-card-grid>
          <!--  -->
          <a-card-grid class="grid-label"> 姓名 </a-card-grid>
          <a-card-grid class="grid"> {{ infoList.directorRealname }} </a-card-grid>
          <!--  -->
          <a-card-grid class="grid-label"> 性别 </a-card-grid>
          <a-card-grid class="grid">
            {{ infoList.directorSex == 0 ? '未知' : infoList.directorSex == 1 ? '男' : '女' }}
          </a-card-grid>
          <!--  -->
          <a-card-grid class="grid-label"> 联系电话 </a-card-grid>
          <a-card-grid class="grid"> {{ infoList.directorPhone }} </a-card-grid>
          <!--  -->
          <a-card-grid class="grid-label"> 出生年月 </a-card-grid>
          <a-card-grid class="grid"> {{ infoList.directorBirthday }} </a-card-grid>
          <!--  -->
          <a-card-grid class="grid-label"> 职务 </a-card-grid>
          <a-card-grid class="grid"> {{ infoList.directorPost }} </a-card-grid>
          <!--  -->
          <a-card-grid class="grid-label"> 最高学历 </a-card-grid>
          <a-card-grid class="grid"> {{ directerDegree(infoList.directerDegree) }} </a-card-grid>
          <!--  -->
          <a-card-grid class="grid-label"> 职称 </a-card-grid>
          <a-card-grid class="grid"> {{ directerTitle(infoList.directerTitle) }} </a-card-grid>
          <!--  -->
          <a-card-grid class="grid-label"> 电子邮箱 </a-card-grid>
          <a-card-grid class="grid"> {{ infoList.directerEmail }} </a-card-grid>
        </div>
      </a-card>
      <!-- 参与单位 -->
      <a-card :bordered="false" style="margin-top: 16px">
        <div slot="title" class="grid-title">参与单位</div>
        <div class="content">
          <a-table :pagination="false" bordered :data-source="infoList.projectUnits" :columns="unitColumns">
            <template slot="xmcy" slot-scope="text">
              <div>
                <a @click.prevent="">{{ text }}</a>
              </div>
            </template>
            <template slot="unitType" slot-scope="text">
              <div>
                <span @click.prevent="">{{ unit(text) }}</span>
              </div>
            </template>
          </a-table>
        </div>
      </a-card>
      <!-- 参与人员 -->
      <a-card :bordered="false" style="margin-top: 16px">
        <div slot="title" class="grid-title">参与人员信息</div>
        <div class="content">
          <a-table :pagination="false" bordered :data-source="infoList.projectUsers" :columns="personnelColumns">
            <template slot="userType" slot-scope="text">
              <div>
                <span @click.prevent="">{{ user(text) }}</span>
              </div>
            </template>
            <template slot="certId" slot-scope="text, scoped">
              <div>
                <span @click.prevent="">{{ scoped.certTypeName }}:{{ text }}</span>
              </div>
            </template>
            <template slot="ssdw" slot-scope="text">
              <div>
                <a @click.prevent="">{{ text }}</a>
              </div>
            </template>
          </a-table>
        </div>
      </a-card>
      <!-- 项目其他信息 -->
      <a-card :bordered="false" style="margin-top: 16px">
        <div slot="title" class="grid-title">项目其他信息</div>
        <div class="content">
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 项目摘要 </a-card-grid>
            <a-card-grid class="grid" style="width: 80%">
              {{ infoList.description }}
            </a-card-grid>
          </div>
          <!--  -->
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 项目合同 </a-card-grid>
            <a-card-grid class="grid" style="width: 80%; display: flex">
              <div class="fileAction" v-for="(item, index) in infoList.contractFiles" :key="index">
                <div><a-icon type="paper-clip" /></div>
                <div class="title" @click="fileDownload(item.fileUrl, item.fileName)">{{ item.fileName }};</div>
              </div>
            </a-card-grid>
          </div>
          <!--  -->
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 其他附件 </a-card-grid>
            <a-card-grid class="grid" style="width: 80%; display: flex">
              <div class="fileAction" v-for="(item, index) in infoList.otherFiles" :key="index">
                <div><a-icon type="paper-clip" /></div>
                <div class="title" @click="fileDownload(item.fileUrl, item.fileName)">{{ item.fileName }};</div>
              </div>
            </a-card-grid>
          </div>
        </div>
      </a-card>

      <!-- 中期检查信息 -->
      <a-card :bordered="false" style="margin-top: 16px" v-if="infoList.hasInspect === 1">
        <div slot="title" class="grid-title">中期检查信息</div>
        <div class="content">
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 中期检查节点时间 </a-card-grid>
            <a-card-grid class="grid" style="width: 80%"> {{ infoList.inspectTime }}</a-card-grid>
          </div>
          <!--  -->
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 说明 </a-card-grid>
            <a-card-grid class="grid" style="width: 80%">
              {{ infoList.inspectExplain }}
            </a-card-grid>
          </div>
          <!--  -->
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 中期检查报告 </a-card-grid>
            <a-card-grid class="grid" style="width: 80%">
              <div
                class="fileAction"
                v-if="infoList.inspectReportName"
                @click="fileDownload(infoList.inspectReportUrl, infoList.inspectReportName)"
              >
                <div><a-icon type="paper-clip" /></div>
                <div class="title">{{ infoList.inspectReportName }};</div>
              </div>
            </a-card-grid>
          </div>
        </div>
      </a-card>

      <!-- 绩效评价信息 -->
      <a-card :bordered="false" style="margin-top: 16px">
        <div slot="title" class="grid-title">绩效评价信息</div>
        <div class="content">
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 绩效评价节点时间 </a-card-grid>
            <a-card-grid class="grid" style="width: 80%">{{ infoList.evaluateTime }} </a-card-grid>
          </div>
          <!--  -->
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 说明 </a-card-grid>
            <a-card-grid class="grid" style="width: 80%">
              {{ infoList.evaluateExplain }}
            </a-card-grid>
          </div>
          <!--  -->
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 绩效自评价报告 </a-card-grid>
            <a-card-grid class="grid" style="width: 80%">
              <div
                class="fileAction"
                v-if="infoList.explainReportName"
                @click="fileDownload(infoList.explainReportUrl, infoList.explainReportName)"
              >
                <div><a-icon type="paper-clip" /></div>
                <div class="title">{{ infoList.explainReportName }};</div>
              </div>
            </a-card-grid>
          </div>
          <!--  -->
          <div class="grid-wrapper">
            <a-card-grid class="grid-label"> 项目验收材料 </a-card-grid>
            <a-card-grid class="grid" style="width: 80%; display: flex">
              <div class="fileAction" v-for="(item, index) in infoList.acceptFiles" :key="index">
                <div><a-icon type="paper-clip" /></div>
                <div class="title" @click="fileDownload(item.fileUrl, item.fileName)">{{ item.fileName }};</div>
              </div>
            </a-card-grid>
          </div>
        </div>
      </a-card>
      <!-- 科技项目成果录入信息 -->
      <a-card :bordered="false" style="margin-top: 16px">
        <div slot="title" class="grid-title">科技项目成果录入信息</div>
        <div class="content">
          <a-table :pagination="false" bordered :data-source="infoList.scienceAchieves" :columns="enteringColumns">
            <template slot="action" slot-scope="text, scoped">
              <div>
                <a @click.prevent="achievement(scoped)">查看成果详情</a>
              </div>
            </template>
          </a-table>
        </div>
      </a-card>
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
          :id="this.id"
          :pojectType="pojectType"
          :infoList="infoList"
          @ok="handleOk"
          @cancel="handleCancel"
        ></submit-modal-list>
      </j-modal>
      <a-modal v-model="auditVisible" @cancel="auditCancel" @ok="auditOk" width="50%" title="审核">
        <AuditForm ref="audit" @dataInfo="dataInfo" :id="id" @auditCancel="auditCancel"></AuditForm>
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
          @dataInfo="dataInfo"
          :infoList="infoList"
          @configurationCancel="configurationCancel"
          :configurationType="configurationType"
        ></ApplyConfiguration>
      </a-modal>
    </div>
  </page-header-wrapper>
</template>

<script>
const unitColumns = [
  {
    title: '序号',
    dataIndex: 'orderIndex',
    key: 'orderIndex',
    align: 'center',
    width: 80,
  },
  {
    title: '项目参与单位名称',
    dataIndex: 'unitName',
    key: 'unitName',
    align: 'center',
    scopedSlots: { customRender: 'xmcy' },
  },
  {
    title: '单位类型',
    dataIndex: 'unitType',
    key: 'unitType',
    align: 'center',
    scopedSlots: { customRender: 'unitType' },
  },
  {
    title: '统一社会信用代码',
    dataIndex: 'unitCreditCode',
    key: 'unitCreditCode',
    align: 'center',
  },
]

const unitData = [
  {
    serial: 1,
    xmcy: '单位名称',
    dwlx: '单位类型',
    xydm: '统一社会信用代码',
  },
]

const personnelColumns = [
  {
    title: '序号',
    dataIndex: 'orderIndex',
    key: 'orderIndex',
    align: 'center',
    width: 80,
  },
  {
    title: '参与人类型',
    dataIndex: 'userType',
    key: '',
    align: 'center',
    scopedSlots: { customRender: 'userType' },
  },
  {
    title: '参与人证件信息',
    dataIndex: 'certId',
    key: 'certId',
    align: 'center',
    scopedSlots: { customRender: 'certId' },
  },
  {
    title: '参与人姓名',
    dataIndex: 'realname',
    key: 'realname',
    align: 'center',
  },
  {
    title: '参与人所属单位',
    dataIndex: 'unitName',
    key: 'unitName',
    align: 'center',
    scopedSlots: { customRender: 'ssdw' },
  },
]

const personnelData = [
  {
    serial: 1,
    cyrlx: '参与人类型',
    zjxx: '参与人证件信息',
    cyrxm: '参与人姓名',
    ssdw: '参与人所属单位',
  },
]

const enteringColumns = [
  {
    title: '序号',
    dataIndex: 'serial',
    key: 'serial',
    align: 'center',
    width: 80,
  },
  {
    title: '成果名称',
    dataIndex: 'achieveName',
    key: 'achieveName',
    align: 'center',
  },
  {
    title: '成果编号',
    dataIndex: 'achieveNumber',
    key: 'achieveNumber',
    align: 'center',
  },
  {
    title: '成果类型',
    dataIndex: 'achieveCategoryName',
    key: 'achieveCategoryName',
    align: 'center',
  },
  {
    title: '查看成果详情',
    dataIndex: 'action',
    key: 'action',
    align: 'center',
    scopedSlots: { customRender: 'action' },
  },
]

const enteringtData = [
  {
    serial: 1,
    cgmc: '成果名称',
    cgbh: '成果编号',
    cglx: '成果类型',
    action: '查看成果详情',
  },
]

const PRIZE_CATEGORY_EMNU = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '基础研究',
    value: '1',
  },
  {
    label: '重点研发',
    value: '2',
  },
  {
    label: '消防管理理论与软科学',
    value: '3',
  },
  {
    label: '应用创新',
    value: '4',
  },
  {
    label: '其他',
    value: '0',
  },
]
const PRIZE_STATUS_EMNU = [
  {
    label: '项目信息待提交',
    value: '100',
    color: '#FAAD14',
  },
  {
    label: '已退回',
    value: '130',
    color: 'red',
  },
  {
    label: '项目信息审核驳回',
    value: '140',
    color: 'red',
  },
  {
    label: '项目信息待审核',
    value: '150',
    color: '#FAAD14',
  },
  {
    label: '项目信息待退回',
    value: '155',
    color: '#FAAD14',
  },
  {
    label: '中期检查待提交',
    value: '200',
    color: '#FAAD14',
  },
  {
    label: '中期检查审核驳回',
    value: '230',
    color: 'red',
  },
  {
    label: '中期检查已退回',
    value: '240',
    color: 'red',
  },
  {
    label: '中期检查待审核',
    value: '250',
    color: '#FAAD14',
  },
  {
    label: '中期检查待退回',
    value: '255',
    color: '#FAAD14',
  },
  {
    label: '绩效评价待提交',
    value: '300',
    color: '#FAAD14',
  },
  {
    label: '绩效评价审核驳回',
    value: '330',
    color: 'red',
  },
  {
    label: '绩效评价已退回',
    value: '340',
    color: 'red',
  },
  {
    label: '绩效评价待审核',
    value: '350',
    color: '#FAAD14',
  },
  {
    label: '绩效评价待退回',
    value: '355',
    color: '#FAAD14',
  },
  {
    label: '验收完成',
    value: '400',
    color: 'green',
  },
  {
    label: '已发布',
    value: '800',
    color: 'green',
  },
  {
    label: '已下架',
    value: '900',
    color: '#808080',
  },
]
import { getAction, postAction, downloadFile, postDownload, deleteAction } from '@/api/manage.js'
import PageHeaderWrapper from '../../../../components/PageHeaderWrapper'
import AuditForm from '../components/ApplyList/auditForm.vue'
import ApplyConfiguration from '../components/ApplyList/applyConfiguration.vue'
import SubmitModalList from '../components/SubmitList/reportModalList.vue'
export default {
  data() {
    return {
      id: '',
      url: {
        info: '/fire/projectReport/queryById',
        delete: '/fire/projectReport/delete',
        submit: '/fire/projectReport/submitProjectReport',
        applyBackProjectReport: '/fire/projectReport/applyBackProjectReport',
        publishProjectReport: '/fire/projectReport/publishProjectReport',
        lowerShelfProjectReport: '/fire/projectReport/lowerShelfProjectReport',
        backProjectReport: '/fire/projectReport/backProjectReport',
      },
      type: 'edit',
      infoList: {},
      unitColumns: unitColumns,
      unitData: unitData,
      personnelColumns: personnelColumns,
      personnelData: personnelData,
      enteringColumns: enteringColumns,
      enteringtData: enteringtData,
      pojectType: PRIZE_CATEGORY_EMNU,
      pojectState: PRIZE_STATUS_EMNU,
      reportVisible: false,
      auditVisible: false,
      configurationVisible: false,
      configurationType: '',
      educationList: [],
      workList: [],
      unitList: [],
      userList: [],
      modalityList: [
        {
          label: '新理论',
          value: '1',
        },
        {
          label: '新原理',
          value: '2',
        },
        {
          label: '新产品',
          value: '3',
        },
        {
          label: '关键部件',
          value: '4',
        },
        {
          label: '软件',
          value: '5',
        },
        {
          label: '应用解决方案',
          value: '6',
        },
        {
          label: '实验装置/系统',
          value: '7',
        },
        {
          label: '工程工艺',
          value: '8',
        },
        {
          label: '标准',
          value: '9',
        },
        {
          label: '论文',
          value: '10',
        },
        {
          label: '专利',
          value: '11',
        },
        {
          label: '研究报告',
          value: '12',
        },
        {
          label: '其他',
          value: '13',
        },
      ],
      expectAchieveText: '',
    }
  },
  components: {
    PageHeaderWrapper,
    AuditForm,
    ApplyConfiguration,
    SubmitModalList,
  },
  mounted() {
    //学历列表
    this.education()
    //获取id
    this.id = this.$route.params.id
    //获取详情
    this.dataInfo()
    //职称
    this.workType()
    //单位类型
    this.unitType()
    //参与人类型
    this.userType()
  },
  methods: {
    //参与人类型
    userType() {
      getAction('/sys/dict/getDictItems/project_user_type', { type: 'project_user_type' }).then((res) => {
        if (res.success) {
          this.userList = res.result
        } else {
          this.$message.warning(res.message || '查询失败')
        }
      })
    },
    //参与人类型
    user(e) {
      for (const i of this.userList) {
        if (e == i.value) {
          return i.title
        }
      }
    },
    //获取单位类型
    unitType() {
      getAction('/sys/dict/getDictItems/unit_type', { type: 'unit_type' }).then((res) => {
        if (res.success) {
          this.unitList = res.result
        } else {
          this.$message.warning(res.message || '查询失败')
        }
      })
    },
    //格式化单位类型
    unit(e) {
      for (const i of this.unitList) {
        if (e == i.value) {
          return i.title
        }
      }
    },
    //职称列表
    workType() {
      getAction('/sys/dict/getDictItems/work_title', { type: 'work_title' }).then((res) => {
        if (res.success) {
          this.workList = res.result
        } else {
          this.$message.warning(res.message || '查询失败')
        }
      })
    },
    //格式化职称
    directerTitle(e) {
      for (const i of this.workList) {
        if (e == i.value) {
          return i.title
        }
      }
    },
    //学历
    education() {
      getAction('/sys/dict/getDictItems/high_degree', { type: 'high_degree' }).then((res) => {
        if (res.success) {
          this.educationList = res.result
        } else {
          this.$message.warning(res.message || '查询失败')
        }
      })
    },
    //最高学历
    directerDegree(e) {
      for (const i of this.educationList) {
        if (e == i.value) {
          return i.title
        }
      }
    },
    //项目类别
    projectCategory(e) {
      if (e == 0) {
        return '其他'
      } else if (e == 1) {
        return '基础研究'
      } else if (e == 2) {
        return '重点研发'
      } else if (e == 3) {
        return '消防管理理论与软科学'
      } else if (e == 4) {
        return '应用创新'
      }
    },
    //附件下载
    fileDownload(fileUrl, fileName) {
      downloadFile(fileUrl, fileName)
    },
    //详情
    dataInfo() {
      getAction(this.url.info, { id: this.id }).then((res) => {
        if (res.success) {
          this.infoList = res.result
          let arr = this.infoList.customKeyword ? this.infoList.customKeyword.split('；') : []
          this.infoList.tagList = arr.concat(this.infoList.fixedKeywordList)

          for (const y of this.pojectState) {
            if (this.infoList.processStatus == y.value) {
              this.infoList.typeTitle = y.label
              this.infoList.color = y.color
            }
          }
          for (let i = 0; i < this.infoList.scienceAchieves.length; i++) {
            this.infoList.scienceAchieves[i].serial = i + 1
          }
          let expectAchieves = this.infoList.expectAchieve.split(',')
          let expectAchieveText = this.modalityList
            .filter((item) => expectAchieves.indexOf(item.value) !== -1)
            .map((item) => item.label)
            .join('，');
          if (this.infoList.expectAchieveStr) {
            expectAchieveText.concat('，', this.infoList.expectAchieveStr)
          }
          this.infoList.expectAchieveText = expectAchieveText
        } else {
          this.$message.warning(res.message || '查询失败')
        }
      })
    },
    //删除项目
    Delete() {
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

          deleteAction(that.url.delete, { id: that.id }).then((res) => {
            if (res.success) {
              // that.dataInfo()
              that.$message.success(res.message)
            } else {
              that.$message.warning(res.message)
            }
          })
        },
      })
    },
    //提交
    submit() {
      let that = this
      that.$confirm({
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
        onOk() {
          let fd = new FormData()
          fd.append('id', that.id)
          postAction(that.url.submit, fd).then((res) => {
            if (res.success) {
              that.$message.success(res.message)
              that.dataInfo()
            } else {
              that.$message.warning(res.message)
            }
          })
        },
      })
    },
    //退回
    sendBack() {
      let that = this
      that.$confirm({
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
          let fd = new FormData()
          fd.append('id', that.id)
          postAction(that.url.applyBackProjectReport, fd).then((res) => {
            if (res.success) {
              that.$message.success(res.message)
              that.dataInfo()
            } else {
              that.$message.warning(res.message)
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
      this.$refs.audit.handleCancel()
      this.auditVisible = false
    },
    //审核页面提交
    auditOk() {
      this.$refs.audit.submit()
      // this.auditCancel()
    },
    //项目编辑
    redact() {
      this.reportVisible = true
      this.$nextTick(() => {
        this.$refs.formRef.$refs.formInfo.info()
        this.$refs.formRef.$refs.interInfo.info()
        this.$refs.formRef.$refs.performance.info()
      })
    },
    //添加/详情弹框确定按钮
    handleOk() {
      this.dataInfo()
      this.reportVisible = false
    },
    //添加/详情弹框取消按钮
    handleCancel() {
      this.reportVisible = false
    },
    //打开配置页面
    configuration(e) {
      if (e == 'examine') {
        //中期检查录入配置页面
        this.configurationType = 'examine'
      } else {
        //绩效评价录入配置页面
        this.configurationType = 'evaluate'
      }
      this.configurationVisible = true
    },
    //关闭配置页面
    configurationCancel() {
      this.$refs.configForm.handleCancel()
      this.configurationVisible = false
    },
    //配置页面提交
    configurationOk() {
      this.$refs.configForm.submit()
    },
    //发布项目
    applyIssue() {
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
          fd.append('id', that.id)
          postAction(that.url.publishProjectReport, fd).then((res) => {
            if (res.success) {
              that.$message.success(res.message)
              that.dataInfo()
            } else {
              that.$message.warning(res.message)
            }
          })
        },
      })
    },
    //下架项目
    applySoldOut() {
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
          fd.append('id', that.id)
          postAction(that.url.lowerShelfProjectReport, fd).then((res) => {
            if (res.success) {
              that.$message.success(res.message)
              that.dataInfo()
            } else {
              that.$message.warning(res.message)
            }
          })
        },
      })
    },
    //退回项目
    applySendBack() {
      let that = this
      that.$confirm({
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
        onOk() {
          console.log('确定退回')
          let fd = new FormData()
          fd.append('id', that.id)
          postAction(that.url.backProjectReport, fd).then((res) => {
            if (res.success) {
              that.$message.success(res.message)
              that.dataInfo()
            } else {
              that.$message.warning(res.message)
            }
          })
        },
      })
    },
    //跳转成果详情
    achievement(e) {
      this.$router.push(`/project/achievements/preview/${e.id}`)
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
  padding: 2% 6% 2%;
  margin: 10px 0;
  line-height: 182%;
  font-size: 14px;
  color: #8c8c8c;
  background: #fafafa;
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
      .fileAction {
        display: flex;
        padding: 0 10px;
        .title {
          color: #1890ff;
          margin-left: 5px;
          cursor: pointer;
        }
      }
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
.numberStyle /deep/ .ant-badge-status-dot {
  width: 8px;
  height: 8px;
  margin-left: 7px;
}
.tag {
  background: #fafafa;
  padding: 10px;
}
</style>