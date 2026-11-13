$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$cli = Join-Path $env:LOCALAPPDATA 'Programs\DeepSeek Harness\resources\runtime\cli\bin\dsh.cmd'
$manifest = Get-Content -LiteralPath (Join-Path $projectRoot 'package.json') -Encoding UTF8 -Raw | ConvertFrom-Json
$package = Join-Path $projectRoot ('{0}-{1}.tgz' -f $manifest.name, $manifest.version)
if (-not (Test-Path -LiteralPath $cli)) { throw '未找到 DeepSeek Harness 桌面端命令，请先安装客户端。' }
if (-not (Test-Path -LiteralPath $package)) { throw '未找到 tgz 安装包，请先运行 npm pack。' }
if (Get-Process -Name 'DeepSeek Harness' -ErrorAction SilentlyContinue) {
    Write-Host '请先在托盘中完全退出 DeepSeek Harness，再运行本脚本。也可以直接在客户端的插件页面添加本地 tgz 包。'
    exit 1
}
$profileDir = Join-Path $env:USERPROFILE '.dsh\profiles\desktop'
$backup = Join-Path $projectRoot ('outputs\profile-backup-' + (Get-Date -Format 'yyyyMMdd-HHmmss'))
New-Item -ItemType Directory -Path $backup -Force | Out-Null
foreach ($name in @('package.json', 'cordis.patch.yml', 'pnpm-lock.yaml')) {
    $source = Join-Path $profileDir $name
    if (Test-Path -LiteralPath $source) { Copy-Item -LiteralPath $source -Destination (Join-Path $backup $name) }
}
& $cli plugin --profile desktop add $package
if ($LASTEXITCODE -ne 0) { throw '宿主安装命令失败，配置备份已保存到 outputs。' }
Write-Host '安装完成。打开 DeepSeek Harness → 设置 → GitHub → 登录 GitHub。'
