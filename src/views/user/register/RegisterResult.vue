<template>
  <result
    :isSuccess="true"
    :content="false"
    description='如需发布科技需求/参与建言献策，请及时联系所属单位管理员认领'
    title="注册成功">

    <template slot="action">
      <a-button type="primary" block  size="large" style="margin-left: 8px" @click="goHomeHandle">立即登录</a-button>
    </template>

  </result>
</template>

<script>
  import Result from '@/views/result/Result'

  export default {
    name: "RegisterResult",
    components: {
      Result
    },
    data () {
      return {
        model: {},
      }
    },
    created () {
      this.model = this.$route.params
    },
    methods: {
      goHomeHandle () {
        let params={};
        params.username=this.model.username;
        params.password=this.model.password;
        console.log(params);
        this.$router.push({name:'login',params})
      },
    }
  }
</script>

<style scoped>

</style>