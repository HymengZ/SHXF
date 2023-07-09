<template>
  <page-header-wrapper>
    <div class="container">
      <div class="search-tab">
        <a-tabs v-model="activeKey" @change="tabChange">
          <a-tab-pane key="1" v-if="jurisdiction('achievement:submitShow') > -1 ? true : false">
            <div slot="tab">我提交的</div>
            <submit-list
              ref="submit"
              :submitFilterGroup="submitFilterGroup"
              :formResult="formResult"
              :formType="formType"
            />
          </a-tab-pane>
          <a-tab-pane key="2" v-if="jurisdiction('achievement:auditShow') > -1 ? true : false">
            <div slot="tab">我审核的</div>
            <apply-list
              ref="apply"
              :applyFilterGroup="applyFilterGroup"
              :formResult="formResult"
              :formType="formType"
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
      // 成果形式
      formResult: [],
      // 成果类型
      formType: [],
      activeKey: this.jurisdiction('achievement:submitShow') > -1 ? '1' : '2',
      // 我提交的筛选条件组
      submitFilterGroup: [
        {
          label: '成果状态',
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
      // 我审核的筛选条件组
      applyFilterGroup: [
        {
          label: '成果状态',
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

    async getListByDictCode() {
      // 查询成果形式
      await listByDictCode('form_result').then((res) => {
        if (!res.success) {
          this.$message.warning(res.message)
          return
        }
        this.formResult = res.result
        this.changeGroup(res.result, 'form_result')
      })
      // 查询成果类型
      await listByDictCode('form_type').then((res) => {
        if (!res.success) {
          this.$message.warning(res.message)
          return
        }
        this.formType = res.result
        this.changeGroup(res.result, 'form_type')
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
    changeGroup(result, type) {
      let filterStateArray = []
      for (const item of result) {
        let obj = {
          label: item.itemText,
          value: item.itemValue,
        }
        filterStateArray.push(obj)
      }
      let shape = {
        label: type == 'form_result' ? '成果形式' : '成果类型',
        filterState: [
          {
            label: '全部',
            value: '',
          },
          ...filterStateArray,
        ],
      }
      if (type == 'form_result') {
        this.submitFilterGroup.unshift(shape)
        this.applyFilterGroup.unshift(shape)
      } else {
        this.submitFilterGroup.unshift(shape)
        this.applyFilterGroup.unshift(shape)
      }
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
