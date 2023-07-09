<template>
  <div class="tag-checkbox">
    <div class="label">
      {{ label }}
    </div>
    <div>
      <a-checkable-tag
        :checked="value.indexOf(item[valueName]) >= 0"
        @change="handleChange($event, item[valueName])"
        v-for="(item, index) in options"
        :key="index"
        style="margin-bottom: 15px;font-size: 14px;margin-left: 20px"
      >
        {{ item[labelName] }}
      </a-checkable-tag>
    </div>
  </div>
</template>


<script>
export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    options: {
      type: Array,
      default:[],
    },
    value: {
      type: Array,
      default: [],
    },
    valueName: {
      type: String,
      default: 'value',
    },
    labelName: {
      type: String,
      default: 'label',
    },
  },
  methods: {
    handleChange(checked, val) {
      console.log(checked,val, this.value)
      if (checked) {
        // 选中逻辑
        this.$emit('input',[...this.value, val])
      } else {
        // 取消选中逻辑
        this.$emit('input',this.value.filter((item) => item != val))
      }
    },
  },
}
</script>

<style lang="less" scoped>
.tag-checkbox {
  display: flex;
  align-items: stretch;
  background: #fff;
   line-height: 42px;

  .label {
    width: 160px;
    min-width: 160px;
    min-height: 42px;
    background: #fafafa;
    // text-align: center;
    padding-left: 16px;
    box-sizing: border-box;
    line-height: 42px;
    margin-right: 8px;
  }
}
</style>