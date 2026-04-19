#!/bin/bash

print_info "请选择部署方式："
echo "1. 上传到服务器并同时上传到 GitHub"
echo "2. 仅上传到 GitHub 仓库"
echo "3. 仅上传到服务器"
echo "0. 返回"
echo ""

read -r -p "请输入选择: " deploy_choice

case "$deploy_choice" in
  1)
    print_info "ℹ️ 该部署方式暂未实现，后续安排"
    ;;
  2)
    run_github_deploy_flow
    ;;
  3)
    print_info "ℹ️ 该部署方式暂未实现，后续安排"
    ;;
  0)
    print_info "ℹ️ 已返回"
    ;;
  *)
    print_error "❌ 无效选择：${deploy_choice}"
    exit 1
    ;;
esac
