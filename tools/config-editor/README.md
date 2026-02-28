# 🌸 花朵游戏 - 配置编辑器

一个独立的 Web 工具，用于可视化编辑花朵游戏的所有配置数值，并导出为 TypeScript 文件。

## 使用方法

直接用浏览器打开 `index.html` 即可，无需安装任何依赖或构建。

```bash
# 方法1: 直接双击 index.html
# 方法2: 用 VS Code 的 Live Server / Simple Browser 打开
# 方法3: 命令行
start index.html          # Windows
open index.html           # macOS
xdg-open index.html       # Linux
```

## 功能模块

| 标签页 | 功能说明 |
|--------|----------|
| ⚙️ **全局配置** | 花盆网格、水量参数、金币、收购订单、拖拽阈值 |
| 🌷 **花朵品种** | 新增/编辑/删除花朵品种（ID、名称、颜色、基础售价） |
| ⬆️ **花朵等级** | 编辑 20 级属性表（收割次数、产量、冷却、升级费用） |
| 👤 **玩家等级** | 玩家等级 XP 需求、每级解锁花朵（勾选框） |
| 🛒 **采购任务** | 任务生成参数、奖励倍率、冷却时间 |
| 🪴 **花盆皮肤** | 皮肤管理（ID、名称、描述、图片路径、解锁费用） |
| 📦 **导出配置** | 生成 TypeScript 文件 / 导出全部 JSON |

## 导出文件

点击「导出配置」标签页生成对应的 TypeScript 代码，复制后替换项目中的文件：

| 按钮 | 生成文件 | 对应项目路径 |
|------|----------|-------------|
| `game.config.ts` | 全局配置 + 花盆皮肤 | `build/src/config/game.config.ts` |
| `flower.config.ts` | 花朵品种 + 等级 + 玩家等级 + 任务参数 | `build/src/config/flower.config.ts` |
| `types/index.ts` | FlowerType / PotSkinId 类型定义 | `build/src/types/index.ts` |
| `导出全部 (JSON)` | 完整状态的 JSON 快照 | 用于备份或在不同机器间迁移 |

## 数据暂存

- **💾 暂存**: 将当前编辑状态保存到浏览器 `localStorage`
- **📂 读取暂存**: 从 `localStorage` 恢复上次保存的编辑状态
- 打开页面时会自动检测是否有暂存数据

## 新增花朵的完整流程

1. 在「花朵品种」标签页点击 **➕ 新增花朵**
2. 填写 ID（英文，如 `lily`）、名称、颜色、基础售价
3. 切到「玩家等级」标签页，勾选新花朵在哪一级解锁
4. 导出 `flower.config.ts` 和 `types/index.ts`，替换项目文件
5. 准备 4 张 SVG 素材放到 `build/public/art/flower/`：
   - `flower_{id}_seed.svg`
   - `flower_{id}_sprout.svg`
   - `flower_{id}_growing.svg`
   - `flower_{id}_bloom.svg`

## 技术说明

- 纯前端单文件，无依赖、无构建步骤
- 使用原生 HTML + CSS + JavaScript
- 数据存储在内存中的 `state` 对象，通过 `localStorage` 持久化
- 导出的 TypeScript 代码与现有配置文件结构完全一致，可直接替换
