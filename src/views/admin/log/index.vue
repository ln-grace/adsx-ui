<!--
  -    Copyright (c) 2018-2025, lengleng All rights reserved.
  -
  - Redistribution and use in source and binary forms, with or without
  - modification, are permitted provided that the following conditions are met:
  -
  - Redistributions of source code must retain the above copyright notice,
  - this list of conditions and the following disclaimer.
  - Redistributions in binary form must reproduce the above copyright
  - notice, this list of conditions and the following disclaimer in the
  - documentation and/or other materials provided with the distribution.
  - Neither the name of the pig4cloud.com developer nor the names of its
  - contributors may be used to endorse or promote products derived from
  - this software without specific prior written permission.
  - Author: lengleng (wangiegie@gmail.com)
  -->

<template>
  <div class="app-container pull-auto">
    <basic-container>
      <avue-crud ref="crud"
                 :page="page"
                 :data="tableData"
                 :table-loading="tableLoading"
                 :option="tableOption"
                 @current-change="currentChange"
                 @size-change="sizeChange"
                 @search-change="searchChange"
                 @refresh-change="refreshChange"
                 @row-del="rowDel">
        <template slot-scope="scope"
                  slot="menu">
          <el-button type="danger"
                     v-if="permissions.sys_log_del"
                     icon="el-icon-delete"
                     size="mini"
                     plain
                     @click="handleDel(scope.row,scope.index)">删除</el-button>
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
  import { fetchList, delObj } from '@/api/log'
  import { tableOption } from '@/const/crud/log'
  import { mapGetters } from 'vuex'
  export default {
    name: 'log',
    data() {
      return {
        tableData: [],
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 20 // 每页显示多少条
        },
        listQuery: {
          page: 1,
          limit: 20,
          type: undefined
        },
        tableLoading: false,
        tableOption: tableOption
      }
    },
    created() {
      this.getList()
    },
    mounted: function() { },
    computed: {
      ...mapGetters(['permissions'])
    },
    methods: {
      getList() {
        this.tableLoading = true
        this.listQuery.orderByField = 'create_time'
        this.listQuery.isAsc = false
        fetchList(this.listQuery).then(response => {
          this.tableData = response.data.records
          this.page.total = response.data.total
          this.tableLoading = false
        })
      },
      currentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      sizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleDel(row, index) {
        this.$refs.crud.rowDel(row, index)
      },
      rowDel: function(row, index) {
        var _this = this
        this.$confirm('是否确认删除ID为"' + row.id + '"的日志?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(function() {
            return delObj(row.id)
          })
          .then(data => {
            this.getList()
            _this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            })
          })
          .catch(function(err) { })
      },
      /**
       * 搜索回调
       */
      searchChange(form) {
        this.listQuery.type = form.type
        this.getList()
      },
      /**
       * 刷新回调
       */
      refreshChange() {
        this.getList()
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>

