// 地学シミュレーション用JavaScript

// ============================================
// 1. 月の満ち欠け
// ============================================
const moonPhaseCanvas = document.getElementById('moonPhaseCanvas');
const moonPhaseCtx = moonPhaseCanvas.getContext('2d');
let day = 0;
let moonRunning = false;

document.getElementById('daySlider').addEventListener('input', (e) => {
    day = parseInt(e.target.value);
    document.getElementById('dayValue').textContent = day;
    drawMoonPhase();
});

document.getElementById('startMoon').addEventListener('click', () => {
    moonRunning = true;
    animateMoon();
});

document.getElementById('stopMoon').addEventListener('click', () => {
    moonRunning = false;
});

function getMoonPhaseName(d) {
    if (d === 0) return '新月';
    if (d < 7) return '三日月';
    if (d === 7) return '上弦の月';
    if (d < 15) return '満ちていく月';
    if (d === 15) return '満月';
    if (d < 22) return '欠けていく月';
    if (d === 22) return '下弦の月';
    return '新月に近づく';
}

function drawMoonPhase() {
    moonPhaseCtx.clearRect(0, 0, moonPhaseCanvas.width, moonPhaseCanvas.height);
    
    const centerX = moonPhaseCanvas.width / 2;
    const centerY = moonPhaseCanvas.height / 2;
    
    // 太陽
    moonPhaseCtx.fillStyle = '#FDB813';
    moonPhaseCtx.beginPath();
    moonPhaseCtx.arc(100, centerY, 30, 0, Math.PI * 2);
    moonPhaseCtx.fill();
    
    // 光線
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        moonPhaseCtx.strokeStyle = 'rgba(253, 184, 19, 0.5)';
        moonPhaseCtx.lineWidth = 2;
        moonPhaseCtx.beginPath();
        moonPhaseCtx.moveTo(100, centerY);
        moonPhaseCtx.lineTo(100 + Math.cos(angle) * 50, centerY + Math.sin(angle) * 50);
        moonPhaseCtx.stroke();
    }
    
    // 地球
    moonPhaseCtx.fillStyle = '#3498db';
    moonPhaseCtx.beginPath();
    moonPhaseCtx.arc(centerX, centerY, 40, 0, Math.PI * 2);
    moonPhaseCtx.fill();
    moonPhaseCtx.strokeStyle = '#2980b9';
    moonPhaseCtx.lineWidth = 2;
    moonPhaseCtx.stroke();
    
    // 月の軌道
    moonPhaseCtx.strokeStyle = 'rgba(149, 165, 166, 0.3)';
    moonPhaseCtx.lineWidth = 1;
    moonPhaseCtx.setLineDash([5, 5]);
    moonPhaseCtx.beginPath();
    moonPhaseCtx.arc(centerX, centerY, 120, 0, Math.PI * 2);
    moonPhaseCtx.stroke();
    moonPhaseCtx.setLineDash([]);
    
    // 月の位置（29.5日周期）
    const moonAngle = (day / 29.5) * Math.PI * 2 - Math.PI / 2;
    const moonX = centerX + Math.cos(moonAngle) * 120;
    const moonY = centerY + Math.sin(moonAngle) * 120;
    
    // 月の描画（満ち欠け）
    const phase = (day / 29.5) * 2 * Math.PI;
    
    moonPhaseCtx.save();
    moonPhaseCtx.translate(moonX, moonY);
    
    // 月の影の部分
    moonPhaseCtx.fillStyle = '#7f8c8d';
    moonPhaseCtx.beginPath();
    moonPhaseCtx.arc(0, 0, 20, 0, Math.PI * 2);
    moonPhaseCtx.fill();
    
    // 月の明るい部分
    moonPhaseCtx.fillStyle = '#ecf0f1';
    moonPhaseCtx.beginPath();
    const lightAmount = Math.cos(phase);
    if (lightAmount >= 0) {
        // 右側が明るい（新月→満月）
        moonPhaseCtx.arc(0, 0, 20, -Math.PI / 2, Math.PI / 2);
        moonPhaseCtx.ellipse(0, 0, 20 * lightAmount, 20, 0, Math.PI / 2, -Math.PI / 2, true);
    } else {
        // 左側が明るい（満月→新月）
        moonPhaseCtx.arc(0, 0, 20, Math.PI / 2, -Math.PI / 2);
        moonPhaseCtx.ellipse(0, 0, 20 * Math.abs(lightAmount), 20, 0, -Math.PI / 2, Math.PI / 2, true);
    }
    moonPhaseCtx.closePath();
    moonPhaseCtx.fill();
    
    moonPhaseCtx.restore();
    
    // 地球から見た月の様子
    moonPhaseCtx.fillStyle = '#2c3e50';
    moonPhaseCtx.font = 'bold 16px Noto Sans JP';
    moonPhaseCtx.fillText('地球から見た月:', 420, 50);
    
    moonPhaseCtx.save();
    moonPhaseCtx.translate(500, 100);
    
    // 拡大表示
    moonPhaseCtx.fillStyle = '#7f8c8d';
    moonPhaseCtx.beginPath();
    moonPhaseCtx.arc(0, 0, 40, 0, Math.PI * 2);
    moonPhaseCtx.fill();
    
    moonPhaseCtx.fillStyle = '#ecf0f1';
    moonPhaseCtx.beginPath();
    if (lightAmount >= 0) {
        moonPhaseCtx.arc(0, 0, 40, -Math.PI / 2, Math.PI / 2);
        moonPhaseCtx.ellipse(0, 0, 40 * lightAmount, 40, 0, Math.PI / 2, -Math.PI / 2, true);
    } else {
        moonPhaseCtx.arc(0, 0, 40, Math.PI / 2, -Math.PI / 2);
        moonPhaseCtx.ellipse(0, 0, 40 * Math.abs(lightAmount), 40, 0, -Math.PI / 2, Math.PI / 2, true);
    }
    moonPhaseCtx.closePath();
    moonPhaseCtx.fill();
    
    moonPhaseCtx.restore();
    
    // 月の名前
    moonPhaseCtx.fillStyle = '#f39c12';
    moonPhaseCtx.font = 'bold 18px Noto Sans JP';
    moonPhaseCtx.fillText(getMoonPhaseName(day), 430, 170);
    
    // ラベル
    moonPhaseCtx.fillStyle = '#2c3e50';
    moonPhaseCtx.font = '14px Noto Sans JP';
    moonPhaseCtx.fillText('太陽', 85, centerY + 50);
    moonPhaseCtx.fillText('地球', centerX - 15, centerY + 60);
}

function animateMoon() {
    if (!moonRunning) return;
    
    day = (day + 1) % 30;
    document.getElementById('daySlider').value = day;
    document.getElementById('dayValue').textContent = day;
    drawMoonPhase();
    
    setTimeout(() => animateMoon(), 200);
}

drawMoonPhase();

// ============================================
// 2. 太陽系の惑星軌道
// ============================================
const solarSystemCanvas = document.getElementById('solarSystemCanvas');
const solarSystemCtx = solarSystemCanvas.getContext('2d');
let solarSpeed = 1;
let solarRunning = false;
let solarTime = 0;

const planets = [
    { name: '水星', color: '#95a5a6', orbit: 50, speed: 4.15, size: 4 },
    { name: '金星', color: '#f39c12', orbit: 70, speed: 1.62, size: 8 },
    { name: '地球', color: '#3498db', orbit: 90, speed: 1.00, size: 8 },
    { name: '火星', color: '#e74c3c', orbit: 110, speed: 0.53, size: 6 },
    { name: '木星', color: '#d35400', orbit: 140, speed: 0.08, size: 16 },
    { name: '土星', color: '#f1c40f', orbit: 170, speed: 0.03, size: 14 },
    { name: '天王星', color: '#16a085', orbit: 195, speed: 0.01, size: 10 },
    { name: '海王星', color: '#2980b9', orbit: 220, speed: 0.006, size: 10 }
];

document.getElementById('speedSlider').addEventListener('input', (e) => {
    solarSpeed = parseInt(e.target.value);
    document.getElementById('speedValue').textContent = solarSpeed;
});

document.getElementById('startSolar').addEventListener('click', () => {
    solarRunning = true;
    animateSolar();
});

document.getElementById('stopSolar').addEventListener('click', () => {
    solarRunning = false;
});

function drawSolarSystem() {
    solarSystemCtx.clearRect(0, 0, solarSystemCanvas.width, solarSystemCanvas.height);
    
    const centerX = solarSystemCanvas.width / 2;
    const centerY = solarSystemCanvas.height / 2;
    
    // 太陽
    solarSystemCtx.fillStyle = '#FDB813';
    solarSystemCtx.beginPath();
    solarSystemCtx.arc(centerX, centerY, 20, 0, Math.PI * 2);
    solarSystemCtx.fill();
    
    // 惑星の軌道と惑星
    planets.forEach(planet => {
        // 軌道
        solarSystemCtx.strokeStyle = 'rgba(149, 165, 166, 0.3)';
        solarSystemCtx.lineWidth = 1;
        solarSystemCtx.beginPath();
        solarSystemCtx.arc(centerX, centerY, planet.orbit, 0, Math.PI * 2);
        solarSystemCtx.stroke();
        
        // 惑星の位置
        const angle = solarTime * planet.speed * 0.01;
        const x = centerX + Math.cos(angle) * planet.orbit;
        const y = centerY + Math.sin(angle) * planet.orbit;
        
        // 惑星
        solarSystemCtx.fillStyle = planet.color;
        solarSystemCtx.beginPath();
        solarSystemCtx.arc(x, y, planet.size, 0, Math.PI * 2);
        solarSystemCtx.fill();
        
        // 名前
        solarSystemCtx.fillStyle = '#2c3e50';
        solarSystemCtx.font = '10px Noto Sans JP';
        solarSystemCtx.fillText(planet.name, x - 10, y - planet.size - 5);
    });
    
    // 情報
    solarSystemCtx.fillStyle = '#2c3e50';
    solarSystemCtx.font = '12px Noto Sans JP';
    solarSystemCtx.fillText('※実際の大きさ・距離の比率とは異なります', 10, 380);
}

function animateSolar() {
    if (!solarRunning) return;
    
    solarTime += solarSpeed;
    drawSolarSystem();
    
    requestAnimationFrame(animateSolar);
}

drawSolarSystem();

// ============================================
// 3. 地層の形成
// ============================================
const stratumCanvas = document.getElementById('stratumCanvas');
const stratumCtx = stratumCanvas.getContext('2d');
let layers = [];

const sedimentColors = {
    sand: '#f1c40f',
    mud: '#95a5a6',
    gravel: '#7f8c8d',
    volcanic: '#2c3e50'
};

const sedimentNames = {
    sand: '砂の層',
    mud: '泥の層',
    gravel: '礫の層',
    volcanic: '火山灰の層'
};

document.getElementById('addLayer').addEventListener('click', () => {
    const sedimentType = document.getElementById('sedimentType').value;
    if (layers.length < 10) {
        layers.push({ type: sedimentType, color: sedimentColors[sedimentType] });
        drawStratum();
    }
});

document.getElementById('resetStratum').addEventListener('click', () => {
    layers = [];
    drawStratum();
});

function drawStratum() {
    stratumCtx.clearRect(0, 0, stratumCanvas.width, stratumCanvas.height);
    
    // 地面
    stratumCtx.fillStyle = '#8B4513';
    stratumCtx.fillRect(0, 300, stratumCanvas.width, 100);
    
    // 地層
    const layerHeight = 30;
    layers.forEach((layer, index) => {
        const y = 300 - (index + 1) * layerHeight;
        
        stratumCtx.fillStyle = layer.color;
        stratumCtx.fillRect(100, y, 400, layerHeight);
        stratumCtx.strokeStyle = '#2c3e50';
        stratumCtx.lineWidth = 1;
        stratumCtx.strokeRect(100, y, 400, layerHeight);
        
        // テクスチャ
        stratumCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        for (let i = 0; i < 20; i++) {
            const x = 100 + Math.random() * 400;
            const py = y + Math.random() * layerHeight;
            stratumCtx.fillRect(x, py, 2, 2);
        }
        
        // ラベル
        stratumCtx.fillStyle = '#2c3e50';
        stratumCtx.font = '12px Noto Sans JP';
        stratumCtx.fillText(sedimentNames[layer.type], 510, y + layerHeight / 2 + 5);
    });
    
    // 説明
    stratumCtx.fillStyle = '#2c3e50';
    stratumCtx.font = 'bold 16px Noto Sans JP';
    stratumCtx.fillText('地層の断面図', 20, 30);
    
    stratumCtx.font = '14px Noto Sans JP';
    stratumCtx.fillText(`現在の層の数: ${layers.length}`, 20, 60);
    stratumCtx.fillText('下の層ほど古い時代に堆積', 20, 85);
    
    if (layers.length === 0) {
        stratumCtx.fillStyle = '#7f8c8d';
        stratumCtx.font = '16px Noto Sans JP';
        stratumCtx.fillText('「層を追加」ボタンで地層を重ねていきましょう', 150, 200);
    }
}

drawStratum();

// ============================================
// 4. 火山の噴火
// ============================================
const volcanoCanvas = document.getElementById('volcanoCanvas');
const volcanoCtx = volcanoCanvas.getContext('2d');
let viscosity = 50;
let erupting = false;
let lavaParticles = [];

document.getElementById('viscositySlider').addEventListener('input', (e) => {
    viscosity = parseInt(e.target.value);
    document.getElementById('viscosityValue').textContent = viscosity;
});

document.getElementById('startEruption').addEventListener('click', () => {
    erupting = true;
    lavaParticles = [];
    animateVolcano();
});

document.getElementById('resetVolcano').addEventListener('click', () => {
    erupting = false;
    lavaParticles = [];
    drawVolcano();
});

function drawVolcano() {
    volcanoCtx.clearRect(0, 0, volcanoCanvas.width, volcanoCanvas.height);
    
    // 空
    const gradient = volcanoCtx.createLinearGradient(0, 0, 0, volcanoCanvas.height);
    if (erupting) {
        gradient.addColorStop(0, '#34495e');
        gradient.addColorStop(1, '#95a5a6');
    } else {
        gradient.addColorStop(0, '#3498db');
        gradient.addColorStop(1, '#ecf0f1');
    }
    volcanoCtx.fillStyle = gradient;
    volcanoCtx.fillRect(0, 0, volcanoCanvas.width, volcanoCanvas.height);
    
    // 火山
    volcanoCtx.fillStyle = '#7f8c8d';
    volcanoCtx.beginPath();
    volcanoCtx.moveTo(volcanoCanvas.width / 2, 150);
    volcanoCtx.lineTo(volcanoCanvas.width / 2 - 100, 350);
    volcanoCtx.lineTo(volcanoCanvas.width / 2 + 100, 350);
    volcanoCtx.closePath();
    volcanoCtx.fill();
    
    // マグマだまり
    volcanoCtx.fillStyle = '#e74c3c';
    volcanoCtx.beginPath();
    volcanoCtx.ellipse(volcanoCanvas.width / 2, 280, 40, 20, 0, 0, Math.PI * 2);
    volcanoCtx.fill();
    
    // 火口
    volcanoCtx.fillStyle = '#2c3e50';
    volcanoCtx.fillRect(volcanoCanvas.width / 2 - 15, 150, 30, 10);
    
    // 溶岩・火山灰の粒子
    lavaParticles.forEach(p => {
        if (p.type === 'lava') {
            volcanoCtx.fillStyle = `rgba(231, 76, 60, ${p.opacity})`;
        } else {
            volcanoCtx.fillStyle = `rgba(44, 62, 80, ${p.opacity})`;
        }
        volcanoCtx.beginPath();
        volcanoCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        volcanoCtx.fill();
    });
    
    // 情報
    volcanoCtx.fillStyle = '#2c3e50';
    volcanoCtx.font = '14px Noto Sans JP';
    
    const eruptionType = viscosity > 70 ? '爆発的噴火' : viscosity > 40 ? '中程度の噴火' : '穏やかな噴火';
    volcanoCtx.fillText(`噴火の種類: ${eruptionType}`, 20, 30);
    volcanoCtx.fillText(`粘り気: ${viscosity}%`, 20, 55);
    
    if (viscosity > 70) {
        volcanoCtx.fillText('粘り気が強い → 爆発的に噴火', 20, 80);
    } else if (viscosity > 40) {
        volcanoCtx.fillText('粘り気が中程度 → バランス型', 20, 80);
    } else {
        volcanoCtx.fillText('粘り気が弱い → 溶岩が流れ出る', 20, 80);
    }
}

function animateVolcano() {
    if (!erupting) return;
    
    // 新しい粒子を生成
    if (lavaParticles.length < 200) {
        const centerX = volcanoCanvas.width / 2;
        const isExplosive = viscosity > 50;
        
        if (isExplosive) {
            // 爆発的 - 火山灰が高く上がる
            lavaParticles.push({
                x: centerX + (Math.random() - 0.5) * 20,
                y: 155,
                vx: (Math.random() - 0.5) * 8,
                vy: -Math.random() * 10 - 5,
                type: 'ash',
                size: 2 + Math.random() * 3,
                opacity: 1
            });
        } else {
            // 穏やか - 溶岩が流れる
            lavaParticles.push({
                x: centerX + (Math.random() - 0.5) * 30,
                y: 155,
                vx: (Math.random() - 0.5) * 3,
                vy: Math.random() * 2,
                type: 'lava',
                size: 4 + Math.random() * 4,
                opacity: 1
            });
        }
    }
    
    // 粒子の更新
    lavaParticles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2; // 重力
        p.opacity -= 0.01;
        
        if (p.opacity <= 0 || p.y > 350) {
            lavaParticles.splice(index, 1);
        }
    });
    
    if (lavaParticles.length > 0) {
        drawVolcano();
        requestAnimationFrame(animateVolcano);
    } else {
        erupting = false;
        drawVolcano();
    }
}

drawVolcano();

// ============================================
// 5. 天体の動き
// ============================================
const celestialCanvas = document.getElementById('celestialCanvas');
const celestialCtx = celestialCanvas.getContext('2d');
let time = 0;
let motionType = 'diurnal';
let celestialRunning = false;

document.getElementById('timeSlider').addEventListener('input', (e) => {
    time = parseInt(e.target.value);
    document.getElementById('timeValue').textContent = time;
    drawCelestial();
});

document.getElementById('motionType').addEventListener('change', (e) => {
    motionType = e.target.value;
    drawCelestial();
});

document.getElementById('startCelestial').addEventListener('click', () => {
    celestialRunning = true;
    animateCelestial();
});

document.getElementById('stopCelestial').addEventListener('click', () => {
    celestialRunning = false;
});

function drawCelestial() {
    celestialCtx.clearRect(0, 0, celestialCanvas.width, celestialCanvas.height);
    
    // 空の色（時刻による変化）
    let skyColor;
    if (time >= 6 && time <= 18) {
        skyColor = '#3498db'; // 昼
    } else {
        skyColor = '#2c3e50'; // 夜
    }
    celestialCtx.fillStyle = skyColor;
    celestialCtx.fillRect(0, 0, celestialCanvas.width, celestialCanvas.height);
    
    const centerX = celestialCanvas.width / 2;
    const horizon = celestialCanvas.height - 50;
    
    if (motionType === 'diurnal') {
        // 日周運動 - 星の動き
        celestialCtx.fillStyle = '#fff';
        celestialCtx.font = 'bold 16px Noto Sans JP';
        celestialCtx.fillText('日周運動（地球の自転による星の見かけの動き）', 20, 30);
        
        // 北極星（動かない）
        celestialCtx.fillStyle = '#f39c12';
        celestialCtx.beginPath();
        celestialCtx.arc(centerX, 80, 8, 0, Math.PI * 2);
        celestialCtx.fill();
        celestialCtx.fillStyle = '#fff';
        celestialCtx.font = '12px Noto Sans JP';
        celestialCtx.fillText('北極星', centerX + 15, 85);
        
        // 星座（回転する）
        const angle = (time / 24) * Math.PI * 2;
        for (let i = 0; i < 12; i++) {
            const starAngle = (i / 12) * Math.PI * 2 + angle;
            const radius = 100;
            const x = centerX + Math.cos(starAngle) * radius;
            const y = 80 + Math.sin(starAngle) * radius;
            
            if (y < horizon) {
                celestialCtx.fillStyle = '#ecf0f1';
                celestialCtx.beginPath();
                celestialCtx.arc(x, y, 4, 0, Math.PI * 2);
                celestialCtx.fill();
            }
        }
        
        // 軌跡
        celestialCtx.strokeStyle = 'rgba(236, 240, 241, 0.3)';
        celestialCtx.lineWidth = 1;
        celestialCtx.setLineDash([3, 3]);
        celestialCtx.beginPath();
        celestialCtx.arc(centerX, 80, 100, 0, Math.PI * 2);
        celestialCtx.stroke();
        celestialCtx.setLineDash([]);
        
    } else {
        // 年周運動 - 太陽の動き
        celestialCtx.fillStyle = '#fff';
        celestialCtx.font = 'bold 16px Noto Sans JP';
        celestialCtx.fillText('年周運動（地球の公転による太陽の見かけの動き）', 20, 30);
        
        // 太陽（時刻による位置変化）
        if (time >= 6 && time <= 18) {
            const sunAngle = ((time - 6) / 12) * Math.PI;
            const sunX = centerX + Math.cos(sunAngle - Math.PI / 2) * 200;
            const sunY = horizon - Math.sin(sunAngle - Math.PI / 2) * 150;
            
            celestialCtx.fillStyle = '#FDB813';
            celestialCtx.beginPath();
            celestialCtx.arc(sunX, sunY, 30, 0, Math.PI * 2);
            celestialCtx.fill();
            
            // 光線
            for (let i = 0; i < 12; i++) {
                const angle = (i / 12) * Math.PI * 2;
                celestialCtx.strokeStyle = 'rgba(253, 184, 19, 0.5)';
                celestialCtx.lineWidth = 2;
                celestialCtx.beginPath();
                celestialCtx.moveTo(sunX, sunY);
                celestialCtx.lineTo(sunX + Math.cos(angle) * 45, sunY + Math.sin(angle) * 45);
                celestialCtx.stroke();
            }
        }
        
        // 太陽の軌跡
        celestialCtx.strokeStyle = 'rgba(253, 184, 19, 0.3)';
        celestialCtx.lineWidth = 2;
        celestialCtx.setLineDash([5, 5]);
        celestialCtx.beginPath();
        for (let t = 6; t <= 18; t += 0.5) {
            const sunAngle = ((t - 6) / 12) * Math.PI;
            const x = centerX + Math.cos(sunAngle - Math.PI / 2) * 200;
            const y = horizon - Math.sin(sunAngle - Math.PI / 2) * 150;
            if (t === 6) {
                celestialCtx.moveTo(x, y);
            } else {
                celestialCtx.lineTo(x, y);
            }
        }
        celestialCtx.stroke();
        celestialCtx.setLineDash([]);
    }
    
    // 地平線
    celestialCtx.fillStyle = '#27ae60';
    celestialCtx.fillRect(0, horizon, celestialCanvas.width, 50);
    celestialCtx.strokeStyle = '#2c3e50';
    celestialCtx.lineWidth = 2;
    celestialCtx.beginPath();
    celestialCtx.moveTo(0, horizon);
    celestialCtx.lineTo(celestialCanvas.width, horizon);
    celestialCtx.stroke();
    
    // 時刻表示
    celestialCtx.fillStyle = '#fff';
    celestialCtx.font = '14px Noto Sans JP';
    celestialCtx.fillText(`現在時刻: ${time}時`, 20, 60);
}

function animateCelestial() {
    if (!celestialRunning) return;
    
    time = (time + 1) % 24;
    document.getElementById('timeSlider').value = time;
    document.getElementById('timeValue').textContent = time;
    drawCelestial();
    
    setTimeout(() => animateCelestial(), 300);
}

drawCelestial();
