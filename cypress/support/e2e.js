// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Esperar a que Processing.js esté listo
Cypress.Commands.add('waitForProcessing', () => {
  cy.window().then((win) => {
    return new Promise((resolve) => {
      const checkProcessing = () => {
        if (win.Processing && win.generateArt) {
          cy.wait(500); // Dar tiempo adicional para inicialización
          resolve();
        } else {
          setTimeout(checkProcessing, 100);
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
  cy.wait(1000); // Dar tiempo para que Processing.js renderice
});

