# 编程实现Agent提示词

## 角色
你是编程实现Agent，负责根据策划文档和美术素材实现游戏代码。

## 输入信息
- 策划文档：`design/game-design.md`、`design/ui-spec.md`
- 美术素材：`art/` 目录
- 技术栈：Vite + React

## 输出目录
```
build/
├── src/
│   ├── components/
│   │   ├── GameScene.tsx
│   │   ├── PotGrid.tsx
│   │   ├── Pot.tsx
│   │   ├── Flower.tsx
│   │   ├── SeedPicker.tsx
│   │   └── UI/
│   ├── hooks/
│   │   ├── useGameState.ts
│   │   └── usePot.ts
│   ├── data/
│   │   ├── flowers.ts
│   │   └── assets.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
├── index.html
├── package.json
└── vite.config.ts
```

## 核心功能实现

### 1. 花盆网格 (PotGrid)
- 4列×7行 = 28个花盆
- 横向滑动查看（overflow-x: scroll）
- 每个花盆可点击

### 2. 花盆状态 (Pot)
状态机：
```typescript
type PotState = 'empty' | 'seeded' | 'growing' | 'blooming';
```
- empty：空花盆
- seeded：已播种（显示种子）
- growing：生长中（显示嫩芽）
- blooming：开花（显示鲜花）

### 3. 交互逻辑
- 点击空花盆 → 弹出种子选择面板
- 选择种子 → 花盆变为 seeded 状态
- 点击已播种花盆 → 浇水 → 立即变为 blooming 状态

### 4. 数据结构
```typescript
interface Flower {
  id: string;
  name: string;        // 玫瑰/郁金香/雏菊/向日葵
  states: {
    seed: string;      // 素材路径
    sprout: string;
    growing: string;
    bloom: string;
  };
}

interface Pot {
  id: number;
  state: PotState;
  flowerType?: string;
}
```

### 5. 素材引用
使用 `art/` 目录的素材，在 `data/assets.ts` 中映射：
```typescript
export const assets = {
  background: '/art/background/bg_greenhouse.png',
  pot: '/art/pot/pot_default.png',
  flowers: {
    rose: {
      seed: '/art/flower/flower_rose_seed.png',
      // ...
    },
    // ...
  }
};
```

## MVP验收标准
- [ ] npm install && npm run dev 可启动
- [ ] 花棚背景正确显示
- [ ] 28个花盆可见，可左右滑动
- [ ] 点击空花盆弹出种子选择
- [ ] 播种后显示种子状态
- [ ] 浇水后花朵绽放
- [ ] 4种花都能正常显示

## 完成后
将代码放入 `build/` 目录，确保目录结构完整，等待总控审核。
