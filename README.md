# 🎓 教育规划系统

一个智能的教育路径规划系统，为学生和家长提供个性化的教育升学路径建议。

## ✨ 项目特色

- 🎯 **智能路径规划**：基于当前教育状态智能推荐最优升学路径
- 💰 **精准费用计算**：详细的教育费用预算和分析
- 🔍 **多维度筛选**：支持按教育阶段、费用区间、常见度等多维度筛选
- 📊 **直观数据展示**：清晰的路径对比和费用展示
- 📱 **响应式设计**：完美适配手机、平板、电脑等各种设备
- 🎨 **现代化界面**：简洁美观的用户界面设计

## 🚀 在线体验

**项目地址**：[https://gitee.com/egg-yellow-geng/edu](https://gitee.com/egg-yellow-geng/edu)

## 💻 本地运行

### 方法一：直接运行
1. 克隆项目到本地：
```bash
git clone https://gitee.com/egg-yellow-geng/edu.git
cd edu
```

2. 启动本地服务器：
```bash
cd frontend
python3 -m http.server 8000
```

3. 在浏览器中访问：`http://localhost:8000`

### 方法二：使用任何HTTP服务器
将 `frontend` 文件夹部署到任何HTTP服务器即可运行。

## 📁 项目结构

```
edu/
├── frontend/                 # 前端代码
│   ├── index.html            # 主页面
│   ├── css/                  # 样式文件
│   │   └── style.css
│   └── js/                   # JavaScript文件
│       ├── app.js            # 主应用逻辑
│       ├── education-data.js # 教育数据
│       ├── cost-calculator.js # 费用计算
│       └── ...               # 其他功能模块
├── src/                      # TypeScript源码
├── docs/                     # 项目文档
├── README.md                 # 项目说明
└── LICENSE                   # 开源许可证
```

## 🎯 主要功能

### 1. 智能路径推荐
- 根据用户当前教育状态（阶段、年级、教育水平）
- 基于目标教育阶段
- 智能推荐最适合的升学路径

### 2. 费用计算分析
- 详细的各阶段费用breakdown
- 总费用预算计算
- 年均费用分析
- 费用区间筛选

### 3. 多维度筛选排序
- **教育阶段筛选**：锁定关键教育阶段和水平
- **费用区间筛选**：自定义费用预算范围
- **排序方式**：
  - 按常见度排序（推荐）
  - 按总费用由高到低
  - 按总费用由低到高

### 4. 路径对比功能
- 高亮显示路径间的差异
- 直观的路径对比视图
- 详细的约束条件说明

## 🛠️ 技术栈

- **前端框架**：原生 JavaScript (ES6+)
- **样式**：CSS3 + Flexbox + Grid
- **响应式**：Media Queries
- **数据管理**：本地 JSON 数据
- **构建工具**：无需构建，即开即用

## 📝 教育路径类型

系统支持以下教育路径类型：

- **国内教育体系贯通路径**：传统公立教育路径
- **早期国际转轨路径**：小学阶段开始的国际教育
- **中期国际转轨路径**：初中阶段转入国际教育
- **高中国际转轨路径**：高中阶段的国际教育选择
- **混合教育路径**：结合国内外教育优势的路径

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来改进项目！

1. Fork 本项目
2. 创建特性分支：`git checkout -b feature/新功能`
3. 提交更改：`git commit -m '添加新功能'`
4. 推送分支：`git push origin feature/新功能`
5. 提交 Pull Request

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源许可证。

## 📞 联系方式

如有问题或建议，欢迎通过以下方式联系：

- 项目Issues：[https://gitee.com/egg-yellow-geng/edu/issues](https://gitee.com/egg-yellow-geng/edu/issues)
- Gitee主页：[https://gitee.com/egg-yellow-geng](https://gitee.com/egg-yellow-geng)

---

⭐ 如果这个项目对您有帮助，请给个Star支持一下！