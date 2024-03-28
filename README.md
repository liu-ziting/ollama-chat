# ollamaChat

## 项目介绍

基于ollama.js构建的本地大模型对话助手

<img src="https://raw.githubusercontent.com/liu-ziting/ollama-chat/main/src/assets/interface.png"  />

## 框架

| 名称          | 描述                                  | 链接                                                 |
| :------------ | :------------------------------------ | :--------------------------------------------------- |
| ollama        | 在本地启动并运行大型语言模型          | [访问](https://ollama.ai/)                           |
| ollama-js     | ollama JavaScript 库                  | [访问](https://github.com/ollama/ollama-js)          |
| antdv         | UI框架                                | [访问](https://www.antdv.com/components/overview-cn) |
| 第三方组件    | -                                     | -                                                    |
| • splitpanes  | 可靠、简单且可触摸的窗格分割器/缩放器 | [访问](https://antoniandre.github.io/splitpanes/)    |
| • markdown-it | 将markdown语法的内容转换为html内容    | [访问](https://github.com/markdown-it/markdown-it)   |

## 开发

### 前置条件

启动ollama服务器，成功后可访问
http://localhost:11434/

```bash
ollama serve
```

### 安装依赖

```bash
npm install
```

### 启动本地开发服务器

```bash
npm run dev
```

在 `localhost:5173` 启动本地开发服务器

### 构建生产环境网站

```bash
npm run build
```

## 目录结构

```bash
│  App.vue // 主页面
│  main.ts // 入口文件
├─assets
├─components
│      ActionBar.vue // 操作栏
│      ChatHistory.vue // 对话历史
│      ChatInput.vue // 对话输入框
│      ChatList.vue // 对话列表
│      LeftNav.vue // 左侧导航栏
│      ModelPull.vue // 模型拉取
│      NoData.vue // 无数据
│      TopBar.vue // 顶部栏
├─lib
│      useChat.ts // 主页聊天对话方法管理
├─router
│      index.ts // 路由管理
├─stores
└─views
        ConfigPage.vue // 配置页面
        HomePage.vue // 主页
        ModelsPage.vue // 模型列表页面
        PromptPage.vue // 提示词管理页面
```

## 开发计划

-   [x] 对话界面
    -   [x] 本地存储
    -   [x] 模型切换
    -   [x] 会话删除
    -   [x] 清空对话
    -   [x] 历史记录
    -   [x] 发送消息
    -   [ ] 会话导出
    -   [ ] 创建副本
    -   [ ] 上传图片
    -   [ ] 上传文件
    -   [ ] 选择prompt
-   [x] 模型管理
    -   [x] 模型列表
    -   [x] 拉取模型
    -   [x] 删除模型
-   [ ] 发现
    -   [ ] 管理prompt
-   [x] 设置
    -   [x] 基础配置
    -   [x] 关于
