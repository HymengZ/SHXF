<template>
  <page-header-wrapper show-back>
   
      <div class="tab" >
        <outcome-info :content="{ title: content.catalogueName, content: content.catalogueText }">
            <div slot="message" class="message">
            <div>发布单位：{{ content.publishUnitName }}</div>
            <div>发布时间：{{ content.publishTime }}</div>
            <div>阅读：{{ content.readAmount }}</div>
          </div>
        </outcome-info>
      </div>
   
  </page-header-wrapper>
</template>

<script>
import PageHeaderWrapper from '../../../../components/PageHeaderWrapper'
import { getAction } from '@/api/manage.js'
import OutcomeInfo from '../../components/outcome'
export default {
  components: {
    PageHeaderWrapper,
    OutcomeInfo,
  },
  data() {
    return {
      id: '',
      content: {},
    }
  },
  mounted() {
    this.id = this.$route.params.id
    this.dataInfo()
  },
  methods: {
    dataInfo() {
      getAction('/fire/achieveCatalogue/queryById', { id: this.id }).then((res) => {
        if (res.success) {
          this.content = res.result
          this.date = res.result.publishTime
        } else {
          this.$message.warning(res.message || '查询失败')
        }
      })
    },
  },
}
</script>





<style lang="less" scoped>
button {
  width: 60px;
  height: 24px;
  background: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 24px;
  box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.02);
}
.tab {
  margin: 16px;
  border-top: 2px solid #1890ff;
  .message {
    color: #c3c3c3;
    line-height: 300%;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}
</style>