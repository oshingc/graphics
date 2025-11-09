import { BaseSketch } from './base-sketch.js';
import { getNumericValue } from '../utils/processing-utils.js';

export function createPerlinSketch(p) {
    const sketch = new BaseSketch(p);
    let time = 0;
    
    p.setup = function() {
        sketch.setupBase();
    };

    p.draw = function() {
        const scale = getNumericValue('perlinScale', 0.01);
        const speed = getNumericValue('perlinSpeed', 0.02);
        const detail = getNumericValue('perlinDetail', 8);
        const { bgColor, primaryColor } = sketch.getColors();

        sketch.applyBackground();
        
        for (let x = 0; x < p.width; x += detail) {
            for (let y = 0; y < p.height; y += detail) {
                const noiseVal = p.noise(x * scale, y * scale, time);
                const brightness = p.map(noiseVal, 0, 1, 0, 255);
                p.fill(primaryColor[0], primaryColor[1], primaryColor[2], brightness);
                p.noStroke();
                p.rect(x, y, detail, detail);
            }
        }
        
        time += speed;
    };
}

