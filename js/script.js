// 全局变量 - 已设置为 3月2日
const BIRTHDAY_YEAR = 2026; // 年份（明年生日）
const BIRTHDAY_MONTH = 2;   // 3月（JS月份从0开始，3月对应2）
const BIRTHDAY_DAY = 2;     // 2日
const CELEBRATION_DAYS = 1; // 庆祝持续1天

// DOM元素获取
const countdownContainer = document.getElementById('countdown-container');
const birthdayContainer = document.getElementById('birthday-container');
const contentContainer = document.querySelector('.content-container');
const boy = document.querySelector('.boy');
const daysElement = document.getElementById('days');
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const musicToggle = document.getElementById('music-toggle');
const bgm = document.getElementById('bgm');
const canvas = document.getElementById('starry-sky');
const ctx = canvas.getContext('2d');
const fireworksCanvas = document.getElementById('fireworks-canvas');
const fireworksCtx = fireworksCanvas.getContext('2d');
const loveTree = document.getElementById('love-tree');
const loveTreeCtx = loveTree ? loveTree.getContext('2d') : null;
const makeWishBtn = document.getElementById('make-wish-btn');

// 画布尺寸适配
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    if (fireworksCanvas) {
        fireworksCanvas.width = window.innerWidth;
        fireworksCanvas.height = window.innerHeight;
    }
}

// 星星类
class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.alphaSpeed = Math.random() * 0.05;
        this.alpha = Math.random();
        this.alphaChange = this.alphaSpeed;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.fill();
    }

    update() {
        // 闪烁效果
        this.alpha += this.alphaChange;
        if (this.alpha <= 0 || this.alpha >= 1) {
            this.alphaChange = -this.alphaChange;
        }

        // 微小移动
        this.x += (Math.random() - 0.5) * 0.3;
        this.y += (Math.random() - 0.5) * 0.3;

        // 边界检测
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        this.draw();
    }
}

// 流星类
class ShootingStar {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * 80 + 50;
        this.length = Math.random() * 60 + 30;
        this.angle = Math.PI / 4 + (Math.random() * Math.PI / 4);
        this.speed = 10;
        this.alpha = 1;
        this.active = true;
    }

    draw() {
        if (!this.active) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        const endX = this.x + Math.cos(this.angle) * this.length;
        const endY = this.y + Math.sin(this.angle) * this.length;
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.restore();
    }

    update() {
        if (!this.active) return;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.alpha -= 0.01;
        
        if (this.alpha <= 0 || this.x > canvas.width || this.y > canvas.height) {
            this.active = false;
        }
    }
}

// 烟花粒子类
class FireworkParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 2 + 1;
        this.color = `hsl(${Math.random() * 360}, 100%, 70%)`;
        this.velocity = {
            x: (Math.random() - 0.5) * 6,
            y: (Math.random() - 0.5) * 6
        };
        this.alpha = 1;
        this.fadeSpeed = Math.random() * 0.02 + 0.01;
    }

    draw() {
        fireworksCtx.save();
        fireworksCtx.globalAlpha = this.alpha;
        fireworksCtx.fillStyle = this.color;
        fireworksCtx.beginPath();
        fireworksCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        fireworksCtx.fill();
        fireworksCtx.restore();
    }

    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.velocity.y += 0.05; // 重力
        this.alpha -= this.fadeSpeed;
    }
}

// 全局特效变量
let stars = [];
let shootingStars = [];
let fireworks = [];
let animationId;

// 初始化特效
function initEffects() {
    resizeCanvas();
    stars = [];
    for (let i = 0; i < 150; i++) {
        stars.push(new Star());
    }
}

// 绘制星空背景
function drawStarrySky() {
    ctx.fillStyle = '#050029';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制星星
    stars.forEach(star => star.update());
    
    // 随机生成流星
    if (Math.random() < 0.005 && shootingStars.length < 2) {
        shootingStars.push(new ShootingStar());
    }
    shootingStars = shootingStars.filter(star => star.active);
    shootingStars.forEach(star => star.update());
}

// 绘制烟花
function drawFireworks() {
    fireworksCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    fireworks = fireworks.filter(particle => particle.alpha > 0);
    fireworks.forEach(particle => particle.update());
}

// 触发烟花
function triggerFirework() {
    const x = Math.random() * fireworksCanvas.width;
    const y = Math.random() * fireworksCanvas.height / 2;
    for (let i = 0; i < 30; i++) {
        fireworks.push(new FireworkParticle(x, y));
    }
}

// 爱心树简易绘制（兼容）
function drawLoveTree() {
    if (!loveTreeCtx) return;
    loveTreeCtx.clearRect(0, 0, loveTree.width, loveTree.height);
    loveTreeCtx.fillStyle = '#ff6b6b';
    
    // 简易爱心
    loveTreeCtx.beginPath();
    loveTreeCtx.moveTo(loveTree.width / 2, loveTree.height / 2);
    loveTreeCtx.bezierCurveTo(
        loveTree.width / 2, loveTree.height / 2 - 20,
        loveTree.width / 2 - 30, loveTree.height / 2 - 30,
        loveTree.width / 2 - 30, loveTree.height / 2
    );
    loveTreeCtx.bezierCurveTo(
        loveTree.width / 2 - 30, loveTree.height / 2 + 30,
        loveTree.width / 2, loveTree.height / 2 + 50,
        loveTree.width / 2, loveTree.height / 2 + 20
    );
    loveTreeCtx.bezierCurveTo(
        loveTree.width / 2, loveTree.height / 2 + 50,
        loveTree.width / 2 + 30, loveTree.height / 2 + 30,
        loveTree.width / 2 + 30, loveTree.height / 2
    );
    loveTreeCtx.bezierCurveTo(
        loveTree.width / 2 + 30, loveTree.height / 2 - 30,
        loveTree.width / 2, loveTree.height / 2 - 20,
        loveTree.width / 2, loveTree.height / 2
    );
    loveTreeCtx.fill();
}

// 动画循环
function animate() {
    drawStarrySky();
    drawFireworks();
    drawLoveTree();
    animationId = requestAnimationFrame(animate);
}

// 倒计时核心逻辑（修复版）
function updateCount
