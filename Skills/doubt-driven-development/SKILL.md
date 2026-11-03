---
name: doubt-driven-development
description: >-
  Après la spécification et pendant la construction, challenge les décisions de
  Claude qui présentent un risque, puis cherche une preuve par lecture ou
  exécution plutôt que par intuition. Pour chaque erreur, expose le scénario
  concret et une correction proposée avant de la modifier. Spécialisé pour les
  workflows n8n et les intégrations, mais utilisable pour le code, les données,
  les specs et les plans. Fonctionne seul ; utilise spec-beton comme contrat si
  disponible et complète hostile-review sans la remplacer.
---

# Doubt-driven development — douter, puis prouver

## Mission

Empêcher qu'une supposition technique ou métier devienne un fait simplement parce qu'elle a été répétée pendant la session. Le doute doit rester proportionné : **pas de rituel pour les changements mécaniques, pas de confiance sans preuve pour les décisions risquées**.

Ce skill est autonome. S'il existe une spec validée, elle sert de contrat. Sinon, établis un contrat court à partir de la demande, des contraintes constatées et des hypothèses annoncées.

## Quand l'utiliser

- Après `spec-beton`, avant ou pendant la construction d'un workflow n8n.
- Avant une décision sur les branchements, les calculs, les données ou les frontières entre systèmes.
- Quand un changement touche les retries, l'idempotence, la concurrence, les fuseaux horaires, les droits, les données personnelles, l'argent ou un effet irréversible.
- Avant d'affirmer qu'un travail non trivial est terminé.
- Quand l'utilisateur demande de vérifier, challenger, douter ou relire à froid.

Ne l'applique pas à une tâche purement mécanique, sauf demande explicite. Si l'utilisateur demande d'aller vite, réduis les vérifications non essentielles, mais n'exécute jamais un effet réel pour prouver un comportement.

## Règles cardinales

1. **L'affirmation n'est pas la preuve.**
2. **Les tests doivent vérifier le contrat**, pas seulement confirmer le code écrit.
3. **Les résultats d'un relecteur sont des pistes**, à revérifier.
4. **Une erreur est présentée avec un scénario et une correction concrète.**
5. **N'applique pas une correction non triviale ou qui change le comportement métier avant l'accord de l'utilisateur.** Tu peux corriger sans demander pour un défaut purement mécanique et sans conséquence métier, sauf instruction contraire.
6. **Aucun effet réel pendant une vérification** : pas d'envoi à un client, d'écriture en production, de paiement, de suppression ou d'appel irréversible.
7. **Ne remets pas en cause un choix de l'utilisateur par préférence personnelle.** Il faut un fait vérifiable qui le contredise, ou une demande explicite de le challenger.
8. **Ne déclare jamais “testé” sans donner la commande ou la procédure exécutée et son résultat.**

## Étape 0 — Établir le contrat

Si une spec pertinente existe, lis les règles concernées et les hypothèses qu'elles citent. Une spec au statut `proposé` est un contrat provisoire : rappelle qu'elle n'est pas validée.

Sans spec, écris en trois lignes au plus :
- **Compris** : l'objectif tel que tu le comprends.
- **Supposé** : les choix non confirmés.
- **Risque** : la supposition qui ferait le plus de dégâts si elle était fausse.

Ne demande pas une confirmation pour chaque hypothèse bénigne. Arrête-toi toutefois avant de prendre une décision qui engage la sécurité, des données personnelles, de l'argent ou un effet irréversible.

Un trou ou une contradiction dans la spec ne se comble pas silencieusement dans le workflow. Pose la question à l'utilisateur et propose de mettre à jour la spec.

## Étape 1 — Formuler la décision à mettre en doute

Une décision est un choix entre plusieurs façons de faire. Regroupe en une seule décision les lignes qui servent le même choix.

Écris :
- **Décision** : ce que tu proposes de faire.
- **Si c'est faux** : le scénario et la conséquence.
- **Preuve attendue** : ce qui permettrait de trancher.

Exemple :

> Décision : dédupliquer les événements sur l'identifiant stable fourni par le webhook.
> Si c'est faux : un rejeu après timeout peut créer deux fiches.
> Preuve attendue : rejouer deux fois le même événement de test et vérifier qu'une seule fiche est créée.

## Étape 2 — Doute léger : preuve rapide

Par défaut, consacre au doute léger un effort court et proportionné. Si la preuve paraît coûteuse, explique ce qu'il faudrait faire et laisse le statut ` [supposé] ` en attendant l'autorisation ou les moyens nécessaires.

Choisis une preuve adaptée :
- lire le code ou l'export du workflow ;
- exécuter un test ciblé ;
- comparer les valeurs attendues aux valeurs obtenues ;
- rejouer un événement sur données de test ;
- vérifier les branches nominales et d'erreur ;
- consulter la documentation officielle correspondant à la version utilisée.

Pour n8n, pense notamment à :
- zéro item, un item et plusieurs items ;
- champ absent, `null`, chaîne vide et zéro ;
- mauvais appariement d'items ou expression qui dépend d'un nœud précis ;
- branche IF/Switch non empruntée et Merge ;
- pagination, limite de débit, timeout et réponse partielle ;
- retry après un effet partiellement réussi ;
- double déclenchement et concurrence ;
- fuseau horaire, changement d'heure et événement en retard ;
- credentials, permissions et exposition de données dans les logs.

Ne teste pas tous les cas de façon automatique : choisis ceux qui peuvent réfuter l'affirmation considérée.

### Statuts de preuve

| Statut | Signification | Ce qu'il faut fournir |
|---|---|---|
| `[prouvé]` | La vérification a été exécutée. | Commande/procédure et résultat observé. |
| `[lu]` | Le comportement est constaté dans une source, mais pas exécuté. | Chemin et emplacement précis, ou documentation datée. |
| `[supposé]` | Déduction plausible non confirmée. | Hypothèse et méthode pour trancher. |

« J'ai vérifié » sans commande, sortie ou référence précise vaut `[supposé]`. Un test réussi ne prouve que les propriétés qu'il vérifie effectivement.

Tout script temporaire de vérification reste hors du projet par défaut. Propose de l'ajouter au projet seulement si c'est utile à long terme.

## Étape 3 — Doute approfondi : regard indépendant

Réserve cette étape :
- aux décisions à conséquence élevée (sécurité, données personnelles, argent, irréversibilité) ;
- à une demande explicite de contre-expertise ;
- à une contradiction sérieuse que le doute léger n'a pas résolue.

### Préparer le paquet de revue

Dans un dossier temporaire, extrais uniquement :
1. **l'artefact minimal** : portion de workflow exportée, code, règle ou calcul à examiner ;
2. **le contrat** : règles pertinentes copiées de la spec, ou résumé fidèle en dix lignes au plus si aucune spec n'existe ;
3. **les dépendances nécessaires** : fichiers appelés par l'artefact, sans secrets.

Ne transmets pas ton raisonnement ni ta conclusion au relecteur : il doit pouvoir réfuter l'artefact sans être entraîné vers ton avis.

### Prompt pour un sous-agent neuf

```text
Tu relis un travail que tu n'as pas fait. Ton objectif est de trouver ce qui
est faux ou insuffisamment garanti, sans inventer de défaut pour remplir un quota.

Artefact : <chemin>
Contrat : <chemin>
Tu peux lire les dépendances nécessaires en lecture seule. Ne modifie aucun fichier.

Cherche :
- les exigences du contrat que l'artefact ne garantit pas ;
- ce que l'artefact fait sans que le contrat le demande ;
- les hypothèses silencieuses et contradictions du contrat ;
- les cas limites pertinents : vide, zéro, doublon, rejeu, concurrence,
  fuseau horaire, bornes, panne et résultat vide sans erreur ;
- les écarts entre résultat affiché et résultat réellement appliqué ;
- les effets irréversibles et les risques sur les données.

Pour chaque constat, donne l'emplacement exact, un scénario concret
(entrée → résultat incorrect), la gravité et ta confiance. Si tu peux prouver
le constat sans modifier quoi que ce soit et sans effet réel, donne la procédure
et la sortie. N'approuve pas, ne réécris pas l'artefact et ne propose pas de
correction vague. 500 mots maximum.
```

Si aucun sous-agent n'est disponible, fais une passe séparée en ne relisant que le paquet et les dépendances nécessaires. Indique que cette relecture est moins indépendante.

## Étape 4 — Trier les constats

Un constat reçu n'est pas automatiquement vrai. Revérifie-le dans le code, l'export, la documentation ou une exécution sûre.

- **Contrat incomplet ou contradictoire** : l'artefact ne peut pas être jugé correctement tant que la règle n'est pas clarifiée. Pose la question et propose de corriger la spec.
- **Défaut confirmé** : le scénario casse réellement et viole le contrat.
- **Compromis réel** : le risque existe, mais sa correction a un coût. Présente les deux côtés ; l'utilisateur arbitre.
- **Non confirmé / bruit** : le scénario ne se reproduit pas ou ne relève pas du contrat. Écarte-le du verdict, en conservant une trace si le risque était important.
- **Incertain** : aucune preuve suffisante dans un sens ou dans l'autre. Décris précisément ce qui permettrait de trancher.

Plusieurs constats peuvent venir d'une même cause. Vérifie la cause avant de proposer une correction.

## Étape 5 — Présenter avant de corriger

Pour chaque défaut confirmé, indique :
1. l'emplacement ;
2. le scénario qui échoue ;
3. la preuve et son statut ;
4. la correction exacte proposée ;
5. le test qui doit échouer avant la correction et réussir après.

Rassemble les erreurs à la fin de l'étape de travail en cours, plutôt que d'interrompre chaque action non liée. **N'applique pas les corrections qui modifient le comportement attendu sans accord de l'utilisateur.** Tu peux continuer les parties indépendantes.

Après accord, procède ainsi :
- exécute le test de régression avant la correction et conserve le résultat ;
- applique la correction ;
- relance le même test ;
- vérifie qu'aucun effet réel n'a été déclenché.

Si l'artefact ne peut pas s'exécuter, rejoue le scénario en lecture ou par simulation, et annonce clairement la limite.

## Étape 6 — Douter des décisions déjà en place

Un choix existant, y compris un choix de l'utilisateur, ne se remet en cause que si :
- un fait observé le contredit ;
- une nouvelle exigence le rend incompatible ;
- l'utilisateur demande explicitement de le challenger.

Présente le fait, l'alternative, le coût de chaque option et ce qui permettrait de trancher. Ne modifie rien avant décision de l'utilisateur.

## Étape 7 — Définir l'arrêt et rendre compte

Arrête le doute approfondi lorsque les nouveaux tours n'apportent plus que du bruit ou des compromis, et au plus tard après trois tours. Ne relance pas un relecteur sur un artefact et un contrat inchangés.

Avant de déclarer la tâche terminée, chaque exigence importante doit porter une preuve `[prouvé]` ou `[lu]`. Toute exigence sans preuve est annoncée comme non vérifiée.

Compte rendu concis :

```markdown
**Doute effectué :** N décisions ; X tiennent, Y tombent, Z restent incertaines.

- **Tombe** — [décision] : scénario et preuve. Correction proposée : [...]. À appliquer ?
- **Incertain** — [décision] : ce qui manque pour trancher.
- **Tient** — [décision] : preuve `[prouvé]` ou `[lu]`.
- **Non vérifié** — [exigence] : raison et prochaine étape.

**Sécurité :** aucun effet réel déclenché pendant les vérifications.
**Pour rejouer :** <commande ou procédure, si disponible>
```

Si plus de cinq décisions ont été examinées, détaille celles qui tombent ou restent incertaines et compte les autres.

## Relation avec les deux autres skills

- **Avec `spec-beton`** : la spec est le contrat. Une règle manquante ou contradictoire retourne à l'utilisateur ; ne l'invente pas dans le workflow.
- **Avec `hostile-review`** : ce skill challenge une décision précise pendant le travail. `hostile-review` remet un ensemble plus large à plat avec plusieurs regards indépendants.
- **Sans les autres skills** : crée un contrat court, effectue les vérifications pertinentes et rends le même compte rendu.

## Erreurs à éviter

- Douter de chaque détail, même mécanique.
- Confondre les tests qui passent avec une preuve du besoin métier.
- Faire confiance à un relecteur sans vérifier ses constats.
- Tester directement en production ou envoyer de vrais messages pour prouver un comportement.
- Corriger en silence une règle métier ou un choix utilisateur.
- Présenter une critique sans scénario reproductible ni issue concrète.
- Affirmer qu'une exécution a eu lieu alors qu'elle n'a pas été possible.
