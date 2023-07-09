<template>
  <page-header-wrapper>
    <div class="container">
      <div class="search-tab">
        <a-card>
          <a-tabs default-active-key="0" tab-position="left" @change="callback">
            <a-tab-pane
              :forceRender="true"
              key="0"
              tab="固定关键词"
              v-if="jurisdiction('antistop:immobilizationShow') > -1 ? true : false"
            >
              <a-card title="固定关键词" :loading="loading">
                <a-input
                  v-if="inputVisible"
                  ref="input"
                  type="text"
                  size="small"
                  :maxLength="40"
                  :style="{ width: '78px' }"
                  :value="keyword"
                  @change="handleInputChange"
                  @blur="handleInputConfirm"
                  @keyup.enter="handleInputConfirm"
                />
                <a-tag
                  v-has="'antistop:add'"
                  v-if="!inputVisible"
                  style="background: #fff; border-style: dashed; margin-bottom: 10px"
                  @click="showInput"
                >
                  <a-icon type="plus" @click="add()" /> 添加
                </a-tag>
                <br />
                <a-tag v-for="(item, index) in tags" :key="index"
                  >{{ item.keyword }}

                  <span v-has="'antistop:delete'" @click="() => handleClose(item)"><a-icon type="close" /></span
                ></a-tag>
              </a-card>
            </a-tab-pane>
            <a-tab-pane
              :forceRender="true"
              key="1"
              tab="自定义关键词"
              v-if="jurisdiction('antistop:customShow') > -1 ? true : false"
            >
              <a-card title="自定义关键词" :loading="loading">
                <a-input
                  v-if="inputVisible"
                  ref="input"
                  type="text"
                  size="small"
                  :maxLength="40"
                  :style="{ width: '78px' }"
                  :value="keyword"
                  @change="handleInputChange"
                  @blur="handleInputConfirm"
                  @keyup.enter="handleInputConfirm"
                />
                <a-tag
                  v-has="'antistop:adds'"
                  v-if="!inputVisible"
                  style="background: #fff; border-style: dashed; margin-bottom: 10px"
                  @click="showInput"
                >
                  <a-icon type="plus" @click="add()" /> 添加
                </a-tag>
                <br />
                <a-tag v-for="(item, index) in tags" :key="index"
                  >{{ item.keyword }}
                  <span v-has="'antistop:delete'" @click="() => handleClose(item)"><a-icon type="close" /></span
                ></a-tag>
              </a-card>
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </div>
    </div>
  </page-header-wrapper>
</template>
<script>
import { USER_AUTH } from '@/store/mutation-types'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import { getAction, postAction, deleteAction } from '@/api/manage.js'
export default {
  data() {
    return {
      type: 0,
      keyword: '',
      loading: false,
      api: {
        add: '/fire/keyword/add',
        list: '/fire/keyword/list',
        delete: '/fire/keyword/delete',
      },
      tags: [],
      inputVisible: false,
    }
  },
  components: {
    PageHeaderWrapper,
  },
  mounted() {
    //获取list列表
    this.dataList()
  },
  methods: {
    //遍历权限
    jurisdiction(e) {
      let jurisdictionArr = []
      jurisdictionArr = JSON.parse(sessionStorage.getItem(USER_AUTH))
      return jurisdictionArr.findIndex((item) => {
        return item.action == e
      })
    },
    //选项卡
    callback(e) {
      this.type = e
      this.dataList()
    },
    //添加关键词
    add() {
      let params = {
        keyword: this.keyword,
        type: this.type,
      }
      postAction(this.api.add, params).then((res) => {
        if (res.success) {
          this.$message.success(res.message)
          this.dataList()
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    //关键词列表
    dataList() {
      this.loading = true
      getAction(this.api.list, { type: this.type }).then((res) => {
        if (res.success) {
          this.tags = res.result
          // this.$message.success(res.message || '查询成功')
        } else {
          this.$message.warning(res.message || '查询失败')
        }
        this.loading = false
      })
    },
    //删除
    handleClose(e) {
      console.log(e)
      deleteAction(this.api.delete, { id: e.id }).then((res) => {
        if (res.success) {
          this.$message.success(res.message)
          this.dataList()
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(function () {
        this.$refs.input.focus()
      })
    },
    handleInputChange(e) {
      console.log(e)
      this.keyword = e.target.value
    },
    handleInputConfirm() {
      // const keyword = this.keyword
      // let tags = this.tags
      // if (keyword && tags.indexOf(keyword) === -1) {
      this.add()
      // }
      Object.assign(this, {
        inputVisible: false,
        keyword: '',
      })
    },
  },
}
</script>

<style lang="less" scoped>
.container {
  .search-tab {
    background: #fff;
    margin-top: 20px;
  }
  .ant-tabs-nav-scroll {
    padding: 0 20px;
  }
}
</style>