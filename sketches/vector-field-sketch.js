import { BaseSketch } from './base-sketch.js';
import { getNumericValue } from '../utils/processing-utils.js';

export function createVectorFieldSketch(p) {
    const sketch = new BaseSketch(p);
    
    p.setup = function() {
        sketch.setupBase();
    };

    p.draw = function() {
        const density = getNumericValue('vectorDensity', 20);
        const scale = getNumericValue('vectorScale', 0.02);
        const force = getNumericValue('vectorForce', 5);

        sketch.applyBackground();
        sketch.applyPrimaryStroke();
        
        const spacing = p.width / density;
        
        for (let x = 0; x < p.width; x += spacing) {
            for (let y = 0; y < p.height; y += spacing) {
                const angle = p.noise(x * scale, y * scale) * Math.PI * 2 * force;
                const vx = p.cos(angle) * force;
                const vy = p.sin(angle) * force;
                
                p.pushMatrix();
                p.translate(x, y);
                p.line(0, 0, vx, vy);
                p.popMatrix();
            }
        }
        p.noLoop();
    };
}

