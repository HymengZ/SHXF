<template>
  <div>
    <a-steps :current="current">
      <!-- 头部 -->
      <a-step v-for="item in steps" :key="item.title" :title="item.title" />
    </a-steps>
    <!-- 内容 -->
    <div class="steps-content">
      <!-- 基本信息 -->
      <BasicMsg
        ref="basicMsg"
        v-if="current === 0"
        :type="type"
        @addCurrent="changeCurrent"
        :basicData="currentData"
        v-bind="$attrs"
      />
      <!-- 联系人和所有人 -->
      <PersonLiable
        ref="personLiable"
        v-if="current === 1"
        :type="type"
        @addCurrent="changeCurrent"
        :personData="currentData"
        @editCurrent="editCurrent"
      />
      <!-- 视频和描述 -->
      <Participants
        ref="participants"
        v-if="current === 2"
        @addCurrent="changeCurrent"
        :participantsData="currentData"
      />
      <!-- 图片 -->
      <Describe ref="describe" v-if="current === 3" :describeData="currentData" @closeModal="handleCancel" />
    </div>
    <!-- 操作按钮 -->
    <div class="steps-action">
      <a-button v-if="current == 0" style="margin-right: 8px" @click="handleCancel"> 取消 </a-button>
      <a-button v-if="current > 0" style="margin-right: 8px" @click="prev"> 上一步 </a-button>
      <a-button v-if="current < steps.length - 1" type="primary" @click="next"> 下一步 </a-button>
      <a-button v-if="current == steps.length - 1" type="primary" @click="next"> 保存 </a-button>
    </div>
  </div>
</template>
<script>
// 引入表单
import BasicMsg from '../FromGroup/BasicMsg'
import Describe from '../FromGroup/Describe'
import Participants from '../FromGroup/Participants'
import PersonLiable from '../FromGroup/PersonLiable'
export default {
  components: { BasicMsg, Describe, Participants, PersonLiable },
  props: {
    type: {
      type: String,
      default: '',
      required: false,
    },
    // 编辑数据
    editData: {
      type: Object,
      default: '',
      required: false,
    },
  },
  data() {
    return {
      current: 0,
      steps: [
        {
          title: '基本信息',
        },
        {
          title: '联系人和所有人',
        },
        {
          title: '视频和描述',
        },
        {
          title: '图片',
        },
      ],
      // 当前已存在的数据
      currentData: {},
    }
  },
  created() {
    if (this.editData && this.type === 'edit') {
      this.currentData = this.editData
    }
  },
  methods: {
    //表单校验成功且保存数据后才能进行下一步
    changeCurrent(e) {
      // 从数据库获得当前新增数据
      if (e) {
        this.currentData = e
      }
      this.current++
    },
    editCurrent(e) {
      if (e) {
        this.currentData = e
      }
    },
    // 下一步
    next() {
      if (this.current == 0) {
        this.$refs.basicMsg.handleSubmit()
      } else if (this.current == 1) {
        this.$refs.personLiable.handleSubmit()
      } else if (this.current == 2) {
        this.$refs.participants.handleSubmit()
      } else {
        this.$refs.describe.handleSubmit()
      }
    },
    prev() {
      this.current--
    },
    // 关闭弹窗
    handleCancel() {
      this.$emit('cancel')
    },
  },
}
</script>
<style lang='less' scoped>
.ant-steps {
  width: 55%;
  margin: 0 auto;
}
/deep/ .ant-card-head {
  background: #fafafa;
}

.steps-content {
  margin-top: 20px;
}
/* 按钮 */
.steps-action {
  margin-top: 24px;
  text-align: right;
}
</style>