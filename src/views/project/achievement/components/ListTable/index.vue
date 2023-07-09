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
        style="padding-botttom: 0"
        @click="openPreview(item)"
      >
        <!-- 图片 -->
        <div slot="extra">
          <slot name="extra" :row="item" :index="index"> </slot>
        </div>

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
              <a-col :span="2"></a-col>
              <a-col :span="12">
                <div class="actions">
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
    // 默认id
    rowKey: {
      type: String,
      default: 'id',
    },
    // 选择框
    selection: {
      type: Array,
      default: null,
    },
    disabledSelection: {
      type: Array,
      default: null,
    },
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
        }
      },
    },
  },
  methods: {
    // 预览
    openPreview(record) {
      if (this.activeTab == 1) {
        if (this.jurisdiction('achievementSubmit:details') > -1) {
          this.$router.push(`/project/achievement/preview/${record.id}/${this.activeTab}`)
        } else {
          this.$message.warning('无预览权限')
        }
      }
      if (this.activeTab == 2) {
        if (this.jurisdiction('achievementApply:details') > -1) {
          this.$router.push(`/project/achievement/preview/${record.id}/${this.activeTab}`)
        } else {
          this.$message.warning('无预览权限')
        }
      }
    },
    // 遍历全选
    jurisdiction(e) {
      let jurisdictionArr = []
      jurisdictionArr = JSON.parse(sessionStorage.getItem(USER_AUTH))
      return jurisdictionArr.findIndex((item) => {
        return item.action == e
      })
    },
    // 选择改变
    handleSelectionChange(e, item) {
      e.stopPropagation()
      if (e.target.checked) {
        this.$emit('select', [...this.selection, item[this.rowKey]])
      } else {
        this.$emit(
          'select',
          this.selection.filter((key) => key !== item[this.rowKey])
        )
      }
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
.actions {
  height: 100%;
  text-align: right;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  /deep/ .btn {
    margin-left: 8px;
  }
}
.footer {
  background: #fafafa;
  width: 100%;
  padding: 9px 16px 0px;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-bottom: -20px;
}
</style>

<style lang="less">
.list-table__ .ant-list-item-action > li {
  width: 100%;
  padding: 0;
  text-align: left;
}
</style>
