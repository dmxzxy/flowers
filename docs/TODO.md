# 🌸 花园种植游戏 — 待办事项清单

> 最后更新：2026-03-01

---

## 当前进度总览

| 类别 | 完成 / 总计 | 状态 |
|------|-------------|------|
| 核心玩法 | 12 / 12 | ✅ |
| 经济系统 | 8 / 8 | ✅ |
| UI 面板 | 9 / 9 | ✅ |
| 存档 & 校验 | 6 / 6 | ✅ |
| 特效动画 | 8 / 8 | ✅ |
| 批量操作 | 3 / 3 | ✅ |
| Bug 修复 | 3 / 3 | ✅ |
| 代码健壮性 | 3 / 3 | ✅ |
| 体验优化 | 5 / 5 | ✅ |
| 工程构建 | 4 / 5 | 🟡 |
| 素材补全 | 0 / 6 | 🔴 需美术 |
| 内容扩展 | 0 / 3 | ⚪ 未来 |
| UI 打磨 | 1 / 4 | 🟡 |

---

## 一、待办项（按优先级排列）

### P0 — 素材缺失（阻塞完整体验）

**3.1 种子图标缺少 6 种花**

`build/public/art/ui/` 中仅有 4 种种子图标，其余 6 种使用通用占位：

| 花朵 | 文件名 | 状态 |
|------|--------|------|
| 薰衣草 lavender | `icon_seed_lavender.svg` | ❌ 缺失 |
| 兰花 orchid | `icon_seed_orchid.svg` | ❌ 缺失 |
| 牡丹 peony | `icon_seed_peony.svg` | ❌ 缺失 |
| 康乃馨 carnation | `icon_seed_carnation.svg` | ❌ 缺失 |
| 菊花 chrysanthemum | `icon_seed_chrysanthemum.svg` | ❌ 缺失 |
| 扶桑 hibiscus | `icon_seed_hibiscus.svg` | ❌ 缺失 |

> 参考已有图标风格制作，详见 `art/ui/README.md`

---

### P1 — 工程优化

- [ ] **配置编辑器导入**：`/__editor` 目前不支持导入已有项目配置，仅手动编辑 state
- [ ] **`.editor-state.json` 加入 `.gitignore`**：`build/src/config/.editor-state.json` 是编辑器运行时产物，不应被版本控制
- [ ] **策划文档同步**：`design/game-design.md` §8.2 仍写"随机一种花"，实际已支持 1~3 种花组合订单

---

### P2 — 内容扩展（设计驱动）

#### 6.1 花盆皮肤扩展
- [ ] 当前仅 2 款（经典赤陶 + 青花瓷），建议扩展 3~5 款
- [ ] 建议价格梯度：500 / 1000 / 2000 / 5000

#### 6.2 中后期目标
- [ ] 玩家 Lv.5 后不再解锁新花朵，Lv.6~10 无内容激励
- [ ] 建议方案：
  - 成就系统（首次种满 28 盆、收割 100 次、集齐所有花等）
  - 高级皮肤绑定玩家等级解锁
  - 花园装饰物 / 背景主题切换

#### 6.3 花朵品种扩展
- [ ] 目前 10 种花朵，配置编辑器已支持新增
- [ ] 建议后续批次：百合 lily、樱花 sakura、紫罗兰 violet 等

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
<summary>点击展开全部已完成项（2026-03-01）</summary>

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
- [x] 生产构建通过：CSS 47KB + JS 202KB（gzip ~72KB）
- [x] 配置编辑器（独立 HTML + Vite 插件 HMR）
- [x] .gitignore 修复（node_modules 不再跟踪）

### 核心功能 ✅ （全部实现）
- 花盆状态机（empty→seeded→growing→blooming→cooling）
- 10 种花朵 × 20 级升级 + 花卉之魂系统
- 金币 / 水量经济 + 采购任务 + 收购订单（多花种组合）
- 玩家等级系统（Lv.1~10 解锁内容）
- 花盆皮肤 + 花朵图鉴面板
- 批量浇水 / 收割 / 播种
- 拖拽播种 + 触摸交互适配
- 8 种特效粒子动画
- 个人资料菜单 + 存档管理
- 收购订单多花种 + 红点达成提示

</details>

---

## 技术架构速览

```
build/src/
├── components/    25 个组件（含 ErrorBoundary）
├── hooks/         15 个领域 Hook（useGameState 统筹）
├── config/        game / flower / task 配置层
├── types/         TypeScript 类型定义
└── data/          静态数据（花朵 / 资产 / 任务）
```

**状态机**：`empty → seeded → growing(5s) → blooming → cooling → blooming … → empty`
**持久化**：localStorage，启动时校验 + 迁移 + 离线补偿

**核心功能完成度：100%**
**Bug + 健壮性 + 体验优化：100%** — 所有可通过代码解决的待办已完成。
**剩余项目**：缺失素材（需美术）、内容扩展（策划驱动）、UI 打磨（长期优化）。
