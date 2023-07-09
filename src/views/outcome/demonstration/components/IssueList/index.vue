<template>
  <div class="submit-container">
    <div class="table">
      <div class="data">
        <list-table :list="list" :emptyText="emptyText" :pagination="pagination">
          <div slot="icon" slot-scope="{ row }">
            <img style="width: 105px; height: 105px" :src="uploadBaseDomain + row.certificatePhotoUrl" alt="" />
          </div>
          <div slot="title" slot-scope="{ row }" :span="12">
            <span>{{ row.unitName }}</span>
            <a-badge :color="row.color" class="numberStyle" :text="row.typeTitle" />
          </div>
          <div slot="desc-left" slot-scope="{ row }">
            <div>
              <span>单位编号：{{ row.unitCode }}</span>
            </div>
            <div>
              <span>证书发放时间：{{ row.certificateGrantTime }}</span>
            </div>
             <div class="introduce">
              成果示范情况介绍：<j-ellipsis :value="row.baseSummary" :length="15"/> 
            </div>
          </div>
          <div slot="desc-right" slot-scope="{ row }">
            <div>
              <span>新建时间：{{ row.createTime }}</span>
            </div>
            <div v-if="row.submitTime  != null">
              <span>提交时间:{{ row.submitTime }}</span>
            </div>
            <div v-if="row.auditTime != null">
              <span>审核时间：{{ row.auditTime }} </span>
              <a-popover placement="topLeft" arrow-point-at-center>
                <template #content> {{ row.auditOpinion }}</template>
                <a-icon :style="{color:(row.auditOperate === 'pass' ? '#8C8C8C' : '#FF4D4F')}"
                        type="info-circle" style="cursor: pointer"></a-icon>
              </a-popover>
            </div>
            <div v-if="row.applyBackTime != null">
              <span>申请退回时间：{{ row.applyBackTime }}</span>
            </div>
            <div v-if="row.backTime != null">
              <span>退回时间:{{ row.backTime }}</span>
            </div>
            <div v-if="row.processStatus === '800'">
              <span>发布时间:{{ row.publishTime }}</span>
            </div>
            <div v-if="row.processStatus === '900'">
              <span>下架时间：{{ row.lowerShelfTime }}</span>
            </div>
          </div>

          <div slot="actions" slot-scope="{ row }">
            <a-button style="color: #1890ff; border: 1px solid #1890ff" @click="handlePre(row)">基地详情</a-button>
          </div>
        </list-table>
      </div>
    </div>
  </div>
</template>

<script>
import TagCheckBox from '../../../components/TagCheckBox'
import ListTable from '../../../components/ListTable'
import {
  addDemonstration,
  fetchDemonstration,
  addDemoSituation,
  fetchDemonstrationDetail,
  fetchAchieveDemoSituation,
  deleteAchieveDemoSituation,
  updateDemonstration,
  updateAchieveDemoSituation,
  deleteDemonstration,
  submitDemonstration,
  applyBackDemonstration,
} from '@/api/outcome/demonstration'
const states = {
  100: {
    typeTitle: '基地信息待提交',
    color: '#FAAD14',
  },
  130: {
    typeTitle: '已退回',
    color: '#FF0000',
  },
  140: {
    typeTitle: '基地信息审核驳回',
    color: '#FF0000',
  },
  150: {
    typeTitle: '基地信息待审核',
    color: '#FAAD14',
  },
  155: {
    typeTitle: '待退回',
    color: 'yellow',
  },
  200: {
    typeTitle: '审核通过',
    color: '#FAAD14',
  },
  800: {
    typeTitle: '已发布',
    color: 'green',
  },
  900: {
    typeTitle: '已下架',
    color: '#FF0000',
  }
}
export default {
  components: {
    TagCheckBox,
    ListTable,
  },
  data() {
    return {
      list: [],
      state: [''],
      states,
      pagination: {
        total: 0,
        pageSize: 10,
        showLessItems: true,
        showQuickJumper: true,
        showSizeChanger: true,
        current: 1,
        onChange: this.pageChange.bind(this),
        onShowSizeChange: this.pageChange.bind(this),
      },
    }
  },
  computed: {
    uploadBaseUrl() {
      return process.env.VUE_APP_UPLOAD_BASE_URL
    },
    uploadBaseDomain() {
      // VUE_APP_UPLOAD_BASE_DOMAIN
      return process.env.VUE_APP_UPLOAD_BASE_DOMAIN
    },
    emptyText() {
      return <a-empty></a-empty>
    },
  },
  mounted() {
    this.handleFetchList()
  },
  methods: {
    handlePre(row) {
      this.$router.push(`/outcome/demonstration/preview?id=${row.id}`)
    },
    pageChange(page, pageSize) {
      this.pagination.current = page || 1
      this.pagination.pageSize = pageSize
      this.handleFetchList()
    },
    handleFetchList() {
      const state = this.state.includes('') ? [] : this.state
      fetchDemonstration({
        publishUserId: this.$store.state.user.info.id,
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
        queryType: 3,
        processStatus:this.state.join(','),
        unitName: this.title
      }).then((res) => {
        console.log(res)
        this.list = res.result.records.map((item)=>{
          return {
            ...item,
            ...this.states[item.processStatus]
          }
        })
        this.pagination.current = res.result.current
        this.pagination.pageSize = res.result.size
        this.pagination.total = res.result.total
      })
    },
  },
}
</script>

<style lang="less" scoped>
.submit-container {
  background: #f0f2f5;
  .numberStyle {
    margin-left: 10px;
  }
  .search-form {
    padding: 0 20px 20px;
    background: #fff;
  }
  .table {
    background: #fff;
  }
  .search {
    padding: 24px 16px;
    border-bottom: 1px #f0f0f0 solid;
  }
  .actions {
    margin: 14px 15px 0;
  }
  .data {
    padding: 0 24px;
  }
}
</style>