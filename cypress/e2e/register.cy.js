describe('Inscription employé', () => {
  const baseUrl = 'http://localhost:3000';
  beforeEach(() => {
    cy.visit(baseUrl);
  });

  it("S'inscrire en tant qu'employé, voir confirmation et présence dans la liste", () => {
    cy.get('input[placeholder="Nom"]').type('Testeur');
    cy.get('input[placeholder="Prénom"]').type('Cypressgoat');
    cy.get('input[placeholder="Email"]').type('cypressgoat@test.com');
    cy.get('input[placeholder="Ville"]').type('Paris');
    cy.get('input[placeholder="Code Postal"]').type('75000');
    cy.get('input[type="date"]').type('2000-01-01');
    cy.get('form[data-testid="registration-form"] button[type="submit"]').click();

    cy.contains(/registration successful/i).should('be.visible');
    cy.contains('Testeur Cypressgoat').should('be.visible');
  });
}); 