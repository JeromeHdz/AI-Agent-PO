# Agent Architecture - Technical Documentation

## 🏗️ Vue d'ensemble de l'architecture

Le système d'agents IA suit une architecture modulaire basée sur le pattern **Map-Reduce** avec des agents spécialisés pour chaque phase du pipeline de traitement des feedbacks.

## 🧠 Architecture des agents

### Agent 1: Feedback Processor (Phase 1)

**Responsabilité** : Traitement et synthèse des feedbacks bruts

```javascript
// Architecture Map-Reduce
Input: feedback_raw.csv (200 feedbacks)
    ↓
Map Phase: summarizeBatch() - Traitement par batchs
    ↓
Reduce Phase: reduceSummaries() - Fusion des résumés
    ↓
Output: themes.md + themes.csv
```

**Technologies** :

- LangChain pour l'orchestration
- OpenAI GPT-4o pour l'analyse sémantique
- Pattern Map-Reduce pour la scalabilité

### Agent 2: Pattern Identifier (Phase 2) - À venir

**Responsabilité** : Identification des patterns récurrents dans les thèmes

### Agent 3: Feature Extractor (Phase 2) - À venir

**Responsabilité** : Extraction des fonctionnalités demandées

### Agent 4: Prioritization Engine (Phase 3) - À venir

**Responsabilité** : Priorisation des features (MoSCoW, RICE, Kano)

### Agent 5: Story Generator (Phase 3) - À venir

**Responsabilité** : Génération de user stories avec critères d'acceptation

## 🔄 Flux de données

### Phase 1 - Feedback Ingestion

```
feedback_raw.csv (200 feedbacks)
    ↓
csvReader.js (déduplication)
    ↓
94 feedbacks uniques
    ↓
chunkArray.js (batchs de 20)
    ↓
5 batchs
    ↓
themeSynthesizer.js (Map phase)
    ↓
Résumés intermédiaires
    ↓
reduceSynthesizer.js (Reduce phase)
    ↓
4-7 thèmes finaux
    ↓
themeExporter.js
    ↓
themes.md + themes.csv
```

### Phase 2 - Feature Extraction (Prévu)

```
themes.md (Phase 1 output)
    ↓
Pattern Identifier
    ↓
Feature Extractor
    ↓
features.csv
```

### Phase 3 - User Stories Generation (Prévu)

```
features.csv (Phase 2 output)
    ↓
Prioritization Engine
    ↓
Story Generator
    ↓
user_stories.csv
```

## 🛠️ Technologies utilisées

### Core Framework

- **LangChain** : Orchestration des agents IA
- **OpenAI GPT-4o** : Modèle de langage principal
- **Node.js** : Runtime JavaScript

### Data Processing

- **csv-parser** : Lecture des fichiers CSV
- **csv-writer** : Écriture des fichiers CSV
- **Set()** : Déduplication des données

### Testing

- **Jest** : Framework de tests unitaires
- **Mock functions** : Simulation des appels OpenAI

### Code Quality

- **ESLint** : Linting du code
- **Prettier** : Formatage automatique
- **TypeScript** : Typage statique (prévu)

## 📊 Métriques de performance

### Phase 1 - Métriques actuelles

- **Input** : 200 feedbacks bruts
- **Déduplication** : 94 feedbacks uniques (6 doublons éliminés)
- **Batchs** : 5 batchs (4 × 20 + 1 × 14)
- **Temps d'exécution** : ~30-60 secondes
- **Coût estimé** : ~$0.10-0.20 par exécution
- **Thèmes générés** : 4-7 thèmes principaux

### Optimisations implémentées

- **Déduplication automatique** : Élimination des doublons
- **Batch processing** : Respect des limites de tokens OpenAI
- **Temperature = 0.3** : Résultats déterministes
- **Mock des appels OpenAI** : Tests reproductibles

## 🔧 Configuration technique

### Variables d'environnement

```bash
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o
OPENAI_MAX_TOKENS=4000
OPENAI_TEMPERATURE=0.3

# LangChain Configuration
LANGCHAIN_TRACING_V2=false
LANGCHAIN_ENDPOINT=https://api.smith.langchain.com
LANGCHAIN_API_KEY=your_langchain_api_key_here
LANGCHAIN_PROJECT=ai-po-thiga

# Application Configuration
NODE_ENV=development
LOG_LEVEL=info
OUTPUT_DIR=./outputs
DATA_DIR=./data
```

### Paramètres ajustables

```javascript
// Dans pipeline.js
const batchSize = 20; // Taille des batchs
const modelName = "gpt-4o"; // Modèle OpenAI
const temperature = 0.3; // Créativité (0 = déterministe)
const maxTokens = 4000; // Limite de tokens
```

## 🧪 Tests et qualité

### Architecture de tests

```
tests/
├── unit/
│   ├── agents/
│   │   └── phase1/
│   │       ├── themeSynthesizer.test.js
│   │       ├── reduceSynthesizer.test.js
│   │       └── themeExporter.test.js
│   └── utils/
│       ├── csvReader.test.js
│       ├── csvWriter.test.js
│       ├── markdownWriter.test.js
│       └── chunkArray.test.js
└── integration/
    └── phase1-pipeline.test.js
```

### Couverture de code

- **Phase 1** : 100% de couverture pour les fonctions critiques
- **Tests unitaires** : Tous les agents et utilitaires
- **Tests d'intégration** : Pipeline complet Phase 1
- **Mock des appels OpenAI** : Tests reproductibles

## 🔄 Patterns de conception

### Map-Reduce Pattern

```javascript
// Map Phase - Traitement parallèle par batchs
const batchSummaries = [];
for (let i = 0; i < batches.length; i++) {
  const summary = await summarizeBatch(batches[i]);
  batchSummaries.push(...summary);
}

// Reduce Phase - Fusion des résultats
const finalThemes = await reduceSummaries(batchSummaries);
```

### Dependency Injection

```javascript
// Injection des dépendances pour les tests
const processor = new FeedbackProcessor({
  llm: mockLLM,
  batchSize: 20,
  temperature: 0.3,
});
```

### Error Handling

```javascript
try {
  const result = await processFeedback(feedbacks);
  return result;
} catch (error) {
  console.error("❌ Error in Phase 1 pipeline:", error.message);
  throw error;
}
```

## 📈 Scalabilité et performance

### Optimisations actuelles

- **Batch processing** : Traitement par lots pour respecter les limites OpenAI
- **Déduplication** : Élimination automatique des doublons
- **Caching** : Possibilité d'ajouter un cache pour éviter les re-calculs

### Optimisations futures

- **Parallélisation** : Traitement simultané des batchs
- **Streaming** : Traitement en temps réel
- **Compression** : Réduction de la taille des prompts
- **Monitoring** : Suivi des coûts et performances en temps réel

## 🔒 Sécurité et bonnes pratiques

### Gestion des clés API

- **Variables d'environnement** : Clés stockées dans `.env`
- **Gitignore** : `.env` exclu du versioning
- **Validation** : Vérification de la présence des clés requises

### Validation des données

```javascript
if (!Array.isArray(feedbacks) || feedbacks.length === 0) {
  throw new Error("Invalid feedback data");
}
```

### Gestion des erreurs

- **Try-catch** : Gestion des erreurs OpenAI
- **Logging** : Traçabilité des erreurs
- **Fallback** : Mécanismes de récupération

## 🚀 Déploiement et maintenance

### Structure de déploiement

```
AI_PO_THIGA/
├── src/                    # Code source
├── tests/                  # Tests unitaires
├── docs/                   # Documentation
├── data/                   # Données d'entrée
├── outputs/                # Résultats générés
├── scripts/                # Scripts utilitaires
└── package.json            # Configuration npm
```

### Scripts de maintenance

```bash
npm test                    # Tests unitaires
npm run test:coverage      # Couverture de code
npm run lint               # Linting
npm run format             # Formatage
npm run phase1             # Pipeline Phase 1
```

---

## 📚 Références techniques

- **LangChain Documentation** : https://langchain.com/
- **OpenAI API Reference** : https://platform.openai.com/docs
- **Map-Reduce Pattern** : https://en.wikipedia.org/wiki/MapReduce
- **Jest Testing Framework** : https://jestjs.io/
- **Node.js Best Practices** : https://nodejs.org/en/docs/guides/

---

**Version** : 1.0.0  
**Dernière mise à jour** : 2024  
**Phase** : 1/3 complétée
