<template>
  <div class="addBrand-container">
    <HeadLable :title="title"
               :goback="true"
    />
    <div class="container">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="账号:" prop="username">
          <el-input v-model="ruleForm.username" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="员工姓名:" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" prop="phone">
          <el-input v-model="ruleForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="性别:" prop="sex">
          <el-radio-group v-model="ruleForm.sex">
            <el-radio label="1">男</el-radio>
            <el-radio label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="身份证号" prop="idNumber">
          <el-input v-model="ruleForm.idNumber"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitFormAgain('ruleForm',false)">保存</el-button>
          <el-button
            v-if="this.optType === 'add'"
            type="primary"
            @click="submitFormAgain('ruleForm',true)">保存并继续添加员工
          </el-button>
          <el-button @click="() => this.$router.push('/employee')">返回</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script lang="ts">

import { addEmployee } from '@/api/employee'

export default {
  data() {
    return {
      optType: 'add',
      ruleForm: {
        username: '',
        name: '',
        sex: '1',
        phone: '',
        idNumber: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在3到5个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        phone: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value === '' || !(/^1(3|4|5|6|7|8)\d{9}$/.test(value))) { //如果是空串或者不满足正则表达式
                callback(new Error('请输入正确的手机号！'))
              } else {
                callback()
              }
            }
          }
        ],
        idNumber: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value === '' || !(/ (^\d{15}$)|(^\d{18}$)|(^\d{17}(X|x)$) /.test(value))) { //如果是空串或者不满足正则表达式
                callback(new Error('请输入正确的身份证号！'))
              } else {
                callback()
              }
            }
          }
        ]
      }
    }
  },
  methods: {
    submitFormAgain(formName, continueAdd) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addEmployee(this.ruleForm).then((res) => {
            if (res.data.code === 1) {
              this.$message.success('员工添加成功！')
              if (continueAdd) {
                this.ruleForm = {//重新设置回参数来
                  name: '',
                  username: '',
                  sex: '1',
                  phone: '',
                  idNumber: ''
                }
              } else {
                this.$router.push('/employee') //路由跳转
              }
            } else {
              this.$message.error(res.data.msg)
            }
          })
        }
      })
    }
  }
}

</script>

<style lang="scss" scoped>
.addBrand {
  &-container {
    margin: 30px;
    margin-top: 0px;

    .HeadLable {
      background-color: transparent;
      margin-bottom: 0px;
      padding-left: 0px;
    }

    .container {
      position: relative;
      z-index: 1;
      background: #fff;
      padding: 30px;
      border-radius: 4px;
      // min-height: 500px;
      .subBox {
        padding-top: 30px;
        text-align: center;
        border-top: solid 1px $gray-5;
      }
    }

    .idNumber {
      margin-bottom: 39px;
    }

    .el-form-item {
      margin-bottom: 29px;
    }

    .el-input {
      width: 293px;
    }
  }
}
</style>
