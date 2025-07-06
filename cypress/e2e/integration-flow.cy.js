describe('Flow d\'intégration complet', () => {
  const baseUrl = 'http://localhost:3000';
  beforeEach(() => {
    cy.visit(baseUrl);
  });

  it('inscription, connexion admin, suppression', () => {
    // Utiliser un email unique pour éviter les conflits
    const email = 'delete+' + Date.now() + '@me.com';

    // Inscription
    cy.get('input[placeholder="Nom"]').type('Delete');
    cy.get('input[placeholder="Prénom"]').type('Me');
    cy.get('input[placeholder="Email"]').type(email);
    cy.get('input[placeholder="Ville"]').type('Paris');
    cy.get('input[placeholder="Code Postal"]').type('75000');
    cy.get('input[type="date"]').type('2000-01-01');
    cy.get('form[data-testid="registration-form"] button[type="submit"]').should('not.be.disabled').click();
    cy.contains('Delete Me').should('be.visible');

    // Connexion admin
    cy.get('button').contains(/connexion admin/i).click();
    cy.get('input[placeholder="Email"]').last().type('loise.fenoll@ynov.com');
    cy.get('input[placeholder="Mot de passe"]').last().type('PvdrTAzTeR247sDnAZBr');
    cy.get('button').contains(/se connecter/i).click();

    // Attendre que le bouton supprimer soit visible pour cet utilisateur
    cy.contains('Delete Me').closest('li').find('button').contains(/supprimer/i).should('be.visible').click();

    // Vérifier la suppression
    cy.contains('Delete Me').should('not.exist');
  });

  it('validation : formulaire invalide puis correction', () => {
    // Remplissage initial avec des erreurs (champs vides et invalides)
    cy.get('input[placeholder="Nom"]').type('123');
    cy.get('input[placeholder="Prénom"]').clear(); // champ vide
    cy.get('input[placeholder="Email"]').type('badmail@test'); // syntaxe valide mais fonctionnellement invalide
    cy.get('input[placeholder="Ville"]').clear(); // champ vide
    cy.get('input[placeholder="Code Postal"]').type('1234');
    cy.get('input[type="date"]').type('2020-01-01');
    // Le bouton doit être désactivé car il y a des champs vides et invalides
    cy.get('form[data-testid="registration-form"] button[type="submit"]').should('be.disabled');

    // Correction de TOUS les champs (tous remplis et valides)
    cy.get('input[placeholder="Nom"]').clear().type('ValidNom');
    cy.get('input[placeholder="Prénom"]').clear().type('ValidPrenom');
    cy.get('input[placeholder="Email"]').clear().type('valid@email.com');
    cy.get('input[placeholder="Ville"]').clear().type('Paris');
    cy.get('input[placeholder="Code Postal"]').clear().type('75000');
    cy.get('input[type="date"]').clear().type('2000-01-01');
    // Le bouton doit maintenant être activé
    cy.get('form[data-testid="registration-form"] button[type="submit"]').should('not.be.disabled').click();
    cy.contains(/registration successful/i).should('be.visible');
    cy.contains('ValidNom ValidPrenom').should('be.visible');
  });

  // ---
  // Test général désactivé en local car dépend du contexte de déploiement
  // it('affiche toujours le formulaire en cas de fausse URL', () => {
  //   cy.visit('/une-url-qui-nexiste-pas', { failOnStatusCode: false });
  //   cy.contains('REJOINS SA BRIGADE').should('be.visible');
  // });
  // ---

  // Test spécifique pour simuler le comportement en production (sous-chemin)
  it('affiche le formulaire sur une fausse URL sous /integ-deploiement/', () => {
    cy.visit('/integ-deploiement/une-url-qui-nexiste-pas', { failOnStatusCode: false });
    cy.contains('REJOINS SA BRIGADE').should('be.visible');
  });

  it('ne permet pas la suppression d\'utilisateur sans être admin', () => {
    // S'inscrire normalement
    cy.get('input[placeholder="Nom"]').type('NoDelete');
    cy.get('input[placeholder="Prénom"]').type('User');
    cy.get('input[placeholder="Email"]').type('nodelete@me.com');
    cy.get('input[placeholder="Ville"]').type('Paris');
    cy.get('input[placeholder="Code Postal"]').type('75000');
    cy.get('input[type="date"]').type('2000-01-01');
    cy.get('form[data-testid="registration-form"] button[type="submit"]').should('not.be.disabled').click();
    cy.contains('NoDelete User').should('be.visible');
    // Vérifier qu'il n'y a PAS de bouton supprimer
    cy.contains('NoDelete User').parent().find('button').should('not.exist');
  });

  it('affiche une erreur si identifiants admin invalides', () => {
    cy.get('button').contains(/connexion admin/i).click();
    cy.get('input[placeholder="Email"]').last().type('fake@admin.com');
    cy.get('input[placeholder="Mot de passe"]').last().type('wrongpassword');
    cy.get('button').contains(/se connecter/i).click();
    cy.contains(/incorrect/i).should('be.visible');
  });

  it('affiche un message de confirmation après suppression d\'un utilisateur', () => {
    // Inscription et connexion admin
    cy.get('input[placeholder="Nom"]').type('Toast');
    cy.get('input[placeholder="Prénom"]').type('Delete');
    cy.get('input[placeholder="Email"]').type('toastdelete@me.com');
    cy.get('input[placeholder="Ville"]').type('Paris');
    cy.get('input[placeholder="Code Postal"]').type('75000');
    cy.get('input[type="date"]').type('2000-01-01');
    cy.get('form[data-testid="registration-form"] button[type="submit"]').should('not.be.disabled').click();
    cy.contains('Toast Delete').should('be.visible');
    cy.get('button').contains(/connexion admin/i).click();
    cy.get('input[placeholder="Email"]').last().type('loise.fenoll@ynov.com');
    cy.get('input[placeholder="Mot de passe"]').last().type('PvdrTAzTeR247sDnAZBr');
    cy.get('button').contains(/se connecter/i).click();
    cy.contains('Toast Delete').closest('li').find('button').contains(/supprimer/i).should('be.visible').click();
    cy.contains('Utilisateur supprimé avec succès').should('be.visible');
    cy.contains('Toast Delete').should('not.exist');
  });

  it('affiche et utilise le bouton de déconnexion admin', () => {
    // Connexion admin
    cy.get('button').contains(/connexion admin/i).click();
    cy.get('input[placeholder="Email"]').last().type('loise.fenoll@ynov.com');
    cy.get('input[placeholder="Mot de passe"]').last().type('PvdrTAzTeR247sDnAZBr');
    cy.get('button').contains(/se connecter/i).click();
    cy.get('button').contains(/déconnexion admin/i).should('be.visible').click();
    // Après déconnexion, le bouton ne doit plus être visible
    cy.get('button').contains(/déconnexion admin/i).should('not.exist');
  });

  it('affiche un message de confirmation après déconnexion admin', () => {
    // Connexion admin
    cy.get('button').contains(/connexion admin/i).click();
    cy.get('input[placeholder="Email"]').last().type('loise.fenoll@ynov.com');
    cy.get('input[placeholder="Mot de passe"]').last().type('PvdrTAzTeR247sDnAZBr');
    cy.get('button').contains(/se connecter/i).click();
    cy.get('button').contains(/déconnexion admin/i).should('be.visible').click();
    cy.get('div').contains('Déconnexion admin réussie').should('be.visible');
  });

  it('flux complet : inscription → création blog → admin supprime', () => {
    // 1. Inscription utilisateur
    cy.get('input[placeholder="Nom"]').type('BlogUser');
    cy.get('input[placeholder="Prénom"]').type('Test');
    cy.get('input[placeholder="Email"]').type('bloguser@test.com');
    cy.get('input[placeholder="Ville"]').type('Paris');
    cy.get('input[placeholder="Code Postal"]').type('75000');
    cy.get('input[type="date"]').type('2000-01-01');
    cy.get('form[data-testid="registration-form"] button[type="submit"]').should('not.be.disabled').click();
    cy.contains('BlogUser Test').should('be.visible');
    
    // 2. Création d'un post de blog
    const blogTitle = 'Post de test ' + Date.now();
    cy.get('input[placeholder="Titre"]').type(blogTitle);
    cy.get('textarea[placeholder="Contenu"]').type('Contenu du post de test');
    cy.get('button').contains('Publier').click();
    cy.contains('Post créé !').should('be.visible');
    cy.contains(blogTitle).should('be.visible');
    
    // 3. Connexion admin
    cy.get('button').contains(/connexion admin/i).click();
    cy.get('input[placeholder="Email"]').last().type('loise.fenoll@ynov.com');
    cy.get('input[placeholder="Mot de passe"]').last().type('PvdrTAzTeR247sDnAZBr');
    cy.get('button').contains(/se connecter/i).click();
    
    // 4. Suppression du post par l'admin
    cy.contains(blogTitle).closest('li').find('button').contains('Supprimer').should('be.visible').click();
    cy.contains(blogTitle).should('not.exist');
    
    // 5. Déconnexion admin
    cy.get('button').contains(/déconnexion admin/i).should('be.visible').click();
    cy.get('button').contains(/déconnexion admin/i).should('not.exist');
    
    // 6. Vérification finale : l'utilisateur existe toujours mais pas le post
    cy.contains('BlogUser Test').should('be.visible');
    cy.contains(blogTitle).should('not.exist');
  });
}); 