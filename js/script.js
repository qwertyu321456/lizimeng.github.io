// 全局变量
const BIRTHDAY_MONTH = 1; // JavaScript中月份从0开始，所以5月是4
const BIRTHDAY_DAY = 30;
const CELEBRATION_DAYS = 1; // 生日庆祝持续3天

// DOM元素
const countdownContainer = document.getElementById('countdown-container');
const birthdayContainer = document.getElementById('birthday-container');
const birthdayContent = document.getElementById('birthday-content');
const giftSection = document.getElementById('gift-section');
const giftBox = document.querySelector('.gift-box');
const daysElement = document.getElementById('days');
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const musicToggle = document.getElementById('music-toggle');
const bgm = document.getElementById('bgm');
const canvas = document.getElementById('starry-sky');
const ctx = canvas.getContext('2d');
const fireworksCanvas = document.getElementById('fireworks-canvas');
const fireworksCtx = fireworksCanvas ? fireworksCanvas.getContext('2d') : null;
const loveTree = document.getElementById('love-tree');
const loveTreeCtx = loveTree ? loveTree.getContext('2d') : null;
const makeWishBtn = document.getElementById('make-wish-btn');

// 设置Canvas大小
function setCanvasSize() {
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
        this.blinkSpeed = Math.random() * 0.05;
        this.alpha = Math.random();
        this.alphaChange = this.blinkSpeed;
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
        // 边界检查
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
        this.y = 0;
        this.length = Math.random() * 80 + 50;
        this.speed = Math.random() * 10 + 10;
        this.angle = Math.PI / 4 + (Math.random() * Math.PI / 4);
        this.alpha = 1;
        this.active = true;
    }

    draw() {
        if (!this.active) return;
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        const endX = this.x + Math.cos(this.angle) * this.length;
        const endY = this.y + Math.sin(this.angle) * this.length;
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }

    update() {
        if (!this.active) {
            if (Math.random() < 0.005) { // 控制流星出现的频率
                this.reset();
            }
            return;
        }
        
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        
        // 淡出效果
        this.alpha -= 0.01;
        
        if (this.y > canvas.height || this.x < 0 || this.x > canvas.width || this.alpha <= 0) {
            this.active = false;
        }
        
        this.draw();
    }
}

// 爱心类
class Heart {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 50;
        this.size = Math.random() * 15 + 15;
        this.speed = Math.random() * 3 + 1;
        this.color = `hsl(${340 + Math.random() * 40}, 100%, ${60 + Math.random() * 20}%)`;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.05;
    }
    
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.bezierCurveTo(0, -this.size / 2, this.size, -this.size, 0, this.size);
        ctx.bezierCurveTo(-this.size, -this.size, 0, -this.size / 2, 0, this.size / 2);
        ctx.fill();
        ctx.restore();
    }
    
    update() {
        this.y -= this.speed;
        this.rotation += this.rotationSpeed;
        
        if (this.y < -this.size) {
            this.reset();
        }
        
        this.draw();
    }
}

// 烟花粒子类
class FireworkParticle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color || `hsl(${Math.random() * 360}, 100%, 70%)`;
        this.velocity = {
            x: (Math.random() - 0.5) * 6,
            y: (Math.random() - 0.5) * 6
        };
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.01;
        this.gravity = 0.1;
        this.size = Math.random() * 3 + 1;
    }
    
    draw() {
        fireworksCtx.beginPath();
        fireworksCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        fireworksCtx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        fireworksCtx.fill();
    }
    
    update() {
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= this.decay;
        this.draw();
    }
}

// 烟花类
class Firework {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * fireworksCanvas.width;
        this.y = fireworksCanvas.height;
        this.targetY = Math.random() * (fireworksCanvas.height * 0.6);
        this.speed = Math.random() * 2 + 2;
        this.particles = [];
        this.color = `${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}`;
        this.exploded = false;
    }
    
    explode() {
        this.exploded = true;
        // 创建爆炸粒子
        for (let i = 0; i < 100; i++) {
            this.particles.push(new FireworkParticle(this.x, this.y, this.color));
        }
        // 播放爆炸声音效果（可选）
        if (Math.random() > 0.7) { // 不是每个烟花都播放声音，以避免声音重叠
            const popSound = new Audio();
            popSound.volume = 0.3;
            popSound.play().catch(e => console.log('播放爆炸声受限：', e));
        }
    }
    
    draw() {
        if (!this.exploded) {
            fireworksCtx.beginPath();
            fireworksCtx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            fireworksCtx.fillStyle = `rgb(${this.color})`;
            fireworksCtx.fill();
        }
    }
    
    update() {
        if (!thi
