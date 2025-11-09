import { BaseSketch } from './base-sketch.js';
import { getNumericValue, getStringValue, getBooleanValue } from '../utils/processing-utils.js';

const MUSIC_CONSTANTS = {
    noteToSemitone: {
        'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5,
        'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
    },
    
    semitoneToNote: {
        0: 'C', 1: 'C#', 2: 'D', 3: 'D#', 4: 'E', 5: 'F',
        6: 'F#', 7: 'G', 8: 'G#', 9: 'A', 10: 'A#', 11: 'B'
    },
    
    modeIntervals: {
        'ionian': [0, 2, 4, 5, 7, 9, 11],
        'dorian': [0, 2, 3, 5, 7, 9, 10],
        'phrygian': [0, 1, 3, 5, 7, 8, 10],
        'lydian': [0, 2, 4, 6, 7, 9, 11],
        'mixolydian': [0, 2, 4, 5, 7, 9, 10],
        'aeolian': [0, 2, 3, 5, 7, 8, 10],
        'locrian': [0, 1, 3, 5, 6, 8, 10]
    },
    
    chordIntervals: {
        'maj': [0, 4, 7],
        'm': [0, 3, 7],
        '7': [0, 4, 7, 10],
        'maj7': [0, 4, 7, 11],
        'm7': [0, 3, 7, 10],
        'dim': [0, 3, 6],
        'dim7': [0, 3, 6, 9],
        'm7b5': [0, 3, 6, 10],
        'aug': [0, 4, 8]
    },
    
    tensionIntervals: {
        '9': 2,
        '11': 5,
        '13': 9
    }
};

class MusicCalculator {
    static calculateChordNotes(root, quality) {
        const rootSemitone = MUSIC_CONSTANTS.noteToSemitone[root];
        const intervals = MUSIC_CONSTANTS.chordIntervals[quality] || MUSIC_CONSTANTS.chordIntervals['maj'];
        
        return intervals.map(interval => {
            const semitone = (rootSemitone + interval) % 12;
            return MUSIC_CONSTANTS.semitoneToNote[semitone];
        });
    }
    
    static calculateModeScale(root, modeName) {
        const rootSemitone = MUSIC_CONSTANTS.noteToSemitone[root];
        const intervals = MUSIC_CONSTANTS.modeIntervals[modeName] || MUSIC_CONSTANTS.modeIntervals['ionian'];
        
        return intervals.map(interval => {
            const semitone = (rootSemitone + interval) % 12;
            return MUSIC_CONSTANTS.semitoneToNote[semitone];
        });
    }
    
    static calculateTensions(chordNotes, modeScale, showOption) {
        const tensions = [];
        const chordSemitones = chordNotes.map(n => MUSIC_CONSTANTS.noteToSemitone[n]);
        const rootSemitone = MUSIC_CONSTANTS.noteToSemitone[chordNotes[0]];
        const modeSemitones = modeScale.map(n => MUSIC_CONSTANTS.noteToSemitone[n]);
        
        const showFlags = {
            '9': showOption === 'all' || showOption === '9' || showOption === '9_11' || showOption === '9_13',
            '11': showOption === 'all' || showOption === '11' || showOption === '9_11' || showOption === '11_13',
            '13': showOption === 'all' || showOption === '13' || showOption === '9_13' || showOption === '11_13'
        };
        
        Object.entries(MUSIC_CONSTANTS.tensionIntervals).forEach(([tension, interval]) => {
            if (!showFlags[tension]) return;
            
            const tensionSemitone = (rootSemitone + interval) % 12;
            
            if (modeSemitones.includes(tensionSemitone) && !chordSemitones.includes(tensionSemitone)) {
                tensions.push({
                    note: MUSIC_CONSTANTS.semitoneToNote[tensionSemitone],
                    degree: tension,
                    semitone: tensionSemitone
                });
            }
        });
        
        return tensions;
    }
    
    static getNotePosition(noteSemitone, centerX, centerY, radius) {
        const angle = (noteSemitone / 12) * Math.PI * 2 - Math.PI / 2;
        return {
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius,
            angle: angle
        };
    }
}

export function createMusicalTensionsSketch(p) {
    const sketch = new BaseSketch(p);
    let notes = [];
    let chordNotes = [];
    let tensionNotes = [];
    let animationTime = 0;
    
    function updateMusicalData() {
        const rootNote = getStringValue('musicalRoot', 'D');
        const chordQuality = getStringValue('musicalChordQuality', 'm7');
        const mode = getStringValue('musicalMode', 'dorian');
        const tensionsShow = getStringValue('musicalTensionsShow', 'all');
        
        chordNotes = MusicCalculator.calculateChordNotes(rootNote, chordQuality);
        const modeScale = MusicCalculator.calculateModeScale(rootNote, mode);
        tensionNotes = MusicCalculator.calculateTensions(chordNotes, modeScale, tensionsShow);
        
        const allNotes = [];
        const rootSemitone = MUSIC_CONSTANTS.noteToSemitone[chordNotes[0]];
        const intervalToDegree = { 0: '1', 3: 'b3', 4: '3', 7: '5', 8: '#5', 10: 'b7', 11: '7' };
        
        chordNotes.forEach((note) => {
            const noteSemitone = MUSIC_CONSTANTS.noteToSemitone[note];
            const interval = (noteSemitone - rootSemitone + 12) % 12;
            const degree = intervalToDegree[interval] || interval.toString();
            
            allNotes.push({
                note: note,
                type: 'chord',
                degree: degree,
                semitone: noteSemitone
            });
        });
        
        tensionNotes.forEach(tension => {
            allNotes.push({
                note: tension.note,
                type: 'tension',
                degree: tension.degree,
                semitone: tension.semitone
            });
        });
        
        notes = allNotes;
    }

    p.setup = function() {
        sketch.setupBase();
        updateMusicalData();
    };

    p.draw = function() {
        updateMusicalData();
        
        const animate = getBooleanValue('musicalAnimate', false);
        const circleRadius = getNumericValue('musicalCircleRadius', 200);
        const lineThickness = getNumericValue('musicalLineThickness', 2);
        const showNames = getBooleanValue('musicalShowNames', true);
        const rootNote = getStringValue('musicalRoot', 'D');
        const chordQuality = getStringValue('musicalChordQuality', 'm7');
        const mode = getStringValue('musicalMode', 'dorian');
        const { bgColor, primaryColor, secondaryColor } = sketch.getColors();
        
        if (animate) {
            animationTime += 0.02;
            p.background(bgColor[0], bgColor[1], bgColor[2], 20);
        } else {
            sketch.applyBackground();
        }
        
        const centerX = p.width / 2;
        const centerY = p.height / 2;
        
        // Dibujar líneas de conexión
        p.strokeWeight(lineThickness);
        
        // Conectar notas del acorde entre sí
        for (let i = 0; i < chordNotes.length; i++) {
            for (let j = i + 1; j < chordNotes.length; j++) {
                const note1 = chordNotes[i];
                const note2 = chordNotes[j];
                const pos1 = MusicCalculator.getNotePosition(
                    MUSIC_CONSTANTS.noteToSemitone[note1], centerX, centerY, circleRadius
                );
                const pos2 = MusicCalculator.getNotePosition(
                    MUSIC_CONSTANTS.noteToSemitone[note2], centerX, centerY, circleRadius
                );
                
                p.stroke(primaryColor[0], primaryColor[1], primaryColor[2], 150);
                p.line(pos1.x, pos1.y, pos2.x, pos2.y);
            }
        }
        
        // Conectar tensiones con notas del acorde
        tensionNotes.forEach(tension => {
            const tensionPos = MusicCalculator.getNotePosition(
                tension.semitone, centerX, centerY, circleRadius
            );
            
            chordNotes.forEach(chordNote => {
                const chordPos = MusicCalculator.getNotePosition(
                    MUSIC_CONSTANTS.noteToSemitone[chordNote], centerX, centerY, circleRadius
                );
                
                p.stroke(secondaryColor[0], secondaryColor[1], secondaryColor[2], 100);
                p.line(tensionPos.x, tensionPos.y, chordPos.x, chordPos.y);
            });
        });
        
        // Dibujar círculo de referencia
        p.noFill();
        p.stroke(primaryColor[0], primaryColor[1], primaryColor[2], 30);
        p.strokeWeight(1);
        p.ellipse(centerX, centerY, circleRadius * 2, circleRadius * 2);
        
        // Dibujar notas
        notes.forEach(noteData => {
            const pos = MusicCalculator.getNotePosition(
                noteData.semitone, centerX, centerY, circleRadius
            );
            
            if (noteData.type === 'chord') {
                p.fill(primaryColor[0], primaryColor[1], primaryColor[2]);
            } else {
                p.fill(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
            }
            
            p.noStroke();
            const size = noteData.type === 'chord' ? 15 : 12;
            p.ellipse(pos.x, pos.y, size, size);
            
            if (showNames) {
                p.fill(primaryColor[0], primaryColor[1], primaryColor[2]);
                p.textAlign(p.CENTER, p.CENTER);
                p.textSize(12);
                const label = noteData.note + (noteData.degree ? '(' + noteData.degree + ')' : '');
                p.text(label, pos.x, pos.y - 20);
            }
        });
        
        if (showNames) {
            p.fill(primaryColor[0], primaryColor[1], primaryColor[2]);
            p.textAlign(p.CENTER);
            p.textSize(16);
            const chordName = rootNote + chordQuality + ' (' + mode + ')';
            p.text(chordName, centerX, p.height - 30);
        }
        
        if (!animate) {
            p.noLoop();
        }
    };
}

