// ============================================
// 1. 物質の三態変化シミュレーション
// ============================================

const stateCanvas = document.getElementById('stateCanvas');
const stateCtx = stateCanvas.getContext('2d');
let temperature = 25;
let stateRunning = false;
let particles = [];

const temperatureSlider = document.getElementById('temperatureSlider');
const startState = document.getElementById('startState');
const stopState = document.getElementById('stopState');

// 粒子の初期化
function initParticles() {
    particles = [];
    const numParticles = 50;
    for (let i = 0; i < numParticles; i++) {
        particles.push({
            x: Math.random() * (stateCanvas.width - 40) + 20,
            y: Math.random() * (stateCanvas.height - 40) + 20,
            vx: 0,
            vy: 0,
            radius: 6
        });
    }
}

initParticles();

temperatureSlider.addEventListener('input', (e) => {
    temperature = parseInt(e.target.value);
    document.getElementById('temperatureValue').textContent = temperature;
    if (!stateRunning) drawState();
});

startState.addEventListener('click', () => {
    stateRunning = true;
    animateState();
});

stopState.addEventListener('click', () => {
    stateRunning = false;
});

function getState() {
    if (temperature < 0) return 'solid';
    if (temperature < 100) return 'liquid';
    return 'gas';
}

function drawState() {
    stateCtx.clearRect(0, 0, stateCanvas.width, stateCanvas.height);
    
    const state = getState();
    let bgColor, stateText, description;
    
    if (state === 'solid') {
        bgColor = 'rgba(52, 152, 219, 0.2)';
        stateText = '固体';
        description = '分子が規則正しく並び、振動している';
    } else if (state === 'liquid') {
        bgColor = 'rgba(46, 204, 113, 0.2)';
        stateText = '液体';
        description = '分子が自由に動き回れる';
    } else {
        bgColor = 'rgba(231, 76, 60, 0.2)';
        stateText = '気体';
        description = '分子が速く飛び回っている';
    }
    
    // 背景
    stateCtx.fillStyle = bgColor;
    stateCtx.fillRect(0, 0, stateCanvas.width, stateCanvas.height);
    
    // 粒子の描画
    particles.forEach(p => {
        stateCtx.fillStyle = state === 'solid' ? '#3498db' : 
                            state === 'liquid' ? '#2ecc71' : '#e74c3c';
        stateCtx.beginPath();
        stateCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        stateCtx.fill();
        stateCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        stateCtx.lineWidth = 2;
        stateCtx.stroke();
    });
    
    // 情報表示
    stateCtx.fillStyle = '#2c3e50';
    stateCtx.font = 'bold 24px Noto Sans JP';
    stateCtx.fillText(`状態: ${stateText}`, 20, 40);
    stateCtx.font = '16px Noto Sans JP';
    stateCtx.fillText(description, 20, 70);
    stateCtx.fillText(`温度: ${temperature}°C`, 20, 100);
}

function animateState() {
    if (!stateRunning) return;
    
    const state = getState();
    let speed = 0;
    
    if (state === 'solid') {
        speed = 0.3;
        // 固体：格子状に戻ろうとする力
        particles.forEach((p, i) => {
            const row = Math.floor(i / 10);
            const col = i % 10;
            const targetX = 50 + col * 50;
            const targetY = 50 + row * 60;
            p.vx = (targetX - p.x) * 0.05 + (Math.random() - 0.5) * speed;
            p.vy = (targetY - p.y) * 0.05 + (Math.random() - 0.5) * speed;
        });
    } else if (state === 'liquid') {
        speed = 2;
        // 液体：自由に動くが制限あり
        particles.forEach(p => {
            p.vx += (Math.random() - 0.5) * speed;
            p.vy += (Math.random() - 0.5) * speed;
            p.vx *= 0.95;
            p.vy *= 0.95;
        });
    } else {
        speed = 4;
        // 気体：高速に動く
        particles.forEach(p => {
            p.vx += (Math.random() - 0.5) * speed;
            p.vy += (Math.random() - 0.5) * speed;
            p.vx *= 0.98;
            p.vy *= 0.98;
        });
    }
    
    // 粒子の移動と衝突判定
    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        // 壁との衝突
        if (p.x < p.radius || p.x > stateCanvas.width - p.radius) {
            p.vx *= -0.8;
            p.x = Math.max(p.radius, Math.min(stateCanvas.width - p.radius, p.x));
        }
        if (p.y < p.radius || p.y > stateCanvas.height - p.radius) {
            p.vy *= -0.8;
            p.y = Math.max(p.radius, Math.min(stateCanvas.height - p.radius, p.y));
        }
    });
    
    drawState();
    requestAnimationFrame(animateState);
}

drawState();

// ============================================
// 2. 化学反応の可視化
// ============================================

const reactionCanvas = document.getElementById('reactionCanvas');
const reactionCtx = reactionCanvas.getContext('2d');
let h2Count = 4;
let o2Count = 2;
let reactionProgress = 0;
let reactionRunning = false;

const h2Slider = document.getElementById('h2Slider');
const o2Slider = document.getElementById('o2Slider');
const startReaction = document.getElementById('startReaction');
const resetReaction = document.getElementById('resetReaction');

h2Slider.addEventListener('input', (e) => {
    h2Count = parseInt(e.target.value);
    document.getElementById('h2Value').textContent = h2Count;
    drawReaction();
});

o2Slider.addEventListener('input', (e) => {
    o2Count = parseInt(e.target.value);
    document.getElementById('o2Value').textContent = o2Count;
    drawReaction();
});

startReaction.addEventListener('click', () => {
    reactionRunning = true;
    reactionProgress = 0;
    animateReaction();
});

resetReaction.addEventListener('click', () => {
    reactionRunning = false;
    reactionProgress = 0;
    drawReaction();
});

function drawMolecule(ctx, x, y, type, scale = 1) {
    if (type === 'H2') {
        // 水素分子（赤）
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(x - 10 * scale, y, 8 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + 10 * scale, y, 8 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // 結合線
        ctx.strokeStyle = '#c0392b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x - 10 * scale, y);
        ctx.lineTo(x + 10 * scale, y);
        ctx.stroke();
        
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${12 * scale}px Arial`;
        ctx.fillText('H', x - 14 * scale, y + 4 * scale);
        ctx.fillText('H', x + 6 * scale, y + 4 * scale);
    } else if (type === 'O2') {
        // 酸素分子（青）
        ctx.fillStyle = '#3498db';
        ctx.beginPath();
        ctx.arc(x - 12 * scale, y, 10 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + 12 * scale, y, 10 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // 二重結合
        ctx.strokeStyle = '#2980b9';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - 12 * scale, y - 3 * scale);
        ctx.lineTo(x + 12 * scale, y - 3 * scale);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x - 12 * scale, y + 3 * scale);
        ctx.lineTo(x + 12 * scale, y + 3 * scale);
        ctx.stroke();
        
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${12 * scale}px Arial`;
        ctx.fillText('O', x - 16 * scale, y + 4 * scale);
        ctx.fillText('O', x + 8 * scale, y + 4 * scale);
    } else if (type === 'H2O') {
        // 水分子
        ctx.fillStyle = '#3498db';
        ctx.beginPath();
        ctx.arc(x, y, 10 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(x - 15 * scale, y + 10 * scale, 6 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + 15 * scale, y + 10 * scale, 6 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // 結合線
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 15 * scale, y + 10 * scale);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 15 * scale, y + 10 * scale);
        ctx.stroke();
        
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${10 * scale}px Arial`;
        ctx.fillText('O', x - 4 * scale, y + 3 * scale);
        ctx.fillText('H', x - 18 * scale, y + 14 * scale);
        ctx.fillText('H', x + 12 * scale, y + 14 * scale);
    }
}

function drawReaction() {
    reactionCtx.clearRect(0, 0, reactionCanvas.width, reactionCanvas.height);
    
    // 反応式
    reactionCtx.fillStyle = '#2c3e50';
    reactionCtx.font = 'bold 20px Noto Sans JP';
    reactionCtx.fillText('2H₂ + O₂ → 2H₂O', reactionCanvas.width / 2 - 90, 30);
    
    if (reactionProgress === 0) {
        // 反応前
        reactionCtx.font = '16px Noto Sans JP';
        reactionCtx.fillText('反応前', 100, 80);
        
        // H2分子
        for (let i = 0; i < h2Count; i++) {
            const x = 80 + (i % 4) * 60;
            const y = 120 + Math.floor(i / 4) * 60;
            drawMolecule(reactionCtx, x, y, 'H2');
        }
        
        // O2分子
        for (let i = 0; i < o2Count; i++) {
            const x = 350 + (i % 2) * 70;
            const y = 120 + Math.floor(i / 2) * 60;
            drawMolecule(reactionCtx, x, y, 'O2');
        }
    } else if (reactionProgress >= 100) {
        // 反応後
        reactionCtx.font = '16px Noto Sans JP';
        reactionCtx.fillText('反応後', 250, 80);
        
        // H2O分子
        const waterMolecules = Math.min(h2Count, o2Count * 2);
        for (let i = 0; i < waterMolecules; i++) {
            const x = 200 + (i % 4) * 80;
            const y = 150 + Math.floor(i / 4) * 80;
            drawMolecule(reactionCtx, x, y, 'H2O');
        }
        
        // 余った分子
        const excessH2 = Math.max(0, h2Count - o2Count * 2);
        const excessO2 = Math.max(0, o2Count - h2Count / 2);
        
        if (excessH2 > 0) {
            reactionCtx.fillStyle = '#e74c3c';
            reactionCtx.font = '14px Noto Sans JP';
            reactionCtx.fillText(`余った水素: ${excessH2}個`, 50, 320);
        }
        if (excessO2 > 0) {
            reactionCtx.fillStyle = '#3498db';
            reactionCtx.font = '14px Noto Sans JP';
            reactionCtx.fillText(`余った酸素: ${excessO2}個`, 50, 345);
        }
        
        reactionCtx.fillStyle = '#27ae60';
        reactionCtx.font = 'bold 16px Noto Sans JP';
        reactionCtx.fillText(`水: ${waterMolecules}個 生成`, 50, 370);
    }
}

function animateReaction() {
    if (!reactionRunning) return;
    
    reactionProgress += 2;
    
    if (reactionProgress >= 100) {
        reactionRunning = false;
    }
    
    drawReaction();
    
    if (reactionRunning) {
        setTimeout(() => animateReaction(), 50);
    }
}

drawReaction();

// ============================================
// 3. 分子モデル
// ============================================

const moleculeCanvas = document.getElementById('moleculeCanvas');
const moleculeCtx = moleculeCanvas.getContext('2d');
let moleculeType = 'water';
let rotation = 0;

const moleculeTypeSelect = document.getElementById('moleculeType');
const rotationSlider = document.getElementById('rotationSlider');

moleculeTypeSelect.addEventListener('change', (e) => {
    moleculeType = e.target.value;
    drawMoleculeModel();
});

rotationSlider.addEventListener('input', (e) => {
    rotation = parseInt(e.target.value);
    document.getElementById('rotationValue').textContent = rotation;
    drawMoleculeModel();
});

function drawMoleculeModel() {
    moleculeCtx.clearRect(0, 0, moleculeCanvas.width, moleculeCanvas.height);
    
    const centerX = moleculeCanvas.width / 2;
    const centerY = moleculeCanvas.height / 2;
    const angle = (rotation * Math.PI) / 180;
    
    moleculeCtx.save();
    moleculeCtx.translate(centerX, centerY);
    
    if (moleculeType === 'water') {
        // 水 H2O
        drawAtom(moleculeCtx, 0, 0, 25, '#3498db', 'O');
        drawAtom(moleculeCtx, -50 * Math.cos(angle), 40, 15, '#e74c3c', 'H');
        drawAtom(moleculeCtx, 50 * Math.cos(angle), 40, 15, '#e74c3c', 'H');
        
        moleculeCtx.strokeStyle = '#555';
        moleculeCtx.lineWidth = 4;
        moleculeCtx.beginPath();
        moleculeCtx.moveTo(0, 0);
        moleculeCtx.lineTo(-50 * Math.cos(angle), 40);
        moleculeCtx.stroke();
        moleculeCtx.beginPath();
        moleculeCtx.moveTo(0, 0);
        moleculeCtx.lineTo(50 * Math.cos(angle), 40);
        moleculeCtx.stroke();
        
    } else if (moleculeType === 'co2') {
        // 二酸化炭素 CO2
        drawAtom(moleculeCtx, 0, 0, 20, '#2c3e50', 'C');
        drawAtom(moleculeCtx, -80 * Math.cos(angle), 0, 22, '#e74c3c', 'O');
        drawAtom(moleculeCtx, 80 * Math.cos(angle), 0, 22, '#e74c3c', 'O');
        
        moleculeCtx.strokeStyle = '#555';
        moleculeCtx.lineWidth = 3;
        moleculeCtx.beginPath();
        moleculeCtx.moveTo(-60 * Math.cos(angle), -3);
        moleculeCtx.lineTo(-20, -3);
        moleculeCtx.moveTo(-60 * Math.cos(angle), 3);
        moleculeCtx.lineTo(-20, 3);
        moleculeCtx.stroke();
        
        moleculeCtx.beginPath();
        moleculeCtx.moveTo(20, -3);
        moleculeCtx.lineTo(60 * Math.cos(angle), -3);
        moleculeCtx.moveTo(20, 3);
        moleculeCtx.lineTo(60 * Math.cos(angle), 3);
        moleculeCtx.stroke();
        
    } else if (moleculeType === 'methane') {
        // メタン CH4
        drawAtom(moleculeCtx, 0, 0, 20, '#2c3e50', 'C');
        drawAtom(moleculeCtx, 0, -60, 15, '#e74c3c', 'H');
        drawAtom(moleculeCtx, -50 * Math.cos(angle), 30, 15, '#e74c3c', 'H');
        drawAtom(moleculeCtx, 50 * Math.cos(angle), 30, 15, '#e74c3c', 'H');
        drawAtom(moleculeCtx, 0, 50 * Math.sin(angle), 15, '#e74c3c', 'H');
        
        moleculeCtx.strokeStyle = '#555';
        moleculeCtx.lineWidth = 3;
        ['top', 'left', 'right', 'back'].forEach(dir => {
            moleculeCtx.beginPath();
            moleculeCtx.moveTo(0, 0);
            if (dir === 'top') moleculeCtx.lineTo(0, -40);
            else if (dir === 'left') moleculeCtx.lineTo(-40 * Math.cos(angle), 20);
            else if (dir === 'right') moleculeCtx.lineTo(40 * Math.cos(angle), 20);
            else moleculeCtx.lineTo(0, 40 * Math.sin(angle));
            moleculeCtx.stroke();
        });
        
    } else if (moleculeType === 'ammonia') {
        // アンモニア NH3
        drawAtom(moleculeCtx, 0, 0, 22, '#3498db', 'N');
        drawAtom(moleculeCtx, 0, -55, 15, '#e74c3c', 'H');
        drawAtom(moleculeCtx, -45 * Math.cos(angle), 35, 15, '#e74c3c', 'H');
        drawAtom(moleculeCtx, 45 * Math.cos(angle), 35, 15, '#e74c3c', 'H');
        
        moleculeCtx.strokeStyle = '#555';
        moleculeCtx.lineWidth = 3;
        moleculeCtx.beginPath();
        moleculeCtx.moveTo(0, 0);
        moleculeCtx.lineTo(0, -40);
        moleculeCtx.stroke();
        moleculeCtx.beginPath();
        moleculeCtx.moveTo(0, 0);
        moleculeCtx.lineTo(-35 * Math.cos(angle), 25);
        moleculeCtx.stroke();
        moleculeCtx.beginPath();
        moleculeCtx.moveTo(0, 0);
        moleculeCtx.lineTo(35 * Math.cos(angle), 25);
        moleculeCtx.stroke();
        
    } else if (moleculeType === 'oxygen') {
        // 酸素 O2
        drawAtom(moleculeCtx, -40 * Math.cos(angle), 0, 25, '#e74c3c', 'O');
        drawAtom(moleculeCtx, 40 * Math.cos(angle), 0, 25, '#e74c3c', 'O');
        
        moleculeCtx.strokeStyle = '#555';
        moleculeCtx.lineWidth = 3;
        moleculeCtx.beginPath();
        moleculeCtx.moveTo(-25 * Math.cos(angle), -3);
        moleculeCtx.lineTo(25 * Math.cos(angle), -3);
        moleculeCtx.moveTo(-25 * Math.cos(angle), 3);
        moleculeCtx.lineTo(25 * Math.cos(angle), 3);
        moleculeCtx.stroke();
    }
    
    moleculeCtx.restore();
    
    // 情報表示
    const info = {
        water: '水分子（H₂O）: 酸素1個、水素2個',
        co2: '二酸化炭素（CO₂）: 炭素1個、酸素2個',
        methane: 'メタン（CH₄）: 炭素1個、水素4個',
        ammonia: 'アンモニア（NH₃）: 窒素1個、水素3個',
        oxygen: '酸素分子（O₂）: 酸素2個'
    };
    
    moleculeCtx.fillStyle = '#2c3e50';
    moleculeCtx.font = '16px Noto Sans JP';
    moleculeCtx.fillText(info[moleculeType], 20, 30);
}

function drawAtom(ctx, x, y, radius, color, label) {
    // 影
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.arc(x + 3, y + 3, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // 原子
    const gradient = ctx.createRadialGradient(x - radius / 3, y - radius / 3, 0, x, y, radius);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, color.replace(')', ', 0.6)').replace('rgb', 'rgba'));
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // 輪郭
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // ラベル
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${radius * 0.8}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x, y);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
}

drawMoleculeModel();

// ============================================
// 4. 溶解シミュレーター
// ============================================

const dissolutionCanvas = document.getElementById('dissolutionCanvas');
const dissolutionCtx = dissolutionCanvas.getContext('2d');
let soluteAmount = 30;
let waterTemp = 25;
let dissolutionProgress = 0;
let dissolutionRunning = false;
let soluteParticles = [];

const soluteSlider = document.getElementById('soluteSlider');
const waterTempSlider = document.getElementById('waterTempSlider');
const startDissolution = document.getElementById('startDissolution');
const resetDissolution = document.getElementById('resetDissolution');

soluteSlider.addEventListener('input', (e) => {
    soluteAmount = parseInt(e.target.value);
    document.getElementById('soluteValue').textContent = soluteAmount;
    initSoluteParticles();
    drawDissolution();
});

waterTempSlider.addEventListener('input', (e) => {
    waterTemp = parseInt(e.target.value);
    document.getElementById('waterTempValue').textContent = waterTemp;
    drawDissolution();
});

startDissolution.addEventListener('click', () => {
    dissolutionRunning = true;
    dissolutionProgress = 0;
    initSoluteParticles();
    animateDissolution();
});

resetDissolution.addEventListener('click', () => {
    dissolutionRunning = false;
    dissolutionProgress = 0;
    initSoluteParticles();
    drawDissolution();
});

function initSoluteParticles() {
    soluteParticles = [];
    const numParticles = soluteAmount;
    for (let i = 0; i < numParticles; i++) {
        soluteParticles.push({
            x: dissolutionCanvas.width / 2 + (Math.random() - 0.5) * 60,
            y: 100 + (Math.random() - 0.5) * 40,
            dissolved: false,
            opacity: 1
        });
    }
}

initSoluteParticles();

function drawDissolution() {
    dissolutionCtx.clearRect(0, 0, dissolutionCanvas.width, dissolutionCanvas.height);
    
    // ビーカー
    dissolutionCtx.strokeStyle = '#95a5a6';
    dissolutionCtx.lineWidth = 4;
    dissolutionCtx.beginPath();
    dissolutionCtx.moveTo(100, 80);
    dissolutionCtx.lineTo(120, 350);
    dissolutionCtx.lineTo(480, 350);
    dissolutionCtx.lineTo(500, 80);
    dissolutionCtx.stroke();
    
    // 水の色（温度に応じて変化）
    const waterColor = waterTemp < 30 ? 
        `rgba(52, 152, 219, ${0.3 + waterTemp / 300})` :
        `rgba(52, 152, 219, ${0.4 + (waterTemp - 30) / 200})`;
    
    dissolutionCtx.fillStyle = waterColor;
    dissolutionCtx.beginPath();
    dissolutionCtx.moveTo(120, 150);
    dissolutionCtx.lineTo(125, 340);
    dissolutionCtx.lineTo(475, 340);
    dissolutionCtx.lineTo(480, 150);
    dissolutionCtx.closePath();
    dissolutionCtx.fill();
    
    // 溶質粒子
    soluteParticles.forEach(p => {
        if (!p.dissolved) {
            dissolutionCtx.fillStyle = '#f39c12';
            dissolutionCtx.globalAlpha = p.opacity;
            dissolutionCtx.beginPath();
            dissolutionCtx.arc(p.x, p.y, 5, 0, Math.PI * 2);
            dissolutionCtx.fill();
            dissolutionCtx.globalAlpha = 1;
        } else {
            dissolutionCtx.fillStyle = `rgba(243, 156, 18, ${p.opacity * 0.3})`;
            dissolutionCtx.beginPath();
            dissolutionCtx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            dissolutionCtx.fill();
        }
    });
    
    // 温度計
    const thermometerX = 520;
    const thermometerY = 150;
    dissolutionCtx.strokeStyle = '#95a5a6';
    dissolutionCtx.lineWidth = 2;
    dissolutionCtx.beginPath();
    dissolutionCtx.moveTo(thermometerX, thermometerY);
    dissolutionCtx.lineTo(thermometerX, thermometerY + 180);
    dissolutionCtx.stroke();
    
    // 温度計の液体
    const tempHeight = (waterTemp / 100) * 150;
    dissolutionCtx.fillStyle = waterTemp < 50 ? '#3498db' : '#e74c3c';
    dissolutionCtx.fillRect(thermometerX - 3, thermometerY + 180 - tempHeight, 6, tempHeight);
    
    // 球根
    dissolutionCtx.beginPath();
    dissolutionCtx.arc(thermometerX, thermometerY + 190, 10, 0, Math.PI * 2);
    dissolutionCtx.fill();
    
    // 情報表示
    dissolutionCtx.fillStyle = '#2c3e50';
    dissolutionCtx.font = '16px Noto Sans JP';
    dissolutionCtx.fillText(`溶質: ${soluteAmount}g`, 20, 30);
    dissolutionCtx.fillText(`水温: ${waterTemp}°C`, 20, 55);
    
    const dissolved = soluteParticles.filter(p => p.dissolved).length;
    const dissolvedPercent = ((dissolved / soluteParticles.length) * 100).toFixed(0);
    dissolutionCtx.fillText(`溶解率: ${dissolvedPercent}%`, 20, 80);
}

function animateDissolution() {
    if (!dissolutionRunning) return;
    
    const dissolutionSpeed = (waterTemp / 50) * 0.02;
    
    soluteParticles.forEach(p => {
        if (!p.dissolved && Math.random() < dissolutionSpeed) {
            p.dissolved = true;
        }
        
        if (p.dissolved) {
            p.x += (Math.random() - 0.5) * 3;
            p.y += (Math.random() - 0.5) * 3;
            p.opacity = Math.max(0.1, p.opacity - 0.01);
            
            // 範囲制限
            p.x = Math.max(130, Math.min(470, p.x));
            p.y = Math.max(160, Math.min(330, p.y));
        } else {
            p.y += 2;
            if (p.y > 330) p.y = 330;
        }
    });
    
    dissolutionProgress++;
    
    if (dissolutionProgress > 200 || soluteParticles.every(p => p.dissolved && p.opacity < 0.2)) {
        dissolutionRunning = false;
    }
    
    drawDissolution();
    
    if (dissolutionRunning) {
        requestAnimationFrame(animateDissolution);
    }
}

drawDissolution();

// ============================================
// 5. 酸性・アルカリ性の可視化
// ============================================

const phCanvas = document.getElementById('phCanvas');
const phCtx = phCanvas.getContext('2d');
let phValue = 7;
let indicatorType = 'litmus';

const phSlider = document.getElementById('phSlider');
const indicatorTypeSelect = document.getElementById('indicatorType');
const addAcid = document.getElementById('addAcid');
const addBase = document.getElementById('addBase');
const resetPh = document.getElementById('resetPh');

phSlider.addEventListener('input', (e) => {
    phValue = parseFloat(e.target.value);
    document.getElementById('phValue').textContent = phValue.toFixed(1);
    drawPh();
});

indicatorTypeSelect.addEventListener('change', (e) => {
    indicatorType = e.target.value;
    drawPh();
});

addAcid.addEventListener('click', () => {
    phValue = Math.max(0, phValue - 1);
    phSlider.value = phValue;
    document.getElementById('phValue').textContent = phValue.toFixed(1);
    drawPh();
});

addBase.addEventListener('click', () => {
    phValue = Math.min(14, phValue + 1);
    phSlider.value = phValue;
    document.getElementById('phValue').textContent = phValue.toFixed(1);
    drawPh();
});

resetPh.addEventListener('click', () => {
    phValue = 7;
    phSlider.value = 7;
    document.getElementById('phValue').textContent = '7.0';
    drawPh();
});

function getIndicatorColor(ph, indicator) {
    if (indicator === 'litmus') {
        return ph < 7 ? '#e74c3c' : ph > 7 ? '#3498db' : '#9b59b6';
    } else if (indicator === 'btb') {
        if (ph < 6) return '#f39c12';
        if (ph > 7.6) return '#3498db';
        return '#2ecc71';
    } else if (indicator === 'phenol') {
        return ph > 8.5 ? '#e91e63' : 'rgba(255, 255, 255, 0.1)';
    } else if (indicator === 'universal') {
        const colors = [
            '#8B0000', '#DC143C', '#FF6347', '#FFA500', '#FFD700',
            '#FFFF00', '#9ACD32', '#32CD32', '#00CED1', '#4169E1',
            '#0000CD', '#4B0082', '#8B008B', '#9932CC', '#9400D3'
        ];
        const index = Math.floor(ph);
        return colors[Math.min(14, Math.max(0, index))];
    }
}

function drawPh() {
    phCtx.clearRect(0, 0, phCanvas.width, phCanvas.height);
    
    // 試験管
    phCtx.strokeStyle = '#95a5a6';
    phCtx.lineWidth = 4;
    phCtx.beginPath();
    phCtx.arc(phCanvas.width / 2, 300, 60, 0, Math.PI);
    phCtx.lineTo(phCanvas.width / 2 - 60, 100);
    phCtx.lineTo(phCanvas.width / 2 + 60, 100);
    phCtx.lineTo(phCanvas.width / 2 + 60, 300);
    phCtx.stroke();
    
    // 溶液の色
    const color = getIndicatorColor(phValue, indicatorType);
    phCtx.fillStyle = color;
    phCtx.beginPath();
    phCtx.arc(phCanvas.width / 2, 300, 56, 0, Math.PI);
    phCtx.lineTo(phCanvas.width / 2 - 56, 110);
    phCtx.lineTo(phCanvas.width / 2 + 56, 110);
    phCtx.lineTo(phCanvas.width / 2 + 56, 300);
    phCtx.closePath();
    phCtx.fill();
    
    // pH スケール
    const scaleY = 360;
    const scaleWidth = 500;
    const scaleX = (phCanvas.width - scaleWidth) / 2;
    
    for (let i = 0; i <= 14; i++) {
        const x = scaleX + (i / 14) * scaleWidth;
        const scaleColor = getIndicatorColor(i, 'universal');
        phCtx.fillStyle = scaleColor;
        phCtx.fillRect(x, scaleY, scaleWidth / 14, 20);
        
        phCtx.fillStyle = '#2c3e50';
        phCtx.font = '12px Arial';
        phCtx.textAlign = 'center';
        phCtx.fillText(i, x + scaleWidth / 28, scaleY + 35);
    }
    
    // 現在のpH位置を示す矢印
    const currentX = scaleX + (phValue / 14) * scaleWidth;
    phCtx.fillStyle = '#e74c3c';
    phCtx.beginPath();
    phCtx.moveTo(currentX, scaleY - 10);
    phCtx.lineTo(currentX - 8, scaleY - 20);
    phCtx.lineTo(currentX + 8, scaleY - 20);
    phCtx.closePath();
    phCtx.fill();
    
    // 情報表示
    phCtx.textAlign = 'left';
    phCtx.fillStyle = '#2c3e50';
    phCtx.font = 'bold 20px Noto Sans JP';
    phCtx.fillText(`pH: ${phValue.toFixed(1)}`, 20, 40);
    
    phCtx.font = '16px Noto Sans JP';
    let nature = '';
    if (phValue < 7) {
        nature = '酸性';
        phCtx.fillStyle = '#e74c3c';
    } else if (phValue > 7) {
        nature = 'アルカリ性';
        phCtx.fillStyle = '#3498db';
    } else {
        nature = '中性';
        phCtx.fillStyle = '#2ecc71';
    }
    phCtx.fillText(`性質: ${nature}`, 20, 70);
    
    const indicatorNames = {
        litmus: 'リトマス試験紙',
        btb: 'BTB溶液',
        phenol: 'フェノールフタレイン',
        universal: '万能指示薬'
    };
    phCtx.fillStyle = '#7f8c8d';
    phCtx.font = '14px Noto Sans JP';
    phCtx.fillText(`指示薬: ${indicatorNames[indicatorType]}`, 20, 95);
}

drawPh();
