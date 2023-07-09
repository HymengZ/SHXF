<template>
  <div class="list-table__">
    <a-list
      :loading="loading"
      item-layout="vertical"
      size="large"
      :pagination="pagination"
      rowKey="id"
      :data-source="list"
    >
      <a-list-item
        slot="renderItem"
        :key="index"
        slot-scope="item, index"
        style="padding-bottom: 0"
        @click="openPreview(item)"
      >
        <a-list-item-meta>
          <!-- 标题 -->
          <div slot="title">
            <slot name="title" :row="item" :index="index"> </slot>
            <!-- 标签 -->
            <div class="label">
              <slot name="label" :row="item" :index="index"> </slot>
            </div>
          </div>

          <!-- 描述 -->
          <div slot="description">
            <div class="description">
              <a-col :span="10" class="info">
                <slot name="desc-left" :row="item" :index="index"></slot>
              </a-col>
              <a-col :span="8"></a-col>
              <a-col :span="6">
                <div class="right">
                  <slot name="stage" :row="item" :index="index"></slot>
                  <slot name="actions" :row="item" :index="index"></slot>
                </div>
              </a-col>
            </div>
          </div>
        </a-list-item-meta>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
import { USER_AUTH } from '@/store/mutation-types'
export default {
  props: {
    activeTab: {
      type: Number,
      default: 1,
    },
    list: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    pagination: {
      type: Object,
      default() {
        return {
          pageSize: 10,
          total: 100,
          current: 1,
          onChange(e) {
            console.log(e)
          },
        }
      },
    },
  },
  methods: {
    openPreview(record) {
      if (this.activeTab == 1) {
        if (this.jurisdiction('manageSubmit:details') > -1) {
          this.$router.push(`/project/manage/preview/${record.id}/${this.activeTab}`)
        } else {
          this.$message.warning('无预览权限')
        }
      }
      if (this.activeTab == 2) {
        if (this.jurisdiction('manageApply:details') > -1) {
          this.$router.push(`/project/manage/preview/${record.id}/${this.activeTab}`)
        } else {
          this.$message.warning('无预览权限')
        }
      }
    },
    jurisdiction(e) {
      let jurisdictionArr = []
      jurisdictionArr = JSON.parse(sessionStorage.getItem(USER_AUTH))
      return jurisdictionArr.findIndex((item) => {
        return item.action == e
      })
    },
  },
}
</script>

<style lang="less" scoped>
.ant-list-item {
  cursor: pointer;
}
// 标题
.ant-list-item-meta-title {
  margin-bottom: 0;
}
// 标签
.label {
  margin: 8px 0 17px 0;
}
//描述
.description {
  display: flex;
  align-items: stretch;
}
.info {
  display: flex;
  flex-wrap: wrap;
  > div {
    display: block;
    width: 50%;
  }
}
.right {
  height: 100%;
  text-align: right;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  /deep/ .btn {
    margin-left: 8px;
  }
}
</style>

<style lang="less">
.list-table__ .ant-list-item-action > li {
  width: 100%;
  padding: 0;
  text-align: left;
}
</style>
