# AGENTS.md

本文件适用于仓库根目录及其所有子目录。执行任务时，优先遵循用户指令；若子目录存在更具体的 `AGENTS.md`，则以更具体的文件为准。

## 项目概览

- 项目是基于 Vue 2、TypeScript、Vue CLI 3 和 Element UI 的后台管理前端。
- 当前代码使用 class-style Vue 组件，主要依赖 `vue-property-decorator`。
- 状态管理使用 Vuex 和 `vuex-module-decorators`。
- HTTP 请求统一通过 `src/utils/request.ts` 中的 Axios 实例发送。
- 样式主要使用 SCSS，公共变量和 mixin 由 Vue CLI 插件自动注入。
- 这是旧版技术栈项目。除非任务明确要求，不要升级 Node、Vue、TypeScript、Webpack 或其他核心依赖。

## 开发环境

- 推荐 Node.js：`12.22.12`
- README 记录的 npm：`6.14.16`
- 项目安装和运行统一使用 Yarn。
- 仓库同时存在 `yarn.lock` 和 `package-lock.json`，日常修改以 `yarn.lock` 为准；不要因普通任务改写 `package-lock.json`。

常用命令：

```bash
yarn install
yarn serve
yarn lint
yarn test:unit
yarn test:e2e
yarn build
yarn build:uat
```

- 本地开发服务默认运行在 `8888` 端口。
- `/api` 请求由 `vue.config.js` 代理到环境变量 `VUE_APP_URL`。
- Axios 的基础地址来自 `VUE_APP_BASE_API`。
- 不要提交真实密钥、Token 或仅适用于个人环境的配置。

## 目录职责

- `src/api/`：按业务域封装后端接口。
- `src/components/`：可复用业务或展示组件。
- `src/views/`：路由页面。
- `src/layout/`：后台布局及其组件。
- `src/router.ts`：路由表。
- `src/permission.ts`：登录校验、路由守卫和页面标题。
- `src/store/modules/`：动态 Vuex 模块。
- `src/utils/`：请求、Cookie、校验等通用逻辑。
- `src/styles/`：全局 SCSS、主题和公共样式。
- `src/icons/`：SVG 源文件及生成后的图标组件。
- `tests/unit/`：Jest 单元测试。
- `.codex/skills/`：项目级 Codex Skill。

## 编码约定

- 遵循 `.editorconfig`：UTF-8、LF、文件末尾换行、2 空格缩进。
- 遵循现有 ESLint 配置，提交前优先运行 `yarn lint`。
- 新增 Vue 页面或组件时，保持现有 Vue 2 class-style 写法，除非任务明确要求迁移。
- 使用 `@/` 别名引用 `src/` 下模块，避免不必要的深层相对路径。
- 优先沿用相邻代码的命名、组件结构和样式组织，不对无关代码做全局格式化。
- 不要仅为消除类型错误而扩大 `any`、`@ts-ignore` 或关闭规则；若旧代码已有此类写法，修改时尽量缩小影响范围。
- 注释说明业务原因、边界条件或兼容性约束，不复述代码表面行为。
- 用户可见文案以现有中文产品语言为准。

## Vue 与页面开发

- 页面组件放在对应的 `src/views/<domain>/` 目录。
- 可复用组件放在 `src/components/`，避免在多个页面复制相同实现。
- 路由集中维护在 `src/router.ts`；新增路由时同步设置准确的 `meta.title`，并确认是否需要鉴权或隐藏菜单。
- 登录态判断目前依赖 Cookie 中的 `token`，相关行为同时涉及 `src/permission.ts`、`src/utils/cookies.ts` 和用户 Store。
- 全局样式修改前检查 `src/styles/index.scss`、`home.scss`、`newRJWMsystem.scss` 和 Element UI 主题覆盖，避免重复定义。
- 响应式或视觉改动应至少检查桌面端和窄屏布局，不要破坏现有 Element UI 组件行为。

## API 与状态管理

- 新接口应放入对应的 `src/api/*.ts` 文件，并复用 `src/utils/request.ts`。
- GET 查询参数使用 `params`，请求体使用 `data`，保持与现有 Axios 封装兼容。
- 现有接口通常以 `data.code === 1` 表示成功；修改时先核对具体接口契约，不要擅自统一所有响应格式。
- Token 请求头、重复请求取消和错误清理由请求拦截器处理，不要在页面中重复实现。
- 新增 Vuex 状态时，沿用 `vuex-module-decorators` 的动态模块模式，并通过导出的模块实例访问。
- 不要在视图中直接复制 Cookie、鉴权或请求拦截逻辑。

## 测试与验证

- 修改工具函数或可复用组件时，补充或更新 `tests/unit/` 下的 Jest 测试。
- 修复缺陷时，优先添加能复现问题的回归测试。
- 根据改动范围执行最小充分验证：

```bash
yarn lint
yarn test:unit
yarn build
```

- UI 或路由改动还应通过 `yarn serve` 手工验证相关流程。
- `yarn test:e2e` 可能需要浏览器和可用的后端环境；无法执行时，在结果中明确说明。
- 不要为了让测试通过而删除有效断言、跳过测试或掩盖真实错误。

## Git 协作

- 开始修改前检查 `git status`，保留并兼容用户已有的未提交改动。
- 不要回退、覆盖或清理并非本次任务产生的修改。
- 不执行破坏性 Git 命令，例如 `git reset --hard` 或未经用户允许的强制操作。
- 除非用户明确要求，不要创建 commit。
- 除非用户明确要求，不要执行 `git push`。

当用户要求“提交当前改动”“本地 commit”或类似操作时：

1. 读取并遵循 `.codex/skills/git-local-commit/SKILL.md`。
2. 检查工作区、暂存区、实际 diff 和最近一次提交。
3. 仅提交本次应提交的改动。
4. 使用 `<类型>: <简体中文描述>` 格式的 commit message。
5. 只创建本地 commit，不执行 push。

## 完成标准

- 改动范围与用户需求一致，没有夹带无关重构或格式化。
- 业务行为、类型、路由、接口和样式之间保持一致。
- 已运行适用的 lint、测试或构建命令；未运行的验证需说明原因。
- 最终回复简要列出改动文件、验证结果和已知限制。
