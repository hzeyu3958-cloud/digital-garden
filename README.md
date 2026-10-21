# 数字花园 · 个人站点

一个单页个人站点：把简历、作品、写作和各平台入口集中在一处，替代 Linktree 式的链接聚合页。

技术栈：Vite 7 + React 19 + TypeScript + Tailwind CSS 4 + framer-motion + Lenis。

## 改内容只改一个文件

所有文案、链接、板块数据都在 `client/src/content/site.ts`：

- `meta`：站点名、标题、描述
- `profile`：姓名、身份标签、一句话介绍、坐标、邮箱、照片路径
- `highlights` / `tags` / `cta`：首屏数据卡、能力标签、按钮
- `links`：全部入口（按分组渲染，是站点的主板块）
- `skills` / `education` / `languages`：技能与教育
- `projects` / `aigc` / `plans` / `news` / `work` / `literary`：内容板块

后六个板块是**空数组就自动隐藏**，填了数据才出现，导航和页脚也会同步增减。

## 放素材

- 头像：`client/public/images/profile.jpg`
- 简历：`client/public/resume.pdf`（然后在 `site.ts` 里把简历那条的 `href` 改成 `/resume.pdf`）

## 本地运行

```bash
npm install --legacy-peer-deps
npm run dev
```

默认 http://localhost:3000

> 必须带 `--legacy-peer-deps`：项目里 `@builder.io/vite-plugin-jsx-loc` 声明的 peer 依赖是 vite 4/5，而项目用的是 vite 7。

## 构建

```bash
npm run build
```

产物在 `docs/`，`base` 为相对路径，可直接放在任意子路径下。

## 动效

- 开场门：深墨绿幕布 + 加载进度 + Enter 按钮（同一会话只出现一次）
- 首屏标题：打字机逐字出现，带闪烁光标，完成后持续轻浮
- 全局：Lenis 惯性滚动（lerp 0.085）
- 鼠标：移动 88px 落一枚叶片，最多 18 枚，1.45s 淡出
- 背景：96 颗粒子随鼠标轻微视差
- 板块标题：逐字 3D 翻入
- 卡片：鼠标跟随倾斜

系统开启「减少动态效果」时，以上动效自动降级或关闭。

## 部署

GitHub Pages 已经指向 `main` 分支的 `/docs` 目录，所以发布新版本只要两步：

```bash
npm run build
git add -A && git commit -m "update" && git push
```

页面地址：`https://hzeyu3958-cloud.github.io/digital-garden/`
