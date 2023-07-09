<template>
  <page-header-wrapper  show-back>
    <div class="preview-container">
      <!-- 新闻标题 -->
      <a-card :bordered="false" style="margin-bottom:10px'">
        <div class="title">
          <a-icon type="read" class="icon" />
          <div class="projectName">{{data.title}}</div>
          <a-badge :color="data.color" class="numberStyle" :text="data.typeTitle" />
        </div>
        <div class="headbtn">
          <a-button v-if="data.state != 4" v-has="'journalism:delete'" @click="Delete">删除</a-button>
          <a-button v-if="data.state != 4" v-has="'journalism:edit'" type="primary" @click="redact"> 编辑 </a-button>
          <a-button v-if="data.state != 4" v-has="'journalism:submit'" type="primary" @click="submit"> 提交 </a-button>
          <a-button v-if="data.state != 4" v-has="'journalism:applyReturn'" @click="sendBack">申请退回</a-button>
          <a-button v-if="data.state != 4" v-has="'journalism:audit'" type="primary" @click="audit"> 审核 </a-button>
          <a-button v-if="data.state != 4" v-has="'journalism:release'" @click="applyIssue">发布</a-button>
          <a-button v-has="'journalism:soldOut'" @click="applySoldOut">下架</a-button>
          <a-button v-has="'journalism:return'" v-if="data.state != 4" @click="applySendBack">退回</a-button>
        </div>
        <div class="description">
          <a-row style="background: #f5f5f5;margin-top:10px">
            <a-col :offset="1" :span="2" style="text-align: right;">
              <div>新闻编号：</div>
              <div>新闻类别：</div>
              <div>发布单位：</div>
              <div>新闻发布人：</div>
              <div>阅读：</div>
            </a-col>
            <a-col :span="6" style="color: black">
              <div>{{ data.number }}</div>
              <div>{{ typeFun(data.type) }}</div>
              <div>{{ data.publishUnit }}</div>
              <div>{{ data.publishPerson }}</div>
              <div>{{ data.readAmount }}</div>
            </a-col>
          </a-row>
        </div>
      </a-card>
      <a-card title="消防新闻正文">
        <div v-html="data.content"></div>
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
        <report-modal-list
          :typeList="typeList"
          ref="formRef"
          :type="type"
          :id="id"
          :infoList="data"
          @ok="handleOk"
          @cancel="handleCancel"
        ></report-modal-list>
      </j-modal>
      <a-modal v-model="auditVisible" @cancel="auditCancel" @ok="auditOk" width="50%" title="审核">
        <AuditForm ref="auditForm" :id="id" @auditCancel="auditCancel"></AuditForm>
      </a-modal>
    </div>
  </page-header-wrapper>
</template>

<script>
import { getAction, postAction, deleteAction } from '@/api/manage.js'
import ReportModalList from '../components/SubmitList/reportModalList.vue'
import PageHeaderWrapper from '../../../../components/PageHeaderWrapper'
import AuditForm from '../components/ApplyList/auditForm.vue'
export default {
  data() {
    return {
      reportVisible: false,
      auditVisible: false,
      id: '',
      data: {},
      type: '',
      typeList: [],
      url: {
        delete: '/fire/news/delete',
        submit: '/fire/news/submit',
        apply: '/fire/news/apply',
        publish: '/fire/news/publish',
        soldOut: '/fire/news/soldOut',
        sendBack: '/fire/news/sendBack',
      },
    }
  },
  components: {
    PageHeaderWrapper,
    ReportModalList,
    AuditForm,
  },
  mounted() {
    this.id = this.$route.params.id
    this.dataInfo()
    this.typeData()
  },
  methods: {
    //新闻类型
    typeFun(e) {
      for (const i of this.typeList) {
        if (i.value == e) {
          return i.label
        }
      }
    },
    //新闻类别list
    typeData() {
      getAction('/sys/dict/getDictItems/news_type', { type: 'news_type' }).then((res) => {
        if (res.success) {
          let arr = []
          for (const i of res.result) {
            let obj = {
              label: i.title,
              value: i.value,
            }
            arr.push(obj)
          }
          this.typeList = arr
          this.$message.success(res.message || '查询成功')
        } else {
          this.$message.warning(res.message || '查询失败')
        }
      })
    },
    //详情
    dataInfo() {
      getAction('/fire/news/queryById', { id: this.id }).then((res) => {
        if (res.success) {
          this.data = res.result

          if (this.data.state == '0') {
            this.data.typeTitle = '待提交'
            this.data.color = 'yellow'
          } else if (this.data.state == '1') {
            this.data.typeTitle = '待审核'
            this.data.color = 'yellow'
          } else if (this.data.state == '2') {
            this.data.typeTitle = '审核通过'
            this.data.color = 'green'
          } else if (this.data.state == '3') {
            this.data.typeTitle = '审核驳回'
            this.data.color = 'red'
          } else if (this.data.state == '4') {
            this.data.typeTitle = '已发布'
            this.data.color = 'green'
          } else if (this.data.state == '5') {
            this.data.typeTitle = '已下架'
            this.data.color = 'red'
          } else if (this.data.state == '6') {
            this.data.typeTitle = '待退回'
            this.data.color = 'yellow'
          } else if (this.data.state == '7') {
            this.data.typeTitle = '已退回'
            this.data.color = 'red'
          }
          console.log(this.data)
          this.$message.success(res.message || '查询成功')
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
            <p>确定删除？删除后将无法在列表中查到此条信息，请谨慎操作。</p>
          </div>
        ),
        okText: '确认',
        cancelText: '取消',
        onOk() {
          console.log('确定删除')
          deleteAction(that.url.delete, { id: that.id }).then((res) => {
            if (res.success) {
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
          console.log('确定提交')
          postAction(that.url.submit, { id: that.id }).then((res) => {
            if (res.success) {
              that.$message.success(res.message)
            } else {
              that.$message.warning(res.message)
            }
          })
        },
      })
    },
    //申请退回
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
          postAction(that.url.sendBack, { id: that.id }).then((res) => {
            if (res.success) {
              that.$message.success(res.message)
            } else {
              that.$message.warning(res.message)
            }
          })
        },
      })
    },
    //新闻审核
    audit() {
      this.auditVisible = true
    },
    //审核页面
    auditCancel() {
      this.$refs.auditForm.form.resetFields()
      this.auditVisible = false
    },
    //审核页面提交
    auditOk() {
      this.$refs.auditForm.submit()
    },
    //新闻编辑
    redact() {
      this.type = 'edit'
      this.reportVisible = true
      this.$nextTick(() => {
        this.$refs.formRef.info()
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
    //发布新闻
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
          postAction(that.url.publish, { id: that.id }).then((res) => {
            if (res.success) {
              that.$message.success(res.message)
            } else {
              that.$message.warning(res.message)
            }
          })
        },
      })
    },
    //下架新闻
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
          postAction(that.url.soldOut, { id: that.id }).then((res) => {
            if (res.success) {
              that.$message.success(res.message)
            } else {
              that.$message.warning(res.message)
            }
          })
        },
      })
    },
    //退回新闻
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
          postAction(that.url.sendBack, { id: that.id }).then((res) => {
            if (res.success) {
              that.$message.success(res.message)
            } else {
              that.$message.warning(res.message)
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
  button {
    margin-right: 10px;
  }
}
.description {
  display: block;
  // margin: 1% 1% 0% 1%;
  line-height: 182%;
  font-size: 14px;
  color: #8c8c8c;
  line-height: 200%;
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
}
.numberStyle /deep/ .ant-badge-status-dot {
  width: 8px;
  height: 8px;
  margin-left: 7px;
}
</style>