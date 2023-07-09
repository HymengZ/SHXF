<template>
  <div class="container">
    <div class="search-tab">
      <a-tabs>
        <a-tab-pane key="1">
          <div slot="tab">我提交的</div>
          <organization-submit-list ref="submit" :organizationSubmitFilterGroup="organizationSubmitFilterGroup" />
        </a-tab-pane>
        <a-tab-pane key="2">
          <div slot="tab">我审核的</div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import OrganizationSubmitList from '../components/organization/SubmitList'
import OrganizationApplyList from '../components/organization/ApplyList'
import { getYear } from '@/utils/year'
export default {
  components: {
    OrganizationSubmitList,
    OrganizationApplyList,
  },
  data() {
    return {
      // 组织奖-我提交
      organizationSubmitFilterGroup: [
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
      // 组织奖-我审核
    }
  },

  methods: {},
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