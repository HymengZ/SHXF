<template>
  <div class="divcss5">
    <a-tabs style="margin-left: 5px" type="card" @change="onType" v-model="activeKey" :default-active-key="activeKey">
      <template v-if="show1">
        <a-tab-pane v-has="'internal:list'" key="1" tab="内部账号" force-render>
          <user-list ref="list1"  :activeKey="activeKey" />
        </a-tab-pane>
      </template>
      <template v-if="show2">
        <a-tab-pane v-has="'external:list'" key="0" tab="外部账号" force-render>
          <user-list ref="list2" :activeKey="activeKey" />
        </a-tab-pane>
      </template>
    </a-tabs>
  </div>
</template>

<script>
import UserList from './UserList'
import { USER_AUTH } from '@/store/mutation-types'

export default {
  name: 'UserTables',
  components: {
    UserList,
  },
  data() {
    return {
      loading: false,
      auth1: 'internal:list',
      auth2: 'external:list',
      activeKey: '1',
      show1: false,
      show2: false,
      queryParam: {},
    }
  },
  created() {
    this.auth()
    if (this.show1) {
      this.activeKey = '1'
    } else {
      this.activeKey = '0'
    }
  },
  methods: {
    onType(key) {
      this.activeKey = key
    },
    auth() {
      this.show1 = false
      this.show2 = false
      this.activeKey = '1'
      let permissionList = []
      let allPermissionList = []

      //let authList = Vue.ls.get(USER_AUTH);
      let authList = JSON.parse(sessionStorage.getItem(USER_AUTH) || '[]')
      for (let auth of authList) {
        if (auth.type != '2') {
          permissionList.push(auth)
        }
      }
      //设置全局配置是否有命中
      let invalidFlag1 = false //无效命中
      let invalidFlag2 = false //无效命中
      if (authList != null && authList != '' && authList != undefined && authList.length > 0) {
        for (let itemG of authList) {
          if (this.auth2 === itemG.action) {
            if (itemG.type == '1') {
              this.activeKey = '0'
              invalidFlag2 = true
              break
            }
          }
        }
        for (let itemG of authList) {
          console.log('itemG.action', itemG)
          if (this.auth1 === itemG.action) {
            if (itemG.type == '1') {
              this.activeKey = '1'
              invalidFlag1 = true
              break
            }
          }
        }
      }
      this.show1 = invalidFlag1
      this.show2 = invalidFlag2
      console.log(this.show1, this.show2, '77777')
    },
  },
}
</script>

<style scoped>
.divcss5 {
  background-color: #fff;
}
</style>
