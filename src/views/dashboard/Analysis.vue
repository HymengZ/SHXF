<template>
  <div class="content">
    <a-row :gutter="16">
      <a-col :span="8">
        <div class="banner">
          <a-carousel autoplay>
            <!-- <div><img src="../../assets/01上海消防黄浦第一支队.jpeg" alt="" style="width: 389px; height: 389px" /></div>
            <div><img src="../../assets/02上海消防青浦消防支队.jpeg" alt="" style="width: 389px; height: 389px" /></div>
            <div><img src="../../assets/03上海消防静安第二支队.jpeg" alt="" style="width: 389px; height: 389px" /></div> -->
            
          </a-carousel>
        </div>
        <div class="listContent">
          <div class="title">
            <div class="font">
              <div class="decorate"></div>
              <span>年度热词</span>
            </div>
          </div>
          <div class="hotWord">
            <hot-word :textList="textList"></hot-word>
          </div>
        </div>
        <div class="listContent">
          <div class="title">
            <div class="font">
              <div class="decorate"></div>
              <span>科技指南</span>
            </div>
            <div class="action" @click="skip('/policy/fingerpost')">查看更多>></div>
          </div>
          <div
            class="listTime"
            v-for="(item, index) in fingerpostList"
            :key="index"
            @click="skipInfo('/policy/fingerpost/preview/', item.id)"
          >
            <div>{{ item.title }}</div>
            <div class="time">发布时间:{{ item.publishTime }}</div>
            <hr />
          </div>
        </div>
        <div class="listContent">
          <div class="title">
            <div class="font">
              <div class="decorate"></div>
              <span>消防政策</span>
            </div>
            <div class="action" @click="skip('/policy/policy')">查看更多>></div>
          </div>
          <div
            class="listTime"
            v-for="(item, index) in controlPolicyList"
            :key="index"
            @click="skipInfo('/policy/policy/preview/', item.id)"
          >
            <div>{{ item.title }}</div>
            <div class="time">发布时间:{{ item.publishTime }}</div>
            <hr />
          </div>
        </div>
        <div class="listContent">
          <div class="title">
            <div class="font">
              <div class="decorate"></div>
              <span>消防新闻</span>
            </div>
            <div class="action" @click="skip('/policy/journalism')">查看更多>></div>
          </div>
          <div
            class="journalism"
            v-for="(item, index) in newsList"
            :key="index"
            @click="skipInfo('/policy/journalism/preview/', item.id)"
          >
            <div>{{ typeFun(item.type) }}</div>
            <div>{{ item.title }}</div>
          </div>
        </div>
        <div class="listContent">
          <div class="title">
            <div class="font">
              <div class="decorate"></div>
              <span>话题</span>
            </div>
            <div class="action" @click="skip('/policy/topic')">查看更多>></div>
          </div>
          <div
            class="listTime"
            v-for="(item, index) in topicList"
            :key="index"
            @click="skipInfo('/policy/topic/preview/', item.id)"
          >
            <div>{{ item.title }}</div>
            <div class="time">发布时间:{{ item.publishTime }}</div>
            <hr />
          </div>
        </div>
      </a-col>
      <a-col :span="16">
        <div class="listContent">
          <div class="title">
            <div class="font">
              <div class="decorate"></div>
              <span>科技项目成果</span>
            </div>
            <div class="action" @click="skip('/project/achievements')">查看更多>></div>
          </div>
          <div class="achievement">
            <div class="contentImg">
              <img src="../../assets/03超重型泡沫消防车.png" alt="" style="width: 340px; height: 340px" />
            </div>
            <div class="contentList">
              <div
                class="listTime"
                v-for="(item, index) in achievementsList"
                :key="index"
                @click="skipInfo('/project/achievements/preview/', item.id)"
              >
                <div>{{ item.achieveName }}</div>
                <div class="info">成果编号:{{ item.achieveNumber }}</div>
                <div class="info">成果类型:{{ item.achieveCategoryName }}</div>
                <div class="action">
                  <a-icon type="right" />
                </div>
                <hr />
              </div>
            </div>
          </div>
        </div>
        <div class="listContent">
          <div class="title">
            <div class="font">
              <div class="decorate">
                
              </div>
              <span>科技服务列车</span>
            </div>
          </div>
          <div class="serve"><img src="../../assets/消防科技工作流程-4.jpg" alt="" style="width: 100%; height: 308px"></div>
        </div>
        <div class="listContent">
          <div class="title">
            <div class="font">
              <div class="decorate"></div>
              <span>数据概览</span>
            </div>
          </div>
          <div class="overview">
            <div class="overviewList">
              <div class="overviewcontent">
                <div class="title">科技资源</div>
                <div class="number">187</div>
              </div>
              <div class="overviewcontent">
                <div class="title">科技资源单位</div>
                <div class="number">34</div>
              </div>
              <div class="overviewcontent">
                <div class="title">科技需求</div>
                <div class="number">60</div>
              </div>
            </div>
            <div class="overviewList">
              <div class="overviewcontent">
                <div class="title">科技资源</div>
                <div class="number">187</div>
              </div>
              <div class="overviewcontent">
                <div class="title">科技资源单位</div>
                <div class="number">34</div>
              </div>
              <div class="overviewcontent">
                <div class="title">科技需求</div>
                <div class="number">60</div>
              </div>
            </div>
            <div class="overviewList">
              <div class="overviewcontent">
                <div class="title">科技资源</div>
                <div class="number">187</div>
              </div>
              <div class="overviewcontent">
                <div class="title">科技资源单位</div>
                <div class="number">34</div>
              </div>
              <div class="overviewcontent">
                <div class="title">科技需求</div>
                <div class="number">60</div>
              </div>
            </div>
            <div class="overviewList">
              <div class="overviewcontent">
                <div class="title">科技资源</div>
                <div class="number">187</div>
              </div>
              <div class="overviewcontent">
                <div class="title">科技资源单位</div>
                <div class="number">34</div>
              </div>
              <div class="overviewcontent">
                <div class="title">科技需求</div>
                <div class="number">60</div>
              </div>
            </div>
            <div class="overviewList">
              <div class="overviewcontent">
                <div class="title">科技资源</div>
                <div class="number">187</div>
              </div>
              <div class="overviewcontent">
                <div class="title">科技资源单位</div>
                <div class="number">34</div>
              </div>
              <div class="overviewcontent">
                <div class="title">科技需求</div>
                <div class="number">60</div>
              </div>
            </div>
            <div class="overviewList">
              <div class="overviewcontent">
                <div class="title">科技资源</div>
                <div class="number">187</div>
              </div>
              <div class="overviewcontent">
                <div class="title">科技资源单位</div>
                <div class="number">34</div>
              </div>
              <div class="overviewcontent">
                <div class="title">科技需求</div>
                <div class="number">60</div>
              </div>
            </div>
          </div>
        </div>
        <div class="listContent">
          <div class="title">
            <div class="font">
              <div class="decorate"></div>
              <span>排行榜</span>
            </div>
            <div class="rule">《排行评比规则》</div>
          </div>
          <div class="cardList">
            <a-card title="个人活跃度排行-2022年第一季度">
              <div slot="extra" class="action">查看更多>></div>
              <div class="cardContent">
                <div>
                  <div class="icon"><a-icon type="user" /></div>
                  <div class="uname">姓名</div>
                  <div class="detachment">支队名称xxx</div>
                  <div class="grade">平台活跃值xxx分</div>
                </div>
                <div>
                  <div class="icon big"><a-icon type="user" /></div>
                  <div class="uname">姓名</div>
                  <div class="detachment">支队名称xxx</div>
                  <div class="grade">平台活跃值xxx分</div>
                </div>
                <div>
                  <div class="icon"><a-icon type="user" /></div>
                  <div class="uname">姓名</div>
                  <div class="detachment">支队名称xxx</div>
                  <div class="grade">平台活跃值xxx分</div>
                </div>
              </div>
            </a-card>
            <a-card title="个人成果排行-2022年">
              <div slot="extra" class="action">查看更多>></div>
              <div class="cardContent">
                <div>
                  <div class="icon"><a-icon type="user" /></div>
                  <div class="uname">姓名</div>
                  <div class="detachment">支队名称xxx</div>
                  <div class="grade">平台活跃值xxx分</div>
                </div>
                <div>
                  <div class="icon big"><a-icon type="user" /></div>
                  <div class="uname">姓名</div>
                  <div class="detachment">支队名称xxx</div>
                  <div class="grade">平台活跃值xxx分</div>
                </div>
                <div>
                  <div class="icon"><a-icon type="user" /></div>
                  <div class="uname">姓名</div>
                  <div class="detachment">支队名称xxx</div>
                  <div class="grade">平台活跃值xxx分</div>
                </div>
              </div>
            </a-card>
            <a-card title="科技组织排行-2022年">
              <div slot="extra" class="action">查看更多>></div>
              <div class="cardContent">
                <div>
                  <div class="icon"><a-icon type="flag" /></div>
                  <div class="uname">业务处室名称xx</div>
                  <div class="grade">组织科技值xxx分</div>
                </div>
                <div>
                  <div class="icon big"><a-icon type="flag" /></div>
                  <div class="uname">业务处室名称xx</div>
                  <div class="grade">组织科技值xxx分</div>
                </div>
                <div>
                  <div class="icon"><a-icon type="flag" /></div>
                  <div class="uname">业务处室名称xx</div>
                  <div class="grade">组织科技值xxx分</div>
                </div>
              </div>
            </a-card>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import hotWord from './hotWord.vue'
import { postAction, getAction } from '@/api/manage.js'
export default {
  name: 'Analysis',
  components: {
    hotWord,
  },
  data() {
    return {
      indexStyle: 1,
      fingerpostList: [],
      controlPolicyList: [],
      newsList: [],
      typeList: [],
      topicList: [],
      textList: [],
      achievementsList: [],
    }
  },
  created() {},
  mounted() {
    //热词
    this.hotword()
    //科技指南
    this.fingerpost()
    //消防政策
    this.controlPolicy()
    //字典获取新闻类别list
    this.typeData()
    //消防新闻
    this.news()
    //话题
    this.topic()
    //科技成果
    this.achievements()
  },
  methods: {
    //科技成果
    achievements() {
      getAction('/fire/scienceAchieve/list', { pageNo: 1, pageSize: 5 }).then((res) => {
        if (res.success) {
          this.achievementsList = res.result.records
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    //热词
    hotword() {
      getAction('/fire/keyword/queryIndexList').then((res) => {
        if (res.success) {
          let arr = []
          res.result = res.result.reverse()
          for (let i = 0; i < res.result.length; i++) {
            let obj = {
              text: res.result[i],
              freq: i + 1,
            }
            arr.push(obj)
          }
          this.textList = arr
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    //科技指南
    fingerpost() {
      getAction('/fire/scienceGuide/list', { pageNo: 1, pageSize: 5 }).then((res) => {
        if (res.success) {
          this.fingerpostList = res.result.records
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    //消防政策
    controlPolicy() {
      getAction('/fire/controlPolicy/list', { pageNo: 1, pageSize: 5 }).then((res) => {
        if (res.success) {
          this.controlPolicyList = res.result.records
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    //消防新闻
    news() {
      getAction('/fire/news/list', { pageNo: 1, pageSize: 5, flag: 1 }).then((res) => {
        if (res.success) {
          this.newsList = res.result.records
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    //获取新闻类型list
    typeData() {
      getAction('/sys/dict/getDictItems/news_type', { type: 'news_type' }).then((res) => {
        if (res.success) {
          let arr = []
          for (const i of res.result) {
            let obj = {
              label: i.title,
              value: i.value,
            }
            arr.push(obj)
          }
          this.typeList = arr
        } else {
          this.$message.warning(res.message || '查询失败')
        }
      })
    },
    //新闻类型
    typeFun(e) {
      for (const i of this.typeList) {
        if (i.value == e) {
          return i.label
        }
      }
    },
    //消防新闻
    topic() {
      getAction('/fire/topic/list', { pageNo: 1, pageSize: 5, flag: 1 }).then((res) => {
        if (res.success) {
          this.topicList = res.result.records
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    //查看更多跳转
    skip(e) {
      this.$router.push(e)
    },
    //详情跳转
    skipInfo(e, id) {
      this.$router.push(`${e + id}`)
    },
  },
}
</script>

<style lang="less" scoped>
// .ant-carousel >>> .slick-slide {
//   text-align: center;
//   height: 160px;
//   line-height: 160px;
//   background: #364d79;
//   overflow: hidden;
// }
.content {
  max-width: 1200px;
  margin: 0 auto;
  // overflow: hidden;
  .banner {
   
    margin-bottom: 10px;
  }
  .listContent {
    padding: 20px;
    background: #fff;
    margin-bottom: 10px;
    .title {
      display: flex;
      justify-content: space-between;
      line-height: 24px;
      margin-bottom: 10px;
      .font {
        color: #2196f3;
        font-size: 20px;
        display: flex;
      }
      .action {
        border-radius: 12px;
        border: 1px solid rgb(213, 213, 213);
        padding: 0 14px;
        line-height: 20px;
      }
      .decorate {
        width: 8px;
        height: 24px;
        background: #2196f3;
        margin-right: 10px;
      }
      .rule {
        color: #2196f3;
      }
    }
    .listTime {
      font-weight: 600;
      line-height: 24px;
      position: relative;
      .time {
        font-size: 12px;
        color: #9e9e9e;
        font-weight: normal;
      }
      .info {
        color: #9e9e9e;
        font-weight: normal;
      }
      .action {
        font-size: 20px;
        position: absolute;
        right: 0px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .hotWord {
      background: #ebebeb;
      width: 100%;
    }
    .journalism {
      display: flex;
      font-size: 12px;
      margin: 14px 0;
      div:first-child {
        padding: 0 10px;
        border-radius: 10px;
        background: #e6f7ff;
        margin-right: 10px;
      }
    }
    .achievement {
      display: flex;
      justify-content: space-between;
      .contentImg,
      .contentList {
        width: 50%;
      }
      // .contentImg {
      //   background: #ebebeb;
      // }
    }
    // .serve {
    //   width: 100%;
    //   height: 340px;
    //   background: #ebebeb;
    // }
    .overview {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .overviewList {
        display: flex;
        width: 49%;
        padding: 10px;
        margin-bottom: 2%;
        border: 1px solid #ebebeb;
        justify-content: space-between;
        .overviewcontent {
          width: 33%;
        }
        .title {
          color: #9e9e9e;
        }
        .number {
          font-size: 28px;
          font-weight: 600;
        }
      }
    }
    .cardList {
      .action {
        border-radius: 12px;
        border: 1px solid rgb(213, 213, 213);
        padding: 0 14px;
        line-height: 20px;
      }
      /deep/ .ant-card-head {
        min-height: 34px;
        font-size: 14px;
        font-weight: 600;
        background: #fafafa;
        .ant-card-head-title,
        .ant-card-extra {
          padding: 7px 0;
        }
      }
      .cardContent {
        display: flex;
        justify-content: space-around;
        div {
          margin: 0 auto;
          text-align: center;
          .icon {
            width: 60px;
            height: 60px;
            font-size: 40px;
            border-radius: 50%;
            background: #f0f0f0;
          }
          .big {
            width: 100px;
            height: 100px;
            font-size: 60px;
          }
          .uname {
            font-size: 22px;
            font-weight: 600;
          }
          .detachment {
            color: #9e9e9e;
            font-size: 16px;
          }
          .grade {
            font-size: 16px;
            color: #2196f3;
          }
        }
      }
    }
  }
}
</style>