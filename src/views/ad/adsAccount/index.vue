<template>
  <div class="app-container calendar-list-container">
    <basic-container>
      <div class="filter-container">
        <el-input @keyup.enter.native="handleFilter"
                  style="width: 200px;"
                  class="filter-item"
                  placeholder="账号名"
                  v-model="listQuery.customer_name">
        </el-input>
        <el-button class="filter-item"
                   type="primary"
                   v-waves
                   icon="search"
                   @click="handleFilter">搜索</el-button>
        <el-button v-if="ads_account_add"
                   class="filter-item"
                   style="margin-left: 10px;"
                   @click="handleCreate"
                   type="primary"
                   icon="edit">添加</el-button>
        <el-button v-if="ads_account_refresh"
                   class="filter-item"
                   style="margin-left: 10px;"
                   @click="handleRefresh"
                   type="primary"
                   icon="update">刷新账号信息</el-button>
      </div>

      <el-table :key='tableKey'
                :data="list"
                v-loading="listLoading"
                element-loading-text="给我一点时间"
                border
                fit
                highlight-current-row
                style="width: 99%">

        <el-table-column align="center"
                         label="ID">
          <template slot-scope="scope">
            <span>{{scope.row.customerId}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center"
                         label="账号名">
          <template slot-scope="scope">
            <span>
             {{scope.row.customerName}}
            </span>
          </template>
        </el-table-column>

        <el-table-column align="center"
                         label="账号级别"
                         class-name="status-col">
          <template slot-scope="scope">
            <el-tag size="medium" :type="scope.row.canManageClients === '0' ? 'info' : 'danger'">
              {{scope.row.canManageClients | isManagerFilter}}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center"
                         label="币种">
          <template slot-scope="scope">
            <span>{{scope.row.currencyCode}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center"
                         label="时区">
          <template slot-scope="scope">
            <span>{{scope.row.dateTimeZone}}</span>
          </template>
        </el-table-column>
      </el-table>

      <div v-show="!listLoading"
           class="pagination-container">
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page.sync="listQuery.page"
                       :page-sizes="[10,20,30, 50]"
                       :page-size="listQuery.limit"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="total">
        </el-pagination>
      </div>
    </basic-container>

    <el-dialog :title="textMap[dialogStatus]"
               :visible.sync="dialogManagerCustomerVisible">
      <el-tree class="filter-tree"
               :data="treeManagerCustomerData"
               :default-checked-keys="checkedKeys"
               check-strictly
               node-key="id"
               highlight-current
               ref="managerCustomerTree"
               :props="defaultProps"
               @node-click="getNodeData"
               default-expand-all>
      </el-tree>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]"
               :visible.sync="dialogFormVisible">
      <el-form :model="form"
               :rules="rules"
               ref="form"
               label-width="100px">
        <el-form-item label="账户名"
                      prop="customerName">
          <el-input v-model="form.customerName"
                    placeholder="请输入账户名"></el-input>
        </el-form-item>

        <el-form-item label="时区"
                       prop="dateTimeZone">
          <el-select class="filter-item"
                     v-model="form.dateTimeZone"
                     placeholder="选择时区">
            <el-option v-for="item in dateTimeZoneOptions"
                       :key="item"
                       :label="item | dateTimeZoneFilter"
                       :value="item"> </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="币种"
                       prop="currencyCode">
          <el-select class="filter-item"
                     v-model="form.currencyCode"
                     placeholder="选择币种">
            <el-option v-for="item in currencyCodeOptions"
                       :key="item"
                       :label="item | currencyCodeFilter"
                       :value="item"> </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="网站地址"
                      prop="websiteUrl">
          <el-input v-model="form.websiteUrl"
                    placeholder="请输入网站地址"></el-input>
        </el-form-item>

        <el-form-item label="经理账号"
                      prop="parentCustomerName">
          <el-input v-model="form.parentCustomerName"
                    placeholder="选择账号"
                    @focus="handleManagerCustomer()"
                    readonly></el-input>
          <input type="hidden"
                 v-model="form.parentId" />
        </el-form-item>

      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'"
                   type="primary"
                   @click="create('form')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  fetchList,
  getObj,
  addObj,
  putObj,
  delObj,
  refreshAccount,
  fetchChildrenManagerTree
} from "@/api/adsAccount";
import waves from "@/directive/waves/index.js"; // 水波纹指令
// import { parseTime } from '@/utils'
import { mapState, mapGetters } from "vuex";
import ElRadioGroup from "element-ui/packages/radio/src/radio-group";
import ElOption from "element-ui/packages/select/src/option";
import { rejects } from "assert";

export default {
  components: {
    ElOption,
    ElRadioGroup
  },
  name: "table_ads_account",
  directives: {
    waves
  },
  data() {
    return {
      treeManagerCustomerData: [],
      checkedKeys: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      role: [],
      form: {
        customerName: undefined,
        parentId: undefined,
        currencyCode: undefined,
        dateTimeZone: undefined,
        websiteUrl: undefined,
        parentId: undefined
      },
      rules: {
        customerName: [
          {
            required: true,
            message: "请输入账户名",
            trigger: "blur"
          },
          {
            min: 3,
            max: 40,
            message: "长度在 3 到 40 个字符",
            trigger: "blur"
          }
        ],
        dateTimeZone: [
          {
            required: true,
            message: "请选择时区",
            trigger: "blur"
          }
        ],
        currencyCode: [
          {
            required: true,
            message: "请选择币种",
            trigger: "blur"
          }
        ],
        parentCustomerName: [
          {
            required: true,
            message: "请选择经理账号",
            trigger: "blur"
          }
        ]
      },
      dateTimeZoneOptions: [
        "Asia/Shanghai",
        "America/Chicago",
        "America/New_York",
        "America/Denver",
        "America/Phoenix",
        "America/Los_Angeles",
        "America/Anchorage",
        "Pacific/Honolulu"
      ],
      currencyCodeOptions: ["USD", "CNY", "HKD"],
      dialogFormVisible: false,
      dialogManagerCustomerVisible: false,
      userAdd: false,
      userUpd: false,
      userDel: false,
      dialogStatus: "",
      textMap: {
        create: "创建客户账号"
      },
      isDisabled: {
        0: false,
        1: true
      },
      tableKey: 0
    };
  },
  computed: {
    ...mapState({
      adsAccount: state => state.user.adsAccount
    }),
    ...mapGetters(["permissions"])
  },
  filters: {
    isManagerFilter(state) {
      const statusMap = {
        0: "客户",
        1: "经理"
      };
      return statusMap[state];
    },
    dateTimeZoneFilter(timeZone) {
      const timeZoneMap = {
        "Asia/Shanghai": "中国上海",
        "America/Chicago": "芝加哥",
        "America/New_York": "纽约",
        "America/Denver": "丹佛",
        "America/Phoenix": "凤凰城",
        "America/Los_Angeles": "洛杉矶",
        "America/Anchorage": "安克雷奇",
        "Pacific/Honolulu": "檀香山"
      };
      return timeZoneMap[timeZone];
    },
    currencyCodeFilter(currencyCode) {
      const currencyCodeMap = {
        USD: "美元",
        CNY: "人民币",
        HKD: "港币"
      };
      return currencyCodeMap[currencyCode];
    }
  },
  created() {
    this.getList();
    this.ads_account_add = this.permissions["ads_account_add"];
    this.ads_account_refresh = this.permissions["ads_account_refresh"];
  },
  methods: {
    getList() {
      this.listLoading = true;
      this.listQuery.isAsc = false;
      fetchList(this.listQuery).then(response => {
        this.list = response.data.records;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    getNodeData(data) {
      this.dialogManagerCustomerVisible = false;
      this.form.parentId = data.id;
      this.form.parentCustomerName = data.name;
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    handleRefresh() {
      refreshAccount(this.adWordsAccount.customerId).then(response => {
        this.$notify({
          title: "成功",
          message: "刷新成功",
          type: "success",
          duration: 2000
        });
      });
    },
    create(formName) {
      const set = this.$refs;
      this.form.role = this.role;
      set[formName].validate(valid => {
        if (valid) {
          addObj(this.form).then(() => {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000
            });
          });
        } else {
          return false;
        }
      });
    },
    handleManagerCustomer() {
      fetchChildrenManagerTree(this.adWordsAccount.customerId).then(
        response => {
          this.treeManagerCustomerData = response.data;
          this.dialogManagerCustomerVisible = true;
        }
      );
    },
    cancel(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
    },
    resetTemp() {
      this.form = {
        customerId: undefined,
        customerName: "",
        currencyCode: "",
        dateTimeZone: "",
        websiteUrl: "",
        parentId: undefined
      };
    }
  }
};
</script>
