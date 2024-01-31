import { registerCommands } from '../support/commands';

registerCommands();

const email = Cypress.env('TEST_EMAIL');
const password = Cypress.env('TEST_PASSWORD');

describe('Login', () => {
  it('should authenticate and redirect to notespace, then signOut', () => {
    // Try accessing notespace before logging in
    cy.visit('/notespace');
    cy.contains('button', 'Sign Out').should('not.exist');

    // Try logging in with incorrect details
    cy.login('fake@email.com', 'fakePassword');
    cy.contains('button', 'Sign Out').should('not.exist');

    // Try logging in with correct details
    cy.login(email, password);
    cy.contains('button', 'Sign Out').should('exist');

    // Try signing out
    cy.contains('button', 'Sign Out').click();
    cy.contains('button', 'Sign Out').should('not.exist');
  });
});
