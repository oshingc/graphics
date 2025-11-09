import { BaseSketch } from './base-sketch.js';
import { getNumericValue, getBooleanValue } from '../utils/processing-utils.js';

class TensionNode {
    constructor(p, x, y) {
        this.p = p;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.radius = 3;
    }

    update(otherNodes, force, minDist, maxDist) {
        let fx = 0;
        let fy = 0;
        
        for (let i = 0; i < otherNodes.length; i++) {
            const other = otherNodes[i];
            if (other === this) continue;
            
            const dx = other.x - this.x;
            const dy = other.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist > 0 && dist < maxDist) {
                if (dist < minDist) {
                    const repulsion = (minDist - dist) / minDist;
                    fx -= (dx / dist) * repulsion * force * 2;
                    fy -= (dy / dist) * repulsion * force * 2;
                } else if (dist > minDist && dist < maxDist) {
                    const attraction = (dist - minDist) / (maxDist - minDist);
                    fx += (dx / dist) * attraction * force * 0.5;
                    fy += (dy / dist) * attraction * force * 0.5;
                }
            }
        }
        
        this.vx = (this.vx + fx) * 0.85;
        this.vy = (this.vy + fy) * 0.85;
        
        this.x += this.vx;
        this.y += this.vy;
        
        // Mantener dentro del canvas
        if (this.x < 0) { this.x = 0; this.vx *= -0.5; }
        if (this.x > this.p.width) { this.x = this.p.width; this.vx *= -0.5; }
        if (this.y < 0) { this.y = 0; this.vy *= -0.5; }
        if (this.y > this.p.height) { this.y = this.p.height; this.vy *= -0.5; }
    }

    display(primaryColor) {
        this.p.fill(primaryColor[0], primaryColor[1], primaryColor[2]);
        this.p.noStroke();
        this.p.ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
    }
}

export function createTensionsSketch(p) {
    const sketch = new BaseSketch(p);
    let nodes = [];
    
    p.setup = function() {
        sketch.setupBase();
        sketch.applyBackground();
        
        const nodeCount = getNumericValue('tensionsNodes', 20);
        nodes = [];
        for (let i = 0; i < nodeCount; i++) {
            nodes.push(new TensionNode(p, p.random(p.width), p.random(p.height)));
        }
    };

    p.draw = function() {
        const nodeCount = getNumericValue('tensionsNodes', 20);
        const force = getNumericValue('tensionsForce', 0.5);
        const minDist = getNumericValue('tensionsMinDist', 50);
        const maxDist = getNumericValue('tensionsMaxDist', 200);
        const thickness = getNumericValue('tensionsThickness', 1);
        const animate = getBooleanValue('tensionsAnimate', true);
        const { bgColor, primaryColor, secondaryColor } = sketch.getColors();

        // Ajustar número de nodos si cambió
        if (nodes.length !== nodeCount) {
            if (nodes.length < nodeCount) {
                while (nodes.length < nodeCount) {
                    nodes.push(new TensionNode(p, p.random(p.width), p.random(p.height)));
                }
            } else {
                nodes = nodes.slice(0, nodeCount);
            }
        }

        if (animate) {
            p.background(bgColor[0], bgColor[1], bgColor[2], 20);
        } else {
            sketch.applyBackground();
        }

        // Actualizar nodos
        if (animate) {
            nodes.forEach(node => node.update(nodes, force, minDist, maxDist));
        }

        // Dibujar líneas de tensión
        p.strokeWeight(thickness);
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const node1 = nodes[i];
                const node2 = nodes[j];
                const dx = node2.x - node1.x;
                const dy = node2.y - node1.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < maxDist && dist > minDist * 0.5) {
                    const alpha = p.map(dist, minDist * 0.5, maxDist, 255, 50);
                    const color = dist < minDist ? primaryColor : secondaryColor;
                    p.stroke(color[0], color[1], color[2], alpha);
                    p.line(node1.x, node1.y, node2.x, node2.y);
                }
            }
        }

        // Dibujar nodos
        nodes.forEach(node => node.display(primaryColor));

        if (!animate) {
            p.noLoop();
        }
    };
}

