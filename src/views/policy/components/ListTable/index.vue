<template>
  <div class="list-table__">
    <a-list :loading="loading" item-layout="vertical" size="large" :pagination="pagination" :data-source="list">
      <a-list-item slot="renderItem" :key="index" slot-scope="item, index" style="padding-botttom: 0">
        <a-list-item-meta>
          <div slot="avatar" class="avatar-wrapper">
            <a-checkbox
              v-if="selection"
              :checked="selection && selection.indexOf(item[rowKey]) >= 0"
              :disabled="disabledSelection && disabledSelection.indexOf(item[rowKey]) >= 0"
              @change="handleSelectionChange($event, item)"
            />
            <div class="icon" />
          </div>

          <div slot="title">
            <slot name="title" :row="item" :index="index">
              {{ item.title }}
            </slot>
            <slot name="status" :row="item" :index="index">
              <a-badge color="yellow" text="待提交" />
            </slot>
          </div>
          <div slot="description">
            <div class="description">
              <a-col :span="16" class="info">
                <div v-for="key in Object.keys(item)" :key="key">
                  <slot :row="item" :name="key" :index="index"></slot>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="actions">
                  <slot name="actions" :row="item" :index="index"></slot>
                </div>
              </a-col>
            </div>
          </div>
        </a-list-item-meta>
        <template slot="actions">
          <div class="footer"><slot name="footer" :row="item" :index="index"></slot></div>
        </template>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
export default {
  props: {
    rowKey: {
      type: String,
      default: 'id',
    },
    list: {
      type: Array,
      default: () => [],
    },
    selection: {
      type: Array,
      default: null,
    },
    disabledSelection: {
      type: Array,
      default: null,
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
  data() {
    return {
      actions: [
        { type: 'star-o', text: '156' },
        { type: 'like-o', text: '156' },
        { type: 'message', text: '2' },
      ],
    }
  },
  methods: {
    handleSelectionChange(e, item) {
      if (e.target.checked) {
        this.$emit('select', [...this.selection, item[this.rowKey]])
      } else {
        this.$emit(
          'select',
          this.selection.filter((key) => key != item[this.rowKey])
        )
      }
    },
  },
}
</script>

<style lang="less" scoped>
.avatar-wrapper {
  display: flex;
  align-items: center;
  height: 26px;
  line-height: 1;
  .icon {
    width: 16px;
    height: 16px;
    background: #eee;
    margin-left: 5px;
  }
}

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
