# 从原型目录（../皮克敏bloom）镜像同步 Web 内容到 ios-app/www，供 Capacitor 打包
$root = Split-Path -Parent $PSScriptRoot
$src = Join-Path $root "..\皮克敏bloom"
$dest = Join-Path $root "www"
# 先清空目标，保证被排除项不会以旧副本残留（robocopy /XD 不会 purge 已排除目录）
if (Test-Path $dest) { Get-ChildItem $dest -Force | Remove-Item -Recurse -Force }
robocopy $src $dest /E `
  /XD node_modules www ios android .git scripts _check _design .playwright-cli 参考图 植物素材 `
  /XF package.json package-lock.json capacitor.config.json "*.md" "*.ps1" "*.blend" `
      strawberry.glb 水壶.glb 花盆1.glb 花盆2.glb 花盆3.glb 花盆4.glb `
  /R:2 /W:2 /NFL /NDL /NJH /NP | Out-Null
if ($LASTEXITCODE -ge 8) { Write-Error "robocopy failed: $LASTEXITCODE"; exit 1 }
Write-Host "web synced: ../皮克敏bloom -> www"
