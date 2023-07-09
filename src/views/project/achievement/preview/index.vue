<template>
  <page-header-wrapper show-back>
    <a-card class="top">
      <div class="top-title">
        <div>{{ listData.achieveName }}</div>
      </div>
      <div class="top-tag">
        <div class="tags">
          <a-tag color="blue"> {{ listData.achieveTypeName }}</a-tag>
          <a-tag color="orange"> {{ listData.ownerYear }}年项目 </a-tag>
          <a-tag color="green"> {{ listData.resultFormName }} </a-tag>
        </div>
        <div class="status">
          <img
            v-if="projectType == 1 && ['150', '200'].indexOf(listData.processStatus) != -1"
            src="../../../../assets/icon_待审核.png"
            alt="状态"
          />
          <img
            v-if="projectType == 2 && listData.processStatus == '150'"
            src="../../../../assets/icon_待审核.png"
            alt="状态"
          />
          <img v-if="listData.processStatus == '135'" src="../../../../assets/icon_待退回.png" alt="状态" />
          <img v-if="listData.processStatus == '100'" src="../../../../assets/icon_待提交.png" alt="状态" />
          <img
            v-if="listData.processStatus == '200' && projectType == 2"
            src="../../../../assets/icon_审核通过.png"
            alt="状态"
          />
          <img v-if="listData.processStatus == '500'" src="../../../../assets/icon_审核不通过.png" alt="状态" />
          <img v-if="listData.processStatus == '136'" src="../../../../assets/icon_已退回.png" alt="状态" />
          <img v-if="listData.processStatus == '300'" src="../../../../assets/icon_审核完成.png" alt="状态" />
          <span v-if="listData.processStatus == '200' && projectType == 2" class="adopt"
            >审核意见：{{ listData.result }}</span
          >
          <span v-if="listData.processStatus == '500'" class="fail">审核意见：{{ listData.result }}</span>
        </div>
      </div>
      <div class="top-message">
        <div class="top-message-content">
          <div class="text">成果编号：{{ listData.achieveNumber }}</div>
          <div class="text">
            <span
              >上次操作时间：<span v-if="listData.updateTime === null">{{ formatMinute(listData.createTime) }}</span>
              <span v-else>{{ formatMinute(listData.updateTime) }}</span></span
            >
          </div>
          <div class="text">
            当前操作人：<span class="blue-color">{{ operationPersonList }}</span>
          </div>
        </div>
        <div class="top-message-btn">
          <a-button
            v-if="projectType == 1"
            :disabled="['150', '200', '135', '300'].indexOf(listData.processStatus) != -1"
            @click="handleDelete"
            >删除</a-button
          >
          <a-button
            v-if="projectType == 1"
            type="primary"
            :disabled="['150', '200', '135', '300'].indexOf(listData.processStatus) != -1"
            @click="handleEdit"
            >编辑</a-button
          >
          <a-button
            v-if="projectType == 2"
            type="primary"
            :disabled="['136', '200', '300', '500'].indexOf(listData.processStatus) != -1"
            @click="handleEdit"
            >编辑</a-button
          >
          <a-button
            v-if="projectType == 2"
            type="primary"
            :disabled="['150'].indexOf(listData.processStatus) == -1"
            @click="handleAudit"
            >审核</a-button
          >
          <a-button v-if="projectType == 2" type="primary" @click="handleLook">查看项目</a-button>
        </div>
      </div>
    </a-card>
    <div class="detail">
      <div class="left">
        <a-card id="basic" title="成果基本信息"
          ><a-descriptions :column="2" bordered>
            <a-descriptions-item label="创建时间">{{ formatMinute(listData.createTime) }} </a-descriptions-item>
            <a-descriptions-item label="提交时间"
              >{{ listData.submitTime && formatMinute(listData.submitTime) }}
            </a-descriptions-item>
            <a-descriptions-item label="审核时间"
              >{{ listData.auditTime && formatMinute(listData.auditTime) }}
            </a-descriptions-item>
            <a-descriptions-item label="所属年度">{{ listData.ownerYear }}年</a-descriptions-item>
            <a-descriptions-item label="成果类型">{{ listData.achieveTypeName }} </a-descriptions-item>
            <a-descriptions-item label="成果形式"> {{ listData.resultFormName }}</a-descriptions-item>
            <a-descriptions-item label="关联的科技项目" :span="2"
              >{{ listData.projectReport && listData.projectReport.projectName }}
            </a-descriptions-item>
            <a-descriptions-item label="发布单位">{{ listData.publishUnitName }} </a-descriptions-item>
          </a-descriptions>
        </a-card>
        <a-card id="contacts" title="成果联系人信息">
          <a-descriptions :column="2" bordered>
            <a-descriptions-item label="真实姓名">{{ listData.linkRealName }} </a-descriptions-item>
            <a-descriptions-item label="手机号码">{{ listData.linkPhone }} </a-descriptions-item>
            <a-descriptions-item label="职务">{{ listData.linkPost }} </a-descriptions-item>
            <a-descriptions-item label="电子邮箱"> {{ listData.linkEmail }}</a-descriptions-item>
            <a-descriptions-item label="通讯地址"> {{ listData.linkAddress }}</a-descriptions-item>
          </a-descriptions>
        </a-card>
        <a-card id="owner" title="成果所有人信息">
          <a-table rowKey="id" :columns="achieveColumns" :data-source="achieveData" :pagination="false" bordered>
            <template slot="ownerMessage" slot-scope="text, record">
              <span v-if="record.certType">{{ record.certTypeName }}：{{ record.certId }}</span>
            </template>
          </a-table>
        </a-card>
        <a-card class="video" id="video" title="成果宣传视频">
          <div class="video-list">
            <div class="video-list-item" v-for="(item, index) in videoList" :key="index">
              <a :href="item.url" target="_blank"><img :src="item.imgUrl" /></a>
              <div class="text">{{ item.fileName }}</div>
            </div>
          </div>
        </a-card>
        <a-card class="describe" id="describe" title="成果描述">
          <div class="_content">
            <div class="title">主要创新点</div>
            <div class="text">
              {{ listData.mainInnovationPoint }}
            </div>
          </div>
          <a-divider />
          <div class="_content">
            <div class="title">经济/社会效益</div>
            <div class="text">
              {{ listData.benefit }}
            </div>
          </div>
        </a-card>
        <a-card class="picture" id="picture" :title="`成果图片（${achievePictureList.length}）`">
          <div class="picture-list">
            <div class="picture-list-item" v-for="item in achievePictureList" :key="item.id">
              <a target="_blank" :href="'https://shfar.cwit.com.cn/api/' + item.fileUrl + '?token=' + token"
                ><img class="image" :src="'https://shfar.cwit.com.cn/api/' + item.fileUrl + '?token=' + token"
              /></a>
            </div>
          </div>
        </a-card>
      </div>
      <div class="right">
        <a-anchor @click.prevent="() => {}">
          <a-anchor-link href="#basic" title="成果基本信息" />
          <a-anchor-link href="#contacts" title="成果联系人信息" />
          <a-anchor-link href="#owner" title="成果所有人信息" />
          <a-anchor-link href="#video" title="成果宣传视频" />
          <a-anchor-link href="#describe" title="成果描述" />
          <a-anchor-link href="#picture" title="成果图片" />
        </a-anchor>
      </div>
    </div>
    <j-modal
      title="科技成果编辑/新增"
      :visible="reportVisible"
      switchFullscreen
      :fullscreen="true"
      @cancel="handleCancel"
      :footer="false"
      class="j-modal"
    >
      <StepBar
        @cancel="handleCancel"
        :type="'edit'"
        :editData="listData"
        :formResult="formResult"
        :formType="formType"
      />
    </j-modal>
    <!-- 审核弹窗 -->
    <AuditModal
      ref="details"
      :adoptValue="'200'"
      :rejectValue="'500'"
      :visible="auditVisible"
      @cancel="auditCancel"
      @ok="auditOk"
    />
  </page-header-wrapper>
</template>
<script>
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import StepBar from '../components/StepBar'
// 引入审核弹窗
import AuditModal from '../../components/AuditModal'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { deleteScienceAchieve, auditScienceAchieve, fetchScienceAchieveById } from '@/api/project/achievement'
import { listByDictCode } from '@/api/listByDictCode'
import { formatMinute } from '@/utils/formatDate'
export default {
  components: {
    PageHeaderWrapper,
    StepBar,
    AuditModal,
  },
  data() {
    return {
      // 当前操作人
      operationPersonList: '',
      // 成果形式
      formResult: [],
      // 成果类型
      formType: [],
      // token
      token: '',
      // 成果所有人信息
      achieveData: [],
      // 成果所有人列
      achieveColumns: [
        {
          title: '序号',
          dataIndex: 'orderIndex',
          key: 'orderIndex',
          width: '8%',
        },
        {
          title: '证件信息',
          dataIndex: 'ownerMessage',
          key: 'ownerMessage',
          scopedSlots: { customRender: 'ownerMessage' },
          width: '40%',
        },
        {
          title: '所有人姓名',
          dataIndex: 'realname',
          key: 'realname',
          width: '15%',
        },
        {
          title: '所有人所属单位',
          dataIndex: 'unitName',
          key: 'unitName',
        },
      ],
      listData: {},
      // 编辑弹框
      reportVisible: false,
      // 审核弹框
      auditVisible: false,
      // 成果图片
      achievePictureList: [],
      // 视频列表
      videoList: [],
      // 处理后的图片路径
      dealImgSrc: '',
    }
  },
  computed: {
    projectType() {
      return this.$route.params.type
    },
  },
  created() {
    // 获取token
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.token = token
    // 获取下拉框的值
    this.getSelectList()
    // 根据id请求数据
    this.getCurrentData()
  },
  methods: {
    formatMinute,
    async getSelectList() {
      // 查询成果形式
      await listByDictCode('form_result').then((res) => {
        if (!res.success) {
          this.$message.warning(res.message)
          return
        }
        this.formResult = res.result
      })
      // 查询成果类型
      await listByDictCode('form_type').then((res) => {
        if (!res.success) {
          this.$message.warning(res.message)
          return
        }
        this.formType = res.result
      })
    },
    // 截取视频第一帧
    findvideocover(url, name) {
      const video = document.createElement('video') // 也可以自己创建video
      video.src = url // url地址 url跟 视频流是一样的
      var canvas = document.createElement('canvas') // 获取 canvas 对象
      const ctx = canvas.getContext('2d') // 绘制2d
      video.crossOrigin = 'anonymous' // 解决跨域问题，也就是提示污染资源无法转换视频
      video.currentTime = 1 // 第一帧
      video.width = 300
      video.height = 200
      video.oncanplay = () => {
        canvas.width = 300 // 获取视频宽度
        canvas.height = 200 //获取视频高度
        // 利用canvas对象方法绘图
        ctx.drawImage(video, 0, 0, 300, 200)
        // 转换成base64形式
        let dealUrl = canvas.toDataURL('image/png') // 截取后的视频封面
        let videoObj = {
          url: url,
          imgUrl: dealUrl,
          fileName: name,
        }
        this.videoList.push(videoObj)
      }
    },

    // 审核弹框关闭
    auditCancel() {
      this.auditVisible = false
    },

    //编辑弹框取消按钮
    handleCancel() {
      this.reportVisible = false
      this.getCurrentData()
    },
    //打开附件
    openFile(data) {
      window.open(`https://shfar.cwit.com.cn/api/${data.fileUrl}?token=${this.token}`)
    },
    async getCurrentData() {
      let currentDataID = this.$route.params.id
      const { success, message, result } = await fetchScienceAchieveById(currentDataID)
      if (success) {
        this.listData = result
        // 当前操作人
        let operationPersonArray = []
        for (const item of result.projectUserList || []) {
          let operationPerson = item.realName + `【${item.departName}】`

          operationPersonArray.push(operationPerson)
        }
        this.operationPersonList = operationPersonArray.join('、')
        // 成果所有人信息
        this.achieveData = result.fireScienceAchieveUserList
        if (result.fireUploadsList.length > 0) {
          // 成果图片
          this.achievePictureList = result.fireUploadsList.filter((item) => item.uploadType == '成果图片')
          // 视频
          let achieveVideoList = result.fireUploadsList.filter((item) => item.uploadType == '成果宣传视频')
          for (const item of achieveVideoList) {
            let itemName = item.fileName + item.fileSuffix
            let itemUrl = `https://shfar.cwit.com.cn/api/${item.fileUrl}?token=${this.token}`
            this.findvideocover(itemUrl, itemName)
          }
        }
      } else {
        this.$message.warning(message)
        return
      }
    },
    // 删除
    handleDelete() {
      let that = this
      that.$confirm({
        title: '删除',
        icon: 'exclamation-circle',
        content: (
          <div>
            <p>确定删除？</p>
            <p>删除后将无法在列表中查到此条信息，请谨慎操作。</p>
          </div>
        ),
        okText: '确认',
        cancelText: '取消',
        async onOk() {
          const { success, message } = await deleteScienceAchieve(that.listData.id)
          if (success) {
            that.$router.push('/project/achievement')
            that.$message.success(message)
          } else {
            that.$message.warning(message)
          }
        },
      })
    },
    // 编辑
    handleEdit() {
      this.reportVisible = true
    },
    // 审核
    handleAudit() {
      this.auditVisible = true
    },
    auditOk() {
      this.$refs.details.validateFields().then(async (res) => {
        let params = { id: this.listData.id, operaCode: res.operaCode, opinion: res.opinion }
        const { success, message } = await auditScienceAchieve(params)
        if (success) {
          this.auditVisible = false
          this.$message.success(message)
          this.getCurrentData()
        } else {
          this.$message.warning(message)
        }
      })
    },
    // 查看项目
    handleLook() {
      this.$router.push({
        name: 'project-manage-preview-@id-@type',
        params: {
          id: this.listData.projectReport.id,
          type: 2,
        },
      })
    },
  },
}
</script>
<style lang="less" scoped>
// 顶部间距
.top {
  margin-top: 20px;
  background-color: #fff;
  // 标题
  .top-title {
    font-size: 20px;
    font-weight: 500;
    color: #262626;
    line-height: 28px;
    margin-bottom: 8px;
  }
  // 标签
  .top-tag {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    .tags {
      .ant-tag {
        border: none;
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        padding: 0 18px;
      }
    }
    .status {
      margin-left: 24px;
      display: flex;
      align-items: center;
      // 审核通过
      .adopt {
        margin-left: 8px;
        font-size: 14px;
        font-weight: 400;
        color: #8c8c8c;
        line-height: 20px;
      }
      // 审核不通过
      .fail {
        margin-left: 8px;
        font-size: 14px;
        font-weight: 400;
        text-align: left;
        color: #e02020;
        line-height: 20px;
      }
    }
  }

  // 信息
  .top-message {
    display: flex;
    justify-content: space-between;
    &-content {
      .text {
        font-size: 14px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.65);
        line-height: 20px;
        margin-top: 8px;
        .blue-color {
          color: #1890ff;
        }
      }
    }
    // 按钮
    &-btn {
      display: flex;
      align-items: flex-end;
      .ant-btn {
        margin-left: 8px;
        font-size: 16px;
        font-weight: 400;
        text-align: left;
        line-height: 25px;
      }
    }
  }
}
.detail {
  display: flex;
  justify-content: space-between;
  .right {
    width: 18%;
    margin-top: 20px;
    // 锚点
    .ant-anchor-link {
      font-size: 14px;
      font-weight: 400;
      text-align: left;
      color: rgba(0, 0, 0, 0.65);
      line-height: 22px;
    }
  }
  .left {
    width: 80%;
    /deep/ .ant-card {
      margin-top: 20px;
      background-color: #fff;
      .ant-card-head {
        // 标题前面icon
        .ant-card-head-title {
          font-size: 16px;
          font-weight: 500;
          text-align: left;
          color: #1890ff;
          line-height: 16px;
        }
        .ant-card-head-title::before {
          content: '';
          width: 4px;
          height: 16px;
          background: #1890ff;
          display: inline-block;
          position: absolute;
          top: 17px;
          left: 16px;
        }
      }
    }

    // 成果描述
    .describe {
      ._content {
        .title {
          font-size: 16px;
          font-weight: 500;
          text-align: left;
          color: #595959;
          line-height: 16px;
          margin-bottom: 9px;
        }
        .text {
          font-size: 14px;
          font-weight: 400;
          text-align: left;
          color: #595959;
          line-height: 28px;
        }
      }
      .ant-divider {
        margin: 16px 0;
      }
    }
    // 成果视频
    .video {
      .video-list {
        display: flex;
        flex-wrap: wrap;
        &-item {
          margin: 1% 10px;
          a {
            width: 300px;
            height: 200px;
            display: block;
            .image {
              width: 100%;
            }
          }
          .text {
            text-align: center;
            margin-top: 8px;
          }
        }
      }
    }
    // 成果图片
    .picture {
      .picture-list {
        display: flex;
        flex-wrap: wrap;
        &-item {
          position: relative;
          width: 18%;
          height: 0px;
          padding-top: 18%;
          margin: 10px 1%;
          .image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
  // 描述公共样式
  /deep/ .ant-descriptions {
    .ant-descriptions-item-label {
      width: 16%;
      font-size: 14px;
      font-weight: 400;
      text-align: left;
      color: #8c8c8c;
      line-height: 20px;
    }
    .ant-descriptions-item-content {
      width: 32%;
      font-size: 14px;
      font-weight: 400;
      text-align: left;
      color: rgba(0, 0, 0, 0.65);
      line-height: 20px;
    }
  }
}
</style>
