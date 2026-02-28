# 🌸 花园种植游戏 — 待办事项清单

> 最后更新：2026-03-02

---

## 当前进度总览

| 类别 | 完成 / 总计 | 状态 |
|------|-------------|------|
| 核心玩法 | 12 / 12 | ✅ |
| 经济系统 | 8 / 8 | ✅ |
| UI 面板 | 10 / 10 | ✅ |
| 存档 & 校验 | 6 / 6 | ✅ |
| 特效动画 | 8 / 8 | ✅ |
| 批量操作 | 3 / 3 | ✅ |
| Bug 修复 | 3 / 3 | ✅ |
| 代码健壮性 | 3 / 3 | ✅ |
| 体验优化 | 5 / 5 | ✅ |
| 工程构建 | 5 / 5 | ✅ |
| 素材补全 | 30 / 30 | ✅ |
| 成就系统 | 1 / 1 | ✅ |
| 温室氛围 | 1 / 1 | ✅ |
| 内容扩展 | 0 / 2 | ⚪ 未来 |
| UI 打磨 | 1 / 3 | 🟡 |

---

## 一、待办项（按优先级排列）

### P0 — 无阻塞项 ✅

~~**种子图标缺失**~~：全部 30 种花朵的种子图标 `icon_seed_*.svg` 已补全，无遗留。

---

### P1 — 工程优化 ✅

- [x] **配置编辑器导入**：`tools/config-editor/index.html` 已支持 JSON 文本粘贴导入 + 文件上传导入
- [x] **`.editor-state.json` 加入 `.gitignore`**：`build/.gitignore` 已包含 `src/config/.editor-state.json`
- [x] **策划文档同步**：`design/game-design.md` §8.2 已修正为"1~3 种花组合（每种 2~5 朵），总计 3~10 朵"

---

### P2 — 内容扩展（设计驱动）

#### 6.1 花盆皮肤扩展
- [ ] 当前仅 2 款（经典赤陶 + 青花瓷），建议扩展 3~5 款
- [ ] 建议价格梯度：500 / 1000 / 2000 / 5000

#### 6.2 中后期目标
- [x] ~~成就系统~~ **已完成** → 28 个成就，5 大分类，独立面板 + 奖励领取 + Toast 通知
- [ ] 高级皮肤绑定玩家等级解锁
- [ ] 花园装饰物 / 背景主题切换（部分已实现：温室氛围系统）

---

### P3 — UI / 体验打磨

#### 7.1 音效系统
- [ ] 当前无任何音频
- [ ] 建议添加：播种落地声、浇水滴声、收割采摘声、升级提示音、背景音乐（可选，带开关）

#### 7.2 新手引导
- [ ] 首次进入游戏无提示，新玩家可能不知道操作流程
- [ ] 建议添加 3~5 步引导遮罩

#### 7.3 花棚背景丰富化 ✅
- [x] 背景拆分为双层（天空 + 玻璃花棚框架），室内第一人称透视
- [x] 昼夜系统：基于设备时间连续插值，6 个时段（破晓/清晨/正午/午后/黄昏/夜晚）
- [x] 天气系统：晴天/多云/雨天/雾天，20~50分钟随机轮换，localStorage 持久化
- [x] 装饰物：灰尘浮粒、蝴蝶（白天）、萤火虫（夜晚）、阳光光柱、玻璃水珠
- [x] 组件：`useAtmosphere` hook + `GreenhouseAtmosphere` 组件，性能优良（memo + useMemo）

#### 7.4 长屏幕滚动优化
- [ ] 4×7 花盆高度约 670px，短屏手机底部花盆可能被裁切
- [ ] 改为动态高度 + overflow-y 滚动

---

### P4 — 低优先级代码改进

- [ ] **harvestPot 残余闭包**：`usePots.ts` 中 `harvestPot` 的 `setPots` updater 内仍从闭包读取 `flowerLevels`，理论上并发渲染时可能读到旧值（极低概率，影响小）
- [ ] **useCooldown 冗余参数**：`_pots` 参数已加下划线但从未使用，可移除
- [ ] **订单过期倒计时增强**：订单即将过期时增加视觉警告（文字倒计时已有，可增加颜色/动画）

---

## 二、已完成项归档

<details>
<summary>点击展开全部已完成项（2026-03-02）</summary>

### 成就系统 ✅（2026-03-02 新增）
- [x] 28 个成就定义，5 大分类（种植/经济/收藏/里程碑/特殊）
- [x] `achievement.config.ts` 配置文件 + 类型定义
- [x] `useAchievements` Hook — 累计统计、自动检测、localStorage 持久化
- [x] `AchievementPanel` 组件 — 分类筛选、统计栏、奖励领取
- [x] `AchievementToastUI` — 解锁 Toast 通知动画
- [x] 成就追踪回调：播种/收获/订单/金币自动计入
- [x] 特殊隐藏成就：雨天收获、夜晚收获（联动天气/昼夜系统）
- [x] Toolbar 🏆 按钮 + 未领取红点提示
- [x] useGameState 胶水层集成（tracked callbacks 模式）

### 温室氛围系统 ✅（2026-03-01 新增）
- [x] 昼夜循环 + 天气效果 + 装饰物
- [x] `useAtmosphere` hook + `GreenhouseAtmosphere` 组件

### P1 工程优化 ✅
- [x] 配置编辑器导入功能（JSON 粘贴 + 文件上传）
- [x] .editor-state.json → .gitignore
- [x] game-design.md §8.2 同步

### P0 素材补全 ✅
- [x] 全部 30 种花朵的种子图标已生成（icon_seed_*.svg）

### Bug 修复 ✅
- [x] `INITIAL_COINS` / `INITIAL_WATER` 配置已与策划文档对齐
- [x] `harvestPot` 闭包风险修复 — 守卫判断移入 `setPots` updater，`pots` 不再从闭包读取
- [x] 花朵升级扣除顺序 — 先扣金币再扣魂，预检查保证两者充足

### 死代码清理 ✅
- [x] `growing` 状态已激活（浇水→5s嫩芽阶段→开花）
- [x] `PotState` 中的 `harvested` 已移除

### 代码健壮性 ✅
- [x] 拖拽阈值提取为 `DRAG_THRESHOLD_PX` 配置常量
- [x] `ErrorBoundary` 组件 — 捕获渲染异常 + 存档重置恢复
- [x] 存档数据完整校验 + 新花种自动迁移

### 体验优化 ✅
- [x] growing（嫩芽）阶段 — `growingUntil` 时间戳 + `GROWING_DURATION_MS` + 脉动动画
- [x] 离线进度补偿 — 水量恢复 + 花盆冷却/生长自动过期
- [x] 收购订单到达弹跳提醒 + 可完成订单红点
- [x] 花盆冷却进度条 — `pot-cooldown-bar` + `cooldownTotalMs`
- [x] 采购任务冷却进度条 — `task-cd-bar` + `task-cd-fill`

### 工程 ✅
- [x] GitHub 仓库：`dmxzxy/flowers`（main 分支）
- [x] 生产构建通过：CSS 56KB + JS 223KB（gzip ~79KB）
- [x] 配置编辑器（独立 HTML + Vite 插件 HMR + 导入/导出）
- [x] .gitignore 完善

### 核心功能 ✅ （全部实现）
- 花盆状态机（empty→seeded→growing→blooming→cooling）
- 30 种花朵 × 20 级升级 + 花卉之魂系统
- 金币 / 水量经济 + 采购任务 + 收购订单（多花种组合）
- 玩家等级系统（Lv.1~20 解锁内容）
- 花盆皮肤 + 花朵图鉴面板
- 批量浇水 / 收割 / 播种
- 拖拽播种 + 触摸交互适配
- 8 种特效粒子动画
- 个人资料菜单 + 存档管理
- 收购订单多花种 + 红点达成提示
- 成就系统（28 成就 + 5 分类 + 奖励领取 + 隐藏成就）
- 温室氛围（昼夜循环 + 天气系统 + 装饰物）

</details>

---

## 技术架构速览

```
build/src/
├── components/    26 个组件（含 ErrorBoundary + AchievementPanel）
├── hooks/         16 个领域 Hook（useGameState 统筹）
├── config/        game / flower / task / achievement 配置层
├── types/         TypeScript 类型定义
└── data/          静态数据（花朵 / 资产 / 任务）
```

**状态机**：`empty → seeded → growing(5s) → blooming → cooling → blooming … → empty`
**持久化**：localStorage，启动时校验 + 迁移 + 离线补偿
**成就系统**：独立 localStorage key `flowers_achievements`，28 成就 × 5 分类

**核心功能完成度：100%**
**Bug + 健壮性 + 体验优化：100%**
**P0 + P1 全部清零 ✅**
**剩余项目**：皮肤扩展（策划驱动）、音效（需素材）、新手引导、长屏适配。
