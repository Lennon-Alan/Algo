// Variables globales
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let animationId;
let isAnimating = true;
let flowers = [];
let particles = [];
let time = 0;
let backgroundColors = [
    ['#87CEEB', '#98FB98', '#F0E68C'],
    ['#FFB6C1', '#FFF8DC', '#E6E6FA'],
    ['#F0F8FF', '#FFFAF0', '#F5FFFA'],
    ['#FFEFD5', '#FFE4E1', '#F0FFF0']
];
let currentBg = 0;

// Clase para representar una flor
class Flower {
    constructor(x, y, size = 1, hue = 50) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.hue = hue;
        this.stemHeight = 80 + Math.random() * 60;
        this.petalCount = 8 + Math.floor(Math.random() * 4);
        this.rotation = Math.random() * Math.PI * 2;
        this.bobOffset = Math.random() * Math.PI * 2;
        this.centerSize = 8 + Math.random() * 6;
        this.petalSize = 15 + Math.random() * 10;
        this.leafOffset = Math.random() * 40 + 20;
    }

    draw() {
        ctx.save();
        
        // Efecto de balanceo suave
        const bob = Math.sin(time * 0.002 + this.bobOffset) * 2;
        
        // Dibujar tallo
        this.drawStem(bob);
        
        // Dibujar hojas
        this.drawLeaves(bob);
        
        // Dibujar flor
        ctx.translate(this.x, this.y - this.stemHeight + bob);
        ctx.rotate(this.rotation + Math.sin(time * 0.001) * 0.1);
        ctx.scale(this.size, this.size);
        
        // Pétalos
        this.drawPetals();
        
        // Centro de la flor
        this.drawCenter();
        
        ctx.restore();
    }

    drawStem(bob) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        
        // Tallo con curva suave
        const controlX = this.x + Math.sin(time * 0.001 + this.bobOffset) * 5;
        const controlY = this.y - this.stemHeight / 2;
        ctx.quadraticCurveTo(
            controlX, 
            controlY, 
            this.x, 
            this.y - this.stemHeight + bob
        );
        
        ctx.strokeStyle = '#228B22';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.stroke();
    }

    drawLeaves(bob) {
        // Hoja izquierda
        ctx.save();
        ctx.translate(this.x - 5, this.y - this.leafOffset + bob * 0.5);
        ctx.rotate(-0.3);
        
        ctx.beginPath();
        ctx.ellipse(0, 0, 8, 20, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#32CD32';
        ctx.fill();
        ctx.strokeStyle = '#228B22';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();

        // Hoja derecha
        ctx.save();
        ctx.translate(this.x + 5, this.y - this.leafOffset - 10 + bob * 0.5);
        ctx.rotate(0.3);
        
        ctx.beginPath();
        ctx.ellipse(0, 0, 8, 20, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#32CD32';
        ctx.fill();
        ctx.strokeStyle = '#228B22';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
    }

    drawPetals() {
        for (let i = 0; i < this.petalCount; i++) {
            const angle = (i / this.petalCount) * Math.PI * 2;
            
            ctx.save();
            ctx.rotate(angle);
            
            // Gradiente para pétalos
            const gradient = ctx.createRadialGradient(0, -this.petalSize, 0, 0, -this.petalSize, this.petalSize);
            gradient.addColorStop(0, `hsl(${this.hue}, 90%, 85%)`);
            gradient.addColorStop(0.7, `hsl(${this.hue}, 80%, 70%)`);
            gradient.addColorStop(1, `hsl(${this.hue}, 70%, 55%)`);
            
            ctx.beginPath();
            ctx.ellipse(0, -this.petalSize, this.petalSize * 0.6, this.petalSize, 0, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Contorno de pétalo
            ctx.strokeStyle = `hsl(${this.hue}, 60%, 45%)`;
            ctx.lineWidth = 1;
            ctx.stroke();
            
            ctx.restore();
        }
    }

    drawCenter() {
        // Centro con gradiente radial
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.centerSize);
        gradient.addColorStop(0, '#8B4513');
        gradient.addColorStop(0.6, '#A0522D');
        gradient.addColorStop(1, '#654321');
        
        ctx.beginPath();
        ctx.arc(0, 0, this.centerSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Detalles del centro
        ctx.fillStyle = '#4B0000';
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const x = Math.cos(angle) * (this.centerSize * 0.6);
            const y = Math.sin(angle) * (this.centerSize * 0.6);
            ctx.fillRect(x - 0.5, y - 0.5, 1, 1);
        }
    }
}

// Clase para partículas de polen
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2 - 1;
        this.life = 60 + Math.random() * 60;
        this.maxLife = this.life;
        this.size = 2 + Math.random() * 3;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.02; // gravedad
        this.life--;
    }

    draw() {
        if (this.life <= 0) return;
        
        const alpha = this.life / this.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, '#FFD700');
        gradient.addColorStop(1, '#FFA500');
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.restore();
    }

    isDead() {
        return this.life <= 0;
    }
}

// Inicializar flores
function initFlowers() {
    flowers = [];
    
    // Crear ramo con diferentes alturas y posiciones
    const positions = [
        {x: 400, y: 550, size: 1.2, hue: 55},
        {x: 350, y: 530, size: 1.0, hue: 50},
        {x: 450, y: 540, size: 1.1, hue: 58},
        {x: 320, y: 500, size: 0.9, hue: 52},
        {x: 480, y: 510, size: 0.95, hue: 56},
        {x: 380, y: 480, size: 0.85, hue: 54},
        {x: 420, y: 490, size: 0.9, hue: 51}
    ];
    
    positions.forEach(pos => {
        flowers.push(new Flower(pos.x, pos.y, pos.size, pos.hue));
    });
}

// Función de animación principal
function animate() {
    if (!isAnimating) return;
    
    // Limpiar canvas
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    time++;
    
    // Dibujar flores
    flowers.forEach(flower => flower.draw());
    
    // Actualizar y dibujar partículas
    if (Math.random() < 0.1) {
        const flower = flowers[Math.floor(Math.random() * flowers.length)];
        particles.push(new Particle(flower.x + (Math.random() - 0.5) * 30, flower.y - flower.stemHeight));
    }
    
    particles = particles.filter(particle => {
        particle.update();
        particle.draw();
        return !particle.isDead();
    });
    
    animationId = requestAnimationFrame(animate);
}

// Event listeners
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Agregar nueva flor en la posición del click
    const hue = 45 + Math.random() * 20;
    const size = 0.8 + Math.random() * 0.4;
    flowers.push(new Flower(x, y + 100, size, hue));
    
    // Crear burst de partículas
    for (let i = 0; i < 10; i++) {
        particles.push(new Particle(x + (Math.random() - 0.5) * 20, y - 20));
    }
});

// Funciones para los botones
function regenerateFlowers() {
    initFlowers();
    particles = [];
}

function toggleAnimation() {
    isAnimating = !isAnimating;
    if (isAnimating) {
        animate();
    } else if (animationId) {
        cancelAnimationFrame(animationId);
    }
}

function changeBackground() {
    currentBg = (currentBg + 1) % backgroundColors.length;
    const colors = backgroundColors[currentBg];
    document.body.style.background = `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)`;
}

// Inicializar
initFlowers();
animate();
