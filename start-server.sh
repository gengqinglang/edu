#!/bin/bash

echo "🚀 启动教育路径规划系统前端服务器..."
echo "📁 项目目录: $(pwd)"
echo "🌐 服务器地址: http://localhost:8080"
echo "📄 主页面: http://localhost:8080/index.html"
echo "🧪 测试页面: http://localhost:8080/test.html"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

cd frontend
python3 -m http.server 8080
