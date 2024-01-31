import { registerCommands } from '../support/commands';

registerCommands();

const name = 'Test User';
const email = 'test@email.com';
const password = 'testPassword';

describe('Signup & Delete Account', () => {
  it('should sign up, then delete account', () => {
    // Try accessing notespace before logging in
    cy.visit('/notespace');
    cy.contains('button', 'Sign Out').should('not.exist');

    // Try signing up - with wrong confirmPassword
    cy.signup(name, email, password, 'differentPassword');
    cy.contains('button', 'Sign Out').should('not.exist');

    // Try signing up - correctly
    cy.signup(name, email, password);
    cy.contains('button', 'Sign Out', { timeout: 10000 }).should('exist');

    // Try deleting account
    cy.visit('/settings');
    cy.get('[data-testId="deleteAccountButton"]').click();
    cy.get('[data-testId="confirmDeleteAccountButton"]').click();
    cy.contains('button', 'Sign Out').should('not.exist');

    // Try logging in again
    cy.login(email, password);
    cy.contains('button', 'Sign Out').should('not.exist');
  });
});
