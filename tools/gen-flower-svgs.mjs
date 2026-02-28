/**
 * Generate SVG art for 20 new flower types (4 states each + 1 seed icon)
 * Run: node tools/gen-flower-svgs.mjs
 */
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const FLOWER_DIR = join(import.meta.dirname, '..', 'build', 'public', 'art', 'flower');
const UI_DIR = join(import.meta.dirname, '..', 'build', 'public', 'art', 'ui');

mkdirSync(FLOWER_DIR, { recursive: true });
mkdirSync(UI_DIR, { recursive: true });

// 20 new flowers: id, chinese name, primary color, secondary color, accent color
const NEW_FLOWERS = [
  { id: 'lily',        name: '百合',   c1: '#F8BBD0', c2: '#F48FB1', c3: '#EC407A' },
  { id: 'sakura',      name: '樱花',   c1: '#FFB7C5', c2: '#FF8FA3', c3: '#D81B60' },
  { id: 'violet',      name: '紫罗兰', c1: '#B39DDB', c2: '#9575CD', c3: '#5E35B1' },
  { id: 'jasmine',     name: '茉莉',   c1: '#FFFDE7', c2: '#FFF9C4', c3: '#F9A825' },
  { id: 'iris',        name: '鸢尾',   c1: '#90CAF9', c2: '#42A5F5', c3: '#1565C0' },
  { id: 'camellia',    name: '山茶',   c1: '#EF5350', c2: '#E53935', c3: '#B71C1C' },
  { id: 'magnolia',    name: '玉兰',   c1: '#FFF8E1', c2: '#FFE0B2', c3: '#E65100' },
  { id: 'gardenia',    name: '栀子',   c1: '#FFFFF0', c2: '#FFFACD', c3: '#FFD54F' },
  { id: 'wisteria',    name: '紫藤',   c1: '#CE93D8', c2: '#AB47BC', c3: '#7B1FA2' },
  { id: 'plumeria',    name: '鸡蛋花', c1: '#FFF8E1', c2: '#FFE082', c3: '#FF6F00' },
  { id: 'lotus',       name: '莲花',   c1: '#F8BBD0', c2: '#F06292', c3: '#AD1457' },
  { id: 'azalea',      name: '杜鹃',   c1: '#FF80AB', c2: '#FF4081', c3: '#C51162' },
  { id: 'hydrangea',   name: '绣球',   c1: '#90CAF9', c2: '#64B5F6', c3: '#1976D2' },
  { id: 'freesia',     name: '小苍兰', c1: '#FFF176', c2: '#FFD54F', c3: '#F57F17' },
  { id: 'anemone',     name: '银莲花', c1: '#EF9A9A', c2: '#EF5350', c3: '#B71C1C' },
  { id: 'dahlia',      name: '大丽花', c1: '#FFAB91', c2: '#FF7043', c3: '#BF360C' },
  { id: 'marigold',    name: '万寿菊', c1: '#FFE082', c2: '#FFB300', c3: '#E65100' },
  { id: 'zinnia',      name: '百日草', c1: '#F48FB1', c2: '#EC407A', c3: '#880E4F' },
  { id: 'bluebell',    name: '风信子', c1: '#9FA8DA', c2: '#7986CB', c3: '#303F9F' },
  { id: 'moonflower',  name: '月光花', c1: '#E8EAF6', c2: '#C5CAE9', c3: '#3F51B5' },
];

function genSeed(id, name) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <!-- ${name}-种子 -->
  <ellipse cx="128" cy="180" rx="40" ry="15" fill="#8B4513"/>
  <circle cx="128" cy="175" r="8" fill="#654321"/>
</svg>`;
}

function genSprout(id, name) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <!-- ${name}-嫩芽 -->
  <path d="M128 180 Q125 150 128 130" stroke="#228B22" stroke-width="4" fill="none"/>
  <ellipse cx="122" cy="125" rx="8" ry="12" fill="#32CD32"/>
  <ellipse cx="134" cy="125" rx="8" ry="12" fill="#32CD32"/>
</svg>`;
}

function genGrowing(id, name) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <!-- ${name}-成长中 -->
  <path d="M128 200 Q120 150 128 100" stroke="#228B22" stroke-width="6" fill="none"/>
  <ellipse cx="115" cy="130" rx="15" ry="25" fill="#32CD32" transform="rotate(-30 115 130)"/>
  <ellipse cx="141" cy="130" rx="15" ry="25" fill="#32CD32" transform="rotate(30 141 130)"/>
  <ellipse cx="115" cy="100" rx="12" ry="20" fill="#32CD32" transform="rotate(-20 115 100)"/>
  <ellipse cx="141" cy="100" rx="12" ry="20" fill="#32CD32" transform="rotate(20 141 100)"/>
</svg>`;
}

// Different bloom shapes for variety
function genBloom(id, name, c1, c2, c3, idx) {
  const stemW = 5 + (idx % 3);
  const variant = idx % 5;
  
  const stems = `<path d="M128 200 Q${124 + idx % 8} 150 128 ${110 + (idx % 20)}" stroke="#228B22" stroke-width="${stemW}" fill="none"/>`;
  const leaves = `<ellipse cx="${95 + (idx % 10)}" cy="${145 + idx % 15}" rx="20" ry="10" fill="#228B22" transform="rotate(-30 ${95 + (idx % 10)} ${145 + idx % 15})"/>
  <ellipse cx="${155 - (idx % 10)}" cy="${145 + idx % 15}" rx="20" ry="10" fill="#228B22" transform="rotate(30 ${155 - (idx % 10)} ${145 + idx % 15})"/>`;

  let petals;
  
  if (variant === 0) {
    // Rose-like: overlapping rounded petals
    petals = `<ellipse cx="128" cy="75" rx="30" ry="38" fill="${c1}"/>
  <ellipse cx="105" cy="85" rx="25" ry="32" fill="${c2}" transform="rotate(-20 105 85)"/>
  <ellipse cx="151" cy="85" rx="25" ry="32" fill="${c2}" transform="rotate(20 151 85)"/>
  <ellipse cx="112" cy="68" rx="18" ry="26" fill="${c1}" transform="rotate(-10 112 68)"/>
  <ellipse cx="144" cy="68" rx="18" ry="26" fill="${c1}" transform="rotate(10 144 68)"/>
  <circle cx="128" cy="78" r="10" fill="${c3}"/>
  <circle cx="125" cy="75" r="2.5" fill="${c1}"/>
  <circle cx="131" cy="75" r="2.5" fill="${c1}"/>`;
  } else if (variant === 1) {
    // Star-like: radiating petals
    petals = `<ellipse cx="128" cy="45" rx="14" ry="30" fill="${c1}"/>
  <ellipse cx="128" cy="115" rx="14" ry="30" fill="${c1}"/>
  <ellipse cx="78" cy="80" rx="14" ry="30" fill="${c2}" transform="rotate(-60 78 80)"/>
  <ellipse cx="178" cy="80" rx="14" ry="30" fill="${c2}" transform="rotate(60 178 80)"/>
  <ellipse cx="93" cy="52" rx="14" ry="28" fill="${c1}" transform="rotate(-30 93 52)"/>
  <ellipse cx="163" cy="52" rx="14" ry="28" fill="${c1}" transform="rotate(30 163 52)"/>
  <circle cx="128" cy="80" r="16" fill="${c3}"/>
  <circle cx="123" cy="76" r="3" fill="${c2}"/>
  <circle cx="133" cy="76" r="3" fill="${c2}"/>
  <circle cx="128" cy="84" r="3" fill="${c2}"/>`;
  } else if (variant === 2) {
    // Bell-like: drooping petals
    petals = `<ellipse cx="128" cy="85" rx="35" ry="25" fill="${c1}"/>
  <ellipse cx="128" cy="65" rx="28" ry="30" fill="${c2}"/>
  <path d="M100 85 Q108 110 128 115 Q148 110 156 85" fill="${c1}"/>
  <ellipse cx="115" cy="60" rx="18" ry="22" fill="${c1}" transform="rotate(-15 115 60)"/>
  <ellipse cx="141" cy="60" rx="18" ry="22" fill="${c1}" transform="rotate(15 141 60)"/>
  <circle cx="128" cy="70" r="8" fill="${c3}"/>
  <circle cx="125" cy="68" r="2" fill="${c1}"/>
  <circle cx="131" cy="68" r="2" fill="${c1}"/>`;
  } else if (variant === 3) {
    // Cluster: multiple small flowers
    petals = `<!-- cluster left -->
  <circle cx="108" cy="75" r="15" fill="${c1}"/>
  <circle cx="108" cy="75" r="8" fill="${c2}"/>
  <circle cx="108" cy="75" r="4" fill="${c3}"/>
  <!-- cluster center -->
  <circle cx="128" cy="65" r="18" fill="${c2}"/>
  <circle cx="128" cy="65" r="10" fill="${c1}"/>
  <circle cx="128" cy="65" r="5" fill="${c3}"/>
  <!-- cluster right -->
  <circle cx="148" cy="75" r="15" fill="${c1}"/>
  <circle cx="148" cy="75" r="8" fill="${c2}"/>
  <circle cx="148" cy="75" r="4" fill="${c3}"/>
  <!-- cluster top -->
  <circle cx="118" cy="55" r="12" fill="${c2}"/>
  <circle cx="118" cy="55" r="6" fill="${c1}"/>
  <circle cx="138" cy="55" r="12" fill="${c2}"/>
  <circle cx="138" cy="55" r="6" fill="${c1}"/>`;
  } else {
    // Trumpet-like: funnel shape
    petals = `<ellipse cx="128" cy="55" rx="20" ry="35" fill="${c1}"/>
  <ellipse cx="105" cy="75" rx="25" ry="20" fill="${c2}" transform="rotate(-25 105 75)"/>
  <ellipse cx="151" cy="75" rx="25" ry="20" fill="${c2}" transform="rotate(25 151 75)"/>
  <path d="M108 65 Q128 45 148 65 Q138 90 128 95 Q118 90 108 65Z" fill="${c1}"/>
  <ellipse cx="128" cy="70" rx="12" ry="18" fill="${c2}"/>
  <circle cx="128" cy="65" r="6" fill="${c3}"/>
  <circle cx="125" cy="63" r="2" fill="${c1}"/>
  <circle cx="131" cy="63" r="2" fill="${c1}"/>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <!-- ${name}-开花 -->
  ${stems}
  ${petals}
  ${leaves}
</svg>`;
}

function genSeedIcon(id, name, c1, c2) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <!-- ${name}种子图标 -->
  <circle cx="32" cy="32" r="24" fill="${c1}"/>
  <circle cx="32" cy="32" r="18" fill="${c2}"/>
  <path d="M32 20 L32 44" stroke="${c1}" stroke-width="2"/>
  <path d="M20 32 L44 32" stroke="${c1}" stroke-width="2"/>
</svg>`;
}

let count = 0;
for (let i = 0; i < NEW_FLOWERS.length; i++) {
  const f = NEW_FLOWERS[i];
  
  // 4 flower states
  writeFileSync(join(FLOWER_DIR, `flower_${f.id}_seed.svg`), genSeed(f.id, f.name));
  writeFileSync(join(FLOWER_DIR, `flower_${f.id}_sprout.svg`), genSprout(f.id, f.name));
  writeFileSync(join(FLOWER_DIR, `flower_${f.id}_growing.svg`), genGrowing(f.id, f.name));
  writeFileSync(join(FLOWER_DIR, `flower_${f.id}_bloom.svg`), genBloom(f.id, f.name, f.c1, f.c2, f.c3, i));
  
  // Seed icon
  writeFileSync(join(UI_DIR, `icon_seed_${f.id}.svg`), genSeedIcon(f.id, f.name, f.c1, f.c2));
  
  count += 5;
}

// Also generate the 6 missing seed icons for existing flowers
const MISSING_EXISTING = [
  { id: 'lavender',       name: '薰衣草', c1: '#9B59B6', c2: '#8E44AD' },
  { id: 'orchid',         name: '兰花',   c1: '#8E44AD', c2: '#6A1B9A' },
  { id: 'peony',          name: '牡丹',   c1: '#FFB6C1', c2: '#FF69B4' },
  { id: 'carnation',      name: '康乃馨', c1: '#FF69B4', c2: '#E91E63' },
  { id: 'chrysanthemum',  name: '菊花',   c1: '#DDA0DD', c2: '#BA68C8' },
  { id: 'hibiscus',       name: '扶桑',   c1: '#FF6347', c2: '#E53935' },
];

for (const f of MISSING_EXISTING) {
  writeFileSync(join(UI_DIR, `icon_seed_${f.id}.svg`), genSeedIcon(f.id, f.name, f.c1, f.c2));
  count++;
}

console.log(`✅ Generated ${count} SVG files`);
