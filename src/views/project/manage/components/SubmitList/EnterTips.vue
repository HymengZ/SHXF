<template>
  <div class="modal-content">
    <div class="icon">
      <a-icon type="check-circle" theme="filled" style="color: #52c41a; font-size: 60px" />
    </div>
    <div class="text-blod">资料录入成功</div>
    <div class="text">如是历史项目，如一次性把所有资料上传。</div>
    <a-button class="back-btn" @click="back">返回选择资料类型</a-button>
  </div>
</template>
<script>
export default {
  name: 'App',
  data() {
    return {}
  },
  methods: {
    back() {
      this.$emit('backSelect')
    },
  },
}
</script>
<style lang="less" scoped>
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
