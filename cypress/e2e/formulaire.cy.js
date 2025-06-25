describe('Formulaire - Validation', () => {
  const baseUrl = 'http://localhost:3000';
  beforeEach(() => {
    cy.visit(baseUrl);
  });

  it('désactive le bouton si tous les champs ne sont pas remplis', () => {
    cy.get('button[type="submit"]').should('be.disabled');
    cy.get('input[placeholder="Nom"]').type('Test');
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('affiche des erreurs pour des champs invalides', () => {
    cy.get('input[placeholder="Nom"]').type('123');
    cy.get('input[placeholder="Prénom"]').type('Fake');
    cy.get('input[placeholder="Email"]').type('badmail@test');
    cy.get('input[placeholder="Ville"]').type('Paris');
    cy.get('input[placeholder="Code Postal"]').type('1234');
    cy.get('input[type="date"]').type('2020-01-01');

    cy.get('button[type="submit"]').should('not.be.disabled').click();

    cy.get('[data-testid="error-lastname"]').should('contain', 'invalid last name');
    cy.get('[data-testid="error-email"]').should('contain', 'invalid email');
    cy.get('[data-testid="error-postalcode"]').should('contain', 'invalid postal code');
    cy.get('[data-testid="error-birthdate"]').should('contain', 'age requirement');
  });

  it('refuse un mineur', () => {
    cy.get('input[placeholder="Nom"]').type('Test');
    cy.get('input[placeholder="Prénom"]').type('Jeune');
    cy.get('input[placeholder="Email"]').type('jeune@test.com');
    cy.get('input[placeholder="Ville"]').type('Paris');
    cy.get('input[placeholder="Code Postal"]').type('75000');
    cy.get('input[type="date"]').type('2010-01-01');
    cy.get('button[type="submit"]').click();
    cy.contains(/age requirement/i).should('be.visible');
  });

  it('affiche un message de confirmation et le nouvel utilisateur après inscription', () => {
    cy.get('input[placeholder="Nom"]').type('Testeur');
    cy.get('input[placeholder="Prénom"]').type('Cypress');
    cy.get('input[placeholder="Email"]').type('cypress@test.com');
    cy.get('input[placeholder="Ville"]').type('Paris');
    cy.get('input[placeholder="Code Postal"]').type('75000');
    cy.get('input[type="date"]').type('1995-01-01');
    cy.get('button[type="submit"]').should('not.be.disabled').click();
    cy.get('.success-message').should('contain', 'Registration successful');
    cy.contains('Testeur Cypress').should('be.visible');
  });
}); 