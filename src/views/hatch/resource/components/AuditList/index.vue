<template>
  <div class="audit-container">
    <div class="table">
      <div class="tips">
        <a-alert banner>
          <div slot="message" class="message">
            1、已发布的寻求合作中的科技资源当前无法修改，如需修改/删除/退回请先下架；<br />
            2、退回为直接退给科技资源提交方，审核不通过为退回上一级操作人，提交方申请退回的科技资源不影响当前流程操作。
          </div>
        </a-alert>
      </div>

      <div class="data">
        <list-table :list="resourceData" :pagination="pagination" :loading="loading" :activeTab="2">
          <div class="extra" slot-scope="{ row }" slot="extra">
            <div class="extra-list" v-if="row.pic && row.pic.length > 0">
              <div class="extra-list-item" v-for="item in filter(row.pic)" :key="item.id">
                <img class="image" :src="basicUrl + item.url" alt="资源图片" />
              </div>
            </div>
          </div>
          <div class="title" slot-scope="{ row }" slot="title">
            <img class="icon" src="~@/assets/icon_ziyuan.png" alt="无法显示" /><span>{{ row.name }}</span>
          </div>
          <div class="label" slot-scope="{ row }" slot="label">
            <div class="tags">
              <a-tag color="blue"> {{ row.type_dictText }}</a-tag>
              <a-tag color="orange"> {{ row.year }}年 </a-tag>
            </div>
            <div class="status">
              <img v-if="['1'].indexOf(row.status) != -1" src="~@/assets/icon_待审核.png" alt="状态" />
              <div v-else-if="row.status == '2'">
                <img src="~@/assets/icon_审核通过.png" alt="状态" />
                <span class="adopt">审核意见：{{ row.auditContent }}</span>
              </div>
              <div v-else-if="row.status == '3'">
                <img src="~@/assets/icon_审核不通过.png" alt="状态" />
                <span class="fail">审核意见：{{ row.auditContent }}</span>
              </div>
              <img v-else-if="row.status == '6'" src="~@/assets/icon_寻求合作.png" alt="状态" />
              <img v-else-if="row.status == '7'" src="~@/assets/icon_已下架.png" alt="状态" />
              <img v-else-if="row.status == '4'" src="~@/assets/icon_待退回.png" alt="状态" />
              <img v-else-if="row.status == '5'" src="~@/assets/icon_已退回.png" alt="状态" />
            </div>
          </div>
          <div class="info" slot-scope="{ row }" slot="desc-left">
            <div class="over-hidden">
              <span
                >关键词：固定关键词1、固定关键词2、固定关键词3、自定义关键词、自定义关键词、自定义关键词、自定义关键词</span
              >
            </div>
            <div>
              <span>发布单位：{{ row.unitName }} </span>
            </div>
            <div>
              <span
                >资源联系人：{{ row.contactName }} <span v-if="row.contactMobile">|</span> {{ row.contactMobile }}</span
              >
            </div>
            <div>
              <span
                >上次操作时间：<span v-if="row.updateTime === null">{{ formatMinute(row.createTime) }}</span>
                <span v-else>{{ formatMinute(row.updateTime) }}</span></span
              >
            </div>
            <div class="operator">
              <span>当前操作人：</span>
              <span v-for="(item, index) in row.projectUserList" :key="item.id" class="name">
                {{ `${item.realName}【${item.departName}】` }}
                <span v-if="index < row.projectUserList.length - 1">、</span>
              </span>
            </div>
          </div>
          <div class="btn" slot-scope="{ row }" slot="actions">
            <a-dropdown>
              <a-button @click="handlePartake($event)">更多操作</a-button>
              <a-menu slot="overlay">
                <a-menu-item
                  key="edit"
                  @click="handleEdit(row)"
                  v-has="'achievementSubmit:edit'"
                  :disabled="['1'].indexOf(row.status) == -1"
                >
                  编辑
                </a-menu-item>
                <a-menu-item
                  key="back"
                  @click="handleBack(row.id, '5')"
                  v-has="'achievementSubmit:submit'"
                  :disabled="['4', '8'].indexOf(row.status) == -1"
                >
                  退回
                </a-menu-item>
                <a-menu-item
                  key="published"
                  @click="handlePublished(row.id, '6')"
                  v-has="'achievementSubmit:applyReturn'"
                  :disabled="['2'].indexOf(row.status) == -1"
                >
                  发布
                </a-menu-item>
                <a-menu-item
                  key="offShelf"
                  @click="handleOffShelf(row.id, '7')"
                  v-has="'achievementSubmit:submit'"
                  :disabled="['6'].indexOf(row.status) == -1"
                >
                  下架
                </a-menu-item>
              </a-menu>
            </a-dropdown>
            <a-button
              class="btn"
              type="primary"
              @click="openModel($event, row)"
              v-has="'achievementApply:audit'"
              :disabled="['1'].indexOf(row.status) == -1"
              >审核</a-button
            >
          </div>
        </list-table>
      </div>
    </div>
    <j-modal
      title="科技资源编辑/新增"
      :visible="reportVisible"
      switchFullscreen
      :fullscreen="true"
      @cancel="handleCancel"
      :footer="false"
      class="j-modal"
    >
      <StepBar @cancel="handleCancel" :type="type" :editDataId="editDataId" />
    </j-modal>
    <!-- 审核弹窗 -->
    <AuditModal
      ref="apply"
      adoptValue="2"
      rejectValue="3"
      :visible="auditVisible"
      @cancel="auditCancel"
      @ok="auditOk"
    />
  </div>
</template>
<script>
// 引入封装的表格
import ListTable from '../listTable.vue'
// 引入步骤条
import StepBar from '../stepBar.vue'
// 引入请求
import { formatMinute } from '@/utils/formatDate'
// 引入审核弹窗
import AuditModal from '../../../components/AuditModal'
export default {
  props: {
    // 资源数据
    resourceData: {
      type: Array,
      default: () => [],
    },
    // 分页
    pagination: {
      type: Object,
      default: () => {},
    },
    // 加载
    loading: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ListTable,
    StepBar,
    AuditModal,
  },
  data() {
    return {
      // 审核弹框
      auditVisible: false,
      // 当前审核数据的id
      auditDataId: '',
      // 孵化弹框
      hatchVisible: false,
      // 新增编辑弹框状态
      reportVisible: false,
      // 新增/编辑类型
      type: '',
      // 编辑数据ID
      editDataId: '',
      // 查询条件
      searchArray: '',
    }
  },
  computed: {
    basicUrl() {
      return process.env.VUE_APP_API_BASE_URL + '/'
    },
  },

  methods: {
    formatMinute,
    // 截取两张图片
    filter(list) {
      return list.slice(0, 2)
    },
    //新增/编辑弹框取消按钮
    handleCancel() {
      this.reportVisible = false
      this.$emit('refreshList')
    },
    // 孵化弹窗关闭
    handleHatchCancel() {
      this.hatchVisible = false
    },
    // 更多操作,阻止点击进入预览
    handleClick(e) {
      e.stopPropagation()
    },
    handlePartake(e) {
      e.stopPropagation()
      this.hatchVisible = true
    },
    // 打开审核弹窗
    openModel(e, row) {
      e.stopPropagation()
      this.$nextTick(() => {
        this.$refs.apply.resetForm()
      })
      this.auditDataId = ''
      this.auditDataId = row.id
      this.auditVisible = true
    },
    // 审核弹框关闭
    auditCancel() {
      this.auditVisible = false
    },
    //编辑数据
    async handleEdit(e) {
      this.type = 'edit'
      this.reportVisible = true
      this.editDataId = e.id
    },
    // 删除数据
    handleDelete(id) {
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
          that.$emit('deleteData', id)
        },
      })
    },

    // 退回
    handleBack(id, status) {
      let params = {
        id: id,
        status: status,
      }
      let that = this
      that.$confirm({
        title: '退回',
        icon: 'exclamation-circle',
        content: (
          <div>
            <p>确定退回？</p>
            <p>退回后发布方将在“我提交的”列表中可进行编辑/删除。</p>
          </div>
        ),
        okText: '确认',
        cancelText: '取消',
        async onOk() {
          that.$emit('operateData', params)
        },
      })
    },
    // 发布
    handlePublished(id, status) {
      let params = {
        id: id,
        status: status,
      }
      let that = this
      that.$confirm({
        title: '发布',
        icon: 'exclamation-circle',
        content: (
          <div>
            <p>确定发布？</p>
            <p>发布后将该信息状态为寻求合作，进入“已发布的”列表中，如需删除/编辑/退回必须先下架。</p>
          </div>
        ),
        okText: '确认',
        cancelText: '取消',
        async onOk() {
          that.$emit('operateData', params)
        },
      })
    },
    // 下架
    handleOffShelf(id, status) {
      let params = {
        id: id,
        status: status,
      }
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
        async onOk() {
          that.$emit('operateData', params)
        },
      })
    },
    // 审核
    auditOk() {
      this.$refs.apply.validateFields().then(async (res) => {
        let params = { id: this.auditDataId, status: res.status, auditContent: res.auditContent }
        this.$emit('operateData', params)
        this.auditVisible = false
      })
    },
  },
}
</script>
<style lang="less" scoped>
.audit-container {
  background: #f0f2f5;
  margin-top: 16px;
  // 表格
  .table {
    background: #fff;
    overflow: hidden;
    // 提示
    .tips {
      margin: 16px 24px;
      .left-btn {
        margin-right: 8px;
      }
      .ant-alert {
        background: #fffbe6;
        border: 1px solid #ffe58f;
        border-radius: 2px;
        .message {
          font-size: 14px;
          font-weight: 400;
          text-align: left;
          color: rgba(0, 0, 0, 0.65);
          line-height: 20px;
        }
      }
    }
    .data {
      margin: 16px 24px;
      // 图片
      /deep/ .ant-list-item-extra {
        margin-left: 0px;
        .extra {
          .extra-list {
            display: flex;
            justify-content: space-between;
            &-item:first-child {
              margin-left: 32px;
            }
            &-item {
              flex: 1;
              position: relative;
              width: 196px;
              height: 0px;
              padding-top: 196px;
              margin-left: 16px;
              .image {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
              }
            }
          }
        }
      }
      // 标题
      .title {
        display: flex;
        align-items: center;
        font-size: 20px;
        font-weight: 500;
        color: #262626;
        line-height: 28px;
        .icon {
          margin-right: 8px;
          margin-top: 3px;
        }
      }
      // 标签格式
      .label {
        display: flex;
        align-items: center;
        .tags {
          .ant-tag {
            border: none;
            font-size: 12px;
            font-weight: 400;
            line-height: 20px;
            padding: 0 18px;
          }
        }
        .status {
          margin-left: 24px;
          display: flex;
          align-items: center;
          // 审核通过
          .adopt {
            margin-left: 8px;
            font-size: 14px;
            font-weight: 400;
            color: #8c8c8c;
            line-height: 20px;
          }
          // 审核不通过
          .fail {
            margin-left: 8px;
            font-size: 14px;
            font-weight: 400;
            text-align: left;
            color: #e02020;
            line-height: 20px;
          }
        }
      }
      // 列表info字体
      .info > div > span {
        font-size: 14px;
        font-weight: 500;
        text-align: left;
        color: rgba(0, 0, 0, 0.65);
        line-height: 25px;
      }
      // 操作人
      .info > .operator > .name {
        color: #1890ff;
      }
      // 关键词超出宽度显示...
      .over-hidden {
        width: 500px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      // 列表操作按钮
      .btn {
        .btn-right {
          margin-left: 8px;
        }
      }
    }
  }
}
</style>