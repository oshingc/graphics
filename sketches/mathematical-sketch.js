import { BaseSketch } from './base-sketch.js';
import { getNumericValue, getStringValue } from '../utils/processing-utils.js';

const MathShapeGenerators = {
    spiral: (p, paramA, i) => {
        const r = i * paramA;
        return {
            x: p.cos(i) * r,
            y: p.sin(i) * r
        };
    },
    
    lissajous: (p, paramA, paramB, i, scale) => {
        return {
            x: p.cos(paramA * i) * scale,
            y: p.sin(paramB * i) * scale
        };
    },
    
    rose: (p, paramA, i, scale) => {
        const r = scale * p.cos(paramA * i);
        return {
            x: r * p.cos(i),
            y: r * p.sin(i)
        };
    },
    
    lemniscate: (p, paramA, i, scale) => {
        const r = scale * p.cos(i);
        return {
            x: r * p.cos(i),
            y: r * p.sin(i) * p.cos(i)
        };
    }
};

export function createMathematicalSketch(p) {
    const sketch = new BaseSketch(p);
    
    p.setup = function() {
        sketch.setupBase();
    };

    p.draw = function() {
        const mathType = getStringValue('mathType', 'spiral');
        const paramA = getNumericValue('mathParamA', 5);
        const paramB = getNumericValue('mathParamB', 3);

        sketch.applyBackground();
        p.translate(p.width / 2, p.height / 2);
        sketch.applyPrimaryStroke();
        p.noFill();

        const scale = 50;
        const maxT = Math.PI * 2 * 10;
        const generator = MathShapeGenerators[mathType] || MathShapeGenerators.spiral;

        p.beginShape();
        for (let i = 0; i <= maxT; i += 0.1) {
            const point = generator(p, paramA, paramB, i, scale);
            p.vertex(point.x, point.y);
        }
        p.endShape();
        p.noLoop();
    };
}

