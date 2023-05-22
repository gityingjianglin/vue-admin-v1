<!-- 人员配置 -->
<template>
  <div class="people-configure h-view">
    <div class="left-content flex-shrink">
      <div class="search">
        <el-form>
          <el-form-item label="应用名称" prop="appId">
            <el-select
              v-model="queryParams.appId"
              placeholder="应用名称"
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
        </el-form>
        <el-input
          placeholder="请输入组织名称"
          v-model="filterText">
        </el-input>
      </div>
      <el-scrollbar class="scroll" v-loading="treeLoading">
        <div class="tree-box">
          <el-tree
            class="filter-tree"
            :data="orgOptions"
            :props="defaultProps"
            node-key="id"
            :filter-node-method="filterNode"
            :highlight-current="true"
            :expand-on-click-node="false"
            @node-click="chooseOrg"
            :default-expanded-keys="nodeKey"
            ref="tree">
          </el-tree>
        </div>
      </el-scrollbar>
    </div>
    <div class="right-content flex1">
      <el-scrollbar class="scroll-right">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" class="header-search-form" label-width="90px">
          <el-form-item label="用户名称" prop="nickName">
            <el-autocomplete
              v-model="queryParams.nickName"
              :fetch-suggestions="(queryString, cb) => {querySearchAsync(queryString, cb, 'queryParams', 'nickName')}"
              placeholder="请输入用户名称"
              size="small"
              :debounce="800"
              clearable
              style="width:215px;"
              @clear="selectClear()"
              @select="(item) => {handleSelect(item, 'queryParams', 'nickName')}"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item label="手机号码" prop="phoneNumber">
            <el-input
              v-model="queryParams.phoneNumber"
              placeholder="请输入手机号码"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="用户状态"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in dict.type.sys_user_status"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <el-row>
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['system:role:add']"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['system:role:export']"
            >导出</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <el-table v-loading="tableLoading" :data="roleList">
          <!-- <el-table-column type="selection" width="55" align="center" /> -->
          <!-- <el-table-column label="角色名称" width="180" prop="roleName" :show-overflow-tooltip="true" /> -->
          <!-- <el-table-column label="权限字符" prop="roleKey" :show-overflow-tooltip="true" width="100" /> -->
          <!-- <el-table-column label="应用名称" width="200"  key="appName" prop="appName" :show-overflow-tooltip="true" > -->
          <!-- </el-table-column> -->
          <el-table-column label="用户编号" width="100" key="userId" prop="userId" >
          </el-table-column>
          <el-table-column label="用户账号" prop="userName"  align="center" width="90"/>
          <el-table-column label="用户名称" prop="nickName"  align="center"/>
          <el-table-column label="所属应用" width="280"  key="clientId" prop="userContent" v-if="columns[3].visible" >
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark"  placement="top">
                <div class="text-ellipsis text-w280 text-copy" v-clipboard:copy="scope.row.userContent" v-clipboard:success="clipboardSuccess">
                  {{ scope.row.userContent }}
                </div>
                <span slot="content">
                  {{ scope.row.userContent}}
                </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="手机号码" prop="initPhoneNumber"  align="center" width="100" />
          <el-table-column label="状态" align="center" >
            <template slot-scope="scope">
              <dict-tag :options="dict.type.sys_user_status" :value="scope.row.status"/>
            </template>
          </el-table-column>
          <el-table-column label="操作时间" width="160" align="center" prop="createTime" >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" fixed="right" width="140" class-name="small-padding fixed-width">
            <template slot-scope="scope" v-if="scope.row.roleId !== 1">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['system:role:edit']"
              >修改</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleShowSelfOrg(scope.row)"
                v-hasPermi="['system:role:remove']"
              >查看组织</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-scrollbar>
    </div>
    <el-dialog :title="form.dataScope === '1' ? '新增' : '修改'" :visible.sync="openDataScope" width="500px" append-to-body :before-close="handleClose">
      <el-form :model="form" label-width="80px" :rules="rules" ref="ruleForm">
        <el-form-item label="应用名称" prop="appId">
          <el-select
            v-model="queryParams.appId"
            placeholder="应用名称"
            filterable
            size="small"
            :disabled="form.dataScope === '2'"
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
        <el-form-item label="用户名称" prop="nickName">
          <el-autocomplete
            v-model="form.nickName"
            :fetch-suggestions="(queryString, cb) => {querySearchAsync(queryString, cb, 'form', 'nickName')}"
            placeholder="请输入用户名称"
            size="small"
            :debounce="800"
            clearable
            style="width:215px;"
            @blur="userBlur"
            @clear="selectClear()"
            :disabled="form.dataScope === '2'"
            @select="(item) => {handleSelect(item, 'form', 'nickName', 'dialog')}"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="组织名称">
          <el-checkbox v-model="deptExpand" @change="handleCheckedTreeExpand($event, 'org')">展开/折叠</el-checkbox>
          <el-checkbox v-model="deptNodeAll" @change="handleCheckedTreeNodeAll($event, 'org')">全选/全不选</el-checkbox>
          <el-checkbox v-model="form.orgCheckStrictly" @change="handleCheckedTreeConnect($event, 'org')" disabled>父子联动</el-checkbox>
          <el-scrollbar class="tree-seroll">
            <el-tree
              class="tree-border"
              :data="orgOptions"
              show-checkbox
              default-expand-all
              ref="org"
              node-key="id"
              :check-strictly="!form.orgCheckStrictly"
              empty-text="暂无数据"
              :props="defaultProps"
              @check="onCheckChange"
            ></el-tree>
          </el-scrollbar>
        </el-form-item>
        <!-- <el-form-item label="应用名称" prop="appId">
          <el-select
            v-model="form.appId"
            placeholder="应用名称"
            filterable
            size="small"
          >
            <el-option
              v-for="item in AppList"
              :key="item.appId"
              :label="item.appName"
              :value="item.appId"
            />
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDataScope" :disabled="isDisabledButton">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="组织" :visible.sync="openSelfOrg" width="500px" append-to-body>
      <el-tree :data="selfOrgOptions" :props="defaultProps" default-expand-all></el-tree>
    </el-dialog>
  </div>
</template>

<script>
import { getAppInfo, listUserOrg, listUser, listByName } from "@/api/system/user";
import { userOrgTreeselect, dataScope, userOrgs } from "@/api/system/org";
import { treeselect } from "@/api/system/org";
export default {
  name: '',
  dicts: ['sys_user_status'],
  data () {
    return {
      appId: '',
      // 应用信息
      AppList: [],
      filterText: '',
      orgOptions: [],
      selfOrgOptions: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      appName: '', // 应用名称
      loading: false,
      nodeKey: [],
      queryParams: {
        nickName: '',
        phoneNumber: '',
        status: '',
        appId: '',
        orgId: '',
        pageNum: 1,
        pageSize: 10
      },
      // 列信息
      columns: [
        { key: 0, label: `用户编号`, visible: true },
        { key: 1, label: `用户账号`, visible: true },
        { key: 2, label: `用户名称`, visible: true },
        { key: 3, label: `所属应用`, visible: true },
        { key: 4, label: `手机号码`, visible: true },
        { key: 5, label: `状态`, visible: true },
        { key: 6, label: `创建时间`, visible: true }
      ],
      total: 0,
      showSearch: true,
      form: {
        userId: '',
        orgCheckStrictly: true,
        orgIds: [],
        nickName: '',
        dataScope: ''
      },
      lastNickName: '',
      title: '',
      roleList: [],
      tableLoading: false,
      treeLoading: false,
      openDataScope: false, // 弹框
      openSelfOrg: false, // 所属组织弹框
      deptExpand: true, // 展开/折叠
      deptNodeAll: false, // 全选/全不选
      checkedKeysNodes: [],
      queryAppId: '',
      rules: {
        nickName: [
          { required: true, message: '请选择用户名称', trigger: 'change' }
        ]
      }
    };
  },

  components: {},
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  computed: {
    isDisabledButton() {
      /* if (this.form.dataScope === '1') {
        return this.orgOptions.length === 0 || this.checkedKeysNodes.length === 0
      } else {
        return this.orgOptions.length === 0
      } */

      if (this.form.dataScope === '1') {
        return !(this.form.userId && this.form.appId && this.orgOptions.length > 0 && this.checkedKeysNodes.length > 0)
        // return !this.form.userId && this.from.appId this.orgOptions.length === 0 || this.checkedKeysNodes.length === 0
      } else {
        return !(this.form.userId && this.form.appId && this.orgOptions.length > 0)
      }
      
    }
  },
  methods: {
    onCheckChange() {
      console.log('aaaaa')
      this.checkedKeysNodes = this.$refs.org.getCheckedKeys()
    },
    clipboardSuccess () {
      this.$modal.msgSuccess("复制成功");
    },
    /** 查询所有应用和端信息 dataLevel:2 (后端默认查询2)*/
    getAppList () {
      getAppInfo({dataLevel:2}).then(res => {
        console.log('获取所有应用信息', res);
        this.AppList = JSON.parse(JSON.stringify(res.data))
        let tempApp
        if (this.queryAppId) {
          tempApp = this.AppList.filter((item) => {
            return item.appId === this.queryAppId
          })[0]
        } else {
          tempApp = this.AppList[0]
        }
        this.queryParams.appId = tempApp.appId
        this.appName = tempApp.appName
        this.getList()
        // this.queryParams.appId = this.queryAppId ? this.queryAppId : this.AppList[0].appId
        // this.appName = this.queryParams.appId 
        this.getTreeselect()
      })
    },
    // 所有组织节点数据
    getOrgAllCheckedKeys() {
      // 目前被选中的部门节点
      let checkedKeys = this.$refs.org.getCheckedKeys();
      // 半选中的部门节点
      let halfCheckedKeys = this.$refs.org.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    /** 查询组织下拉树结构 */
    getTreeselect() {
      this.treeLoading = true
      treeselect({appId: this.queryParams.appId}).then(response => {
        this.treeLoading = false
        this.orgOptions = response.data;
        if (response.data) {
          response.data.forEach(item => {
            this.nodeKey.push(item.id)
          })
        }
        // response.data[0] && this.nodeKey.push(response.data[0].id)
      }, () => {
        this.treeLoading = false
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    chooseOrg (obj, node, ele) {
      console.log(obj)
      console.log(node)
      this.queryParams.orgId = obj.id
      this.getList()
    },
    appChangeEvent () {
      // this.appName = ''
      this.roleList = []
      this.checkedKeysNodes = []
      this.filterText = ''
      this.getTreeselect()
    },
    // 表格用户名称相关搜索
    querySearchAsync(queryString, cb, form, key) {
      clearTimeout(this.timeout)
      if (queryString) {
        console.log('1')
        this.timeout = setTimeout(async () => {
        let res = await this.getListByNicknameOrId(queryString, form, key)
        res && res.forEach((item) => {
          item.value = item.nickName + '/' + item.userName
        })
        var results = queryString ? res.filter(this.createStateFilter(queryString)) : res;
        cb(results);
      }, 200)
      } else {
        cb([])
      }
    },
    selectClear () {
      this.form.userId = ''
      document.activeElement.blur()
    },
    handleSelect(item, form, key, from) {
      console.log(item);
      
      if (from) {
        this.form.userId = item.userId
        this.lastNickName = item.nickName
      }
      // this.queryParams.nickName = item.nickName
      this.$set(this[form], key, item.nickName)
      // this[form][key] = item.nickName + '/' + item.userName
    },
    userBlur () {
      if (!this.form.userId) {
        this.form.nickName = ''
      } else {
        this.form.nickName = this.lastNickName
      }
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
      };
    },
    async getListByNicknameOrId (queryString, form, key) {
      let res = await listByName({
        nameParam: queryString,
        pageNum: 1,
        pageSize: 100
      })
      if (res && res.rows) {
        return res.rows
      }
    },
    // 新增/编辑用户名称相关搜索
    querySearchAsyncDia(queryString, cb) {
      clearTimeout(this.timeout)
      if (queryString) {
        console.log('1')
        this.timeout = setTimeout(async () => {
        let res = await this.getListByNicknameDia()
        res && res.forEach((item) => {
          item.value = item.nickName
        })
        var results = queryString ? res.filter(this.createStateFilter(queryString)) : res;
        cb(results);
      }, 200)
      } else {
        cb([])
      }
    },
    selectClearDia () {
      document.activeElement.blur()
    },
    handleSelectDia (item) {
      console.log(item);
      this.form.nickName = item.nickName
    },
    async getListByNicknameDia () {
      let res = await listUserOrg({
        nickName: this.form.nickName
      })
      if (res && res.rows) {
        return res.rows
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.clientList = []
      this.resetForm("queryForm");
      this.handleQuery();
    },
    getList () {
      this.tableLoading = true;
      listUserOrg(this.queryParams).then(response => {
          this.roleList = response.rows;
          console.log('this.userList',this.roleList);
          this.roleList.forEach (el => {
            el.userContent = ''
            if (el.phoneNumber) {
              el.initPhoneNumber = el.phoneNumber.slice(0,3) + "****" + el.phoneNumber.slice(7)
            }
            el.userRole = ''
            if(el.userRoles && el.userRoles.length > 0) {
              el?.userRoles.forEach((roleItem,index) => {
                el.userRole = el.userRole + roleItem + (index === el.userRoles.length - 1 ? '' : ',')
              })
            }
            if (el.email) {
              console.log(el.email,);
              el.initEmail = el.email.slice(0,el.email.indexOf('@')-3) + "***" + el.email.slice(el.email.indexOf('@'))
            }
            if(el.userAccounts.length > 0) {
              el.userAccounts.forEach((item, index) => {
                item.content = item.appName + '-' + item.clientName + (index === el.userAccounts.length -1 ? '' : '，')
                el.userContent += item.content
              })
            }
          })
          this.total = response.total;
          this.tableLoading = false;
          console.log(this.userList , '//////');
        }, () => {
          this.tableLoading = false;
        }
      );
    },
    handleShowSelfOrg (row) {
      let params = {
        appId: this.queryParams.appId,
        userId: row.userId
      }
      userOrgs(params).then((data) => {
        this.selfOrgOptions = data.data
        this.openSelfOrg = true
      })
    },
    handleAdd () {
      // this.title = '新增'
      this.form.dataScope = '1'
      this.form.appId = this.queryParams.appId
      this.openDataScope = true
    },
    // 弹框表单重置
    reset() {
      if (this.$refs.org != undefined) {
        this.$refs.org.setCheckedKeys([]);
      }
      this.form = {
        userId: '',
        orgCheckStrictly: true,
        orgIds: [],
        nickName: '',
        dataScope: ''
      };
      this.resetForm("form");
    },
    handleUpdate (row) {
      this.form.dataScope = '2'
      this.openDataScope = true
      this.form.appId = this.queryParams.appId
      let params = {
        appId: this.queryParams.appId,
        userId: row.userId
      }
      userOrgTreeselect(params).then((data) => {
        // const roleOrgTreeselect = data.data
        this.$refs.org.setCheckedKeys(data.data.checkedKeys);
        this.form.nickName = data.data.nickName
        this.form.userId = data.data.userId
      })
    },
    handleExport () {
      this.download('system/org/orgUser/export', {
        ...this.queryParams
      }, `user_${new Date().getTime()}.xlsx`)
    },
    // 确认新增/编辑
    submitDataScope () {
      console.log(this.form)
      this.form.orgIds = this.getOrgAllCheckedKeys();
      this.form.appId = this.queryParams.appId;
      this.form.operType = this.form.dataScope === '1' ? 'add' : 'edit'
      // let params = {
      //   orgIds: this.form.orgIds,
      //   userId: this.form.userId
      // }
      dataScope(this.form).then(response => {
        let str = this.form.dataScope === '1' ? '新增成功' : '修改成功'
        this.$modal.msgSuccess(str);
        this.reset()
        this.openDataScope = false;
        this.getList();
      });
      // this.$refs.ruleForm.validate((valid) => {
      //   if (valid) {
      //   } else {}
      // });
    },
    // 取消新增/编辑
    handleClose () {
      this.reset()
      this.openDataScope = false
    },
    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value, type) {
      let treeList = this.orgOptions;
      for (let i = 0; i < treeList.length; i++) {
        this.$refs.org.store.nodesMap[treeList[i].id].expanded = value;
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value, type) {
      this.$refs.org.setCheckedNodes(value ? this.orgOptions: []);
    },
    handleCheckedTreeConnect () {},
    
  },

  mounted () {
  },

  created () {
    console.log('this.route', this.$route)
    this.queryAppId = this.$route.query.appId
    this.getAppList()
  },
}

</script>
<style lang='scss' scoped>
.scroll {
  height: calc(100vh - 212px);
  width: 270px;
}
.left-content {
  width: 290px;
  padding: 20px 0 20px 20px;
  .search {
    margin-bottom: 10px;
  }
  .el-input {
    height: 32px;
    width: 270px;
    .el-input__inner {
      height: 32px;
      line-height: 32px;
    }
  }
}
.scroll-right {
  height: calc(100vh - 124px);
}
.right-content {
  padding: 20px;
  overflow: hidden;
}
.tree-box {
  padding-bottom: 20px;
}
.el-table {
  margin-top: 8px;
}
</style>