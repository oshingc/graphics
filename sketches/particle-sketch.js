import { BaseSketch } from './base-sketch.js';
import { getNumericValue } from '../utils/processing-utils.js';

class Particle {
    constructor(p, speed) {
        this.p = p;
        this.x = p.random(p.width);
        this.y = p.random(p.height);
        this.vx = p.random(-speed, speed);
        this.vy = p.random(-speed, speed);
        this.size = p.random(2, 5);
    }

    update(gravity) {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += gravity;
        
        if (this.x < 0 || this.x > this.p.width) this.vx *= -1;
        if (this.y < 0 || this.y > this.p.height) this.vy *= -1;
        
        this.x = this.p.constrain(this.x, 0, this.p.width);
        this.y = this.p.constrain(this.y, 0, this.p.height);
    }

    display() {
        this.p.ellipse(this.x, this.y, this.size, this.size);
    }
}

export function createParticleSketch(p) {
    const sketch = new BaseSketch(p);
    let particles = [];
    let particleCount = 100;
    
    p.setup = function() {
        sketch.setupBase();
        sketch.applyBackground();
        
        const speed = getNumericValue('particleSpeed', 2);
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(p, speed));
        }
    };

    p.draw = function() {
        particleCount = getNumericValue('particleCount', 100);
        const speed = getNumericValue('particleSpeed', 2);
        const gravity = getNumericValue('particleGravity', 0.1);
        const { bgColor, primaryColor } = sketch.getColors();

        p.background(bgColor[0], bgColor[1], bgColor[2], 20);
        p.fill(primaryColor[0], primaryColor[1], primaryColor[2]);
        
        if (particles.length !== particleCount) {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(p, speed));
            }
        }
        
        particles.forEach(particle => {
            particle.update(gravity);
            particle.display();
        });
    };
}

