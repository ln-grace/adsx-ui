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
  <span @click="logsFlag?'':handleOpen()">
    <el-badge :value="logsFlag?'':logsLen">
      <i class="icon-bug"></i>
    </el-badge>
    <el-dialog title="日志"
               fullscreen
               :visible.sync="box"
               width="100%"
               append-to-body>
      <logs></logs>
    </el-dialog>
  </span>
</template>

<script>
import { mapGetters } from 'vuex';
import logs from '@/page/logs/index'
export default {
  name: 'top-logs',
  components: { logs },
  data() {
    return {
      box: false
    }
  },
  created() {
  },
  mounted() { },
  computed: {
    ...mapGetters(['logsFlag', 'logsLen'])
  },
  props: [],
  methods: {
    handleOpen() {
      this.box = true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
