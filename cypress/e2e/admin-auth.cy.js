describe('Admin Auth', () => {
  const baseUrl = 'http://localhost:3000';
  beforeEach(() => {
    cy.visit(baseUrl);
  });

  it('connexion admin avec identifiants valides', () => {
    cy.get('button').contains(/connexion admin/i).click();
    cy.get('input[placeholder="Email"]').last().type('loise.fenoll@ynov.com');
    cy.get('input[placeholder="Mot de passe"]').last().type('PvdrTAzTeR247sDnAZBr');
    cy.get('button').contains(/se connecter/i).click();
    cy.contains(/email:/i).should('be.visible'); // Affichage infos admin
  });

  it('affiche une erreur si identifiants invalides', () => {
    cy.get('button').contains(/connexion admin/i).click();
    cy.get('input[placeholder="Email"]').last().type('loise.fenoll@ynov.com');
    cy.get('input[placeholder="Mot de passe"]').last().type('wrongpassword');
    cy.get('button').contains(/se connecter/i).click();
    cy.contains(/incorrect/i).should('be.visible');
  });
}); 