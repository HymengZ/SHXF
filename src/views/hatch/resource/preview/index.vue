<template>
  <page-header-wrapper show-back>
    <a-card class="top">
      <div class="top-title">
        <img class="icon" src="~@/assets/icon_ziyuan.png" alt="无法显示" /><span>{{ listData.name }}</span>
      </div>
      <div class="top-tag">
        <div class="tags">
          <a-tag color="blue"> {{ listData.type_dictText }}</a-tag>
          <a-tag color="orange"> {{ listData.year }}年 </a-tag>
          <a-tag color="green"> {{ listData.resultFormName }} </a-tag>
        </div>
        <div class="status">
          <img
            v-if="projectType == 1 && ['150', '200'].indexOf(listData.processStatus) != -1"
            src="~@/assets/icon_待审核.png"
            alt="状态"
          />
          <img v-if="projectType == 2 && listData.processStatus == '150'" src="~@/assets/icon_待审核.png" alt="状态" />
          <img v-if="listData.processStatus == '135'" src="~@/assets/icon_待退回.png" alt="状态" />
          <img v-if="listData.processStatus == '100'" src="~@/assets/icon_待提交.png" alt="状态" />
          <img
            v-if="listData.processStatus == '200' && projectType == 2"
            src="~@/assets/icon_审核通过.png"
            alt="状态"
          />
          <img v-if="listData.processStatus == '500'" src="~@/assets/icon_审核不通过.png" alt="状态" />
          <img v-if="listData.processStatus == '136'" src="~@/assets/icon_已退回.png" alt="状态" />
          <img v-if="listData.processStatus == '300'" src="~@/assets/icon_审核完成.png" alt="状态" />
          <span v-if="listData.processStatus == '200' && projectType == 2" class="adopt"
            >审核意见：{{ listData.result }}</span
          >
          <span v-if="listData.processStatus == '500'" class="fail">审核意见：{{ listData.result }}</span>
        </div>
      </div>
      <div class="top-message">
        <div class="top-message-content">
          <div class="text">资源编号：{{ listData.code }}</div>
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
            >申请退回</a-button
          >
          <a-button v-if="projectType == 2" type="primary" @click="handleLook">查看项目</a-button>
        </div>
      </div>
    </a-card>
    <div class="detail">
      <div class="left">
        <a-card id="basic" title="资源基本信息"
          ><a-descriptions :column="2" bordered>
            <a-descriptions-item label="创建时间">{{ listData.createTime | formatMinute }} </a-descriptions-item>
            <a-descriptions-item label="提交时间">{{ listData.submitTime | formatMinute }} </a-descriptions-item>
            <a-descriptions-item label="审核时间">{{ listData.auditTime | formatMinute }} </a-descriptions-item>
            <a-descriptions-item label="发布时间">{{ listData.publishTime | formatMinute }} </a-descriptions-item>
            <a-descriptions-item label="所属年度">{{ listData.year }}年</a-descriptions-item>
            <a-descriptions-item label="资源类型">{{ listData.type_dictText }} </a-descriptions-item>
            <a-descriptions-item label="资源水平" :span="2"> {{}}</a-descriptions-item>
            <a-descriptions-item label="关注的话题" :span="2">{{}} </a-descriptions-item>
            <a-descriptions-item label="固定关键词" :span="2">{{}} </a-descriptions-item>
            <a-descriptions-item label="自定义关键词" :span="2">{{ listData.customKeyword }} </a-descriptions-item>
          </a-descriptions>
        </a-card>
        <a-card id="zydw" title="资源单位信息">
          <div class="message">
            <div class="logo">
              <img
                :src="baseUrl + sysUserUnit.logo"
                alt="avatar"
                style="width: 120px; height: 120px; display: block; border-radius: 60px"
              />
            </div>
            <div class="info">
              <div class="info-title">
                <div class="name">{{ sysUserUnit.name }}</div>
                <div class="tag">
                  <a-tag color="#e6f7ff"> {{}}</a-tag>
                </div>
              </div>
              <div class="info-detials">
                <div class="text">单位证明类型：{{ sysUserUnit.certifyType }}</div>
                <div class="btn-row">
                  <div class="text">统一社会信用代码：{{ sysUserUnit.creditCodes }}</div>
                  <div class="actions">
                    <a-button class="btn" icon="download" @click="handleDownload">单位证明文件</a-button>
                  </div>
                </div>
                <div class="text">单位地址：{{ sysUserUnit.address | formatText }}</div>
              </div>
            </div>
          </div>
        </a-card>
        <a-card id="owner" title="资源联系人信息">
          <a-descriptions :column="2" bordered>
            <a-descriptions-item label="真实姓名">{{ listData.contactName }} </a-descriptions-item>
            <a-descriptions-item label="手机号码">{{ listData.contactMobile }} </a-descriptions-item>
            <a-descriptions-item label="职务">{{ listData.jobObligation }} </a-descriptions-item>
            <a-descriptions-item label="电子邮箱">{{ listData.email }} </a-descriptions-item>
            <a-descriptions-item label="通信地址" :span="2">{{ listData.address }} </a-descriptions-item>
          </a-descriptions>
        </a-card>
        <a-card class="video" id="video" title="资源宣传视频">
          <div class="video-list">
            <div class="video-list-item" v-for="(item, index) in videoList" :key="index">
              <a :href="item.url" target="_blank"><img :src="item.imgUrl" /></a>
              <div class="text">{{ item.fileName }}</div>
            </div>
          </div>
        </a-card>
        <a-card class="describe" id="describe" title="资源描述">
          <div class="_content">
            <div class="title">团队力量</div>
            <div class="text">
              团队人数{{ listData.teamSize || 0 }}人，其中：学士学位{{ listData.xueshiSize || 0 }}人，硕士学位{{
                listData.shuoshiSize
              }}人，博士学位{{ listData.boshiSize || 0 }}人。
            </div>
          </div>
          <a-divider />
          <div class="_content">
            <div class="title">资源团队/产品描述</div>
            <div class="text">
              {{ listData.productDescribe }}
            </div>
          </div>
          <a-divider />
          <div class="_content">
            <div class="title">科研资质</div>
            <div class="text">
              {{ listData.scienceZizhi }}
            </div>
          </div>
          <a-divider />
          <div class="_content">
            <div class="title">曾获奖项</div>
            <div class="text">
              {{ listData.awards }}
            </div>
          </div>
          <a-divider />
          <div class="_content">
            <div class="title">知识产权</div>
            <div class="text">
              {{ listData.zscq }}
            </div>
          </div>
        </a-card>
        <a-card class="picture" id="picture" :title="`资源图片（${achievePictureList.length}）`">
          <div class="picture-list">
            <div class="picture-list-item" v-for="item in achievePictureList" :key="item.id">
              <a target="_blank" :href="'https://shfar.cwit.com.cn/api/' + item.fileUrl + '?token=' + token"
                ><img class="image" :src="'https://shfar.cwit.com.cn/api/' + item.fileUrl + '?token=' + token"
              /></a>
            </div>
          </div>
        </a-card>
        <a-card class="file" id="zyfj" :title="`资源附件`">
          <div class="file-fileList">
            <div class="file-fileList-item" v-for="item in listData.accessory" :key="item.id" @click="openFile(item)">
              <a-icon type="paper-clip" /> <span>{{ item.name }}</span>
            </div>
          </div>
        </a-card>
      </div>
      <div class="right">
        <a-anchor @click.prevent="() => {}">
          <a-anchor-link href="#basic" title="资源基本信息" />
          <a-anchor-link href="#zydw" title="资源单位信息" />
          <a-anchor-link href="#owner" title="资源联系人信息" />
          <a-anchor-link href="#video" title="资源宣传视频" />
          <a-anchor-link href="#describe" title="资源描述" />
          <a-anchor-link href="#picture" title="资源图片" />
          <a-anchor-link href="#zyfj" title="资源附件" />
        </a-anchor>
      </div>
    </div>
  </page-header-wrapper>
</template>
<script>
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { listByDictCode } from '@/api/listByDictCode'
import { fetchResourceById } from '@/api/hatch/resource'
import moment from 'moment'
import { formatMinute } from '@/utils/formatDate'
import { downloadFile } from '@/utils/downloadFile'
export default {
  components: {
    PageHeaderWrapper,
  },
  data() {
    return {
      // 当前操作人
      operationPersonList: '',
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
      sysUserUnit: {},
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
  filters: {
    formatMinute(e) {
      if (e) {
        return moment(e).format('YYYY-MM-DD HH:mm')
      }
    },
    formatText(e) {
      if (e) {
        return e.replace(/-/g, '')
      }
    },
  },
  computed: {
    projectType() {
      return this.$route.params.type
    },
    id() {
      return this.$route.params.id
    },
    baseUrl() {
      return process.env.VUE_APP_API_BASE_URL + '/'
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

    // 单位证明文件下载
    handleDownload() {},
    openFile(data) {
      downloadFile(`${this.baseUrl + data.url}?token=${this.token}`, data.name)
    },
    async getCurrentData() {
      let currentDataID = this.id
      const { success, message, result } = await fetchResourceById(currentDataID)
      if (!success) {
        this.$message.warning(message)
        return
      }
      this.listData = result
      this.sysUserUnit = result.sysUserUnit
      // 当前操作人
      let operationPersonArray = []
      for (const item of result.projectUserList || []) {
        let operationPerson = item.realName + `【${item.departName}】`

        operationPersonArray.push(operationPerson)
      }
      this.operationPersonList = operationPersonArray.join('、')
    },
    //   let currentDataID = this.$route.params.id
    //   const { success, message, result } = await fetchScienceAchieveById(currentDataID)
    //   if (success) {
    //     this.listData = result
    //     // 当前操作人
    //     let operationPersonArray = []
    //     for (const item of result.projectUserList || []) {
    //       let operationPerson = item.realName + `【${item.departName}】`

    //       operationPersonArray.push(operationPerson)
    //     }
    //     this.operationPersonList = operationPersonArray.join('、')
    //     // 成果所有人信息
    //     this.achieveData = result.fireScienceAchieveUserList
    //     if (result.fireUploadsList.length > 0) {
    //       // 成果图片
    //       this.achievePictureList = result.fireUploadsList.filter((item) => item.uploadType == '成果图片')
    //       // 视频
    //       let achieveVideoList = result.fireUploadsList.filter((item) => item.uploadType == '成果宣传视频')
    //       for (const item of achieveVideoList) {
    //         let itemName = item.fileName + item.fileSuffix
    //         let itemUrl = `https://shfar.cwit.com.cn/api/${item.fileUrl}?token=${this.token}`
    //         this.findvideocover(itemUrl, itemName)
    //       }
    //     }
    //   } else {
    //     this.$message.warning(message)
    //     return
    //   }
    // },
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
    display: flex;
    align-items: center;
    font-size: 20px;
    font-weight: 500;
    color: #262626;
    line-height: 28px;
    margin-bottom: 8px;
    .icon {
      margin-right: 8px;
      margin-top: 3px;
    }
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
    // 资源图片
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
    // 附件
    .file {
      .file-fileList {
        &-item {
          background-color: #fff;
          cursor: pointer;
          padding: 10px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          margin-bottom: 8px;
          span {
            margin-left: 8px;
            font-size: 14px;
            font-weight: 400;
            color: #1890ff;
            line-height: 14px;
          }
        }
        &-item:hover {
          background-color: #e6f7ff;
        }
      }
    }
  }
  /deep/ .ant-anchor-wrapper {
    padding: 10px 5px;
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
.message {
  display: flex;
  .logo {
    margin-right: 20px;
  }
  .info {
    flex: 1;
    .info-title {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      .name {
        font-size: 20px;
        font-weight: 500;
        color: #262626;
        line-height: 20px;
      }
      .tag {
        margin-top: 2px;
        margin-left: 16px;
        .ant-tag {
          font-size: 12px;
          font-weight: 400;
          text-align: left;
          color: #1890ff;
          line-height: 20px;
          border: 1px solid #91d5ff;
          border-radius: 2px;
        }
      }
    }
    .info-detials {
      font-size: 14px;
      font-weight: 400;
      color: #595959;
      line-height: 20px;
      .text {
        margin-bottom: 3px;
      }
      .btn-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .btn {
          margin-left: 8px;
        }
      }
    }
  }
}
</style>
