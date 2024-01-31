/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      signup(name: string, email: string, password: string, confirmPassword?: string): Chainable<void>;
    }
  }
}

export function registerCommands() {
  Cypress.Commands.add('login', (email, password) => {
    cy.visit('/login');
    cy.get('#email').type(email);
    cy.get('#password').type(password);
    cy.get('button[type="submit"]').click();
  });

  Cypress.Commands.add('signup', (name, email, password, confirmPassword = password) => {
    cy.visit('/signup');
    cy.get('#name').type(name);
    cy.get('#email').type(email);
    cy.get('#password').type(password);
    cy.get('#confirmPassword').type(confirmPassword);
    cy.get('button[type="submit"]').click();
  });
}
