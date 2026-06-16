<template>
  <el-dialog
    title="修改密码"
    :visible.sync="dialogFormVisible"
    width="568px"
    class="pwdCon"
    @close="handlePwdClose()"
  >
    <el-form ref="form" :model="form" label-width="85px" :rules="rules">
      <el-form-item label="原始密码：" prop="oldPassword">
        <el-input
          v-model="form.oldPassword"
          type="password"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="新密码：" prop="newPassword">
        <el-input
          v-model="form.newPassword"
          type="password"
          placeholder="6 - 20位密码，数字或字母，区分大小写"
        />
      </el-form-item>
      <el-form-item label="确认密码：" prop="affirmPassword">
        <el-input
          v-model="form.affirmPassword"
          type="password"
          placeholder="请输入"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handlePwdClose()">
        取 消
      </el-button>
      <el-button type="primary" @click="handleSave()">
        保 存
      </el-button>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Form as ElForm, Input } from 'element-ui'
// 接口
import { editPassword } from '@/api/users'
@Component({
  name: 'Password',
})
export default class extends Vue {
  // 父组件 Navbar 控制弹窗显隐，这里通过 prop 接收。
  @Prop() private dialogFormVisible!: any

  // 密码校验：6-20 位，只允许数字或英文字母。
  private validatePwd = (rule: any, value: any, callback: Function) => {
    const reg = /^[0-9A-Za-z]{6,20}$/
    if (!value) {
      callback(new Error('请输入'))
    } else if (!reg.test(value)) {
      callback(new Error('6 - 20位密码，数字或字母，区分大小写'))
    } else {
      callback()
    }
  }

  // 确认密码必须和新密码一致。
  private validatePass2 = (rule, value, callback) => {
    if (!value) {
      callback(new Error('请再次输入密码'))
    } else if (value !== this.form.newPassword) {
      callback(new Error('密码不一致，请重新输入密码'))
    } else {
      callback()
    }
  }

  // Element UI 表单校验规则。
  rules = {
    oldPassword: [{ validator: this.validatePwd, trigger: 'blur' }],
    newPassword: [{ validator: this.validatePwd, trigger: 'blur' }],
    affirmPassword: [{ validator: this.validatePass2, trigger: 'blur' }],
  }
  private form = {} as any
  private affirmPassword = ''

  handleSave() {
    // 校验通过后调用修改密码接口，成功后通知父组件关闭弹窗。
    (this.$refs.form as ElForm).validate(async (valid: boolean) => {
      if (valid) {
        const parnt = {
          oldPassword: this.form.oldPassword,
          newPassword: this.form.newPassword,
        }
        await editPassword(parnt)
        this.$emit('handleclose')
        ;(this.$refs.form as ElForm).resetFields()
      } else {
        return false
      }
    })
  }

  handlePwdClose() {
    // 关闭时重置表单，避免下次打开还保留旧输入和校验状态。
    (this.$refs.form as ElForm).resetFields()
    this.$emit('handleclose')
  }
}
</script>
<style lang="scss">
.navbar {
  .pwdCon {
    .el-dialog__body {
      padding-top: 60px;
      padding: 60px 100px 0;
    }
    .el-input__inner {
      padding: 0 12px;
    }
    .el-form-item {
      margin-bottom: 26px;
    }
    .el-form-item__label {
      text-align: left;
    }
    .el-dialog__footer {
      padding-top: 14px;
    }
  }
}
</style>
