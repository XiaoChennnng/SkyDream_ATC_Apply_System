<div align="center">
  <img src="./public/logo.png" alt="SkyDream Logo" width="500">
  <h1>✈️ SkyDream 管制员申请管理系统 🛫</h1>
</div>

嗨！欢迎来到 **SkyDream 飞行俱乐部** 👋 这是一个超棒的模飞聚集地！
🚀 系统基于 React + TypeScript + Vite 构建，使用 Express 作为后端服务，带给你完整的用户管理、申请流程、考试预约和活动考核体验。

## ✨ 功能特点

### 👥 用户管理
- 多角色支持：申请者(applicant)、教员(teacher)和管理员(admin)
- 完整的用户注册、登录和个人资料管理
- 基于角色的权限控制系统

### 📝 管制员申请
- 便捷的在线申请流程
- 支持多种管制室申请（塔台、进近、区域等）
- 文件上传和附件管理
- 申请状态跟踪

### 📚 考试系统
- 理论考试预约
- 模拟机考试安排
- 考试结果记录和评估
- 教员反馈和评分

### 🎮 活动考核
- 真实环境下的管制能力评估
- 活动预约和确认
- 教员监管和评估
- 权限等级管理

### ⚙️ 系统管理
- 用户账号管理
- 考试和活动管理
- 权限分配和调整
- 系统数据导出

## 🛠️ 技术栈

- **前端**：
  - React 19
  - TypeScript
  - Vite
  - React Router v7
  - Tailwind CSS
  - Radix UI 组件库

- **后端**：
  - Express
  - 基于文件的数据存储系统
  - RESTful API

## 👤 系统角色

### 🧑‍✈️ 申请者 (Applicant)
- 提交管制员申请
- 预约理论和模拟机考试
- 参与活动考核
- 查看个人进度和评估结果

### 👨‍🏫 教员 (Teacher)
- 审核申请
- 确认和评估考试
- 监管活动考核
- 提供反馈和评分

### 👑 管理员 (Admin)
- 系统全局管理
- 用户账号管理
- 权限分配
- 系统配置

## 🔄 申请流程

1. **提交申请**：填写申请表格，提交个人信息和管制经验
2. **理论考试**：参加理论知识考核，测试对管制规则的理解
3. **模拟机考试**：在模拟环境中展示管制技能和应变能力
4. **活动考核**：参与实时管制活动，获得正式管制权限

## 🔐 权限等级体系

系统实现了从 S1 到 I3 的完整权限等级体系，为管制员提供清晰的晋升路径。💪 随着你的技能提升，你的权限也会逐步升级！

## 💻 开发指南

### 📦 安装依赖

```bash
npm install
```

### 🚀 启动开发服务器

```bash
# 启动前端开发服务器
npm run dev

# 启动后端服务器
node server/index.cjs
```

### 🔨 构建项目

```bash
npm run build
```

### 👀 预览构建结果

```bash
npm run preview
```

## 🔧 系统初始化

系统首次启动时会自动创建默认管理员账号
别忘了首次登录后修改密码哦！🔒

## 📁 文件存储结构

系统使用基于文件的数据存储方案，所有数据存储在 `data` 目录下：

```
data/
├── index.json                # 文件系统索引
└── users/                    # 用户数据目录
    ├── USER1/               # 用户1目录
    │   ├── profile.json     # 用户个人资料
    │   ├── applications/    # 用户申请
    │   ├── exams/           # 用户考试
    │   ├── activities/      # 用户活动
    │   └── attachments/     # 用户附件
    └── USER2/               # 用户2目录
        └── ...
```

## 🤝 贡献指南

欢迎对本项目提出改进建议和贡献代码！👏 请遵循以下步骤：

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详情请参阅 LICENSE 文件 ✨
