# Phase 3: User Story Generation

## 🌟 Vue d'ensemble

La **Phase 3** transforme les features prioritaires de la Phase 2 en **user stories complètes et prêtes pour le backlog**. Cette phase génère des user stories détaillées avec critères d'acceptation, story points, et template complet pour l'intégration dans les outils de gestion de projet (Jira, Notion, Linear).

## 🎯 Objectifs

- **Transformation** : Features prioritaires → User stories complètes
- **Template riche** : User story, critères d'acceptation, BDD tests, story points
- **Prêt pour le backlog** : Format compatible avec les outils de gestion de projet
- **Qualité INVEST** : User stories Independent, Negotiable, Valuable, Estimable, Small, Testable

## 🏗️ Architecture

### Pipeline Phase 3

```
Features Prioritaires (Phase 2) → UserStoryGenerator → User Stories Complètes
```

### Composants

- **UserStoryGenerator** : Agent principal de génération
- **Pipeline orchestrator** : Coordination du processus
- **Export utilities** : CSV et Markdown avec template complet

## 📁 Structure des fichiers

```
src/agents/phase3/
├── userStoryGenerator.js     # Agent principal de génération
├── pipeline.js              # Orchestrateur du pipeline
└── cli/phase3.js           # Interface CLI

tests/unit/agents/phase3/
├── userStoryGenerator.test.js  # Tests unitaires
└── pipeline.test.js           # Tests d'intégration
```

## 🚀 Utilisation

### CLI

```bash
# Utilisation avec fichier par défaut
npm run phase3

# Utilisation avec fichier spécifique
node src/cli/phase3.js --input outputs/features.csv

# Aide
node src/cli/phase3.js --help
```

### Programmatique

```javascript
const {
  generateUserStories,
} = require("./src/agents/phase3/userStoryGenerator");

const features = [
  {
    name: "Dark Mode",
    description: "Users want dark theme for visual comfort",
    moscow: "Must",
    rice: { score: 192 },
    kano: { type: "must-have" },
  },
];

const userStories = await generateUserStories(features);
```

## 📋 Template User Story

Chaque user story générée contient :

### Structure complète

```javascript
{
  title: "Feature Name",
  story: "As a [user type], I want [goal], So that [benefit]",
  storyPoints: 8, // Fibonacci: 1, 2, 3, 5, 8, 13, 21, 34
  description: "Detailed context and background",
  acceptanceCriteria: "List of acceptance criteria",
  bddTests: "Given... And... When... Then... format",
  dependencies: "List of dependencies or 'None'",
  value: 9.2, // Numerical value 1-10
  priority: "Must/Should/Could/Won't",
  epic: "Epic name",

  // Template fields pour équipes
  mockups: "", // À remplir par l'équipe design
  taggingPlan: "", // À remplir par l'équipe dev
  performanceCriteria: "", // À remplir par l'équipe tech
  uiuxCriteria: "", // À remplir par l'équipe design
  dataCriteria: "" // À remplir par l'équipe data
}
```

### Exemple de sortie

```markdown
# User Story: Implement Dark Mode Toggle

**EPIC**: User Experience Enhancement  
**Summary**: Allow users to switch between light and dark themes  
**Estimation**: 8 story points  
**Priority**: Must

## User Story

As a user, I want to toggle between light and dark themes, So that I can reduce eye strain in low-light environments.

## Description

User interface allowing to change the application theme to improve visual comfort.

## Acceptance Criteria

The user can access settings and activate dark mode.

## BDD Tests

Given I am on the settings page, And dark mode is available, When I click the theme toggle button, Then the interface switches to dark mode, And all UI elements adapt to the dark theme.

## Dependencies

No dependencies

## Value

9.2/10

## Template Fields

- **Mockups**: [À remplir par design team]
- **Tagging Plan**: [À remplir par dev team]
- **Performance Criteria**: [À remplir par tech team]
- **UI/UX Criteria**: [À remplir par design team]
- **Data Criteria**: [À remplir par data team]
```

## 🔧 Configuration

### Variables d'environnement

```bash
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o
OPENAI_MAX_TOKENS=4000
OPENAI_TEMPERATURE=0.3
```

### Paramètres ajustables

- **Template** : Personnalisable selon les besoins de l'équipe
- **Story Points** : Fibonacci sequence (1, 2, 3, 5, 8, 13, 21, 34)
- **Priorités** : MoSCoW (Must, Should, Could, Won't)
- **Format d'export** : CSV et Markdown

## 🧪 Tests

### Tests unitaires

```bash
# Tests UserStoryGenerator
npm test -- tests/unit/agents/phase3/userStoryGenerator.test.js

# Tests Pipeline
npm test -- tests/unit/agents/phase3/pipeline.test.js

# Tous les tests Phase 3
npm test -- tests/unit/agents/phase3/
```

### Couverture de tests

- ✅ **UserStoryGenerator** : 100% de couverture
- ✅ **Parser robuste** : Support des formats pipe et section
- ✅ **Gestion d'erreurs** : Validation des inputs
- ✅ **Mocks OpenAI** : Tests reproductibles

## 📊 Métriques Phase 3

### Performance

- **Input** : Features prioritaires de Phase 2
- **Traitement** : ~2-5 secondes par feature
- **Output** : User stories complètes avec template
- **Coût** : ~$0.02-0.05 par feature

### Qualité des résultats

- **Template complet** : Tous les champs requis pour le backlog
- **Format INVEST** : User stories conformes aux bonnes pratiques
- **BDD Tests** : Critères d'acceptation en format Given-When-Then
- **Story Points** : Estimation Fibonacci standardisée

## 🔄 Intégration avec les phases précédentes

### Input Phase 2

```javascript
// Format attendu depuis Phase 2
{
  name: "Feature Name",
  description: "Feature description",
  moscow: "Must/Should/Could/Won't",
  rice: { score: 192, reach: 8, impact: 9, confidence: 8, effort: 3 },
  kano: { type: "must-have", justification: "..." }
}
```

### Output pour backlog

```javascript
// Format généré pour intégration
{
  title: "Feature Name",
  story: "As a user, I want...",
  storyPoints: 8,
  acceptanceCriteria: "...",
  bddTests: "Given... When... Then...",
  priority: "Must",
  epic: "Epic Name"
}
```

## 🚦 Prochaines étapes

### Améliorations possibles

1. **Intégration directe** : Export vers Jira, Notion, Linear
2. **Templates personnalisés** : Adaptation selon l'équipe
3. **Validation avancée** : Vérification qualité des user stories
4. **Historique** : Tracking des versions et modifications

### Pipeline complet

```bash
# Pipeline complet Phase 1 → 2 → 3
npm run phase1  # Feedback → Thèmes
npm run phase2  # Thèmes → Features prioritaires
npm run phase3  # Features → User stories
```

## 📚 Documentation associée

- **[Phase 1 - Feedback Ingestion](PHASE_1_FEEDBACK_INGESTION.md)** : Génération des thèmes
- **[Phase 2 - Feature Extraction](PHASE_2_FEATURE_EXTRACTION.md)** : Extraction et priorisation
- **[README principal](../README.md)** : Vue d'ensemble du projet

## 🙋 Support

### Problèmes courants

1. **Format d'input incorrect** : Vérifier la structure des features
2. **Erreur OpenAI** : Vérifier la clé API et les quotas
3. **Parser errors** : Vérifier le format de réponse de l'IA

### Solutions

- Vérifier la structure des features de Phase 2
- Contrôler la clé API OpenAI dans `.env`
- Consulter les logs de debug pour identifier les problèmes

---

**Phase 3 - User Story Generation** ✅ **COMPLÉTÉ**  
**Dernière mise à jour** : 2024  
**Version** : 1.0.0
