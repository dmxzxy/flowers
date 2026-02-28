# 素材清单 - 花园种植游戏 MVP

## 1. 命名规范

- 全部小写
- 用下划线 `_` 分隔
- 格式：PNG，透明背景

## 2. 素材清单

### 2.1 背景

| 文件名 | 尺寸 | 用途 |
|--------|------|------|
| `bg_greenhouse.png` | 1920×1080 | 花棚背景+天空 |

### 2.2 花盆

| 文件名 | 尺寸 | 数量 | 用途 |
|--------|------|------|------|
| `pot_default.png` | 256×256 | 1 | 默认花盆 |

### 2.3 花朵

每个花朵4个状态，共16张：

| 种子 | 种子 | 嫩芽 | 成长中 | 开花 |
|------|------|------|--------|------|
| 玫瑰 | `flower_rose_seed.png` | `flower_rose_sprout.png` | `flower_rose_growing.png` | `flower_rose_bloom.png` |
| 郁金香 | `flower_tulip_seed.png` | `flower_tulip_sprout.png` | `flower_tulip_growing.png` | `flower_tulip_bloom.png` |
| 雏菊 | `flower_daisy_seed.png` | `flower_daisy_sprout.png` | `flower_daisy_growing.png` | `flower_daisy_bloom.png` |
| 向日葵 | `flower_sunflower_seed.png` | `flower_sunflower_sprout.png` | `flower_sunflower_growing.png` | `flower_sunflower_bloom.png` |

尺寸：256×256 像素/张

### 2.4 UI元素

| 文件名 | 尺寸 | 用途 |
|--------|------|------|
| `seed_panel.png` | 600×400 | 种子选择面板背景 |
| `icon_water.png` | 64×64 | 浇水按钮/水壶图标 |
| `icon_seed_rose.png` | 64×64 | 玫瑰种子图标 |
| `icon_seed_tulip.png` | 64×64 | 郁金香种子图标 |
| `icon_seed_daisy.png` | 64×64 | 雏菊种子图标 |
| `icon_seed_sunflower.png` | 64×64 | 向日葵种子图标 |

## 3. 目录结构

```
art/
├── background/
│   └── bg_greenhouse.png
├── pot/
│   └── pot_default.png
├── flower/
│   ├── flower_rose_seed.png
│   ├── flower_rose_sprout.png
│   ├── flower_rose_growing.png
│   ├── flower_rose_bloom.png
│   ├── flower_tulip_seed.png
│   ├── flower_tulip_sprout.png
│   ├── flower_tulip_growing.png
│   ├── flower_tulip_bloom.png
│   ├── flower_daisy_seed.png
│   ├── flower_daisy_sprout.png
│   ├── flower_daisy_growing.png
│   ├── flower_daisy_bloom.png
│   ├── flower_sunflower_seed.png
│   ├── flower_sunflower_sprout.png
│   ├── flower_sunflower_growing.png
│   └── flower_sunflower_bloom.png
└── ui/
    ├── seed_panel.png
    ├── icon_water.png
    ├── icon_seed_rose.png
    ├── icon_seed_tulip.png
    ├── icon_seed_daisy.png
    └── icon_seed_sunflower.png
```

## 4. 格式要求

- **图片格式**：PNG
- **背景**：透明
- **分辨率**：1024×1024 高清（可按比例缩放）
- **风格**：清新卡通，统一色调
