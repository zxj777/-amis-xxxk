# Amis React Vite Demo

使用 Vite + React + amis 构建的动态详情加载示例。

## 项目特点

- ⚡ **Vite** - 快速的构建工具和开发服务器
- ⚛️ **React 18** - 现代React框架
- 📦 **pnpm** - 高效的包管理器
- 🎨 **amis** - 低代码前端框架

## 功能

- 用户列表表格展示
- 点击详情按钮动态加载用户详情
- 详情信息在表格下方展开显示

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview
```

## 项目结构

```
amis-xxxk/
├── index.html              # Vite 入口HTML
├── vite.config.js          # Vite 配置文件
├── package.json            # 项目配置
├── src/
│   ├── main.jsx            # 应用入口
│   ├── App.jsx             # 主应用组件
│   ├── App.css             # 样式文件
│   └── index.css           # 全局样式
└── public/
    └── api/                # Mock API数据
        ├── users.json      # 用户列表
        └── user-detail.json # 用户详情
```

## 开发说明

- 使用 ESM 模块系统
- 所有 `.js` 文件改为 `.jsx` 以支持JSX语法
- Vite 提供极快的热重载和构建速度
- 支持现代浏览器特性
