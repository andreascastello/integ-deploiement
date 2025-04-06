# 📝 Formulaire React – TP d’Intégration & Déploiement

Projet réalisé dans le cadre du TP “Intégration & Déploiement”.  
Objectif : construire un formulaire d’inscription React complet avec validation, tests, documentation, couverture, déploiement GitHub Pages et publication NPM.

---

## 🚀 Fonctionnalités

- Formulaire avec champs : **Nom**, **Prénom**, **Email**, **Date de naissance**, **Ville**, **Code postal**
- ✅ Validation personnalisée des champs
- ✅ Blocage des -18 ans
- ✅ Vérification du format email, nom/prénom/ville (avec accents)
- ✅ Format du code postal français (5 chiffres)
- ✅ Bouton de soumission désactivé tant que tous les champs ne sont pas remplis
- ✅ Affichage des erreurs sous les champs concernés
- ✅ Sauvegarde dans le localStorage
- ✅ Toasts de succès ou d’erreur
- ✅ Réinitialisation automatique du formulaire après enregistrement
- ✅ Couverture de tests 100% avec Vitest
- ✅ Documentation technique générée automatiquement avec JSDoc
- ✅ Déploiement automatique via GitHub Actions + GitHub Pages

---

## 🛠️ Stack technique

| Outil                         | Usage                                |
|------------------------------|--------------------------------------|
| **React 19**             | Framework frontend             |
| **Vite**                 | Bundler ultra rapide           |
| **Vitest**               | Tests unitaires et intégration |
| **Testing Library**      | Tests orientés utilisateur     |
| **JSDoc**                | Génération de documentation    |
| **GitHub Actions**       | CI/CD automatisé               |
| **GitHub Pages**         | Hébergement de la démo         |
| **Codecov**              | Visualisation de couverture    |

---

## 📦 Installation

```bash
npm install
```

---

## 🧪 Lancer les tests

```bash
npm run test
```

## 📈 Rapport de couverture

```bash
npm run coverage
```

Le rapport est généré dans `coverage/index.html`.  
📡 Couverture visible sur Codecov :  
👉 [Voir la couverture sur Codecov](https://app.codecov.io/gh/andreascastello/integ-deploiement)

---

## 🌍 Déploiement

L'application est automatiquement déployée après tests réussis.  
👉 [Voir le site en ligne](https://andreascastello.github.io/integ-deploiement/)

---

## 📚 Documentation technique

```bash
npm run jsdoc
```

Accessible ensuite ici :  
📁 `public/docs/index.html`

---

## 📤 Publication NPM

(Si publié)

```bash
npm install @<ton-profil-npm>/formulaire-react
```

---

## ✅ Tests couverts

| Test | Status |
|------|--------|
| Le calcul de l'âge | ✅ |
| L'âge > 18 ans | ✅ |
| Le format du code postal | ✅ |
| Le format des noms/prénoms (y compris accents/tirets) | ✅ |
| Le format de l’email | ✅ |
| Le bouton désactivé si les champs sont vides | ✅ |
| La sauvegarde dans le localStorage et le toaster de succès | ✅ |
| Le toaster d’erreur et erreurs sous les champs | ✅ |
| La disparition des erreurs quand corrigées | ✅ |

---

## ✍️ Auteur

Projet réalisé par **Andréas**