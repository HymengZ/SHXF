<template>
  <div class="page-header-wrapper">
    <div class="breadcrumb">
      <a-page-header :title="currentRouteTitle" :breadcrumb="{ props: { routes: breadcrumbs, itemRender } }">
        <template slot="extra" v-if="showBack">
          <a-button size="small" shape="round" style="margin: 4px 0" @click="handleGoBack"> 返回 </a-button>
        </template>
        <template slot="footer" v-if="showFooter">
          <slot name="tab"> </slot>
        </template>
      </a-page-header>
    </div>
    <div class="wrapper-container">
      <slot />
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { trimEnd } from 'lodash'
export default {
  mounted() {
    console.log(this.$route.matched)
  },
  props: {
    showBack: {
      default: false,
      type: Boolean,
    },
    showFooter: {
      default: false,
      type: Boolean,
    },
  },
  computed: {
    ...mapState({
      permissions: (state) => {
        return [...state.permission.addRouters]
      },
    }),
    flatRouters() {
      const res = this.flat(this.permissions).flat()
      return res
    },
    breadcrumbs() {
      return this.flatRouters
        .filter((item) => {
          return this.$route.fullPath.startsWith(trimEnd(item.path, '/:id&:type'))
        })
        .map((item) => ({
          path: item.path,
          breadcrumbName: item.meta.title,
        }))
        .filter((item) => item.path != '/' && item.path)
        .sort((x, y) => {
          return x.path.length - y.path.length
        })
    },
    currentRouteTitle() {
      return this.$route.meta.title
    },
  },
  methods: {
    //返回跳转
    handleGoBack() {
      if (window.history.length > 1) {
        this.$router.go(-1)
      } else {
        setTimeout(() => {
          this.$router.push(this.$route.path.substring(0, this.$route.path.indexOf('/preview')))
        }, 500)
      }
    },
    flat(routers) {
      return routers.map((item) => {
        const children = item.children && item.children.length ? this.flat(item.children) : []
        return [{ ...item, children: null }, ...children].flat()
      })
    },
    itemRender({ route, params, routes, paths }) {
      return routes.findIndex((r) => r.path == route.path) == routes.length - 1 ? (
        <span>{route.breadcrumbName}</span>
      ) : (
        <router-link to={route.path}>{route.breadcrumbName}</router-link>
      )
    },
  },
}
</script>

<style lang="less" scoped>
.page-header-wrapper {
  margin: -12px;
  .breadcrumb {
    background: #fff;
    padding: 0 95px;
  }
}
.wrapper-container {
  min-width: 1200px;
  margin: 0 120px;
}
/deep/ .ant-page-header-footer {
  margin-top: 0;
}
</style>