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
  <avue-crud :data="logsList"
             :option="option">
    <template slot="menuLeft">
      <el-button type="primary"
                 size="small"
                 icon="el-icon-upload"
                 @click="send">上传服务器</el-button>
      <el-button type="danger"
                 size="small"
                 icon="el-icon-delete"
                 @click="clear">清空本地日志</el-button>
    </template>
    <template slot-scope="scope"
              slot="type">
      <el-tag type="danger"
              size="small">{{scope.row.type}}</el-tag>
    </template>
    <template slot-scope="props"
              slot="expand">
      <pre class="code">
        {{props.row.stack}}
      </pre>
    </template>
  </avue-crud>
</template>

<script>
import { mapGetters } from 'vuex'
import option from '@/const/logs/index'
export default {
  name: 'errLogs',
  data() {
    return {
      option: option
    }
  },
  created() {

  },
  mounted() { },
  computed: {
    ...mapGetters(['logsList'])
  },
  props: [],
  methods: {
    send() {
      this.$confirm('确定上传本地日志到服务器?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('SendLogs').then(() => {
          this.$parent.$parent.box = false
          this.$message({
            type: 'success',
            message: '发送成功!'
          })
        })
      }).catch(() => {

      })
    },
    clear() {
      this.$confirm('确定清空本地日志记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('CLEAR_LOGS')
        console.log(this)
        this.$parent.$parent.box = false
        this.$message({
          type: 'success',
          message: '清空成功!'
        })
      }).catch(() => {

      })
    }
  }
}
</script>

<style lang="scss" scoped>
.code {
  font-size: 12px;
  display: block;
  font-family: monospace;
  white-space: pre;
  margin: 1em 0px;
}
</style>
