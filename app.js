/**
 * HexPaleta - PWA Gerador de Paletas de Cores Baseado em Teoria das Cores
 */

const colorInput1 = document.getElementById('base-color-1');
const colorInput2 = document.getElementById('base-color-2');
const colorInput3 = document.getElementById('base-color-3');
const paletteTypeSelect = document.getElementById('palette-type');
const btnGenerate = document.getElementById('btn-generate');
const paletteContainer = document.getElementById('palette-container');
const btnDownload = document.getElementById('btn-download');
const btnThemeToggle = document.getElementById('theme-toggle');
const toast = document.getElementById('toast');

let currentPalette = [];

// Limpar cor base individual
document.querySelectorAll('.btn-clear-color').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const index = e.target.getAttribute('data-index');
    const input = document.getElementById(`base-color-${index}`);
    input.value = ""; // Vazio indica que não será usado como base fixa
    showToast(`Cor base ${index} desativada.`);
  });
});

// --- Funções de Conversão de Cores (HEX <-> HSL <-> RGB) ---
function hexToRgb(hex) {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  const num = parseInt(cleanHex, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(x => {
    const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join('').toUpperCase();
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // acromático
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // acromático
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// --- Coleta de Cores Base ativas ---
function getActiveBaseColors() {
  const active = [];
  [colorInput1, colorInput2, colorInput3].forEach(input => {
    if (input.value && input.value !== "") {
      active.push(input.value);
    }
  });
  return active;
}

// --- Algoritmos de Geração de Paletas baseados em Teoria das Cores ---
function generatePalette() {
  const baseColors = getActiveBaseColors();
  const type = paletteTypeSelect.value;
  let paletteHexes = [];

  let seedColor = baseColors.length > 0 ? baseColors[0] : rgbToHex(Math.random()*255, Math.random()*255, Math.random()*255);
  let [h, s, l] = rgbToHsl(...hexToRgb(seedColor));

  switch (type) {
    case 'monochromatic':
      // Variações de luminosidade com mesma matiz
      paletteHexes = [
        rgbToHex(...hslToRgb(h, s, Math.max(15, l - 30))),
        rgbToHex(...hslToRgb(h, s, Math.max(30, l - 15))),
        seedColor,
        rgbToHex(...hslToRgb(h, s, Math.min(85, l + 15))),
        rgbToHex(...hslToRgb(h, s, Math.min(95, l + 30)))
      ];
      break;

    case 'complementary':
      // Oposta no círculo cromático (+180°)
      const compH = (h + 180) % 360;
      paletteHexes = [
        rgbToHex(...hslToRgb(h, Math.max(20, s - 20), 30)),
        seedColor,
        rgbToHex(...hslToRgb(h, s, 70)),
        rgbToHex(...hslToRgb(compH, s, 50)),
        rgbToHex(...hslToRgb(compH, Math.max(20, s - 15), 80))
      ];
      break;

    case 'analogous':
      // Cores vizinhas (-30°, -15°, seed, +15°, +30°)
      paletteHexes = [
        rgbToHex(...hslToRgb((h - 30 + 360) % 360, s, l)),
        rgbToHex(...hslToRgb((h - 15 + 360) % 360, s, l)),
        seedColor,
        rgbToHex(...hslToRgb((h + 15) % 360, s, l)),
        rgbToHex(...hslToRgb((h + 30) % 360, s, l))
      ];
      break;

    case 'triadic':
      // Três cores equidistantes (+120° e +240°)
      const t1 = (h + 120) % 360;
      const t2 = (h + 240) % 360;
      paletteHexes = [
        seedColor,
        rgbToHex(...hslToRgb(h, s, Math.min(85, l + 20))),
        rgbToHex(...hslToRgb(t1, s, l)),
        rgbToHex(...hslToRgb(t1, s, Math.min(80, l + 25))),
        rgbToHex(...hslToRgb(t2, s, l))
      ];
      break;

    case 'warm':
      // Tons quentes (Matiz entre 0° e 60° ou 300° a 360°)
      const warmH = Math.random() < 0.5 ? Math.floor(Math.random() * 60) : Math.floor(Math.random() * 60) + 300;
      paletteHexes = Array.from({length: 5}, (_, i) => {
        const curH = (warmH + i * 12) % 360;
        return rgbToHex(...hslToRgb(curH, 70 + (i * 5), 45 + (i * 8)));
      });
      break;

    case 'cool':
      // Tons frios (Matiz entre 160° e 260°)
      const coolH = Math.floor(Math.random() * 100) + 160;
      paletteHexes = Array.from({length: 5}, (_, i) => {
        const curH = (coolH + i * 12) % 360;
        return rgbToHex(...hslToRgb(curH, 65, 40 + (i * 9)));
      });
      break;

    case 'random':
    default:
      // Sorte do dia (completamente livre ou baseada nas cores base informadas)
      paletteHexes = Array.from({length: 5}, () => {
        return rgbToHex(Math.random()*255, Math.random()*255, Math.random()*255);
      });
      break;
  }

  // Garante a inserção de todas as cores base fornecidas pelo usuário na paleta gerada
  baseColors.forEach((bc, idx) => {
    if (idx < paletteHexes.length) {
      paletteHexes[idx] = bc;
    }
  });

  currentPalette = paletteHexes;
  renderPalette();
  showToast("Nova paleta gerada com sucesso!");
}

// --- Renderização da Paleta na Interface ---
function renderPalette() {
  paletteContainer.innerHTML = "";

  currentPalette.forEach((hex) => {
    const card = document.createElement('div');
    card.className = 'color-card';

    card.innerHTML = `
      <div class="color-preview" style="background-color: ${hex};"></div>
      <div class="color-info">
        <span class="color-hex">${hex}</span>
        <button class="btn-copy-color" data-hex="${hex}" title="Copiar HEX">
          <span>🖐️</span> Copiar
        </button>
      </div>
    `;

    paletteContainer.appendChild(card);
  });

  // Event listeners para os botões de cópia em cada bloco
  document.querySelectorAll('.btn-copy-color').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const hexVal = e.currentTarget.getAttribute('data-hex');
      copyToClipboard(hexVal);
    });
  });
}

// --- Copiar para Área de Transferência ---
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(`Código ${text} copiado!`);
  } catch (err) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast(`Código ${text} copiado!`);
  }
}

// --- Baixar Paleta como JSON ---
function downloadPaletteJson() {
  if (currentPalette.length === 0) return;

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
    appName: "HexPaleta",
    type: paletteTypeSelect.value,
    createdAt: new Date().toISOString(),
    colors: currentPalette
  }, null, 2));

  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `hexpaleta-${paletteTypeSelect.value}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast("Download da paleta JSON iniciado!");
}

// --- Alternância de Tema ---
function initTheme() {
  const savedTheme = localStorage.getItem('hexpaleta-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('hexpaleta-theme', newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  btnThemeToggle.querySelector('.icon-theme').textContent = theme === 'light' ? '☀️' : '🌙';
}

// --- Toast Feedback ---
function showToast(message) {
  toast.textContent = message;
  toast.classList.remove('hidden');
  
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 2500);
}

// --- Event Listeners ---
btnGenerate.addEventListener('click', generatePalette);
btnDownload.addEventListener('click', downloadPaletteJson);
btnThemeToggle.addEventListener('click', toggleTheme);

// --- Inicialização ---
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  generatePalette();
});

// --- Registro do Service Worker ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .catch(err => console.error('Falha ao registrar SW:', err));
  });
}
