<template>
  <div id="userLayout" :class="['user-layout-wrapper', device]">
    <div class="container">
      <div class="top">
        <div class="header">
          <a href="/">
            <!-- <img src="@/assets/logo@3x.png" alt="" /> -->
            <span class="title">平台</span>
          </a>
        </div>
      </div>
      <div v-if="routerName == 'login' || routerName == 'alteration'">
        <div class="login-blue-line"></div>
        <div class="login-modal">
          <route-view></route-view>
        </div>
      </div>
      <div v-else>
        <div class="register-blue-line"></div>
        <div class="register-modal">
          <route-view></route-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RouteView from '@/components/layouts/RouteView'
import { mixinDevice } from '@/utils/mixin.js'

export default {
  name: 'UserLayout',
  components: { RouteView },
  mixins: [mixinDevice],
  data() {
    return {}
  },
  computed: {
    routerName() {
      return this.$route.name
    },
  },
  mounted() {
    document.body.classList.add('userLayout')
  },
  beforeDestroy() {
    document.body.classList.remove('userLayout')
  },
}
</script>

<style lang="less">
.login-blue-line {
  width: 600px;
  height: 4px;
  background: #1890ff;
  margin: 0 auto;
}
.register-blue-line {
  width: 1200px;
  height: 4px;
  background: #1890ff;
  margin: 0 auto;
}
.login-modal,
.register-modal {
  // 去除tabs 底部border
  .ant-tabs-bar {
    border-bottom: none;
  }
  .ant-tabs-nav-scroll {
    text-align: center;
  }
}
.login-modal,
.register-modal .tab-label {
  font-size: 16px;
  // font-weight: 600;
}
</style>

<style lang="less" scoped>
.login-modal {
  min-width: 260px;
  margin: 0 auto;
  height: fit-content;
  background: #fff;
  width: 600px;
  padding: 20px 40px;
  border-radius: 0px 0px 2px 2px;
  box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.1);
}
.register-modal {
  min-width: 260px;
  margin: 0 auto;
  background: #fff;
  width: 1200px;
  padding: 20px 40px;
  border-radius: 0px 0px 2px 2px;
  box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.1);
  height: 600px;
  overflow: auto;
  overflow-x: hidden;
}
#userLayout.user-layout-wrapper {
  height: 100%;

  &.mobile {
    .container {
      .main {
      }
    }
  }

  .container {
    width: 100%;
    min-height: 100%;
    background-image: url(), url(~@/assets/登录底图.png);
    // background-image: url(~@/assets/登录靠左下底图.png), url(~@/assets/登录底图.png);
    background-position: left bottom, left top;
    background-repeat: no-repeat, repeat;
    background-size: 64% 91%, cover;
    padding: 110px 0 144px;
    position: relative;

    a {
      text-decoration: none;
    }

    .top {
      text-align: center;

      .header {
        height: 44px;
        line-height: 44px;
        margin-bottom: 20px;
        img {
          height: 32px;
          vertical-align: -8px;
          margin-right: 8px;
          width: 32px;
        }
        .badge {
          position: absolute;
          display: inline-block;
          line-height: 1;

          margin-left: -12px;
          margin-top: -10px;
          opacity: 0.8;
        }

        .logo {
          height: 44px;
          vertical-align: top;
          margin-right: 16px;
          border-style: none;
        }

        .title {
          font-size: 26px;
          color: #ffffff;
          font-family: 'Chinese Quote', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
            'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
            'Segoe UI Symbol';
          font-weight: 600;
          position: relative;
          line-height: 1;
          top: 2px;
        }
      }
      .desc {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
        margin-top: 12px;
        margin-bottom: 40px;
      }
    }

    .main {
      // min-width: 260px;
      // width: 368px;
      // margin: 0 auto;
      // background: #fff;
      // width: 900px;
      // padding: 20px 40px;
      // border-radius: 10px;
    }

    .footer {
      position: absolute;
      width: 100%;
      bottom: 0;
      padding: 0 16px;
      margin: 48px 0 24px;
      text-align: center;

      .links {
        margin-bottom: 8px;
        font-size: 14px;
        a {
          color: rgba(0, 0, 0, 0.45);
          transition: all 0.3s;
          &:not(:last-child) {
            margin-right: 40px;
          }
        }
      }
      .copyright {
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
      }
    }
  }
}
</style>