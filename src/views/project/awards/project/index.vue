<template>
  <div class="container">
    <div class="search-tab">
      <a-tabs v-model="activeKey" @change="tabChange">
        <a-tab-pane key="1" v-if="jurisdiction('achievement:submitShow') > -1 ? true : false">
          <div slot="tab">我提交的</div>
          <project-submit-list
            ref="submit"
            :projectSubmitFilterGroup="projectSubmitFilterGroup"
            :awardTypeList="awardTypeList"
          />
        </a-tab-pane>
        <a-tab-pane key="2" v-if="jurisdiction('achievement:auditShow') > -1 ? true : false">
          <div slot="tab">我审核的</div>
          <project-apply-list
            ref="apply"
            :projectApplyFilterGroup="projectApplyFilterGroup"
            :awardTypeList="awardTypeList"
          />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import { USER_AUTH } from '@/store/mutation-types'
import ProjectSubmitList from '../components/project/SubmitList'
import ProjectApplyList from '../components/project/ApplyList'
import { getYear } from '@/utils/year'
import { listByDictCode } from '@/api/listByDictCode'
export default {
  components: {
    ProjectSubmitList,
    ProjectApplyList,
  },
  data() {
    return {
      activeKey: this.jurisdiction('achievement:submitShow') > -1 ? '1' : '2',
      awardTypeList: [],
      // 项目奖-我提交的筛选条件组
      projectSubmitFilterGroup: [
        {
          label: '奖项状态',
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
              label: '审核完成',
              value: '200',
            },
            {
              label: '审核不通过',
              value: '500',
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
        getYear(),
      ],
      // 项目奖-我审核的筛选条件组
      projectApplyFilterGroup: [
        {
          label: '奖项状态',
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
              label: '审核通过',
              value: '200',
            },
            {
              label: '审核不通过',
              value: '500',
            },
            {
              label: '审核完成',
              value: '300',
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
        getYear(),
      ],
    }
  },
  created() {
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
    tabChange(e) {
      if (e == '1') {
        this.$nextTick(() => {
          this.$refs.submit.dataList()
        })
      } else {
        this.$nextTick(() => {
          this.$refs.apply.dataList()
        })
      }
    },
    async getListByDictCode() {
      // 奖项类型
      await listByDictCode('award_type').then((res) => {
        if (!res.success) {
          this.$message.warning(res.message)
          return
        }
        this.awardTypeList = res.result
        this.changeGroup(res.result)
      })
      if (this.jurisdiction('achievement:submitShow') > -1) {
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
        label: '奖项类型',
        filterState: [
          {
            label: '全部',
            value: '',
          },
          ...filterStateArray,
        ],
      }
      this.projectSubmitFilterGroup.unshift(shape)
      this.projectApplyFilterGroup.unshift(shape)
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