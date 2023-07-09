<template>
  <!-- , width: fixedHeader ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'  -->
  <a-layout-header
    v-if="!headerBarFixed"
    :class="[
      fixedHeader && 'ant-header-fixedHeader',
      sidebarOpened ? 'ant-header-side-opened' : 'ant-header-side-closed',
    ]"
    :style="{ padding: '0' }"
  >
    <div v-if="mode === 'sidemenu'" class="header" :class="theme">
      <a-icon
        v-if="device === 'mobile'"
        class="trigger"
        :type="collapsed ? 'menu-fold' : 'menu-unfold'"
        @click="toggle"
      ></a-icon>
      <a-icon v-else class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="toggle" />

      <span v-if="device === 'desktop'">欢迎进入 上海消防科技服务平台</span>
      <span v-else>Jeecg-Boot</span>

      <user-menu :theme="theme" />
    </div>
    <!-- 顶部导航栏模式 -->
    <div v-else :class="['top-nav-header-index', theme]">
      <div class="header-index-wide">
        <div class="header-index-left" :style="topMenuStyle.headerIndexLeft">
          <logo class="top-nav-header" :show-title="device !== 'mobile'" :style="topMenuStyle.topNavHeader" />
          <div v-if="device !== 'mobile'" :style="topMenuStyle.topSmenuStyle">
            <s-menu
              mode="horizontal"
              class="menu"
              :menu="menus"
              :theme="theme"
              @updateMenuTitle="handleUpdateMenuTitle"
            ></s-menu>
          </div>
          <a-icon v-else class="trigger" :type="collapsed ? 'menu-fold' : 'menu-unfold'" @click="toggle"></a-icon>
        </div>
        <user-menu class="header-index-right" :theme="theme" :style="topMenuStyle.headerIndexRight" />
      </div>
    </div>
  </a-layout-header>
</template>

<script>
import UserMenu from '../tools/UserMenu'
import SMenu from '../menu/'
import Logo from '../tools/Logo'
import { mixin } from '@/utils/mixin.js'

export default {
  name: 'GlobalHeader',
  components: {
    UserMenu,
    SMenu,
    Logo,
  },
  mixins: [mixin],
  props: {
    mode: {
      type: String,
      // sidemenu, topmenu
      default: 'sidemenu',
    },
    menus: {
      type: Array,
      required: true,
    },
    theme: {
      type: String,
      required: false,
      default: 'dark',
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false,
    },
    device: {
      type: String,
      required: false,
      default: 'desktop',
    },
  },
  data() {
    return {
      headerBarFixed: false,
      //update-begin--author:sunjianlei---date:20190508------for: 顶部导航栏过长时显示更多按钮-----
      topMenuStyle: {
        headerIndexLeft: {},
        topNavHeader: {},
        headerIndexRight: {},
        topSmenuStyle: {},
      },
      chatStatus: '',
    }
  },
  watch: {
    /** 监听设备变化 */
    device() {
      if (this.mode === 'topmenu') {
        this.buildTopMenuStyle()
      }
    },
    /** 监听导航栏模式变化 */
    mode(newVal) {
      if (newVal === 'topmenu') {
        this.buildTopMenuStyle()
      }
    },
  },
  //update-end--author:sunjianlei---date:20190508------for: 顶部导航栏过长时显示更多按钮-----
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    //update-begin--author:sunjianlei---date:20190508------for: 顶部导航栏过长时显示更多按钮-----
    if (this.mode === 'topmenu') {
      this.buildTopMenuStyle()
    }
    //update-end--author:sunjianlei---date:20190508------for: 顶部导航栏过长时显示更多按钮-----
  },
  methods: {
    handleScroll() {
      if (this.autoHideHeader) {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        if (scrollTop > 100) {
          this.headerBarFixed = true
        } else {
          this.headerBarFixed = false
        }
      } else {
        this.headerBarFixed = false
      }
    },
    toggle() {
      this.$emit('toggle')
    },
    //update-begin--author:sunjianlei---date:20190508------for: 顶部导航栏过长时显示更多按钮-----
    buildTopMenuStyle() {
      if (this.mode === 'topmenu') {
        if (this.device === 'mobile') {
          // 手机端需要清空样式，否则显示会错乱
          this.topMenuStyle.topNavHeader = {}
          this.topMenuStyle.topSmenuStyle = {}
          this.topMenuStyle.headerIndexRight = {}
          this.topMenuStyle.headerIndexLeft = {}
        } else {
          let rightWidth = '400px'
          this.topMenuStyle.topNavHeader = { 'min-width': '260px' }
          this.topMenuStyle.topSmenuStyle = { width: 'calc(100% - 220px)' }
          this.topMenuStyle.headerIndexRight = { 'min-width': rightWidth, 'white-space': 'nowrap' }
          this.topMenuStyle.headerIndexLeft = { width: `calc(100% - ${rightWidth})` }
        }
      }
    },
    //update-begin--author:sunjianlei---date:20190508------for: 顶部导航栏过长时显示更多按钮-----

    // update-begin-author:sunjianlei date:20210508 for: 修复动态功能测试菜单、带参数菜单标题错误、展开错误的问题
    handleUpdateMenuTitle(value) {
      this.$emit('updateMenuTitle', value)
    },
    // update-end-author:sunjianlei date:20210508 for: 修复动态功能测试菜单、带参数菜单标题错误、展开错误的问题
  },
}
</script>
<style lang="less">
.layout {
  .ant-menu-horizontal > .ant-menu-item,
  .ant-menu-horizontal > .ant-menu-submenu {
    vertical-align: middle !important;
    /* border-top: none !important; */
  }
  .ant-menu-submenu-selected {
    border-top: none !important;
    border-bottom: none !important;
  }
  .ant-menu-horizontal > .ant-menu-item,
  .ant-menu-horizontal > .ant-menu-submenu {
    border-top: none !important;
    border-bottom: none !important;
  }
}
</style>
<style lang="less" scoped>
/* update_begin author:scott date:20190220 for: 缩小首页布局顶部的高度*/

@height: 59px;

.layout {
  .top-nav-header-index {
    .header-index-wide {
      // margin-left: 10px;
      background: #1890ff;
      .ant-menu.ant-menu-horizontal {
        height: @height;
        line-height: @height;
      }
      .header-index-left {
        .menu {
          color: white;
          font-size: 500;
          font-size: 16px;
          background: #1890ff;

          /deep/ .ant-menu-item > a {
            color: white !important;
          }
          /deep/ .ant-menu-item-selected {
            background: white;
            border-bottom: 0;
            a {
              color: #1890ff !important;
            }
          }
          /deep/ .ant-menu-submenu-horizontal {
            color: white;
          }
          /deep/ .ant-menu-submenu-horizontal:hover {
            border-bottom: 0;
            background: white;
          }
          /deep/ .ant-menu-submenu-selected {
            color: #1890ff;
            border-top: 2px solid #1890ff;
            background: white;
          }
        }
      }
      .header-index-right {
        color: white;
      }
    }
    .trigger {
      line-height: 64px;
      &:hover {
        background: rgba(0, 0, 0, 0.05);
      }
    }
  }

  .header {
    z-index: 2;
    color: white;
    height: @height;
    background-color: @primary-color;
    transition: background 300ms;

    /* dark 样式 */
    &.dark {
      color: #000000;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
      background-color: white !important;
    }
  }

  .header,
  .top-nav-header-index {
    &.dark .trigger:hover {
      background: rgba(0, 0, 0, 0.05);
    }
  }
}

.ant-layout-header {
  height: @height;
  line-height: @height;
}

/* update_end author:scott date:20190220 for: 缩小首页布局顶部的高度*/
</style>