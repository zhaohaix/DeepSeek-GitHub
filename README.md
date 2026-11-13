# DeepSeek GitHub Studio

适用于 Windows 上 DeepSeek Harness 的第三方 GitHub 插件，非 DeepSeek 或 GitHub 官方产品。

## 安装与使用

在 Harness 的插件管理中添加本地工程目录或本项目生成的 tgz 安装包，然后进入“设置 → GitHub”。本地目录安装后请保持目录位置稳定；使用 tgz 安装不依赖源码目录位置。

## GitHub 登录配置

开源版本不预置任何发布者或个人的 OAuth App Client ID。新用户需自行注册 GitHub OAuth App，并启用 Device Flow，在插件设置中填写公开的 Client ID；不需要填写 Client Secret。设备授权只能在 GitHub 官方页面完成。

- 未配置 Client ID：不能发起新的插件 GitHub 登录，因此新用户不能使用插件中需要 GitHub 认证的仓库浏览、搜索API、建库、提交和发布附件功能。
- 已经登录且本地令牌仍有效：清空预置 Client ID 不会主动退出登录；已有 API 操作可继续，令牌失效或断开后仍需先配置 Client ID 再登录。
- 官网搜索框、高级筛选、打开官网网页使用浏览器登录状态，不依赖插件 Client ID。
- AI 介绍使用 Harness 默认模型，Client ID 不是模型凭据；当前 AI 建库表单位于插件已登录流程内，新用户仍需先完成 GitHub 登录。生成会产生对应模型服务用量。

Client ID 可在插件界面、本机环境变量 `DSH_GITHUB_CLIENT_ID` 或本机配置文件中配置。个人配置、令牌、浏览器资料及日志不得进入代码仓库。公开构建会检查源码及产物中的预置 Client ID 必须为空。

## 功能

- 浏览已授权仓库；聊天工具支持搜索公开仓库、读取代码、准备建库和提交文件。
- 官网搜索框及高级筛选，在浏览器使用 GitHub 原生搜索。
- 创建 Release，上传已选择的安装包；已有发布流程保留。
- 新建仓库表单可传入代码或源码ZIP，成功暂存后启用 AI 自动介绍，结果可编辑并保存到本机 GitHub 工作区。不会执行程序，不根据安装包名字猜测功能；二进制安装包需另附源码或README。
- 自有仓库的删除按钮先确认，再打开 GitHub 设置页，由用户在官网完成删除，不申请额外删除权限。

写入先进入操作预览，由用户确认。程序文件先暂存本机，传入不等于已发布到 GitHub。自己的代码、说明和图片按 GitHub Markdown 规则显示。

## 数据与边界

本机数据默认位于用户主目录下 `.dsh/github-connect`，包括加密凭据、暂存附件、诊断日志和文案工作区。令牌使用 Windows DPAPI CurrentUser 加密，仅当前 Windows 用户可解密；日志仅记录固定事件类别、状态和时间，不记录 Token、设备授权码或正文。

只支持单机个人操作者，不作为公开多租户服务。AI 生成会将所选可读文本发送到当前配置的模型服务；请选取可发送的文件。ZIP读取、源码筛选与凭据模式过滤只能降低风险，不能保证识别全部敏感内容。私有库内容不要随意分享。

OAuth 仅请求 repo 范围，不提供插件直接删除仓库的接口。断开连接删除本机令牌，完整撤销应用授权需在 GitHub 账号设置中进行。

## 开发与打包

要求 Node.js 24。运行：

```sh
npm ci
npm run verify
npm run release:check
npm pack
npm run release:source
```

`npm pack` 自动执行构建和公开内容检查。分享 `release/` 中的源码ZIP和安装包，不要直接打包整个本机开发目录。`node_modules`、本机运行资料、诊断截图、历史调查记录、配置与生成草稿均不属于公开源码。

常规测试使用虚构数据与隔离目录。部分可选的宿主兼容测试脚本依赖开发者自行准备的 `reference/host` SDK，不包含在白名单开源包中。无需这些文件即可执行正常构建和单元测试。

## 许可证和参考

本工程原创代码为 MIT License。依赖及其许可证以各自软件包为准；运行依赖 yauzl，界面依赖 React。不要把第三方宿主运行时作为本插件源码再次分发。

- [GitHub OAuth Device Flow](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#device-flow)
- [GitHub REST API](https://docs.github.com/en/rest)
- [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)
