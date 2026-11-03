# Skills Claude Code — n8n et développement prudent

Trois skills autonomes et complémentaires, rédigés en français.

## Installation dans un projet

Copiez les trois dossiers dans `.claude/skills/` à la racine de votre dépôt :

```text
.claude/
└── skills/
    ├── spec-beton/
    │   └── SKILL.md
    ├── doubt-driven-development/
    │   └── SKILL.md
    └── hostile-review/
        └── SKILL.md
```

## Installation pour votre utilisateur

Pour les rendre disponibles dans plusieurs projets, copiez les dossiers dans `~/.claude/skills/` (en conservant la même structure).

## Usage conseillé

1. **Avant** de construire un workflow : `spec-beton`
2. **Pendant** la construction : `doubt-driven-development`
3. **Après une dérive ou sur demande** : `hostile-review`

Chaque skill fonctionne seul. Les noms dans les descriptions facilitent la coordination, mais aucun ne nécessite la présence des deux autres.

## Notes

- Les skills demandent une validation explicite avant une construction non cadrée ou une correction à risque.
- Les preuves doivent être réelles : ne jamais annoncer une commande exécutée si elle ne l'a pas été.
- Les tests ne doivent pas déclencher d'effets en production.
- Ces fichiers sont les instructions des skills ; aucun script auxiliaire n'est requis pour les utiliser.
