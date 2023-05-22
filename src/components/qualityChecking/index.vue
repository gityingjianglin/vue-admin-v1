<!-- 入库质检 -->
<template>
  <div class="separate-preparation sample-receiving" v-loading="loading">
    <el-form :model="form" ref="form" class="demo-form" label-width="280px" :rules="rules">
      <el-form-item label="样本编码：">
        <div>{{form.cellCode}}</div>
      </el-form-item>
      <el-form-item label="质检开始时间：" prop="enterTestStartdate">
        <el-date-picker
          v-model="form.enterTestStartdate"
          type="datetime"
          :default-time="defaultTime"
          @change="getTime"
          :picker-options="pickerOptions"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="检测项目结果出具时间(客户展示)：" prop="enterTestDate">
        <el-date-picker
          v-model="form.enterTestDate"
          type="datetime"
          :default-time="defaultTime"
          :picker-options="enterTestDateOptions"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="流式细胞检测：" prop="flowResults">
        <el-select v-model="form.flowResults" placeholder="请选择">
          <el-option label="符合" value="符合"></el-option>
          <el-option label="不符合" value="不符合"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="病毒：" prop="virus">
        <el-select v-model="form.virus" placeholder="请选择">
          <el-option label="合格" value="合格"></el-option>
          <el-option label="不合格" value="不合格"></el-option>
          <el-option label="无需检测" value="无需检测"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="微生物：" prop="microbe">
        <el-select v-model="form.microbe" placeholder="请选择">
          <el-option label="合格" value="合格"></el-option>
          <el-option label="不合格" value="不合格"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="支原体：" prop="mycoplasma">
        <el-select v-model="form.mycoplasma" placeholder="请选择">
          <el-option label="合格" value="合格"></el-option>
          <el-option label="不合格" value="不合格"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否通过：" prop="mycoplasma">
        <el-radio v-model="form.isPass" label="是">是</el-radio>
        <el-radio v-model="form.isPass" label="否">否</el-radio>
      </el-form-item>
      <el-form-item label="是否通知用户：">
        <el-radio v-model="form.noticeFlag" label="Y">是</el-radio>
        <el-radio v-model="form.noticeFlag" label="N">否</el-radio>
      </el-form-item>
      <el-form-item label="操作者：" prop="desc">
        <div>{{name}}</div>
      </el-form-item>
    </el-form>
    <!-- <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog> -->
    <div class="btn-box" v-hasPermi="['hbics:enterTest:edit']">
      <el-button type="primary" @click="sumbit">提交</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { enterTestDetail, enterTestEdit } from '@/api/index'
export default {
  data () {
    return {
      dialogVisible: false,
      dialogImageUrl: '',
      form: {
        cellCode: '', // 样本编码
        enterTestStartdate: '', // 质检开始时间
        enterTestDate: '', // 检测项目结果出具时间
        flowResults: '', // 流式细胞检测
        virus: '', // 病毒
        microbe: '', // 微生物
        mycoplasma: '', // 支原体
        isPass: '是' // 是否通过
      },
      rules: {
        enterTestStartdate: [
          { required: true, message: '请选择质检开始时间', trigger: 'blur' }
        ],
        enterTestDate: [
          { required: true, message: '请选择检测项目结果出具时间', trigger: 'blur' }
        ],
        flowResults: [
          { required: true, message: '请选择流式细胞检测', trigger: 'blur' }
        ],
        virus: [
          { required: true, message: '请选择病毒', trigger: 'blur' }
        ],
        microbe: [
          { required: true, message: '请选择微生物', trigger: 'blur' }
        ],
        mycoplasma: [
          { required: true, message: '请选择支原体', trigger: 'blur' }
        ]
      },
      defaultTime: '',
      loading: false,
      hasSave: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        selectableRange: "00:00:00 - 23:59:59"
      },
      enterTestDateOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        selectableRange: "00:00:00 - 23:59:59"
      }
    }
  },
  props: ['masterId'],
  components: {},

  computed: {
    ...mapGetters([
      'name'
    ])
  },

  mounted () {
    
  },

  methods: {
    handlePictureCardPreview () {},
    handleRemove () {},
    getTime (val) {
      console.log(val)
    },
    init () {
      this.loading = true
      enterTestDetail(this.masterId).then((data) => {
        this.loading = false
        if (!data.data.isPass) {
          data.data.isPass = '是'
        }
        // 新增时默认通知用户，编辑时默认不通知用户
        if (data.data.id) {
          this.hasSave = true
          data.data.noticeFlag = 'N'
        } else {
          data.data.noticeFlag = 'Y'
          data.data.flowResults = '符合'
          data.data.virus = '合格'
          data.data.microbe = '合格'
          data.data.mycoplasma = '合格'
        }
        this.form = data.data
      }, () => {
        this.loading = false
      })
    },
    sumbit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          this.form.enterTestStartdate = this.$options.filters['getTime'](this.form.enterTestStartdate, 'yyyy-mm-dd hh:mm:ss')
          this.form.enterTestDate = this.$options.filters['getTime'](this.form.enterTestDate, 'yyyy-mm-dd hh:mm:ss')
          enterTestEdit(this.form).then((data) => {
            this.$modal.msgSuccess('提交成功')
            this.loading = false
            let obj = {
              hasSave: this.hasSave,
              processStat: data.data.processStat,
              id: this.form.id
            }
            this.$emit('editInfo', obj)
          }, () => {
            // this.$modal.msgError('提交失败')
            this.loading = false
          })
        }
      });
    }
  },
  created () {
    this.defaultTime = this.$options.filters['getTime']('', 'hh:00:00')
    console.log(this.defaultTime)
    debugger
    this.init()
  },
  watch: {
    // "form.enterTestStartdate": {
    //   handler(newValue, oldValue) {
    //     if (newValue) {
    //       let date = new Date();
    //       let min = date.getMinutes();
    //       date.setMinutes(min + 1); //这里加1分钟，是为了解决值改变后，系统秒数就过期限制了，无法点击“此刻”按钮， 如果监听 “系统时间”的改变，则会影响性能。
    //       let nowDate = this.$moment(date).format("HH:mm:ss");
    //       let st = "";
    //       if (this.$moment(date).format("yyyy-MM-DD") === this.$moment(newValue).format("yyyy-MM-DD")) {
    //         let hh1 = this.$moment(newValue).format("HH:mm:ss")
    //         if(hh1 > nowDate) {
    //           this.form.enterTestStartdate = new Date();
    //         }
    //         st = nowDate;
    //       } else {
    //         st = "23:59:59";
    //       }
    //       this.pickerOptions.selectableRange = "00:00:00 - " + st;
    //       this.pickerOptions = this.pickerOptions;
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // },
    // "form.enterTestDate": {
    //   handler(newValue, oldValue) {
    //     if (newValue) {
    //       let date = new Date();
    //       let min = date.getMinutes();
    //       date.setMinutes(min + 1); //这里加1分钟，是为了解决值改变后，系统秒数就过期限制了，无法点击“此刻”按钮， 如果监听 “系统时间”的改变，则会影响性能。
    //       let nowDate = this.$moment(date).format("HH:mm:ss");
    //       let st = "";
    //       if (this.$moment(date).format("yyyy-MM-DD") === this.$moment(newValue).format("yyyy-MM-DD")) {
    //         let hh1 = this.$moment(newValue).format("HH:mm:ss")
    //         if(hh1 > nowDate) {
    //           this.form.enterTestDate = new Date();
    //         }
    //         st = nowDate;
    //       } else {
    //         st = "23:59:59";
    //       }
    //       this.pickerOptions.selectableRange = "00:00:00 - " + st;
    //       this.pickerOptions = this.pickerOptions;
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // }
  }
}

</script>
<style lang='scss' scoped>
</style>