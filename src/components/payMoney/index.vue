<!--  -->
<template>
  <div class="pay-money-box sample-receiving">
    <el-form :model="form" ref="form" class="demo-form" label-width="180px">
      <el-form-item label="产品：">
        <div>{{form.productName}}</div>
      </el-form-item>
      <el-form-item label="交易金额（元）：" prop="region">
        <el-input v-model="form.payAmount" :disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="管数：" prop="region">
        <el-input v-model="form.productTubeCount" :disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="交易时间：" prop="region">
        <el-input v-model="form.createTime" :disabled="disabled"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { payDetail } from '@/api/index'
  export default {
  data () {
    return {
      disabled: true,
      form: {}
    };
  },
  props: ['masterId'],
  components: {},

  computed: {},

  mounted () {},

  methods: {
    init () {
      payDetail(this.masterId).then((data) => {
        if (data.data) {
          this.form = data.data
        }
      })
    }
  },
  created () {
    this.init()
  }
}

</script>
<style lang='scss' scoped>
</style>