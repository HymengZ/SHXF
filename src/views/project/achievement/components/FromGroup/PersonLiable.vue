<template>
  <div>
    <a-alert banner>
      <div slot="message" class="message">
        1、联系人信息默认读取成果发布账号，如需修改可直接替换；<br />
        2、联系人请尽量使用已注册过本平台的人员信息，可通过手机号码快速搜索填充已有数据。<br />
        3、成果所有人非必填，可为空。
      </div>
    </a-alert>
    <a-form :form="form" :colon="false">
      <a-card title="成果联系人信息">
        <a-row type="flex" justify="space-between" align="top">
          <a-col :span="11">
            <a-form-item label="真实姓名">
              <a-input
                allowClear
                v-decorator="['linkRealName', validatorRules.linkRealName]"
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
              >
              </a-input>
            </a-form-item>
          </a-col>

          <a-col :span="11">
            <a-form-item label="职务">
              <a-input allowClear v-decorator="['linkPost', validatorRules.linkPost]" placeholder="请输入"> </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="电子邮箱">
              <a-input allowClear v-decorator="['linkEmail', validatorRules.linkEmail]" placeholder="请输入"> </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="通信地址">
              <a-input allowClear v-decorator="['linkAddress']" placeholder="请输入"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card class="owner" title="成果所有人信息"
        ><a-button type="primary" icon="plus" @click="addUnit"> 新增成果所有人 </a-button>
        <a-table rowKey="id" :columns="achieveColumns" :data-source="achieveData" :pagination="false" bordered>
          <template slot="ownerMessage" slot-scope="text, record">
            <a-input-group compact>
              <a-select style="width: 30%" v-model="record.certType" placeholder="请选择">
                <a-select-option v-for="(item, index) in certTypeList" :key="index" :value="item.id">
                  {{ item.itemText }}
                </a-select-option>
              </a-select>
              <a-input
                v-model="record.certId"
                style="width: 70%; text-align: left"
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
            <span @click="onDelete(record)" style="color: #1890ff; cursor: pointer">删除</span>
          </template>
        </a-table>
      </a-card>
    </a-form>
  </div>
</template>
<script>
import {
  addScienceAchieve,
  fetchUserInfoByPhone,
  deleteResultUser,
  editScienceAchieve,
  fetchScienceAchieveById,
} from '@/api/project/achievement'
import { listByDictCode } from '@/api/listByDictCode'
import pick from 'lodash.pick'
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
      // 证件类型
      certTypeList: [],
      form: this.$form.createForm(this),
      // 表数据
      achieveData: [],
      // 表头
      achieveColumns: [
        {
          title: '序号',
          dataIndex: 'orderIndex',
          key: 'orderIndex',
          width: '6%',
          align: 'center',
        },
        {
          title: '成果所有人证件信息',
          dataIndex: 'ownerMessage',
          key: 'ownerMessage',
          scopedSlots: { customRender: 'ownerMessage' },
          align: 'center',
          width: '45%',
        },
        {
          title: '成果所有人姓名',
          dataIndex: 'realname',
          align: 'center',
          key: 'realname',
          scopedSlots: { customRender: 'realname' },
          width: '15%',
        },
        {
          title: '成果所有人所属单位',
          dataIndex: 'unitName',
          align: 'center',
          key: 'unitName',
          scopedSlots: { customRender: 'unitName' },
          width: '26%',
        },
        {
          title: '操作',
          dataIndex: '',
          align: 'center',
          key: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      validatorRules: {
        linkRealName: { rules: [{ required: true, message: '真实姓名不能为空' }] },
        linkPhone: {
          rules: [
            { required: true, message: '手机号码不能为空' },
            { pattern: /^1[345789]\d{9}$/, message: '手机号格式不正确' },
          ],
        },

        linkPost: { rules: [{ required: true, message: '职务不能为空' }] },
        linkEmail: {
          rules: [
            {
              pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
              message: '电子邮箱格式不正确',
            },
          ],
        },
      },
    }
  },
  created() {
    //获取下拉框
    this.getSelectList()
  },
  mounted() {
    // 展示填写过的内容
    // 只有返回上一步才执行
    if (this.personData.linkRealName) {
      this.showData()
    } else {
      // 新增自动获取项目联系人信息
      this.getContactsMessage()
    }
  },
  methods: {
    async getSelectList() {
      const { success, result, message } = await listByDictCode('cert_type')
      if (!success) {
        this.$message.warning(message)
        return
      }
      this.certTypeList = result
    },
    // 点击上一步时展示填写过的内容
    showData() {
      this.form.resetFields()
      let model = Object.assign({}, this.personData)
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(model, 'linkRealName', 'linkPhone', 'linkPost', 'linkEmail', 'linkAddress'))
      })
      this.achieveData = model.fireScienceAchieveUserList
    },
    // 设置联系人信息
    setLinkMessage(info) {
      const model = Object.assign(
        {},
        { linkRealName: info.realname, linkPhone: info.phone, linkPost: info.post, linkEmail: info.email }
      )
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(model, 'linkRealName', 'linkPhone', 'linkPost', 'linkEmail'))
      })
    },
    // 新增自动获取项目联系人信息
    getContactsMessage() {
      let info = this.$store.state.user.info
      this.setLinkMessage(info)
    },
    // 根据手机号码搜索联系人信息
    searchInfo() {
      this.$nextTick(async () => {
        if (this.form.getFieldError('linkPhone')) {
          return
        }
        let params = { phone: this.form.getFieldValue('linkPhone') }
        console.log('params', params)
        const { success, result, message } = await fetchUserInfoByPhone(params)
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
    },
    // 新增成果
    addUnit() {
      let obj = {
        key: Date.now(),
        orderIndex: this.achieveData.length + 1,
        contentId: this.personData.id,
        certId: '',
        certType: undefined,
        realname: '',
        unitName: '',
      }
      this.achieveData.push(obj)
    },

    // 删除成果&同时使序号不会乱
    onDelete(record) {
      if (record.id) {
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
          async onOk() {
            const res = await deleteResultUser(record.id)
            if (res.success) {
              let id = record.id
              let achieveData = [...that.achieveData]
              that.achieveData = achieveData.filter((item) => item.id !== id)
              if (that.achieveData.length > 0) {
                let num = 1
                for (let i of that.achieveData) {
                  i.orderIndex = num
                  num++
                }
                let existsProjectUnits = that.achieveData.filter((item) => item.id)
                let data = { id: that.personData.id, fireScienceAchieveUserList: existsProjectUnits }
                const { success, message } = await editScienceAchieve(data)
                if (!success) {
                  that.$message.warning(message)
                }
              }
              that.$message.success(res.message)
              // 将新数据返回
              const { success, result, message } = await fetchScienceAchieveById(that.personData.id)
              if (!success) {
                that.$message.warning(message)
                return
              }
              that.$emit('editCurrent', result)
            } else {
              that.$message.warning(res.message)
            }
          },
        })
      } else {
        let key = record.key
        let achieveData = [...this.achieveData]
        this.achieveData = achieveData.filter((item) => item.key !== key)
        let num = 1
        for (let i of this.achieveData) {
          i.orderIndex = num
          num++
        }
      }
    },
    // 表单校验和保存数据
    handleSubmit() {
      this.form.validateFields(async (err, values) => {
        // 第二步的新增（实际是对第一步已经增加好的数据其他字段赋值）
        let deepCloneData = JSON.parse(JSON.stringify(this.personData))
        // 成果所有人信息
        deepCloneData.fireScienceAchieveUserList = this.achieveData
        let params = this.dealParams(deepCloneData, values)
        if (!err) {
          const { success, result, message } = await addScienceAchieve(params)
          if (!success) {
            this.$message.warning(message)
            return
          }
          if (this.personData.linkRealName) {
            this.$message.success(message || '修改成功')
          } else {
            this.$message.success(message || '新增成功')
          }
          this.$emit('addCurrent', result)
        }
      })
    },
    dealParams(data, val) {
      data.linkRealName = val.linkRealName
      data.linkPhone = val.linkPhone
      data.linkPost = val.linkPost
      data.linkEmail = val.linkEmail
      data.linkAddress = val.linkAddress
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
.owner {
  margin-top: 16px;
  // 表格
  .ant-table-wrapper {
    margin-top: 16px;
    // 表头字体
    /deep/ .ant-table-column-title {
      font-size: 14px;
      font-weight: 500;
      color: rgba(0, 0, 0, 1);
      line-height: 22px;
    }
  }
}
</style>
