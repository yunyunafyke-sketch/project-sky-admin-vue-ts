<template>
  <div class="dashboard-container">
    <div class="container">
      <label style="margin-right:5px">员工姓名：</label>
      <el-input v-model="name" placeholder="请输入员工姓名" style="width:15%" />
      <el-button type="primary" style="margin-left: 20px" @click="pageQuery()">查询</el-button>
      <el-button type="primary" style="float:right" @click="handleAddEmp">+添加员工</el-button>
    </div>
    <div>
      <el-table
        :data="records"
        stripe
        style="width: 100%">
        <el-table-column
          prop="name"
          label="员工姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="username"
          label="账号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号">
        </el-table-column>
        <el-table-column
          prop="status"
          label="账号状态">
          <template slot-scope="scope">{{ scope.row.status === 0 ? '禁用' : '启用' }}</template>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="最后操作时间">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="handleUpdateEmp(scope.row)">修改</el-button>
            <el-button type="text" @click="handleStartOrStop(scope.row)">
              {{ scope.row.status === 0 ? '启用' : '禁用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="block">
      <el-pagination
        style="float:right"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { getEmployeeList, enableOrDisableEmployee } from '@/api/employee'

export default {
  data() {
    return {
      name: null,
      page: 1,
      pageSize: 5,
      total: 0,
      records: []
    }
  },
  created() {
    this.pageQuery()
  },
  methods: {
    pageQuery() {
      const params = {
        name: this.name,
        page: this.page,
        pageSize: this.pageSize
      }
      getEmployeeList(params).then(res => {
        if (res.data.code === 1) {
          this.total = res.data.data.total
          this.records = res.data.data.records
        }
      }).catch(er => {
        this.$message.error('请求出错了' + er.message)
      })
    },
    //每页记录数发生变化时触发
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.pageQuery()
    },
    //page发生变化时触发
    handleCurrentChange(page) {
      this.page = page
      this.pageQuery()
    },
    handleStartOrStop(row) {
      if (row.username === 'admin') {
        this.$message.error('admin为系统的管理员，不能更改账号状态！')
        return
      }
      this.$confirm('是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const p = {
          id: row.id,
          status: !row.status ? 1 : 0
        }
        enableOrDisableEmployee(p).then(res => {
          if (res.data.code === 1) {
            this.$message.success('员工的账号状态修改成功！')
            this.pageQuery()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    //跳转到新增员工页面（组件）
    handleAddEmp(){
      //路由跳转，跳转到新增员工组件
      this.$router.push('/employee/add')
    },
    //跳转到新增员工页面（组件）
    handleUpdateEmp(row){
      if(row.username==='admin'){
        this.$message.error('admin不允许修改')
        return
      }
      //路由跳转，跳转到新增员工组件
      this.$router.push({
        path:'/employee/add',
        query:{id: row.id}
      })
    }

  }
}

</script>

<style lang="scss" scoped>
.disabled-text {
  color: #bac0cd !important;
}
</style>
