<template>
  <div>
    <div class="search-box">
      <el-form :model="queryParams" ref="queryForm" :inline="true" class="header-search-form" label-width="90px">
        <!-- <el-form-item label="登录地址" prop="ipaddr">
          <el-input
            v-model="queryParams.ipaddr"
            placeholder="请输入登录地址"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item> -->
        <el-form-item label="应用名称" prop="appId">
          <el-select
          v-model="queryParams.appId"
          placeholder="应用名称"
          clearable
          filterable
          size="small"
          @change="appChangeEvent"
        >
          <el-option
            v-for="item in AppList"
            :key="item.appId"
            :label="item.appName"
            :value="item.appId"
          />
        </el-select>
        </el-form-item>
        <el-form-item label="客户端名称" prop="clientId" label-width="88px">
          <el-select
            v-model="queryParams.clientId"
            placeholder="客户端名称"
            clearable
            filterable
            size="small"
          >
            <el-option
              v-for="item in clientList"
              :key="item.clientId"
              :label="item.clientName"
              :value="item.clientId"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="用户账号" prop="userName">
          <el-input
            v-model="queryParams.userName"
            placeholder="请输入登录名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item> -->
        <el-form-item label="用户账号" prop="userName">
          <NameOrIdAuto ref="nameOrIdAuto_1" :formData="queryParams" bindKey="userName" realKey="userName"></NameOrIdAuto>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>

      </el-form>
    </div>
    
    <div class="table-box">
      <el-row :gutter="10" class="mb16">
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['monitor:online:export']"
          >导出</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleForceLogout"
          >批量强退</el-button>
        </el-col>
      </el-row>

      <el-table
        v-loading="loading"
        :data="currentList"
        style="width: 100%;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" align="center" >
          <template slot-scope="scope">
            <span>{{(pageNum - 1) * pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="应用名称"  prop="appId" :show-overflow-tooltip="true" width="160">
        <template slot-scope="scope">
          {{filterName('app', scope.row.appId)}}
        </template>
      </el-table-column>
       <el-table-column label="客户端名称"  key="clientId" prop="clientName" :show-overflow-tooltip="true" width="160"  >
        <template slot-scope="scope">
          {{filterName('client', scope.row.clientId)}}
        </template>
      </el-table-column>
        <el-table-column label="会话编号" width="200" align="center" prop="tokenId" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark"  placement="top">
              <div class="text-ellipsis text-w200 text-copy" v-clipboard:copy="scope.row.tokenId" v-clipboard:success="clipboardSuccess">
                {{ scope.row.tokenId }}
              </div>
              <span slot="content">
                {{ scope.row.tokenId}}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="用户账号"  prop="userName" :show-overflow-tooltip="true" width="120" />
        <el-table-column label="用户名称"  prop="nickName" :show-overflow-tooltip="true" width="120" />
        <el-table-column label="主机" align="center" prop="ipaddr" :show-overflow-tooltip="true" width="130" />
        <el-table-column label="登录时间" align="center" prop="loginTime" :show-overflow-tooltip="true" width="160">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.loginTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="180" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleForceLogout(scope.row)"
              v-hasPermi="['monitor:online:forceLogout']"
            >强退</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="pageNum" :limit.sync="pageSize" />
    </div>
    
  </div>
</template>

<script>
import { list, forceLogout, getAppInfo } from "@/api/monitor/online";
import NameOrIdAuto from '@/components/form-components/NameOrIdAuto/NameOrIdAuto.vue'
export default {
  name: "Online",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      currentList: [],
      pageNum: 1,
      pageSize: 10,
      // 查询参数
      queryParams: {
        ipaddr: undefined,
        userName: undefined,
        appId: undefined,
        clientId: undefined
      },
       // 应用信息
      AppList: [],
      clientListAll: [], //所有应用下的端信息
      // 端信息
      clientList: [],
      userNames: '',
      tokenIds: '',
      multiple: true
    };
  },
  components: {
    NameOrIdAuto
  },
  created() {
    this.getAppList()
  },
  watch: {
    pageNum () {
      this.currentList = this.list.slice((this.pageNum-1) * this.pageSize, this.pageNum * this.pageSize)
    }
  },
  methods: {
    filterName(type,value) {
      let name = ''
      if(type === 'app') {
        name = this.AppList.filter((item) => item.appId === value)[0].appName
      } else {
        name = this.clientListAll.filter(item => item.clientId === value)[0].clientName
      }
      return name
    },
    clipboardSuccess () {
      this.$modal.msgSuccess("复制成功");
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      debugger
      this.userNames = selection.map(item => '《'+item.userName+'》')
      this.tokenIds = selection.map(item => item.tokenId)
      this.multiple = !selection.length
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/online/export', {
        ...this.queryParams
      }, `online_user_${new Date().getTime()}.xlsx`)
    },
    /** 查询登录日志列表 */
    getList() {
      debugger
      this.loading = true;
      list(this.queryParams).then(response => {
        debugger
        this.list = response.rows;
        console.log('aaaaaa-aaaa')
        console.log((this.pageNum-1) * this.pageSize)
        console.log(this.pageNum * this.pageSize)
        this.currentList = this.list.slice((this.pageNum-1) * this.pageSize, this.pageNum * this.pageSize)
        console.log('aaaaaa')
        console.log(this.currentList)
        console.log(this.list)
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.clientList = []
      this.resetForm("queryForm");
      this.$refs['nameOrIdAuto_1'].reset()
      this.handleQuery();
    },
    /** 强退按钮操作 */
    handleForceLogout(row) {
      let userName = ''
      if (row && row.userName) {
        userName = row.userName
      } else {
        userName = this.userNames
      }
      this.$modal.confirm('是否确认强退名称为"' + userName + '"的用户？').then(() => {
        let tokenIds = (row && row.tokenId) || this.tokenIds
        console.log(tokenIds)
        return forceLogout(tokenIds);
      }).then(() => {
        this.pageNum = 1
        this.getList();
        this.$modal.msgSuccess("强退成功");
      }).catch(() => {
      });
    },
    /** 查询所有应用 */
    getAppList () {
      getAppInfo({dataLevel:2}).then(res => {
        console.log('获取所有应用信息', res);
        this.AppList = res.data
        this.AppList.forEach((item) => {
          if(item.clientList) {
            this.clientListAll.push(...item.clientList)
          }
        })
        if (res.data && res.data.length === 1) {
          this.queryParams.appId = res.data[0].appId
          this.appChangeEvent(this.queryParams.appId)
        }
        this.getList();
      })
    },
    /** 应用变化更换对应的端 */
    appChangeEvent (val) {
      console.log(val, 'val');
      this.queryParams.clientId = ''
      if (val) {
        this.clientList = this.AppList.filter(x => x.appId === val)[0].clientList
      } else {
        this.clientList = []
      }
      console.log(this.queryParams.clientId);
    },
  }
};
</script>
<style lang="scss" scoped>
.search-box {
  width: 100%;
  padding: 16px 24px 7px;
  background-color: #FFFFFF;
}
.table-box {
  width: 100%;
  margin-top: 16px;
  padding:16px 24px;
  background-color: #FFFFFF;
}
</style>
