<template>
  <a-modal
    :title="data.id ? '目录层级编辑' : '目录层级新增'"
    closable
    :visible="visible"
    @cancel="handleCancel"
    @ok="handleOk"
    forceRender
  >
    <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
      <a-form-item label="类别">
        <a-radio-group
            :disabled="data.id"
            v-decorator="['levelType', { initialValue: '1', rules: [{ required: true, message: '请选择类别' }] }]"
            :options="typeOptions"
            @change="handleLevelTypeChange"
        />
      </a-form-item>
      <template v-if="!levelType || levelType === '1'">
        <a-form-model-item label="选择年度：">
          <a-date-picker
              mode="year"
              :value="year"
              placeholder="请选择年份"
              format="YYYY年"
              :open="yearShowOne"
              style="display: block"
              v-decorator="['levelYear', { rules: [{ required: true, message: '请选择年度' }] }]"
              @openChange="openChangeOne"
              @panelChange="panelChangeOne"
          />
        </a-form-model-item>
      </template>
      <template v-else>
        <a-form-item label="目录名称">
          <a-input
            placeholder="请输入目录名称"
            v-decorator="['levelName', { rules: [{ required: true, message: '请输入目录名称' }] }]"
          />
        </a-form-item>
        <a-form-item label="编号">
          <a-input
            placeholder="请输入编号"
            v-decorator="['levelCode', { rules: [{ required: true, message: '请输入编号' }] }]"
          />
        </a-form-item>
        <a-form-item label="上一级">
          <a-select
            placeholder="请选择上一级"
            v-decorator="['parentId', { rules: [{ required: true, message: '请选择上一级' }] }]"
          >
            <a-select-option :value="item.id" v-for="item in parents" :key="item.id">
              {{ item.levelYear }}年
            </a-select-option>
          </a-select>
        </a-form-item>
      </template>
    </a-form>
  </a-modal>
</template>


<script>
import moment from 'moment'
export default {
  computed: {
    moment,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    parents: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      yearShowOne: false,
      year: moment(),
      levelType: 1,
      form: this.$form.createForm(this),
      typeOptions: [
        {
          label: '一级年度',
          value: '1',
        },
        {
          label: '二级目录组',
          value: '2',
        },
      ],
    }
  },
  methods: {
    openChangeOne(status) {
      //status是打开或关闭的状态
      if (status) {
        this.yearShowOne = true
      } else {
        this.yearShowOne = false
      }
    },
    // 得到年份选择器的值
    panelChangeOne(value) {
      this.year = value
      console.log(value)
      this.yearShowOne = false
      this.form.setFieldsValue({
        levelYear: value,
      })
    },

    handleCancel() {
      this.$emit('cancel')
    },
    resetFields() {
      this.form.resetFields()
      // this.levelType = '1'
    },
    handleOk() {
      this.form.validateFields().then((val) => {
        this.$emit('ok', {
          ...val,
          levelYear: moment(val.levelYear).format('YYYY')
        })
      })
    },
    setFieldsValue(data) {
      this.levelType = data.levelType
      Promise.resolve().then(() => {
        this.form.setFieldsValue(data)
      })
    },
    handleLevelTypeChange(e) {
      this.levelType = e.target.value
    },
  },
}
</script>

<style lang="less" scoped>
</style>