<!--  -->
<template>
  <div class="search">
    <div class="filter-group" style="display: flex" v-for="(item, indexx) in options" :key="indexx">
      <div class="label">
        <span class="text">{{ item.label }}</span>
      </div>
      <div class="filter-group-items">
        <a-checkable-tag
          v-for="(state, index) in item.filterState"
          :key="index"
          v-model="state.checked"
          @change="handleChange($event, item.item, state.value, state.label)"
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
        <a-input
          class="vague"
          v-model="item.searchKey"
          type="text"
          placeholder="请输入名称/编号/发布单位/关键词模糊搜索"
        />
      </div>
    </div>
    <!-- 搜索 -->
    <div class="searchBlock">
      <!-- 已选筛选项 -->
      <div class="filter-item">
        已选筛选项：<span v-if="tagGroup.length == 0">无</span
        ><a-tag closable v-for="item in tagGroup" :key="item.label" @close="closeTag(item)">{{ item.label }}</a-tag>
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
  components: {},
  data() {
    return {
      tagGroup: [],
      //传后端数据
      item: {},
      options: [],
      optionsBk: [],
    }
  },
  methods: {
    init(data) {
      this.options = JSON.parse(JSON.stringify(data))
      this.optionsBk = JSON.parse(JSON.stringify(data))
    },
    handleChange(checked, labelName, tagValue, tagLabel) {
      let that = this
      let options = this.options
      let tagGroup = this.tagGroup
      if (checked) {
        var isOk = true
        for (let i = 0; i < tagGroup.length; i++) {
          if (tagGroup[i].label == tagLabel) {
            isOk = false
          }
        }
        if (isOk && tagLabel != '全部') {
          this.tagGroup.push({ name: tagValue, label: tagLabel })
        }
        if (tagLabel != '全部') {
          if (this.item[labelName]) {
            if (this.item[labelName].indexOf('') != -1) {
              this.item[labelName] = []
              this.item[labelName].push(tagValue)
            } else {
              this.item[labelName].push(tagValue)
            }
          } else {
            this.item[labelName] = [tagValue]
          }
        } else {
          this.item[labelName] = ['']
        }
        if (this.item[[labelName]].length > 0 && tagLabel != '全部') {
          for (let i = 0; i < options.length; i++) {
            if (options[i].item == labelName) {
              options[i].filterState[0].checked = false
            }
          }
        }
        if (tagLabel == '全部') {
          for (let i = 0; i < options.length; i++) {
            if (options[i].item == labelName) {
              options[i].filterState.filter((e) => {
                e.label != '全部' ? (e.checked = false) : ''
              })

              for (let j = 0; j < options[i].filterState.length; j++) {
                that.tagGroup = that.tagGroup.filter((e) => {
                  return e.label != options[i].filterState[j].label
                })
              }
            }
          }
        }
      } else {
        let group = this.tagGroup
        this.tagGroup = group.filter((item) => {
          return item.label != tagLabel
        })
        this.item[labelName] = this.item[[labelName]].filter((item) => {
          return item != tagValue
        })
      }
    },
    closeTag(label) {
      var data = this.options
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].filterState.length; j++) {
          if (label.label == data[i].filterState[j].label) {
            this.options[i].filterState[j].checked = false
          }
          if (label.name == data[i].filterState[j].value) {
            this.item[[data[i].item]] = this.item[[data[i].item]].filter((e) => {
              return e != label.name
            })
          }
        }
      }
      this.tagGroup = this.tagGroup.filter((e) => {
        return e.label != label.label
      })
      console.log('this.taggroup', this.tagGroup)
    },
    //重置
    handleReset() {
      this.options = JSON.parse(JSON.stringify(this.optionsBk))
      this.item = {}
      this.tagGroup = []
    },
    //搜索
    handleSearch() {
      this.$emit('searchParams', this.item)
    },
  },
}
</script>
<style lang="less" scoped>
.search {
  padding: 0 24px 24px;
  background: #fff;
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
  .searchBlock {
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