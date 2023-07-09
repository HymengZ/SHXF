<template>
  <div>
    <a-alert message="请认真填写成果信息。" style="margin-bottom:20px" banner />
    <a-form :form="form">
      <a-card title="项目基本信息">
        <a-row type="flex" justify="space-between" align="top">
          <a-col :span="11">
            <a-form-item label="项目名称">
              <a-input placeholder="请输入"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="成果编号">
              <a-input placeholder="自动生成" disabled></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="成果类别">
              <a-select placeholder="请选择">
                <a-select-option value="jack"> Jack </a-select-option>
                <a-select-option value="lucy"> Lucy </a-select-option>
                <a-select-option value="disabled" disabled> Disabled </a-select-option>
                <a-select-option value="Yiminghe"> yiminghe </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="发布单位">
              <a-input placeholder="自动读取" disabled></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="成果发布人">
              <a-input placeholder="自动读取" disabled></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="发布年度">
              <a-select placeholder="请选择">
                <a-select-option value="jack"> Jack </a-select-option>
                <a-select-option value="lucy"> Lucy </a-select-option>
                <a-select-option value="disabled" disabled> Disabled </a-select-option>
                <a-select-option value="Yiminghe"> yiminghe </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="成果发布人">
              <a-radio-group name="radioGroup" :default-value="1">
                <a-radio :value="1"> 是 </a-radio>
                <a-radio :value="2"> 否 </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="关联的科技项目">
              <a-select placeholder="请选择">
                <a-select-option value="jack"> Jack </a-select-option>
                <a-select-option value="lucy"> Lucy </a-select-option>
                <a-select-option value="disabled" disabled> Disabled </a-select-option>
                <a-select-option value="Yiminghe"> yiminghe </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="项目编号">
              <a-input placeholder="请输入" disabled></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card title="成果所有人信息">
        <a-button type="primary" icon="plus" @click="addOwn"> 新增成果所有人 </a-button>
        <a-table :columns="ownColumns" :data-source="ownData">
          <template slot="card">
            <a-input-group compact>
              <a-select style="width: 25%" default-value="Zhejiang">
                <a-select-option value="Zhejiang">消防救援人员证 </a-select-option>
                <a-select-option value="Jiangsu"> 消防救援人员证 </a-select-option>
              </a-select>
              <a-input style="width: 75%" placeholder="输入证件号精确查找用户" />
            </a-input-group>
          </template>

          <template slot="name" slot-scope="text, record">
            <a-input placeholder="请输入" v-model="record.name"></a-input>
          </template>
          <template slot="unit">
            <a-input placeholder="请输入"></a-input>
          </template>
          <template slot="action" slot-scope="text, record">
            <span @click="onDelete(record.key)" style="color: #1890ff">删除</span>
          </template>
        </a-table>
      </a-card>
      <a-card title="成果描述">
        <j-editor  />
      </a-card>
    </a-form>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      form: this.$form.createForm(this, { name: 'coordinated' }),
      ownData: [],
      ownColumns: [
        {
          title: '序号',
          dataIndex: 'serial',
          key: 'serial',
          width: 100,
          align:'center'
        },
        {
          title: '成果所有人证件信息',
          dataIndex: 'card',
          key: 'card',
          scopedSlots: { customRender: 'card' },
          align:'center'
        },
        {
          title: '成果所有人姓名',
          dataIndex: 'name',
          key: 'name',
          scopedSlots: { customRender: 'name' },
          align:'center'
        },
        {
          title: '成果所有人所属单位',
          dataIndex: 'unit',
          key: 'unit',
          scopedSlots: { customRender: 'unit' },
          align:'center'
        },
        {
          title: '操作',
          dataIndex: '',
          key: 'action',
          width: 80,
          scopedSlots: { customRender: 'action' },
          align:'center'
        },
      ],
    }
  },
  methods: {
    //添加所有人
    addOwn() {
      let obj = {
        key: Date.now(),
        serial: this.ownData.length + 1,
        name: '',
        dwlx: '',
        xydm: '',
      }
      this.ownData.push(obj)
    },
    //删除所有人
    onDelete(key) {
      let ownData = [...this.ownData]
      this.ownData = ownData.filter((item) => item.key !== key)
      let num = 1
      for (const i of this.ownData) {
        i.serial = num
        num++
      }
    },
  },
}
</script>

<style>
</style>