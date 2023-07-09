<template>
  <div class="account-message">
    <top-message>
      <div slot="other">用户类型：</div>
    </top-message>
    <a-card title="单位信息" class="card">
      <a-form-model ref="form" layout="horizontal" :model="model" :rules="validatorRules" :colon="false">
        <a-row type="flex" justify="space-between" align="top">
          <a-col :span="11"
            ><a-form-model-item label="单位名称" prop="realname"
              ><a-input disabled v-model="model.realname" size="large"> </a-input> </a-form-model-item
          ></a-col>
          <a-col :span="11"
            ><a-form-model-item label="单位所在区县" prop="sex">
              <a-select v-model="model.certType" placeholder="请选择" size="large">
                <a-select-option v-for="(item, index) in certTypeList" :key="index" :value="item.itemValue">
                  {{ item.itemText }}
                </a-select-option>
              </a-select>
            </a-form-model-item></a-col
          >
          <a-col :span="11">
            <a-form-model-item prop="certType" label="单位详细地址">
              <a-select v-model="model.certType" placeholder="请选择" size="large">
                <a-select-option v-for="(item, index) in certTypeList" :key="index" :value="item.itemValue">
                  {{ item.itemText }}
                </a-select-option>
              </a-select>
            </a-form-model-item></a-col
          >
          <a-col :span="11">
            <a-form-model-item prop="certCode" label="单位联系人真实姓名">
              <a-input v-model="model.certCode" size="large" placeholder="请输入证件号码"> </a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="11">
            <a-form-model-item prop="post" label="单位联系人手机号码">
              <a-input v-model="model.post" size="large" type="text" placeholder="请输入职务"> </a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-card>
    <div class="action">
      <a-button type="primary">保存并提交</a-button>
    </div>
  </div>
</template>
<script>
import { getAction } from '@/api/manage'
import TopMessage from '../TopMessage'
export default {
  components: {
    TopMessage,
  },
  data() {
    return {
      model: {
        realname: '',
        sex: '',
        certType: '',
        certCode: '',
        post: '',
      },
      validatorRules: {
        realname: [{ required: true, message: '真实姓名不能为空!' }],
        sex: [{ required: true, message: '请选择性别!' }],
        certType: [{ required: true, message: '请选择证件类型!' }],
        certCode: [{ required: true, message: '证件号码不能为空!' }],
      },
      url: {
        listByDictCode: '/sys/dictItem/listByDictCode',
      },
    }
  },
  created() {
    this.getSelectList()
  },
  methods: {
    async getSelectList() {
      const commnUrl = this.url.listByDictCode
      // 职称
      await getAction(commnUrl, { dictCode: 'work_title' }).then((res) => {
        const { result, success } = res
        if (success) {
          this.jobTitleList = result
        } else {
          this.$message.warning(res.message || '职称查询失败')
        }
      })
      await getAction(commnUrl, { dictCode: 'cert_type' }).then((res) => {
        const { result, success } = res
        if (success) {
          this.certTypeList = result
        } else {
          this.$message.warning(res.message || '证件类型查询失败')
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
.account-message {
  .speed {
    margin-top: 18px;
    .blod-text {
      font-size: 15px;
      font-family: PingFang SC, PingFang SC-Semibold;
      font-weight: 600;
      text-align: right;
      color: #595959;
      line-height: 32px;
    }
    .text {
      font-size: 14px;
      font-family: PingFang SC, PingFang SC-Regular;
      font-weight: 400;
      text-align: right;
      color: #bfbfbf;
      line-height: 14px;
      margin-bottom: 5px;
    }
  }
  .card {
    margin-top: 24px;
    /deep/ .ant-card-head {
      background: #fafafa;
    }
    .message {
      display: flex;
      .logo {
        margin-right: 20px;
      }
      .info {
        flex: 1;
        .info-title {
          font-size: 20px;
          font-weight: 500;
          color: #262626;
          line-height: 20px;
          margin-bottom: 20px;
        }
        .info-detials {
          font-size: 14px;
          font-weight: 400;
          color: #595959;
          line-height: 20px;
          .text {
            margin-bottom: 3px;
          }
        }
      }
    }
  }
  .action {
    margin-top: 24px;
  }
}
</style>
