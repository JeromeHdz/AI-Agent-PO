# Phase 2: Feature Extraction & Prioritization

## 🎯 Vue d'ensemble

Phase 2 transforme les thèmes de feedback utilisateur (Phase 1) en features actionnables et les priorise selon plusieurs méthodes utilisées par les Product Owners.

## 🏗️ Architecture

### Agents

#### 1. **Feature Extractor** (`src/agents/phase2/featureExtractor.js`)

- **Rôle** : Transforme les thèmes en features structurées
- **Input** : Thèmes de feedback (Phase 1)
- **Output** : Features avec description, objectif, exemples, impact
- **Technologie** : OpenAI GPT-4o via LangChain

#### 2. **MoSCoW Prioritizer** (`src/agents/phase2/moscowPrioritizer.js`)

- **Rôle** : Classe les features selon MoSCoW (Must/Should/Could/Won't)
- **Méthode** : Analyse fréquence, valeur business, faisabilité, impact UX
- **Output** : Classification avec justifications

#### 3. **RICE Prioritizer** (`src/agents/phase2/ricePrioritizer.js`)

- **Rôle** : Score les features selon RICE (Reach × Impact × Confidence / Effort)
- **Méthode** :
  - **Reach** : Nombre d'utilisateurs affectés (1-10)
  - **Impact** : Effet sur satisfaction/conversion/rétention (1-10)
  - **Confidence** : Niveau de certitude (1-10)
  - **Effort** : Estimation effort équipe (1-10)
- **Output** : Scores RICE triés par priorité

#### 4. **Kano Prioritizer** (`src/agents/phase2/kanoPrioritizer.js`)

- **Rôle** : Classe les features selon le modèle Kano
- **Méthode** :
  - **Must-have** : Fonctionnalités de base attendues
  - **Performance** : Plus = mieux (satisfaction linéaire)
  - **Excitement** : Fonctionnalités inattendues qui créent de la satisfaction
- **Output** : Classification avec justifications

### Pipeline

#### **Phase 2 Pipeline** (`src/agents/phase2/pipeline.js`)

1. **Lecture des thèmes** depuis Phase 1
2. **Extraction des features** depuis les thèmes
3. **Priorisation MoSCoW** de toutes les features
4. **Priorisation RICE** de toutes les features
5. **Classification Kano** de toutes les features
6. **Export** vers markdown et CSV

## 📊 Méthodes de Priorisation

### MoSCoW

- **Must** : Critiques pour le succès du produit
- **Should** : Importantes mais pas critiques
- **Could** : Souhaitables si le temps le permet
- **Won't** : Pas prévues pour cette itération

### RICE

- **Score = (Reach × Impact × Confidence) / Effort**
- **Tri décroissant** par score
- **Justifications** pour chaque score

### Kano

- **Must-have** : Fonctionnalités de base attendues
- **Performance** : Plus de fonctionnalités = plus de satisfaction
- **Excitement** : Fonctionnalités inattendues qui créent de la satisfaction

## 🚀 Utilisation

### CLI

```bash
node src/cli/phase2.js
```

### Programmatique

```javascript
const { runPhase2Pipeline } = require("./src/agents/phase2/pipeline");

await runPhase2Pipeline(
  "outputs/themes.md",
  "outputs/features.md",
  "outputs/features.csv"
);
```

## 📁 Outputs

### Markdown (`outputs/features.md`)

- **Features détaillées** avec descriptions complètes
- **Priorisation MoSCoW** avec justifications
- **Scores RICE** en tableau
- **Classification Kano** avec justifications
- **Résumé** des statistiques

### CSV (`outputs/features.csv`)

- **Toutes les features** avec métadonnées
- **Scores RICE** détaillés
- **Classifications MoSCoW et Kano**
- **Justifications** pour chaque méthode

## 🔧 Configuration

### Variables d'environnement

```env
OPENAI_API_KEY=your_api_key
OPENAI_MODEL=gpt-4o
OPENAI_TEMPERATURE=0.3
OPENAI_MAX_TOKENS=4000
```

### Prompts personnalisables

- **Feature Extractor** : `systemPrompt` dans `featureExtractor.js`
- **MoSCoW** : `systemPrompt` dans `moscowPrioritizer.js`
- **RICE** : `systemPrompt` dans `ricePrioritizer.js`
- **Kano** : `systemPrompt` dans `kanoPrioritizer.js`

## 🧪 Tests

```bash
npm test
```

### Tests unitaires

- `featureExtractor.test.js` : Extraction des features
- `moscowPrioritizer.test.js` : Priorisation MoSCoW
- `ricePrioritizer.test.js` : Priorisation RICE
- `kanoPrioritizer.test.js` : Classification Kano
- `pipeline.test.js` : Pipeline complet

## 📈 Métriques

### Exemple de sortie

```
📊 Summary:
  - Input themes: 20
  - Extracted features: 19
  - MoSCoW Must: 3
  - MoSCoW Should: 2
  - Top RICE score: 100.8
  - Kano Must-have: 8
  - Kano Performance: 11
  - Kano Excitement: 0
```

## 🔄 Workflow Git Flow

### Branches

- `main` : Code stable
- `develop` : Développement en cours
- `feature/phase2-*` : Nouvelles fonctionnalités
- `hotfix/phase2-*` : Corrections urgentes

### Commits

- `feat:` : Nouvelles fonctionnalités
- `fix:` : Corrections de bugs
- `docs:` : Documentation
- `test:` : Tests
- `refactor:` : Refactoring

## 🎯 Cas d'usage

### Product Owner

1. **Analyser le feedback** : Phase 1 génère les thèmes
2. **Extraire les features** : Phase 2 transforme en features
3. **Prioriser** : Utilise MoSCoW, RICE, Kano
4. **Décider** : Base les décisions sur les scores
5. **Communiquer** : Partage les résultats avec l'équipe

### Équipe de développement

1. **Comprendre les priorités** : Consulte les scores RICE
2. **Estimer l'effort** : Utilise les métriques RICE
3. **Planifier les sprints** : Base sur MoSCoW
4. **Implémenter** : Suit les priorités établies

## 🔮 Améliorations futures

### Phase 3 : User Story Generation

- Transformer les features en user stories détaillées
- Ajouter les critères d'acceptation
- Générer les scénarios de test

### Améliorations Phase 2

- **Visualisations** : Graphiques pour les priorités
- **Filtres** : Par impact, effort, type
- **Export** : Formats supplémentaires (Excel, JSON)
- **Historique** : Suivi des changements de priorité

## 📚 Références

- **MoSCoW** : [Agile Alliance](https://www.agilealliance.org/glossary/moscow/)
- **RICE** : [Intercom](https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/)
- **Kano** : [Wikipedia](https://en.wikipedia.org/wiki/Kano_model)
- **LangChain** : [Documentation](https://js.langchain.com/)
- **OpenAI** : [API Documentation](https://platform.openai.com/docs)

---

_Généré par AI Agent Builder - Phase 2_
