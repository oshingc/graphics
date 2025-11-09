const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function generateAnimation(parameters) {
    const scriptPath = path.join(__dirname, '..', 'temp_manim_script.py');
    const outputDir = path.join(__dirname, '..', 'manim_output');
    
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }
    
    const pythonCode = generateManimCode(parameters);
    fs.writeFileSync(scriptPath, pythonCode);
    
    return new Promise((resolve, reject) => {
        const python = spawn('python3', [scriptPath, '-pql', '-o', 'animation']);
        
        let output = '';
        let error = '';
        
        python.stdout.on('data', (data) => {
            output += data.toString();
        });
        
        python.stderr.on('data', (data) => {
            error += data.toString();
        });
        
        python.on('close', (code) => {
            if (code === 0) {
                resolve(path.join(outputDir, 'animation.mp4'));
            } else {
                reject(new Error(`Manim falló: ${error}`));
            }
        });
    });
}

function generateManimCode(parameters) {
    const artType = parameters.artType;
    let code = `
from manim import *

class GenerativeArt(Scene):
    def construct(self):
`;
    
    switch(artType) {
        case 'fractal':
            code += generateFractalManim(parameters.fractal);
            break;
        case 'mandala':
            code += generateMandalaManim(parameters.mandala);
            break;
        case 'mathematical':
            code += generateMathematicalManim(parameters.mathematical);
            break;
        default:
            code += '        self.add(Text("Arte generativo"))\n';
    }
    
    return code;
}

function generateFractalManim(params) {
    return `
        def draw_branch(start, length, angle, depth):
            if depth <= 0:
                return
            end = start + length * np.array([np.cos(angle), np.sin(angle), 0])
            line = Line(start, end, color=WHITE)
            self.add(line)
            draw_branch(end, length * 0.67, angle + ${params.angle || 45} * DEGREES, depth - 1)
            draw_branch(end, length * 0.67, angle - ${params.angle || 45} * DEGREES, depth - 1)
        
        draw_branch(ORIGIN, ${params.length || 2}, PI/2, ${params.iterations || 5})
`;
}

function generateMandalaManim(params) {
    return `
        segments = ${params.segments || 12}
        layers = ${params.layers || 5}
        radius = ${params.radius || 1}
        
        for layer in range(layers):
            layer_radius = radius * (layer + 1) / layers
            for i in range(segments):
                angle = 2 * PI * i / segments
                start = layer_radius * np.array([np.cos(angle), np.sin(angle), 0])
                end = layer_radius * np.array([np.cos(angle + 2*PI/segments), np.sin(angle + 2*PI/segments), 0])
                line = Line(ORIGIN, start, color=WHITE)
                arc = Arc(radius=layer_radius, start_angle=angle, angle=2*PI/segments, color=WHITE)
                self.add(line, arc)
`;
}

function generateMathematicalManim(params) {
    const type = params.type || 'spiral';
    if (type === 'spiral') {
        return `
        def spiral(t):
            r = t * ${params.paramA || 0.1}
            return r * np.array([np.cos(t), np.sin(t), 0])
        
        curve = ParametricFunction(spiral, t_range=[0, 10*PI], color=WHITE)
        self.add(curve)
`;
    }
    return '        self.add(Text("Forma matemática"))\n';
}

module.exports = {
    generateAnimation
};

