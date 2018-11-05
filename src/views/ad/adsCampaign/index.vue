<template>
  <div class="app-container calendar-list-container">
    <basic-container>
        <!-- 添加 -->
      <div class="filter-container">
           <el-button v-if="ads_account_add"
                   class="filter-item"
                   style="margin-left: 10px;"
                   @click="handleCreate"
                   type="primary"
                   icon="edit">添加</el-button>
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
                        label="状态"
                        class-name="status-col">
            <template slot-scope="scope">
            <el-switch v-model="scope.row.status"  active-color="#13ce66" inactive-color="#ff4949" active-value="ENABLED" active-text="启用" 
                 inactive-value="PAUSED" inactive-text="暂停"  @change="handlechange($event, scope.row.campaignId)" >            
            </el-switch>
            </template>
        </el-table-column>

        <el-table-column align="center"
                         label="广告系列ID">
          <template slot-scope="scope">
            <span>{{scope.row.campaignId}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center"
                         label="广告系列名称">
          <template slot-scope="scope">
            <span>
             {{scope.row.campaignName}}
            </span>
          </template>
        </el-table-column>    
        <el-table-column align="center"
                        label="出价策略"
                        class-name="status-col">
            <template slot-scope="scope">
            <el-tag size="medium" :type="scope.row.biddingStrategy === 'MANUAL_CPC' ? 'info' : 'danger'">
                {{scope.row.biddingStrategy | isStrategyFilter}}
            </el-tag>
            </template>
        </el-table-column>
        <el-table-column align="center"
                        label="销售国家"
                        class-name="status-col">
            <template slot-scope="scope">
            <el-tag size="medium" :type="scope.row.salesCountry === 'US' ? 'info' : 'danger'">
                {{scope.row.salesCountry | isSalesFilter}}
            </el-tag>
            </template>
        </el-table-column>
        <el-table-column align="center"
                        label="优先级"
                        class-name="status-col">
            <template slot-scope="scope">
            <el-tag size="medium" :type="scope.row.campaignPriority === 0 ? 'info' : 'danger'">
                {{scope.row.campaignPriority | isPriorityFilter}}
            </el-tag>
            </template>
        </el-table-column>
       
       <el-table-column align="center"
                         label="开始投放时间">
          <template slot-scope="scope">
            <span>{{scope.row.startDate | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="结束投放时间">
          <template slot-scope="scope">
            <span>{{scope.row.endDate | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                        label="服务状态"
                        class-name="status-col">
            <template slot-scope="scope">
            <el-tag size="medium" :type="scope.row.servingStatus === 'SERVING' ? 'info' : 'danger'">
                {{scope.row.servingStatus | isServingFilter}}
            </el-tag>
            </template>
        </el-table-column>
         <el-table-column align="center"
                         label="操作"
                         width="200">
          <template slot-scope="scope">
            <el-button v-if="ads_account_del"
                       size="small"
                       type="danger"
                       @click="deletes(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>

      </el-table>
      <!-- 分页代码 -->
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
    
    <!-- 弹窗中需要的数据 -->
    <!-- ads客户账号中弹窗数据 -->
    <el-dialog :title="textMap[dialogStatus]"   
               :visible.sync="dialogAdsAccountVisible">
      <ul>
          <li v-for="ads in treeAdsAccountData"  @click="getAdsAccountData(ads.customerName,ads.customerId)" :key="ads.customerId">{{ads.customerName}}</li>
      </ul>
    </el-dialog>

    <!-- 添加弹窗 -->
    <el-dialog :title="textMap[dialogStatus]"
               :visible.sync="dialogFormVisible">
      <el-form :model="form"
               :rules="rules"
               ref="form"
               label-width="100px">
        <el-form-item label="客户账号"
                      prop="adsAccountName">
          <el-input v-model="form.adsAccountName"
                    placeholder="选择ads客户账号"
                    @focus="handleAdsAccount()"
                    readonly></el-input>
          <input type="hidden"
                 v-model="form.customerId" />
        </el-form-item>

        <el-form-item label="预算花费"
                       prop="budgetMoney">
            <el-input v-model="form.budgetMoney"
                    placeholder="请输入预算每天花费"></el-input>             
        </el-form-item>

        <el-form-item label="投放方式"
                       prop="budgetDeliveryMethod">
             <el-radio v-model="budgetDeliveryMethod" label="STANDARD" value="STANDARD">标准</el-radio>
             <el-radio v-model="budgetDeliveryMethod" label="ACCELERATED" value="ACCELERATED">加速</el-radio>          
        </el-form-item>

        <el-form-item label="状态"
                       prop="status">
             <el-radio v-model="status" label="ENABLED" value="ENABLED">启用</el-radio>
             <el-radio v-model="status" label="PAUSED" value="PAUSED">暂停</el-radio>          
        </el-form-item>

        <el-form-item label="出价策略"
                       prop="biddingStrategy"> 
            <el-select class="filter-item"
                     v-model="form.biddingStrategy"
                     placeholder="选择出价策略" @change="getStrategySelected">
            <el-option v-for="item in strategyOptions"
                       :key="item"
                       :label="item | isStrategyFilter"
                       :value="item" :disabled="isDisabled[item]"></el-option>
          </el-select>      
           <div v-if="stratename==='MANUAL_CPC'">
                 <el-radio v-model="enhancedCpcEnabled " label="on" value="true">开启</el-radio>
                 <el-radio v-model="enhancedCpcEnabled " label="off" value="false">关闭</el-radio>     
            </div>
            <div v-else-if="stratename==='TARGET_ROAS'">
                 <div>
                    <el-input v-model="form.targetRoas" placeholder="请输入目标广告支出回报率"></el-input> 
                 </div>
            </div>   
            <div v-else-if="stratename==='TARGET_SPEND'">
                 <div>
                    <el-input v-model="form.bidCeiling"  placeholder="请输入每次点击费用的最高出价上限（可选）"></el-input> 
                 </div>
            </div>    
            <div v-else-if="stratename==='ENHANCED_CPC'">
                 <div>
                    <el-input v-model="form.strategyName" placeholder="请输入出价策略名称"></el-input> 
                 </div>
            </div>      
        </el-form-item>
       
        <el-form-item label="系列名称"
                       prop="campaignName">
            <el-input v-model="form.campaignName"
                    placeholder="请输入广告系列名称"></el-input>             
        </el-form-item>

        <el-form-item label="销售国家"
                       prop="currencyCode">
          <el-select class="filter-item"
                     v-model="form.currencyCode"
                     placeholder="选择国家">
            <el-option v-for="item in saleCountryOptions"
                       :key="item"
                       :label="item | isSalesFilter"
                       :value="item"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优先级"
                       prop="campaignPriority">
             <el-radio-group v-model="campaignPriority">
                <el-radio :label="0">低</el-radio>
                <el-radio :label="1">中</el-radio>
                <el-radio :label="2">高</el-radio>
             </el-radio-group>     
        </el-form-item>
        
        <el-form-item label="MC帐号"
                      prop="merchantCenterId">
           <el-select class="filter-item"
                     v-model="form.merchantCenterId"
                     placeholder="请选择">
                <el-option v-for="item in mcOptions"
                       :key="item.accountId"
                       :label="item.accountName"   
                       :value="item.accountId"> 
                </el-option>
          </el-select>  
        </el-form-item>

        <el-form-item label="合作伙伴"
                       prop="targetSearchNetwork">
             <el-radio v-model="targetSearchNetwork" label="Yes">是</el-radio>
             <el-radio v-model="targetSearchNetwork" label="No">否</el-radio>          
        </el-form-item>

        <el-form-item label="投放时间"
                       prop="">
            <el-row :span="24">
                <el-col :span="11">
                    <div class="block">
                        <el-date-picker
                        v-model="startDate"
                        type="date"
                        placeholder="开始日期">
                        </el-date-picker>
                    </div>
                </el-col>
                <el-col :span="11" :offset="2">
                    <div class="block">
                        <el-date-picker
                        v-model="endDate"
                        type="date"
                        placeholder="结束日期">
                        </el-date-picker>
                    </div>
                </el-col>
            </el-row>                              
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
import {fetchList,getObj,addObj,putObj,delObj,changeStatus,fetchChildrenManagerTree,fetchChildrenMcTree} from "@/api/adsCampaign";  //导入方法
import { mapState, mapGetters } from "vuex";
import { rejects } from "assert"; //从断言导入拒绝


export default {
  name: "table_ads_campaign",
   components: {
   
  },  
  data() {
    return {
      mcOptions: [],   //Mc账号
      treeAdsAccountData: [],  //ads客户账号
      checkedKeys: [],
      startDate:'',
      endDate:'',
      stratename:'',
      targetRoas:'',
      bidCeiling:'',
      strategyName:'',
      campaignPriority:'',
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
      budgetDeliveryMethod:'STANDARD',
      status:'ENABLED',
      targetSearchNetwork:'Yes',
      enhancedCpcEnabled:'on',
      campaignPriority:0,
      role: [],
      //弹窗参数
      form: {
        budgetMoney:null,
        budgetDeliveryMethod:undefined,
        status:undefined,
        biddingStrategy:undefined,
        merchantCenterId:undefined
      },
      rules: {  //校验规则
         customerId: [
          {
            required: true,
            message: "请输入ads客户账号",
            trigger: "blur"
          },
        ],
        budgetMoney:[
           {
            required: true,
            message: "请输入预算每天花费",
            trigger: "blur"
           },
        ],
        campaignName: [
          {
            required: true,
            message: "请输入广告系列名称",
            trigger: "blur"
          }
        ],
        biddingStrategy: [
          {
            required: true,
            message: "请选择广告出价策略",
            trigger: "blur"
          }
        ],
        salesCountry: [
          {
            required: true,
            message: "请选择销售国家",
            trigger: "blur"
          }
        ],
        merchantCenterId: [
          {
            required: true,
            message: "请选择Merchant Center 帐号",
            trigger: "blur"
          }
        ],
       
      },
      saleCountryOptions: ["US","JP","GB","FR","DE"],
      strategyOptions:[
          "MANUAL_CPC",
          "TARGET_ROAS",
          "TARGET_SPEND",
          "ENHANCED_CPC"
          ],
      dialogFormVisible: false, //点击添加--->表格弹窗
      dialogAdsAccountVisible: false, //ads客户账户
      dialogMcVisible:false,  //MC账号弹窗
      userAdd: false,
      userUpd: false,
      userDel: false,
      dialogStatus: "",   
      textMap: {
        create: "添加广告系列"
      },
      isDisabled: {
        'TARGET_ROAS': true,
      },
      tableKey: 0
    }
  },
  computed: {
    ...mapState({
       adsAccount: state => state.user.adsAccount
    }),
    ...mapGetters(["roles", "permissions"])
    },
   filters: {
        //出价策略
        isStrategyFilter(state) {
            const strategyMap = {
                'MANUAL_CPC': "每次点击费用人工出价",
                'TARGET_ROAS': "目标广告支出回报率 ",
                'TARGET_SPEND':"尽可能争取更多点击次数 ",
                'ENHANCED_CPC':"智能点击付费"
            };
            return strategyMap[state];
        },
        //销售国家
        isSalesFilter(sales) {
            const salesMap = {
                'US':"美国",
                'JP':"日本 ",
                'GB':"英国 ",
                'FR':"法国",
                'DE':"德国"
            };
            return salesMap[sales];
        },
        //优先级
        isPriorityFilter(priority) {
            const priorityMap = {
                 0:"低",
                 1:"中",
                 2:"高",
            };
            return priorityMap[priority];
        },
        //服务状态
        isServingFilter(serving) {
            const servingMap = {
                 "SERVING":"该广告系列目前正在投放广告",
                 "NONE":"none",
                 "ENDED":"广告系列结束日期已过",
                 "PENDING":"广告系列的开始日期尚未达到",
                 "SUSPENDED":"该活动可能因缺乏拨款而暂停"
            };
            return servingMap[serving];
        },
    },  
    created() {
        this.getList();
        //给按钮授权
        this.ads_account_edit = this.permissions["ads_account_edit"];
        this.ads_account_del = this.permissions["ads_account_del"];    
        this.ads_account_add = this.permissions["ads_account_add"];
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
        //ads客户账号   
        handleAdsAccount () {
            fetchChildrenManagerTree(this.adsAccount.customerId).then(
                response => {
                    this.treeAdsAccountData =  response.data; //返回的数据
                    this.dialogAdsAccountVisible = true;
                }
            );
        },
        getAdsAccountData(name,id) {
            this.dialogAdsAccountVisible = false;
            this.form.adsAccountId=id;
            this.form.adsAccountName=name;
            fetchChildrenMcTree(id).then(response => {
                this.mcOptions =  response.data.data;
            });
        },
        handlechange(val, campaignId) {  //修改状态
            this.listLoading = true;
            changeStatus(val, campaignId).then(response =>{
                this.listLoading = false;
                this.getList();   
            })    
        },
        deletes (row) {
        this.$confirm(
            "提示",
            {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
            }
        ).then(() => {
            delObj(row.campaignId)
            .then(() => {
                // console.log(row.campaignId);
                this.getList();
                this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success",
                duration: 2000
                });
            })
        });
        },//分页
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
        }, //添加
        handleCreate() {
        this.resetTemp();
        this.dialogStatus = "create";
        this.dialogFormVisible = true;
        },
        //确定 
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
        getStrategySelected(){
           this.stratename=this.form.biddingStrategy;
        },
        //取消
        cancel(formName) {
        this.dialogFormVisible = false;
        this.$refs[formName].resetFields();
        },
        //清空
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
