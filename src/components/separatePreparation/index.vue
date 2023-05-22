<!-- 分离制备 -->
<template>
  <div class="separate-preparation sample-receiving" v-loading="loading">
    <el-form :model="form" ref="form" class="demo-form" label-width="180px" :rules="rules">
      <el-form-item label="样本编码：">
        <div>{{form.cellCode}}</div>
      </el-form-item>
      <el-form-item label="分离开始时间：" prop="separateTime">
        <el-date-picker
          v-model="form.separateTime"
          type="datetime"
          :default-time="defaultTime"
          :picker-options="pickerOptions"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="收获时间(客户展示)：" prop="receivingTime">
        <el-date-picker
          v-model="form.receivingTime"
          type="datetime"
          :default-time="defaultTime"
          :picker-options="receivingTimeOptions"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="细胞数：" prop="cellData" class="separate-preparation-form">
        <el-input :maxlength="9" v-model="form.cellData" onkeyup="this.value=this.value.match(/\d+(\.\d{0,3})?/) ? this.value.match(/\d+(\.\d{0,3})?/)[0] : ''" @blur="changeData('cell')"></el-input>亿
      </el-form-item>
      <el-form-item label="活力：" prop="vitality" class="separate-preparation-form">
        <el-input :maxlength="6" onkeyup="this.value=this.value.match(/\d+(\.\d{0,3})?/) ? this.value.match(/\d+(\.\d{0,3})?/)[0] : ''" v-model="form.vitality" @blur="changeData('vitality')"></el-input>%
      </el-form-item>
      <el-form-item v-if="form.bizType !== 'DIKK'" label="管数：" prop="saveData" class="separate-preparation-form">
        <el-input v-model="form.saveData" onkeyup="this.value=this.value.replace(/\D/g,'')"  :maxlength="2" @blur="changeData('saveData')"></el-input>管
      </el-form-item>
      <el-form-item v-else label="位置：" prop="saveData" class="separate-preparation-form">
        {{form.saveData}}
        <!-- <el-input v-model="form.saveData" onkeyup="this.value=this.value.replace(/\D/g,'')"  :maxlength="2" @blur="changeData('saveData')"></el-input> -->
      </el-form-item>
      
      <!-- <el-form-item label="上传图片：" prop="desc">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item> -->
      <el-form-item label="是否通知用户：">
        <el-radio v-model="form.noticeFlag" label="Y">是</el-radio>
        <el-radio v-model="form.noticeFlag" label="N">否</el-radio>
      </el-form-item>
      <el-form-item label="操作者：" prop="desc">
        <div>{{name}}</div>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <div class="btn-box" v-hasPermi="['hbics:separate:edit']">
      <el-button type="primary" @click="sumit">提交</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { separateDetail, separateEdit } from '@/api/index'
export default {
  data () {
    return {
      dialogVisible: false,
      dialogImageUrl: '',
      form: {
      },
      rules: {
        separateTime: [
          { required: true, message: '请选择分离开始时间', trigger: 'blur' }
        ],
        receivingTime: [
          { required: true, message: '请选择收获时间', trigger: 'blur' }
        ],
        cellData: [
          { required: true, message: '请填写细胞数', trigger: 'blur' }
        ],
        vitality: [
          { required: true, message: '请填写活力', trigger: 'blur' }
        ],
        saveData: [
          { required: true, message: '请填写管数', trigger: 'blur' }
        ]
      },
      defaultTime: '',
      loading: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        selectableRange: "00:00:00 - 23:59:59"
      },
      receivingTimeOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        selectableRange: "00:00:00 - 23:59:59"
      },
    };
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
    // getTime (val) {
    //   console.log(val)
    // },
    changeData (type) {
      switch (type) {
        case 'cell':
          if (this.form.cellData) {
            this.form.cellData = this.form.cellData.match(/\d+(\.\d{0,3})?/)[0]
          }
          break
        case 'vitality':
          if (this.form.vitality) {
            this.form.vitality = this.form.vitality.match(/\d+(\.\d{0,3})?/)[0]
          }
          break
        case 'saveData':
          if (this.form.saveData && this.form.saveData > 30) {
            this.$message({
              message: '管数不能大于30',
              type: 'warning'
            });
            this.form.saveData = ''
          }
      }
    },
    init () {
      this.loading = true
      separateDetail(this.masterId).then((data) => {
        this.loading = false
        // 新增时默认通知用户，编辑时默认不通知用户
        if (data.data.id) {
          data.data.noticeFlag = 'N'
        } else {
          data.data.noticeFlag = 'Y'
        }
        this.form = data.data
      }, () => {
        this.loading = false
      })
    },
    sumit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          this.form.separateTime = this.$options.filters['getTime'](this.form.separateTime, 'yyyy-mm-dd hh:mm:ss')
          this.form.receivingTime = this.$options.filters['getTime'](this.form.receivingTime, 'yyyy-mm-dd hh:mm:ss')
          separateEdit(this.form).then((data) => {
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
    // "form.separateTime": {
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
    //           this.form.separateTime = new Date();
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
    //   immediate: true,
    // },
    // "form.receivingTime": {
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
    //           this.form.receivingTime = new Date();
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
    //   immediate: true,
    // }
  }
}

</script>
<style lang='scss' scoped>
  .separate-preparation-form {
    .el-input {
      width: 270px!important;
      margin-right: 10px;
      display: inline-block;
    }
  }
</style>