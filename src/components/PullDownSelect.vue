<template>
  <div>
    <a-select
      :value="value"
      :options="opt"
      @change="handleChange"
      :placeholder="placeholder"
      style="display: block; width: 100%"
      class="select_list"
      @popupScroll="handleLoadMore"
      :show-search="showSearch"
      :filter-option="searchType === 'local' && handleSearchLocal"
      @search="handleSearch"
      :searchValue="searchKey"
    >
      <template slot="dropdownRender" slot-scope="menu">
        <a-spin :spinning="loading">
          <v-nodes :vnodes="menu" />
        </a-spin>
      </template>
    </a-select>
  </div>
</template>




<script>
import { LoadingOutlined } from "@ant-design/icons-vue";
import { isEqual } from 'lodash'
export default {
  name: "PullDownSelect",
  props: {
    value: String,
    placeholder: String,
    loadMore: Function,
    extraParams: {
      type: Object,
      default() {
        return {};
      },
    },
    pageable: {
      type: Boolean,
      default: false,
    },
    showSearch: {
      type: Boolean,
      default: false,
    },
    searchType: {
      type: String,
      default: "local",
    },
  },
  components: {
    LoadingOutlined,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes,
    },
  },
  computed: {
    flatOptions() {
      return Object.values(this.opt).flat();
    },
  },
  data() {
    return {
      loading: true,
      timeout: -1,
      page: { page: 1, pageCount: 30 },
      opt: [],
      finsh: false,
      searchKey: "",
    };
  },
  mounted() {
    this.handleLoad();
  },
  watch: {
    extraParams: {
      handler(last, current) {
        if(isEqual(last, current)) return
        this.page.page = 1;
        this.opt = [];
        this.handleLoad();
      },
      deep: true
    },
  },
  methods: {
    handleSearchLocal(input, option) {
      return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
    handleLoadMore(e) {
      if (this.finsh || !this.pageable) return;
      const height = parseFloat(getComputedStyle(e.target).height);
      if (e.target.scrollTop + height + 20 >= e.target.scrollHeight) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.page.page += 1;
          this.handleLoad();
        }, 100);
      }
    },
    handleChange(e) {
      const opt = this.opt.find(item=>item.value === e)
      this.$emit("change", e, opt);
      this.$emit("input", e, opt);
    },
    handleSearch(key) {
      if (this.searchType !== "remote") return;
      this.page.page = 1;
      this.opt = [];
      this.searchKey = key;
      this.handleLoad();
    },
    handleLoad() {
      this.loading = true;
      this.loadMore({
        ...this.page,
        ...this.extraParams,
        searchKey: this.searchKey,
      })
        .then((res) => {
          // this.opt[this.page.page] = res;
          this.finsh = !res.length;
          this.opt = [...this.opt, ...res];
          this.$forceUpdate();
        })
        .finally(() => {
          this.loading = false;
          this.$forceUpdate();
        });
    },
  },
};
</script>