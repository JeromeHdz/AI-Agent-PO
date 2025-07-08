# Phase 1: Feedback Ingestion Pipeline

## 🌟 Objectif

Créer un pipeline IA qui traite des **feedbacks utilisateurs non structurés** (emails, tickets, commentaires) et produit une **liste claire de phrases thématiques** résumant les grandes idées exprimées, en regroupant les feedbacks similaires.

## 📊 Cas d'usage

> Le Product Owner est débordé par des dizaines (voire centaines) de feedbacks clients. Il ne peut pas tout lire manuellement, mais veut comprendre rapidement **ce que les utilisateurs demandent ou ressentent le plus souvent**.

## 🏗️ Architecture

### Pipeline Map-Reduce

```
Input: feedback_raw.csv (200 feedbacks)
    ↓
Step 1: Load & Clean (94 unique feedbacks)
    ↓
Step 2: Split into batches (5 batches of 20)
    ↓
Step 3: Map Phase - Summarize each batch
    ↓
Step 4: Reduce Phase - Merge summaries
    ↓
Output: themes.md + themes.csv
```

## 📁 Structure des fichiers

```
src/
├── agents/
│   └── phase1/
│       ├── pipeline.js          # Main pipeline orchestrator
│       ├── themeSynthesizer.js  # Map phase - batch summarization
│       ├── reduceSynthesizer.js # Reduce phase - merge summaries
│       └── themeExporter.js     # Export results
├── utils/
│   ├── csvReader.js             # CSV file reading utility
│   ├── csvWriter.js             # CSV file writing utility
│   ├── markdownWriter.js        # Markdown export utility
│   └── chunkArray.js            # Array batching utility
└── cli/
    └── phase1.js                # CLI entry point
```

## 🔄 Étapes détaillées

### 1. Chargement des données

- **Fichier d'entrée** : `data/feedback_raw.csv`
- **Colonne requise** : `raw_text`
- **Traitement** : Déduplication automatique via `Set()`
- **Résultat** : 94 feedbacks uniques (sur 200 bruts)

### 2. Découpage en batchs

- **Taille de batch** : 20 feedbacks (configurable)
- **Nombre de batchs** : 5 batchs (4 × 20 + 1 × 14)
- **But** : Respecter les limites de tokens OpenAI

### 3. Map Phase - Résumé par lot

- **Technologie** : LangChain + OpenAI GPT-4o
- **Prompt** : Analyse et regroupement sémantique
- **Résultat** : Résumés intermédiaires par batch

### 4. Reduce Phase - Fusion des résumés

- **Technologie** : LangChain + OpenAI GPT-4o
- **Prompt** : Clustering sémantique global
- **Résultat** : 4-7 thèmes finaux

### 5. Export des résultats

- **Format Markdown** : `outputs/themes.md`
- **Format CSV** : `outputs/themes.csv`

## 🧪 Tests unitaires

### Tests disponibles

- `tests/unit/agents/phase1/themeSynthesizer.test.js`
- `tests/unit/agents/phase1/reduceSynthesizer.test.js`
- `tests/unit/agents/phase1/themeExporter.test.js`
- `tests/unit/utils/csvReader.test.js`
- `tests/unit/utils/csvWriter.test.js`
- `tests/unit/utils/markdownWriter.test.js`
- `tests/unit/utils/chunkArray.test.js`

### Lancement des tests

```bash
npm test
npm run test:coverage
```

## 🚀 Utilisation

### Lancement du pipeline

```bash
npm run phase1
```

### Configuration d'environnement

```bash
# .env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o
OPENAI_MAX_TOKENS=4000
OPENAI_TEMPERATURE=0.3
LANGCHAIN_TRACING_V2=false
```

## 📊 Métriques de performance

### Données de test

- **Input** : 200 feedbacks bruts
- **Après déduplication** : 94 feedbacks uniques
- **Batchs traités** : 5 batchs
- **Temps d'exécution** : ~30-60 secondes
- **Coût estimé** : ~$0.10-0.20 par exécution

### Qualité des résultats

- **Thèmes générés** : 4-7 thèmes principaux
- **Cohérence** : Regroupement sémantique automatique
- **Reproductibilité** : Résultats déterministes avec temperature=0.3

## 🔧 Configuration avancée

### Paramètres ajustables

```javascript
// Dans pipeline.js
const batchSize = 20; // Taille des batchs
const modelName = "gpt-4o"; // Modèle OpenAI
const temperature = 0.3; // Créativité (0 = déterministe)
const maxTokens = 4000; // Limite de tokens
```

### Personnalisation des prompts

- **Map Phase** : `src/agents/phase1/themeSynthesizer.js`
- **Reduce Phase** : `src/agents/phase1/reduceSynthesizer.js`

## 🐛 Dépannage

### Erreurs courantes

1. **401 Unauthorized** : Clé API OpenAI invalide
2. **403 Forbidden** : LangChain tracing activé sans clé valide
3. **Token limit exceeded** : Réduire la taille des batchs
4. **File not found** : Vérifier le chemin vers `feedback_raw.csv`

### Solutions

- Désactiver `LANGCHAIN_TRACING_V2` dans `.env`
- Vérifier la clé API OpenAI
- Ajuster `batchSize` si nécessaire

## 📈 Améliorations futures

### Fonctionnalités prévues

- [ ] Support de multiples formats d'entrée (JSON, XML)
- [ ] Analyse de sentiment intégrée
- [ ] Métriques de confiance pour chaque thème
- [ ] Interface web pour visualisation
- [ ] Cache des résultats pour éviter les re-calculs

### Optimisations techniques

- [ ] Parallélisation des batchs
- [ ] Streaming des résultats
- [ ] Compression des prompts
- [ ] Monitoring des coûts en temps réel

## 📚 Références

- **LangChain Documentation** : https://langchain.com/
- **OpenAI API Reference** : https://platform.openai.com/docs
- **Map-Reduce Pattern** : https://en.wikipedia.org/wiki/MapReduce
- **Semantic Clustering** : https://en.wikipedia.org/wiki/Cluster_analysis

---

## 🙋 Projet réalisé dans le cadre du test technique "Agent Builder AI - Thiga"

**Auteur** : [Ton Nom]  
**Date** : 2024  
**Version** : 1.0.0  
**Phase** : 1/3 (Feedback Ingestion)
