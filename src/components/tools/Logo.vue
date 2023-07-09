<template>
  <div class="logo">
    <router-link :to="routerLinkTo">
      <h1 v-if="showTitle">
        <!-- <span><img class="icon" src="@/assets/logo@3x.png" alt="" srcset="" /></span>{{ title }} -->
      </h1>
    </router-link>
  </div>
</template>

<script>
import { mixin } from '@/utils/mixin.js'

export default {
  name: 'Logo',
  mixins: [mixin],
  props: {
    title: {
      type: String,
      default: '上海消防科技服务平台',
      required: false,
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false,
    },
    // 点击Logo跳转地址
    routerLinkTo: {
      type: Object,
      default: () => ({ name: 'dashboard' }),
    },
  },
}
</script>
<style lang="less" scoped>
/*缩小首页布 局顶部的高度*/
@height: 59px;

.sider {
  box-shadow: none !important;
  .logo {
    height: @height !important;
    line-height: @height !important;
    box-shadow: none !important;
    transition: background 300ms;

    a {
      color: white;
      &:hover {
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }

  &.light .logo {
    background-color: @primary-color;
  }
}
h1 {
  color: white !important;
  font-weight: 500 !important;
  font-size: 20px !important;
  .icon {
    width: 27px !important;
    height: 27px !important;
    margin-right: 10px;
    margin-bottom: 6px;
  }
}
</style>