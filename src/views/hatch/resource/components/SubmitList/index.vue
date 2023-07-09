<template>
  <div class="submit-container">
    <div class="table">
      <div class="tips">
        <a-alert banner>
          <div slot="message" class="message">
            1、已提交的科技资源当前无法修改，如需修改/删除请进行申请退回操作；<br />
            2、寻求合作中的科技资源会不断匹配新的科技需求，请尽量在匹配时间60天内的有效期尽快勾选愿意对接的科技需求，有效期超过后将会失效无法勾选；<br />
            3、已下架的科技资源如无问题，请及时联系平台管理员重新发布，避免影响后期业务对接。
          </div>
        </a-alert>
      </div>
      <div class="actions">
        <a-button class="left-btn" @click="openUnitModal" v-has="'achievementSubmit:add'">
          <a-icon type="setting" />
          单位信息修改
        </a-button>
        <a-button type="primary" @click="openAddModal" v-has="'achievementSubmit:add'">
          <a-icon type="plus" />
          新增科技资源
        </a-button>
      </div>
      <div class="data">
        <list-table :list="resourceData" :pagination="pagination" :loading="loading" :activeTab="1">
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
              <img v-if="row.status == '0'" src="~@/assets/icon_待提交.png" alt="状态" />
              <img v-else-if="['1', '2'].indexOf(row.status) != -1" src="~@/assets/icon_待审核.png" alt="状态" />
              <img v-else-if="row.status == '3'" src="~@/assets/icon_审核不通过.png" alt="状态" />
              <img v-else-if="row.status == '6'" src="~@/assets/icon_寻求合作.png" alt="状态" />
              <img v-else-if="row.status == '7'" src="~@/assets/icon_已下架.png" alt="状态" />
              <img v-else-if="row.status == '4'" src="~@/assets/icon_待退回.png" alt="状态" />
              <img v-else-if="row.status == '5'" src="~@/assets/icon_已退回.png" alt="状态" />
              <span v-if="row.status == '3'" class="fail">审核意见：{{ row.auditContent }}</span>
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
          </div>
          <div class="btn" slot-scope="{ row }" slot="actions">
            <a-dropdown>
              <a-button @click="handleClick">更多操作</a-button>
              <a-menu slot="overlay">
                <a-menu-item
                  key="delete"
                  @click="handleDelete(row.id)"
                  :disabled="['0', '3', '5'].indexOf(row.status) == -1"
                  v-has="'achievementSubmit:delete'"
                >
                  删除
                </a-menu-item>
                <a-menu-item
                  key="edit"
                  @click="handleEdit(row)"
                  :disabled="['0', '3', '5'].indexOf(row.status) == -1"
                  v-has="'achievementSubmit:edit'"
                >
                  编辑
                </a-menu-item>
                <a-menu-item
                  key="submit"
                  @click="handleSubmit(row.id, '1')"
                  :disabled="['0'].indexOf(row.status) == -1"
                  v-has="'achievementSubmit:submit'"
                >
                  提交
                </a-menu-item>
                <a-menu-item
                  key="back"
                  :disabled="['1', '6'].indexOf(row.status) == -1"
                  @click="handleApplyBack(row.id, row.status == '6' ? '8' : '4')"
                  v-has="'achievementSubmit:applyReturn'"
                >
                  申请退回
                </a-menu-item>
              </a-menu>
            </a-dropdown>
            <a-button @click="handlePartake($event)" class="btn-right" type="primary">参与的孵化</a-button>
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
      <StepBar @cancel="handleCancel" :type="type" :editDataId="editDataId" v-bind="$attrs" />
    </j-modal>
    <j-modal
      title="参与的项目"
      :visible="hatchVisible"
      switchFullscreen
      :fullscreen="true"
      @cancel="handleHatchCancel"
      class="j-modal"
    >
      <template slot="footer">
        <a-button @click="handleHatchCancel" type="primary">返回科技资源列表</a-button>
      </template>
      <div class="tips">
        <a-alert banner>
          <div slot="message" class="message">
            1、科技资源孵化匹配消息中勾选“愿意匹配”后会进入【已参与的孵化】查看已勾选的匹配需求信息，追踪需求的孵化状态；<br />
            2、内部单位录入科技项目后，项目参与单位的能在【已参与的项目】列表查看项目基本信息，追踪项目的推进状态。
          </div>
        </a-alert>
      </div>
      <div class="tab-container">
        <a-tabs v-model="activeKey" @change="tabChange">
          <a-tab-pane :key="1">
            <div slot="tab">已参与的孵化</div>
            <involved-hatch ref="hatch" />
          </a-tab-pane>
          <a-tab-pane :key="2">
            <div slot="tab">已参与的项目</div>
            <involved-project ref="project" />
          </a-tab-pane>
        </a-tabs>
      </div>
    </j-modal>
  </div>
</template>
<script>
// 引入封装的表格
import ListTable from '../listTable.vue'
// 引入步骤条
import StepBar from '../stepBar.vue'
// 引入已参与孵化和项目
import InvolvedHatch from './involvedHatch.vue'
import InvolvedProject from './involvedProject.vue'
// 引入请求
// import { fetchResourceList, deleteResource, handleResource } from '@/api/hatch/resource'
import { formatMinute } from '@/utils/formatDate'
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
    InvolvedHatch,
    InvolvedProject,
  },
  data() {
    return {
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
      // 参与的项目
      activeKey: 1,
      // pagination: {
      //   total: 0,
      //   pageSize: 10,
      //   showLessItems: true,
      //   showTotal: (total) => `共 ${total} 条`,
      //   showSizeChanger: true,
      //   current: 1,
      //   onChange: this.pageChange.bind(this),
      //   onShowSizeChange: this.pageChange.bind(this),
      // },
      // 我提交的列表数据
      // submitList: [],
      // 加载状态
      // loading: false,
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
    // //pageSize 变化的回调
    // pageChange(page, pageSize) {
    //   this.pagination.current = page || 1
    //   this.pagination.pageSize = pageSize
    //   this.dataList()
    // },
    // // 请求列表数据
    // async dataList() {
    //   this.loading = true
    //   let params = Object.assign(
    //     {},
    //     { flag: 2, pageNo: this.pagination.current, pageSize: this.pagination.pageSize },
    //     this.searchArray
    //   )
    //   const { success, message, result } = await fetchResourceList(params)
    //   if (success) {
    //     this.submitList = result.records
    //     this.loading = false
    //     this.pagination.total = result.total
    //   } else {
    //     this.$message.warning(message || '请求列表数据失败')
    //   }
    // },
    // 更多操作,阻止点击进入预览
    handleClick(e) {
      e.stopPropagation()
    },
    handlePartake(e) {
      e.stopPropagation()
      this.hatchVisible = true
    },
    tabChange(e) {
      this.activeKey = e
    },
    // 单位信息修改
    openUnitModal() {},
    //新增数据
    openAddModal() {
      this.type = 'add'
      this.reportVisible = true
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
    // 提交数据
    handleSubmit(id, status) {
      let params = {
        id: id,
        status: status,
      }
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
        async onOk() {
          that.$emit('operateData', params)
        },
      })
    },
    // 申请退回
    handleApplyBack(id, status) {
      let params = {
        id: id,
        status: status,
      }
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
        async onOk() {
          that.$emit('operateData', params)
        },
      })
    },
  },
}
</script>
<style lang="less" scoped>
.submit-container {
  background: #f0f2f5;
  margin-top: 16px;
  // 表格
  .table {
    background: #fff;
    overflow: hidden;
    // 提示
    .tips,
    .actions {
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
// 弹窗tips
.tips {
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
</style>
