<template>
  <a-select
    allowClear
    show-search
    :mode="mode"
    :value="value"
    :placeholder="type"
    :default-active-first-option="false"
    :show-arrow="false"
    :filter-option="false"
    :not-found-content="null"
    @search="handleSearch"
    @change="handleChange"
  >
    <a-select-option v-for="d in fingerpostList" :key="d.id">
      {{ d.title }}
    </a-select-option>
  </a-select>
</template>

<script>
// let url
// let timeout
// let currentValue

// function fetch(value, callback) {
//   if (timeout) {
//     clearTimeout(timeout)
//     timeout = null
//   }
//   currentValue = value

//   function fake() {
//     getAction(url, { title: value }).then((res) => {
//       if (res.success) {
//         callback(res.result)
//       } else {
//         this.$message.warning(res.message || '查询失败')
//       }
//     })
//   }
//   timeout = setTimeout(fake, 300)
// }
import { getAction } from '@/api/manage.js'
export default {
  data() {
    return {
      value: undefined,
      fingerpostList: [],
      timeout: '',
      currentValue: '',
    }
  },
  props: {
    url: {
      type: String,
      default: '',
      required: false,
    },
    mode: {
      type: String,
      default: '',
      required: false,
    },
    type: {
      type: String,
      default: '',
      required: false,
    },
  },
  mounted() {
    // url = this.url
  },
  methods: {
    fetch(value, callback) {
      if (this.timeout) {
        clearTimeout(this.timeout)
        this.timeout = null
      }
      this.currentValue = value
      this.fake(value,callback)
      this.timeout = setTimeout(this.fake(value,callback), 300)
    },
    fake(value,callback) {
      getAction(this.url, { title: value }).then((res) => {
        if (res.success) {
          callback(res.result)
        } else {
          this.$message.warning(res.message || '查询失败')
        }
      })
    },
    //关联指南
    handleSearch(value) {
      console.log(value);
      this.fetch(value, (data) => (this.fingerpostList = data))
    },
    handleChange(value) {
      this.$emit('change', value)
      // console.log(value);
      this.value = value
      // this.fetch(value, (data) => (this.fingerpostList = data))
    },
  },
}
</script>

<style>
</style>