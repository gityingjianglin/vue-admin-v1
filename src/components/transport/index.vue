<!--  -->
<template>
  <div class="transport sample-receiving" v-loading="loading">
    <el-form :model="form" ref="form" class="demo-form" label-width="180px" :rules="rules">
      <el-form-item label="业务类型：" prop="region">
        <el-input v-model="form.bizName" disabled></el-input>
      </el-form-item>
      <el-form-item label="冷运时间：" prop="transportDate">
        <!-- <el-input v-model="form.transportDate" ></el-input> -->
        <el-date-picker
          v-model="form.transportDate"
          type="datetime"
          :default-time="defaultTime"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="接收机构：" prop="org">
        <!-- <el-input v-model="form.org" ></el-input> -->
        <el-select
          v-model="form.org"
          placeholder="请选择样本接收机构"
          clearable
          filterable
         
        >
          <el-option
            v-for="item in sampleList"
            :key="item.orgName"
            :label="item.orgName"
            :value="item.orgName"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="采集套装编码：" prop="code">
        <el-input v-model="form.code" disabled></el-input>
      </el-form-item> -->
      <div v-for="(item, index) in form.collectInfoList" :key="index">
        <div class="biz-name" v-show="item.bizName">{{item.bizName}}</div>
        <el-form-item label="采集套装编码："
        :prop="'collectInfoList.' + index + '.collectCode'"
        :rules="{ required: true, message: '请填写采集套装编码', trigger: 'blur' }">
          <el-input v-model="item.collectCode" ></el-input>
        </el-form-item>
        <el-form-item label="采集内容："
        :prop="'collectInfoList.' + index + '.collectData'"
        :rules="{ required: true, message: '请填写采集内容', trigger: 'blur' }" >
          <el-input v-model="item.collectData" ></el-input>
        </el-form-item>
      </div>
      <!-- <div>
        <el-form-item label="采集套装编码-脐带：" prop="code">
          <el-input v-model="form.code" disabled></el-input>
        </el-form-item>
        <el-form-item label="脐带采集内容：" prop="code">
          <el-input v-model="form.code" disabled></el-input>
        </el-form-item>
      </div> -->
      <!-- <el-form-item label="采集内容：">
        <el-input v-model="form.code" disabled></el-input>
      </el-form-item> -->
      <el-form-item label="采集温度(℃)：" prop="saveTemperature">
        <el-input v-model="form.saveTemperature" ></el-input>
      </el-form-item>
      <el-form-item label="接收人：" prop="receiveName">
        <el-input v-model="form.receiveName" ></el-input>
      </el-form-item>
    </el-form>
    <div class="btn-box" v-hasPermi="['hbics:transport:edit']" v-if="form.id">
      <el-button type="primary" @click="sumbit">提交</el-button>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { transportDetail, transportEdit } from '@/api/index'
  export default {
  data () {
    return {
      form: {},
      rules: {
        transportDate: [
          { required: true, message: '请选择冷运时间', trigger: 'blur' }
        ],
        collectData: [
          { required: true, message: '请填写采集内容', trigger: 'blur' }
        ],
        collectCode: [
          { required: true, message: '请填写采集套装编码', trigger: 'blur' }
        ],
        saveTemperature: [
          { required: true, message: '请填写采集温度', trigger: 'blur' }
        ],
        receiveName: [
          { required: true, message: '请填写接收人', trigger: 'blur' }
        ]
      },
      defaultTime: '',
      loading: false
    };
  },
  props: ['masterId'],
  components: {},

  computed: {
    ...mapGetters([
      'name',
      'sampleList'
    ])
  },

  mounted () {},

  methods: {
    init () {
      this.loading = true
      transportDetail(this.masterId).then((data) => {
        this.loading = false
        this.form = data.data
      }, () => {
        this.loading = false
      })
    },
    // 提交事件
    sumbit(){
      this.$refs.form.validate((valid) => {
        console.log(this.$options.filters['getTime'](this.form.transportDate, 'yyyy-mm-dd hh:mm:ss'), 'this.form');
        this.form.transportDate = this.$options.filters['getTime'](this.form.transportDate, 'yyyy-mm-dd hh:mm:ss')
        if (valid) {
          console.log(this.form, 'this.form');
          transportEdit(this.form).then(res => {
            console.log(res, 'res45645566');
            if (res.code === 200) {
              this.$modal.msgSuccess('提交成功')
              // this.init()
              let obj = {
              processStat: res.data.processStat,
              id: this.form.id,
              type: 'transport',
              collectInfoList: this.form.collectInfoList
            }
            this.$emit('editInfo', obj)
            }
          })
        }
        
      })
    }
  },
  created () {
    this.defaultTime = this.$options.filters['getTime']('', 'hh:00:00')
    console.log(this.defaultTime)
    this.init()
  }
}

</script>
<style lang='scss' scoped>
  .biz-name {
    width: 180px;
    height: 30px;
    line-height: 30px;
    font-size: 20px;
  }
</style>