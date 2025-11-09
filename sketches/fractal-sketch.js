import { BaseSketch } from './base-sketch.js';
import { getNumericValue } from '../utils/processing-utils.js';

export function createFractalSketch(p) {
    const sketch = new BaseSketch(p);
    
    p.setup = function() {
        sketch.setupBase();
    };

    p.draw = function() {
        try {
            let iterations = getNumericValue('fractalIterations', 10);
            // Limitar iteraciones para evitar colgar el navegador
            if (iterations > 15) {
                iterations = 15;
                const element = document.getElementById('fractalIterations');
                if (element) element.value = 15;
            }
            
            const angle = getNumericValue('fractalAngle', 90);
            const length = getNumericValue('fractalLength', 100);
            
            sketch.applyBackground();
            sketch.applyPrimaryStroke();
            p.strokeWeight(1);
            p.translate(p.width / 2, p.height);
            
            drawBranch(p, length, iterations, angle);
            p.noLoop();
        } catch (error) {
            console.error('Error en fractal:', error);
            p.noLoop();
        }
    };

    function drawBranch(p, len, depth, ang) {
        if (depth <= 0 || len < 1) return;
        
        p.line(0, 0, 0, -len);
        p.translate(0, -len);
        
        if (len * 0.67 > 1) {
            p.pushMatrix();
            p.rotate(p.radians(ang));
            drawBranch(p, len * 0.67, depth - 1, ang);
            p.popMatrix();
            
            p.pushMatrix();
            p.rotate(p.radians(-ang));
            drawBranch(p, len * 0.67, depth - 1, ang);
            p.popMatrix();
        }
    }
}

