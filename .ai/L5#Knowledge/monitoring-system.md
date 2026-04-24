# Monitoring System

## 定位

AiLinkDog 的监控系统不是外部独立站点，也不是简单的页面展示模块，而是：

- 平台监控
- 用户自定义监控

两者共用同一套监控引擎、状态模型与协议能力的统一监控系统。

## 核心边界

### 1. 监控目标独立建模

监控目标不直接复用 `channels` 表，而是进入独立监控域：

- `monitor_targets`
- `monitor_runs`
- `monitor_status_snapshots`
- `monitor_events`
- `monitor_billing_records`

### 2. 协议能力复用现有 `channel type`

监控域本身独立，但探测执行应尽量复用：

- 现有 `channel type`
- 现有 relay/channel 协议兼容思路

也就是：

- 复用协议能力
- 不复用业务渠道存储实体

### 3. 平台与用户监控的归属区分

平台监控：

- `source_type = platform`
- 可配置是否公开
- 用于公开状态页与管理员完整状态中心

用户监控：

- `source_type = custom`
- `owner_user_id` 必填
- 默认 `visibility = private`
- 默认不能进入公开页

### 4. 用户自定义监控的计费方式

用户自定义监控不是平台免费探测，而是：

- 使用用户自己的 quota
- 执行前校验余额
- 执行后写 billing record
- run / snapshot / event / billing 在同一事务边界内保持一致

### 5. 当前产品形态

平台侧：

- `/status`
- `/console/status`

用户侧：

- `/console/monitor-targets`
- `/console/monitor-targets/new`
- `/console/monitor-targets/:id`

当前已经形成第一版闭环，但还不是最终形态。后续可继续增强：

- 更强时间窗口聚合
- 更完整 relay-pulse 风格展示
- 更完整通知中心
- 共享页
