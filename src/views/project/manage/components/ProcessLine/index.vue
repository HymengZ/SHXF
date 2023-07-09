<template>
  <div class="process-line">
    <!--时间线-->
    <div style="display: flex">
      <div class="timeline-container">
        <div style="display: flex">
          <div v-for="(item, index) in lineList" :key="index" style="flex: 1; display: flex; flex-direction: column">
            <div style="flex: 1; display: flex; align-items: center; position: relative">
              <div class="dot"></div>
              <div class="item" v-show="item.isShow"></div>
              <div class="text">
                {{ item.title }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 进程轴
      lineList: [
        {
          title: '需求入库',
          isShow: true,
        },
        {
          title: '需求孵化',
          isShow: true,
        },
        {
          title: '项目管理',
          isShow: true,
        },
        {
          title: '成果录入',
          isShow: true,
        },
        {
          title: '成果推广',
          isShow: true,
        },
        {
          title: '项目奖获奖',
          isShow: false,
        },
      ],
    }
  },
  methods: {},
}
</script>
<style lang="less" scoped>
.process-line {
  margin-top: 16px;
  .timeline-container {
    width: 400px;
    height: 30px;
    margin-left: 22px;
  }
  .dot {
    border: 3px solid #dcdfe6;
    width: 10px;
    height: 10px;
    border-radius: 10px;
    background: white;
    margin: 2px 0px;
    box-sizing: border-box;
  }

  .item {
    flex: 1;
    border-bottom: 2px solid #dcdfe6;
    box-sizing: border-box;
  }
  .text {
    position: absolute;
    bottom: -30px;
    left: -22px;
    font-size: 14px;
    font-weight: 400;
    text-align: left;
    color: rgba(0, 0, 0, 0.5);
    line-height: 22px;
  }
}
</style>