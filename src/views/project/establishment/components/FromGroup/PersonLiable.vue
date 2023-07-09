<template>
  <div>
    <a-alert banner>
      <div slot="message" class="message">
        1、项目负责人如有多个，请自己判断填写主要负责人。<br />
        2、联系人信息默认读取资源发布账号，如需修改可直接替换；<br />
        3、联系人请尽量使用已注册过本平台的人员信息，可通过手机号码快速搜索填充已有数据。
      </div>
    </a-alert>
    <a-form :form="form" :colon="false">
      <a-card title="项目负责人信息">
        <a-row type="flex" justify="space-between" align="top">
          <a-col :span="11">
            <a-form-item label="真实姓名">
              <a-input
                allowClear
                v-decorator="['directorRealname', validatorRules.directorRealname]"
                placeholder="请输入"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="性别">
              <a-radio-group v-decorator="['directorSex', validatorRules.directorSex]">
                <a-radio :value="item.itemText" v-for="(item, index) in directerSexList" :key="index">{{
                  item.itemText
                }}</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="出生年月">
              <a-month-picker
                v-decorator="['directorBirthday', validatorRules.directorBirthday]"
                style="width: 100%"
                placeholder="选择时间"
                @change="directorBirthday"
                format="YYYY年MM月"
              >
                <a-icon slot="suffixIcon" type="clock-circle" />
              </a-month-picker>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="联系电话">
              <a-input allowClear v-decorator="['directorPhone', validatorRules.directorPhone]" placeholder="请输入">
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="证件类型">
              <a-radio-group v-decorator="['directorCertType', validatorRules.directorCertType]" placeholder="请选择">
                <a-radio v-for="(item, index) in directerCertificatesList" :key="index" :value="item.itemValue">{{
                  item.itemText
                }}</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="证件号码">
              <a-input allowClear v-decorator="['directorCertId', validatorRules.directorCertId]" placeholder="请输入">
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="所在单位">
              <a-input
                allowClear
                v-decorator="['directorUnitName', validatorRules.directorUnitName]"
                placeholder="请输入"
              >
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="职务">
              <a-input allowClear v-decorator="['directorPost', validatorRules.directorPost]" placeholder="请输入">
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="职称">
              <a-select v-decorator="['directerTitle', validatorRules.directerTitle]" placeholder="请选择">
                <a-select-option v-for="(item, index) in directerTitleList" :key="index" :value="item.itemValue">
                  {{ item.itemText }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :span="11">
            <a-form-item label="最高学位">
              <a-select v-decorator="['directerDegree', validatorRules.directerDegree]" placeholder="请选择">
                <a-select-option v-for="(item, index) in directerDegreeList" :key="index" :value="item.itemValue">
                  {{ item.itemText }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="电子邮箱">
              <a-input allowClear v-decorator="['directerEmail', validatorRules.directerEmail]" placeholder="请输入">
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card class="contacts" title="项目联系人信息">
        <a-row type="flex" justify="space-between" align="top">
          <a-col :span="11">
            <a-form-item label="真实姓名">
              <a-input
                allowClear
                v-decorator="['linkRealname', validatorRules.linkRealname]"
                placeholder="请输入"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="手机号码">
              <a-input
                allowClear
                v-decorator="['linkPhone', validatorRules.linkPhone]"
                placeholder="请输入"
                @change="searchInfo"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="职务">
              <a-input
                allowClear
                v-decorator="['linkPosition', validatorRules.linkPosition]"
                placeholder="请输入"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="电子邮箱">
              <a-input allowClear v-decorator="['linkEmail', validatorRules.linkEmail]" placeholder="请输入"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="通信地址">
              <a-input allowClear v-decorator="['linktAddress']" placeholder="请输入"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
    </a-form>
  </div>
</template>
<script>
import { getAction, postAction } from '@/api/manage.js'
import pick from 'lodash.pick'
import moment from 'moment'
import { phoneCheck, emailCheck } from '@/utils/validate'
export default {
  props: {
    // 已新增的数据
    personData: {
      type: Object,
      default: '',
      required: false,
    },
  },
  data() {
    return {
      // 职称下拉列表
      directerTitleList: [],
      // 最高学历下拉列表
      directerDegreeList: [],
      // 证件类型
      directerCertificatesList: [],
      // 性别
      directerSexList: [],
      form: this.$form.createForm(this),
      validatorRules: {
        directorRealname: { rules: [{ required: true, message: '真实姓名不能为空' }] },
        directorSex: { rules: [{ required: true, message: '性别不能为空' }] },
        directorBirthday: { rules: [{ required: true, message: '出生年月不能为空' }] },
        directorPhone: {
          rules: [
            { required: true, message: '联系电话不能为空' },
            {
              validator: phoneCheck,
            },
          ],
        },
        directorCertType: { rules: [{ required: true, message: '证件类型不能为空' }] },
        directorCertId: {
          rules: [{ required: true, message: '证件号码不能为空' }],
        },
        directorUnitName: { rules: [{ required: true, message: '所在单位不能为空' }] },
        directorPost: { rules: [{ required: true, message: '职务不能为空' }] },
        directerTitle: { rules: [{ required: true, message: '职称不能为空' }] },
        directerDegree: { rules: [{ required: true, message: '最高学位不能为空' }] },
        directerEmail: {
          rules: [
            {
              validator: emailCheck,
            },
          ],
        },
        linkRealname: { rules: [{ required: true, message: '真实姓名不能为空' }] },
        linkPhone: {
          rules: [
            { required: true, message: '手机号码不能为空' },
            { pattern: /^1[345789]\d{9}$/, message: '手机号格式不正确' },
          ],
        },
        linkPosition: { rules: [{ required: true, message: '职务不能为空' }] },
        linkEmail: {
          rules: [
            {
              validator: emailCheck,
            },
          ],
        },
      },

      url: {
        listByDictCode: '/sys/dictItem/listByDictCode',
        // 新增数据
        add: '/fire/projectBuild/add',
        // 根据手机号码查询用户信息
        phone: '/sys/user/_search/phone',
      },
    }
  },
  created() {
    // 获取下拉框内容
    this.getSelectList()
  },
  mounted() {
    // 展示填写过的内容
    // 只有返回上一步才执行
    if (this.personData.directorRealname) {
      this.showData()
    } else {
      // 新增自动获取项目联系人信息
      this.getContactsMessage()
    }
  },
  methods: {
    // 点击上一步时展示填写过的内容
    showData() {
      this.form.resetFields()
      let model = Object.assign({}, this.personData)
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            model,
            'directorRealname',
            'directorSex',
            'directorBirthday',
            'directorPhone',
            'directorCertType',
            'directorCertId',
            'directorUnitName',
            'directorPost',
            'directerTitle',
            'directerDegree',
            'directerEmail',
            'linkRealname',
            'linkPhone',
            'linkPosition',
            'linkEmail',
            'linktAddress'
          )
        )
      })
    },
    // 设置联系人信息
    setLinkMessage(info) {
      const model = Object.assign(
        {},
        { linkRealname: info.realname, linkPhone: info.phone, linkPosition: info.post, linkEmail: info.email }
      )
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(model, 'linkRealname', 'linkPhone', 'linkPosition', 'linkEmail'))
      })
    },
    // 新增自动获取项目联系人信息
    getContactsMessage() {
      let info = this.$store.state.user.info
      this.setLinkMessage(info)
    },
    // 根据手机号码搜索联系人信息
    searchInfo() {
      this.$nextTick(() => {
        if (this.form.getFieldError('linkPhone')) {
          return
        }
        let params = { phone: this.form.getFieldValue('linkPhone') }
        getAction(this.url.phone, params).then((res) => {
          const { success, result, message } = res
          if (!success) {
            this.$message.warning(message)
            return
          }
          if (result) {
            this.$message.success('已自动填充项目联系人信息')
            this.setLinkMessage(result)
          } else {
            this.$message.warning('当前联系人信息未在本平台注册')
          }
        })
      })
    },

    // 读取下拉框和单选框
    async getSelectList() {
      const commnUrl = this.url.listByDictCode
      // 职称
      await getAction(commnUrl, { dictCode: 'work_title' }).then((res) => {
        const { result, success } = res
        console.log('res', res)
        if (success) {
          this.directerTitleList = result
        } else {
          this.$message.warning(res.message || '职称查询失败')
        }
      })
      // 最高学位
      await getAction(commnUrl, { dictCode: 'high_degree' }).then((res) => {
        const { result, success } = res
        if (success) {
          this.directerDegreeList = result
        } else {
          this.$message.warning(res.message || '最高学位查询失败')
        }
      })
      // 证件类型
      await getAction(commnUrl, { dictCode: 'cert_type' }).then((res) => {
        const { result, success } = res
        if (success) {
          this.directerCertificatesList = result
        } else {
          this.$message.warning(res.message || '证件类型查询失败')
        }
      })
      // 性别
      await getAction(commnUrl, { dictCode: 'sex' }).then((res) => {
        const { result, success } = res
        if (success) {
          this.directerSexList = result
        } else {
          this.$message.warning(res.message || '性别查询失败')
        }
      })
    },
    // 格式化出生年月
    directorBirthday(e) {
      this.$nextTick(() => {
        if (e === null) {
          this.form.setFieldsValue({ directorBirthday: null })
        } else {
          let data = moment(e).format('YYYY-MM-DD 00:00:00')
          this.form.setFieldsValue({ directorBirthday: data })
        }
      })
    },

    // 表单校验和保存数据
    handleSubmit() {
      this.form.validateFields((err, values) => {
        // 第二步的新增（实际是对第一步已经增加好的数据其他字段赋值）
        let deepCloneData = JSON.parse(JSON.stringify(this.personData))
        let params = this.dealParams(deepCloneData, values)
        if (!err) {
          if (this.personData.directorRealname) {
            postAction(this.url.add, params).then((res) => {
              if (res.success) {
                this.$message.success(res.message || '修改成功')
                // 下一步&把从数据库读取到的当前数据取出来
                this.$emit('addCurrent', res.result)
              } else {
                this.$message.warning(res.message || '修改失败')
              }
            })
          } else {
            postAction(this.url.add, params).then((res) => {
              if (res.success) {
                this.$message.success(res.message || '新增成功')
                // 下一步&把从数据库读取到的当前数据取出来
                this.$emit('addCurrent', res.result)
              } else {
                this.$message.warning(res.message || '新增失败')
              }
            })
          }
        }
      })
    },
    dealParams(data, val) {
      data.directorRealname = val.directorRealname
      data.directorSex = val.directorSex
      data.directorBirthday = val.directorBirthday
      data.directorPhone = val.directorPhone
      data.directorCertType = val.directorCertType
      data.directorCertId = val.directorCertId
      data.directorUnitName = val.directorUnitName
      data.directorPost = val.directorPost
      data.directerTitle = val.directerTitle
      data.directerDegree = val.directerDegree
      data.directerEmail = val.directerEmail
      data.linkRealname = val.linkRealname
      data.linkPhone = val.linkPhone
      data.linkPosition = val.linkPosition
      data.linkEmail = val.linkEmail
      data.linktAddress = val.linktAddress
      return data
    },
  },
}
</script>
<style lang="less" scoped>
// 提示
.ant-alert {
  margin-bottom: 16px;
  background: #fffbe6;
  border: 1px solid #ffe58f;
  border-radius: 2px;
  // 提示字体
  .message {
    font-size: 14px;
    font-family: PingFang SC, PingFang SC-5;
    font-weight: 400;
    text-align: left;
    color: rgba(0, 0, 0, 0.65);
    line-height: 20px;
  }
}

// 联系人卡片
.contacts {
  margin-top: 16px;
}
</style>
