// 生物シミュレーション用JavaScript
// 1. 細胞の観察、2. 光合成、3. 食物連鎖、4. 細胞分裂、5. 人体の臓器

// ============================================
// 1. 細胞の観察
// ============================================
const cellCanvas = document.getElementById('cellCanvas');
const cellCtx = cellCanvas.getContext('2d');
let cellType = 'plant';
let magnification = 100;

document.getElementById('cellType').addEventListener('change', (e) => {
    cellType = e.target.value;
    drawCell();
});

document.getElementById('magnificationSlider').addEventListener('input', (e) => {
    magnification = parseInt(e.target.value);
    document.getElementById('magnificationValue').textContent = magnification;
    drawCell();
});

function drawCell() {
    cellCtx.clearRect(0, 0, cellCanvas.width, cellCanvas.height);
    const scale = magnification / 100;
    const centerX = cellCanvas.width / 2;
    const centerY = cellCanvas.height / 2;
    
    if (cellType === 'plant') {
        // 植物細胞 - 細胞壁
        cellCtx.strokeStyle = '#2ecc71';
        cellCtx.lineWidth = 5 * scale;
        cellCtx.strokeRect(centerX - 150 * scale, centerY - 120 * scale, 300 * scale, 240 * scale);
        
        // 細胞膜
        cellCtx.strokeStyle = '#27ae60';
        cellCtx.lineWidth = 2 * scale;
        cellCtx.strokeRect(centerX - 145 * scale, centerY - 115 * scale, 290 * scale, 230 * scale);
        
        // 核
        cellCtx.fillStyle = 'rgba(52, 152, 219, 0.5)';
        cellCtx.beginPath();
        cellCtx.arc(centerX, centerY, 40 * scale, 0, Math.PI * 2);
        cellCtx.fill();
        cellCtx.strokeStyle = '#3498db';
        cellCtx.lineWidth = 2 * scale;
        cellCtx.stroke();
        
        // 液胞
        cellCtx.fillStyle = 'rgba(155, 89, 182, 0.3)';
        cellCtx.beginPath();
        cellCtx.arc(centerX + 60 * scale, centerY - 30 * scale, 50 * scale, 0, Math.PI * 2);
        cellCtx.fill();
        cellCtx.strokeStyle = '#9b59b6';
        cellCtx.stroke();
        
        // 葉緑体
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * 80 * scale;
            const y = centerY + Math.sin(angle) * 60 * scale;
            cellCtx.fillStyle = 'rgba(46, 204, 113, 0.7)';
            cellCtx.beginPath();
            cellCtx.ellipse(x, y, 12 * scale, 8 * scale, angle, 0, Math.PI * 2);
            cellCtx.fill();
        }
        
        // ラベル
        cellCtx.fillStyle = '#2c3e50';
        cellCtx.font = `${14 * scale}px Noto Sans JP`;
        cellCtx.fillText('細胞壁', centerX - 140 * scale, centerY - 130 * scale);
        cellCtx.fillText('核', centerX + 10 * scale, centerY);
        cellCtx.fillText('液胞', centerX + 70 * scale, centerY - 30 * scale);
        cellCtx.fillText('葉緑体', centerX + 85 * scale, centerY + 60 * scale);
        
    } else {
        // 動物細胞 - 細胞膜（不規則な形）
        cellCtx.fillStyle = 'rgba(231, 76, 60, 0.1)';
        cellCtx.strokeStyle = '#e74c3c';
        cellCtx.lineWidth = 3 * scale;
        cellCtx.beginPath();
        cellCtx.ellipse(centerX, centerY, 150 * scale, 110 * scale, 0, 0, Math.PI * 2);
        cellCtx.fill();
        cellCtx.stroke();
        
        // 核
        cellCtx.fillStyle = 'rgba(52, 152, 219, 0.5)';
        cellCtx.beginPath();
        cellCtx.arc(centerX - 20 * scale, centerY, 45 * scale, 0, Math.PI * 2);
        cellCtx.fill();
        cellCtx.strokeStyle = '#3498db';
        cellCtx.lineWidth = 2 * scale;
        cellCtx.stroke();
        
        // ミトコンドリア
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * 70 * scale;
            const y = centerY + Math.sin(angle) * 50 * scale;
            cellCtx.fillStyle = 'rgba(241, 196, 15, 0.7)';
            cellCtx.beginPath();
            cellCtx.ellipse(x, y, 15 * scale, 8 * scale, angle, 0, Math.PI * 2);
            cellCtx.fill();
            cellCtx.strokeStyle = '#f39c12';
            cellCtx.stroke();
        }
        
        // ラベル
        cellCtx.fillStyle = '#2c3e50';
        cellCtx.font = `${14 * scale}px Noto Sans JP`;
        cellCtx.fillText('細胞膜', centerX + 100 * scale, centerY - 100 * scale);
        cellCtx.fillText('核', centerX - 60 * scale, centerY);
        cellCtx.fillText('ミトコンドリア', centerX + 80 * scale, centerY + 60 * scale);
    }
    
    cellCtx.fillStyle = '#2c3e50';
    cellCtx.font = `bold ${16 * scale}px Noto Sans JP`;
    cellCtx.fillText(cellType === 'plant' ? '植物細胞' : '動物細胞', 20, 30);
}

drawCell();

// ============================================
// 2. 光合成のしくみ
// ============================================
const photosynthesisCanvas = document.getElementById('photosynthesisCanvas');
const photosynthesisCtx = photosynthesisCanvas.getContext('2d');
let lightIntensity = 50;
let photosynthesisRunning = false;
let co2Particles = [];
let o2Particles = [];

document.getElementById('lightIntensitySlider').addEventListener('input', (e) => {
    lightIntensity = parseInt(e.target.value);
    document.getElementById('lightIntensityValue').textContent = lightIntensity;
});

document.getElementById('startPhotosynthesis').addEventListener('click', () => {
    photosynthesisRunning = true;
    co2Particles = [];
    o2Particles = [];
    animatePhotosynthesis();
});

document.getElementById('stopPhotosynthesis').addEventListener('click', () => {
    photosynthesisRunning = false;
});

function drawPhotosynthesis() {
    photosynthesisCtx.clearRect(0, 0, photosynthesisCanvas.width, photosynthesisCanvas.height);
    
    // 太陽
    const sunIntensity = lightIntensity / 100;
    photosynthesisCtx.fillStyle = `rgba(255, 193, 7, ${sunIntensity})`;
    photosynthesisCtx.beginPath();
    photosynthesisCtx.arc(500, 50, 40, 0, Math.PI * 2);
    photosynthesisCtx.fill();
    
    // 光線
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        photosynthesisCtx.strokeStyle = `rgba(255, 193, 7, ${sunIntensity * 0.5})`;
        photosynthesisCtx.lineWidth = 3;
        photosynthesisCtx.beginPath();
        photosynthesisCtx.moveTo(500, 50);
        photosynthesisCtx.lineTo(500 + Math.cos(angle) * 60, 50 + Math.sin(angle) * 60);
        photosynthesisCtx.stroke();
    }
    
    // 葉
    photosynthesisCtx.fillStyle = '#2ecc71';
    photosynthesisCtx.beginPath();
    photosynthesisCtx.ellipse(300, 200, 80, 50, 0, 0, Math.PI * 2);
    photosynthesisCtx.fill();
    photosynthesisCtx.strokeStyle = '#27ae60';
    photosynthesisCtx.lineWidth = 3;
    photosynthesisCtx.stroke();
    
    // 葉脈
    photosynthesisCtx.strokeStyle = '#27ae60';
    photosynthesisCtx.lineWidth = 2;
    photosynthesisCtx.beginPath();
    photosynthesisCtx.moveTo(300, 150);
    photosynthesisCtx.lineTo(300, 250);
    photosynthesisCtx.stroke();
    
    // CO2粒子（入力）
    co2Particles.forEach(p => {
        photosynthesisCtx.fillStyle = 'rgba(52, 152, 219, 0.7)';
        photosynthesisCtx.beginPath();
        photosynthesisCtx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        photosynthesisCtx.fill();
    });
    
    // O2粒子（出力）
    o2Particles.forEach(p => {
        photosynthesisCtx.fillStyle = 'rgba(231, 76, 60, 0.7)';
        photosynthesisCtx.beginPath();
        photosynthesisCtx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        photosynthesisCtx.fill();
    });
    
    // 情報表示
    photosynthesisCtx.fillStyle = '#2c3e50';
    photosynthesisCtx.font = 'bold 16px Noto Sans JP';
    photosynthesisCtx.fillText('光合成の式:', 20, 320);
    photosynthesisCtx.font = '14px Noto Sans JP';
    photosynthesisCtx.fillText('6CO₂ + 6H₂O + 光エネルギー → C₆H₁₂O₆ + 6O₂', 20, 345);
    photosynthesisCtx.fillText('(二酸化炭素 + 水 + 光 → ブドウ糖 + 酸素)', 20, 370);
    
    photosynthesisCtx.fillStyle = '#3498db';
    photosynthesisCtx.fillText('CO₂ →', 50, 180);
    photosynthesisCtx.fillStyle = '#e74c3c';
    photosynthesisCtx.fillText('← O₂', 450, 200);
}

function animatePhotosynthesis() {
    if (!photosynthesisRunning) return;
    
    // CO2の生成
    if (Math.random() < 0.1 && co2Particles.length < 20) {
        co2Particles.push({ x: 50, y: 170 + Math.random() * 60 });
    }
    
    // CO2の移動
    co2Particles.forEach((p, index) => {
        p.x += 2;
        if (p.x > 250) {
            co2Particles.splice(index, 1);
            // 光合成の速度に応じてO2を生成
            if (Math.random() < lightIntensity / 100) {
                o2Particles.push({ x: 350, y: 180 + Math.random() * 40 });
            }
        }
    });
    
    // O2の移動
    o2Particles.forEach((p, index) => {
        p.x += 2;
        if (p.x > photosynthesisCanvas.width) {
            o2Particles.splice(index, 1);
        }
    });
    
    drawPhotosynthesis();
    requestAnimationFrame(animatePhotosynthesis);
}

drawPhotosynthesis();

// ============================================
// 3. 食物連鎖・生態系
// ============================================
const foodChainCanvas = document.getElementById('foodChainCanvas');
const foodChainCtx = foodChainCanvas.getContext('2d');
let plantsCount = 50;
let herbivoresCount = 20;
let carnivoresCount = 5;
let ecosystemRunning = false;
let timeStep = 0;

document.getElementById('plantsSlider').addEventListener('input', (e) => {
    plantsCount = parseInt(e.target.value);
    document.getElementById('plantsValue').textContent = plantsCount;
    if (!ecosystemRunning) drawFoodChain();
});

document.getElementById('herbivoresSlider').addEventListener('input', (e) => {
    herbivoresCount = parseInt(e.target.value);
    document.getElementById('herbivoresValue').textContent = herbivoresCount;
    if (!ecosystemRunning) drawFoodChain();
});

document.getElementById('carnivoresSlider').addEventListener('input', (e) => {
    carnivoresCount = parseInt(e.target.value);
    document.getElementById('carnivoresValue').textContent = carnivoresCount;
    if (!ecosystemRunning) drawFoodChain();
});

document.getElementById('startEcosystem').addEventListener('click', () => {
    ecosystemRunning = true;
    timeStep = 0;
    animateEcosystem();
});

document.getElementById('stopEcosystem').addEventListener('click', () => {
    ecosystemRunning = false;
});

function drawFoodChain() {
    foodChainCtx.clearRect(0, 0, foodChainCanvas.width, foodChainCanvas.height);
    
    // 背景（地面と空）
    foodChainCtx.fillStyle = '#87CEEB';
    foodChainCtx.fillRect(0, 0, foodChainCanvas.width, foodChainCanvas.height / 2);
    foodChainCtx.fillStyle = '#90EE90';
    foodChainCtx.fillRect(0, foodChainCanvas.height / 2, foodChainCanvas.width, foodChainCanvas.height / 2);
    
    // 植物
    const plantSize = Math.min(10, 500 / plantsCount);
    for (let i = 0; i < plantsCount; i++) {
        const x = (i % 50) * (foodChainCanvas.width / 50);
        const y = foodChainCanvas.height - 50 + Math.sin(timeStep + i) * 5;
        foodChainCtx.fillStyle = '#2ecc71';
        foodChainCtx.fillRect(x, y, plantSize, 20);
        foodChainCtx.fillStyle = '#27ae60';
        foodChainCtx.beginPath();
        foodChainCtx.arc(x + plantSize / 2, y - 5, plantSize, 0, Math.PI * 2);
        foodChainCtx.fill();
    }
    
    // 草食動物（ウサギ）
    for (let i = 0; i < herbivoresCount; i++) {
        const x = (i * 30 + timeStep * 20) % foodChainCanvas.width;
        const y = foodChainCanvas.height - 80;
        foodChainCtx.fillStyle = '#95a5a6';
        foodChainCtx.fillRect(x, y, 15, 12);
        foodChainCtx.beginPath();
        foodChainCtx.arc(x + 12, y - 5, 8, 0, Math.PI * 2);
        foodChainCtx.fill();
    }
    
    // 肉食動物（キツネ）
    for (let i = 0; i < carnivoresCount; i++) {
        const x = (i * 100 + timeStep * 30) % foodChainCanvas.width;
        const y = foodChainCanvas.height - 100;
        foodChainCtx.fillStyle = '#e67e22';
        foodChainCtx.fillRect(x, y, 20, 15);
        foodChainCtx.beginPath();
        foodChainCtx.moveTo(x + 20, y);
        foodChainCtx.lineTo(x + 30, y + 5);
        foodChainCtx.lineTo(x + 20, y + 10);
        foodChainCtx.fill();
        foodChainCtx.beginPath();
        foodChainCtx.arc(x + 5, y - 5, 7, 0, Math.PI * 2);
        foodChainCtx.fill();
    }
    
    // 食物連鎖の図
    const chainY = 50;
    foodChainCtx.fillStyle = '#2ecc71';
    foodChainCtx.fillRect(50, chainY, 60, 30);
    foodChainCtx.fillStyle = '#fff';
    foodChainCtx.font = '14px Noto Sans JP';
    foodChainCtx.fillText('植物', 60, chainY + 20);
    
    foodChainCtx.fillStyle = '#95a5a6';
    foodChainCtx.fillRect(200, chainY, 80, 30);
    foodChainCtx.fillStyle = '#fff';
    foodChainCtx.fillText('草食動物', 210, chainY + 20);
    
    foodChainCtx.fillStyle = '#e67e22';
    foodChainCtx.fillRect(370, chainY, 80, 30);
    foodChainCtx.fillStyle = '#fff';
    foodChainCtx.fillText('肉食動物', 380, chainY + 20);
    
    // 矢印
    foodChainCtx.strokeStyle = '#2c3e50';
    foodChainCtx.lineWidth = 3;
    foodChainCtx.fillStyle = '#2c3e50';
    
    // 植物→草食動物
    foodChainCtx.beginPath();
    foodChainCtx.moveTo(110, chainY + 15);
    foodChainCtx.lineTo(200, chainY + 15);
    foodChainCtx.stroke();
    foodChainCtx.beginPath();
    foodChainCtx.moveTo(200, chainY + 15);
    foodChainCtx.lineTo(190, chainY + 10);
    foodChainCtx.lineTo(190, chainY + 20);
    foodChainCtx.fill();
    
    // 草食動物→肉食動物
    foodChainCtx.beginPath();
    foodChainCtx.moveTo(280, chainY + 15);
    foodChainCtx.lineTo(370, chainY + 15);
    foodChainCtx.stroke();
    foodChainCtx.beginPath();
    foodChainCtx.moveTo(370, chainY + 15);
    foodChainCtx.lineTo(360, chainY + 10);
    foodChainCtx.lineTo(360, chainY + 20);
    foodChainCtx.fill();
    
    // 個体数表示
    foodChainCtx.fillStyle = '#2c3e50';
    foodChainCtx.font = '14px Noto Sans JP';
    foodChainCtx.fillText(`植物: ${plantsCount}`, 50, chainY + 50);
    foodChainCtx.fillText(`草食動物: ${herbivoresCount}`, 200, chainY + 50);
    foodChainCtx.fillText(`肉食動物: ${carnivoresCount}`, 370, chainY + 50);
}

function animateEcosystem() {
    if (!ecosystemRunning) return;
    
    timeStep += 0.1;
    
    // 簡易的な個体数変動シミュレーション
    if (Math.floor(timeStep) % 2 === 0) {
        // 植物は増える傾向
        if (plantsCount < 100 && Math.random() < 0.3) {
            plantsCount += 1;
            document.getElementById('plantsValue').textContent = plantsCount;
        }
        
        // 草食動物は植物が多ければ増え、少なければ減る
        if (plantsCount > herbivoresCount * 2 && herbivoresCount < 50 && Math.random() < 0.2) {
            herbivoresCount += 1;
            document.getElementById('herbivoresValue').textContent = herbivoresCount;
        } else if (plantsCount < herbivoresCount && herbivoresCount > 5 && Math.random() < 0.1) {
            herbivoresCount -= 1;
            document.getElementById('herbivoresValue').textContent = herbivoresCount;
        }
        
        // 肉食動物は草食動物が多ければ増え、少なければ減る
        if (herbivoresCount > carnivoresCount * 3 && carnivoresCount < 20 && Math.random() < 0.1) {
            carnivoresCount += 1;
            document.getElementById('carnivoresValue').textContent = carnivoresCount;
        } else if (herbivoresCount < carnivoresCount * 2 && carnivoresCount > 1 && Math.random() < 0.15) {
            carnivoresCount -= 1;
            document.getElementById('carnivoresValue').textContent = carnivoresCount;
        }
    }
    
    drawFoodChain();
    requestAnimationFrame(animateEcosystem);
}

drawFoodChain();

// ============================================
// 4. 細胞分裂
// ============================================
const mitosisCanvas = document.getElementById('mitosisCanvas');
const mitosisCtx = mitosisCanvas.getContext('2d');
let mitosisStage = 0;
let mitosisRunning = false;
const stageNames = ['間期', '前期', '中期', '後期', '終期'];

document.getElementById('mitosisStageSlider').addEventListener('input', (e) => {
    mitosisStage = parseInt(e.target.value);
    document.getElementById('mitosisStageValue').textContent = stageNames[mitosisStage];
    drawMitosis();
});

document.getElementById('startMitosis').addEventListener('click', () => {
    mitosisRunning = true;
    mitosisStage = 0;
    animateMitosis();
});

document.getElementById('stopMitosis').addEventListener('click', () => {
    mitosisRunning = false;
});

document.getElementById('resetMitosis').addEventListener('click', () => {
    mitosisRunning = false;
    mitosisStage = 0;
    document.getElementById('mitosisStageSlider').value = 0;
    document.getElementById('mitosisStageValue').textContent = stageNames[0];
    drawMitosis();
});

function drawMitosis() {
    mitosisCtx.clearRect(0, 0, mitosisCanvas.width, mitosisCanvas.height);
    
    const centerX = mitosisCanvas.width / 2;
    const centerY = mitosisCanvas.height / 2;
    
    // 細胞膜
    mitosisCtx.strokeStyle = '#e74c3c';
    mitosisCtx.lineWidth = 3;
    
    if (mitosisStage === 0) {
        // 間期 - 普通の細胞
        mitosisCtx.beginPath();
        mitosisCtx.arc(centerX, centerY, 100, 0, Math.PI * 2);
        mitosisCtx.stroke();
        
        // 核
        mitosisCtx.fillStyle = 'rgba(52, 152, 219, 0.3)';
        mitosisCtx.beginPath();
        mitosisCtx.arc(centerX, centerY, 40, 0, Math.PI * 2);
        mitosisCtx.fill();
        mitosisCtx.strokeStyle = '#3498db';
        mitosisCtx.stroke();
        
        // 染色体（DNAが複製されている）
        mitosisCtx.fillStyle = '#9b59b6';
        mitosisCtx.fillRect(centerX - 15, centerY - 10, 30, 5);
        mitosisCtx.fillRect(centerX - 10, centerY + 5, 20, 5);
        
    } else if (mitosisStage === 1) {
        // 前期 - 染色体が凝縮
        mitosisCtx.beginPath();
        mitosisCtx.arc(centerX, centerY, 100, 0, Math.PI * 2);
        mitosisCtx.stroke();
        
        // 核が消えかけ
        mitosisCtx.strokeStyle = 'rgba(52, 152, 219, 0.3)';
        mitosisCtx.setLineDash([5, 5]);
        mitosisCtx.beginPath();
        mitosisCtx.arc(centerX, centerY, 40, 0, Math.PI * 2);
        mitosisCtx.stroke();
        mitosisCtx.setLineDash([]);
        
        // 染色体が凝縮してX型に
        mitosisCtx.fillStyle = '#9b59b6';
        drawChromosome(mitosisCtx, centerX - 25, centerY - 20);
        drawChromosome(mitosisCtx, centerX + 25, centerY - 20);
        drawChromosome(mitosisCtx, centerX - 25, centerY + 20);
        drawChromosome(mitosisCtx, centerX + 25, centerY + 20);
        
    } else if (mitosisStage === 2) {
        // 中期 - 染色体が赤道面に整列
        mitosisCtx.beginPath();
        mitosisCtx.arc(centerX, centerY, 100, 0, Math.PI * 2);
        mitosisCtx.stroke();
        
        // 赤道面
        mitosisCtx.strokeStyle = '#95a5a6';
        mitosisCtx.setLineDash([3, 3]);
        mitosisCtx.beginPath();
        mitosisCtx.moveTo(centerX - 100, centerY);
        mitosisCtx.lineTo(centerX + 100, centerY);
        mitosisCtx.stroke();
        mitosisCtx.setLineDash([]);
        
        // 染色体が中央に並ぶ
        mitosisCtx.fillStyle = '#9b59b6';
        for (let i = 0; i < 4; i++) {
            drawChromosome(mitosisCtx, centerX - 60 + i * 40, centerY);
        }
        
        // 紡錘糸
        mitosisCtx.strokeStyle = '#95a5a6';
        mitosisCtx.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
            const x = centerX - 60 + i * 40;
            mitosisCtx.beginPath();
            mitosisCtx.moveTo(x, centerY);
            mitosisCtx.lineTo(x, centerY - 80);
            mitosisCtx.stroke();
            mitosisCtx.beginPath();
            mitosisCtx.moveTo(x, centerY);
            mitosisCtx.lineTo(x, centerY + 80);
            mitosisCtx.stroke();
        }
        
    } else if (mitosisStage === 3) {
        // 後期 - 染色体が両極へ移動
        mitosisCtx.beginPath();
        mitosisCtx.ellipse(centerX, centerY, 110, 90, 0, 0, Math.PI * 2);
        mitosisCtx.stroke();
        
        // 上の極へ
        mitosisCtx.fillStyle = '#9b59b6';
        for (let i = 0; i < 4; i++) {
            drawChromosome(mitosisCtx, centerX - 60 + i * 40, centerY - 50);
        }
        
        // 下の極へ
        for (let i = 0; i < 4; i++) {
            drawChromosome(mitosisCtx, centerX - 60 + i * 40, centerY + 50);
        }
        
    } else if (mitosisStage === 4) {
        // 終期 - 2つの細胞に分裂
        // 上の細胞
        mitosisCtx.strokeStyle = '#e74c3c';
        mitosisCtx.lineWidth = 3;
        mitosisCtx.beginPath();
        mitosisCtx.arc(centerX, centerY - 60, 60, 0, Math.PI * 2);
        mitosisCtx.stroke();
        
        // 上の細胞の核
        mitosisCtx.fillStyle = 'rgba(52, 152, 219, 0.3)';
        mitosisCtx.beginPath();
        mitosisCtx.arc(centerX, centerY - 60, 30, 0, Math.PI * 2);
        mitosisCtx.fill();
        mitosisCtx.strokeStyle = '#3498db';
        mitosisCtx.stroke();
        
        // 下の細胞
        mitosisCtx.strokeStyle = '#e74c3c';
        mitosisCtx.beginPath();
        mitosisCtx.arc(centerX, centerY + 60, 60, 0, Math.PI * 2);
        mitosisCtx.stroke();
        
        // 下の細胞の核
        mitosisCtx.fillStyle = 'rgba(52, 152, 219, 0.3)';
        mitosisCtx.beginPath();
        mitosisCtx.arc(centerX, centerY + 60, 30, 0, Math.PI * 2);
        mitosisCtx.fill();
        mitosisCtx.strokeStyle = '#3498db';
        mitosisCtx.stroke();
    }
    
    // ステージ名表示
    mitosisCtx.fillStyle = '#2c3e50';
    mitosisCtx.font = 'bold 24px Noto Sans JP';
    mitosisCtx.fillText(`【${stageNames[mitosisStage]}】`, 20, 40);
    
    // 説明
    const descriptions = [
        'DNAが複製され、細胞が成長する',
        '染色体が凝縮してX型になり、核膜が消える',
        '染色体が細胞の中央（赤道面）に並ぶ',
        '染色体が両極へ引っ張られて移動する',
        '核膜が再形成され、2つの細胞に分かれる'
    ];
    mitosisCtx.font = '14px Noto Sans JP';
    mitosisCtx.fillText(descriptions[mitosisStage], 20, 370);
}

function drawChromosome(ctx, x, y) {
    ctx.fillStyle = '#9b59b6';
    // X型の染色体
    ctx.fillRect(x - 10, y - 3, 20, 6);
    ctx.fillRect(x - 3, y - 10, 6, 20);
    // 動原体
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
}

function animateMitosis() {
    if (!mitosisRunning) return;
    
    setTimeout(() => {
        mitosisStage = (mitosisStage + 1) % 5;
        document.getElementById('mitosisStageSlider').value = mitosisStage;
        document.getElementById('mitosisStageValue').textContent = stageNames[mitosisStage];
        drawMitosis();
        
        if (mitosisRunning) {
            animateMitosis();
        }
    }, 2000);
}

drawMitosis();

// ============================================
// 5. 人体の臓器配置
// ============================================
const humanBodyCanvas = document.getElementById('humanBodyCanvas');
const humanBodyCtx = humanBodyCanvas.getContext('2d');
let bodySystemType = 'digestive';

document.getElementById('bodySystemType').addEventListener('change', (e) => {
    bodySystemType = e.target.value;
    drawHumanBody();
});

function drawHumanBody() {
    humanBodyCtx.clearRect(0, 0, humanBodyCanvas.width, humanBodyCanvas.height);
    
    const centerX = humanBodyCanvas.width / 2;
    
    // 体の輪郭
    humanBodyCtx.strokeStyle = '#95a5a6';
    humanBodyCtx.lineWidth = 3;
    humanBodyCtx.beginPath();
    // 頭
    humanBodyCtx.arc(centerX, 60, 30, 0, Math.PI * 2);
    humanBodyCtx.stroke();
    // 胴体
    humanBodyCtx.beginPath();
    humanBodyCtx.ellipse(centerX, 200, 60, 120, 0, 0, Math.PI * 2);
    humanBodyCtx.stroke();
    
    if (bodySystemType === 'digestive' || bodySystemType === 'all') {
        // 消化器系
        // 胃
        humanBodyCtx.fillStyle = 'rgba(241, 196, 15, 0.6)';
        humanBodyCtx.beginPath();
        humanBodyCtx.ellipse(centerX - 15, 140, 25, 35, 0.3, 0, Math.PI * 2);
        humanBodyCtx.fill();
        humanBodyCtx.strokeStyle = '#f39c12';
        humanBodyCtx.stroke();
        
        // 小腸
        humanBodyCtx.fillStyle = 'rgba(230, 126, 34, 0.6)';
        humanBodyCtx.beginPath();
        humanBodyCtx.arc(centerX, 220, 35, 0, Math.PI * 2);
        humanBodyCtx.fill();
        humanBodyCtx.strokeStyle = '#e67e22';
        humanBodyCtx.stroke();
        
        // 大腸
        humanBodyCtx.strokeStyle = '#d35400';
        humanBodyCtx.lineWidth = 8;
        humanBodyCtx.beginPath();
        humanBodyCtx.arc(centerX, 240, 45, 0, Math.PI * 1.8);
        humanBodyCtx.stroke();
        
        // ラベル
        humanBodyCtx.fillStyle = '#2c3e50';
        humanBodyCtx.font = '12px Noto Sans JP';
        humanBodyCtx.fillText('胃', centerX + 20, 140);
        humanBodyCtx.fillText('小腸', centerX + 40, 220);
        humanBodyCtx.fillText('大腸', centerX + 50, 270);
    }
    
    if (bodySystemType === 'respiratory' || bodySystemType === 'all') {
        // 呼吸器系
        // 気管
        humanBodyCtx.strokeStyle = '#3498db';
        humanBodyCtx.lineWidth = 6;
        humanBodyCtx.beginPath();
        humanBodyCtx.moveTo(centerX, 90);
        humanBodyCtx.lineTo(centerX, 120);
        humanBodyCtx.stroke();
        
        // 肺（左）
        humanBodyCtx.fillStyle = 'rgba(52, 152, 219, 0.4)';
        humanBodyCtx.beginPath();
        humanBodyCtx.ellipse(centerX - 30, 170, 20, 50, 0, 0, Math.PI * 2);
        humanBodyCtx.fill();
        humanBodyCtx.strokeStyle = '#2980b9';
        humanBodyCtx.lineWidth = 2;
        humanBodyCtx.stroke();
        
        // 肺（右）
        humanBodyCtx.beginPath();
        humanBodyCtx.ellipse(centerX + 30, 170, 20, 50, 0, 0, Math.PI * 2);
        humanBodyCtx.fill();
        humanBodyCtx.stroke();
        
        // ラベル
        humanBodyCtx.fillStyle = '#2c3e50';
        humanBodyCtx.font = '12px Noto Sans JP';
        humanBodyCtx.fillText('気管', centerX + 10, 105);
        humanBodyCtx.fillText('肺', centerX - 50, 170);
        humanBodyCtx.fillText('肺', centerX + 50, 170);
    }
    
    if (bodySystemType === 'circulatory' || bodySystemType === 'all') {
        // 循環器系
        // 心臓
        humanBodyCtx.fillStyle = 'rgba(231, 76, 60, 0.7)';
        humanBodyCtx.beginPath();
        humanBodyCtx.moveTo(centerX, 140);
        humanBodyCtx.bezierCurveTo(centerX - 25, 120, centerX - 40, 140, centerX, 175);
        humanBodyCtx.bezierCurveTo(centerX + 40, 140, centerX + 25, 120, centerX, 140);
        humanBodyCtx.fill();
        humanBodyCtx.strokeStyle = '#c0392b';
        humanBodyCtx.lineWidth = 2;
        humanBodyCtx.stroke();
        
        // 血管（簡略）
        humanBodyCtx.strokeStyle = '#e74c3c';
        humanBodyCtx.lineWidth = 4;
        humanBodyCtx.beginPath();
        humanBodyCtx.moveTo(centerX, 175);
        humanBodyCtx.lineTo(centerX, 280);
        humanBodyCtx.stroke();
        
        // ラベル
        humanBodyCtx.fillStyle = '#2c3e50';
        humanBodyCtx.font = '12px Noto Sans JP';
        humanBodyCtx.fillText('心臓', centerX + 15, 160);
    }
    
    // タイトル
    humanBodyCtx.fillStyle = '#2c3e50';
    humanBodyCtx.font = 'bold 16px Noto Sans JP';
    const systemNames = {
        digestive: '消化器系',
        respiratory: '呼吸器系',
        circulatory: '循環器系',
        all: '全体表示'
    };
    humanBodyCtx.fillText(systemNames[bodySystemType], 20, 30);
    
    // 説明
    humanBodyCtx.font = '12px Noto Sans JP';
    const systemDesc = {
        digestive: '食べ物を消化・吸収する器官',
        respiratory: '酸素を取り入れ、二酸化炭素を排出',
        circulatory: '血液を全身に送り、栄養と酸素を運ぶ',
        all: '人体の主要な臓器を表示'
    };
    humanBodyCtx.fillText(systemDesc[bodySystemType], 20, 50);
}

drawHumanBody();
