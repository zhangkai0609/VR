# VR项目 GitHub Pages 部署说明

这个文件夹已经整理成静态网页项目，适合直接部署到 GitHub Pages。

## 需要上传的核心文件

- `index.html`
- `assets/vr-tour.css`
- `assets/vr-tour.js`
- `assets/vr-images/` 里的图片

原始 HDR 大图可以不上传到 GitHub，因为网页使用的是压缩后的 `assets/vr-images/*-web.jpg`。

## 部署步骤

1. 在 GitHub 新建一个公开仓库，例如 `vr-project`。
2. 把本文件夹中的 `index.html` 和 `assets` 文件夹上传到仓库根目录。
3. 打开仓库 Settings。
4. 进入 Pages。
5. Source 选择 `Deploy from a branch`。
6. Branch 选择 `main`，目录选择 `/root`。
7. 保存后等待 1-2 分钟，GitHub 会生成一个访问链接。

手机用户打开 GitHub Pages 链接即可观看。
