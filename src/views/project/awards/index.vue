<template>
  <page-header-wrapper :showFooter="true">
    <div slot="tab">
      <a-tabs v-model="awardsActiveKey" @change="awardsChange">
        <a-tab-pane key="1" tab="科技创新项目奖" />
        <a-tab-pane key="2" tab="科技创新组织奖" />
      </a-tabs>
    </div>
    <div class="container">
      <router-view />
    </div>
  </page-header-wrapper>
</template>

<script>
import PageHeaderWrapper from '@/components/PageHeaderWrapper/award.vue'
export default {
  components: {
    PageHeaderWrapper,
  },
  data() {
    return {
      awardsActiveKey: '1',
      awardTypeList: [],
    }
  },

  watch: {
    $route(to) {
      if (to.name == 'project-awards') {
        this.$router.push('/project/awards/project')
        return
      }
      if (to.name == 'project-awards-project') {
        this.awardsActiveKey = '1'
      } else {
        this.awardsActiveKey = '2'
      }
    },
  },
  methods: {
    awardsChange(e) {
      if (e == '1') {
        this.$router.push('/project/awards/project')
      } else {
        this.$router.push('/project/awards/organization')
      }
    },
  },
}
</script>
