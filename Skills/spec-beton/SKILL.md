---
name: spec-beton
description: >-
  Interroge l'utilisateur avant de construire un workflow n8n lorsque le besoin,
  les règles métier ou les cas limites sont incomplets. Pose des lots de 3 à 5
  questions concrètes, chacune avec une recommandation et ses conséquences, puis
  produit une spécification testable avec hypothèses visibles, erreurs, reprises,
  données et critères d'acceptation. Utiliser avant de créer ou modifier un
  workflow n8n dès qu'une ambiguïté peut changer le résultat, le périmètre ou le
  risque. Fonctionne seul ; peut servir de contrat à doubt-driven-development et
  hostile-review.
---

# Spec béton — cadrer avant de construire

## Mission

Transformer une demande de workflow n8n en contrat que l'on peut construire et tester sans deviner les règles métier. Le but n'est pas de produire vite un document : il est de révéler les décisions cachées avant qu'elles deviennent des choix techniques silencieux.

**Ordre de priorité : problème métier → résultat attendu → règles observables → cas limites → conception technique.** Ne propose pas l'architecture n8n détaillée avant que le besoin et le périmètre soient suffisamment clairs.

Ce skill fonctionne indépendamment des deux autres. Si les skills `doubt-driven-development` ou `hostile-review` sont présents, la spécification produite devient leur contrat de référence, sans les rendre obligatoires.

## Quand l'utiliser

- L'utilisateur demande de créer, corriger ou étendre un workflow n8n et des règles importantes manquent.
- Il dit « pose-moi les questions avant de commencer », « fais la spec », « qu'est-ce que j'ai oublié ? » ou équivalent.
- Une description paraît précise techniquement mais ne décrit pas le problème à résoudre.
- Un workflow existant doit être audité par rapport à son comportement attendu.

Ne lance pas un interrogatoire complet pour une modification mécanique, minuscule et sans ambiguïté. Si l'utilisateur demande explicitement d'aller vite, fais un cadrage express et signale les hypothèses non vérifiées.

## Principes non négociables

1. **Lis avant de demander.** Examine les fichiers, exports JSON n8n, exemples d'entrées/sorties, documentation et règles déjà fournies. Ne demande pas une information disponible dans les sources accessibles.
2. **Sépare fait, déclaration et hypothèse.** Un export ou une exécution observée peut prouver un comportement ; le brief exprime l'intention, pas la preuve que le workflow actuel la respecte.
3. **Ne devine pas une décision métier.** Recommande une option, mais laisse l'utilisateur trancher toute question bloquante.
4. **Une question doit changer quelque chose.** Si la réponse ne change ni une règle, ni un test, ni un risque, ni le périmètre, ne la pose pas.
5. **Les hypothèses restent visibles.** Tout seuil, délai, volume, fuseau ou règle non fourni est marqué comme hypothèse, jamais présenté comme un fait.
6. **Ne construis pas avant le feu vert.** La fin de l'interrogatoire n'autorise pas à elle seule la construction. Présente la spécification et demande une validation explicite.
7. **Ne crée aucun effet réel pendant le cadrage.** Les tests éventuels utilisent des données d'essai et des destinations inoffensives.

## Déroulé

### 1. Comprendre le problème avant la solution

En trois lignes au plus, reformule :
- le problème concret et la personne/processus touché ;
- le résultat mesurable attendu ;
- ce qui manque pour garantir que tu as compris.

Si l'utilisateur nomme déjà une solution (« je veux un webhook qui envoie un email »), demande si cette solution est imposée ou si le besoin métier reste ouvert, mais ne bloque pas sur ce point si le choix est déjà explicite.

### 2. Examiner l'existant

Si le projet contient un workflow n8n, inspecte l'export et relève les faits utiles :
- déclencheur, fréquence, fuseau horaire et conditions de lancement ;
- nœuds, branches, filtres, expressions et dépendances ;
- données entrantes/sortantes, identifiants et règles de dédoublonnage ;
- gestion des erreurs, reprises, délais, pagination, limites API ;
- credentials référencés, sans jamais afficher ou recopier leurs secrets ;
- effets externes : envoi, création, suppression, paiement ou écriture.

N'affirme pas qu'un nœud, un champ ou un comportement existe sans l'avoir constaté. Si l'export est absent ou incomplet, indique ce qui reste inconnu.

### 3. Interroger par lots

Pose **3 à 5 questions par message**, classées par criticité puis par impact. Ne pose que les questions dont les prérequis sont suffisamment clairs.

Chaque question contient :
- **la décision précise** à prendre ;
- un exemple concret, si cela rend l'enjeu visible ;
- 2 à 4 options réalistes avec leur conséquence ;
- une option recommandée, explicitement étiquetée **Recommandé** ;
- une phrase indiquant ce qui sera retenu si l'utilisateur accepte la recommandation.

Exemple :

**Q1 — Bloquant : que faire si le même événement arrive deux fois ?**

Un webhook peut être rejoué après un délai d'attente, même si le premier traitement a réussi. Sans règle de dédoublonnage, le même client pourrait recevoir deux messages.

- **A. Dédupliquer avec un identifiant stable de l'événement (Recommandé)** — évite les doublons si l'identifiant est fiable.
- B. Dédupliquer sur l'adresse email — plus simple, mais peut fusionner deux événements légitimes.
- C. Traiter chaque livraison — aucune logique supplémentaire, mais doublons possibles.

→ Je retiens A si tu confirmes cette recommandation.

N'assemble pas plusieurs décisions sans lien dans une même question. Les questions ouvertes servent à comprendre le problème ; les choix servent à arbitrer.

### 4. Prioriser les questions

Classe chaque question :
- **BLOQUANT** : deux réponses produisent des workflows différents ; impossible de spécifier correctement sans réponse.
- **STRUCTURANT** : change plusieurs règles, le coût, les dépendances ou le périmètre.
- **MODALITÉ** : détail local pour lequel une hypothèse raisonnable peut être proposée.

Ne remplace jamais une réponse bloquante par une supposition. Pour une modalité, propose une hypothèse par défaut, étiquetée `H1`, `H2`, etc., et demande qu'elle soit confirmée au moment de valider la spec.

### 5. Couvrir les cas propres à n8n

Selon le workflow, examine au minimum les catégories pertinentes suivantes. Ne force pas les catégories sans rapport avec le besoin.

- **Déclenchement** : webhook, polling, planification, fuseau, heure d'été/hiver, jours non ouvrés, événements manqués.
- **Données** : champ absent/null/vide, zéro, types inattendus, encodage, dates, identifiant stable, données sensibles.
- **Flux n8n** : zéro item, un item, plusieurs items, branche non empruntée, fusion de branches, données appariées (`paired items`), item linking et expressions dépendant du nœud précédent.
- **API et intégrations** : pagination, limite de débit, timeout, 4xx/5xx, authentification expirée, schéma modifié, réponse partielle.
- **Fiabilité** : retry, double exécution, idempotence, reprise après échec partiel, concurrence, ordre des événements.
- **Effets externes** : email ou message envoyé, création/suppression de ligne, paiement, écriture en production, appel non réversible.
- **Exploitation** : alertes, journalisation utile sans secrets, responsable d'un échec, procédure de reprise, volume et durée.
- **Accès et confidentialité** : moindre privilège, exposition des données, conservation, masquage des secrets.

Ne présume pas qu'un retry est sûr : il peut répéter un effet externe. Distingue « réessayer la requête » de « rejouer tout le workflow ».

### 6. Refermer chaque lot

Après les réponses :
- récapitule les décisions confirmées et les hypothèses encore ouvertes ;
- indique les questions reportées et pourquoi ;
- mets à jour la liste des exigences couvertes ;
- poursuis avec le lot suivant.

Si une réponse contredit une réponse antérieure, le brief ou l'existant, signale précisément la contradiction et demande quel élément fait foi. Ne la résous pas en silence.

Tous les trois lots, ou lorsqu'il ne reste que des modalités, demande si l'utilisateur préfère continuer l'interrogatoire ou accepter les hypothèses proposées.

### 7. Produire la spécification

Si le dépôt contient déjà une convention de documentation, suis-la. Sinon, propose de créer `specs/<slug>/SPEC_<slug>.md` et, si les décisions sont nombreuses, `specs/<slug>/JOURNAL_<slug>.md`. Ne crée pas ces fichiers sans accès au système de fichiers ; si tu ne peux pas écrire, fournis leur contenu prêt à enregistrer.

La spécification contient :

1. **Objectif métier** — problème, utilisateurs/processus concernés et résultat attendu.
2. **Périmètre** — inclus, exclus et dépendances.
3. **Entrées et sorties** — source, schéma, champs obligatoires, identifiants, formats et destination.
4. **Règles métier numérotées** — observables et formulées sans imposer inutilement une architecture.
5. **Parcours nominal** — de l'événement initial au résultat attendu.
6. **Cas limites et échecs** — entrée vide, doublon, panne, timeout, réponse partielle, reprise et branche sans résultat.
7. **Effets externes et sécurité** — ce qui peut être écrit, envoyé ou supprimé ; environnements autorisés.
8. **Critères d'acceptation** — tests vérifiables, avec résultat attendu.
9. **Hypothèses** — numérotées, justifiées et à confirmer.
10. **Points ouverts** — question, criticité et personne qui doit trancher.
11. **Contraintes d'exploitation** — fréquence, volume, délai, coût ou alertes si pertinents.
12. **Statut** — `proposé`, `validé` ou `à compléter`, date et validation explicite.

Chaque règle doit permettre de répondre à : « quelle entrée ou situation déclenche cette règle, et quel résultat doit-on observer ? »

### 8. Contrôler la spec

Avant de la présenter :
- vérifie que chaque question posée a une réponse, une hypothèse visible, un point ouvert ou une exclusion ;
- vérifie que les règles ne se contredisent pas ;
- vérifie que chaque exigence a au moins un critère d'acceptation ;
- vérifie les cas limites pertinents, notamment les doublons, le zéro item, les reprises et les effets externes ;
- contrôle les références aux fichiers, champs et nœuds cités ;
- distingue ce qui est confirmé par une source de ce qui est seulement déclaré ou supposé.

Si tu disposes d'un environnement d'exécution, crée ou utilise un contrôle simple et exécute-le. Ne prétends pas qu'un script a été exécuté si ce n'est pas le cas. Un contrôle automatisé ne remplace pas la relecture logique.

### 9. Présenter et demander validation

Termine par :
- un verdict : **constructible**, **constructible avec réserves**, ou **bloqué** ;
- les hypothèses et points ouverts restants ;
- les risques principaux ;
- le chemin du fichier créé ou le document prêt à enregistrer ;
- une demande de validation explicite.

**Ne commence pas à construire le workflow tant que l'utilisateur ne l'a pas demandé ou n'a pas validé explicitement la spec.**

## Mode express

Si l'utilisateur veut aller vite, pose seulement les questions à impact élevé, formule les autres choix comme hypothèses visibles, puis fournis une spec courte. Les questions touchant à la sécurité, aux données personnelles, à l'argent ou aux effets irréversibles restent bloquantes.

## Format du compte rendu

```markdown
**Verdict :** constructible / constructible avec réserves / bloqué

**Décisions confirmées**
- R01 — ...

**Hypothèses à confirmer**
- H1 — ...

**Points bloquants**
- P1 — Question ; décisionnaire : ...

**Tests d'acceptation**
- T01 — Étant donné ... quand ... alors ...

**Prochaine étape**
- Valider la spec avant la construction.
```

## Erreurs à éviter

- Concevoir le workflow avant d'avoir établi le besoin.
- Poser une longue liste de questions sans recommandation.
- Demander des faits déjà présents dans les fichiers ou facilement vérifiables.
- Inventer un comportement d'API ou une capacité n8n.
- Oublier les retries, les doublons, les fuseaux horaires, les items vides ou les échecs partiels.
- Confondre « le workflow s'exécute » avec « il satisfait la règle métier ».
- Masquer les hypothèses dans un paragraphe ou déclarer une spec validée sans accord explicite.
