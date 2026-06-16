import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { login,userLogout } from '@/api/employee'
import { getToken, setToken, removeToken,getStoreId, setStoreId, removeStoreId, setUserInfo, getUserInfo, removeUserInfo } from '@/utils/cookies'
import store from '@/store'
import Cookies from 'js-cookie'
import { Message } from 'element-ui'

// IUserState 描述用户模块里保存了哪些全局用户信息。
export interface IUserState {
  token: string
  name: string
  avatar: string
  storeId: string
  introduction: string
  userInfo: any
  roles: string[]
  username: string
}

// user 模块负责登录态、用户信息、角色和门店信息。
@Module({ 'dynamic': true, store, 'name': 'user' })
class User extends VuexModule implements IUserState {
  // 刷新页面后 Vuex 会丢失内存状态，所以 token/username 需要从 Cookie 恢复。
  public token = getToken() || ''
  public name = ''
  public avatar = ''
  // @ts-ignore
  public storeId: string = getStoreId() || ''
  public introduction = ''
  public userInfo = {}
  public roles: string[] = []
  public username = Cookies.get('username') || ''

  // SET_* 这类方法都是 Mutation：只做同步赋值，方便追踪状态变化。
  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token
  }

  @Mutation
  private SET_NAME(name: string) {
    this.name = name
  }

  @Mutation
  private SET_USERINFO(userInfo: any) {
    this.userInfo = { ...userInfo }
  }

  @Mutation
  private SET_AVATAR(avatar: string) {
    this.avatar = avatar
  }

  @Mutation
  private SET_INTRODUCTION(introduction: string) {
    this.introduction = introduction
  }

  @Mutation
  private SET_ROLES(roles: string[]) {
    this.roles = roles
  }

  @Mutation
  private SET_STOREID(storeId: string) {
    this.storeId = storeId
  }
  @Mutation
  private SET_USERNAME(name: string) {
    this.username = name
    }

  // Login 是登录动作：先调后端接口，成功后把 token 和用户信息存到 Vuex/Cookie。
  @Action
  public async Login(userInfo: { username: string, password: string }) {
    let { username, password } = userInfo
    username = username.trim()
    this.SET_USERNAME(username)
    Cookies.set('username', username)
    const { data } = await login({ username, password })
    if (String(data.code) === '1') {
      // const dataParams = {
      //   // status: 200,
      //   token: data.data.token,
      //   // msg: '登录成功',
      //   // ...data.data
      //   ...data
      // }
      this.SET_TOKEN(data.data.token)
      setToken(data.data.token)
      this.SET_USERINFO(data.data)
      Cookies.set('user_info', data.data)
      return data
    } else {
      return Message.error(data.msg)
    }
  }

  // 清空前端保存的登录凭证，通常用于登录失效或手动退出后的状态重置。
  @Action
  public ResetToken () {
    removeToken()
    this.SET_TOKEN('')
    this.SET_ROLES([])
  }

  @Action
  public async changeStore(data: any) {
    this.SET_STOREID = data.data
    this.SET_TOKEN(data.authorization)
    setStoreId(data.data)
    setToken(data.authorization)
  }

  // 从 Cookie 中恢复用户信息，并同步到 Vuex。
  // 注意：这里依赖 getUserInfo() 返回的是 JSON 字符串。
  @Action
  public async GetUserInfo () {
    if (this.token === '') {
      throw Error('GetUserInfo: token is undefined!')
    }

    const data = JSON.parse(<string>getUserInfo()) //  { roles: ['admin'], name: 'zhangsan', avatar: '/login', introduction: '' }
    if (!data) {
      throw Error('Verification failed, please Login again.')
    }

    const { roles, name, avatar, introduction, applicant, storeManagerName, storeId='' } = data // data.user
    // roles must be a non-empty array
    if (!roles || roles.length <= 0) {
      throw Error('GetUserInfo: roles must be a non-null array!')
    }

    this.SET_ROLES(roles)
    this.SET_USERINFO(data)
    this.SET_NAME(name || applicant || storeManagerName)
    this.SET_AVATAR(avatar)
    this.SET_INTRODUCTION(introduction)
  }

  // 退出登录：通知后端退出，再清理前端 Cookie 和 Vuex 状态。
  @Action
  public async LogOut () {
    const { data } = await userLogout({})
    removeToken()
    this.SET_TOKEN('')
    this.SET_ROLES([])
    Cookies.remove('username')
    Cookies.remove('user_info')
    removeUserInfo()
  }
}

export const UserModule = getModule(User)
