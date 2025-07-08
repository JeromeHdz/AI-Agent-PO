# Phase 3: User Story Generation - Quick Start

## 🚀 Démarrage rapide

### Installation et configuration

```bash
# Vérifier que les phases précédentes sont complétées
ls outputs/features.csv

# Lancer Phase 3
npm run phase3
```

### Résultats

Les user stories seront générées dans :

- `outputs/user_stories.csv` - Format CSV pour import
- `outputs/user_stories.md` - Format Markdown pour documentation

## 📋 Exemple de sortie

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

## 🧪 Tests

```bash
# Tests unitaires
npm test -- tests/unit/agents/phase3/

# Tests spécifiques
npm test -- tests/unit/agents/phase3/userStoryGenerator.test.js
```

## 📚 Documentation complète

Voir [docs/PHASE_3_USER_STORY_GENERATION.md](docs/PHASE_3_USER_STORY_GENERATION.md) pour la documentation détaillée.

---

**Phase 3** ✅ **COMPLÉTÉ** - User stories prêtes pour le backlog !
