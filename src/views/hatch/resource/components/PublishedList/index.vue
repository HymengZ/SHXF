<template>
  <div class="published-container">
    <div class="table">
      <div class="data">
        <list-table :list="resourceData" :pagination="pagination" :loading="loading" :activeTab="0">
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
              <span>发布时间：{{ row.publishTime }} </span>
            </div>
          </div>
          <div class="btn" slot-scope="{ row }" slot="actions">
            <a-button class="btn" type="primary" @click="handleContact($event, row)" v-has="'achievementApply:audit'"
              >联系我们</a-button
            >
          </div>
        </list-table>
      </div>
    </div>
  </div>
</template>
<script>
// 引入封装的表格
import ListTable from '../listTable.vue'
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
  },
  data() {
    return {}
  },
  computed: {
    basicUrl() {
      return process.env.VUE_APP_API_BASE_URL + '/'
    },
    userInfo() {
      return this.$store.state.user.info
    },
  },

  methods: {
    formatMinute,
    // 截取两张图片
    filter(list) {
      return list.slice(0, 2)
    },
    // 发布
    handleContact(e, records) {
      e.stopPropagation()
      const userInfo = this.userInfo
      let params = {
        initiateMobile: userInfo.phone,
        initiateName: userInfo.realname,
        initiateUnitName: userInfo.belongUnitName,
        resourceContactMobile: records.contactMobile,
        resourceContactName: records.contactName,
        resourceName: records.name,
      }
      let that = this
      that.$confirm({
        title: '联系我们',
        icon: 'exclamation-circle',
        content: (
          <div>
            <p>你的联系意愿平台将会记录，我们将于24小时内给予答复，请您注意接听电话。</p>
          </div>
        ),
        okText: '确认',
        cancelText: '取消',
        async onOk() {
          that.$emit('addContactUs', params)
        },
      })
    },
  },
}
</script>
<style lang="less" scoped>
.published-container {
  background: #f0f2f5;
  margin-top: 16px;
  // 表格
  .table {
    background: #fff;
    overflow: hidden;
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
</style>