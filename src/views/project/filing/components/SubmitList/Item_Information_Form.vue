<template>
  <div>
    <a-form :form="form">
      <a-card title="项目基本信息">
        <a-row type="flex" justify="space-between" align="top">
          <!-- <a-col :span="11">
            <a-form-item label="项目指南">
              <selectt :url="url.scienceGuide" v-decorator="['select', validatorRules.projectName]"></selectt>
            </a-form-item>
          </a-col> -->
          <a-col :span="11">
            <a-form-item label="项目名称">
              <a-input
                allowClear
                v-decorator="['projectName', validatorRules.projectName]"
                placeholder="请输入"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="项目编号">
              <a-input
                allowClear
                v-decorator="['projectNumber', validatorRules.projectNumber]"
                placeholder="请输入"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="项目类别">
              <a-select
                placeholder="请选择"
                allowClear
                v-decorator="['projectCategory', validatorRules.projectCategory]"
              >
                <a-select-option :value="item.value" v-for="(item, index) in pojectType" :key="index">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="发布单位">
              <a-input
                allowClear
                disabled
                v-decorator="['publishUnitId', validatorRules.publishUnitId]"
                placeholder="自动读取"
                v-show="false"
              ></a-input>
              <a-input allowClear disabled v-decorator="['unit', validatorRules.unit]" placeholder="自动读取"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="项目发布人">
              <a-input
                allowClear
                v-decorator="['publishUserId', validatorRules.publishUserId]"
                disabled
                placeholder="自动读取"
                v-show="false"
              ></a-input>
              <a-input
                allowClear
                v-decorator="['person', validatorRules.person]"
                disabled
                placeholder="自动读取"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="专项资金（万元）">
              <a-input
                allowClear
                @change="validatorRule"
                v-decorator="['specialFund', validatorRules.specialFund]"
                placeholder="00.00"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="其他来源资金（万元）">
              <a-input
                allowClear
                @change="validatorRule"
                v-decorator="['otherFund', validatorRules.otherFund]"
                placeholder="00.00"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="总预算（万元）">
              <a-input
                allowClear
                disabled
                v-decorator="['totalBudget', validatorRules.totalBudget]"
                placeholder="自动计算"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="项目周期">
              <a-range-picker
                allowClear
                style="width: 100%"
                :show-time="{ format: 'HH:mm' }"
                v-decorator="['Time', validatorRules.createTime]"
                @change="onChangeRangePicker"
              />
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="实施周期（月）">
              <a-input
                allowClear
                disabled
                placeholder="自动计算"
                v-decorator="['cycleMonths', validatorRules.cycleMonths]"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="项目是否有中期检查">
              <a-radio-group
                v-decorator="['hasInspect', validatorRules.hasInspect]"
                style="width: 100%"
                @change="handleHasInspectChange"
                name="radioGroup"
              >
                <a-radio :value="1"> 是 </a-radio>
                <a-radio :value="0"> 否 </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="中期检查节点时间" v-if="hasInspect === 1">
              <a-date-picker
                show-time
                allowClear
                v-decorator="['inspectTime', validatorRules.inspectTime]"
                style="width: 100%"
                @change="inspectTime"
              />
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="绩效评价节点时间">
              <a-date-picker
                show-time
                allowClear
                v-decorator="['evaluateTime', validatorRules.evaluateTime]"
                style="width: 100%"
                @change="evaluateTime"
              />
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="关联的指南">
              <a-select placeholder="请选择" v-decorator="['guideId']">
                <a-select-option v-for="(item, index) in guideList" :key="index" :value="item.id">
                  {{ item.title }}
                </a-select-option>
              </a-select>
              <!-- <selectt :url="url.scienceGuide" :type="'guideId'"  v-decorator="['guideId']"></selectt> -->
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="关联的科技需求">
              <a-select placeholder="请选择" v-decorator="['demandId']" allowClear>
                <a-select-option value="jack"> Jack </a-select-option>
                <a-select-option value="lucy"> Lucy </a-select-option>
                <a-select-option value="disabled" disabled> Disabled </a-select-option>
                <a-select-option value="Yiminghe"> yiminghe </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="关注的话题（可多选）">
              <a-select mode="multiple" placeholder="请选择" v-decorator="['followTopic']">
                <a-select-option v-for="(item, index) in topicList" :key="index" :value="item.id">
                  {{ item.title }}
                </a-select-option>
              </a-select>
              <!-- <selectt :mode="'multiple'" :url="url.topic" :type="'followTopic'" v-decorator="['followTopic']"></selectt> -->
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="固定的关键词（可多选）">
              <a-select
                mode="multiple"
                placeholder="请选择"
                v-decorator="['fixedKeyword', validatorRules.fixedKeyword]"
              >
                <a-select-option v-for="(item, index) in keywordList" :key="index" :value="item.id">
                  {{ item.keyword }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="自设关键词（可输入多个字段，“；”分割）">
              <a-input
                placeholder="请输入"
                allowClear
                v-decorator="['customKeyword', validatorRules.customKeyword]"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card title="预期成果形式">
        <a-form-item label="预期成果(可多选)">
          <a-checkbox-group
            v-decorator="['expectAchieve', validatorRules.expectAchieve]"
            class="checkbox"
            :options="modalityList"
            @change="onChange"
          />
        </a-form-item>
        <a-form-item>
          <a-input style="width: 50%" v-decorator="['expectAchieveStr']" placeholder="请输入"></a-input>
        </a-form-item>
      </a-card>
      <a-card title="项目联系人信息">
        <a-row type="flex" justify="space-between" align="top">
          <a-col :span="11">
            <a-form-item label="证件信息">
              <a-input-group compact>
                <a-select
                  style="width: 25%"
                  v-decorator="['linkCertType', validatorRules.linkCertType]"
                  v-model="linkCertType"
                >
                  <a-select-option v-for="(item, index) in certList" :key="index" :value="item.id"
                    >{{ item.itemText }}
                  </a-select-option>
                </a-select>
                <a-input
                  style="width: 75%"
                  v-decorator="['linkCertId', validatorRules.linkCertId]"
                  placeholder="请输入"
                  v-model="linkCertId"
                />
              </a-input-group>
            </a-form-item>
          </a-col>
          <a-col v-show="false">
            <a-form-item label="项目联系人ID">
              <a-input v-decorator="['linkUserId']" placeholder="请输入"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="联系人姓名">
              <a-input v-decorator="['linkRealname', validatorRules.linkRealname]" placeholder="请输入"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="所属单位">
              <a-input v-decorator="['linkUnitName', validatorRules.linkUnitName]" placeholder="请输入"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="联系电话">
              <a-input v-decorator="['linkPhone', validatorRules.linkPhone]" placeholder="请输入"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card title="项目负责人信息">
        <a-row type="flex" justify="space-between" align="top">
          <a-col :span="11">
            <a-form-item label="证件信息">
              <a-input-group compact>
                <a-select
                  style="width: 25%"
                  v-decorator="['directorCertType', validatorRules.directorCertType]"
                  v-model="directorCertType"
                >
                  <a-select-option v-for="(item, index) in certList" :key="index" :value="item.id"
                    >{{ item.itemText }}
                  </a-select-option>
                </a-select>
                <a-input
                  style="width: 75%"
                  v-decorator="['directorCertId', validatorRules.directorCertId]"
                  placeholder="请输入正确证件号码"
                  v-model="directorCertId"
                />
              </a-input-group>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="所属单位">
              <a-input
                v-decorator="['directorUnitName', validatorRules.directorUnitName]"
                placeholder="请输入"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col v-show="false">
            <a-form-item label="负责人ID">
              <a-input v-decorator="['directorUserId']" placeholder="请输入"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="负责人姓名">
              <a-input
                v-decorator="['directorRealname', validatorRules.directorRealname]"
                placeholder="请输入"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="负责人性别">
              <a-radio-group v-decorator="['directorSex', validatorRules.directorSex]" name="radioGroup">
                <a-radio value="1"> 男 </a-radio>
                <a-radio value="2"> 女 </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="负责人联系电话">
              <a-input v-decorator="['directorPhone', validatorRules.directorPhone]" placeholder="请输入"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="出生年月">
              <a-date-picker
                v-decorator="['directorBirthday', validatorRules.directorBirthday]"
                style="width: 100%"
                placeholder="选择时间"
              />
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="职务">
              <a-input v-decorator="['directorPost', validatorRules.directorPost]" placeholder="请输入"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="最高学位">
              <a-select placeholder="请选择" v-decorator="['directerDegree', validatorRules.directerDegree]">
                <a-select-option v-for="(item, index) in educationList" :key="index" :value="item.value">
                  {{ item.title }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="职称">
              <a-select placeholder="请选择" v-decorator="['directerTitle', validatorRules.directerTitle]">
                <a-select-option v-for="(item, index) in workList" :key="index" :value="item.value">
                  {{ item.title }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="电子邮箱">
              <a-input placeholder="请输入" v-decorator="['directerEmail']"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card title="项目参与单位">
        <a-button type="primary" icon="plus" @click="addUnit"> 新增参与单位 </a-button>
        <a-table :columns="unitColumns" :data-source="projectUnits">
          <template slot="unitName" slot-scope="text, record">
            <a-input placeholder="请输入" v-model="record.unitName"></a-input>
          </template>
          <template slot="unitType" slot-scope="text, record">
            <a-select placeholder="请选择" v-model="record.unitType">
              <a-select-option v-for="(item, index) in unitList" :key="index" :value="item.value">
                {{ item.title }}
              </a-select-option>
            </a-select>
          </template>
          <template slot="unitCreditCode" slot-scope="text, record">
            <a-input v-model="record.unitCreditCode" placeholder="请输入"></a-input>
          </template>
          <template slot="action" slot-scope="text, record">
            <span @click="onDelete(record.key)" style="color: #1890ff">删除</span>
          </template>
        </a-table>
      </a-card>
      <a-card title="参与人员信息">
        <a-button type="primary" icon="plus" @click="addParticipant"> 新增参与人 </a-button>
        <a-table :columns="participantColumns" :data-source="projectUsers">
          <template slot="userType" slot-scope="text, record">
            <a-select placeholder="请选择" v-model="record.userType">
              <a-select-option v-for="(item, index) in userList" :key="index" :value="item.value">
                {{ item.title }}
              </a-select-option>
            </a-select>
          </template>
          <template slot="certId" slot-scope="text, record">
            <a-input-group compact>
              <a-select style="width: 33%" v-model="record.certType">
                <a-select-option v-for="(item, index) in certList" :key="index" :value="item.id"
                  >{{ item.itemText }}
                </a-select-option>
              </a-select>
              <a-input
                style="width: 67%"
                v-model="record.certId"
                @pressEnter="participation(record)"
                placeholder="输入证件号精确查找用户"
              />
            </a-input-group>
          </template>
          <template slot="realname" slot-scope="text, record">
            <a-input placeholder="请输入" v-model="record.realname"></a-input>
          </template>
          <template slot="unitName" slot-scope="text, record">
            <a-input placeholder="请输入" v-model="record.unitName"></a-input>
          </template>
          <template slot="action" slot-scope="text, record">
            <span @click="participantDelete(record.key)" style="color: #1890ff">删除</span>
          </template>
        </a-table>
      </a-card>
      <a-card title="项目摘要">
        <a-form-item label="项目描述">
          <a-textarea
            v-decorator="['description', validatorRules.description]"
            placeholder="请输入5000字以内的文字"
          ></a-textarea>
        </a-form-item>
      </a-card>
      <a-card title="项目合同">
        <p>附件（附件类型pdf，附件大小不超过3M，不限个数。）</p>
        <uploadFile @fileListChange="contract" :fileList="contractFiles" :isLt1M="3" :typeList="['pdf']"></uploadFile>
      </a-card>
      <a-card title="其他附件">
        <p>附件（附件类型pdf/word/excel，附件大小不超过3M，最多上传5份。）</p>
        <uploadFile
          @fileListChange="accessory"
          :amount="5"
          :isLt1M="3"
          :fileList="otherFiles"
          :typeList="['pdf', 'doc', 'docx', 'xlsx', 'xls']"
        ></uploadFile>
      </a-card>
      <!-- <div class="footBtn">
        <a-button type="text" @click="handleCancel" style="margin-right: 8px">取消</a-button>
        <a-button type="primary" @click="handleOk">保存</a-button>
      </div> -->
    </a-form>
  </div>
</template>

<script>
import moment from 'moment'
import pick from 'lodash.pick'
import { getAction, postAction } from '@/api/manage.js'
import Selectt from '../../../components/Select'
import uploadFile from '../uploadFile/index.vue'

export default {
  name: 'Item_Information_Form',
  components: {
    uploadFile,
    Selectt,
  },
  data() {
    return {
      hasInspect: 0,
      finish: false,
      url: {
        add: '/fire/projectReport/add',
        edit: '/fire/projectReport/edit',
        scienceGuide: '/fire/scienceGuide/queryList',
        topic: '/fire/topic/queryList',
      },
      unitList: [],
      otherFiles: [],
      contractFiles: [],
      guideList: [],
      topicList: [],
      keywordList: [],
      certList: [],
      typeList: [],
      userList: [],
      workList: [],
      educationList: [],
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
      form: this.$form.createForm(this, { name: 'coordinated' }),
      validatorRules: {
        projectName: { rules: [{ required: true, message: '项目名称不能为空' }] },
        projectNumber: { rules: [{ required: true, message: '项目编号不能为空' }] },
        projectCategory: { rules: [{ required: true, message: '请选择项目类别' }] },
        specialFund: { rules: [{ required: true, message: '专项资金不能为空' }] },
        otherFund: { rules: [{ required: true, message: '其他来源资金不能为空' }] },
        totalBudget: { rules: [{ required: true, message: '总预算不能为空' }] },
        createTime: { rules: [{ required: true, message: '项目周期不能为空' }] },
        cycleMonths: { rules: [{ required: true, message: '实施周期不能为空' }] },
        hasInspect: {
          initialValue: 0,
          rules: [{ required: true, message: '项目是否有中期检查不能为空' }],
        },
        publishUserId: { rules: [{ required: true, message: '项目发布人信息不能为空' }] },
        publishUnitId: { rules: [{ required: true, message: '发布单位不能为空' }] },
        inspectTime: { rules: [{ required: this.hasInspect === 1, message: '中期检查节点时间不能为空' }] },
        evaluateTime: { rules: [{ required: true, message: '绩效评价节点时间不能为空' }] },
        fixedKeyword: { rules: [{ required: true, message: '固定的关键词不能为空' }] },
        customKeyword: { rules: [{ required: true, message: '自设关键词不能为空' }] },
        expectAchieve: { rules: [{ required: true, message: '预期成果不能为空' }] },
        linkCertType: { rules: [{ required: true, message: '证件类型不能为空' }] },
        linkCertId: { rules: [{ required: true, message: '证件号不能为空' }] },
        linkRealname: { rules: [{ required: true, message: '联系人姓名不能为空' }] },
        linkUnitName: { rules: [{ required: true, message: '所属单位不能为空' }] },
        linkPhone: {
          rules: [
            { required: true, message: '联系人电话不能为空' },
            { pattern: /^1\d{10}$/, message: '请输入正确的联系人电话' },
          ],
        },
        directorCertType: { rules: [{ required: true, message: '负责人证件类型不能为空' }] },
        directorCertId: { rules: [{ required: true, message: '负责人证件号码不能为空' }] },
        directorUnitName: { rules: [{ required: true, message: '负责人所属单位不能为空' }] },
        directorRealname: { rules: [{ required: true, message: '负责人姓名不能为空' }] },
        directorSex: { rules: [{ required: true, message: '负责人性别不能为空' }] },
        directorPhone: {
          rules: [
            { required: true, message: '负责人联系电话不能为空' },
            { pattern: /^1\d{10}$/, message: '请输入正确的联系人电话' },
          ],
        },
        directorBirthday: { rules: [{ required: true, message: '出生日期不能为空' }] },
        directorPost: { rules: [{ required: true, message: '职务不能为空' }] },
        directerDegree: { rules: [{ required: true, message: '最高学历不能为空' }] },
        directerTitle: { rules: [{ required: true, message: '职称不能为空' }] },
        // directerEmail: { rules: [{ required: true, message: '电子邮箱不能为空' }] },
        description: { rules: [{ required: true, message: '项目描述不能为空' }] },
        unit: { rules: [{ required: true, message: '发布单位不能为空' }] },
        person: { rules: [{ required: true, message: '项目发布人不能为空' }] },
      },
      projectUnits: [],
      unitColumns: [
        {
          title: '序号',
          dataIndex: 'orderIndex',
          key: 'orderIndex',
          width: 100,
        },
        {
          title: '单位名称',
          dataIndex: 'unitName',
          key: 'unitName',
          scopedSlots: { customRender: 'unitName' },
        },
        {
          title: '单位类型',
          dataIndex: 'unitType',
          key: 'unitType',
          scopedSlots: { customRender: 'unitType' },
        },
        {
          title: '统一社会信用代码',
          dataIndex: 'unitCreditCode',
          key: 'unitCreditCode',
          scopedSlots: { customRender: 'unitCreditCode' },
        },
        {
          title: '操作',
          dataIndex: '',
          key: 'action',
          width: 80,
          scopedSlots: { customRender: 'action' },
        },
      ],
      projectUsers: [],
      participantColumns: [
        {
          title: '序号',
          dataIndex: 'orderIndex',
          key: 'orderIndex',
          width: 100,
        },
        {
          title: '参与人类型',
          dataIndex: 'userType',
          key: 'userType',
          scopedSlots: { customRender: 'userType' },
        },
        {
          title: '参与人证件信息',
          dataIndex: 'certId',
          key: 'certId',
          scopedSlots: { customRender: 'certId' },
        },
        {
          title: '参与人姓名',
          dataIndex: 'realname',
          key: 'realname',
          scopedSlots: { customRender: 'realname' },
        },
        {
          title: '参与人所属单位',
          dataIndex: 'unitName',
          key: 'unitName',
          scopedSlots: { customRender: 'unitName' },
        },
        {
          title: '操作',
          dataIndex: '',
          key: 'action',
          width: 80,
          scopedSlots: { customRender: 'action' },
        },
      ],
      cycleStartTime: moment().format('YYYY-MM-DD' + ' 00:00:00'), // 创建起始时间-筛选框
      cycleEndTime: moment().format('YYYY-MM-DD' + ' 23:59:59'), // 创建结束时间-筛选框
      unit: '',
      publishUnitId: '',
      person: '',
      publishUserId: '',
      expectAchieve: '',
      expectAchieveStr: '',
      data: [],
      params: {},
      // 项目联系人信息
      linkUserId: '',
      linkCertType: '',
      linkCertId: '',
      linkRealname: '',
      linkUnitId: '',
      linkUnitName: '',
      linkPhone: '',
      // 项目负责人信息
      directorCertType: '',
      directorCertId: '',
      directorUserId: '',
    }
  },
  props: {
    pojectType: {
      type: Array,
      default: {},
      required: false,
    },
    infoList: {
      type: Object,
      default: {},
      required: false,
    },
    type: {
      type: String,
      default: '',
      required: false,
    },
    id: {
      type: String,
      default: '',
      required: false,
    },
  },
  created() {
    //自动读取
    this.voluntarily()
    //证件类型
    this.certType()
    //单位类型
    this.unitType()
    //参与人类型
    this.userType()
    //学位
    this.education()
    //职称
    this.workType()
    //获取固定关键词
    this.keyword()
    //指南列表
    this.scienceGuide()
    //关注的话题
    this.topic()
    //获取编号
    if (this.type === 'add') {
      this.projectNumber()
    }
    // `_.debounce` 是一个通过 Lodash 限制操作频率的函数。（防抖）
    // 查询联系人信息
    this.debouncedPorjectUser = _.debounce(this.porjectUser, 500)
    // 查询负责人信息
    this.debouncedGetUser = _.debounce(this.getUser, 500)
  },
  watch: {
    linkCertId: function () {
      this.debouncedPorjectUser()
    },
    linkCertType: function () {
      this.debouncedPorjectUser()
    },
    directorCertType: function () {
      this.debouncedGetUser()
    },
    directorCertId: function () {
      this.debouncedGetUser()
    },
  },
  methods: {
    handleHasInspectChange(e) {
      this.hasInspect = e.target.value
      this.infoList.hasInspect = this.hasInspect
    },
    //获取编号
    projectNumber() {
      getAction('/fire/projectReport/getNextNumber').then((res) => {
        if (res.success) {
          this.$nextTick(() => {
            this.form.setFieldsValue({ projectNumber: res.message })
          })
        } else {
          this.$message.warning(res.message || '查询失败')
        }
      })
    },
    //获取中期检查节点时间
    inspectTime(e, a) {
      this.$nextTick(() => {
        if (e === null) {
          this.form.setFieldsValue({ inspectTime: null })
        } else {
          let date = moment(e).format('YYYY-MM-DD HH:mm:ss')
          this.form.setFieldsValue({ inspectTime: date })
        }
      })
    },
    //获取绩效评价节点时间
    evaluateTime(e, a) {
      this.$nextTick(() => {
        let date = moment(e).format('YYYY-MM-DD HH:mm:ss')
        this.form.setFieldsValue({ evaluateTime: date })
      })
    },
    //总预算
    validatorRule() {
      this.$nextTick(() => {
        let specialFund = this.form.getFieldValue('specialFund') || null
        let otherFund = this.form.getFieldValue('otherFund') || null
        let num = Number(specialFund) + Number(otherFund)
        this.form.setFieldsValue({ totalBudget: num })
      })
    },
    //自动读取
    voluntarily() {
      this.$nextTick(() => {
        this.form.setFieldsValue({ unit: this.$store.state.user.info.departName })
        this.form.setFieldsValue({ publishUnitId: this.$store.state.user.info.departId })
        this.form.setFieldsValue({ person: this.$store.state.user.info.realname })
        this.form.setFieldsValue({ publishUserId: this.$store.state.user.info.id })
        // 项目联系人信息默认读取当前登录用户，可修改
        this.form.setFieldsValue({
          linkUserId: this.$store.state.user.info.id,
          linkCertType: this.$store.state.user.info.certType,
          linkCertId: this.$store.state.user.info.certCode,
          linkRealname: this.$store.state.user.info.realname,
          linkUnitId: this.$store.state.user.info.departId,
          linkUnitName: this.$store.state.user.info.departName,
          linkPhone: this.$store.state.user.info.phone,
        })
      })
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
    //获取证件列表
    certType() {
      getAction('/sys/dictItem/listByDictCode', { dictCode: 'cert_type' }).then((res) => {
        if (res.success) {
          console.log(res)
          this.certList = res.result
        } else {
          this.$message.warning(res.message || '查询失败')
        }
      })
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
    //职称
    workType() {
      getAction('/sys/dict/getDictItems/work_title', { type: '	work_title' }).then((res) => {
        if (res.success) {
          this.workList = res.result
        } else {
          this.$message.warning(res.message || '查询失败')
        }
      })
    },
    //根据用户证件类型和证件号查询用户信息
    getUser() {
      if (this.form.getFieldValue('directorCertType')) {
        let params = {
          certType: this.form.getFieldValue('directorCertType'),
          certCode: this.form.getFieldValue('directorCertId'),
        }
        getAction('/sys/user/getUserByCert', params).then((res) => {
          if (res) {
            this.form.setFieldsValue({
              directorUserId: res.id,
              directorRealname: res.realname,
              directorSex: String(res.sex),
              directorPhone: res.phone,
              directorBirthday: res.birthday,
              directerEmail: res.email,
              directorUnitName: res.departs ? (res.departs.length > 0 ? res.departs[0].departName : '') : '',
            })
          } else {
            this.form.setFieldsValue({
              directorUserId: '',
              directorRealname: '',
              directorSex: '',
              directorPhone: '',
              directorBirthday: '',
              directerEmail: '',
              directorUnitName: '',
            })
          }
        })
      }
    },
    //根据用户证件类型和证件号查询用户信息
    porjectUser() {
      if (this.form.getFieldValue('linkCertType')) {
        let params = {
          certType: this.form.getFieldValue('linkCertType'),
          certCode: this.form.getFieldValue('linkCertId'),
        }
        console.log('porjectUser', params)
        getAction('/sys/user/getUserByCert', params).then((res) => {
          if (res) {
            console.log('res', res)
            this.form.setFieldsValue({
              linkUserId: res.id,
              linkRealname: res.realname,
              linkPhone: res.phone,
              linkUnitId: res.departs[0].id,
              linkUnitName: res.departs[0].departName,
            })
          } else {
            // this.$message.warning(res.message || '查询失败')
            // 未查询到清空联系人姓名等信息
            this.form.setFieldsValue({
              linkRealname: '',
              linkUnitId: '',
              linkUnitName: '',
              linkPhone: '',
            })
          }
        })
      }
    },
    //参与人员信息
    participation(e) {
      if (e.certType) {
        let params = {
          certType: e.certType,
          certCode: e.certId,
        }
        getAction('/sys/user/getUserByCert', params).then((res) => {
          if (res) {
            e.unitName = res.unitName
            e.realname = res.realname
          } else {
            this.$message.warning(res.message || '查询失败')
          }
        })
      }
    },
    // //获取项目编号
    // keyword() {
    //   getAction('/fire/keyword/list', { type: 0 }).then((res) => {
    //     if (res.success) {
    //       this.keywordList = res.result
    //     } else {
    //       this.$message.warning(res.message || '查询失败')
    //     }
    //   })
    // },
    //固定关键词
    keyword() {
      getAction('/fire/keyword/list', { type: 0 }).then((res) => {
        if (res.success) {
          this.keywordList = res.result
        } else {
          this.$message.warning(res.message || '查询失败')
        }
      })
    },
    //指南列表
    scienceGuide() {
      getAction('/fire/scienceGuide/queryIndexList').then((res) => {
        if (res.success) {
          this.guideList = res.result
        } else {
          this.$message.warning(res.message || '查询失败')
        }
      })
    },
    //关注的话题
    topic() {
      getAction('/fire/topic/queryIndexList').then((res) => {
        if (res.success) {
          this.topicList = res.result
        } else {
          this.$message.warning(res.message || '查询失败')
        }
      })
    },
    //上传合同
    contract(e) {
      this.contractFiles = e
    },
    //上传附件
    accessory(e) {
      this.otherFiles = e
    },
    //详情
    info() {
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.infoList,
            'projectName',
            'projectNumber',
            'projectCategory',
            'specialFund',
            'otherFund',
            'totalBudget',
            'createTime',
            'cycleMonths',
            'hasInspect',
            'inspectTime',
            'evaluateTime',
            'guideId',
            'demandId',
            'customKeyword',
            'linkCertType',
            'linkCertId',
            'linkRealname',
            'linkUnitName',
            'expectAchieve',
            'expectAchieveStr',
            'linkPhone',
            'directorCertType',
            'directorCertId',
            'directorUnitName',
            'directorRealname',
            'directorSex',
            'directorPhone',
            'directorBirthday',
            'directorPost',
            'directerDegree',
            'directerTitle',
            'directerEmail',
            'description'
          )
        )
        this.content = this.infoList.content
        this.projectUnits = this.infoList.projectUnits
        this.projectUsers = this.infoList.projectUsers
        this.form.setFieldsValue({ Time: [this.infoList.cycleStartTime, this.infoList.cycleEndTime] })
        this.form.setFieldsValue({ expectAchieve: this.infoList.expectAchieve.split(',') })
        this.form.setFieldsValue({ followTopic: this.infoList.followTopic.split(',') })
        this.form.setFieldsValue({ fixedKeyword: this.infoList.fixedKeyword.split(',') })
        let contractFiles = []
        for (const i of this.infoList.contractFiles) {
          let obj = {
            id: i.id,
            uid: i.id,
            name: i.fileName,
            url: i.fileUrl,
            status: 'done',
          }
          contractFiles.push(obj)
        }
        this.contractFiles = contractFiles
        let otherFiles = []
        for (const i of this.infoList.otherFiles) {
          let obj = {
            id: i.id,
            uid: i.id,
            name: i.fileName,
            url: i.fileUrl,
            status: 'done',
          }
          otherFiles.push(obj)
        }
        this.otherFiles = otherFiles
      })
    },
    //设置时间
    onChangeRangePicker(a, dateString) {
      this.cycleStartTime = dateString.slice(0, 1).toString()
      this.cycleEndTime = dateString.slice(1, 2).toString()
      let date1 = this.cycleStartTime.split('-')
      date1 = parseInt(date1[0]) * 12 + parseInt(date1[1])
      let date2 = this.cycleEndTime.split('-')
      date2 = parseInt(date2[0]) * 12 + parseInt(date2[1])
      this.form.setFieldsValue({ cycleMonths: Math.abs(date1 - date2) })
    },
    onChange(e) {
      console.log('onChange e', e)
      // this.expectAchieve = e.target.value
    },
    //添加单位
    addUnit() {
      let obj = {
        key: Date.now(),
        orderIndex: this.projectUnits.length + 1,
        unitName: '',
        unitType: '',
        unitCreditCode: '',
      }
      this.projectUnits.push(obj)
    },
    //删除单位
    onDelete(key) {
      let projectUnits = [...this.projectUnits]
      this.projectUnits = projectUnits.filter((item) => item.key !== key)
      let num = 1
      for (const i of this.projectUnits) {
        i.orderIndex = num
        num++
      }
    },
    //添加参与人
    addParticipant() {
      let obj = {
        key: Date.now(),
        orderIndex: this.projectUsers.length + 1,
        userType: '',
        certType: '',
        certId: '',
        realname: '',
        unitName: '',
      }
      this.projectUsers.push(obj)
    },
    //删除参与人
    participantDelete(key) {
      let projectUsers = [...this.projectUsers]
      this.projectUsers = projectUsers.filter((item) => item.key !== key)
      let num = 1
      for (const i of this.projectUsers) {
        i.orderIndex = num
        num++
      }
    },
    //保存
    handleOk() {
      this.form.validateFields((err) => {
        if (!err) {
          let params
          let url
          let contractFiles = this.contractFiles.concat()
          let contractArr = []
          for (const i of contractFiles) {
            let obj = {}
            if (i.id) {
              obj = {
                id: i.id,
                fileName: i.name,
                fileUrl: i.url,
              }
            } else {
              obj = {
                id: '',
                fileName: i.name,
                fileUrl: i.response.message,
              }
            }
            contractArr.push(obj)
          }
          let otherFiles = this.otherFiles.concat()
          let otherArr = []
          for (const i of otherFiles) {
            let obj = {}
            if (i.id) {
              obj = {
                fileName: i.name,
                fileUrl: i.url,
              }
            } else {
              obj = {
                fileName: i.name,
                fileUrl: i.response.message,
              }
            }
            otherArr.push(obj)
          }
          if (this.type == 'add') {
            params = Object.assign(
              {},
              this.form.getFieldsValue(),
              { content: this.content },
              { projectUnits: this.projectUnits },
              { projectUsers: this.projectUsers },
              { cycleStartTime: this.cycleStartTime },
              { cycleEndTime: this.cycleEndTime },
              { contractFiles: contractArr },
              { otherFiles: otherArr }
            )
            params.followTopic = params.followTopic ? params.followTopic.toString() : ''
            params.fixedKeyword = params.fixedKeyword ? params.fixedKeyword.toString() : ''
            params.expectAchieve = params.expectAchieve ? params.expectAchieve.toString() : ''
            url = this.url.add
          } else {
            params = Object.assign(
              {},
              this.form.getFieldsValue(),
              { id: this.id },
              { content: this.content },
              { projectUnits: this.projectUnits },
              { projectUsers: this.projectUsers },
              { cycleStartTime: this.cycleStartTime },
              { cycleEndTime: this.cycleEndTime },
              { contractFiles: contractArr },
              { otherFiles: otherArr }
            )
            params.followTopic = params.followTopic ? params.followTopic.toString() : ''
            params.fixedKeyword = params.fixedKeyword ? params.fixedKeyword.toString() : ''
            params.expectAchieve = params.expectAchieve ? params.expectAchieve.toString() : ''
            url = this.url.edit
          }
          console.log('params', params)
          console.log('form', this.form.getFieldsValue())
          this.params = params
          this.finish = true
        }
      })
    },
    // //关闭弹框
    handleCancel() {
      this.form.resetFields()
    },
  },
}
</script>

<style lang="less" scoped>
.checkbox {
  width: 100%;
  /deep/ .ant-checkbox-group-item {
    width: 16%;
  }
}
/deep/ .ant-card {
  margin-bottom: 10px;
  .ant-card-head {
    background: #fafafa;
  }
}
</style>