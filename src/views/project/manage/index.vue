<template>
  <page-header-wrapper>
    <div class="container">
      <div class="search-tab">
        <a-tabs v-model="activeKey" @change="tabChange">
          <a-tab-pane key="1" v-if="jurisdiction('manage:submitShow') > -1 ? true : false">
            <div slot="tab">我提交的</div>
            <submit-list
              ref="submit"
              :submitFilterGroup="submitFilterGroup"
              :projectOwner="projectOwner"
              :projectCategory="projectCategory"
            />
          </a-tab-pane>

          <a-tab-pane key="2" v-if="jurisdiction('manage:auditShow') > -1 ? true : false">
            <div slot="tab">我审核的</div>
            <apply-list
              ref="apply"
              :applyFilterGroup="applyFilterGroup"
              :projectOwner="projectOwner"
              :projectCategory="projectCategory"
            />
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </page-header-wrapper>
</template>
<script>
import { USER_AUTH } from '@/store/mutation-types'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import SubmitList from './components/SubmitList'
import ApplyList from './components/ApplyList'
import { getYear } from '@/utils/year'
import { listByDictCode } from '@/api/listByDictCode'
export default {
  components: {
    PageHeaderWrapper,
    ApplyList,
    SubmitList,
  },
  data() {
    return {
      // 项目所属
      projectOwner: [],
      // 项目类型：
      projectCategory: [],
      activeKey: this.jurisdiction('manage:submitShow') > -1 ? '1' : '2',
      // 我提交的筛选条件组
      submitFilterGroup: [
        {
          label: '项目管理类型',
          filterState: [
            {
              label: '全部',
              value: '',
            },
            {
              label: '正在进行中项目',
              value: '1',
            },
            {
              label: '历史项目',
              value: '2',
            },
          ],
        },
        {
          label: '项目状态',
          filterState: [
            {
              label: '全部',
              value: '',
            },
            {
              label: '待提交',
              value: '100',
            },
            {
              label: '待审核',
              value: '150',
            },
            {
              label: '审核不通过',
              value: '140',
            },
            {
              label: '验收完成',
              value: '450',
            },
            {
              label: '项目终止',
              value: '950',
            },
            {
              label: '待退回',
              value: '135',
            },
            {
              label: '已退回',
              value: '136',
            },
          ],
        },
        {
          label: '当前节点',
          filterState: [
            {
              label: '全部',
              value: '',
            },
            {
              label: '项目信息',
              value: '项目信息',
            },
            {
              label: '阶段检查1',
              value: '阶段检查1',
            },
            {
              label: '阶段检查2',
              value: '阶段检查2',
            },
            {
              label: '阶段检查3',
              value: '阶段检查3',
            },
            {
              label: '阶段检查4',
              value: '阶段检查4',
            },
            {
              label: '阶段检查5',
              value: '阶段检查5',
            },
            {
              label: '绩效评价',
              value: '绩效评价',
            },
          ],
        },
        getYear(),
      ],
      // 我审核的筛选条件组
      applyFilterGroup: [
        {
          label: '项目管理类型',
          filterState: [
            {
              label: '全部',
              value: '',
            },
            {
              label: '正在进行中项目',
              value: '1',
            },
            {
              label: '历史项目',
              value: '2',
            },
          ],
        },
        {
          label: '项目状态',
          filterState: [
            {
              label: '全部',
              value: '',
            },
            {
              label: '待审核',
              value: '150',
            },
            {
              label: '审核不通过',
              value: '140',
            },
            {
              label: '审核通过',
              value: '400',
            },
            {
              label: '验收完成',
              value: '450',
            },
            {
              label: '项目终止',
              value: '950',
            },
            {
              label: '待退回',
              value: '135',
            },
            {
              label: '已退回',
              value: '136',
            },
          ],
        },
        {
          label: '当前节点',
          filterState: [
            {
              label: '全部',
              value: '',
            },
            {
              label: '项目信息',
              value: '项目信息',
            },
            {
              label: '阶段检查1',
              value: '阶段检查1',
            },
            {
              label: '阶段检查2',
              value: '阶段检查2',
            },
            {
              label: '阶段检查3',
              value: '阶段检查3',
            },
            {
              label: '阶段检查4',
              value: '阶段检查4',
            },
            {
              label: '阶段检查5',
              value: '阶段检查5',
            },
            {
              label: '绩效评价',
              value: '绩效评价',
            },
          ],
        },
        getYear(),
      ],
    }
  },
  created() {
    // 获取数据
    this.getListByDictCode()
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
    async getListByDictCode() {
      // 查询项目所属
      await listByDictCode('project_owner').then((res) => {
        if (!res.success) {
          this.$message.warning(res.message)
          return
        }
        this.projectOwner = res.result
        this.changeGroup(res.result)
      })
      // 查询项目类型
      await listByDictCode('project_category').then((res) => {
        if (!res.success) {
          this.$message.warning(res.message)
          return
        }
        this.projectCategory = res.result
      })
      if (this.jurisdiction('manage:submitShow') > -1) {
        this.$nextTick(() => {
          this.$refs.submit.dataList()
        })
      } else {
        this.$nextTick(() => {
          this.$refs.apply.dataList()
        })
      }
    },
    changeGroup(result) {
      let filterStateArray = []
      for (const item of result) {
        let obj = {
          label: item.itemText,
          value: item.itemValue,
        }
        filterStateArray.push(obj)
      }
      let shape = {
        label: '项目所属',
        filterState: [
          {
            label: '全部',
            value: '',
          },
          ...filterStateArray,
        ],
      }
      this.submitFilterGroup.unshift(shape)
      this.applyFilterGroup.unshift(shape)
    },
    tabChange(e) {
      if (e == '1') {
        this.$refs.submit.dataList()
      } else {
        this.$nextTick(() => {
          this.$refs.apply.dataList()
        })
      }
    },
  },
}
</script>

<style lang="less">
.container {
  .ant-tabs-nav-scroll {
    padding: 0 20px;
  }
}
</style>
<style lang="less" scoped>
.container {
  .search-tab {
    background: #fff;
    margin-top: 20px;
  }
}
</style>
