# 🎯 Phase 2: Feature Extraction & Prioritization

## 🚀 Quick Start

```bash
# Installation
npm install

# Configuration
cp env.example .env
# Éditer .env avec votre OPENAI_API_KEY

# Test
npm test

# Exécution
node src/cli/phase2.js
```

## 📋 Prérequis

- **Phase 1** : Fichier `outputs/themes.md` généré
- **OpenAI API Key** : Configuré dans `.env`
- **Node.js** : Version 16+

## 🎯 Résultat

Phase 2 transforme vos thèmes de feedback en **features actionnables** et les priorise selon **3 méthodes PO** :

### 📊 Outputs

- **`outputs/features.md`** : Features détaillées + priorités
- **`outputs/features.csv`** : Données structurées pour analyse

### 🏆 Méthodes de Priorisation

1. **MoSCoW** : Must/Should/Could/Won't
2. **RICE** : Reach × Impact × Confidence / Effort
3. **Kano** : Must-have/Performance/Excitement

## 🔧 Configuration

### Variables d'environnement

```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o
OPENAI_TEMPERATURE=0.3
OPENAI_MAX_TOKENS=4000
```

### Personnalisation des prompts

Éditez les `systemPrompt` dans :

- `src/agents/phase2/featureExtractor.js`
- `src/agents/phase2/moscowPrioritizer.js`
- `src/agents/phase2/ricePrioritizer.js`
- `src/agents/phase2/kanoPrioritizer.js`

## 📈 Exemple de sortie

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

## 🧪 Tests

```bash
# Tous les tests
npm test

# Tests spécifiques
npm test -- --testNamePattern="featureExtractor"
npm test -- --testNamePattern="moscowPrioritizer"
npm test -- --testNamePattern="ricePrioritizer"
npm test -- --testNamePattern="kanoPrioritizer"
```

## 📚 Documentation complète

Voir `docs/PHASE_2_FEATURE_EXTRACTION.md` pour :

- Architecture détaillée
- Guide d'utilisation avancé
- Cas d'usage
- Améliorations futures

## 🔄 Workflow

1. **Phase 1** → Génère les thèmes
2. **Phase 2** → Extrait et priorise les features
3. **Phase 3** → Génère les user stories (à venir)

## 🎯 Cas d'usage

### Product Owner

- **Prioriser** le backlog selon MoSCoW
- **Analyser** l'impact avec RICE
- **Comprendre** les types de features avec Kano
- **Communiquer** les décisions à l'équipe

### Équipe de développement

- **Estimer** l'effort avec les scores RICE
- **Planifier** les sprints selon MoSCoW
- **Implémenter** selon les priorités établies

## 🚨 Dépannage

### Erreur OpenAI

```
❌ Error: OPENAI_API_KEY is not set
```

→ Vérifiez votre fichier `.env`

### Aucune feature extraite

```
✅ Extracted 0 features
```

→ Vérifiez le format des thèmes dans `outputs/themes.md`

### Scores à zéro

```
Top RICE score: 0
```

→ Vérifiez les prompts dans les prioritizers

## 🔮 Prochaines étapes

- **Phase 3** : User Story Generation
- **Visualisations** : Graphiques des priorités
- **Export Excel** : Format supplémentaire
- **API REST** : Interface web

---

_AI Agent Builder - Phase 2_ 🚀
