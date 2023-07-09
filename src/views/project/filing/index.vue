<template>
  <page-header-wrapper>
    <div class="container">
      <div class="search-tab">
        <a-tabs v-model="activeKey" @change="tabs">
          <a-tab-pane key="1" v-if="jurisdiction('filing:submitShow') > -1 ? true : false">
            <div slot="tab">我提交的</div>
            <submit-list ref="submit" :pojectType="pojectType" :pojectState="pojectState" />
          </a-tab-pane>

          <a-tab-pane key="2" v-if="jurisdiction('filing:auditShow') > -1 ? true : false">
            <div slot="tab">我审核的</div>
            <apply-list ref="apply" :pojectType="pojectType" :pojectState="auditState" />
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </page-header-wrapper>
</template>

<script>
import { USER_AUTH } from '@/store/mutation-types'
import PageHeaderWrapper from '../../../components/PageHeaderWrapper'
import SubmitList from './components/SubmitList'
import ApplyList from './components/ApplyList'
const PRIZE_STATUS_EMNU = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '项目信息待提交',
    value: '100',
    color: '#FAAD14',
  },

  {
    label: '项目信息审核驳回',
    value: '140',
    color: 'red',
  },
  {
    label: '项目信息待审核',
    value: '150',
    color: '#FAAD14',
  },
  {
    label: '中期检查待提交',
    value: '200',
    color: '#FAAD14',
  },
  {
    label: '中期检查审核驳回',
    value: '240',
    color: 'red',
  },

  {
    label: '中期检查待审核',
    value: '250',
    color: '#FAAD14',
  },

  {
    label: '绩效评价待提交',
    value: '300',
    color: '#FAAD14',
  },
  {
    label: '绩效评价审核驳回',
    value: '340',
    color: 'red',
  },

  {
    label: '绩效评价待审核',
    value: '350',
    color: '#FAAD14',
  },

  {
    label: '验收完成',
    value: '400',
    color: 'green',
  },
  {
    label: '项目终止',
    value: '950',
    color: '#808080',
  },
  {
    label: '已退回',
    value: ['130','230','330'],
    color: 'red',
  },
  {
    label: '待退回',
    value: ['155','255','355'],
    color: '#FAAD14',
  },
  {
    label: '已发布',
    value: '800',
    color: 'green',
  },
  {
    label: '已下架',
    value: '900',
    color: '#808080',
  },

]
const PRIZE_CATEGORY_EMNU = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '基础研究',
    value: '1',
  },
  {
    label: '重点研发',
    value: '2',
  },
  {
    label: '消防管理理论与软科学',
    value: '3',
  },
  {
    label: '应用创新',
    value: '4',
  },
  {
    label: '其他',
    value: '0',
  },
]
export default {
  components: {
    PageHeaderWrapper,
    ApplyList,
    SubmitList,
  },
  data() {
    return {
      activeKey: this.jurisdiction('filing:submitShow') > -1 ? '1' : '2',
      pojectType: PRIZE_CATEGORY_EMNU,
      pojectState: PRIZE_STATUS_EMNU,
      auditState: PRIZE_STATUS_EMNU,
    }
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
    tabs(e) {
      if (e == 1) {
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
