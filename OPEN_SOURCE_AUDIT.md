# 开源前安全与隐私检查报告

检查对象：dsh-github-connect v0.5.1；检查日期：2026-11-11。

## 结论与交付范围

建议仅发布 release/ 中的白名单源码 ZIP 和 v0.5.1 tgz，或使用 release/source-* 中的干净源码目录初始化仓库。检查未在白名单源码与当前构建文件中发现预置 OAuth Client ID、GitHub访问令牌、模型API密钥、个人Windows路径、邮箱或私钥模式。静态规则检查不能保证识别所有秘密、业务信息或已发布历史。

不应直接将整个本机开发目录或其父目录拖入网页上传。本机资料已经移至工程外明确标记的私有目录；node_modules、测试运行资料、参考SDK、诊断截图、历史调查记录、本机配置和暂存程序都不属于开源源码。

## 已处理的发现

| 内容 | 处理 |
|---|---|
| src/publisher.json 与 lib/publisher.json 的个人Client ID | 清空为字符串空值 |
| README 中的个人绝对路径及本机操作记录 | 重写为通用安装说明 |
| 输出日志/诊断报告中的用户目录和测试浏览器资料 | 移出工程，白名单和忽略规则排除 |
| 历史 tgz 中旧Client ID、README私人路径及tar所有者元数据 | 9个历史包重新清理；仅推荐发布最新包 |
| 原始全目录源码ZIP | 移除，改由白名单脚本生成源码ZIP |
| 未来打包误带个人配置 | prepack自动构建并执行release:check，预置Client ID非空会拒绝打包 |

本项目当前没有 .git 历史目录。本轮未检查账号内其他仓库、已推送的Git历史、外部下载缓存或第三方存档；若旧内容曾公开，本地清理不会使远端历史自动消失。

## Client ID 的性质与缺失影响

Client ID 是公开的应用标识，不是 Client Secret，不是访问令牌；单独知道Client ID不能登录你的GitHub。它可能使他人将登录应用与发布者联系起来，因此本版本按要求不再预置。登录所需的私人访问令牌不能开源，即使已经加密也不应作为源码文件分享。

| 情况 | 影响 |
|---|---|
| 新用户没有配置Client ID | 无法启动插件GitHub设备登录；登录后界面中的仓库浏览、Search API、建库、提交、Release上传等不可正常开始使用 |
| 已有仍有效的本地访问令牌 | 清空预置ID不会主动撤销令牌或退出；API可继续，失效/断开后需配置ID再登录 |
| 官网搜索、高级筛选、打开GitHub网页 | 正常使用，账号及权限由浏览器决定 |
| AI程序介绍 | 模型由Harness提供，与Client ID不同；但当前按钮位于已登录的新建仓库流程内，新用户仍须先完成GitHub登录 |

新用户可以注册自己的 OAuth App 并启用 Device Flow，在设置页填公开Client ID。不需要 Client Secret。此模式下不再让所有开源使用者默认使用原发布者应用。

## 程序安全边界与剩余事项

- GitHub仅通过官方OAuth/API调用，令牌保存在个人本机DPAPI存储，不通过浏览器状态接口返回。浏览器操作路由限制为宿主browserPeer和本机访问；这是个人桌面插件，不提供公开多租户部署保证。
- 插件 OAuth 申请 repo 范围，可以访问授权账号的公开及私有仓库，权限较广；用户应在授权页核对。删除按钮只跳官网，没有DELETE接口和delete_repo权限。
- 写入操作先预览确认；网络写入失败不自动重试。Token被撤销/过期仍可能需要重登。
- 当前没有refresh_token自动续期。如果用户自己的OAuth App启用了可过期令牌，令牌过期后需重新登录；这与删除预置Client ID是不同问题。
- AI会将选定源码片段发送给Harness配置的模型；生成可能不准确，需审阅。ZIP解析限制大小、条目和读取字节，不运行程序；凭据筛选是启发式，不能代替用户检查敏感源码。
- 默认日志只记固定事件类别，不记Token或正文；源码ZIP不包含实际日志、凭据、工作区草稿、安装包或浏览器Cookie。
- npm依赖审计本轮无已知漏洞报告；这不等于完整渗透测试或供应链永久保证。

## 复查方式

运行 npm run verify（50项检查）和 npm run release:check，再运行 npm pack 与 npm run release:source。源码ZIP采用新建暂存目录和公开文件白名单，避免旧暂存文件混入。原版历史安装包不作为新的发布主文件。

官方参考：
- https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps
- https://docs.github.com/en/apps/creating-github-apps/about-creating-github-apps/best-practices-for-creating-a-github-app

本次公开发布补充：以介绍图所在工程的自动保存及导入材料分离实现为准，同步50项检查通过；图片均为演示账号，已移除PNG文本/EXIF元数据。预置Client ID保持空值。
