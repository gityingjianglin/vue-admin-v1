<!--接收 -->
<template>
  <div class="sample-receiving" v-loading="loading">
    <el-form :model="form" ref="form" class="demo-form" label-width="180px" :rules="rules">
      <el-form-item label="采集套装编号：">
        <div>{{form.collectCode}}</div>
      </el-form-item>
      <el-form-item label="样本编码：" prop="cellCode">
        <el-input v-model="form.cellCode"></el-input>
      </el-form-item>
      <el-form-item label="接收时间：" prop="receiveDate">
        <el-date-picker
          v-model="form.receiveDate"
          type="datetime"
          :default-time="defaultTime"
          :picker-options="pickerOptions"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="接收内容：">
        <div>{{form.receiveItems}}</div>
      </el-form-item>
      <el-form-item label="细胞接收机构：">
        <div>{{form.receiveOrg}}</div>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input type="textarea" :rows="2" v-model="form.note"></el-input>
      </el-form-item>
      <el-form-item label="是否通知用户：">
        <el-radio v-model="form.noticeFlag" label="Y">是</el-radio>
        <el-radio v-model="form.noticeFlag" label="N">否</el-radio>
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
      <el-form-item label="操作者：" prop="desc">
        <div>{{name}}</div>
      </el-form-item>
      <el-form-item v-if="form.fileUrl" label="附件：">
        <div class="link" @click="openPdf">查看接收证明</div>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <div class="btn-box" v-hasPermi="['hbics:receive:edit']">
      <el-button type="primary" @click="sumit">提交</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { receiveDetail, receiveEdit, dToken } from '@/api/index'
export default {
  data () {
    return {
      disabled: false,
      form: {},
      dialogImageUrl: '',
      dialogVisible: false,
      rules: {
        cellCode: [
          { required: true, message: '请填写样本编码', trigger: 'blur' }
        ],
        receiveDate: [
          { required: true, message: '请选择接收时间', trigger: 'blur' }
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
      }
    };
  },
  props: ['masterId'],

  components: {},

  computed: {
    ...mapGetters([
      'name'
    ])
  },

  mounted () {},

  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    init () {
      this.loading = true
      receiveDetail(this.masterId).then((data) => {
        this.loading = false
        // 新增时默认通知用户，编辑时默认不通知用户
        if (data.data.id) {
          data.data.noticeFlag = 'N'
        } else {
          data.data.noticeFlag = 'Y'
        }
        this.form = data.data
        console.log(this.form)
        if (data.data.id) {
          this.hasSave = true
        }
      }, () => {
        this.loading = false
      })
    },
    openPdf() {
      dToken().then(data => {
        let fileUrl = this.form.fileUrl + `?dToken=${data.data.dToken}`
        window.open(`${fileUrl}`,'_blank')
      })
    },
    sumit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let index = this.form.cellCode.search(/\d/) + 2
          let yearInput = this.form.cellCode.slice(index, index + 2)
          let nowYear = new Date().getFullYear().toString().slice(2)
          if (yearInput !== nowYear) {
            this.$confirm('样本编码的年份不是当年，是否确认提交？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.sumitInfo()
            })
          } else {
            this.sumitInfo()
          }
        }
      });
    },
    sumitInfo () {
      this.loading = true
          this.form.receiveDate = this.$options.filters['getTime'](this.form.receiveDate, 'yyyy-mm-dd hh:mm:ss')
          receiveEdit(this.form).then((data) => {
            this.$modal.msgSuccess('提交成功')
            this.loading = false
            let obj = {
              hasSave: this.hasSave,
              processStat: data.data.processStat,
              id: this.form.id,
              type: 'sampleReceving',
              cellCode: this.form.cellCode
            }
            this.$emit('editInfo', obj)
          }, () => {
            // this.$modal.msgError('提交失败')
            this.loading = false
          })
    }
  },
  created () {
    this.defaultTime = this.$options.filters['getTime']('', 'hh:00:00')
    console.log(this.defaultTime)
    debugger
    this.init()
  },
  watch: {
    // "form.receiveDate": {
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
    //           this.form.receiveDate = new Date();
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
.link {
  cursor: pointer;
  color: #1A7BF3;
}
</style>