# 光合作用 Photosynthesis · 植物伙伴

一款「皮克敏 Bloom」风格的植物养成应用：领养一株虚拟植物，出门拍摄自然中的阳光、植物与水景，AI 按「水、光、气、垫」四要素计算光合值，驱动 3D 植物生长，逐步解锁植物图鉴、明信片与养成日记。

## 核心玩法

1. 首次进入选择植物搭子与花盆，植物入驻主页。
2. 点击相机按钮拍摄（或从相册选择）自然照片。
3. AI 识别照片中的水、光、气、垫要素，结算当日光合值。
4. 光合值推动 3D 植物阶段生长；散步、晒太阳、浇水为辅助互动。
5. 随成长解锁植物图鉴、收藏明信片、生成养成日记。
6. 应用随真实时间呈现白天、黄昏、夜晚状态，夜晚进入深色沉浸界面。

## 技术架构

- 前端：单文件 HTML + 原生 CSS/JS，无框架。
- 3D：three.js（本地模块，离线可用），GLTFLoader 加载植物与花盆模型。
- 相机：`input[type=file]` 调用系统相机与相册。
- 移动壳：Capacitor 6（iOS 部署目标 13.0，可在 iPhone 7 / iOS 15 运行）。
- 数据：本地存储，无服务端、无追踪、无第三方数据收集。

## 目录结构

```
皮克敏bloom/            Web 原型与 PWA 交付物（GitHub Pages 站点根）
  index.html            应用本体
  manifest.webmanifest  PWA 清单
  app_assets/           three.js、3D 模型、贴纸、图标等素材
ios-app/                iOS 打包工程
  capacitor.config.json Capacitor 配置（appId: com.photothesis.bloom）
  scripts/sync-web.ps1  从 ../皮克敏bloom 同步 web 内容到 www
  ios/App/              Xcode 工程（含 Info.plist、隐私清单、图标、启动屏）
.github/workflows/
  deploy-pages.yml      自动部署 Web 到 GitHub Pages
  ios-build.yml         云 macOS 自动编译 iOS（含模拟器产物）
```

## 本地运行 Web

```bash
# 在 皮克敏bloom 目录
python -m http.server 8765
# 浏览器打开 http://localhost:8765
```

## 构建 iOS

### 方式一：GitHub Actions 云 Mac（无需 Mac 电脑，推荐）

推送到 GitHub 后，`Build iOS (Cloud macOS)` 工作流自动在 macOS 环境完成
依赖安装、web 同步、CocoaPods 安装与模拟器编译，并在 Artifacts 中提供 `App.app`。

### 方式二：本地 Mac

```bash
cd ios-app
npm install
pwsh ./scripts/sync-web.ps1      # 同步 web 到 www
npx cap copy ios
cd ios/App && pod install
open App.xcworkspace             # Xcode 中选择真机或模拟器运行
```

### 方式三：iPhone 直接以 PWA 真机演示

将 GitHub Pages 站点（HTTPS）用 iPhone 的 Safari 打开，
通过「分享 → 添加到主屏幕」安装，即可全屏独立运行，效果与原生一致。

## 合规与隐私

- `Info.plist` 已声明相机、相册读取与保存用途说明（中文）。
- `PrivacyInfo.xcprivacy` 隐私清单：不追踪、无收集数据类型。
- `ITSAppUsesNonExemptEncryption = false`。
- iPhone 仅支持竖屏。
