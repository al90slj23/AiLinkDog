## 规范同步判断

- L4 工作日志：必须补写
- 是否涉及长期规则变化：否（此为后台设置字段绑定失效的 bug 修复）

## 代码文件行数检查

- `web/src/components/settings/OperationSetting.jsx`：未见异常。
- `web/src/pages/Setting/Operation/SettingsGeneral.jsx`：未见异常。

## 建议更新层

- L4 工作日志：必须补写。主要记录 `HomePageRobotDebuggerEnabled` 字段在前端页面级表单状态管理中因缺少初始化声明，导致在对比变化（`compareObjects`）时被忽略从而报错“你似乎并没有修改什么”的根本原因及修复过程。
- 其它层（L0-L3, L5）：无需同步。

## 需要用户确认的事项

- [ ] 是否同意直接生成该表单排障 L4 工作日志 `2026-04-24-hero-debugger-form-save-fix-summary.md`？