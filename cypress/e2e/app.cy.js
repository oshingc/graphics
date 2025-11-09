describe('Generative Data Art Engine - E2E Tests', () => {
  beforeEach(() => {
    // Visitar la aplicación
    cy.visit('/');
    
    // Esperar a que la página cargue completamente
    cy.get('h1').should('contain', 'Generative Data Art Engine');
    cy.get('#artType').should('be.visible');
    cy.get('#processingCanvas').should('be.visible');
    
    // Esperar a que Processing.js esté listo
    cy.waitForProcessing();
  });

  describe('Navegación y UI básica', () => {
    it('debe cargar la página principal correctamente', () => {
      cy.get('h1').should('contain', 'Generative Data Art Engine');
      cy.get('#artType').should('be.visible');
      cy.get('#generateBtn').should('exist');
      cy.get('#saveBtn').should('exist');
      cy.get('#loadBtn').should('exist');
      cy.get('#exportBtn').should('exist');
    });

    it('debe mostrar los controles de parámetros según el tipo de arte seleccionado', () => {
      // Verificar que los parámetros de fractal están visibles por defecto
      cy.get('#fractalParams').should('be.visible');
      
      // Cambiar a mandala
      cy.get('#artType').select('mandala');
      cy.get('#fractalParams').should('not.be.visible');
      cy.get('#mandalaParams').should('be.visible');
      
      // Cambiar a tensions
      cy.get('#artType').select('tensions');
      cy.get('#mandalaParams').should('not.be.visible');
      cy.get('#tensionsParams').should('be.visible');
    });
  });

  describe('Generación de arte - Fractal', () => {
    it('debe generar un fractal al hacer clic en Generar Arte', () => {
      cy.get('#artType').select('fractal');
      cy.get('#fractalParams').should('be.visible');
      
      // Configurar parámetros
      cy.get('#fractalIterations').clear().type('8');
      cy.get('#fractalAngle').clear().type('30');
      cy.get('#fractalLength').clear().type('100');
      
      // Generar arte
      cy.get('#generateBtn').click();
      
      // Esperar a que el canvas se renderice
      cy.waitForCanvas();
      
      // Verificar que el canvas existe y es visible
      cy.get('#processingCanvas').should('be.visible');
    });
  });

  describe('Generación de arte - Mandala', () => {
    it('debe generar un mandala con parámetros personalizados', () => {
      cy.get('#artType').select('mandala');
      cy.get('#mandalaParams').should('be.visible');
      
      cy.get('#mandalaSegments').clear().type('16');
      cy.get('#mandalaRadius').clear().type('80');
      cy.get('#mandalaLayers').clear().type('6');
      
      cy.get('#generateBtn').click();
      cy.waitForCanvas();
      
      cy.get('#processingCanvas').should('be.visible');
    });
  });

  describe('Generación de arte - Musical Tensions', () => {
    it('debe generar tensiones musicales para Dm7 en Dorian', () => {
      cy.get('#artType').select('musicalTensions');
      cy.get('#musicalTensionsParams').should('be.visible');
      
      // Verificar que los valores por defecto son correctos
      cy.get('#musicalRoot').should('have.value', 'D');
      cy.get('#musicalChordQuality').should('have.value', 'm7');
      cy.get('#musicalMode').should('have.value', 'dorian');
      
      cy.get('#generateBtn').click();
      cy.waitForCanvas();
      
      cy.get('#processingCanvas').should('be.visible');
    });

    it('debe cambiar el acorde y modo correctamente', () => {
      cy.get('#artType').select('musicalTensions');
      
      // Cambiar a Cmaj7 en modo Ionian
      cy.get('#musicalRoot').select('C');
      cy.get('#musicalChordQuality').select('maj7');
      cy.get('#musicalMode').select('ionian');
      
      cy.get('#generateBtn').click();
      cy.waitForCanvas();
      
      cy.get('#processingCanvas').should('be.visible');
    });
  });

  describe('Guardar y cargar arte', () => {
    it('debe guardar un artefacto en la base de datos', () => {
      // Configurar para manejar el alert
      cy.window().then((win) => {
        cy.stub(win, 'alert').as('alert');
      });
      
      cy.get('#artType').select('fractal');
      cy.get('#fractalIterations').clear().type('8');
      
      cy.get('#generateBtn').click();
      cy.waitForCanvas();
      
      // Guardar arte
      cy.get('#saveBtn').click();
      
      // Esperar a que se complete la petición
      cy.wait(3000);
      
      // Verificar que se mostró el alert de éxito
      cy.get('@alert').should('have.been.called');
      cy.get('@alert').then((alertStub) => {
        const alertMessage = alertStub.getCall(0).args[0];
        expect(alertMessage.toLowerCase()).to.contain('guardado');
      });
    });

    it('debe cargar arte desde la base de datos', () => {

      // ✅ Stub from the beginning (before any buttons are clicked)
      cy.window().then((win) => {
        cy.stub(win, 'alert').as('saveAlert');
        cy.stub(win, 'prompt').returns('1').as('loadPrompt');
      });
    
      // Crear arte
      cy.get('#artType').select('fractal');
      cy.get('#fractalIterations').clear().type('10');
      cy.get('#fractalAngle').clear().type('45');
    
      cy.get('#generateBtn').click();
      cy.waitForCanvas();
    
      // Guardar arte
      cy.get('#saveBtn').click();
      cy.wait(1000);
    
      // ✅ prompt is already stubbed – do NOT stub again here
    
      // Cargar arte
      cy.get('#loadBtn').click();
      cy.wait(1000);
    
      // Verificar canvas
      cy.get('#processingCanvas').should('be.visible');
    });
    
  });

  describe('Controles de color y canvas', () => {
    it('debe cambiar los colores correctamente', () => {
      cy.get('#bgColor').invoke('val', '#0000ff').trigger('change');
      cy.get('#primaryColor').invoke('val', '#ff0000').trigger('change');
      cy.get('#secondaryColor').invoke('val', '#00ff00').trigger('change');
      
      cy.get('#bgColor').should('have.value', '#0000ff');
      cy.get('#primaryColor').should('have.value', '#ff0000');
      cy.get('#secondaryColor').should('have.value', '#00ff00');
    });

    it('debe cambiar el tamaño del canvas', () => {
      cy.get('#canvasWidth').clear().type('1000');
      cy.get('#canvasHeight').clear().type('800');
      
      cy.get('#canvasWidth').should('have.value', '1000');
      cy.get('#canvasHeight').should('have.value', '800');
    });
  });

  describe('Todos los tipos de arte', () => {
    const artTypes = [
      { value: 'fractal', name: 'Fractal' },
      { value: 'mandala', name: 'Mandala' },
      { value: 'vectorField', name: 'Campo Vectorial' },
      { value: 'particles', name: 'Simulación de Partículas' },
      { value: 'perlin', name: 'Perlin Noise' },
      { value: 'mathematical', name: 'Formas Matemáticas' },
      { value: 'tensions', name: 'Conections' },
      { value: 'musicalTensions', name: 'Musical Conections' }
    ];

    artTypes.forEach(({ value, name }) => {
      it(`debe poder generar ${name}`, () => {
        cy.get('#artType').select(value);
        cy.get('#generateBtn').click();
        cy.waitForCanvas();
        
        cy.get('#processingCanvas').should('be.visible');
      });
    });
  });

  describe('API Endpoints', () => {
    it('debe obtener todos los artefactos', () => {
      cy.request('GET', 'http://localhost:3003/api/art').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
      });
    });

    it('debe crear un nuevo artefacto', () => {
      const artData = {
        type: 'fractal',
        parameters: {
          artType: 'fractal',
          fractal: {
            iterations: 8,
            angle: 30,
            length: 100
          },
          colors: {
            background: '#000000',
            primary: '#ffffff',
            secondary: '#00ff00'
          },
          canvasSize: {
            width: 800,
            height: 600
          }
        },
        canvasSize: {
          width: 800,
          height: 600
        }
      };

      cy.request('POST', 'http://localhost:3003/api/art', artData).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('message');
      });
    });

    it('debe obtener un artefacto específico por ID', () => {
      // Primero crear un artefacto
      const artData = {
        type: 'mandala',
        parameters: {
          artType: 'mandala',
          mandala: {
            segments: 12,
            radius: 50,
            layers: 5
          }
        }
      };

      cy.request('POST', 'http://localhost:3003/api/art', artData).then((createResponse) => {
        const artId = createResponse.body.id;
        
        // Obtener el artefacto
        cy.request('GET', `http://localhost:3003/api/art/${artId}`).then((getResponse) => {
          expect(getResponse.status).to.eq(200);
          expect(getResponse.body).to.have.property('id', artId);
          expect(getResponse.body).to.have.property('type', 'mandala');
        });
      });
    });

    it('debe eliminar un artefacto', () => {
      // Crear un artefacto para eliminar
      const artData = {
        type: 'fractal',
        parameters: {
          artType: 'fractal'
        }
      };

      cy.request('POST', 'http://localhost:3003/api/art', artData).then((createResponse) => {
        const artId = createResponse.body.id;
        
        // Eliminar el artefacto
        cy.request('DELETE', `http://localhost:3003/api/art/${artId}`).then((deleteResponse) => {
          expect(deleteResponse.status).to.eq(200);
          expect(deleteResponse.body).to.have.property('message');
        });
      });
    });
  });

  describe('Exportación', () => {
    it('debe tener funcionalidad de exportación', () => {
      cy.get('#artType').select('fractal');
      cy.get('#generateBtn').click();
      cy.waitForCanvas();
      
      // El botón de exportar debe estar disponible
      cy.get('#exportBtn').should('be.visible').and('not.be.disabled');
    });
  });

  describe('Parámetros específicos - Musical Tensions', () => {
    it('debe cambiar todos los parámetros de tensiones musicales', () => {
      cy.get('#artType').select('musicalTensions');
      
      // Cambiar nota raíz
      cy.get('#musicalRoot').select('G');
      cy.get('#musicalRoot').should('have.value', 'G');
      
      // Cambiar calidad del acorde
      cy.get('#musicalChordQuality').select('maj7');
      cy.get('#musicalChordQuality').should('have.value', 'maj7');
      
      // Cambiar modo
      cy.get('#musicalMode').select('mixolydian');
      cy.get('#musicalMode').should('have.value', 'mixolydian');
      
      // Cambiar qué tensiones mostrar
      cy.get('#musicalTensionsShow').select('9');
      cy.get('#musicalTensionsShow').should('have.value', '9');
      
      // Cambiar parámetros de visualización
      cy.get('#musicalNoteSpacing').clear().type('100');
      cy.get('#musicalCircleRadius').clear().type('250');
      cy.get('#musicalLineThickness').clear().type('3');
      
      // Toggle mostrar nombres
      cy.get('#musicalShowNames').uncheck();
      cy.get('#musicalShowNames').should('not.be.checked');
      
      cy.get('#generateBtn').click();
      cy.waitForCanvas();
    });
  });

  describe('Parámetros específicos - Tensions', () => {
    it('debe cambiar todos los parámetros de tensiones', () => {
      cy.get('#artType').select('tensions');
      cy.get('#tensionsParams').should('be.visible');
      
      cy.get('#tensionsNodes').clear().type('30');
      cy.get('#tensionsForce').clear().type('0.8');
      cy.get('#tensionsMinDist').clear().type('60');
      cy.get('#tensionsMaxDist').clear().type('250');
      cy.get('#tensionsThickness').clear().type('2');
      
      cy.get('#generateBtn').click();
      cy.waitForCanvas();
    });
  });
});

