<template>
  <div>
    <a-alert message="请认真填写成果信息。" style="margin-bottom: 20px" banner />
    <a-form :form="form">
      <a-card title="成果基本信息">
        <a-row type="flex" justify="space-between" align="top">
          <a-col :span="11">
            <a-form-item label="成果名称">
              <a-input placeholder="请输入" v-decorator="['achieveName', rules.achieveName]"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="成果编号">
              <a-input placeholder="自动生成" disabled v-decorator="['achieveNumber', rules.achieveNumber]"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="成果类别">
              <a-select
                :options="category"
                placeholder="请选择"
                v-decorator="['achieveCategory', rules.achieveCategory]"
              >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="发布单位">
              <a-input allowClear v-show="false" disabled v-decorator="['unitId',rules.unitId]"></a-input>
              <a-input allowClear placeholder="自动读取" disabled v-decorator="['unitName', rules.unitName]"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="成果发布人">
              <a-input allowClear v-show="false" disabled v-decorator="['userId',rules.userId]"></a-input>
              <a-input allowClear placeholder="自动读取" disabled v-decorator="['userRealname', rules.userRealname]"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="发布年度">
              <a-date-picker
                v-decorator="['publishYear', rules.publishYear]"
                mode="year"
                format="YYYY"
                @panelChange="handlePanelChange"
                style="display: block"
              />
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="是否被局部收录" >
              <a-radio-group name="radioGroup"  v-decorator="['ifInclude', rules.ifInclude]">
                <a-radio :value="1"> 是</a-radio>
                <a-radio :value="2"> 否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="关联的科技项目">
              <PullDownSelect
                placeholder="请选择"
                :extra-params="{}"
                :load-more="handleFetchProject"
                pageable
                v-decorator="['linkProjectId', rules.linkProjectId]"
                @change="hanldeProjectChange"
              />
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="项目编号">
              <a-input placeholder="请输入" v-decorator="['linkProjectNumber', rules.linkProjectNumber]"> </a-input>
            </a-form-item>
          </a-col>
          <a-form-item v-show="false">
            <a-input placeholder="请输入" v-decorator="['linkProjectName', rules.linkProjectName]"> </a-input>
          </a-form-item>
        </a-row>
      </a-card>
      <a-card title="成果所有人信息">
        <a-button type="primary" icon="plus" @click="addOwn"> 新增成果所有人</a-button>
        <a-table :columns="ownColumns" :data-source="ownData" bordered>
          <template slot="card" slot-scope="text, record">
            <a-input-group compact>
              <a-select
                style="width: 25%"
                v-model="record.certType"
                @change="handleUserByCertDelay(record)"
                placeholder="请选择证件类型"
                :options="cardTypeOptions"
              />
              <a-input
                style="width: 75%"
                placeholder="输入证件号精确查找用户"
                v-model="record.certId"
                @change="handleUserByCertDelay(record)"
              />
            </a-input-group>
          </template>

          <template slot="name" slot-scope="text, record">
            <a-input placeholder="请输入" v-model="record.realname"></a-input>
          </template>
          <template slot="unit" slot-scope="text, record">
            <a-input placeholder="请输入单位名称" v-model="record.unitName" />
          </template>
          <template slot="action" slot-scope="text, record">
            <span @click="onDelete(record.id)" style="color: #1890ff">删除</span>
          </template>
        </a-table>
      </a-card>
      <a-form-item>
        <a-card title="成果描述">
          <j-editor v-decorator="['description', rules.description]" triggerChange />
        </a-card>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import {
  fetchCardType,
  getUserByCert,
  fetchProjectReport,
  getScienceAchieve,
  getProjectReport
} from '@/api/project/achievements'
import { fetchExtensionNumber } from '@/api/outcome/catalog'
import PullDownSelect from '../../../../../components/PullDownSelect.vue'
import { mapState } from 'vuex'
import moment from 'moment'

export default {
  computed: {
    ...mapState({
      userInfo: (state) => state.user.info,
    }),
  },
  components: {
    PullDownSelect,
  },
  data() {
    return {
      form: this.$form.createForm(this),
      ownData: [],
      ownColumns: [
        {
          title: '序号',
          key: 'serial',
          width: 100,
          align: 'center',
          customRender: (text, record, index) => index + 1,
        },
        {
          title: '成果所有人证件信息',
          dataIndex: 'cert',
          key: 'card',
          scopedSlots: { customRender: 'card' },
          align: 'center',
        },
        {
          title: '成果所有人姓名',
          dataIndex: 'realname',
          key: 'name',
          scopedSlots: { customRender: 'name' },
          align: 'center',
        },
        {
          title: '成果所有人所属单位',
          dataIndex: 'unitName',
          key: 'unit',
          scopedSlots: { customRender: 'unit' },
          align: 'center',
        },
        {
          title: '操作',
          dataIndex: '',
          key: 'action',
          width: 80,
          scopedSlots: { customRender: 'action' },
          align: 'center',
        },
      ],
      rules: {
        achieveCategory: { rules: [{ required: true, message: '请选择成果类别' }] },
        achieveNumber: { rules: [{ required: true, message: '请输入成果编号' }] },
        achieveName: { rules: [{ required: true, message: '请输入成果名称' }] },
        linkProjectId: { rules: [{ required: true, message: '请选择科技项目' }] },
        linkProjectName: { rules: [{ required: false, message: '请选择科技项目' }] },
        // userId: {
        //   initialValue: this.$store.state.user.info.id,
        // },
        userId: {
          // initialValue: this.$store.state.user.info.realname,
          rules: [{ required: true, message: '请输入发布人' }],
        },
        unitId: {
          // initialValue: this.$store.state.user.info.departName,
          rules: [{ required: true, message: '请输入发布单位' }],
        },
        // unitId: {
        //   initialValue: this.$store.state.user.info.departId,
        // },
        description: { rules: [{ required: true, message: '请输入成果描述' }] },
        ifInclude: { rules: [{ required: true, message: '请选择是否被局部收录' }] },
        linkProjectNumber: { rules: [{ required: true, message: '请选择关联的科技项目' }] },
        publishYear: { rules: [{ required: true, message: '请选择年份' }] },
      },
      cardTypeOptions: [],
      unit: [],
      userId: '',
      userRealname: '',
      unitId: '',
      unitName: '',
    }
  },
  props: ['category', 'id', 'editType'],
  mounted() {
    this.handleFetchCardType()
  },
  created() {
    // 防抖
    this.handleUserByCertDelay = _.debounce(this.handleUserByCert, 500)
    // 获取用户信息
    this.handleUserInfo()
    // 获取编号，编辑时获取项目详细数据
    setTimeout(() => {
      if (this.editType === 'add') {
        this.generateExtensionNumber()
      } else {
        this.getScienceAchieve(this.id)
      }
    })
  },
  methods: {
    generateExtensionNumber() {
      fetchExtensionNumber().then((res) => {
        console.log(res)
        this.setFieldsValue({
          achieveNumber: res.message,
        })
      })
    },
    getScienceAchieve(id) {
      getScienceAchieve(id).then((res) => {
        this.reportVisible = true
        this.form.setFieldsValue(res.result)
        this.ownData = res.result.scienceAchieveUsers
      })
    },
    handleUserInfo(){
      if (this.editType !== 'applyEdit') {
        this.setFieldsValue({
          unitId: this.$store.state.user.info.departId,
          unitName: this.$store.state.user.info.departName,
          userId: this.$store.state.user.info.id,
          userRealname: this.$store.state.user.info.realname
        })
      }
    },
    handleFetchProject(page) {
      return fetchProjectReport({
        pageNo: page.page,
        pageSize: 10,
      }).then((res) => {
        return res.result.records.map((item) => ({
          label: item.projectName,
          projectNumber: item.projectNumber,
          value: item.id,
        }))
      })
    },
    hanldeProjectChange(e, opt) {
      this.form.setFieldsValue({
        linkProjectNumber: opt.projectNumber,
        linkProjectName: opt.label,
      })
      // 查询项目参与人信息
      getProjectReport(opt.value).then((res) => {
        console.log('getProjectReport projectUsers', res.result.projectUsers)
        if (res.success) {
          this.ownData = res.result.projectUsers.map((item) => {
            return {
              id: item.id,
              userId: item.userId,
              certId: item.certId,
              certType: item.certType,
              realname: item.realname,
              unitName: item.unitName
            }
          })
        }
      })
    },
    handlePanelChange(e, record) {
      console.log(e)
      this.form.setFieldsValue({
        publishYear: e,
      })
    },
    handleUserByCert(record) {
      if (!record.certType || !record.certId) {
        return;
      }
      getUserByCert({
        certType: record.certType,
        certCode: record.certId
      }).then((res) => {
        if (!res) {
          return
        }
        this.ownData = this.ownData.map((item) => {
          if (item.id === record.id) {
            console.log('item', item)
            item.realname = res.realname
            item.unitName = res.departs.length > 0 ? res.departs[0].departName : ''
            item.userId = res.id
          }
          return item
        })
      })
    },
    // 获取证件类型
    handleFetchCardType() {
      fetchCardType().then((res) => {
        console.log(res)
        this.cardTypeOptions = res.result.map((item) => {
          return {
            label: item.itemText,
            value: item.id,
          }
        })
      })
    },
    //添加所有人
    addOwn() {
      this.ownData.push({
        id: Date.now(),
        userId: '',
        certId: '',
        certType: '',
        realname: '',
        unitName: '',
      })
    },
    //删除所有人
    onDelete(ownId) {
      console.log('onDelete ownId', ownId)
      this.ownData = this.ownData.filter((item) => item.id !== ownId)
    },
    validateFields() {
      return this.form.validateFields().then((val) => {
        return {
          ...val,
          id: this.id,
          publishYear: moment(val.publishYear).format('YYYY'),
          scienceAchieveUsers: this.ownData.map((item) => ({ ...item, unit: null })),
          // unitName: this.userInfo.departName,
          // unitId: this.userInfo.departId,
          // userId: this.userInfo.id,
          // userRealname: this.userInfo.realname
        }
      })
    },
    setFieldsValue(data) {
      setTimeout(() => {
        this.form.setFieldsValue({
          ...data,
        })
      })
    },
  },
}
</script>

<style>
</style>
