<template>
  <div class="home">
    <a-layout-header>
      <div class="header-index-left">
        <h1>
          <!-- <span><img class="icon" src="../../assets/logo@3x.png" alt="logo" /></span> 上海消防科技服务平台s -->
        </h1>
      </div>
      <div class="header-index-right">
        <a-button class="btn" @click="handleLogin">登录</a-button>
        <a-button class="btn" @click="handleRegister">注册</a-button>
      </div>
    </a-layout-header>
    <a-layout-content>
      <div class="bg">
        <div class="content-index-footer"></div>
      </div>
      <div class="icon">
        <img src="../../assets/话题标题.png" alt="话题图片" />
      </div>
    </a-layout-content>
    <a-layout-footer
      ><a-divider dashed />
      <span>版权所有信息</span>
      <a-divider dashed
    /></a-layout-footer>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  methods: {
    handleLogin() {
      this.$router.push('user')
    },
    handleRegister() {
      this.$router.push('/user/register')
    },
  },
}
</script>
<style lang="less" scoped>
.ant-layout-header {
  display: flex;
  justify-content: space-between;
  background: #1890ff;
  height: 59px;
  padding: 0 12px;
  .header-index-left {
    h1 {
      color: white;
      font-weight: 500;
      font-size: 20px;
      .icon {
        width: 27px;
        height: 27px;
        margin-right: 5px;
        margin-bottom: 6px;
      }
    }
  }
  .header-index-right {
    display: flex;
    align-items: center;
    .btn {
      margin-left: 16px;
      color: #fff;
      border: 2px solid #fff;
      border-radius: 30px;
      background-color: transparent;
    }
    .btn:hover {
      color: green;
    }
  }
}
.ant-layout-content {
  margin: 24px;
  .bg {
    display: flex;
    align-items: flex-end;
    width: 100%;
    height: 400px;
    // background: url(../../assets/外部网站首图.png) no-repeat;
    background-size: cover;
    .content-index-footer {
      width: 100%;
      height: 22%;
      background: rgba(0, 0, 0, 0.25);
    }
  }
  .icon {
    margin-top: 18px;
    text-align: center;
  }
}
.ant-layout-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 6px 32px;
  background: #262626;
  .ant-divider {
    width: 500px;
    min-width: 0;
    background: #262626;
    border-width: 2px 0 0;
    border-color: #ffffff;
    opacity: 0.4;
  }
  span {
    margin: 0 157px;
    opacity: 0.85;
    font-size: 15px;
    font-weight: 500;
    color: #ffffff;
    line-height: 22px;
  }
}
</style>