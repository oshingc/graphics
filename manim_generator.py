#!/usr/bin/env python3
"""
Generador de animaciones Manim para arte generativo
"""

from manim import *
import json
import sys

class GenerativeArtManim(Scene):
    def construct(self):
        """Construye la escena de arte generativo basada en parámetros"""
        if len(sys.argv) > 1:
            params_file = sys.argv[1]
            with open(params_file, 'r') as f:
                params = json.load(f)
            
            art_type = params.get('artType', 'fractal')
            
            if art_type == 'fractal':
                self.render_fractal(params.get('fractal', {}))
            elif art_type == 'mandala':
                self.render_mandala(params.get('mandala', {}))
            elif art_type == 'mathematical':
                self.render_mathematical(params.get('mathematical', {}))
            else:
                self.render_default()
        else:
            self.render_default()
    
    def render_fractal(self, params):
        """Renderiza un fractal"""
        iterations = params.get('iterations', 5)
        angle = params.get('angle', 45)
        length = params.get('length', 2)
        
        def draw_branch(start, len, ang, depth):
            if depth <= 0:
                return
            end = start + len * np.array([np.cos(ang), np.sin(ang), 0])
            line = Line(start, end, color=WHITE, stroke_width=1)
            self.add(line)
            draw_branch(end, len * 0.67, ang + np.radians(angle), depth - 1)
            draw_branch(end, len * 0.67, ang - np.radians(angle), depth - 1)
        
        draw_branch(ORIGIN, length, PI/2, iterations)
    
    def render_mandala(self, params):
        """Renderiza un mandala"""
        segments = params.get('segments', 12)
        layers = params.get('layers', 5)
        radius = params.get('radius', 1)
        
        for layer in range(layers):
            layer_radius = radius * (layer + 1) / layers
            for i in range(segments):
                angle = 2 * PI * i / segments
                start = layer_radius * np.array([np.cos(angle), np.sin(angle), 0])
                line = Line(ORIGIN, start, color=WHITE, stroke_width=1)
                arc = Arc(
                    radius=layer_radius,
                    start_angle=angle,
                    angle=2*PI/segments,
                    color=WHITE,
                    stroke_width=1
                )
                self.add(line, arc)
    
    def render_mathematical(self, params):
        """Renderiza formas matemáticas"""
        math_type = params.get('type', 'spiral')
        param_a = params.get('paramA', 5)
        param_b = params.get('paramB', 3)
        
        if math_type == 'spiral':
            def spiral(t):
                r = t * param_a * 0.1
                return r * np.array([np.cos(t), np.sin(t), 0])
            
            curve = ParametricFunction(
                spiral,
                t_range=[0, 10*PI],
                color=WHITE,
                stroke_width=2
            )
            self.add(curve)
        
        elif math_type == 'lissajous':
            def lissajous(t):
                return np.array([
                    np.cos(param_a * t),
                    np.sin(param_b * t),
                    0
                ]) * 2
            
            curve = ParametricFunction(
                lissajous,
                t_range=[0, 2*PI],
                color=WHITE,
                stroke_width=2
            )
            self.add(curve)
        
        elif math_type == 'rose':
            def rose(t):
                r = 2 * np.cos(param_a * t)
                return r * np.array([np.cos(t), np.sin(t), 0])
            
            curve = ParametricFunction(
                rose,
                t_range=[0, 2*PI],
                color=WHITE,
                stroke_width=2
            )
            self.add(curve)
        
        elif math_type == 'lemniscate':
            def lemniscate(t):
                r = 2 * np.cos(t)
                return r * np.array([np.cos(t), np.sin(t) * np.cos(t), 0])
            
            curve = ParametricFunction(
                lemniscate,
                t_range=[0, 2*PI],
                color=WHITE,
                stroke_width=2
            )
            self.add(curve)
    
    def render_default(self):
        """Renderiza una escena por defecto"""
        text = Text("Generative Data Art", font_size=48)
        self.add(text)

