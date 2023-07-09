<template>
  <page-header-wrapper show-back>
   
      <div class="tab" >
        <outcome-info :content="{ title: info.situationSummary, content: info.situationText }">
            <div slot="message" class="message">
            <div>发布单位：{{ info.publishUnitName }}</div>
            <div>发布时间：{{ info.createTime }}</div>
          </div>
        </outcome-info>
        <div class="vid">
          <video :src="uploadBaseDomain + this.info.propagateVideoUrl" id="myVideo" controls preload="auto"></video>
        </div>
        <p style="text-align: center">{{ info.propagateVideoName }}</p>
      </div>
   
  </page-header-wrapper>
</template>

<script>
import OutcomeInfo from '../../components/outcome'
import PageHeaderWrapper from '../../../../components/PageHeaderWrapper'
import { fetchOneAchieveDemoSituation } from '@/api/outcome/demonstration'
export default {
  components: {
    PageHeaderWrapper,
    OutcomeInfo
  },
  data() {
    return {
      info: {},
    }
  },
  computed:{
      uploadBaseDomain() {
      return process.env.VUE_APP_UPLOAD_BASE_DOMAIN
    },
  },
  mounted() {
    this.handleFetchDetail()
  },
  methods: {
    handleFetchDetail() {
      fetchOneAchieveDemoSituation({ id: this.$route.query.id }).then((res) => {
        this.info = res.result
      })
    },
  },
}
</script>





<style lang="less" scoped>
// button {
//   width: 60px;
//   height: 24px;
//   background: #ffffff;
//   border: 1px solid #d9d9d9;
//   border-radius: 24px;
//   box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.02);
// }
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
  #myVideo {
    width: 100%;
    height: 700px;
  }
}
</style>