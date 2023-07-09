<template>
  <div class="tag-checkbox">
    <div class="filter-group" style="display: flex" v-for="(item, indexx) in options" :key="indexx">
      <div class="label">
        <span class="text">{{ item.label }}</span>
      </div>
      <div class="filter-group-items">
        <a-checkable-tag
          v-for="(state, index) in item.filterState"
          :key="index"
          @change="handleChange($event, item.label, state.value, state.label)"
          :checked="handleChecked(item.label, state.value, state.label)"
          style="margin: 5px 0; font-size: 14px; margin-left: 20px"
        >
          {{ state.label }}
        </a-checkable-tag>
      </div>
    </div>
    <div class="filter-common" style="display: flex">
      <div class="label">
        <span class="text">模糊搜索</span>
      </div>
      <div class="condition">
        <a-input class="vague" v-model="searchKey" type="text" placeholder="请输入名称/编号/发布单位/关键词模糊搜索" />
      </div>
    </div>
    <!-- 搜索 -->
    <div class="search">
      <!-- 已选筛选项 -->
      <div class="filter-item">
        已选筛选项：<span v-if="tagGroup.length == 0">无</span
        ><a-tag closable v-for="(item, index) in tagGroup" :key="index" @close="closeTag(item)">{{ item.label }}</a-tag>
      </div>
      <div class="btn">
        <a-button @click="handleReset">重置</a-button>
        <a-button type="primary" @click="handleSearch">搜索</a-button>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  props: {
    options: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      // 项目状态
      processStatus: [''],
      // 奖项状态文字
      processStatusText: [],
      // 所属年度
      ownerYear: [''],
      // 所属年度文字
      ownerYearText: [],
      // 模糊搜索
      searchKey: '',
    }
  },
  computed: {
    tagGroup() {
      return [...this.processStatusText, ...this.ownerYearText]
    },
  },
  methods: {
    // 标签关闭
    closeTag(e) {
      switch (e.name) {
        case '项目状态':
          this.processStatus = this.processStatus.filter((item) => item != e.value)
          this.processStatusText = this.processStatusText.filter((item) => item.value != e.value)
          break
        case '所属年度':
          this.ownerYear = this.ownerYear.filter((item) => item != e.value)
          this.ownerYearText = this.ownerYearText.filter((item) => item.value != e.value)
          break
      }
    },

    // 选中/取消选中的回调
    handleChange(checked, labelName, tagValue, tagLabel) {
      if (checked) {
        switch (labelName) {
          case '项目状态':
            this.processStatus = this.processStatus.filter((item) => item != '')
            this.processStatus.push(tagValue)
            this.processStatusText = this.processStatusText.filter((item) => item.value != '')
            this.processStatusText.push({ name: labelName, value: tagValue, label: tagLabel })
            break
          case '所属年度':
            this.ownerYear = this.ownerYear.filter((item) => item != '')
            this.ownerYear.push(tagValue)
            this.ownerYearText = this.ownerYearText.filter((item) => item.value != '')
            this.ownerYearText.push({ name: labelName, value: tagValue, label: tagLabel })
            break
        }
      } else {
        switch (labelName) {
          case '项目状态':
            this.processStatus = this.processStatus.filter((item) => item !== tagValue)
            this.processStatusText = this.processStatusText.filter((item) => item.label !== tagLabel)
            break
          case '所属年度':
            this.ownerYear = this.ownerYear.filter((item) => item !== tagValue)
            this.ownerYearText = this.ownerYearText.filter((item) => item.label !== tagLabel)
            break
        }
      }
    },
    // 是否选中
    handleChecked(labelName, tagValue) {
      let changedGroup = []
      switch (labelName) {
        case '项目状态':
          changedGroup = this.processStatus
          break
        case '所属年度':
          changedGroup = this.ownerYear
          break
      }
      if (changedGroup.indexOf(tagValue) != -1) {
        return true
      } else {
        return false
      }
    },
    // 搜索
    handleSearch() {
      // 处理空值
      let processStatus = this.processStatus
      let ownerYear = this.ownerYear
      let keyWord = this.searchKey
      if (this.processStatus.indexOf('') != -1) {
        processStatus = []
      }
      if (this.ownerYear.indexOf('') != -1) {
        ownerYear = []
      }

      // 搜索条件
      let params = {
        processStatus: processStatus.toString(),
        year: ownerYear.toString(),
        searchKey: keyWord,
      }
      this.$emit('searchParams', params)
    },
    // 重置
    handleReset() {
      this.processStatus = ['']
      this.ownerYear = ['']
      // 筛选项
      this.processStatusText = []
      this.ownerYearText = []
      this.searchKey = ''
    },
  },
}
</script>

<style lang="less" scoped>
.tag-checkbox {
  // 筛选组
  .filter-group,
  .filter-common {
    display: flex;
    align-items: stretch;
    background: #fff;
    line-height: 42px;
    // 搜索类型
    .label {
      display: flex;
      align-items: center;
      width: 160px;
      min-width: 160px;
      min-height: 46px;
      background: #fafafa;
      // text-align: center;
      padding-left: 16px;
      box-sizing: border-box;
      line-height: 42px;
      border: 1px solid #f0f0f0;
      // 文字
      .text {
        font-size: 14px;
        // font-family: PingFang SC, PingFang SC-5;
        font-weight: 400;
        text-align: left;
        color: #262626;
        line-height: 14px;
      }
    }
    // 搜索条件
    .filter-group-items,
    .condition {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      width: 100%;
      border: 1px solid #f0f0f0;
      color: #595959;
      // 模糊搜索
      .ant-input {
        width: 70%;
        margin-left: 18px;
      }
      .ant-input::placeholder {
        font-size: 14px;
        font-family: PingFang SC, PingFang SC-5;
        font-weight: 400;
        text-align: left;
        color: #bfbfbf;
        line-height: 15px;
      }
    }
  }
  // 搜索
  .search {
    display: flex;
    widows: 100%;
    align-items: center;
    margin-top: 20px;
    // 已筛选
    .filter-item {
      flex: 5;
      font-size: 14px;
      font-family: PingFang SC, PingFang SC-5;
      font-weight: 400;
      text-align: left;
      color: #8c8c8c;
      line-height: 20px;
    }

    // 按钮
    .btn {
      display: flex;
      flex: 1;
      justify-content: flex-end;
      .ant-btn {
        margin-left: 8px;
      }
    }
  }
}
</style>