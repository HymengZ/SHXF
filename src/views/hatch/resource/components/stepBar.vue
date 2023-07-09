<template>
  <div>
    <a-steps :current="current">
      <!-- 头部 -->
      <a-step v-for="item in steps" :key="item.title" :title="item.title" />
    </a-steps>
    <!-- 内容 -->
    <div class="steps-content">
      <component
        :is="stepName"
        ref="step"
        :type="type"
        @addData="handleAdd"
        :currentData="currentData"
        @deleteFile="handleDeleteFile"
      ></component>
    </div>
    <!-- 操作按钮 -->
    <div class="steps-action">
      <a-button v-if="current == 0" style="margin-right: 8px" @click="handleCancel"> 取消 </a-button>
      <a-button v-if="current > 0" style="margin-right: 8px" @click="prev"> 上一步 </a-button>
      <a-button v-if="current < steps.length - 1" type="primary" @click="next"> 下一步 </a-button>
      <a-button v-if="current == steps.length - 1" type="primary" @click="next"> 保存 </a-button>
    </div>
    <a-modal title="信息保存提示" :visible="visible" :closable="false" :footer="false">
      <div class="modal-content">
        <div class="icon">
          <a-icon type="check-circle" theme="filled" style="color: #52c41a; font-size: 60px" />
        </div>
        <div class="text-blod">编辑信息保存成功</div>
        <div class="text">请尽快提交，如有修改可点击更多操作-编辑</div>
        <a-button class="back-btn" @click="backList">返回列表页</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
// 引入表单
import BasicMsg from './FromGroup/BasicMsg'
import Picture from './FromGroup/Picture'
import Video from './FromGroup/Video'
import PersonLiable from './FromGroup/PersonLiable'
import { fetchResourceById, saveResource, deleteResourceFile } from '@/api/hatch/resource'
export default {
  components: { BasicMsg, Video, Picture, PersonLiable },
  props: {
    // 新增/编辑
    type: {
      type: String,
      default: '',
      required: false,
    },
    // 编辑数据ID
    editDataId: {
      type: String,
      default: '',
      required: false,
    },
  },
  data() {
    return {
      visible: false,
      stepName: BasicMsg,
      current: 0,
      steps: [
        {
          title: '基本信息',
        },
        {
          title: '联系人信息',
        },
        {
          title: '视频和描述',
        },
        {
          title: '图片和附件',
        },
      ],
      // 新增的数据
      currentData: {},
    }
  },
  created() {
    if (this.editDataId && this.type === 'edit') {
      this.handleSearchData(this.editDataId)
    }
  },
  methods: {
    // 下一步
    next() {
      this.$refs.step.handleSubmit()
    },
    prev() {
      this.current--
      this.changeComponent(this.current)
    },
    changeComponent(val) {
      this.current = val
      switch (val) {
        case 0:
          this.stepName = BasicMsg
          break
        case 1:
          this.stepName = PersonLiable
          break
        case 2:
          this.stepName = Video
          break
        case 3:
          this.stepName = Picture
          break
      }
    },
    // 返回列表页
    backList() {
      this.visible = false
      this.handleCancel()
    },
    // 新增数据
    async handleAdd(params) {
      const { success, result, message } = await saveResource(params)
      if (!success) {
        this.$message.warning(message)
        return
      }
      if (this.current < this.steps.length - 1) {
        await this.handleSearchData(result)
        this.$message.success(message)
        this.changeComponent(this.current + 1)
      } else {
        this.visible = true
      }
    },
    // 删除附件
    async handleDeleteFile(ids) {
      let params = ids.toString()
      const { success, message } = await deleteResourceFile(params)
      if (!success) {
        this.$message.warning(message)
      }
    },
    // 根据id查询最新数据
    async handleSearchData(id) {
      const { success, message, result } = await fetchResourceById(id)
      if (!success) {
        this.$message.warning(message)
        return
      }
      console.log('result', result)
      this.currentData = result
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
// 保存弹出框内容
.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  .icon {
    margin-bottom: 20px;
  }
  .text-blod {
    font-size: 20px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    line-height: 32px;
    margin-bottom: 6px;
  }
  .text {
    font-size: 13px;
    font-weight: 400;
    text-align: center;
    color: #8c8c8c;
    line-height: 22px;
    margin-bottom: 20px;
  }
  .back-btn {
    width: 100%;
  }
}
</style>