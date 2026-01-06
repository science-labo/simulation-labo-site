// ============================================
// 1. 振り子の運動シミュレーション
// ============================================

const pendulumCanvas = document.getElementById('pendulumCanvas');
const pendulumCtx = pendulumCanvas.getContext('2d');
let pendulumRunning = false;
let pendulumAngle = 0;
let pendulumAngularVelocity = 0;
let pendulumLength = 150;
let pendulumMass = 5;

const lengthSlider = document.getElementById('lengthSlider');
const massSlider = document.getElementById('massSlider');
const angleSlider = document.getElementById('angleSlider');
const startPendulum = document.getElementById('startPendulum');
const stopPendulum = document.getElementById('stopPendulum');
const resetPendulum = document.getElementById('resetPendulum');

lengthSlider.addEventListener('input', (e) => {
    pendulumLength = parseInt(e.target.value);
    document.getElementById('lengthValue').textContent = pendulumLength;
    if (!pendulumRunning) drawPendulum();
});

massSlider.addEventListener('input', (e) => {
    pendulumMass = parseInt(e.target.value);
    document.getElementById('massValue').textContent = pendulumMass;
    if (!pendulumRunning) drawPendulum();
});

angleSlider.addEventListener('input', (e) => {
    const angle = parseInt(e.target.value);
    document.getElementById('angleValue').textContent = angle;
    pendulumAngle = (angle * Math.PI) / 180;
    if (!pendulumRunning) drawPendulum();
});

startPendulum.addEventListener('click', () => {
    pendulumRunning = true;
    animatePendulum();
});

stopPendulum.addEventListener('click', () => {
    pendulumRunning = false;
});

resetPendulum.addEventListener('click', () => {
    pendulumRunning = false;
    pendulumAngularVelocity = 0;
    const initialAngle = parseInt(angleSlider.value);
    pendulumAngle = (initialAngle * Math.PI) / 180;
    drawPendulum();
});

function drawPendulum() {
    pendulumCtx.clearRect(0, 0, pendulumCanvas.width, pendulumCanvas.height);
    
    const originX = pendulumCanvas.width / 2;
    const originY = 50;
    const scale = 1.2;
    const x = originX + pendulumLength * scale * Math.sin(pendulumAngle);
    const y = originY + pendulumLength * scale * Math.cos(pendulumAngle);
    
    // 天井
    pendulumCtx.fillStyle = '#555';
    pendulumCtx.fillRect(originX - 30, originY - 10, 60, 10);
    
    // 糸
    pendulumCtx.strokeStyle = '#333';
    pendulumCtx.lineWidth = 2;
    pendulumCtx.beginPath();
    pendulumCtx.moveTo(originX, originY);
    pendulumCtx.lineTo(x, y);
    pendulumCtx.stroke();
    
    // おもり
    const radius = 10 + pendulumMass * 2;
    pendulumCtx.fillStyle = '#3498db';
    pendulumCtx.beginPath();
    pendulumCtx.arc(x, y, radius, 0, Math.PI * 2);
    pendulumCtx.fill();
    pendulumCtx.strokeStyle = '#2980b9';
    pendulumCtx.lineWidth = 3;
    pendulumCtx.stroke();
    
    // 軌跡の弧
    pendulumCtx.strokeStyle = 'rgba(52, 152, 219, 0.3)';
    pendulumCtx.lineWidth = 1;
    pendulumCtx.beginPath();
    pendulumCtx.arc(originX, originY, pendulumLength * scale, 0, Math.PI);
    pendulumCtx.stroke();
}

function animatePendulum() {
    if (!pendulumRunning) return;
    
    const gravity = 0.5;
    const damping = 0.995;
    const angularAcceleration = (-gravity / pendulumLength) * Math.sin(pendulumAngle);
    
    pendulumAngularVelocity += angularAcceleration;
    pendulumAngularVelocity *= damping;
    pendulumAngle += pendulumAngularVelocity;
    
    drawPendulum();
    requestAnimationFrame(animatePendulum);
}

drawPendulum();

// ============================================
// 2. ばねの伸縮シミュレーション
// ============================================

const springCanvas = document.getElementById('springCanvas');
const springCtx = springCanvas.getContext('2d');
let springForce = 50;
let springConst = 50;

const forceSlider = document.getElementById('forceSlider');
const springConstSlider = document.getElementById('springConstSlider');
const resetSpring = document.getElementById('resetSpring');

forceSlider.addEventListener('input', (e) => {
    springForce = parseInt(e.target.value);
    document.getElementById('forceValue').textContent = springForce;
    drawSpring();
});

springConstSlider.addEventListener('input', (e) => {
    springConst = parseInt(e.target.value);
    document.getElementById('springConstValue').textContent = springConst;
    drawSpring();
});

resetSpring.addEventListener('click', () => {
    springForce = 50;
    springConst = 50;
    forceSlider.value = 50;
    springConstSlider.value = 50;
    document.getElementById('forceValue').textContent = 50;
    document.getElementById('springConstValue').textContent = 50;
    drawSpring();
});

function drawSpring() {
    springCtx.clearRect(0, 0, springCanvas.width, springCanvas.height);
    
    const extension = springForce / springConst * 50; // スケール調整
    const originX = 100;
    const originY = 50;
    const naturalLength = 100;
    const totalLength = naturalLength + extension;
    
    // 天井
    springCtx.fillStyle = '#555';
    springCtx.fillRect(originX - 30, originY - 10, 60, 10);
    
    // ばね
    springCtx.strokeStyle = '#e74c3c';
    springCtx.lineWidth = 3;
    springCtx.beginPath();
    springCtx.moveTo(originX, originY);
    
    const coils = 15;
    const amplitude = 15;
    for (let i = 0; i <= coils; i++) {
        const y = originY + (totalLength / coils) * i;
        const x = originX + (i % 2 === 0 ? amplitude : -amplitude);
        springCtx.lineTo(x, y);
    }
    springCtx.stroke();
    
    // おもり
    const weightY = originY + totalLength;
    springCtx.fillStyle = '#95a5a6';
    springCtx.fillRect(originX - 25, weightY, 50, 40);
    springCtx.strokeStyle = '#7f8c8d';
    springCtx.lineWidth = 2;
    springCtx.strokeRect(originX - 25, weightY, 50, 40);
    
    // 矢印（力）
    if (springForce > 0) {
        springCtx.strokeStyle = '#27ae60';
        springCtx.fillStyle = '#27ae60';
        springCtx.lineWidth = 3;
        const arrowY = weightY + 60;
        springCtx.beginPath();
        springCtx.moveTo(originX, arrowY);
        springCtx.lineTo(originX, arrowY + 40);
        springCtx.stroke();
        
        // 矢印の先端
        springCtx.beginPath();
        springCtx.moveTo(originX, arrowY + 40);
        springCtx.lineTo(originX - 8, arrowY + 30);
        springCtx.lineTo(originX + 8, arrowY + 30);
        springCtx.closePath();
        springCtx.fill();
    }
    
    // テキスト情報
    springCtx.fillStyle = '#2c3e50';
    springCtx.font = 'bold 16px Noto Sans JP';
    springCtx.fillText(`伸び: ${extension.toFixed(1)} cm`, 200, 100);
    springCtx.fillText(`力: ${springForce} N`, 200, 130);
    springCtx.fillText(`ばね定数: ${springConst} N/m`, 200, 160);
    springCtx.fillText(`フックの法則: F = kx`, 200, 200);
}

drawSpring();

// ============================================
// 3. 電気回路シミュレーター
// ============================================

const circuitCanvas = document.getElementById('circuitCanvas');
const circuitCtx = circuitCanvas.getContext('2d');
let voltage = 6;
let resistance1 = 10;
let resistance2 = 20;
let circuitType = 'series';

const voltageSlider = document.getElementById('voltageSlider');
const resistance1Slider = document.getElementById('resistance1Slider');
const resistance2Slider = document.getElementById('resistance2Slider');
const circuitTypeSelect = document.getElementById('circuitType');

voltageSlider.addEventListener('input', (e) => {
    voltage = parseInt(e.target.value);
    document.getElementById('voltageValue').textContent = voltage;
    drawCircuit();
});

resistance1Slider.addEventListener('input', (e) => {
    resistance1 = parseInt(e.target.value);
    document.getElementById('resistance1Value').textContent = resistance1;
    drawCircuit();
});

resistance2Slider.addEventListener('input', (e) => {
    resistance2 = parseInt(e.target.value);
    document.getElementById('resistance2Value').textContent = resistance2;
    drawCircuit();
});

circuitTypeSelect.addEventListener('change', (e) => {
    circuitType = e.target.value;
    drawCircuit();
});

function drawCircuit() {
    circuitCtx.clearRect(0, 0, circuitCanvas.width, circuitCanvas.height);
    
    let totalResistance, current, current1, current2;
    
    if (circuitType === 'series') {
        totalResistance = resistance1 + resistance2;
        current = voltage / totalResistance;
        drawSeriesCircuit(current);
    } else {
        totalResistance = 1 / (1/resistance1 + 1/resistance2);
        current = voltage / totalResistance;
        current1 = voltage / resistance1;
        current2 = voltage / resistance2;
        drawParallelCircuit(current1, current2);
    }
}

function drawSeriesCircuit(current) {
    circuitCtx.strokeStyle = '#2c3e50';
    circuitCtx.lineWidth = 3;
    
    // 回路の線
    circuitCtx.beginPath();
    circuitCtx.moveTo(100, 100);
    circuitCtx.lineTo(250, 100);
    circuitCtx.lineTo(250, 300);
    circuitCtx.lineTo(100, 300);
    circuitCtx.lineTo(100, 100);
    circuitCtx.stroke();
    
    // 電池
    drawBattery(100, 180, voltage);
    
    // 抵抗1
    drawResistor(200, 100, resistance1, '抵抗1');
    
    // 抵抗2
    drawResistor(250, 200, resistance2, '抵抗2', true);
    
    // 電流の矢印
    drawCurrentArrow(175, 90, false);
    
    // 情報表示
    circuitCtx.fillStyle = '#2c3e50';
    circuitCtx.font = 'bold 16px Noto Sans JP';
    circuitCtx.fillText('直列回路', 350, 50);
    circuitCtx.font = '14px Noto Sans JP';
    circuitCtx.fillText(`電圧: ${voltage} V`, 350, 100);
    circuitCtx.fillText(`合成抵抗: ${(resistance1 + resistance2)} Ω`, 350, 130);
    circuitCtx.fillText(`電流: ${current.toFixed(2)} A`, 350, 160);
    circuitCtx.fillText(`オームの法則: V = IR`, 350, 200);
}

function drawParallelCircuit(current1, current2) {
    circuitCtx.strokeStyle = '#2c3e50';
    circuitCtx.lineWidth = 3;
    
    // 回路の線
    circuitCtx.beginPath();
    circuitCtx.moveTo(100, 150);
    circuitCtx.lineTo(150, 150);
    circuitCtx.stroke();
    
    // 分岐1（上）
    circuitCtx.beginPath();
    circuitCtx.moveTo(150, 150);
    circuitCtx.lineTo(150, 100);
    circuitCtx.lineTo(300, 100);
    circuitCtx.lineTo(300, 150);
    circuitCtx.stroke();
    
    // 分岐2（下）
    circuitCtx.beginPath();
    circuitCtx.moveTo(150, 150);
    circuitCtx.lineTo(150, 250);
    circuitCtx.lineTo(300, 250);
    circuitCtx.lineTo(300, 150);
    circuitCtx.stroke();
    
    // 右側
    circuitCtx.beginPath();
    circuitCtx.moveTo(300, 150);
    circuitCtx.lineTo(100, 150);
    circuitCtx.stroke();
    
    // 電池
    drawBattery(100, 130, voltage);
    
    // 抵抗1（上）
    drawResistor(225, 100, resistance1, '抵抗1');
    
    // 抵抗2（下）
    drawResistor(225, 250, resistance2, '抵抗2');
    
    // 情報表示
    circuitCtx.fillStyle = '#2c3e50';
    circuitCtx.font = 'bold 16px Noto Sans JP';
    circuitCtx.fillText('並列回路', 350, 50);
    circuitCtx.font = '14px Noto Sans JP';
    circuitCtx.fillText(`電圧: ${voltage} V`, 350, 100);
    const totalR = 1 / (1/resistance1 + 1/resistance2);
    circuitCtx.fillText(`合成抵抗: ${totalR.toFixed(1)} Ω`, 350, 130);
    circuitCtx.fillText(`電流1: ${current1.toFixed(2)} A`, 350, 160);
    circuitCtx.fillText(`電流2: ${current2.toFixed(2)} A`, 350, 190);
    circuitCtx.fillText(`合計: ${(current1 + current2).toFixed(2)} A`, 350, 220);
}

function drawBattery(x, y, v) {
    circuitCtx.strokeStyle = '#2c3e50';
    circuitCtx.lineWidth = 4;
    circuitCtx.beginPath();
    circuitCtx.moveTo(x - 10, y);
    circuitCtx.lineTo(x + 10, y);
    circuitCtx.stroke();
    
    circuitCtx.lineWidth = 2;
    circuitCtx.beginPath();
    circuitCtx.moveTo(x - 5, y + 10);
    circuitCtx.lineTo(x + 5, y + 10);
    circuitCtx.stroke();
    
    circuitCtx.fillStyle = '#e74c3c';
    circuitCtx.font = 'bold 12px Arial';
    circuitCtx.fillText(`${v}V`, x + 15, y + 5);
}

function drawResistor(x, y, r, label, vertical = false) {
    circuitCtx.strokeStyle = '#e74c3c';
    circuitCtx.lineWidth = 3;
    
    if (vertical) {
        circuitCtx.strokeRect(x - 15, y - 25, 30, 50);
        circuitCtx.fillStyle = '#2c3e50';
        circuitCtx.font = '12px Noto Sans JP';
        circuitCtx.fillText(`${r}Ω`, x + 20, y);
        circuitCtx.fillText(label, x + 20, y + 15);
    } else {
        circuitCtx.strokeRect(x - 25, y - 15, 50, 30);
        circuitCtx.fillStyle = '#2c3e50';
        circuitCtx.font = '12px Noto Sans JP';
        circuitCtx.fillText(`${r}Ω`, x - 15, y - 20);
        circuitCtx.fillText(label, x - 20, y - 30);
    }
}

function drawCurrentArrow(x, y, vertical) {
    circuitCtx.strokeStyle = '#27ae60';
    circuitCtx.fillStyle = '#27ae60';
    circuitCtx.lineWidth = 2;
    
    if (vertical) {
        circuitCtx.beginPath();
        circuitCtx.moveTo(x, y);
        circuitCtx.lineTo(x, y + 30);
        circuitCtx.stroke();
        
        circuitCtx.beginPath();
        circuitCtx.moveTo(x, y + 30);
        circuitCtx.lineTo(x - 5, y + 20);
        circuitCtx.lineTo(x + 5, y + 20);
        circuitCtx.closePath();
        circuitCtx.fill();
    } else {
        circuitCtx.beginPath();
        circuitCtx.moveTo(x, y);
        circuitCtx.lineTo(x + 30, y);
        circuitCtx.stroke();
        
        circuitCtx.beginPath();
        circuitCtx.moveTo(x + 30, y);
        circuitCtx.lineTo(x + 20, y - 5);
        circuitCtx.lineTo(x + 20, y + 5);
        circuitCtx.closePath();
        circuitCtx.fill();
    }
}

drawCircuit();

// ============================================
// 4. 光の屈折・反射シミュレーション
// ============================================

const refractionCanvas = document.getElementById('refractionCanvas');
const refractionCtx = refractionCanvas.getContext('2d');
let incidentAngle = 30;
let refractiveIndex = 1.5;

const incidentAngleSlider = document.getElementById('incidentAngleSlider');
const refractiveIndexSlider = document.getElementById('refractiveIndexSlider');

incidentAngleSlider.addEventListener('input', (e) => {
    incidentAngle = parseInt(e.target.value);
    document.getElementById('incidentAngleValue').textContent = incidentAngle;
    drawRefraction();
});

refractiveIndexSlider.addEventListener('input', (e) => {
    refractiveIndex = parseFloat(e.target.value);
    document.getElementById('refractiveIndexValue').textContent = refractiveIndex;
    drawRefraction();
});

function drawRefraction() {
    refractionCtx.clearRect(0, 0, refractionCanvas.width, refractionCanvas.height);
    
    const centerY = refractionCanvas.height / 2;
    const centerX = refractionCanvas.width / 2;
    
    // 媒質の境界
    refractionCtx.fillStyle = 'rgba(52, 152, 219, 0.3)';
    refractionCtx.fillRect(0, centerY, refractionCanvas.width, refractionCanvas.height / 2);
    
    refractionCtx.fillStyle = 'rgba(155, 89, 182, 0.3)';
    refractionCtx.fillRect(0, 0, refractionCanvas.width, centerY);
    
    // 境界線
    refractionCtx.strokeStyle = '#2c3e50';
    refractionCtx.lineWidth = 2;
    refractionCtx.setLineDash([5, 5]);
    refractionCtx.beginPath();
    refractionCtx.moveTo(0, centerY);
    refractionCtx.lineTo(refractionCanvas.width, centerY);
    refractionCtx.stroke();
    refractionCtx.setLineDash([]);
    
    // 法線
    refractionCtx.strokeStyle = '#95a5a6';
    refractionCtx.lineWidth = 1;
    refractionCtx.beginPath();
    refractionCtx.moveTo(centerX, 0);
    refractionCtx.lineTo(centerX, refractionCanvas.height);
    refractionCtx.stroke();
    
    // 入射光線
    const incidentRad = (incidentAngle * Math.PI) / 180;
    const incidentLength = 150;
    const incidentX = centerX - incidentLength * Math.sin(incidentRad);
    const incidentY = centerY - incidentLength * Math.cos(incidentRad);
    
    refractionCtx.strokeStyle = '#e74c3c';
    refractionCtx.lineWidth = 3;
    refractionCtx.beginPath();
    refractionCtx.moveTo(incidentX, incidentY);
    refractionCtx.lineTo(centerX, centerY);
    refractionCtx.stroke();
    
    // 矢印
    drawArrow(refractionCtx, incidentX, incidentY, centerX, centerY, '#e74c3c');
    
    // 屈折角の計算（スネルの法則）
    const n1 = 1.0; // 空気
    const n2 = refractiveIndex;
    const sinRefracted = (n1 / n2) * Math.sin(incidentRad);
    
    if (sinRefracted <= 1.0) {
        const refractedAngle = Math.asin(sinRefracted);
        const refractedLength = 150;
        const refractedX = centerX + refractedLength * Math.sin(refractedAngle);
        const refractedY = centerY + refractedLength * Math.cos(refractedAngle);
        
        // 屈折光線
        refractionCtx.strokeStyle = '#3498db';
        refractionCtx.lineWidth = 3;
        refractionCtx.beginPath();
        refractionCtx.moveTo(centerX, centerY);
        refractionCtx.lineTo(refractedX, refractedY);
        refractionCtx.stroke();
        
        drawArrow(refractionCtx, centerX, centerY, refractedX, refractedY, '#3498db');
        
        // 角度表示
        refractionCtx.fillStyle = '#2c3e50';
        refractionCtx.font = '14px Noto Sans JP';
        refractionCtx.fillText(`入射角: ${incidentAngle}°`, 20, 30);
        refractionCtx.fillText(`屈折角: ${(refractedAngle * 180 / Math.PI).toFixed(1)}°`, 20, 55);
        refractionCtx.fillText(`屈折率: ${refractiveIndex}`, 20, 80);
        refractionCtx.fillText('スネルの法則: n₁sinθ₁ = n₂sinθ₂', 20, 370);
    } else {
        // 全反射
        refractionCtx.fillStyle = '#e74c3c';
        refractionCtx.font = 'bold 16px Noto Sans JP';
        refractionCtx.fillText('全反射が発生！', centerX - 60, 30);
    }
    
    // ラベル
    refractionCtx.fillStyle = '#2c3e50';
    refractionCtx.font = 'bold 14px Noto Sans JP';
    refractionCtx.fillText('空気（n=1.0）', 10, centerY - 10);
    refractionCtx.fillText(`媒質（n=${refractiveIndex}）`, 10, centerY + 25);
}

function drawArrow(ctx, fromX, fromY, toX, toY, color) {
    const headLength = 10;
    const angle = Math.atan2(toY - fromY, toX - fromX);
    
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
}

drawRefraction();

// ============================================
// 5. てこの原理シミュレーション
// ============================================

const leverCanvas = document.getElementById('leverCanvas');
const leverCtx = leverCanvas.getContext('2d');
let leftWeight = 50;
let leftDist = 100;
let rightWeight = 100;
let rightDist = 50;

const leftWeightSlider = document.getElementById('leftWeightSlider');
const leftDistSlider = document.getElementById('leftDistSlider');
const rightWeightSlider = document.getElementById('rightWeightSlider');
const rightDistSlider = document.getElementById('rightDistSlider');

leftWeightSlider.addEventListener('input', (e) => {
    leftWeight = parseInt(e.target.value);
    document.getElementById('leftWeightValue').textContent = leftWeight;
    drawLever();
});

leftDistSlider.addEventListener('input', (e) => {
    leftDist = parseInt(e.target.value);
    document.getElementById('leftDistValue').textContent = leftDist;
    drawLever();
});

rightWeightSlider.addEventListener('input', (e) => {
    rightWeight = parseInt(e.target.value);
    document.getElementById('rightWeightValue').textContent = rightWeight;
    drawLever();
});

rightDistSlider.addEventListener('input', (e) => {
    rightDist = parseInt(e.target.value);
    document.getElementById('rightDistValue').textContent = rightDist;
    drawLever();
});

function drawLever() {
    leverCtx.clearRect(0, 0, leverCanvas.width, leverCanvas.height);
    
    const fulcrumX = leverCanvas.width / 2;
    const fulcrumY = 200;
    const scale = 1.5;
    
    // モーメントの計算
    const leftMoment = leftWeight * leftDist;
    const rightMoment = rightWeight * rightDist;
    const momentDiff = leftMoment - rightMoment;
    
    // てこの傾き角度
    const maxAngle = 20;
    const angle = Math.max(-maxAngle, Math.min(maxAngle, momentDiff / 100));
    const angleRad = (angle * Math.PI) / 180;
    
    // てこの棒の端点
    const leverLength = 200;
    const leftX = fulcrumX - leverLength * Math.cos(angleRad);
    const leftY = fulcrumY - leverLength * Math.sin(angleRad);
    const rightX = fulcrumX + leverLength * Math.cos(angleRad);
    const rightY = fulcrumY + leverLength * Math.sin(angleRad);
    
    // 支点
    leverCtx.fillStyle = '#7f8c8d';
    leverCtx.beginPath();
    leverCtx.moveTo(fulcrumX, fulcrumY);
    leverCtx.lineTo(fulcrumX - 20, fulcrumY + 30);
    leverCtx.lineTo(fulcrumX + 20, fulcrumY + 30);
    leverCtx.closePath();
    leverCtx.fill();
    
    // てこの棒
    leverCtx.strokeStyle = '#8B4513';
    leverCtx.lineWidth = 8;
    leverCtx.beginPath();
    leverCtx.moveTo(leftX, leftY);
    leverCtx.lineTo(rightX, rightY);
    leverCtx.stroke();
    
    // 左側のおもり
    const leftWeightSize = 20 + leftWeight / 3;
    leverCtx.fillStyle = '#e74c3c';
    leverCtx.fillRect(leftX - leftWeightSize / 2, leftY, leftWeightSize, leftWeightSize);
    leverCtx.strokeStyle = '#c0392b';
    leverCtx.lineWidth = 2;
    leverCtx.strokeRect(leftX - leftWeightSize / 2, leftY, leftWeightSize, leftWeightSize);
    
    // 右側のおもり
    const rightWeightSize = 20 + rightWeight / 3;
    leverCtx.fillStyle = '#3498db';
    leverCtx.fillRect(rightX - rightWeightSize / 2, rightY, rightWeightSize, rightWeightSize);
    leverCtx.strokeStyle = '#2980b9';
    leverCtx.lineWidth = 2;
    leverCtx.strokeRect(rightX - rightWeightSize / 2, rightY, rightWeightSize, rightWeightSize);
    
    // 距離の表示
    leverCtx.strokeStyle = '#95a5a6';
    leverCtx.lineWidth = 1;
    leverCtx.setLineDash([3, 3]);
    
    // 左側の距離線
    leverCtx.beginPath();
    leverCtx.moveTo(fulcrumX, fulcrumY + 50);
    leverCtx.lineTo(leftX, fulcrumY + 50);
    leverCtx.stroke();
    
    // 右側の距離線
    leverCtx.beginPath();
    leverCtx.moveTo(fulcrumX, fulcrumY + 50);
    leverCtx.lineTo(rightX, fulcrumY + 50);
    leverCtx.stroke();
    
    leverCtx.setLineDash([]);
    
    // 情報表示
    leverCtx.fillStyle = '#2c3e50';
    leverCtx.font = '14px Noto Sans JP';
    leverCtx.fillText(`左側: ${leftWeight}kg × ${leftDist}cm = ${leftMoment} kg·cm`, 20, 30);
    leverCtx.fillText(`右側: ${rightWeight}kg × ${rightDist}cm = ${rightMoment} kg·cm`, 20, 55);
    
    leverCtx.font = 'bold 16px Noto Sans JP';
    if (Math.abs(momentDiff) < 50) {
        leverCtx.fillStyle = '#27ae60';
        leverCtx.fillText('⚖️ バランスしています！', 20, 90);
    } else if (momentDiff > 0) {
        leverCtx.fillStyle = '#e74c3c';
        leverCtx.fillText('⬅️ 左側が重い', 20, 90);
    } else {
        leverCtx.fillStyle = '#3498db';
        leverCtx.fillText('➡️ 右側が重い', 20, 90);
    }
    
    leverCtx.fillStyle = '#7f8c8d';
    leverCtx.font = '12px Noto Sans JP';
    leverCtx.fillText('てこの原理: 力×距離（モーメント）が等しいとバランスする', 20, 370);
}

drawLever();
