# 花园种植游戏 — 当前策划案（基于代码梳理）

> 最后更新：2026-02-28，基于实际代码逻辑整理，覆盖所有已实现功能

---

## 一、游戏概述

| 项目 | 描述 |
|------|------|
| 类型 | 2D 休闲经营类手游（网页端） |
| 技术栈 | Vite + React 18 + TypeScript |
| 目标平台 | 移动浏览器（微信/Safari），兼容桌面 |
| 核心循环 | 播种 → 浇水 → 开花 → 收获 → 出售/交付 → 升级 → 播种 |
| 美术风格 | 粉紫色少女系 UI + SVG 矢量花朵素材 |

---

## 二、核心系统

### 2.1 花盆网格

| 参数 | 值 |
|------|-----|
| 布局 | 4 列 × 7 行 = 28 个花盆 |
| 花盆状态 | `empty` → `seeded` → `blooming` → (`cooling` ↔ `blooming`) → `empty` |
| 交互方式 | 点击弹出操作面板 / 拖拽批量操作 |

**花盆状态机：**

```
empty ──[播种]──▶ seeded ──[浇水]──▶ blooming ──[收获]──▶ empty
                                        │
                                        ▼ (剩余收割次数 > 0 且有冷却)
                                     cooling ──[冷却结束]──▶ blooming
```

### 2.2 花朵品种

共 **10 种**花朵，每种 4 个生长阶段 SVG：

| ID | 名称 | 颜色 |
|----|------|------|
| rose | 玫瑰 | #E74C3C |
| tulip | 郁金香 | #F1C40F |
| daisy | 雏菊 | #FFFFFF |
| sunflower | 向日葵 | #F39C12 |
| lavender | 薰衣草 | #9B59B6 |
| orchid | 兰花 | #8E44AD |
| peony | 牡丹 | #FFB6C1 |
| carnation | 康乃馨 | #FF69B4 |
| chrysanthemum | 菊花 | #DDA0DD |
| hibiscus | 扶桑 | #FF6347 |

生长阶段（SVG 状态映射）：

| 花盆状态 | 显示阶段 |
|---------|---------|
| seeded | seed（种子） |
| growing | growing（成长中） |
| blooming | bloom（开花） |
| cooling | growing（回到成长态） |

### 2.3 货币系统

| 货币 | 初始值 | 上限 | 用途 |
|------|--------|------|------|
| 金币 (coins) | 0 | 无上限 | 升级花朵、购买水、被动收入 |
| 水量 (water) | 100 | 100 | 浇水消耗 1/次 |

**水量自动恢复：** 每 10 秒 +1，上限 100

### 2.4 花朵等级系统

每种花朵独立等级（1~5），升级需金币：

| 等级 | 最大收割次数 | 冷却时间 | 升级费用 |
|------|------------|---------|---------|
| Lv.1 | 1 次 | 0 秒 | 50 金币 |
| Lv.2 | 2 次 | 30 秒 | 150 金币 |
| Lv.3 | 3 次 | 20 秒 | 300 金币 |
| Lv.4 | 4 次 | 15 秒 | 500 金币 |
| Lv.5 | 5 次 | 10 秒 | MAX |

- 升级后新播种的花盆获得新等级的收割次数
- 收割后若剩余次数 > 0 且冷却 > 0 → 进入 `cooling` 状态
- 冷却结束自动回到 `blooming`

---

## 三、经济系统

### 3.1 采购任务（固定任务列表）

| 任务 ID | 名称 | 消耗 | 奖励 |
|---------|------|------|------|
| retail_order | 零售订单 | 5 朵任意花 | 💧8 |
| water_supply | 水资源补给 | 30 金币 | 💧15 |
| festival_bouquet | 节日花束 | 3 玫瑰 + 3 郁金香 | 60 金币 + 💧2 |
| garden_party | 花园派对 | 2 雏菊 + 2 向日葵 + 2 薰衣草 | 80 金币 |
| luxury_arrangement | 豪华花艺 | 2 兰花 + 2 牡丹 + 2 康乃馨 | 100 金币 + 💧3 |
| flower_exhibition | 花卉展览 | 10 种花各 1 朵 | 200 金币 + 💧5 |

### 3.2 随机收购订单

| 参数 | 值 |
|------|-----|
| 生成间隔 | 45 秒（首次 10 秒） |
| 有效期 | 30 秒 |
| 收购花种 | 随机 10 种之一 |
| 收购数量 | 1~4 朵 |
| 单价范围 | 8~25 金币/朵 |
| 同时最多 | 1 个有效订单 |

---

## 四、交互设计

### 4.1 操作方式（双模式）

**点击模式：**
1. 点击花盆 → 根据状态弹出对应 Picker
   - 空花盆 → FlowerPicker（选花品种）
   - 已播种/生长中 → WaterPicker（浇水）
   - 已开花 → HarvestPicker（收割）
2. 点击 Picker 中的按钮 → 执行操作

**拖拽模式：**
1. 在 Picker 中按住按钮并滑过花盆
2. 经过的每个花盆自动执行操作（去重，每盆最多一次）
3. 松手结束拖拽

### 4.2 移动端触摸适配

- **tap-vs-drag 检测**：触摸阈值 8px
  - 触摸移动 < 8px → 视为点击（tap）
  - 触摸移动 ≥ 8px → 视为拖拽（drag）
- **picker 隐藏策略**：拖拽时 `visibility: hidden`（保留 DOM 防止 `touchcancel`）
- `touch-action: none` 全局禁用浏览器手势
- `overscroll-behavior: none` 防止下拉刷新

### 4.3 UI 面板

| 面板 | 入口 | 功能 |
|------|------|------|
| 仓库 📦 | 工具栏按钮 | 查看各花朵库存 |
| 采购任务 🛒 | 工具栏按钮 | 交付花朵换取金币/水 |
| 花朵升级 ⬆️ | 工具栏按钮 | 花金币提升花朵等级 |

**顶部状态栏：** 金币数 + 水量/上限（带水不足警告）

---

## 五、特效系统

基于 **队列化并行渲染** 的特效系统，所有特效通过 `pushEffect`/`removeEffect` 管理：

| 特效类型 | 触发时机 | 时长 | 表现 |
|---------|---------|------|------|
| seed | 播种 | 600ms | 🌱 种子从上方掉落到花盆 |
| water | 浇水 | 800ms | 💧 水滴涟漪扩散 |
| harvest | 收割 | 1000ms | 10 个粒子飞向仓库按钮 + "+1" |
| levelup | 升级 | 1200ms | 12 颗星星爆发 + "LEVEL UP!" |
| task | 任务完成 | 1600ms | ✓ 弹出 + 奖励飘字 + 光圈 + 16 粒子 |

**技术要点：** 所有特效组件使用 `onCompleteRef` 模式避免 React 18 strict mode 下的重复触发。

---

## 六、文件结构与模块划分

```
build/src/
├── types/index.ts          # 所有 TypeScript 类型定义
├── data/
│   ├── assets.ts           # 静态资源路径
│   ├── flowers.ts          # 花朵配置 + 等级配置
│   └── tasks.ts            # 采购任务配置
├── hooks/
│   ├── useGameState.ts     # 主状态 Hook（439行，承担几乎所有逻辑）
│   ├── useFlower.ts        # 花朵图片映射工具
│   └── useCooldown.ts      # 冷却倒计时定时器
├── components/
│   ├── GameScene.tsx        # 主场景 + 拖拽系统（~370行）
│   ├── Pot.tsx              # 单个花盆组件
│   ├── PotGrid.tsx          # 花盆网格容器
│   ├── FlowerPicker.tsx     # 花朵选择弹窗
│   ├── WaterPicker.tsx      # 浇水操作弹窗
│   ├── HarvestPicker.tsx    # 收割操作弹窗
│   ├── Toolbar.tsx          # 工具栏（仓库/采购/升级入口）
│   ├── CurrencyBar.tsx      # 顶部金币/水量状态栏
│   ├── InventoryPanel.tsx   # 仓库面板
│   ├── PurchasePanel.tsx    # 采购任务面板
│   ├── FlowerLevelPanel.tsx # 花朵升级面板
│   ├── DragIndicator.tsx    # 拖拽跟手图标
│   ├── BuyOrderBanner.tsx   # 随机收购订单横幅
│   ├── SeedEffect.tsx       # 播种特效
│   ├── WaterEffect.tsx      # 浇水特效
│   ├── HarvestEffect.tsx    # 收割特效
│   ├── LevelUpEffect.tsx    # 升级特效
│   └── TaskCompleteEffect.tsx # 任务完成特效
├── App.tsx                  # 入口组件
├── App.css                  # 全局样式（~2400行）
└── main.tsx                 # React 渲染入口
```

---

## 七、已知架构问题 & 扩展瓶颈

| 问题 | 描述 |
|------|------|
| `useGameState` 过度膨胀 | 439 行单 Hook 包含：pots/inventory/currency/effects/buyOrder/flowerLevels/picker state 所有逻辑 |
| `GameScene` 职责过重 | 370 行组件同时负责：拖拽系统 + UI 开关 + 特效渲染 + 面板挂载 |
| 配置散落 | 游戏数值（网格大小、水量、收购参数）分散在 useGameState 国部常量中 |
| 无持久化 | 所有状态内存态，刷新即丢失 |
| CSS 单文件 | 2400 行全局 CSS 无模块化 |
| 无音效 | 所有交互缺少音效反馈 |
| 无引导 | 新手无教程/引导 |
