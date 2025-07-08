# AI Agent Builder - Product Owner Assistant

## 🌟 Vue d'ensemble

Système d'agents IA pour assister les Product Owners dans l'analyse de feedback utilisateur et la génération de backlog. Développé dans le cadre du test technique Thiga.

## 🎯 Objectif

Transformer des **feedbacks utilisateurs non structurés** (emails, tickets, commentaires) en **user stories prioritaires** prêtes pour le backlog, via un pipeline IA en 3 phases.

## 🏗️ Architecture

### Pipeline complet

```
Phase 1: Feedback Ingestion → Phase 2: Feature Extraction → Phase 3: User Stories Generation
```

### Phase 1: Thematic Synthesis ✅

- **Input**: Raw user feedback
- **Process**: Group feedback by themes and generate summaries
- **Output**: Structured thematic lines
- **Status**: Complete with Map-Reduce pipeline

### Phase 2: Feature Extraction & Prioritization ✅

- **Input**: Thematic lines from Phase 1
- **Process**: Extract features and prioritize using multiple methods
- **Output**: Prioritized features with scores (MoSCoW, RICE, Kano)
- **Status**: Complete with 3 prioritization methods

### Phase 3: User Story Generation ✅

- **Input**: Prioritized features from Phase 2
- **Process**: Transform features into structured user stories
- **Output**: Ready-to-use user stories for backlog (Jira, Notion, Linear)
- **Status**: Complete with comprehensive template

## 📊 Roadmap

| Phase       | Statut          | Branche                                | Description                           | Progression |
| ----------- | --------------- | -------------------------------------- | ------------------------------------- | ----------- |
| **Phase 1** | ✅ **COMPLÉTÉ** | `feature/phase1-feedback-ingestion`    | Analyse et synthèse des feedbacks     | 100%        |
| **Phase 2** | ✅ **COMPLÉTÉ** | `feature/phase2-feature-extraction`    | Extraction et clustering des features | 100%        |
| **Phase 3** | ✅ **COMPLÉTÉ** | `feature/phase3-user-story-generation` | Génération de user stories            | 100%        |

## 🚀 Phase 1 - Feedback Ingestion (COMPLÉTÉ)

### ✅ Fonctionnalités implémentées

- **Pipeline Map-Reduce** : Traitement de 200 feedbacks → 94 uniques → 5 batchs → synthèse thématique
- **Technologies** : LangChain + OpenAI GPT-4o
- **Tests unitaires** : 100% de couverture pour les fonctions critiques
- **Export** : Markdown + CSV avec thèmes synthétisés
- **Performance** : ~30-60 secondes pour 200 feedbacks

### 📁 Structure Phase 1

```
src/agents/phase1/
├── pipeline.js          # Orchestrateur principal
├── themeSynthesizer.js  # Map phase - résumé par batch
├── reduceSynthesizer.js # Reduce phase - fusion des résumés
└── themeExporter.js     # Export des résultats
```

### 🧪 Tests Phase 1

- ✅ Tests unitaires pour tous les composants
- ✅ Tests d'intégration du pipeline complet
- ✅ Mock des appels OpenAI pour tests reproductibles

## ✅ Phase 2 - Feature Extraction (COMPLÉTÉ)

### 🎯 Fonctionnalités implémentées

- **Feature Extractor** : Extraction automatique de features depuis les thèmes
- **MoSCoW Prioritizer** : Classification Must/Should/Could/Won't
- **RICE Prioritizer** : Scoring Reach/Impact/Confidence/Effort
- **Kano Prioritizer** : Classification Must-have/Performance/Excitement
- **Pipeline orchestrator** : Coordination des agents
- **Export complet** : CSV avec toutes les prioritizations

### 📁 Structure Phase 2

```
src/agents/phase2/
├── featureExtractor.js      # Extraction des features
├── moscowPrioritizer.js     # MoSCoW classification
├── ricePrioritizer.js       # RICE scoring
├── kanoPrioritizer.js       # Kano classification
├── pipeline.js              # Orchestrateur
└── featureExporter.js       # Export des résultats
```

### 🧪 Tests Phase 2

- ✅ Tests unitaires pour tous les agents
- ✅ Tests d'intégration du pipeline complet
- ✅ Mocks OpenAI pour tests reproductibles

## ✅ Phase 3 - User Story Generation (COMPLÉTÉ)

### 🎯 Fonctionnalités implémentées

- **UserStoryGenerator** : Transformation des features en user stories complètes
- **Template complet** : User story, critères d'acceptation, BDD tests, story points
- **Pipeline orchestrator** : Traitement des features prioritaires
- **Export multiple** : CSV et Markdown avec user stories détaillées

### 📁 Structure Phase 3

```
src/agents/phase3/
├── userStoryGenerator.js     # Génération des user stories
├── pipeline.js              # Orchestrateur
└── cli/phase3.js           # Interface CLI
```

### 🧪 Tests Phase 3

- ✅ Tests unitaires pour UserStoryGenerator
- ✅ Tests d'intégration du pipeline complet
- ✅ Support des formats pipe et section

## 🛠️ Installation et configuration

### Prérequis

- Node.js >= 18.0.0
- Clé API OpenAI valide

### Installation

```bash
git clone [repository-url]
cd AI_PO_THIGA
npm install
```

### Configuration

```bash
cp env.example .env
# Éditer .env avec ta clé API OpenAI
OPENAI_API_KEY=your_openai_api_key_here
```

## 🚀 Utilisation

### Pipeline complet

```bash
# Phase 1: Feedback → Thèmes
npm run phase1

# Phase 2: Thèmes → Features prioritaires
npm run phase2

# Phase 3: Features → User stories
npm run phase3
```

### Utilisation individuelle

```bash
# Phase 1 (Feedback Ingestion)
npm run phase1
# Résultats dans outputs/themes.md et outputs/themes.csv

# Phase 2 (Feature Extraction)
npm run phase2
# Résultats dans outputs/features.csv

# Phase 3 (User Story Generation)
npm run phase3
# Résultats dans outputs/user_stories.csv et outputs/user_stories.md
```

### Tests

```bash
npm test                    # Tests unitaires
npm run test:coverage      # Couverture de code
npm run test:watch         # Tests en mode watch
```

### Linting et formatage

```bash
npm run lint               # ESLint
npm run lint:fix          # ESLint avec auto-fix
npm run format            # Prettier
```

## 📁 Structure du projet

```
AI_PO_THIGA/
├── src/
│   ├── agents/
│   │   ├── phase1/           # ✅ Phase 1 complétée
│   │   │   ├── pipeline.js
│   │   │   ├── themeSynthesizer.js
│   │   │   ├── reduceSynthesizer.js
│   │   │   └── themeExporter.js
│   │   ├── phase2/           # ✅ Phase 2 complétée
│   │   │   ├── featureExtractor.js
│   │   │   ├── moscowPrioritizer.js
│   │   │   ├── ricePrioritizer.js
│   │   │   ├── kanoPrioritizer.js
│   │   │   ├── pipeline.js
│   │   │   └── featureExporter.js
│   │   └── phase3/           # ✅ Phase 3 complétée
│   │       ├── userStoryGenerator.js
│   │       └── pipeline.js
│   ├── utils/                # Utilitaires partagés
│   │   ├── csvReader.js
│   │   ├── csvWriter.js
│   │   ├── markdownWriter.js
│   │   └── chunkArray.js
│   └── cli/
│       ├── phase1.js         # Point d'entrée CLI Phase 1
│       ├── phase2.js         # Point d'entrée CLI Phase 2
│       └── phase3.js         # Point d'entrée CLI Phase 3
├── data/
│   └── feedback_raw.csv      # Données de test (200 feedbacks)
├── outputs/                  # Résultats générés
│   ├── themes.md
│   ├── themes.csv
│   ├── features.csv
│   ├── user_stories.csv
│   └── user_stories.md
├── tests/
│   └── unit/
│       ├── agents/
│       │   ├── phase1/       # Tests Phase 1
│       │   ├── phase2/       # Tests Phase 2
│       │   └── phase3/       # Tests Phase 3
│       └── utils/            # Tests utilitaires
├── docs/
│   ├── PHASE_1_FEEDBACK_INGESTION.md  # Documentation Phase 1
│   ├── PHASE_2_FEATURE_EXTRACTION.md  # Documentation Phase 2
│   └── PHASE_3_USER_STORY_GENERATION.md # Documentation Phase 3
├── README_PHASE_1.md         # Quick start Phase 1
├── README_PHASE_2.md         # Quick start Phase 2
├── README_PHASE_3.md         # Quick start Phase 3
└── README.md
```

## 🧪 Tests et qualité

### Couverture de code

- **Phase 1** : 100% de couverture pour les fonctions critiques
- **Phase 2** : 100% de couverture pour tous les agents
- **Phase 3** : 100% de couverture pour UserStoryGenerator
- **Tests unitaires** : Tous les agents et utilitaires
- **Tests d'intégration** : Pipeline complet pour chaque phase

## 📊 Exemple de sortie

### Phase 1: Thèmes générés

```markdown
# User Feedback Themes

- Users want dark mode for better visual comfort
- Mobile app performance needs improvement
- Interface should be more intuitive
```

### Phase 2: Features prioritaires

```csv
ID,Feature Name,Description,MoSCoW,RICE Score,Kano Type
1,Dark Mode,Users want dark theme for visual comfort,Must,192,must-have
2,Mobile Performance,App is slow on mobile devices,Must,126,performance
```

### Phase 3: User Stories

```markdown
# User Story: Implement Dark Mode Toggle

**EPIC**: User Experience Enhancement  
**Summary**: Allow users to switch between light and dark themes  
**Estimation**: 8 story points  
**Priority**: Must

## User Story

As a user, I want to toggle between light and dark themes, So that I can reduce eye strain in low-light environments.

## Acceptance Criteria

The user can access settings and activate dark mode.

## BDD Tests

Given I am on the settings page, And dark mode is available, When I click the theme toggle button, Then the interface switches to dark mode, And all UI elements adapt to the dark theme.
```

## 🤝 Contribution

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/ai-po-thiga.git
   cd ai-po-thiga
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make changes and test**

   ```bash
   npm test
   npm run lint
   ```

5. **Commit and push**

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**

## 📚 Documentation

- **[Phase 1 - Feedback Ingestion](docs/PHASE_1_FEEDBACK_INGESTION.md)** : Documentation complète
- **[Phase 2 - Feature Extraction](docs/PHASE_2_FEATURE_EXTRACTION.md)** : Documentation complète
- **[Phase 3 - User Story Generation](docs/PHASE_3_USER_STORY_GENERATION.md)** : Documentation complète
- **[Quick Start Phase 1](README_PHASE_1.md)** : Démarrage rapide
- **[Quick Start Phase 2](README_PHASE_2.md)** : Démarrage rapide
- **[Quick Start Phase 3](README_PHASE_3.md)** : Démarrage rapide

## 🚦 Prochaines étapes

### Améliorations possibles

1. **Intégration directe** : Export vers Jira, Notion, Linear
2. **Templates personnalisés** : Adaptation selon l'équipe
3. **Validation avancée** : Vérification qualité des user stories
4. **Historique** : Tracking des versions et modifications
5. **Interface web** : Dashboard pour visualisation et gestion

### Pipeline complet automatisé

```bash
# Pipeline complet en une commande
npm run pipeline -- --input data/feedback.csv
```

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- **Thiga** pour le test technique
- **OpenAI** pour GPT-4o
- **LangChain** pour le framework d'agents IA

---

**🎉 Projet complet** - Toutes les 3 phases sont terminées et fonctionnelles !
