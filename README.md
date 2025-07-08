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

### Agents implémentés

- ✅ **Agent 1** : Feedback Processor (Phase 1) - **COMPLÉTÉ**
- 🔄 **Agent 2** : Pattern Identifier (Phase 2) - En cours
- ⏳ **Agent 3** : Feature Extractor (Phase 2) - À venir
- ⏳ **Agent 4** : Prioritization Engine (Phase 3) - À venir
- ⏳ **Agent 5** : Story Generator (Phase 3) - À venir

## 📊 Roadmap

| Phase       | Statut          | Branche                             | Description                           | Progression |
| ----------- | --------------- | ----------------------------------- | ------------------------------------- | ----------- |
| **Phase 1** | ✅ **COMPLÉTÉ** | `feature/phase1-feedback-ingestion` | Analyse et synthèse des feedbacks     | 100%        |
| **Phase 2** | 🔄 **EN COURS** | `feature/phase2-feature-extraction` | Extraction et clustering des features | 0%          |
| **Phase 3** | ⏳ **À VENIR**  | `feature/phase3-user-stories`       | Génération de user stories            | 0%          |

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

## 🔄 Phase 2 - Feature Extraction (EN COURS)

### 🎯 Objectifs

- Extraire les fonctionnalités demandées des thèmes Phase 1
- Clustering sémantique des features similaires
- Priorisation initiale (MoSCoW, RICE)

### 📋 Tâches prévues

- [ ] Agent Pattern Identifier
- [ ] Agent Feature Extractor
- [ ] Tests unitaires complets
- [ ] Documentation détaillée

## ⏳ Phase 3 - User Stories Generation (À VENIR)

### 🎯 Objectifs

- Génération automatique de user stories
- Critères d'acceptation
- Estimation de complexité
- Intégration dans le backlog

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

### Phase 1 (Feedback Ingestion)

```bash
npm run phase1
# Résultats dans outputs/themes.md et outputs/themes.csv
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
│   │   └── phase1/           # ✅ Phase 1 complétée
│   │       ├── pipeline.js
│   │       ├── themeSynthesizer.js
│   │       ├── reduceSynthesizer.js
│   │       └── themeExporter.js
│   ├── utils/                # Utilitaires partagés
│   │   ├── csvReader.js
│   │   ├── csvWriter.js
│   │   ├── markdownWriter.js
│   │   └── chunkArray.js
│   └── cli/
│       └── phase1.js         # Point d'entrée CLI
├── data/
│   └── feedback_raw.csv      # Données de test (200 feedbacks)
├── outputs/                  # Résultats générés
│   ├── themes.md
│   └── themes.csv
├── tests/
│   └── unit/
│       ├── agents/
│       │   └── phase1/       # Tests Phase 1
│       └── utils/            # Tests utilitaires
├── docs/
│   └── PHASE_1_FEEDBACK_INGESTION.md  # Documentation détaillée
└── README.md
```

## 🧪 Tests et qualité

### Couverture de code

- **Phase 1** : 100% de couverture pour les fonctions critiques
- **Tests unitaires** : Tous les agents et utilitaires
- **Tests d'intégration** : Pipeline complet Phase 1

### Standards de code

- **ESLint** : Configuration TypeScript
- **Prettier** : Formatage automatique
- **Commits conventionnels** : `feat()`, `fix()`, `test()`, `docs()`

## 📊 Métriques Phase 1

### Performance

- **Input** : 200 feedbacks bruts
- **Traitement** : 94 feedbacks uniques (déduplication)
- **Batchs** : 5 batchs de 20 feedbacks
- **Temps** : ~30-60 secondes
- **Coût** : ~$0.10-0.20 par exécution

### Qualité des résultats

- **Thèmes générés** : 4-7 thèmes principaux
- **Cohérence** : Regroupement sémantique automatique
- **Reproductibilité** : Résultats déterministes

## 🔧 Configuration avancée

### Variables d'environnement

```bash
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o
OPENAI_MAX_TOKENS=4000
OPENAI_TEMPERATURE=0.3
LANGCHAIN_TRACING_V2=false
```

### Paramètres ajustables

- **Taille des batchs** : 20 feedbacks (configurable)
- **Modèle OpenAI** : gpt-4o (ou gpt-3.5-turbo)
- **Temperature** : 0.3 (déterministe)

## 🐛 Dépannage

### Erreurs courantes

1. **401 Unauthorized** : Clé API OpenAI invalide
2. **403 Forbidden** : LangChain tracing activé sans clé valide
3. **Token limit exceeded** : Réduire la taille des batchs

### Solutions

- Vérifier la clé API OpenAI dans `.env`
- Désactiver `LANGCHAIN_TRACING_V2=false`
- Ajuster `batchSize` dans le pipeline

## 📚 Documentation

- **[Phase 1 - Feedback Ingestion](docs/PHASE_1_FEEDBACK_INGESTION.md)** : Documentation complète
- **[Architecture des agents](docs/AGENT_ARCHITECTURE.md)** : Vue d'ensemble technique
- **[Guide de développement](CONTRIBUTING.md)** : Standards et bonnes pratiques

## 🚦 Prochaines étapes

### Phase 2 - Feature Extraction

1. **Créer la branche** : `feature/phase2-feature-extraction`
2. **Implémenter Agent 2** : Pattern Identifier
3. **Implémenter Agent 3** : Feature Extractor
4. **Tests et documentation**

### Phase 3 - User Stories Generation

1. **Créer la branche** : `feature/phase3-user-stories`
2. **Implémenter Agent 4** : Prioritization Engine
3. **Implémenter Agent 5** : Story Generator
4. **Tests et documentation**

## 🙋 Contribuer

### Git Flow

- **Branches** : `main` ← `dev` ← `feature/phaseX-*`
- **Commits** : Conventionnels (`feat()`, `fix()`, `test()`, `docs()`)
- **PR** : Obligatoire pour merge vers `dev`

### Standards

- **Code en anglais** : Variables, fonctions, commentaires
- **Tests unitaires** : Pour chaque fonction non triviale
- **Documentation** : README et docs détaillées

---

## 📄 Licence

MIT License - Voir [LICENSE](LICENSE) pour plus de détails.

---

## 🙋 Projet réalisé dans le cadre du test technique "Agent Builder AI - Thiga"

**Auteur** : [Ton Nom]  
**Date** : 2024  
**Version** : 1.0.0  
**Phases** : 1/3 complétées
