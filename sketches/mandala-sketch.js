import { BaseSketch } from './base-sketch.js';
import { getNumericValue } from '../utils/processing-utils.js';

export function createMandalaSketch(p) {
    const sketch = new BaseSketch(p);
    
    p.setup = function() {
        sketch.setupBase();
    };

    p.draw = function() {
        const segments = getNumericValue('mandalaSegments', 12);
        const radius = getNumericValue('mandalaRadius', 50);
        const layers = getNumericValue('mandalaLayers', 5);
        const { bgColor, primaryColor, secondaryColor } = sketch.getColors();

        sketch.applyBackground();
        p.translate(p.width / 2, p.height / 2);
        
        for (let layer = 0; layer < layers; layer++) {
            const layerRadius = radius * (layer + 1) / layers;
            const color = layer % 2 === 0 ? primaryColor : secondaryColor;
            p.stroke(color[0], color[1], color[2]);
            p.noFill();
            
            for (let i = 0; i < segments; i++) {
                const angle1 = (Math.PI * 2 / segments) * i;
                const angle2 = (Math.PI * 2 / segments) * (i + 1);
                const x1 = p.cos(angle1) * layerRadius;
                const y1 = p.sin(angle1) * layerRadius;
                const x2 = p.cos(angle2) * layerRadius;
                const y2 = p.sin(angle2) * layerRadius;
                
                p.line(0, 0, x1, y1);
                p.arc(0, 0, layerRadius * 2, layerRadius * 2, angle1, angle2);
            }
        }
        p.noLoop();
    };
}

