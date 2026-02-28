# 代码架构重构方案

> 目标：将单体 useGameState (439行) 和 GameScene (370行) 拆分为职责单一的模块，提取配置，为扩展打基础

---

## 重构后目录结构

```
build/src/
├── config/                      # ⭐ 新增：所有游戏数值配置
│   ├── index.ts                 #   统一导出
│   ├── game.config.ts           #   网格/水量/计时器 等全局配置
│   ├── flower.config.ts         #   花朵品种 + 等级 配置
│   └── task.config.ts           #   采购任务 + 收购订单 配置
│
├── types/
│   └── index.ts                 #   (保持不变)
│
├── hooks/
│   ├── useGameState.ts          # ⭐ 瘦身：仅做 orchestrator，组合子 hooks
│   ├── usePots.ts               # ⭐ 新增：花盆状态 + plantSeed/waterPot/harvestPot
│   ├── useCurrency.ts           # ⭐ 新增：金币/水量 + 水量自动恢复
│   ├── useInventory.ts          # ⭐ 新增：仓库 CRUD
│   ├── useFlowerLevels.ts       # ⭐ 新增：花朵等级 + upgradeFlower
│   ├── useEffects.ts            # ⭐ 新增：特效队列 pushEffect/removeEffect
│   ├── useBuyOrder.ts           # ⭐ 新增：随机收购订单生成/接受/拒绝
│   ├── usePurchaseTasks.ts      # ⭐ 新增：采购任务 canComplete/complete
│   ├── usePickers.ts            # ⭐ 新增：Picker 开关状态 + handlePotClick
│   ├── useCooldown.ts           #   (保持不变)
│   └── useFlower.ts             #   (保持不变)
│
├── components/                  #   (组件文件不变, GameScene 瘦身)
│   └── ...
└── ...
```

## 拆分原则

1. **config 层**：纯数值，不含逻辑，方便策划调整
2. **hooks 层**：每个 hook 管理一个独立领域的状态和操作
3. **useGameState**：仅做 "胶水层"，组合所有子 hooks，返回统一 API
4. **GameScene**：只负责渲染和事件分发，不含业务逻辑
