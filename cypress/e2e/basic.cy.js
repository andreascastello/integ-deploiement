describe('Basic UI', () => {
  const baseUrl = 'http://localhost:3000';
  beforeEach(() => {
    cy.visit(baseUrl);
  });

  it('charge la page sans erreur', () => {
    cy.contains(/rejoins sa brigade/i).should('be.visible');
  });

  it('affiche le formulaire d\'inscription', () => {
    cy.get('form[data-testid="registration-form"]').should('be.visible');
    cy.get('input[placeholder="Nom"]').should('exist');
    cy.get('input[placeholder="Prénom"]').should('exist');
    cy.get('input[placeholder="Email"]').should('exist');
    cy.get('input[placeholder="Ville"]').should('exist');
    cy.get('input[placeholder="Code Postal"]').should('exist');
    cy.get('input[type="date"]').should('exist');
  });
}); 