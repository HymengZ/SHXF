<template>
  <div class="list-table__">
    <a-list
      :loading="loading"
      item-layout="vertical"
      size="large"
      :pagination="pagination"
      :data-source="list"
      rowKey="id"
      :locale="{emptyText}"
    >
      <a-list-item slot="renderItem" :key="index" slot-scope="item, index" style="padding-botttom: 0">
        <a-list-item-meta>
          <div slot="avatar" class="avatar-wrapper">
            <a-checkbox
              v-if="selection"
              :checked="selection && selection.indexOf(item[rowKey]) >= 0"
              :disabled="disabledSelection && disabledSelection.indexOf(item[rowKey]) >= 0"
              @change="handleSelectionChange($event, item)"
            />

            <slot name="icon" :row="item" :index="index">
              <div class="icon"/>
            </slot>
          </div>

          <div slot="title">
            <slot name="title" :row="item" :index="index">
              {{ item.title }}
            </slot>
          </div>
          <div slot="description">
            <div class="description">
              <a-col :span="10" class="info">
                <slot name="desc-left" :row="item" :index="index"></slot>
              </a-col>
              <a-col :span="8">
                <slot name="desc-right" :row="item" :index="index"></slot>
              </a-col>
              <a-col :span="6">
                <div class="actions">
                  <slot name="actions" :row="item" :index="index"></slot>
                </div>
              </a-col>
            </div>
            <div class="footer"></div>
          </div>
        </a-list-item-meta>
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
    emptyText: {
      type: Object,
      default() {
        return {}
      },
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
  computed: {
    renderSlotName() {
      return Object.keys(this.$scopedSlots)
    },
  },
  data() {
    return {
      actions: [
        {type: 'star-o', text: '156'},
        {type: 'like-o', text: '156'},
        {type: 'message', text: '2'},
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
          this.selection.filter((key) => key !== item[this.rowKey])
        )
      }
    },
  },
}
</script>

<style lang="less" scoped>
.avatar-wrapper {
  display: flex;
  align-items: flex-start;
  padding-top: 5px;
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
  flex-direction: column;
  height: 120px;
  line-height: 25px;
}

.actions {
  height: 100%;
  text-align: right;
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.footer {
  // background: #fafafa;
  width: 100%;
  // padding: 9px 16px 0px;
  // display: flex;
  // align-items: center;
  // flex-direction: row;
  // justify-content: flex-start;
  // flex-wrap: wrap;
  margin-bottom: -15px;
}
</style>

<style lang="less">
.list-table__ .ant-list-item-action > li {
  width: 100%;
  padding: 0;
  text-align: left;
}
</style>
