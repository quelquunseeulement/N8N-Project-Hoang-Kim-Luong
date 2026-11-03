---
name: hostile-review
description: >-
  Organise une revue indépendante et contradictoire d'un workflow n8n, d'un
  projet ou des décisions de Claude. Trois relecteurs aux rôles distincts
  travaillent sans lire la conversation ; leurs constats sont ensuite vérifiés
  par un arbitre neutre qui distingue faits, hypothèses, désaccords et choix
  métier. Produit un verdict, un plan de reprise et un fichier de relais si utile.
  À lancer sur demande ou à proposer après des signes concrets de dérive. Fonctionne
  seul et complète spec-beton et doubt-driven-development.
---

# Hostile review — revue indépendante et arbitrage

## Mission

Obtenir un jugement fiable sur l'état réel du projet, sans défendre le travail de Claude, sans fabriquer de problèmes pour remplir un quota et sans confondre consensus et vérité.

La revue doit répondre à quatre questions :
1. Que devait faire le projet ?
2. Que fait-il réellement, d'après les éléments vérifiés ?
3. Quels écarts, risques ou incertitudes subsistent ?
4. Quelle est la prochaine décision ou correction la plus utile ?

**Neutralité ne signifie pas chercher à détruire le travail.** Un verdict « rien de cassé dans le périmètre testé » est recevable si les attaques tentées et les limites de la revue sont explicites.

Ce skill fonctionne seul. S'il existe une spec `spec-beton`, elle est l'objectif de référence. Sinon, utilise la demande originale de l'utilisateur et marque toute reformulation comme telle.

## Quand l'utiliser

Sur demande explicite : « revue hostile », « regard neutre », « fais débattre trois agents », « arbitre les options », « relis tout à froid », « Claude dérive ».

Propose-le sans le lancer automatiquement lorsqu'un signal concret apparaît :
- référence à un fichier, champ, nœud, fonction ou commande qui n'existe pas ;
- contradiction avec un fait établi ;
- même correction échouée deux fois ;
- utilisateur obligé de corriger plusieurs fois la même incompréhension ;
- session très longue ou changements dispersés dans de nombreux fichiers.

Quand tu le proposes, cite le signal et demande l'accord. Si l'utilisateur l'a demandé explicitement, lance la revue.

Ne l'utilise pas à la place d'une vérification ciblée pendant le développement ni d'une revue de diff dédiée.

## Principes non négociables

- Les relecteurs ne voient pas la conversation, le raisonnement de Claude ni son verdict provisoire.
- Chaque relecteur a un périmètre distinct et peut conclure qu'il n'a rien trouvé.
- Aucun constat majeur ou bloquant n'entre au verdict sans vérification indépendante.
- Les affirmations de Claude sont contrôlées une par une ; ne crée pas de fausses citations ni d'affirmations que personne n'a faites.
- Les désaccords sont conservés et expliqués ; un vote majoritaire ne remplace pas une preuve.
- L'arbitre distingue les faits vérifiés, les interprétations, les préférences et les décisions qui reviennent à l'utilisateur.
- Aucun agent ne modifie le projet pendant la revue.
- Les vérifications sont en lecture seule ou sur données d'essai. Aucun envoi réel, paiement, écriture en production ou effet irréversible.
- Aucune correction n'est appliquée avant l'accord de l'utilisateur si elle change le comportement, le périmètre ou le risque.

## Étape 1 — Préparer un dossier neutre

Dans un dossier temporaire, prépare trois fichiers.

### `objectif.md`

- Si une spec existe, copie les règles pertinentes sans les reformuler.
- Sinon, reprends mot pour mot la demande utilisateur disponible.
- Ajoute les critères d'acceptation documentés.
- Signale explicitement les zones que l'objectif ne précise pas.

N'inclus pas la conclusion de Claude ni une description promotionnelle du projet.

### `affirmations.md`

Liste les affirmations importantes réellement formulées par Claude ou inscrites noir sur blanc dans les fichiers. Une affirmation par ligne, numérotée, sans défense ni justification.

Exemples :
- A1 — « Le workflow ignore les événements en doublon. »
- A2 — « Les tests passent. »
- A3 — « Le champ `customer_id` existe dans la réponse de l'API. »

Ne fabrique pas d'affirmations pour avoir quelque chose à réfuter. Si aucune affirmation importante n'a été faite, indique-le.

### `perimetre.md`

- chemin du projet ;
- fichiers et systèmes inclus ;
- fichiers générés, dépendances, secrets ou systèmes de production exclus ;
- vérifications sûres autorisées ;
- limites d'accès et éléments manquants.

Ne copie aucun secret ou credential. Si un export n8n contient des données sensibles, crée une copie expurgée pour les relecteurs et indique les éléments masqués.

## Étape 2 — Lancer trois relecteurs indépendants

Si les outils de sous-agents sont disponibles, lance trois agents neufs en parallèle. Chacun reçoit seulement le dossier de revue et les fichiers du projet nécessaires. Ne transmets jamais l'historique de conversation ni la conclusion de Claude.

### Relecteur 1 — Le saboteur

```text
Tu es le relecteur chargé de trouver les scénarios réalistes qui cassent.
Lis objectif.md, affirmations.md et perimetre.md, puis inspecte le projet
dans le périmètre autorisé. Tu n'as pas accès à la conversation.

Cherche les défauts de logique, les cas limites, les pannes, les doublons,
les retries, la concurrence, les volumes, les dates/fuseaux, les données
vides et les échecs silencieux. Pour un workflow n8n, examine notamment
le passage des items, les branches, les expressions, les erreurs de nœuds
et les reprises après effet partiel.

Ne modifie rien et ne déclenche aucun effet réel. Vérifie les affirmations
qui relèvent de ton couloir. Pour chaque constat : gravité, fichier/emplacement,
scénario entrée → résultat, preuve ou méthode sûre pour le reproduire,
confiance. Tu peux conclure qu'aucun défaut sérieux n'a été trouvé.
Pas de quota de défauts, pas de commentaires de style. 700 mots maximum.
```

### Relecteur 2 — Le nouveau venu

```text
Tu arrives sans historique et tu dois déterminer si le projet correspond à
l'objectif documenté. Lis objectif.md, affirmations.md et perimetre.md, puis
inspecte les fichiers nécessaires. Tu n'as pas accès à la conversation.

Vérifie les références citées (fichiers, nœuds, champs, fonctions, commandes,
URLs), les contradictions entre fichiers, les écarts entre la spec et
l'implémentation, les étapes manquantes et les instructions impossibles à suivre.
Vérifie les affirmations relevant de ce couloir.

Ne modifie rien et ne déclenche aucun effet réel. Chaque constat doit citer
un emplacement précis, un scénario ou une preuve, une gravité et une confiance.
Distingue clairement ce qui est absent de ce que tu n'as pas pu vérifier.
N'invente pas de défaut pour remplir un quota. 700 mots maximum.
```

### Relecteur 3 — Le gardien

```text
Tu es chargé des conséquences coûteuses : sécurité, permissions, données
personnelles, secrets, argent, suppression, envois et effets irréversibles.
Lis uniquement le dossier de revue et les fichiers nécessaires du projet ;
tu n'as pas accès à la conversation.

Vérifie les affirmations qui touchent ton couloir. Cherche les droits excessifs,
les secrets exposés, les données envoyées au mauvais endroit, les effets
répétés après retry, les écritures non protégées, les erreurs sans alerte et
les risques d'exploitation. Pour n8n, inspecte les credentials référencés,
les destinations, les nœuds d'écriture et les paramètres d'exécution visibles,
sans afficher de secret.

Ne déclenche aucun effet réel et ne modifie rien. Chaque constat contient
emplacement, scénario concret, gravité, confiance et preuve sûre ou étape
permettant de trancher. Si rien de sérieux n'est trouvé, dis-le. 700 mots maximum.
```

Si aucun sous-agent n'est disponible, joue les trois rôles dans trois passes séparées. À chaque passe, relis uniquement le dossier neutre et les fichiers nécessaires, sans consulter la conversation ni les notes des autres passes. Le rapport doit signaler que l'indépendance est moindre.

## Étape 3 — Vérifier les constats et les affirmations

Les sorties des relecteurs sont des pistes, pas des verdicts. L'arbitre revérifie chaque constat bloquant ou majeur et chaque affirmation centrale.

Pour chaque constat :
- **confirmé** : reproduit en sécurité ou directement établi par une source fiable ;
- **non reproduit** : le scénario n'a pas été reproduit et les éléments disponibles ne le confirment pas ;
- **incertain** : impossible de confirmer ou réfuter ; précise ce qui permettrait de trancher.

Pour chaque affirmation :
- **confirmée** ;
- **démentie** ;
- **invérifiable**.

Une affirmation « les tests passent » exige la commande et sa sortie, pas une phrase dans un README. Une affirmation sur une API doit être confrontée à la documentation pertinente et, si possible, à un exemple sûr. Ne confonds pas « je ne l'ai pas trouvé » avec « cela n'existe pas » si l'inspection est incomplète.

Fusionne les constats qui décrivent une même cause. La répétition entre plusieurs relecteurs ne rend pas le défaut plus grave.

## Étape 4 — Arbitrer les désaccords

L'arbitre n'est pas un quatrième partisan. Il compare les preuves et classe chaque point comme suit :

- **Fait établi** : preuve reproductible ou source directement vérifiée.
- **Défaut confirmé** : violation d'une exigence documentée.
- **Risque plausible** : scénario crédible, pas encore reproduit.
- **Désaccord d'interprétation** : plusieurs lectures du contrat sont possibles.
- **Choix métier à trancher** : plusieurs options légitimes, avec coûts différents.
- **Préférence** : pas un défaut tant qu'elle ne viole pas une exigence.

Si deux options restent défendables, ne fabrique pas de vainqueur. Présente les conséquences, recommande une option si les critères la favorisent, puis laisse la décision à l'utilisateur. Si le contrat est ambigu ou contradictoire, le problème peut être la spec plutôt que l'implémentation.

## Étape 5 — Verdict sans complaisance

Choisis un seul verdict :

- **À reprendre** : au moins un défaut bloquant confirmé ou une affirmation centrale démentie.
- **Tient, avec réserves** : aucun bloquant confirmé, mais un défaut majeur confirmé ou une incertitude majeure subsiste.
- **Rien de cassé dans le périmètre vérifié** : aucun défaut bloquant ou majeur confirmé après les attaques tentées ; les limites et l'hypothèse la plus fragile sont explicites.

Gravité :
- **Bloquant** : objectif principal non atteint, résultat faux important, perte de données, faille, effet irréversible non maîtrisé.
- **Majeur** : casse dans un scénario réaliste, perte répétée, coût important ou risque d'exploitation significatif.
- **Mineur** : gêne réelle mais limitée.
- Le style, le nommage et les remarques qu'un linter peut détecter ne sont pas des constats majeurs.

Juge la gravité par rapport au contrat. Si le contrat lui-même est fautif, dis-le explicitement au lieu de reprocher à l'implémentation de l'avoir suivi.

Un constat confirmé doit toujours avoir une correction proposée ou une prochaine étape concrète.

## Étape 6 — Plan de reprise et validation

Classe les actions dans cet ordre :
1. bloquants ;
2. sécurité et effets irréversibles ;
3. défauts majeurs ;
4. incertitudes à trancher ;
5. améliorations mineures utiles.

Pour chaque action, indique le constat lié, la correction ou l'investigation proposée, le test de non-régression et les dépendances. **N'applique aucune correction non triviale sans l'accord de l'utilisateur.**

## Étape 7 — Produire le rapport et le fichier de relais

Si l'accès aux fichiers le permet, crée `revues/REVUE_AAAA-MM-JJ.md`. Sinon, fournis le contenu prêt à enregistrer.

Le rapport contient :
- verdict et périmètre ;
- affirmations vérifiées, démenties ou invérifiables ;
- constats confirmés et preuves ;
- constats non reproduits écartés ;
- attaques tentées ;
- désaccords et décisions qui reviennent à l'utilisateur ;
- hypothèse la plus fragile ;
- plan de reprise.

Format concis pour la réponse :

```markdown
**Verdict :** À reprendre / Tient, avec réserves / Rien de cassé dans le périmètre vérifié.

**Affirmations contrôlées**
- Démentie — A2 : ... Preuve : ...
- Confirmée — A3 : ... Preuve : ...

**Constats confirmés**
1. **Bloquant —** emplacement : scénario, résultat observé et correction proposée.
2. **Majeur —** ...

**Écartés après vérification :** N constats non reproduits.
**Attaques tentées :** ...
**Désaccord à trancher :** options et conséquences, s'il y en a.
**Hypothèse la plus fragile :** ...
**Prochaine étape :** ...
```

### Fichier de relais

Si la revue est déclenchée par une longue session, des contradictions ou des erreurs répétées, crée `revues/RELAIS_AAAA-MM-JJ.md`. Il doit contenir uniquement :
- objectif documenté ;
- état réel vérifié et preuves ;
- affirmations démenties ;
- décisions encore ouvertes ;
- plan de reprise ;
- chemins des fichiers importants ;
- commandes de vérification et leurs résultats.

N'y transporte pas des croyances de la session comme si elles étaient des faits. Propose de reprendre dans une nouvelle conversation à partir du relais.

## Relations avec les autres skills

- **`spec-beton`** définit ce que le workflow doit faire. Une ambiguïté de spec retourne à l'utilisateur ; la revue ne l'invente pas.
- **`doubt-driven-development`** challenge des décisions précises en cours de travail. Cette revue examine plus largement le projet et les affirmations de Claude.
- **Sans les deux autres** : crée le dossier neutre, lance les trois rôles, vérifie les constats et rends le même verdict.

## Erreurs à éviter

- Donner la conversation ou le raisonnement de Claude aux relecteurs.
- Traiter un vote majoritaire comme une preuve.
- Inventer une affirmation à réfuter ou fabriquer un défaut pour remplir un quota.
- Rapporter un constat majeur sans le revérifier.
- Adoucir un défaut confirmé ou exagérer un défaut hors contrat.
- Dire « LGTM », « solide » ou « rien d'alarmant » sans détailler les attaques tentées.
- Confondre une préférence d'architecture avec un défaut.
- Corriger le projet avant que l'utilisateur ait accepté le plan de reprise.
- Présenter comme indépendante une revue menée par le même agent sans séparation de contexte.
