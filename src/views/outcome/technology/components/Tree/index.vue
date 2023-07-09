
<template>
  <div class="tree-container">
    <tree-modal
      :visible="catalogueVisible"
      :parents="treeData"
      @cancel="handleCatalogueClose"
      @ok="handleCatalogueSubmit"
      ref="modal"
      :data="formData"
    />
    <!-- 搜索框 -->
    <div class="search">
      <!--  @search="onSearch" -->
      <a-input-search placeholder="请输入目录名称搜索" v-model="searchKey" @search="handleSearch" />
    </div>
    <!-- 按钮 -->
    <div class="actions">
      <a-button block @click="handleTreeDelete()" v-has="'outcome:technology:delete'">删除 </a-button>
      <a-button
        block
        type="primary"
        style="margin: 0 8px"
        @click="handleEditCatelogue()"
        v-has="'outcome:technology:edit'"
        >编辑
      </a-button>
      <a-button block type="primary" @click="handleAddCatelogue()" v-has="'outcome:technology:log'">新增</a-button>
    </div>
    <!-- 下拉菜单 -->
    <div class="meun-t">
      <a-collapse :activeKey="activeYearId" :bordered="false" accordion @change="handleActiveYearChange">
        <template #expandIcon="props">
          <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
        </template>
        <a-collapse-panel v-for="item in treeData" :key="item.id" :header="item.levelYear + '年'">
          <p
            :class="['item', activeId === child.id && 'item-active']"
            v-for="child in item.children"
            @click="handleSelect(child)"
            :key="child.id"
          >
            {{ child.levelName }}
          </p>
        </a-collapse-panel>
      </a-collapse>
    </div>
  </div>
</template>


<script>
import { fetchTreeData, addTreeData, deleteTreeData, editTreeData } from '@/api/outcome/technology'
import TreeModal from './components/TreeModal'
import { cloneDeep } from 'lodash'

export default {
  components: {
    TreeModal,
  },
  data() {
    return {
      // 添加编辑模态框显示
      catalogueVisible: false,
      // 选中的levelId
      activeId: '',
      // 选择年度时的ID
      activeYearId: '',
      // 选择数据
      activeData: {},
      // 修改的数据
      formData: {},
      // 目录数据
      treeData: [],
      tempTreeData: [],
      // 搜索
      searchKey: '',
    }
  },
  computed: {
    value() {
      return {
        activeId: this.activeId || '',
        activeType: this.activeData ? this.activeData.levelType : '',
      }
    },
  },
  mounted() {
    this.handleFetchTreeData(true)
    // this.handlefetchArticle()
  },
  methods: {
    // 搜索目录
    handleSearch(e) {
      this.treeData = this.tempTreeData.map((item) => {
        return {
          ...item,
          children: item.children.filter((child) => {
            return child.levelName.toLowerCase().indexOf(e.toLowerCase()) >= 0
          }),
        }
      })
      let hasLevel = this.treeData.filter((item) => item.children.length > 0).length > 0
      if (hasLevel) {
        this.handleActiveYearChange(this.treeData[0].levelYear)
      } else {
        this.activeId = ''
        this.activeYearId = ''
        this.activeData = {}
      }
    },
    // 获取科技成果目录层级
    handleFetchTreeData(noChoose) {
      fetchTreeData({ levelType: 1 }).then((res) => {
        if (!res.success) {
          this.$message.error(res.message)
          return
        }
        this.treeData = res.result
        this.tempTreeData = res.result
        if (this.treeData.length === 0) {
          this.activeId = ''
          this.activeYearId = ''
          this.activeData = {}
        } else if (!noChoose) {
          // 默认展开第一个
          this.activeId = this.treeData[0].id
          this.activeYearId = this.activeId
          this.activeData = this.treeData[0]
        }
      })
    },
    //添加/详情弹框取消按钮
    handleCancel() {
      this.catalogueVisible = false
    },
    // 选中目录
    handleActiveYearChange(id) {
      console.log('id', id)
      this.activeId = id
      this.activeYearId = id
      this.activeData = this.treeData.find((item) => id === item.id)
    },
    // 选中年度
    handleSelect(item) {
      console.log('item', item)
      this.activeId = item.id
      this.activeYearId = item.parentId
      this.activeData = { ...item }
    },
    // 编辑年度目录
    handleEditCatelogue() {
      if (!this.activeId) {
        this.$message.error('请选中要编辑的年度或者目录！')
        return
      }
      this.catalogueVisible = true
      this.formData = cloneDeep(this.activeData)
      this.$refs.modal.setFieldsValue(this.formData)
    },
    // 新增
    handleAddCatelogue() {
      this.catalogueVisible = true
      this.$refs.modal.setFieldsValue({})
    },
    // 添加年度目录
    handleCatalogueSubmit(val) {
      if (this.formData.id) {
        // 修改
        editTreeData({
          ...this.formData,
          ...val,
        }).then((res) => {
          if (!res.success) {
            this.$message.error(res.message)
            return
          }
          this.handleCatalogueClose()
          this.handleFetchTreeData(true)
        })
      } else {
        // 新增
        addTreeData(val).then((res) => {
          if (!res.success) {
            this.$message.error(res.message)
            return
          }
          this.handleCatalogueClose()
          this.handleFetchTreeData(true)
        })
      }
    },
    //删除年度目录
    handleTreeDelete() {
      if (!this.activeId) {
        this.$message.error('请先选择需要删除的目录！')
        return
      }
      const title = this.activeData.levelType === '1' ? this.activeData.levelYear : this.activeData.levelName
      this.$confirm({
        title: '删除',
        content: (
          <p>
            确定删除 {title} <br />
            删除后将无法在列表中查询到此条信息，请谨慎操作。
          </p>
        ),
        onOk: () => {
          const id = this.activeId
          deleteTreeData(id).then((res) => {
            if (!res.success) {
              this.$message.error(res.message)
              return
            }
            // 假如删除的为当前选择的年份 则默认选中第一个
            this.handleFetchTreeData(true)

            // 刷新列表清空
            this.handleFetchTreeData()
          })
        },
      })
    },
    handleCatalogueClose() {
      this.catalogueVisible = false
      this.formData = {}
      setTimeout(() => {
        this.$refs.modal.resetFields()
      })
    },
  },
  watch: {
    value() {
      this.$emit('change', this.value)
    },
  },
}
</script>

<style lang="less" scoped>
.search {
  padding: 16px;
}
.actions {
  display: flex;
  padding: 0 16px 16px;
  align-items: center;
  justify-content: stretch;
}
.meun-t {
  .item {
    margin: 0;
    height: 45px;
    padding-left: 42px;
    line-height: 45px;
    cursor: pointer;
  }
  .item-active {
    background: #0091ff;
    color: #fff;
  }
}
</style>


<style lang="less">
.tree-container {
  .ant-collapse {
    background: #fff;
  }
  .ant-collapse-item {
    border-bottom: none !important;
  }
  .ant-collapse-content-box {
    padding: 0;
  }
  // .ant-collapse-item-active > .ant-collapse-header {
  //   background: #0091ff;
  //   color: #fff;
  // }
}
</style>
=======
>>>>>>> 01dd9b97bcb3ce80625ac1c92686e879f3fe0e5c
