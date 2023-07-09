<template>
  <page-header-wrapper  show-back>
    <div class="container">
      <div class="search-tab">
        <policy-info :content="content">
          <div slot="message" class="message">
            <div>发布单位：{{ content.publishUnit }}</div>
            <div>发布时间：{{ content.publishTime }}</div>
            <div>阅读：{{ content.readAmount }}</div>
          </div>
          <div slot="foot" class="foot">
            <div class="accessory">
              <div class="title">附件：</div>
              <div>
                <div v-for="(item, index) in content.fileList" :key="index" @click="download(item)">
                  <a-icon type="paper-clip" /><a @click.prevent="">{{ item.fileName }}</a>
                </div>
              </div>
            </div>
            <div class="accessory">
              <div class="title">正文下载：</div>
              <div @click="downloadZW()">
                <a-icon type="paper-clip" /><a @click.prevent="">{{ content.title }}.pdf</a>
              </div>
            </div>
          </div>
        </policy-info>
      </div>
    </div>
  </page-header-wrapper>
</template>

<script>
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import { getAction, postAction, downloadFile,postDownload } from '@/api/manage.js'
import policyInfo from '../../components/policyInfo.vue'
export default {
  data() {
    return {
      id: '',
      content: {},
    }
  },
  components: { policyInfo, PageHeaderWrapper },
  mounted() {
    this.id = this.$route.params.id
    this.dataInfo()
  },
  methods: {
    //详情
    dataInfo() {
      getAction('/fire/scienceGuide/queryById', { id: this.id }).then((res) => {
        if (res.success) {
          this.content = res.result
          this.date = res.result.publishTime
          this.$message.success(res.message || '查询成功')
        } else {
          this.$message.warning(res.message || '查询失败')
        }
      })
    },
    //附件下载
    download(e) {
      // window.open('http://wwwe.free.aeert.com/api/' + e.fileUrl)
      downloadFile(e.fileUrl, e.fileName)
    },
    //正文下载
    downloadZW() {
      postDownload('/fire/scienceGuide/exportPdf', { id: this.id }).then((res) => {
        if (res) {
          console.log(res)
          // let url = window.URL.createObjectURL(new Blob([res], { type: 'application/pdf' }))
          // window.open(url)
          let content = res
          let elink = document.createElement('a')
          elink.download = this.content.title
          elink.style.display = 'none'
          let blob = new Blob([content], { type: 'application/pdf' })
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          document.body.removeChild(elink)
          this.$message.success(res.message || '查询成功')
        } else {
          this.$message.warning(res.message || '查询失败')
        }
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
.message {
  color: #c3c3c3;
  line-height: 300%;
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.foot {
  margin: 0 auto;
  .accessory {
    width: 100%;
    overflow: hidden;
    display: flex;
    margin-bottom: 10px;
    padding: 10px 0;
    background: rgb(247, 247, 247);
    .title {
      width: 10%;
      text-align: right;
    }
  }
}
</style>