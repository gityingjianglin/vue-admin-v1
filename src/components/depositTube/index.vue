<!-- 存管 -->
<template>
  <div class="separate-preparation sample-receiving" v-loading="loading">
    <el-form :model="form" ref="form" class="demo-form" label-width="180px" :rules="rules">
      <el-form-item label="样本编码：">
        <div>{{form.cellCode}}</div>
      </el-form-item>
      <el-form-item label="入库时间：" prop="enterSaveDate">
        <el-date-picker
          v-model="form.enterSaveDate"
          type="datetime"
          :default-time="defaultTime"
          :picker-options="pickerOptions"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="存储信息：" class="npot-location-box">
        <div class="has-use" v-show="form.id">已使用</div>
      </el-form-item>
      <el-form-item label="1号液氮罐：" class="npot-location-box">
        <div class="npot-location-content" v-if="!form.id">
          <div class="h-view align-center npot-location" v-for="(item, index) in firstNpotLocationArr" :key="index">
            <span>位置{{(index + 1)}}：</span>
            <el-input v-model="firstNpotLocationArr[index]" @blur="handleInputConfirm(firstNpotLocationArr[index])" clearable></el-input>
            <i class="el-icon-error" @click="deleteItem(0, index)"></i>
          </div>
          <div class="add-btn h-view align-cente justify-center" @click="addNpot(1)">
            <i class="el-icon-plus"></i>
            增加
          </div>
        </div>
        <div class="npot-location-content" v-else>
          <div class="h-view align-center npot-location" v-for="(item, index) in form.potLocationList[0].tubeLocationList" :key="index">
            <span>位置{{(index + 1)}}：</span>
            <el-input v-model="item.location" @blur="handleInputConfirm(item.location)"></el-input>
            <span v-if="item.id" class="el-checkbox__input" :class="{'is-checked': item.isUse === '1'}" @click="choose(0, index)">
              <span class="el-checkbox__inner"></span>
            </span>
            <i v-else class="el-icon-error" @click="deleteItem(0, index,'edit')"></i>
          </div>
          <div class="add-btn h-view align-cente justify-center" @click="addNpot(0,'edit')">
            <i class="el-icon-plus"></i>
            增加
          </div>
        </div>
      </el-form-item>
      <el-form-item label="2号液氮罐：" class="npot-location-box">
        <div class="npot-location-content" v-if="!form.id">
          <div class="h-view align-center npot-location" v-for="(item, index) in secondNpotLocationArr" :key="index">
            <span>位置{{(index + 1)}}：</span>
            <el-input v-model="secondNpotLocationArr[index]"  @blur="handleInputConfirm(secondNpotLocationArr[index])"></el-input>
            <i class="el-icon-error" @click="deleteItem(1, index)"></i>
          </div>
          <div class="add-btn h-view align-cente justify-center" @click="addNpot(2)">
            <i class="el-icon-plus"></i>
            增加
          </div>
        </div>
        <div class="npot-location-content" v-else>
          <div class="h-view align-center npot-location" v-for="(item, index) in form.potLocationList[1].tubeLocationList" :key="index">
            <span>位置{{(index + 1)}}：</span>
            <el-input v-model="item.location" @blur="handleInputConfirm(item.location)"></el-input>
            <span v-if="item.id" class="el-checkbox__input" :class="{'is-checked': item.isUse === '1'}" @click="choose(1, index)">
              <span class="el-checkbox__inner"></span>
            </span>
            <i v-else class="el-icon-error" @click="deleteItem(1, index,'edit')"></i>
          </div>
          <div class="add-btn h-view align-cente justify-center" @click="addNpot(1,'edit')">
            <i class="el-icon-plus"></i>
            增加
          </div>
        </div>
      </el-form-item>
      <el-form-item label="是否通过：">
        <el-radio v-model="form.isPass" label="是">是</el-radio>
        <el-radio v-model="form.isPass" label="否">否</el-radio>
      </el-form-item>
      <el-form-item label="是否通知用户：">
        <el-radio v-model="form.noticeFlag" label="Y">是</el-radio>
        <el-radio v-model="form.noticeFlag" label="N">否</el-radio>
      </el-form-item>
      <!-- <el-form-item label="上传图片：">
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
    </el-form>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <div class="btn-box" v-hasPermi="['hbics:enterSave:edit']">
      <el-button type="primary" @click="sumit">提交</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { enterSaveDetail, enterSaveEdit } from '@/api/index'
export default {
  data () {
    return {
      dialogVisible: false,
      dialogImageUrl: '',
      form: {
        enterSaveDate: '',
        isPass: '是'
      },
      rules: {
        enterSaveDate: [
          { required: true, message: '请选择入库时间', trigger: 'blur'}
        ]
      },
      defaultTime: '',
      firstNpotLocationArr: [],
      secondNpotLocationArr: [],
      num: 0,
      loading: false,
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

  mounted () {
    
  },

  methods: {
    handlePictureCardPreview () {},
    handleRemove () {},
    init () {
      this.loading = true
      enterSaveDetail(this.masterId).then((data) => {
        this.loading = false
        if (!data.data.isPass) {
          data.data.isPass = '是'
        }
        // 新增时默认通知用户，编辑时默认不通知用户
        if (data.data.id) {
          data.data.noticeFlag = 'N'
        } else {
          data.data.noticeFlag = 'Y'
        }
        this.form = data.data
        this.num = data.data.productTubeCount
        if (!data.data.id) {
          let num1 = Math.ceil(this.num / 2)
          let num2 = Math.floor(this.num / 2)
          let arr1 = []
          let arr2 = []
          for (let i = 0; i < num1; i++) {
            arr1.push('')
          }
          for (let i = 0; i < num2; i++) {
            arr2.push('')
          }
          this.firstNpotLocationArr = arr1
          this.secondNpotLocationArr = arr2
        }
      }, () => {
        this.loading = false
      })
    },
    choose (num, i) {
      this.$set(this.form.potLocationList[num].tubeLocationList[i], 'isUse', this.form.potLocationList[num].tubeLocationList[i].isUse === '1' ? '0' : '1')
    },
    deleteItem (num, index,type) {
      if(type === 'edit') {
        this.form.potLocationList[num].tubeLocationList.splice(index,1)
      } else {
        if (num === 0) {
          this.firstNpotLocationArr.splice(index, 1)
        } else {
          this.secondNpotLocationArr.splice(index, 1)
        }
      }
    },
    handleInputConfirm (val, num, index) { // 位置验证
      // let reg15 = new RegExp("[0-9][0-9]-0[1-6]-0[1-8]-([0][1-9]|[1][0-4])-(([A-J]([1-9]|10)$)|(((0?[1-9])|((1|2|3|4|5|6|7|8|9)[0-9])|100)$))")
      console.log(this.form.locationReg, 'this.form.locationReg');
      let reg15 = new RegExp(this.form.locationReg)
      if(val instanceof Object) {
        val = val.location
      }
      if (val) {
        let str = '请输入正确的液氮罐格式'
        if (num) {
          str = `${num}号罐位置${index + 1}请输入正确的液氮罐格式`
        }
        console.log(!reg15.test(val), '!reg15.test(val)');
        if (!reg15.test(val)) {
          this.$message({
            message: str,
            type: 'warning'
          });
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    },
    addNpot (num,type) { // 点击新增添加管
      if(type === 'edit') {
        if (!Array.isArray(this.form.potLocationList[num].tubeLocationList)) { 
          this.form.potLocationList[num].tubeLocationList = new Array()
        }
        this.form.potLocationList[num].tubeLocationList.push({id:null,location: '',isUse: '0'})
      } else {
        if (num === 1) {
          this.firstNpotLocationArr.push('')
        } else {
          this.secondNpotLocationArr.push('')
        }
      }
    },
    sumit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.form.enterSaveDate = this.$options.filters['getTime'](this.form.enterSaveDate, 'yyyy-mm-dd hh:mm:ss')
          let isRight = true
          let isOneHave = false
          let isTwoHave = false
          // 编辑模式
          if(this.form.id) {
            this.firstNpotLocationArr = this.form.potLocationList[0].tubeLocationList || []
            this.secondNpotLocationArr = this.form.potLocationList[1].tubeLocationList || []
          }
          if (this.firstNpotLocationArr.length === 0 && this.secondNpotLocationArr.length === 0) {
            this.$message({
              message: '请输入液氮罐位置',
              type: 'warning'
            });
            return
          }
          // if (this.secondNpotLocationArr.length === 0) {
          //   this.$message({
          //     message: '请输入2号液氮罐位置',
          //     type: 'warning'
          //   });
          //   return
          // }
          for (let i = 0, length = this.firstNpotLocationArr.length; i < length; i++) {
            if (this.firstNpotLocationArr[i]) {
              isOneHave = true
              isRight = this.handleInputConfirm(this.firstNpotLocationArr[i], 1, i)
              console.log(isRight)
              if (!isRight) {
                return
              }
            }
          }
          for (let i = 0, length = this.secondNpotLocationArr.length; i < length; i++) {
            if (this.secondNpotLocationArr[i]) {
              isTwoHave = true
              isRight = this.handleInputConfirm(this.secondNpotLocationArr[i], 2, i)
              if (!isRight) {
                return
              }
            }
          }
          if (!isOneHave && !isTwoHave) {
            this.$message({
              message: '请输入液氮罐位置',
              type: 'warning'
            });
            return
          }
          if (!this.form.id) {
            this.form.potLocationList = [
              {
                id: '',
                npotLocation: '',
                tubeLocationList: []
              },
              {
                id: '',
                npotLocation: '',
                tubeLocationList: []
              }
            ]
            this.firstNpotLocationArr.forEach((item) => {
              if (item) {
                this.form.potLocationList[0].tubeLocationList.push({
                  id: '',
                  isUse: '',
                  location: item
                })
              }
            })
            this.secondNpotLocationArr.forEach((item) => {
              if (item) {
                this.form.potLocationList[1].tubeLocationList.push({
                  id: '',
                  isUse: '',
                  location: item
                })
              }
            })
          }
          //  
          let num = 0
          this.form.potLocationList[0].tubeLocationList.forEach(el => {
            if(el.location) {
              num++
            }
          })
          this.form.potLocationList[1].tubeLocationList.forEach(el => {
            if(el.location) {
              num++
            }
          })
          // let num = this.form.potLocationList[0].tubeLocationList.length + this.form.potLocationList[1].tubeLocationList.length
          console.log(this.form.potLocationList[0].tubeLocationList, '555555',this.form.potLocationList[1].tubeLocationList);
          debugger
          console.log(this.num);
          if (num < this.num) {
            this.$confirm('录入存管位置与管数不一致，是否提交？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.sumitInfo()
            })
          } else if (num > this.num) {

            this.$message({
              message: '液氮罐数量不能超过管数',
              type: 'warning'
            });
          } else {
            this.sumitInfo()
          }
        }
      });
    },
    sumitInfo () {
      this.loading = true
      enterSaveEdit(this.form).then((data) => {
        this.loading = false
        this.$modal.msgSuccess('提交成功')
        let obj = {
          hasSave: this.hasSave,
          processStat: data.data.processStat,
          id: this.form.id
        }
        this.init()
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
    // "form.enterSaveDate": {
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
    //           this.form.enterSaveDate = new Date();
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

  .npot-location-content {
    .npot-location {
      margin-bottom: 10px;
      &:last-child {
        margin-bottom: 0;
      }
      span {
        width: 60px;
      }
      .el-input {
        width: 240px!important;
      }
      .el-icon-error {
        margin-left: 10px;
        font-size: 20px;
        cursor: pointer;
        color: #3e3e3e;
      }
    }
  }
  .add-btn {
    width: 70px;
    height: 32px;
    font-size: 16px;
    cursor: pointer;
    border: 1px dashed #d9d9d9;
    .el-icon-plus {
      margin-right: 4px;
      line-height: 32px;
    }
  }
  .el-checkbox__input {
    margin-left: 10px;
    white-space: nowrap;
    cursor: pointer;
    outline: none;
    display: inline-block;
    line-height: 1;
    position: relative;
    vertical-align: middle;
  }
  .el-checkbox__inner {
    width: 14px!important;
    height: 14px;
  }
  .has-use {
    margin-left: 300px;
  }
</style>