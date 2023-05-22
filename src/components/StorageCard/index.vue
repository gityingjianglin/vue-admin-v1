<!-- 存储证 -->
<template>
  <div class="storage-card contract-box" v-loading="loading">
    <el-form :model="form" ref="form" class="demo-form" label-width="180px" :rules="rules">
      <div class="h-view align-center flex-wrap">
        <el-form-item label="标题：">
          <el-input v-model="form.title" disabled></el-input>
        </el-form-item>
        <el-form-item label="样本编码：">
          <el-input v-model="form.cellCode" disabled></el-input>
        </el-form-item>
        <el-form-item label="颁证日期：">
          <el-input v-model="form.createDate" disabled></el-input>
        </el-form-item>
        <el-form-item label="颁证单位：">
          <el-input v-model="form.companyName" disabled></el-input>
        </el-form-item>
        <el-form-item v-if="form.fileUrl" label="附件：">
          <div class="link" @click="openPdf">查看存储证</div>
        </el-form-item>
        <el-form-item label="是否通知用户：">
          <el-radio v-model="form.noticeFlag" label="Y">是</el-radio>
          <el-radio v-model="form.noticeFlag" label="N">否</el-radio>
        </el-form-item>
      </div>
      <div v-if="form.bizType === 'MSCs' || form.bizType === 'PSC'">
        <div class="title-box">婴儿信息</div>
        <div class="h-view align-center flex-wrap">
          <el-form-item label="姓名：" prop="babyName">
            <el-input v-model="form.babyName" :disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="性别：" prop="babySex">
            <el-select v-model="form.babySex" placeholder="请选择" :disabled="disabled">
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出生日期：" prop="babyBirth">
            <el-date-picker
              v-model="form.babyBirth"
              type="date"
              placeholder="选择日期" :disabled="disabled">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="出生医院：" prop="babyHospital">
            <el-input v-model="form.babyHospital" :disabled="disabled"></el-input>
          </el-form-item>
        </div>
        <div class="title-box">家庭信息</div>
        <div class="h-view align-center flex-wrap">
          <el-form-item label="母亲姓名：" prop="maternalName">
            <el-input v-model="form.maternalName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="母亲证件号码：" prop="maternalIdCard">
            <el-input v-model="form.maternalIdCard" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="联系电话：" prop="maternalPhoneNumber">
            <el-input v-model="form.maternalPhoneNumber" :disabled="true"></el-input>
          </el-form-item>
        </div>
        <div class="h-view align-center flex-wrap">
          <el-form-item label="父亲姓名：">
            <el-input v-model="form.fatherName" :disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="父亲证件号码：">
            <el-input v-model="form.fatherIdCard" :disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="联系电话：">
            <el-input v-model="form.fatherPhoneNumber" :disabled="disabled"></el-input>
          </el-form-item>
        </div>
      </div>
      <div v-else>
        <div class="title-box">客户信息</div>
        <div class="h-view align-center flex-wrap">
          <el-form-item label="姓名：" prop="name">
            <el-input v-model="form.name" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="证件号码：" prop="idCard">
            <el-input v-model="form.idCard" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="联系电话：" prop="phone">
            <el-input v-model="form.phone" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="家庭住址：" prop="address">
            <el-input v-model="form.address" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="存储合同编号：" prop="contractCode">
            <el-input v-model="form.contractCode" :disabled="true"></el-input>
          </el-form-item>
        </div>
      </div>
      <div>
        <div class="title-box">检测结果</div>
        <div class="h-view align-center flex-wrap">
          <el-form-item label="乙型肝炎病毒表面抗原：" prop="hbsAg">
            <el-select v-model="form.hbsAg" placeholder="请选择" :disabled="disabled">
              <el-option
                v-for="item in kangtiList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="丙型肝炎病毒抗体：" prop="hcvAb">
            <el-select v-model="form.hcvAb" placeholder="请选择" :disabled="disabled">
              <el-option
                v-for="item in kangtiList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="人类免疫缺陷病毒抗体：" prop="hivAb">
            <el-select v-model="form.hivAb" placeholder="请选择" :disabled="disabled">
              <el-option
                v-for="item in kangtiList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 围产期展示 -->
          <el-form-item label="巨细胞病毒抗体：" prop="cmvAb" v-if="form.bizType !== 'PBMC' && form.bizType !== 'DIKK'">
            <el-select v-model="form.cmvAb" placeholder="请选择" :disabled="disabled">
              <el-option
                v-for="item in kangtiList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="梅毒螺旋体抗体：" prop="tpAb">
            <el-select v-model="form.tpAb" placeholder="请选择" :disabled="disabled">
              <el-option
                v-for="item in kangtiList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="丙氨酸氨基转移酶：" prop="alt">
            <el-select v-model="form.alt" placeholder="请选择" :disabled="disabled">
              <el-option label="符合规定" value="符合规定"></el-option>
              <el-option label="不符合规定" value="不符合规定"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="需氧菌培养：" prop="aerobe">
            <el-select v-model="form.aerobe" placeholder="请选择" :disabled="disabled">
              <el-option
                v-for="item in kangtiList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="厌氧菌培养：" prop="anaerobion">
            <el-select v-model="form.anaerobion" placeholder="请选择" :disabled="disabled">
              <el-option
                v-for="item in kangtiList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="支原体：" prop="mycoplasma">
            <el-select v-model="form.mycoplasma" placeholder="请选择" :disabled="disabled">
              <el-option label="合格" value="合格"></el-option>
              <el-option label="不合格" value="不合格"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="细胞活率：" class="cell-box" prop="vitality">
            <el-input v-model="form.vitality" :disabled="true"></el-input>%
          </el-form-item>
          <el-form-item label="细胞表面标志：" prop="surfaceMarker">
            <el-select v-model="form.surfaceMarker" placeholder="请选择" :disabled="disabled">
              <el-option
                v-for="item in surfaceMarkerList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div class="btn-box" v-hasPermi="['hbics:saveDocument:edit']">
      <el-button type="primary" @click="submit">提交</el-button>
    </div>
  </div>
</template>

<script>
import { saveDocumentDetail, saveDocumentEdit, dToken } from '@/api/index'
import {parseTime} from '@/utils/ruoyi'
export default {
  data () {
    return {
      form: {},
      defaultInfo: {
        hbsAg: '阴性',
        hcvAb: '阴性',
        hivAb: '阴性',
        cmvAb: '阴性',
        tpAb: '阴性',
        alt: '符合规定',
        aerobe: '阴性',
        anaerobion: '阴性',
        mycoplasma: '合格'
      },
      kangtiList: [
        {
          label: '阴性',
          value: '阴性'
        },
        {
          label: '阳性',
          value: '阳性'
        }
      ],
      rules: {
        babyName: [
          { required: true, message: '请填写婴儿姓名', trigger: 'blur' }
        ],
        babySex: [
          { required: true, message: '请选择婴儿性别', trigger: 'blur' }
        ],
        babyBirth: [
          { required: true, message: '请填写婴儿出生日期', trigger: 'blur' }
        ],
        babyHospital: [
          { required: true, message: '请填写婴儿出生医院', trigger: 'blur' }
        ],
        maternalName: [
          { required: true, message: '请填写母亲姓名', trigger: 'blur' }
        ],
        maternalIdCard: [
          { required: true, message: '请填写母亲证件号码', trigger: 'blur' }
        ],
        maternalPhoneNumber: [
          { required: true, message: '请填写联系电话', trigger: 'blur' },
          { pattern: /^1[3|4|5|6|7|8|9]\d{9}$/, message: '请填写正确格式的联系电话', trigger: ['blur', 'change'] }
        ],
        fatherPhoneNumber: [
          { required: true, pattern: /^1[3|4|5|6|7|8|9]\d{9}$/, message: '请填写正确格式的联系电话', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请填写姓名', trigger: 'blur' }
        ],
        idCard: [
          { required: true, message: '请填写证件号码', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请填写联系电话', trigger: 'blur' },
          { pattern: /^1[3|4|5|6|7|8|9]\d{9}$/, message: '请填写正确格式的联系电话', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请填写家庭住址', trigger: 'blur' }
        ],
        contractCode: [
          { required: true, message: '请填写存储合同编号', trigger: 'blur' }
        ],
        hbsAg: [
          { required: true, message: '请选择乙型肝炎病毒表面抗原', trigger: 'blur' }
        ],
        hcvAb: [
          { required: true, message: '请选择丙型肝炎病毒抗体', trigger: 'blur' }
        ],
        hivAb: [
          { required: true, message: '请选择人类免疫缺陷病毒抗体', trigger: 'blur' }
        ],
        cmvAb: [
          { required: true, message: '请选择巨细胞病毒抗体', trigger: 'blur' }
        ],
        tpAb: [
          { required: true, message: '请选择梅毒螺旋体抗体', trigger: 'blur' }
        ],
        alt: [
          { required: true, message: '请选择丙氨酸氨基转移酶', trigger: 'blur' }
        ],
        aerobe: [
          { required: true, message: '请选择需氧菌培养', trigger: 'blur' }
        ],
        anaerobion: [
          { required: true, message: '请选择厌氧菌培养', trigger: 'blur' }
        ],
        mycoplasma: [
          { required: true, message: '请选择支原体', trigger: 'blur' }
        ],
        surfaceMarker: [
          { required: true, message: '请选择细胞表面标志', trigger: 'blur' }
        ],
        vitality: [
          { required: true, message: '请填写细胞活率', trigger: 'blur' }
        ]
      },
      surfaceMarkerList: [],
      loading: false,
      cellType: {
        MSCs: '脐带源干细胞存储证书',
        PSC: '胎盘干细胞存储证书',
        PBMC: '免疫细胞存储证书',
        ADSC: '脂肪干细胞存储证书',
        DIKK: '双K细胞存储证书'
      },
      disabled: false
    };
  },
  props: ['masterId'],
  components: {},

  computed: {},

  mounted () {},

  methods: {
    init () {
      this.loading = true
      saveDocumentDetail(this.masterId).then((data) => {
        this.loading = false
        if (!data.data.title) {
          data.data.title = this.cellType[data.data.bizType]
        }
        /* if (data.data.id) {
          this.disabled = true
        } */
        // 新增时默认通知用户，编辑时默认不通知用户
        if (data.data.id) {
          data.data.noticeFlag = 'N'
        } else {
          data.data.noticeFlag = 'Y'
        }
        this.form = data.data
        this.form = {
          ...data.data,
          ...this.defaultInfo
        }
        console.log(this.form)
        switch (data.data.bizType) {
          case 'MSCs':
          case 'PSC':
            // 围产期
            this.surfaceMarkerList = [
              {
                value: '符合间充质干细胞表型特点',
                label: '符合间充质干细胞表型特点'
              },
              {
                value: '不符合间充质干细胞表型特点',
                label: '不符合间充质干细胞表型特点'
              }
            ]
            this.form.surfaceMarker = '符合间充质干细胞表型特点'
            break
          case 'PBMC':
            // 免疫
            this.surfaceMarkerList = [
              {
                value: '符合免疫细胞表型特点',
                label: '符合免疫细胞表型特点'
              },
              {
                value: '不符合免疫细胞表型特点',
                label: '不符合免疫细胞表型特点'
              }
            ]
            this.form.surfaceMarker = '符合免疫细胞表型特点'
            break
          case 'ADSC':
            // 脂肪
            this.surfaceMarkerList = [
              {
                value: '符合间充质干细胞表型特点',
                label: '符合间充质干细胞表型特点'
              },
              {
                value: '不符合间充质干细胞表型特点',
                label: '不符合间充质干细胞表型特点'
              }
            ]
            this.form.surfaceMarker = '符合间充质干细胞表型特点'
            break
          case 'DIKK':
            // 双K细胞
          this.surfaceMarkerList = [
            {
              value: '符合双K细胞表型特点',
              label: '符合双K细胞表型特点'
            },
            {
              value: '不符合双K细胞表型特点',
              label: '不符合双K细胞表型特点'
            }
          ]
          this.form.surfaceMarker = '符合双K细胞表型特点'
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
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.fatherPhoneNumber) {
            let reg = /^1[3|4|5|6|7|8|9]\d{9}$/
            if (!reg.test(this.form.fatherPhoneNumber)) {
              this.$message({
                message: '请填写正确格式的父亲联系电话',
                type: 'warning'
              });
              return
            }
          }
          if ((this.form.bizType === 'MSCs' || this.form.bizType === 'PSC') && (!this.form.fatherName || !this.form.fatherIdCard || !this.form.fatherPhoneNumber)) {
            this.$confirm('父亲信息未填写完整，确认提交吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.submitInfo()
            })
          } else {
            this.submitInfo()
          }
        }
      });
    },
    submitInfo () {
      this.loading = true
      this.form.babyBirth = parseTime(this.form.babyBirth)
      saveDocumentEdit(this.form).then((data) => {
        this.loading = false
        this.$modal.msgSuccess('提交成功')
        // let obj = {
        //   hasSave: this.hasSave,
        //   processStat: data.data.processStat,
        //   id: this.form.id
        // }
        // this.$emit('editInfo', obj)
        this.init()
      }, () => {
        // this.$modal.msgError('提交失败')
        this.loading = false
      })
    }
  },
  created () {
    this.init()
  }
}

</script>
<style lang='scss' scoped>
  .title-box {
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    font-weight: bold;
  }
  .link {
    width: 230px;
    cursor: pointer;
    color: #1A7BF3;
  }
</style>