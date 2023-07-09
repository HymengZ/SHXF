<template>
  <a-card>
    <p class="title">{{ content.title }}</p>
    <slot name="message"></slot>
    <div class="tab-richtext-content" v-html="content.content" style="white-space: pre-wrap"></div>
  </a-card>
</template>

<script>
export default {
  props: {
    content: {
      type: Object,
      default: () => ({}),
      required: false,
    },
  },
}
</script>

<style lang="less" scoped>
p {
  margin: 0;
  padding: 0;
}
.title {
  text-align: center;
  font-size: 28px;
  font-weight: 600;
  line-height: 300%;
  border-bottom: 1px solid #c3c3c3;
}
.ant-card {
  border-top: 5px solid #1890ff;
  /deep/.ant-card-body {
    padding-top: 0;
  }
}
</style>
<style lang="less">
.tab-richtext-content{
  margin-top: 20px;
  div{
    
    margin: 0 auto !important
  }
 
}
</style>