# N8N Project — Hoang-Kim Luong

**Moins de clics, plus de déclics.**

Bienvenue dans mon univers n8n : un espace où les tâches répétitives prennent leur retraite, où les skills ont plus d’un tour dans leur manche et où chaque automatisation a une bonne raison d’exister.

## 01 — Workflows
### Ça coule de source. Ça tourne tout seul.

Pourquoi faire dix fois ce qu’on peut automatiser une fois ?

Ici, je transforme les processus répétitifs en workflows intelligents, connectés et efficaces. Moins de copier-coller, moins de perte de temps, plus de temps pour ce qui compte vraiment.

**Au programme :** mes workflows, leur fonctionnement et leur documentation.

### Météo Dressing

Chaque matin à 7 h, trois tenues adaptées à la météo du jour arrivent par e-mail, piochées dans ma garde-robe (un Google Sheet), avec un lien pour valider celle que je porte.

| Workflow | Rôle |
| --- | --- |
| [Orchestrateur](Workflow/workflows/M%C3%A9t%C3%A9o%20Dressing%20-%20Orchestrateur.workflow.ts) | Déclenché à 7 h (ou manuellement) : lit la garde-robe, l'historique et les préférences, appelle les autres workflows, envoie l'e-mail et tient le journal. |
| [Prévisions Météo](Workflow/workflows/M%C3%A9t%C3%A9o%20Dressing%20-%20Pr%C3%A9visions%20M%C3%A9t%C3%A9o.workflow.ts) | Géocode la ville et résume la journée avec l'API Open-Meteo. |
| [Génération Des Tenues](Workflow/workflows/M%C3%A9t%C3%A9o%20Dressing%20-%20G%C3%A9n%C3%A9ration%20Des%20Tenues.workflow.ts) | Le styliste : Gemini compose les tenues à partir de la météo et du catalogue, avec un modèle de secours. |
| [Validation De La Tenue](Workflow/workflows/M%C3%A9t%C3%A9o%20Dressing%20-%20Validation%20De%20La%20Tenue.workflow.ts) | La page web derrière le lien de l'e-mail : affiche la tenue choisie et l'inscrit dans l'historique. |
| [Gestion Des Erreurs](Workflow/workflows/M%C3%A9t%C3%A9o%20Dressing%20-%20Gestion%20Des%20Erreurs.workflow.ts) | En cas d'échec : Gemini analyse la cause, l'incident est journalisé et une alerte part par e-mail. |

Les workflows sont versionnés en TypeScript (`.workflow.ts`) avec [n8ncli](https://github.com/Workflows-Accelerator/n8n-cli).

## 02 — Skills
### Trois skills dans ma manche.

Trois skills, trois façons d’aller plus loin.

Pensées pour enrichir les possibilités, simplifier les tâches et transformer les bonnes idées en solutions concrètes. Parce que l’automatisation ne fait pas tout toute seule : encore faut-il lui donner les bonnes compétences.

**Au programme :** mes trois skills, leurs objectifs et leur documentation.

## 03 — Vidéo & Transcript
### Le projet se regarde. 

Derrière chaque automatisation, il y a une idée, des choix et quelques rouages à comprendre.

La vidéo vous emmène dans les coulisses du projet ; le transcript vous permet d’en suivre chaque étape, sans perdre le fil.

**Au programme :** la présentation vidéo et son transcript complet.

[![Présentation vidéo du projet Météo Dressing](Vid%C3%A9o/miniature.jpg)](Vid%C3%A9o/presentation-meteo-dressing.mp4)

- **[Regarder la vidéo](Vid%C3%A9o/presentation-meteo-dressing.mp4)** — présentation du projet Météo Dressing (5 min 54)
- **[Lire le transcript](Vid%C3%A9o/Transcript.md)** — la présentation en version texte

---

**Un clic pour découvrir. Un workflow pour automatiser. Un skill pour aller plus loin.**
