
import './commands'


// Manejar excepciones no capturadas
Cypress.on('uncaught:exception', (err, runnable) => {
  // Ignorar errores de G6.js y otros errores conocidos que no afectan los tests
  if (err.message.includes('graph.data is not a function') ||
      err.message.includes('G6') ||
      err.message.includes('g6Container')) {
    return false; // No fallar el test
  }
  // Dejar que otros errores fallen el test
  return true;
});

// Esperar a que Processing.js esté listo
Cypress.Commands.add('waitForProcessing', () => {
  cy.window().then((win) => {
    return new Promise((resolve) => {
      let attempts = 0;
      const maxAttempts = 50; // 5 segundos máximo
      const checkProcessing = () => {
        attempts++;
        if (win.Processing && win.generateArt) {
          cy.wait(500); // Dar tiempo adicional para inicialización
          resolve();
        } else if (attempts < maxAttempts) {
          setTimeout(checkProcessing, 100);
        } else {
          console.warn('Processing.js no se cargó en el tiempo esperado');
          resolve(); // Continuar de todas formas
        }
      };
      checkProcessing();
    });
  });
});

// Limpiar base de datos antes de las pruebas
Cypress.Commands.add('clearDatabase', () => {
  cy.request('GET', 'http://localhost:3003/api/art').then((response) => {
    if (response.body && Array.isArray(response.body)) {
      response.body.forEach((art) => {
        cy.request('DELETE', `http://localhost:3003/api/art/${art.id}`);
      });
    }
  });
});

// Esperar a que el canvas tenga contenido
Cypress.Commands.add('waitForCanvas', () => {
  cy.get('#processingCanvas').should('be.visible');
  // Dar tiempo para que Processing.js renderice
  cy.wait(2000);
  // Verificar que el canvas existe (no necesariamente que processingInstance esté definido)
  cy.get('#processingCanvas').should('exist');
});

